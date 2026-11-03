import { MoreHorizontal } from "lucide-react";

function SavedContacts({ contacts, onSelect, onManage }) {
  const preview = contacts.slice(0, 7);
  return (
    <section className="saved-contacts" aria-label="Saved payment contacts">
      {preview.map((contact) => (
        <button
          className="saved-contact"
          key={contact.id}
          onClick={() => onSelect(contact)}
          type="button"
        >
          <span className="saved-contact-avatar">
            {contact.name.slice(0, 1).toUpperCase()}
          </span>
          <span className="saved-contact-name">{contact.name}</span>
        </button>
      ))}
      <button className="saved-contact saved-contact-more" onClick={onManage} type="button">
        <span className="saved-contact-avatar"><MoreHorizontal size={22} /></span>
        <span className="saved-contact-name">More</span>
      </button>
    </section>
  );
}

export default SavedContacts;
