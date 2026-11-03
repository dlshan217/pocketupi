import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { money } from "../utils/format";
import { dateText } from "../utils/format";

function TransactionList({ transactions }) {
  return (
    <div className="transaction-list">
      {transactions.map((item) => (
        <article className="transaction-row" key={item.id}>
          <div className={`transaction-icon ${item.type}`}>
            {item.type === "receive" ? (
              <ArrowDownLeft size={18} />
            ) : (
              <ArrowUpRight size={18} />
            )}
          </div>
          <div className="transaction-info">
            <strong>{item.recipient}</strong>
            <span>
              {item.category} · {dateText(item.createdAt)}
            </span>
          </div>
          <div className="transaction-value">
            <strong className={item.type === "receive" ? "credit" : "debit"}>
              {item.type === "receive" ? "+" : "−"}
              {money(item.amount)}
            </strong>
          </div>
        </article>
      ))}
    </div>
  );
}

export default TransactionList;
