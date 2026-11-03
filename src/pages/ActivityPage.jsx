import { useState } from "react";
import { ArrowLeft, Search, CalendarDays } from "lucide-react";
import TransactionList from "../components/TransactionList";
import { money } from "../utils/format";

function ActivityPage({ transactions, onBack }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [date, setDate] = useState("");
  const [order, setOrder] = useState("newest");
  const filtered = transactions
    .filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        `${item.recipient} ${item.identifier} ${item.id}`
          .toLowerCase()
          .includes(query);
      const matchesCategory = category === "all" || item.category === category;
      const matchesType =
        type === "all" ||
        (type === "outgoing"
          ? item.type !== "receive"
          : item.type === "receive");
      const matchesDate = !date || item.createdAt.slice(0, 10) === date;
      return matchesSearch && matchesCategory && matchesType && matchesDate;
    })
    .sort((a, b) =>
      order === "newest"
        ? b.createdAt.localeCompare(a.createdAt)
        : a.createdAt.localeCompare(b.createdAt),
    );
  const income = filtered
    .filter((item) => item.type === "receive")
    .reduce((sum, item) => sum + item.amount, 0);
  const spending = filtered
    .filter((item) => item.type !== "receive")
    .reduce((sum, item) => sum + item.amount, 0);
  return (
    <main className="page-wrap">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={18} /> Back
      </button>
      <section className="activity-heading">
        <div className="eyebrow">RECENT ACTIVITY</div>
        <h1>Activity</h1>
        <p>This history shows activity recorded on this device.</p>
      </section>
      <div className="activity-totals">
        <div>
          <span>Income shown</span>
          <strong className="credit">{money(income)}</strong>
        </div>
        <div>
          <span>Outgoing shown</span>
          <strong className="debit">{money(spending)}</strong>
        </div>
      </div>
      <div className="history-search">
        <Search size={17} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search recipient, identifier, or ID"
        />
      </div>
      <div className="history-filters">
        <label>
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">All categories</option>
            {[
              "Food",
              "Shopping",
              "Travel",
              "Entertainment",
              "Bills",
              "Other",
            ].map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
        <label>
          Type
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="all">All types</option>
            <option value="outgoing">Outgoing</option>
            <option value="receive">Incoming</option>
          </select>
        </label>
        <label>
          <span>Date</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <label>
          Sort
          <select
            value={order}
            onChange={(event) => setOrder(event.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>
      {filtered.length ? (
        <TransactionList transactions={filtered} />
      ) : (
        <section className="empty-activity">
          <CalendarDays size={22} />
          <strong>
            {transactions.length ? "No matching activity" : "No activity yet"}
          </strong>
          <p>
            {transactions.length
              ? "Try changing or clearing your filters."
              : "Your transfers, bills and receipts will appear here."}
          </p>
        </section>
      )}
    </main>
  );
}

export default ActivityPage;
