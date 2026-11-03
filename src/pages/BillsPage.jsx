import { useState } from "react";
import { ArrowLeft, ChevronRight, Receipt } from "lucide-react";
import { money } from "../utils/format";

function BillsPage({ account, onBack, onSubmit }) {
  const [service, setService] = useState("Mobile recharge");
  const [provider, setProvider] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (!provider.trim() || !identifier.trim()) {
      setError("Enter a provider name and reference.");
      return;
    }
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (Number(amount) > Number(account.balance)) {
      setError("There is not enough available balance for this payment.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        type: "bill",
        amount: Number(amount),
        recipient: provider.trim(),
        identifier: identifier.trim(),
        category: "Bills",
        note: service,
      });
    } catch (issue) {
      setError(issue.message || "Could not save this payment.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <main className="page-wrap">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={18} /> Back
      </button>
      <section className="form-panel">
        <div className="form-hero">
          <div className="form-hero-icon">
            <Receipt size={22} />
          </div>
        </div>
        <div className="eyebrow">BILLS & RECHARGE</div>
        <h1>Pay a bill</h1>
        <p className="muted">
          Practice mode only. No bill payment or recharge is submitted.
        </p>
        <form className="setup-form" onSubmit={submit}>
          <label>
            Service
            <select
              value={service}
              onChange={(event) => setService(event.target.value)}
            >
              <option>Mobile recharge</option>
              <option>Electricity bill</option>
              <option>Water bill</option>
              <option>Internet bill</option>
              <option>Other payment</option>
            </select>
          </label>
          <label>
            Provider name
            <input
              value={provider}
              onChange={(event) => setProvider(event.target.value)}
              placeholder="e.g. Sample Mobile"
            />
          </label>
          <label>
            Reference number
            <input
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="e.g. 9000000000"
            />
          </label>
          <label>
            Amount (INR)
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="form-summary">
            <span>Current balance</span>
            <strong>{money(account.balance)}</strong>
          </div>
          <button className="primary-btn" disabled={saving} type="submit">
            {saving ? "Saving…" : "Continue"} <ChevronRight size={18} />
          </button>
        </form>
      </section>
    </main>
  );
}

export default BillsPage;
