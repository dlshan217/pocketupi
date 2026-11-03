import {
ArrowLeft,
X,
AlertCircle,
RefreshCw,
ArrowRight,
ShieldCheck,
} from "lucide-react";

import Brand from "../components/Brand";
import BottomNav from "../components/BottomNav";
import { money } from "../utils/format";

function PaymentResultPage({
amount,
onRetry,
onBack,
profileImage,
firstName,
}) {
return ( <div className="payment-result-screen"> <header className="gpay-header payment-result-header"> <button
       className="back-round"
       onClick={onBack}
       aria-label="Go back"
     > <ArrowLeft size={19} /> </button> <Brand /> </header>


  <main className="payment-result-main">
    <section className="payment-result-content">
      <div className="result-visual">
        <div className="result-status-icon">
          <X size={32} strokeWidth={2.5} />
        </div>
      </div>

      <span className="result-label">
        PAYMENT UNSUCCESSFUL
      </span>

      <h1>Payment couldn't be completed</h1>

      <p className="result-description">
        We couldn't process your payment because your
        account doesn't have enough balance.
      </p>

      <div className="result-amount-section">
        <span>Payment amount</span>
        <strong>{money(amount)}</strong>
      </div>

      <div className="result-info">
        <div className="result-info-icon">
          <AlertCircle size={19} />
        </div>

        <div className="result-info-text">
          <strong>Insufficient balance</strong>
          <p>
            Please check your available balance before
            attempting this payment again.
          </p>
        </div>
      </div>

      <div className="result-actions">
        <button
          className="primary-btn result-retry-btn"
          onClick={onRetry}
        >
          <RefreshCw size={17} />
          Try again
        </button>

        <button
          className="secondary-btn result-back-btn"
          onClick={onBack}
        >
          Go back
          <ArrowRight size={17} />
        </button>
      </div>

      <div className="result-security-note">
        <ShieldCheck size={16} />
        <span>No money was deducted from your account.</span>
      </div>
    </section>
  </main>

  <BottomNav
    active="home"
    onNavigate={() => {}}
    firstName={firstName}
    profileImage={profileImage}
  />
</div>


);
}

export default PaymentResultPage;
