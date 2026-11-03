import { useState } from "react";
import { ArrowLeft, ChevronRight, UsersRound } from "lucide-react";
import { money } from "../utils/format";

function GroupExpensesPage({
  groups,
  account,
  onBack,
  onSaveGroup,
  onSettle,
  onBudgetChange,
}) {
  const [name, setName] = useState("");
  const [total, setTotal] = useState("");
  const [names, setNames] = useState("");
  const [payer, setPayer] = useState("");
  const [budgetDraft, setBudgetDraft] = useState(
    String(account.outingBudget || 0),
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const participantNames = names
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  async function createGroup(event) {
    event.preventDefault();
    const amount = Number(total);
    const uniqueNames = [...new Set(participantNames)];
    if (
      !name.trim() ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      uniqueNames.length < 2
    ) {
      setError(
        "Add a group name, a valid bill amount, and at least two participants.",
      );
      return;
    }
    if (!uniqueNames.includes(payer.trim())) {
      setError("Select a payer who is included in the participant list.");
      return;
    }
    setSaving(true);
    setError("");
    const people = uniqueNames.map((person) => ({
      id: crypto.randomUUID(),
      name: person,
      settled: person === payer.trim(),
      paidBy: person === payer.trim(),
    }));
    try {
      await onSaveGroup({
        name: name.trim(),
        totalAmount: amount,
        participants: people,
        payer: payer.trim(),
      });
      setName("");
      setTotal("");
      setNames("");
      setPayer("");
    } catch (issue) {
      setError(issue.message || "Could not save this group.");
    } finally {
      setSaving(false);
    }
  }
  async function setBudget(event) {
    event.preventDefault();
    const value = Number(budgetDraft);
    if (!Number.isFinite(value) || value < 0) {
      setError("Outing budget must be zero or more.");
      return;
    }
    await onBudgetChange(value);
    setError("");
  }
  return (
    <main className="page-wrap">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={18} /> Back
      </button>
      <section className="activity-heading">
        <div className="eyebrow">SHARED SPENDING</div>
        <h1>Group expenses</h1>
        <p>Split a shared bill and track who has settled their share.</p>
      </section>
      <section className="budget-card">
        <div>
          <div className="eyebrow">PERSONAL OUTING BUDGET</div>
          <strong>{money(account.outingBudget || 0)}</strong>
          <span>Tracked separately from your account balance</span>
        </div>
        <form onSubmit={setBudget}>
          <label htmlFor="budget-input">Update budget</label>
          <div>
            <input
              id="budget-input"
              type="number"
              min="0"
              step="0.01"
              value={budgetDraft}
              onChange={(event) => setBudgetDraft(event.target.value)}
            />
            <button type="submit">Save</button>
          </div>
        </form>
      </section>
      <section className="group-create">
        <h2>Create a group expense</h2>
        <form className="setup-form" onSubmit={createGroup}>
          <label>
            Group name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Weekend dinner"
            />
          </label>
          <div className="form-row">
            <label>
              Total bill (INR)
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={total}
                onChange={(event) => setTotal(event.target.value)}
                placeholder="0.00"
              />
            </label>
            <label>
              Paid by
              <input
                value={payer}
                onChange={(event) => setPayer(event.target.value)}
                placeholder="Name from participants"
              />
            </label>
          </div>
          <label>
            Participants (comma separated)
            <input
              value={names}
              onChange={(event) => setNames(event.target.value)}
              placeholder="Aanya, Rohan, Mira"
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="primary-btn" disabled={saving} type="submit">
            {saving ? "Saving…" : "Save group expense"}{" "}
            <ChevronRight size={18} />
          </button>
        </form>
      </section>
      <section className="groups-list">
        <div className="section-heading">
          <div>
            <h2>Your groups</h2>
            <p>Equal shares are calculated for each participant.</p>
          </div>
        </div>
        {groups.length ? (
          groups.map((group) => {
            const share = group.totalAmount / group.participants.length;
            const outstanding =
              group.participants.filter((person) => !person.settled).length *
              share;
            return (
              <article className="group-card" key={group.id}>
                <div className="group-card-top">
                  <div>
                    <h3>{group.name}</h3>
                    <p>
                      {group.participants.length} people ·{" "}
                      {money(group.totalAmount)} total · {money(share)} each
                    </p>
                  </div>
                  <div className="group-outstanding">
                    <span>Outstanding</span>
                    <strong>{money(outstanding)}</strong>
                  </div>
                </div>
                <p className="payer-note">{group.payer} paid the bill</p>
                <div className="participant-list">
                  {group.participants.map((person) => (
                    <div className="participant-row" key={person.id}>
                      <span>
                        {person.name}
                        {person.paidBy ? " · paid bill" : ""}
                      </span>
                      {person.settled ? (
                        <span className="settled-label">Settled</span>
                      ) : (
                        <div className="settle-due">
                          <strong>Owes {money(share)}</strong>
                          <button onClick={() => onSettle(group, person.id)}>
                            Mark settled
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            );
          })
        ) : (
          <section className="empty-activity">
            <div className="empty-icon">
              <UsersRound size={22} />
            </div>
            <strong>No groups yet</strong>
            <p>Create a shared expense to split a bill.</p>
          </section>
        )}
      </section>
    </main>
  );
}

export default GroupExpensesPage;
