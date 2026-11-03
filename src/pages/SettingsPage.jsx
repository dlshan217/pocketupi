import { useState } from "react";
import { ArrowLeft, Database, History, Info, LockKeyhole, Palette, UserRound } from "lucide-react";
import { hashPin } from "../utils/security";
import Brand from "../components/Brand";

function SettingsPage({
  account,
  transactions,
  groups,
  theme,
  pinRecord,
  onBack,
  onThemeChange,
  onAccountSave,
  onPinSave,
  onPinDisable,
  onManageHistory,
  onAbout,
  onExport,
  onImport,
  onReset,
  onLock,
}) {
  const [form, setForm] = useState({
    holderName: account.holderName,
    bankName: account.bankName,
    accountIdentifier: account.accountIdentifier,
    demoUpiId: account.demoUpiId,
    phoneNumber: account.phoneNumber || "",
    profileImage: account.profileImage || "",
    upiQrImage: account.upiQrImage || "",
    balance: String(account.balance),
  });
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const update = (key) => (event) =>
    setForm((old) => ({ ...old, [key]: event.target.value }));
  async function readProfileImage(field, file) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Choose an image smaller than 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setForm((current) => ({ ...current, [field]: reader.result }));
    reader.readAsDataURL(file);
  }
  async function saveProfile(event) {
    event.preventDefault();
    const balance = Number(form.balance);
    if (
      !form.holderName.trim() ||
      !form.bankName.trim() ||
      !form.accountIdentifier.trim() ||
      !form.demoUpiId.trim() ||
      !Number.isFinite(balance) ||
      balance < 0
    ) {
      setError(
        "Complete each account field and enter a balance of zero or more.",
      );
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onAccountSave({
        ...account,
        ...form,
        holderName: form.holderName.trim(),
        bankName: form.bankName.trim(),
        accountIdentifier: form.accountIdentifier.trim(),
        demoUpiId: form.demoUpiId.trim(),
        balance,
      });
      setMessage("Account details saved.");
    } catch (issue) {
      setError(issue.message || "Could not save your account details.");
    } finally {
      setSaving(false);
    }
  }
  async function setPin(event) {
    event.preventDefault();
    if (!/^\d{4,8}$/.test(newPin)) {
      setError("Choose a PIN with 4 to 8 digits.");
      return;
    }
    if (newPin !== confirmPin) {
      setError("The PIN entries do not match.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const salt = crypto.randomUUID();
      await onPinSave({
        salt,
        hash: await hashPin(newPin, salt),
        length: newPin.length,
      });
      setNewPin("");
      setConfirmPin("");
      setMessage("PIN enabled.");
    } catch (issue) {
      setError(issue.message || "Could not enable your PIN.");
    } finally {
      setSaving(false);
    }
  }
  async function changePin(event) {
    event.preventDefault();
    if (
      !pinRecord ||
      (await hashPin(currentPin, pinRecord.salt)) !== pinRecord.hash
    ) {
      setError("Current PIN is incorrect.");
      return;
    }
    if (!/^\d{4,8}$/.test(newPin) || newPin !== confirmPin) {
      setError("Enter and confirm a matching 4–8 digit PIN.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const salt = crypto.randomUUID();
      await onPinSave({
        salt,
        hash: await hashPin(newPin, salt),
        length: newPin.length,
      });
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
      setMessage("PIN changed.");
    } catch (issue) {
      setError(issue.message || "Could not change your PIN.");
    } finally {
      setSaving(false);
    }
  }
  async function backup() {
    try {
      const data = await onExport();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `PocketUPI-backup-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setMessage("Backup downloaded.");
      setError("");
    } catch (issue) {
      setError(issue.message || "Could not create a backup.");
    }
  }
  async function restore(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await onImport(JSON.parse(await file.text()));
      setMessage("Backup restored.");
      setError("");
    } catch (issue) {
      setError(issue.message || "Could not read this backup.");
    } finally {
      event.target.value = "";
    }
  }
  async function reset() {
    if (
      window.confirm(
        "Reset PocketUPI and permanently remove locally saved data? Export a backup first if you want to keep it.",
      )
    )
      try {
        await onReset();
      } catch (issue) {
        setError(issue.message || "Could not reset saved data.");
      }
  }
  async function disablePin() {
    setSaving(true);
    setError("");
    try {
      await onPinDisable();
      setMessage("PIN turned off.");
    } catch (issue) {
      setError(issue.message || "Could not turn off your PIN.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <main className="page-wrap settings-page">
      <header className="settings-topbar">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>
        <Brand />
        <span className="settings-top-avatar">
          {account.profileImage ? <img src={account.profileImage} alt={`${account.holderName} profile`} /> : account.holderName.slice(0, 1).toUpperCase()}
        </span>
      </header>
      <section className="activity-heading">
        <div className="eyebrow">ACCOUNT PREFERENCES</div>
        <h1>Settings</h1>
        <p>Update your account, security, appearance, and saved records.</p>
      </section>
      {message && <p className="settings-message">{message}</p>}
      {error && <p className="form-error settings-error">{error}</p>}
      <details className="settings-card settings-accordion" open>
        <summary><span className="settings-summary-icon"><UserRound size={18} /></span><span className="settings-summary-copy"><strong>Account & profile</strong><small>Your details, picture, and payment QR</small></span></summary>
        <form className="setup-form" onSubmit={saveProfile}>
          <label>
            Account holder
            <input value={form.holderName} onChange={update("holderName")} />
          </label>
          <label>
            Bank name
            <input value={form.bankName} onChange={update("bankName")} />
          </label>
          <div className="form-row">
            <label>
              Account number
              <input
                value={form.accountIdentifier}
                onChange={update("accountIdentifier")}
              />
            </label>
            <label>
              UPI ID
              <input value={form.demoUpiId} onChange={update("demoUpiId")} />
            </label>
          </div>
          <label>
            Phone number (optional)
            <input
              value={form.phoneNumber}
              onChange={update("phoneNumber")}
              placeholder="Phone number"
            />
          </label>
          <label>
            Set account balance (INR)
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.balance}
              onChange={update("balance")}
            />
          </label>
          <label>
            Profile picture
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                readProfileImage("profileImage", event.target.files?.[0])
              }
            />
          </label>
          <label>
            Your existing QR image (display only)
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                readProfileImage("upiQrImage", event.target.files?.[0])
              }
            />
          </label>
          {form.profileImage && (
            <img
              className="settings-image-preview"
              src={form.profileImage}
              alt="Profile preview"
            />
          )}
          {form.upiQrImage && (
            <img
              className="settings-image-preview qr-preview"
              src={form.upiQrImage}
              alt="QR preview"
            />
          )}
          <button className="primary-btn" disabled={saving}>
            {saving ? "Saving…" : "Save account details"}
          </button>
        </form>
        <p className="settings-help">
          Changing the displayed balance does not create a transaction.
        </p>
      </details>
      <details className="settings-card settings-accordion">
        <summary><span className="settings-summary-icon"><Palette size={18} /></span><span className="settings-summary-copy"><strong>Appearance</strong><small>Choose light, dark, or device theme</small></span></summary>
        <label className="settings-choice">
          Theme
          <select
            value={theme}
            onChange={(event) => onThemeChange(event.target.value)}
          >
            <option value="system">Use device setting</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </details>
      <details className="settings-card settings-accordion">
        <summary><span className="settings-summary-icon"><LockKeyhole size={18} /></span><span className="settings-summary-copy"><strong>PIN & app lock</strong><small>Manage your PIN and app access</small></span></summary>
        {pinRecord ? (
          <>
            <p className="settings-help">
              PIN enabled. It is stored locally as a salted hash.
            </p>
            <form className="setup-form" onSubmit={changePin}>
              <label>
                Current PIN
                <input
                  type="password"
                  inputMode="numeric"
                  value={currentPin}
                  onChange={(event) => setCurrentPin(event.target.value)}
                />
              </label>
              <div className="form-row">
                <label>
                  New PIN
                  <input
                    type="password"
                    inputMode="numeric"
                    value={newPin}
                    onChange={(event) => setNewPin(event.target.value)}
                  />
                </label>
                <label>
                  Confirm new PIN
                  <input
                    type="password"
                    inputMode="numeric"
                    value={confirmPin}
                    onChange={(event) => setConfirmPin(event.target.value)}
                  />
                </label>
              </div>
              <button className="secondary-btn" disabled={saving}>
                {saving ? "Saving…" : "Change PIN"}
              </button>
            </form>
            <div className="settings-actions">
              <button
                className="secondary-btn"
                onClick={onLock}
                disabled={saving}
              >
                Lock app now
              </button>
              <button
                className="secondary-btn"
                onClick={disablePin}
                disabled={saving}
              >
                Turn off PIN
              </button>
            </div>
          </>
        ) : (
          <form className="setup-form" onSubmit={setPin}>
            <div className="form-row">
              <label>
                New 4–8 digit PIN
                <input
                  type="password"
                  inputMode="numeric"
                  value={newPin}
                  onChange={(event) => setNewPin(event.target.value)}
                />
              </label>
              <label>
                Confirm PIN
                <input
                  type="password"
                  inputMode="numeric"
                  value={confirmPin}
                  onChange={(event) => setConfirmPin(event.target.value)}
                />
              </label>
            </div>
            <button className="secondary-btn" disabled={saving}>
              {saving ? "Saving…" : "Set PIN"}
            </button>
          </form>
        )}
      </details>
      <details className="settings-card settings-accordion">
        <summary><span className="settings-summary-icon"><History size={18} /></span><span className="settings-summary-copy"><strong>Activity history</strong><small>Review and organize saved transactions</small></span></summary>
        <p className="settings-help">
          Add, update, and remove the saved transactions on a separate page.
        </p>
        <button
          className="secondary-btn manage-history-button"
          type="button"
          onClick={onManageHistory}
        >
          Manage transaction history ({transactions.length})
        </button>
      </details>
      <details className="settings-card settings-accordion">
        <summary><span className="settings-summary-icon"><Database size={18} /></span><span className="settings-summary-copy"><strong>Backup & restore</strong><small>Save or restore your local app data</small></span></summary>
        <p className="settings-help">
          Backup includes your account, activity, groups, theme, and PIN
          settings.
        </p>
        <div className="settings-actions">
          <button className="secondary-btn" onClick={backup}>
            Export JSON backup
          </button>
          <label className="file-button">
            Import JSON backup
            <input
              type="file"
              accept="application/json,.json"
              onChange={restore}
            />
          </label>
        </div>
      </details>
      <details className="settings-card settings-accordion">
        <summary><span className="settings-summary-icon"><Info size={18} /></span><span className="settings-summary-copy"><strong>About PocketUPI</strong><small>The app, its story, and social links</small></span></summary>
        <p className="settings-help">See what PocketUPI is about and find Dilshan around the internet.</p>
        <button className="secondary-btn settings-about-button" type="button" onClick={onAbout}>
          Read about PocketUPI
        </button>
      </details>
      <details className="settings-card settings-accordion">
        <summary><span className="settings-summary-icon"><Database size={18} /></span><span className="settings-summary-copy"><strong>Storage & reset</strong><small>Review saved data or start fresh</small></span></summary>
        <p className="settings-help">
          Currently stored on this device: {transactions.length} transactions
          and {groups.length} group expenses.
        </p>
        <button className="danger-btn" onClick={reset}>
          Reset PocketUPI data
        </button>
      </details>
    </main>
  );
}

export default SettingsPage;
