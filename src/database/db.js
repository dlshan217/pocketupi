import { openDB } from 'idb'

const DB_NAME = 'pocketupi-local'
const DB_VERSION = 1

export const getDatabase = () => openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('accounts')) db.createObjectStore('accounts', { keyPath: 'id' })
    if (!db.objectStoreNames.contains('transactions')) {
      const store = db.createObjectStore('transactions', { keyPath: 'id' })
      store.createIndex('createdAt', 'createdAt')
    }
    if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'key' })
    if (!db.objectStoreNames.contains('groups')) db.createObjectStore('groups', { keyPath: 'id' })
  },
})

export async function getAccount() {
  const db = await getDatabase()
  return db.get('accounts', 'primary')
}

export async function saveAccount(account) {
  const db = await getDatabase()
  await db.put('accounts', { ...account, id: 'primary', updatedAt: new Date().toISOString() })
}

export async function getTransactions() {
  const db = await getDatabase()
  return (await db.getAll('transactions')).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function recordTransaction(account, entry) {
  const db = await getDatabase()
  const tx = db.transaction(['accounts', 'transactions'], 'readwrite')
  const accountStore = tx.objectStore('accounts')
  const transactionStore = tx.objectStore('transactions')
  const latest = await accountStore.get('primary')
  if (!latest) { tx.abort(); throw new Error('Demo account was not found.') }
  const amount = Number(entry.amount)
  const nextBalance = entry.type === 'receive' ? Number(latest.balance) + amount : Number(latest.balance) - amount
  if (!Number.isFinite(amount) || amount <= 0) { tx.abort(); throw new Error('Enter an amount greater than zero.') }
  if (nextBalance < 0) { tx.abort(); throw new Error('The demo balance is too low for this transfer.') }
  const updated = { ...latest, balance: nextBalance, updatedAt: new Date().toISOString() }
  const transaction = { ...entry, id: crypto.randomUUID(), amount, createdAt: new Date().toISOString(), status: 'SIMULATED' }
  await accountStore.put(updated)
  await transactionStore.add(transaction)
  await tx.done
  return { account: updated, transaction }
}

export async function getGroups() {
  const db = await getDatabase()
  return (await db.getAll('groups')).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function saveGroup(group) {
  const db = await getDatabase()
  const record = { ...group, id: group.id || crypto.randomUUID(), createdAt: group.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() }
  await db.put('groups', record)
  return record
}
export async function getSetting(key) {
  const db = await getDatabase()
  return (await db.get('settings', key))?.value
}

export async function saveSetting(key, value) {
  const db = await getDatabase()
  await db.put('settings', { key, value })
}

export async function exportData() {
  const db = await getDatabase()
  return { format: 'PocketUPI-local-backup', version: 1, exportedAt: new Date().toISOString(), account: await db.get('accounts', 'primary') || null, transactions: await db.getAll('transactions'), groups: await db.getAll('groups'), settings: await db.getAll('settings') }
}

export async function importData(data) {
  if (!data || data.format !== 'PocketUPI-local-backup' || !data.account || !Array.isArray(data.transactions) || !Array.isArray(data.groups)) throw new Error('This file is not a valid PocketUPI backup.')
  const db = await getDatabase()
  const tx = db.transaction(['accounts', 'transactions', 'groups', 'settings'], 'readwrite')
  await Promise.all(['accounts', 'transactions', 'groups', 'settings'].map((name) => tx.objectStore(name).clear()))
  await tx.objectStore('accounts').put({ ...data.account, id: 'primary' })
  for (const item of data.transactions) if (item && typeof item.id === 'string' && Number(item.amount) > 0) await tx.objectStore('transactions').put(item)
  for (const item of data.groups) if (item && typeof item.id === 'string' && Array.isArray(item.participants)) await tx.objectStore('groups').put(item)
  for (const item of Array.isArray(data.settings) ? data.settings : []) if (item && typeof item.key === 'string') await tx.objectStore('settings').put(item)
  await tx.done
  return { account: await db.get('accounts', 'primary'), transactions: await getTransactions(), groups: await getGroups() }
}

export async function resetData() {
  const db = await getDatabase()
  const tx = db.transaction(['accounts', 'transactions', 'groups', 'settings'], 'readwrite')
  await Promise.all(['accounts', 'transactions', 'groups', 'settings'].map((name) => tx.objectStore(name).clear()))
  await tx.done
}
export async function editTransaction(transactionId, changes) {
  const db = await getDatabase()
  const tx = db.transaction(['accounts', 'transactions'], 'readwrite')
  const accounts = tx.objectStore('accounts')
  const entries = tx.objectStore('transactions')
  const account = await accounts.get('primary')
  const previous = await entries.get(transactionId)
  if (!account || !previous) { tx.abort(); throw new Error('The demo record could not be found.') }
  const amount = Number(changes.amount)
  if (!Number.isFinite(amount) || amount <= 0) { tx.abort(); throw new Error('Amount must be greater than zero.') }
  const oldEffect = previous.type === 'receive' ? Number(previous.amount) : -Number(previous.amount)
  const newEffect = changes.type === 'receive' ? amount : -amount
  const balance = Number(account.balance) - oldEffect + newEffect
  if (balance < 0) { tx.abort(); throw new Error('This edit would make the demo balance negative.') }
  const updatedAccount = { ...account, balance, updatedAt: new Date().toISOString() }
  const updatedTransaction = { ...previous, ...changes, amount, updatedAt: new Date().toISOString(), status: 'SIMULATED' }
  await accounts.put(updatedAccount)
  await entries.put(updatedTransaction)
  await tx.done
  return { account: updatedAccount, transaction: updatedTransaction }
}

export async function deleteTransaction(transactionId) {
  const db = await getDatabase()
  const tx = db.transaction(['accounts', 'transactions'], 'readwrite')
  const accounts = tx.objectStore('accounts')
  const entries = tx.objectStore('transactions')
  const account = await accounts.get('primary')
  const previous = await entries.get(transactionId)
  if (!account || !previous) { tx.abort(); throw new Error('The demo record could not be found.') }
  const balance = previous.type === 'receive' ? Number(account.balance) - Number(previous.amount) : Number(account.balance) + Number(previous.amount)
  if (balance < 0) { tx.abort(); throw new Error('This record cannot be removed because the demo balance would become negative.') }
  await accounts.put({ ...account, balance, updatedAt: new Date().toISOString() })
  await entries.delete(transactionId)
  await tx.done
  return getAccount()
}
