import { useState } from "react";
import { ArrowLeft, Plus, ReceiptText } from "lucide-react";
import { money } from "../utils/format";
import { dateText } from "../utils/format";

const emptyRecord = {
  recipient: "",
  identifier: "",
  amount: "",
  type: "send",
  category: "Other",
  note: "",
};

function TransactionManagerPage({
  transactions,
  onBack,
  onCreate,
  onEdit,
  onDelete,
}) {
  const [record, setRecord] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function startNew() {
    setRecord({ ...emptyRecord });
    setIsNew(true);
    setError("");
  }

  function startEdit(item) {
    setRecord({ ...item, amount: String(item.amount) });
    setIsNew(false);
    setError("");
  }

  function update(key, value) {
    setRecord((current) => ({ ...current, [key]: value }));
  }

  async function save(event) {
    event.preventDefault();
    const amount = Number(record.amount);
    if (!record.recipient.trim() || !Number.isFinite(amount) || amount <= 0) {
      setError("Enter a name and an amount greater than zero.");
      return;
    }
    setSaving(true);
    setError("");
    const changes = {
      recipient: record.recipient.trim(),
      identifier: record.identifier.trim(),
      amount,
      type: record.type,
      category: record.category.trim() || "Other",
      note: record.note.trim(),
    };
    try {
      if (isNew) await onCreate(changes);
      else await onEdit(record.id, changes);
      setRecord(null);
      setIsNew(false);
    } catch (issue) {
      setError(issue.message || "Could not save this transaction.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete the transaction with ${item.recipient}?`)) return;
    try {
      await onDelete(item.id);
      setError("");
    } catch (issue) {
      setError(issue.message || "Could not delete this transaction.");
    }
  }

  return (
    <main className="page-wrap transaction-manager-page">
      <button className="back-button" onClick={onBack} type="button">
        <ArrowLeft size={18} /> Back to settings
      </button>
      <section className="activity-heading">
        <div className="eyebrow">ACCOUNT PREFERENCES</div>
        <h1>Manage transaction history</h1>
        <p>Add, edit, or remove saved transactions. Changes update the displayed balance.</p>
      </section>

      {error && <p className="form-error settings-error" role="alert">{error}</p>}

      {record ? (
        <form className="settings-card setup-form transaction-editor" onSubmit={save}>
          <h2>{isNew ? "Add transaction" : "Edit transaction"}</h2>
          <label>
            Person or merchant
            <input value={record.recipient} onChange={(event) => update("recipient", event.target.value)} />
          </label>
          <div className="form-row">
            <label>
              Type
              <select value={record.type} onChange={(event) => update("type", event.target.value)}>
                <option value="send">Sent</option>
                <option value="receive">Received</option>
                <option value="bill">Bill / recharge</option>
              </select>
            </label>
            <label>
              Amount (INR)
              <input type="number" min="0.01" step="0.01" value={record.amount} onChange={(event) => update("amount", event.target.value)} />
            </label>
          </div>
          <div className="form-row">
            <label>
              Category
              <input value={record.category} onChange={(event) => update("category", event.target.value)} />
            </label>
            <label>
              UPI ID or phone
              <input value={record.identifier} onChange={(event) => update("identifier", event.target.value)} />
            </label>
          </div>
          <label>
            Note
            <input value={record.note} onChange={(event) => update("note", event.target.value)} />
          </label>
          <div className="settings-actions">
            <button className="primary-btn" disabled={saving}>
              {saving ? "Saving…" : "Save transaction"}
            </button>
            <button className="secondary-btn" type="button" onClick={() => setRecord(null)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button className="primary-btn add-transaction-button" onClick={startNew} type="button">
          <Plus size={18} /> Add transaction
        </button>
      )}

      <section className="managed-transactions" aria-label="Transaction records">
        {transactions.length ? transactions.map((item) => (
          <article className="managed-transaction" key={item.id}>
            <span className={`transaction-icon ${item.type}`}><ReceiptText size={18} /></span>
            <div className="managed-transaction-info">
              <strong>{item.recipient}</strong>
              <span>{item.category} · {dateText(item.createdAt)}</span>
            </div>
            <strong className={item.type === "receive" ? "credit" : "debit"}>
              {item.type === "receive" ? "+" : "−"}{money(item.amount)}
            </strong>
            <div className="managed-transaction-actions">
              <button className="secondary-btn" type="button" onClick={() => startEdit(item)}>Edit</button>
              <button className="record-delete" type="button" onClick={() => remove(item)}>Delete</button>
            </div>
          </article>
        )) : (
          <section className="empty-activity">
            <ReceiptText size={22} />
            <strong>No transactions yet</strong>
            <p>Add a transaction to start your history.</p>
          </section>
        )}
      </section>
    </main>
  );
}

export default TransactionManagerPage;
