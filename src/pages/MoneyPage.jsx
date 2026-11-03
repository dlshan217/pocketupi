import { ChevronRight, Landmark } from "lucide-react";
import Brand from "../components/Brand";
import BottomNav from "../components/BottomNav";
import TransactionList from "../components/TransactionList";

function MoneyPage({ account, transactions, onNavigate }) {
 return (
  <>
    {/* Header */}
    <header className="gpay-header">
      <Brand />

      <button
        className="profile-shortcut"
        onClick={() => onNavigate("you")}
        aria-label="Open profile"
      >
        {account.profileImage ? (
          <img src={account.profileImage} alt="" />
        ) : (
          account.holderName.slice(0, 1)
        )}
      </button>
    </header>

    <main className="page-wrap money-tab">

      {/* Bank Account Overview */}
      <section className="money-account">
        <div className="money-bank-icon">
          <Landmark size={22} />
        </div>

        <div className="money-bank-text">
          <span>LINKED BANK ACCOUNT</span>
          <strong>{account.bankName}</strong>
          <small>
            {account.holderName} · •••• {account.accountIdentifier.slice(-4)}
          </small>
        </div>
      </section>

      {/* Balance Card */}
      <button
        className="check-balance-card balance-locked"
        onClick={() => onNavigate("balance-pin")}
      >
        <div>
          <span>AVAILABLE BALANCE</span>
          <strong>••••••••</strong>
        </div>

        <span className="primary-btn inline-flex items-center gap-2 px-5 py-3">
          Check balance <ChevronRight size={17} />
        </span>
      </button>

      {/* Account Information */}
      <section className="bank-details">

        <div className="section-heading">
          <div>
            <h2>Account information</h2>
            <p>Your linked bank details</p>
          </div>
          <Landmark size={19} />
        </div>

        <div>
          <span>Account number</span>
          <strong>
            •••• •••• {account.accountIdentifier.slice(-4)}
          </strong>
        </div>

        <div>
          <span>UPI-style ID</span>
          <strong>{account.demoUpiId}</strong>
        </div>

        <div>
          <span>Account holder</span>
          <strong>{account.holderName}</strong>
        </div>

        <button
          className="text-button"
          onClick={() => onNavigate("profile")}
        >
          Manage account details <ChevronRight size={15} />
        </button>
      </section>

      {/* Transaction History */}
      <section className="section-heading gpay-section-heading">

        <div>
          <h2>Transaction history</h2>
          <p>
            Recent activity · {transactions.length} total
          </p>
        </div>

        <button
          className="text-button"
          onClick={() => onNavigate("activity")}
        >
          View all <ChevronRight size={15} />
        </button>

      </section>

      {/* Transactions */}
      {transactions.length ? (
        <TransactionList
          transactions={transactions.slice(0, 8)}
        />
      ) : (
        <section className="empty-activity">
          <strong>No transactions yet</strong>
          <p>Your activity will show up here.</p>
        </section>
      )}

    </main>

    {/* Bottom Navigation */}
    <BottomNav
      active="money"
      onNavigate={onNavigate}
      firstName={account.holderName}
      profileImage={account.profileImage}
    />
  </>
);

}

export default MoneyPage;
