import { useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

function ContactPaymentPage({ contact, onBack, onPay }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const value = Number(amount);
  const validAmount = Number.isFinite(value) && value > 0;

  function submit(event) {
    event.preventDefault();
    if (!validAmount) {
      setError("Enter an amount greater than zero.");
      return;
    }
    onPay({
      type: "send",
      amount: value,
      recipient: contact.name,
      identifier: contact.identifier,
      category: "Other",
      note: "",
    });
  }

  return (
    <main className="contact-payment-page">
      <header className="contact-payment-header">
        <button className="back-button" onClick={onBack} type="button" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div className="contact-payment-recipient">
          <span className="recipient-avatar">{contact.name.slice(0, 1).toUpperCase()}</span>
          <strong>Paying {contact.name}</strong>
          <span>{contact.identifier}</span>
        </div>
        <span className="contact-payment-spacer" aria-hidden="true" />
      </header>

      <form className="contact-payment-form" onSubmit={submit}>
        <label htmlFor="contact-payment-amount">Amount</label>
        <div className="contact-payment-amount">
          <span aria-hidden="true">₹</span>
          <input
            id="contact-payment-amount"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setError("");
            }}
            placeholder="0"
          />
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary-btn contact-payment-submit" disabled={!validAmount}>
          <ArrowUpRight size={19} /> Pay{validAmount ? ` ₹${value.toFixed(2)}` : ""}
        </button>
      </form>
    </main>
  );
}

export default ContactPaymentPage;
