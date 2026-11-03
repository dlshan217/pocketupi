import { useState } from "react";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, ChevronRight, Landmark } from "lucide-react";

function MoneyFormPage({ kind, account, onBack, onSubmit, initialContact, initialCategory }) {
  const [form, setForm] = useState({
    person: initialContact?.name || "",
    identifier: initialContact?.identifier || "",
    amount: "",
    category: initialCategory || "Other",
    note: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isSend = kind === "send";
  const isRecharge = initialCategory === "Mobile recharge";
  const isBill = initialCategory === "Bills";

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!form.person.trim() || !form.identifier.trim()) {
      setError("Enter the person’s name and UPI ID or phone number.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onSubmit({
        type: kind,
        amount,
        recipient: form.person.trim(),
        identifier: form.identifier.trim(),
        category: form.category,
        note: form.note.trim(),
      });
    } catch (issue) {
      setError(issue.message || "Could not continue with this payment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page-wrap money-form-page">
      <header className="money-form-header">
        <button className="back-button" onClick={onBack} type="button">
          <ArrowLeft size={19} /> Back
        </button>
        <div>
          <div className="eyebrow">{isSend ? "PAY ANYONE" : "RECEIVE PAYMENT"}</div>
          <h1>{isSend ? "Send money" : "Record payment"}</h1>
        </div>
      </header>

      <form className="upi-form" onSubmit={submit}>
        <section className="upi-recipient">
          <label className="upi-field">
            {isRecharge ? "Customer name" : isBill ? "Biller or customer name" : isSend ? "Recipient name" : "Sender name"}
            <input
              className="upi-person"
              autoComplete="name"
              value={form.person}
              onChange={(event) => update("person", event.target.value)}
              placeholder={isRecharge ? "Enter customer name" : isBill ? "Enter biller name" : "Enter a name"}
              required
            />
          </label>
          <label className="upi-field">
            {isRecharge ? "Mobile number" : isBill ? "Consumer or account number" : "UPI ID or phone number"}
            <input
              className="upi-identifier"
              autoComplete="off"
              value={form.identifier}
              onChange={(event) => update("identifier", event.target.value)}
              placeholder={isRecharge ? "Enter mobile number" : isBill ? "Enter consumer number" : "name@upi or phone number"}
              required
            />
          </label>
        </section>

        <section className="upi-amount-area">
          <label className="upi-amount-heading" htmlFor="payment-amount">
            Amount in rupees
          </label>
          <div className="upi-amount-input">
            <span aria-hidden="true">₹</span>
            <input
              id="payment-amount"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(event) => update("amount", event.target.value)}
              placeholder="0"
              required
            />
          </div>
        </section>

        <section className="upi-account">
          <span className="upi-bank-logo">
            {isSend ? <ArrowUpRight size={19} /> : <ArrowDownLeft size={19} />}
          </span>
          <span className="upi-account-details">
            <strong>{account.bankName || "Pocket Bank"}</strong>
            <span>Account ending {account.accountIdentifier?.slice(-4) || "0000"}</span>
          </span>
          <Landmark className="upi-account-arrow" size={19} />
        </section>

        <section className="upi-extra-fields">
          <label className="upi-field">
            Category
            <select value={form.category} onChange={(event) => update("category", event.target.value)}>
              <option>Food</option>
              <option>Shopping</option>
              <option>Travel</option>
              <option>Entertainment</option>
              <option>Bills</option>
              <option>Mobile recharge</option>
              <option>Bank transfer</option>
              <option>Other</option>
            </select>
          </label>
          <label className="upi-field">
            Note <span className="optional-label">Optional</span>
            <input value={form.note} onChange={(event) => update("note", event.target.value)} placeholder="Add a note" />
          </label>
        </section>

        {error && <p className="form-error upi-error" role="alert">{error}</p>}

        <footer className="upi-bottom">
          <button className="primary-btn upi-continue" disabled={saving} type="submit">
            {saving ? "Continuing…" : isSend ? "Continue to PIN" : "Record payment"}
            <ChevronRight size={19} />
          </button>
        </footer>
      </form>
    </main>
  );
}

export default MoneyFormPage;
