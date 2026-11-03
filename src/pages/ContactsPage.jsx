import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Search, UserRound, UserPlus } from "lucide-react";

function directRecipient(value) {
  const query = value.trim();
  const isUpi = /^[^\s@]+@[^\s@]+$/.test(query);
  const isPhone = /^[+\d][\d\s()-]{6,}$/.test(query);
  if (!isUpi && !isPhone) return null;
  const name = isUpi
    ? query.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (part) => part.toUpperCase())
    : query;
  return { id: `unsaved-${query}`, name, identifier: query, isSaved: false };
}

function ContactsPage({ contacts, onSave, onDelete, onSelect, onBack }) {
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term
      ? contacts.filter((contact) => `${contact.name} ${contact.identifier}`.toLowerCase().includes(term))
      : contacts;
  }, [contacts, query]);
  const direct = directRecipient(query);
  const hasExactSaved = contacts.some((contact) => contact.identifier.toLowerCase() === query.trim().toLowerCase());

  async function add(event) {
    event.preventDefault();
    if (!name.trim() || !identifier.trim()) {
      setError("Enter a contact name and UPI ID or phone number.");
      return;
    }
    if (contacts.some((contact) => contact.identifier.toLowerCase() === identifier.trim().toLowerCase())) {
      setError("That payment ID or phone number is already saved.");
      return;
    }
    await onSave({ id: crypto.randomUUID(), name: name.trim(), identifier: identifier.trim() });
    setName("");
    setIdentifier("");
    setError("");
  }

  return (
    <main className="page-wrap contacts-page">
      <button className="back-button" onClick={onBack} type="button">
        <ArrowLeft size={18} /> Back
      </button>
      <section className="activity-heading">
        <div className="eyebrow">PAYMENT CONTACTS</div>
        <h1>Who do you want to pay?</h1>
        <p>Search saved names, UPI IDs, or phone numbers.</p>
      </section>

      <label className="contacts-search">
        <Search size={19} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, UPI ID, or phone number"
          aria-label="Search payment contacts"
        />
      </label>

      {direct && !filtered.length && !hasExactSaved && (
        <button className="contact-direct-result" onClick={() => onSelect(direct)} type="button">
          <span className="recipient-avatar"><UserRound size={20} /></span>
          <span><strong>Pay to {direct.name}</strong><small>{direct.identifier} · not saved</small></span>
          <ArrowRight size={19} />
        </button>
      )}

      <section className="contact-directory" aria-label="Contact results">
        {filtered.length ? filtered.map((contact) => (
          <article className="contact-directory-row" key={contact.id}>
            <button className="contact-directory-select" onClick={() => onSelect(contact)} type="button">
              <span className="recipient-avatar">{contact.name.slice(0, 1).toUpperCase()}</span>
              <span><strong>{contact.name}</strong><small>{contact.identifier}</small></span>
              <ArrowRight size={19} />
            </button>
            <button className="record-delete" onClick={() => onDelete(contact.id)} type="button">Remove</button>
          </article>
        )) : !direct ? (
          <section className="empty-activity">
            <UserRound size={22} />
            <strong>{query ? "No matching saved contacts" : "No saved contacts yet"}</strong>
            <p>Enter a UPI ID or phone number above to pay someone new.</p>
          </section>
        ) : null}
      </section>

      <details className="settings-card settings-accordion save-contact-details">
        <summary><UserPlus size={17} /> Save a new contact</summary>
        <form className="setup-form" onSubmit={add}>
          <label>
            Contact name
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Rohan Mehta" />
          </label>
          <label>
            UPI ID or phone number
            <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="name@upi or phone number" />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-btn"><UserPlus size={17} /> Save contact</button>
        </form>
      </details>
    </main>
  );
}

export default ContactsPage;
