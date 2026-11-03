import { useState } from "react";
import {
  ArrowUpRight,
  Bell,
  ChevronRight,
  SearchIcon,
  ScanLine,
  UsersRound,
  Landmark,
  Sparkles,
  Phone,
  ArrowRight,
  ReceiptText,
  X,
  UserRound,
} from "lucide-react";
import Brand from "../components/Brand";
import BottomNav from "../components/BottomNav";
import TransactionList from "../components/TransactionList";
import SavedContacts from "../components/SavedContacts";

function HomePage({ account, transactions, contacts, onNavigate, onContactSelect }) {
  const [query, setQuery] = useState("");
  const searchTerm = query.trim().toLocaleLowerCase();
  const contactMatches = searchTerm
    ? contacts.filter((contact) => `${contact.name} ${contact.identifier}`.toLocaleLowerCase().includes(searchTerm)).slice(0, 3)
    : [];
  const transactionMatches = searchTerm
    ? transactions.filter((item) => `${item.recipient} ${item.identifier || ""} ${item.id} ${item.category || ""}`.toLocaleLowerCase().includes(searchTerm)).slice(0, 3)
    : [];
  const hasSearchResults = contactMatches.length > 0 || transactionMatches.length > 0;
  const submitSearch = (event) => {
    event.preventDefault();
    if (searchTerm) onNavigate("contacts");
    else onNavigate("activity");
  };
  const firstName = account.holderName.split(" ")[0];
  return (
    <>
      <header className="gpay-header">
        <Brand />
        <button className="profile-shortcut" onClick={() => onNavigate("you")}>
          {account.profileImage ? (
            <img src={account.profileImage} alt="" />
          ) : (
            firstName.slice(0, 1).toUpperCase()
          )}
        </button>
      </header>
      <main className="dashboard new-home">

        <form className="gpay-search" role="search" onSubmit={submitSearch}>
          <SearchIcon size={19} />
          <input
            id="home-search"
            type="search"
            aria-label="Search people or activity"
            aria-expanded={Boolean(searchTerm)}
            aria-controls="home-search-results"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search people or activity"
          />
          {query ? (
            <button type="button" aria-label="Clear search" onClick={() => setQuery("")}>
              <X size={17} />
            </button>
          ) : (
            <button type="submit" aria-label="Search">
              <ArrowRight size={17} />
            </button>
          )}
        </form>
        {searchTerm && (
          <div className="search-results" id="home-search-results">
            {contactMatches.length > 0 && <div className="search-result-group"><span className="search-result-heading">People</span>
              {contactMatches.map((contact) => <button className="search-result" key={contact.id} onClick={() => onContactSelect(contact, "home")} type="button">
                <span className="search-result-icon"><UserRound size={17} /></span><span className="search-result-copy"><strong>{contact.name}</strong><small>{contact.identifier}</small></span><ArrowRight size={16} />
              </button>)}
            </div>}
            {transactionMatches.length > 0 && <div className="search-result-group"><span className="search-result-heading">Activity</span>
              {transactionMatches.map((item) => <button className="search-result" key={item.id} onClick={() => onNavigate("activity")} type="button">
                <span className="search-result-icon"><ReceiptText size={17} /></span><span className="search-result-copy"><strong>{item.recipient}</strong><small>{item.category || "Payment"}</small></span><ArrowRight size={16} />
              </button>)}
            </div>}
            {!hasSearchResults && <div className="search-no-results"><strong>No matches found</strong><span>Search all people and payments</span></div>}
            <button className="search-all-results" type="button" onClick={() => onNavigate(searchTerm ? "contacts" : "activity")}>Search people <ArrowRight size={15} /></button>
          </div>
        )}
        <section className="gpay-greeting">
          <div>
            <span>Good morning,</span>
            <h1>{firstName}</h1>
          </div>
          <button className="notification-round" aria-label="Notifications">
            <Bell size={19} />
          </button>
        </section>
        <button
          className="balance-card gpay-balance protected-balance"
          onClick={() => onNavigate("balance-pin")}
        >
          <div className="balance-top">
            <div className="bank-label">
              <div className="bank-icon">
                <Landmark size={18} />
              </div>
              <div>
                <strong>{account.bankName}</strong>
                <span>•••• {account.accountIdentifier.slice(-4)}</span>
              </div>
            </div>
          </div>
          <div className="balance-caption">AVAILABLE BALANCE</div>
          <div className="balance-line">
            <strong>••••••••</strong>
            <span>Protected</span>
          </div>
          <div className="balance-foot">
            <span>{account.holderName}</span>
            <span>Check with PIN →</span>
          </div>
        </button>
        <button className="scan-pay-card scan-pay-centered" onClick={() => onNavigate("scan")}>
          <span className="scan-symbol">
            <ScanLine size={25} />
          </span>
          <span>
            <strong>Scan QR</strong>
          </span>
        </button>
        <section className="section-heading gpay-section-heading">
          <div>
            <h2>Pay your way</h2>
            <p>Choose how you want to pay.</p>
          </div>
        </section>
        <section className="gpay-actions">
          <button onClick={() => onNavigate("contacts")}>
            <span className="gpay-action-icon violet">
              <ArrowUpRight size={20} />
            </span>
            <strong>Pay anyone</strong>
          </button>
          <button onClick={() => onNavigate("bank-transfer")}>
            <span className="gpay-action-icon blue">
              <Landmark size={20} />
            </span>
            <strong>Bank transfer</strong>
          </button>
          <button onClick={() => onNavigate("recharge")}>
            <span className="gpay-action-icon amber">
              <Phone size={20} />
            </span>
            <strong>Mobile recharge</strong>
          </button>
          <button onClick={() => onNavigate("bill-payment")}>
            <span className="gpay-action-icon green">
              <ReceiptText size={20} />
            </span>
            <strong>Pay bills</strong>
          </button>
        </section>
        <button
          className="contacts-shortcut"
          onClick={() => onNavigate("contacts")}
        >
          <UsersRound size={17} /> Manage saved payment contacts{" "}
          <ChevronRight size={16} />
        </button>
        <SavedContacts
          contacts={contacts}
          onSelect={(contact) => onContactSelect(contact, "home")}
          onManage={() => onNavigate("contacts")}
        />
        <section className="demo-offer">
          <div className="offer-copy">
            <span>POCKET PICKS</span>
            <strong>A little reward for your next outing</strong>
            <small>Ideas and offers for your next outing</small>
          </div>
          <Sparkles size={25} />
        </section>
        <section className="section-heading gpay-section-heading">
          <div>
            <h2>People & groups</h2>
            <p>Keep shared plans in one place.</p>
          </div>
          <button className="text-button" onClick={() => onNavigate("groups")}>
            View groups <ChevronRight size={15} />
          </button>
        </section>
        <div
          className="gpay-mini-card"
          onClick={() => onNavigate("groups")}
          role="button"
          tabIndex="0"
        >
          <div className="mini-round">
            <UsersRound size={18} />
          </div>
          <div>
            <strong>Split an outing</strong>
            <span>Track shares separately from your balance</span>
          </div>
          <ChevronRight size={18} />
        </div>
        <section className="section-heading gpay-section-heading">
          <div>
            <h2>Recent activity</h2>
            <p>Your recent activity</p>
          </div>
          <button
            className="text-button"
            onClick={() => onNavigate("activity")}
          >
            See all <ChevronRight size={15} />
          </button>
        </section>
        {transactions.length ? (
          <TransactionList transactions={transactions.slice(0, 3)} />
        ) : (
          <section className="empty-activity">
            <div className="empty-icon">
              <Sparkles size={22} />
            </div>
            <strong>Nothing here yet</strong>
            <p>Your activity will appear here.</p>
          </section>
        )}
      </main>
      <BottomNav active="home" onNavigate={onNavigate} firstName={firstName} profileImage={account.profileImage} />
    </>
  );
}

export default HomePage;
