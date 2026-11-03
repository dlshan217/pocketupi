import { CheckCircle2 } from "lucide-react";
import { money } from "../utils/format";

function SuccessPage({ item, onDone }) {
  return (
    <main className="page-wrap">
      <section className="success-card">
        <div className="success-icon">
          <CheckCircle2 size={30} />
        </div>
        <span className="result-label">RECORD SAVED</span>
        <h1>Activity saved</h1>
        <p>Your account activity has been updated.</p>
        <div className="receipt-row">
          <span>{item.type === "receive" ? "Sender" : "Recipient"}</span>
          <strong>{item.recipient}</strong>
        </div>
        <div className="receipt-row">
          <span>Amount</span>
          <strong>
            {item.type === "receive" ? "+" : "−"}
            {money(item.amount)}
          </strong>
        </div>
        <div className="receipt-id">
          Reference ID
          <br />
          <strong>{item.id}</strong>
        </div>
        <button className="primary-btn" onClick={onDone}>
          Back to dashboard
        </button>
      </section>
    </main>
  );
}

export default SuccessPage;
