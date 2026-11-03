import { ArrowLeft, ChevronRight, Landmark, ShieldCheck } from "lucide-react";
import Brand from "../components/Brand";
import BottomNav from "../components/BottomNav";
import TransactionList from "../components/TransactionList";
import { money } from "../utils/format";

function BalanceDetailsPage({ account, transactions, onBack, onNavigate }) {
  return (
    <>
      <header className="gpay-header">
        <button className="back-round" onClick={onBack} aria-label="Back">
          <ArrowLeft size={19} />
        </button>
        <Brand />
      </header>
      <main className="page-wrap balance-details-page">
        <div className="simulator-strip">
          <ShieldCheck size={14} /> Account overview
        </div>
        <section className="balance-detail-card">
          <div className="balance-detail-bank">
            <div className="money-bank-icon">
              <Landmark size={22} />
            </div>
            <span>
              {account.bankName}
              <small>
                {account.holderName} · ••••{" "}
                {account.accountIdentifier.slice(-4)}
              </small>
            </span>
          </div>
          <div className="balance-caption">AVAILABLE BALANCE</div>
          <strong className="balance-detail-value">
            {money(account.balance)}
          </strong>
          <small>Shown after PIN verification</small>
        </section>
        <section className="bank-details">
          <h2>Account details</h2>
          <div>
            <span>Account number</span>
            <strong>•••• •••• {account.accountIdentifier.slice(-4)}</strong>
          </div>
          <div>
            <span>UPI-style ID</span>
            <strong>{account.demoUpiId}</strong>
          </div>
          <div>
            <span>Account holder</span>
            <strong>{account.holderName}</strong>
          </div>
          <button className="text-button" onClick={() => onNavigate("profile")}>
            Manage account details <ChevronRight size={15} />
          </button>
        </section>
        <section className="section-heading gpay-section-heading">
          <div>
            <h2>Transaction history</h2>
            <p>{transactions.length} recent records</p>
          </div>
          <button
            className="text-button"
            onClick={() => onNavigate("activity")}
          >
            View all <ChevronRight size={15} />
          </button>
        </section>
        {transactions.length ? (
          <TransactionList transactions={transactions.slice(0, 8)} />
        ) : (
          <section className="empty-activity">
            <strong>No transactions yet</strong>
            <p>Your activity will appear here.</p>
          </section>
        )}
      </main>
      <BottomNav
        active="money"
        onNavigate={onNavigate}
        firstName={account.holderName}
        profileImage={account.profileImage}
      />
    </>
  );
}

export default BalanceDetailsPage;
