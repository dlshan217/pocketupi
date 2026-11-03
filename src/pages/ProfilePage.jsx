
import {
  ChevronRight,
  UsersRound,
  ShieldCheck,
  Settings2,
  QrCode,
  CreditCard,
  History,
  Info,
} from "lucide-react";

import Brand from "../components/Brand";
import BottomNav from "../components/BottomNav";

function ProfilePage({ account, transactions, groups, onNavigate }) {
  const firstName = account.holderName.split(" ")[0];

  const menuItems = [
    {
      icon: ShieldCheck,
      label: "Privacy & app lock",
      description: "Security and access controls",
      action: "profile",
    },
    {
      icon: CreditCard,
      label: "Bank & account settings",
      description: "Manage linked accounts",
      action: "profile",
    },
    {
      icon: History,
      label: "Transaction history",
      description: "View your past activity",
      action: "activity",
    },
    {
      icon: UsersRound,
      label: "Groups & splits",
      description: "Manage shared expenses",
      action: "groups",
    },
    {
      icon: Info,
      label: "About PocketUPI",
      description: "The app, its maker, and social links",
      action: "about",
    },
  ];

  return (
    <>
      <header className="gpay-header">
        <Brand />
        
        
      </header>
      
      

      <main className="page-wrap profile-page">

        {/* Identity */}
        <section className="profile-identity">
          <div className="profile-identity-main">
            {account.profileImage ? (
              <img
                className="profile-avatar"
                src={account.profileImage}
                alt={`${account.holderName} profile`}
              />
            ) : (
              <div className="profile-avatar profile-initials">
                {firstName.slice(0, 1).toUpperCase()}
              </div>
            )}

            <div className="profile-identity-info">
              <span className="profile-overline">ACCOUNT HOLDER</span>
              <h1>{account.holderName}</h1>
              <p>{account.demoUpiId}</p>
            </div>
          </div>

          <button
            className="profile-edit-button"
            onClick={() => onNavigate("profile")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px",
              border: "1px solid currentColor",
            }}
            aria-label="Edit profile"
          >
            <Settings2 size={17} />
          </button>
        </section>

        {/* Account statistics */}
        <section className="profile-stats">
          <div className="profile-stat">
            <strong>{transactions.length}</strong>
            <span>Transactions</span>
          </div>

          <div className="profile-stat">
            <strong>{groups.length}</strong>
            <span>Groups</span>
          </div>

          <div className="profile-stat profile-bank-stat">
            <strong>{account.bankName}</strong>
            <span>Linked bank</span>
          </div>
        </section>

        {/* QR Section */}
        <section className="profile-section profile-qr-section">
          <div className="profile-section-heading">
            <div>
              <h2>Your payment QR</h2>
              <p>Your saved QR image</p>
            </div>
            <QrCode size={20} />
          </div>

          <div className="profile-qr-content">
            {account.upiQrImage ? (
              <img
                className="profile-qr-image"
                src={account.upiQrImage}
                alt="User supplied QR image"
              />
            ) : (
              <div className="profile-qr-placeholder">
                <QrCode size={36} strokeWidth={1.5} />
                <span>No QR image added</span>
                <small>Add one through Edit profile</small>
              </div>
            )}
          </div>

          <p className="profile-qr-disclaimer">
            This image is for display only. Scanning it does not send money.
          </p>
        </section>

        {/* Settings */}
        <section className="profile-menu-section">
          <div className="profile-menu-heading">
            <h2>Account settings</h2>
          </div>

          <div className="profile-menu">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  className="profile-menu-item"
                  key={item.label}
                  onClick={() => onNavigate(item.action)}
                >
                  <span className="profile-menu-icon">
                    <Icon size={19} strokeWidth={1.8} />
                  </span>

                  <span className="profile-menu-copy">
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>

                  <ChevronRight
                    className="profile-menu-arrow"
                    size={17}
                  />
                </button>
              );
            })}
          </div>
        </section>

      </main>

      <BottomNav
        active="you"
        onNavigate={onNavigate}
        firstName={firstName}
        profileImage={account.profileImage}
      />
    </>
  );
}

export default ProfilePage;
