import { useState } from "react";
import { ChevronRight, ShieldCheck } from "lucide-react";
import Brand from "../components/Brand";

function SetupPage({ onComplete }) {
  const [form, setForm] = useState({
    holderName: "",
    bankName: "Pocket Bank",
    accountIdentifier: "",
    demoUpiId: "",
    balance: "25000",
  });
  const [error, setError] = useState("");
  const update = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));
  async function submit(event) {
    event.preventDefault();
    if (
      !form.holderName.trim() ||
      !form.accountIdentifier.trim() ||
      !form.demoUpiId.trim()
    ) {
      setError("Please enter your name, account number, and UPI ID.");
      return;
    }
    const balance = Number(form.balance);
    if (!Number.isFinite(balance) || balance < 0) {
      setError("Starting balance must be zero or more.");
      return;
    }
    const account = {
      ...form,
      holderName: form.holderName.trim(),
      bankName: form.bankName.trim() || "Pocket Bank",
      balance,
      outingBudget: 3000,
      createdAt: new Date().toISOString(),
    };
    await onComplete(account);
  }
  return (
    <main className="setup-wrap">
      <section className="setup-card">
        <Brand />
        <div className="eyebrow">YOUR PRIVATE MONEY SPACE</div>
        <h1>Set up your account</h1>
        <p className="muted">Your profile details are saved on this device.</p>
        <form onSubmit={submit} className="setup-form">
          <label>
            Account holder name
            <input
              autoComplete="name"
              value={form.holderName}
              onChange={update("holderName")}
              placeholder="e.g. Aanya Sharma"
            />
          </label>
          <label>
            Bank name
            <input
              value={form.bankName}
              onChange={update("bankName")}
              placeholder="Pocket Bank"
            />
          </label>
          <div className="form-row">
            <label>
              Account number
              <input
                value={form.accountIdentifier}
                onChange={update("accountIdentifier")}
                placeholder="•••• 2048"
              />
            </label>
            <label>
              UPI ID
              <input
                value={form.demoUpiId}
                onChange={update("demoUpiId")}
                placeholder="name@pocket"
              />
            </label>
          </div>
          <label>
            Starting balance
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.balance}
              onChange={update("balance")}
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="primary-btn" type="submit">
            Create my account <ChevronRight size={18} />
          </button>
        </form>
        <div className="safe-note">
          <ShieldCheck size={17} />
          <span>
            Stored only on this device. No real bank or payment service is
            connected.
          </span>
        </div>
      </section>
    </main>
  );
}

export default SetupPage;
