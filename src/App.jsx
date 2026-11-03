import { useEffect, useRef, useState } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { money } from "./utils/format";
import {
  deleteTransaction,
  editTransaction,
  exportData,
  getAccount,
  getGroups,
  getSetting,
  getTransactions,
  importData,
  recordTransaction,
  resetData,
  saveAccount,
  saveGroup,
  saveSetting,
} from "./database/db";
import "./App.css";
import SetupPage from "./pages/SetupPage";
import HomePage from "./pages/HomePage";
import MoneyPage from "./pages/MoneyPage";
import ProfilePage from "./pages/ProfilePage";
import ScanPayPage from "./pages/ScanPayPage";
import PinEntryPage from "./pages/PinEntryPage";
import BalanceDetailsPage from "./pages/BalanceDetailsPage";
import PaymentResultPage from "./pages/PaymentResultPage";
import MoneyFormPage from "./pages/MoneyFormPage";
import ActivityPage from "./pages/ActivityPage";
import BillsPage from "./pages/BillsPage";
import GroupExpensesPage from "./pages/GroupExpensesPage";
import LockScreenPage from "./pages/LockScreenPage";
import SettingsPage from "./pages/SettingsPage";
import SuccessPage from "./pages/SuccessPage";
import ContactsPage from "./pages/ContactsPage";
import TransactionManagerPage from "./pages/TransactionManagerPage";
import ContactPaymentPage from "./pages/ContactPaymentPage";
import ProcessingPage from "./pages/ProcessingPage";
import AboutPage from "./pages/AboutPage";
import Brand from "./components/Brand";
import BottomNav from "./components/BottomNav";

function App() {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onboardingStage, setOnboardingStage] = useState("loading");
  const [page, setPageState] = useState("home");
  const [pageDirection, setPageDirection] = useState("forward");
  const [showExitHint, setShowExitHint] = useState(false);
  const [theme, setTheme] = useState("system");
  const [pinRecord, setPinRecord] = useState(null);
  const [locked, setLocked] = useState(false);
  const [successItem, setSuccessItem] = useState(null);
  const [pendingTransfer, setPendingTransfer] = useState(null);
  const [pendingOrigin, setPendingOrigin] = useState("home");
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactPayOrigin, setContactPayOrigin] = useState("home");
  const pageRef = useRef("home");
  const pageTrailRef = useRef(["home"]);
  const lastBackPressRef = useRef(0);
  const exitHintTimerRef = useRef(null);

  function setPage(nextPage) {
    const target = typeof nextPage === "function" ? nextPage(pageRef.current) : nextPage;
    const current = pageRef.current;
    if (!target || target === current) return;
    window.clearTimeout(exitHintTimerRef.current);
    setShowExitHint(false);

    const isProcessingPage = target === "processing-payment" || target === "processing-balance";
    const trail = pageTrailRef.current;
    let isBackNavigation = false;

    if (!isProcessingPage) {
      const existingPageIndex = trail.lastIndexOf(target);
      if (existingPageIndex >= 0) {
        pageTrailRef.current = trail.slice(0, existingPageIndex + 1);
        isBackNavigation = true;
      } else if (["home", "money", "you"].includes(target)) {
        pageTrailRef.current = target === "home" ? ["home"] : ["home", target];
      } else {
        pageTrailRef.current = [...trail, target];
      }
    }

    pageRef.current = target;
    setPageDirection(isBackNavigation ? "back" : "forward");
    setPageState(target);
  }
  useEffect(() => {
    let live = true;
    let splashTimer;
    Promise.all([
      getAccount(),
      getTransactions(),
      getGroups(),
      getSetting("theme"),
      getSetting("appPin"),
      getSetting("contacts"),
    ])
      .then(
        ([
          stored,
          entries,
          savedGroups,
          savedTheme,
          savedPin,
          savedContacts,
        ]) => {
          if (live) {
            setAccount(stored || null);
            setOnboardingStage("splash");
            splashTimer = window.setTimeout(() => {
              if (live) setOnboardingStage(stored ? "complete" : "about");
            }, 1250);
            setTransactions(entries);
            setGroups(savedGroups);
            setContacts(savedContacts || []);
            setTheme(savedTheme || "system");
            setPinRecord(savedPin || null);
            setLocked(Boolean(savedPin));
            setLoading(false);
          }
        },
      )
      .catch(() => {
        if (live) {
          setOnboardingStage("setup");
          setLoading(false);
        }
      });
    return () => {
      live = false;
      window.clearTimeout(splashTimer);
    };
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.dataset.theme =
        theme === "system" ? (media.matches ? "dark" : "light") : theme;
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);
  useEffect(() => {
    if (page !== "processing-payment" && page !== "processing-balance") return;
    const nextPage = page === "processing-payment" ? "payment-error" : "balance-details";
    const timer = window.setTimeout(() => setPage(nextPage), 4000);
    return () => window.clearTimeout(timer);
  }, [page]);
  useEffect(() => {
    const shell = document.querySelector(".app-shell");
    if (!shell || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const offset = pageDirection === "back" ? -14 : 14;
    const animations = [...shell.children]
      .filter((element) => !element.classList.contains("bottom-nav") && !element.classList.contains("back-exit-hint"))
      .map((element) => element.animate ? element.animate(
        [
          { opacity: 0.78, transform: `translateX(${offset}px) scale(.995)` },
          { opacity: 1, transform: "translateX(0) scale(1)" },
        ],
        { duration: 240, easing: "cubic-bezier(.2,.75,.25,1)" },
      ) : null)
      .filter(Boolean);
    return () => animations.forEach((animation) => animation.cancel());
  }, [page, pageDirection]);
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return undefined;
    let listener;
    let disposed = false;
    CapacitorApp.addListener("backButton", () => {
      const current = pageRef.current;
      const trail = pageTrailRef.current;

      if (current === "processing-payment" || current === "processing-balance") {
        lastBackPressRef.current = 0;
        setShowExitHint(false);
        const previous = trail.at(-1) || "home";
        pageRef.current = previous;
        setPageDirection("back");
        setPageState(previous);
        return;
      }

      if (trail.length > 1) {
        lastBackPressRef.current = 0;
        setShowExitHint(false);
        const nextTrail = trail.slice(0, -1);
        const previous = nextTrail.at(-1) || "home";
        pageTrailRef.current = nextTrail;
        pageRef.current = previous;
        setPageDirection("back");
        setPageState(previous);
        return;
      }

      if (current !== "home") {
        setPage("home");
        return;
      }

      const now = Date.now();
      if (now - lastBackPressRef.current < 1800) {
        void CapacitorApp.exitApp();
        return;
      }
      lastBackPressRef.current = now;
      setShowExitHint(true);
      window.clearTimeout(exitHintTimerRef.current);
      exitHintTimerRef.current = window.setTimeout(() => setShowExitHint(false), 1800);
    }).then((registeredListener) => {
      if (disposed) void registeredListener.remove();
      else listener = registeredListener;
    });
    return () => {
      disposed = true;
      window.clearTimeout(exitHintTimerRef.current);
      if (listener) void listener.remove();
    };
  }, []);
  async function handleTransaction(entry) {
    const result = await recordTransaction(account, entry);
    setAccount(result.account);
    setTransactions((existing) => [result.transaction, ...existing]);
    setSuccessItem(result.transaction);
    setPage("success");
  }
  function beginPayment(entry, origin) {
    setPendingTransfer(entry);
    setPendingOrigin(origin);
    setPage("payment-pin");
  }
  function openContactPayment(contact, origin) {
    setSelectedContact(contact);
    setContactPayOrigin(origin);
    setPage("contact-pay");
  }
  async function verifyPayment() {
    if (!pendingTransfer) {
      setPage("home");
      return;
    }
    setPage("processing-payment");
  }
  async function saveContacts(next) {
    setContacts(next);
    await saveSetting("contacts", next);
  }
  if (loading)
    return (
      <div className="app-startup-check" role="status" aria-label="Loading PocketUPI" />
    );
  if (onboardingStage === "splash")
    return (
      <div className="onboarding-splash" aria-label="Opening PocketUPI">
        <div className="onboarding-brand"><Brand /></div>
        <p>Money stuff, made simpler.</p>
        <span className="onboarding-splash-loader" />
      </div>
    );
  if (!account && onboardingStage === "about")
    return (
      <div className="app-shell app-shell-onboarding">
        <AboutPage onboarding onGetStarted={() => setOnboardingStage("setup")} />
      </div>
    );
  if (!account)
    return (
      <SetupPage
        onComplete={async (createdAccount) => {
          await saveAccount(createdAccount);
          setAccount(createdAccount);
          setOnboardingStage("complete");
        }}
      />
    );
  if (locked)
    return (
      <LockScreenPage pinRecord={pinRecord} onUnlock={() => setLocked(false)} />
    );
  if (page === "money")
    return (
      <div className="app-shell">
        <MoneyPage
          account={account}
          transactions={transactions}
          onNavigate={setPage}
        />
      </div>
    );
  if (page === "balance-pin")
    return (
      <div className="app-shell">
        <PinEntryPage
          pinRecord={pinRecord}
          title="Check your balance"
          onBack={() => setPage("money")}
          onVerified={() => setPage("processing-balance")}
        />
      </div>
    );
  if (page === "balance-details")
    return (
      <div className="app-shell">
        <BalanceDetailsPage
          account={account}
          transactions={transactions}
          onBack={() => setPage("money")}
          onNavigate={setPage}
        />
      </div>
    );
  if (page === "contacts")
    return (
      <div className="app-shell">
        <ContactsPage
          contacts={contacts}
          onSave={(contact) => saveContacts([...contacts, contact])}
          onDelete={(id) =>
            saveContacts(contacts.filter((contact) => contact.id !== id))
          }
          onSelect={(contact) => openContactPayment(contact, "contacts")}
          onBack={() => setPage("home")}
        />
        <BottomNav
          active="home"
          onNavigate={setPage}
          firstName={account.holderName.split(" ")[0]}
          profileImage={account.profileImage}
        />
      </div>
    );
  if (page === "contact-pay" && selectedContact)
    return (
      <div className="app-shell app-shell-fullscreen">
        <ContactPaymentPage
          contact={selectedContact}
          onBack={() => setPage(contactPayOrigin)}
          onPay={(entry) => beginPayment(entry, contactPayOrigin)}
        />
      </div>
    );
  if (page === "payment-pin")
    return (
      <div className="app-shell">
        <PinEntryPage
          pinRecord={pinRecord}
          title="Enter your PIN"
          subtitle={`Confirm ${money(pendingTransfer?.amount)} to ${pendingTransfer?.recipient || "recipient"}.`}
          onBack={() => setPage(pendingOrigin)}
          onVerified={verifyPayment}
        />
      </div>
    );
  if (page === "payment-error" && pendingTransfer)
    return (
      <div className="app-shell">
        <PaymentResultPage
          amount={pendingTransfer.amount}
          onRetry={() => setPage("payment-pin")}
          onBack={() => setPage(pendingOrigin)}
          firstName={account.holderName.split(" ")[0]}
          profileImage={account.profileImage}
        />
      </div>
    );
  if (page === "processing-payment" || page === "processing-balance")
    return (
      <div className="app-shell">
        <ProcessingPage />
      </div>
    );
  if (page === "you")
    return (
      <div className="app-shell">
        <ProfilePage
          account={account}
          transactions={transactions}
          groups={groups}
          onNavigate={setPage}
        />
      </div>
    );
  if (page === "about")
    return (
      <div className="app-shell">
        <AboutPage onBack={() => setPage("you")} />
        <BottomNav
          active="you"
          onNavigate={setPage}
          firstName={account.holderName.split(" ")[0]}
          profileImage={account.profileImage}
        />
      </div>
    );
  if (page === "scan")
    return (
      <div className="app-shell">
        <ScanPayPage
          onBack={() => setPage("home")}
          onSubmit={(entry) => beginPayment(entry, "scan")}
        />
      </div>
    );
  if (page === "profile")
    return (
      <div className="app-shell">
        <SettingsPage
          account={account}
          transactions={transactions}
          groups={groups}
          theme={theme}
          pinRecord={pinRecord}
          onBack={() => setPage("you")}
          onThemeChange={async (value) => {
            setTheme(value);
            await saveSetting("theme", value);
          }}
          onAccountSave={async (updated) => {
            await saveAccount(updated);
            setAccount(updated);
          }}
          onPinSave={async (record) => {
            await saveSetting("appPin", record);
            setPinRecord(record);
          }}
          onPinDisable={async () => {
            await saveSetting("appPin", null);
            setPinRecord(null);
          }}
          onManageHistory={() => setPage("manage-history")}
          onAbout={() => setPage("about")}
          onExport={exportData}
          onImport={async (data) => {
            const result = await importData(data);
            const savedTheme = await getSetting("theme");
            const savedPin = await getSetting("appPin");
            setAccount(result.account);
            setTransactions(result.transactions);
            setGroups(result.groups);
            setTheme(savedTheme || "system");
            setPinRecord(savedPin || null);
            setLocked(false);
            setOnboardingStage("complete");
          }}
          onReset={async () => {
            await resetData();
            setAccount(null);
            setTransactions([]);
            setGroups([]);
            setPage("home");
            setPinRecord(null);
            setOnboardingStage("setup");
          }}
          onLock={() => setLocked(true)}
        />
        <BottomNav
          active="you"
          onNavigate={setPage}
          firstName={account.holderName.split(" ")[0]}
          profileImage={account.profileImage}
        />
      </div>
    );
  if (page === "manage-history")
    return (
      <div className="app-shell">
        <TransactionManagerPage
          transactions={transactions}
          onBack={() => setPage("profile")}
          onCreate={async (entry) => {
            const result = await recordTransaction(account, entry);
            setAccount(result.account);
            setTransactions((items) => [result.transaction, ...items]);
          }}
          onEdit={async (id, changes) => {
            const result = await editTransaction(id, changes);
            setAccount(result.account);
            setTransactions(await getTransactions());
          }}
          onDelete={async (id) => {
            setAccount(await deleteTransaction(id));
            setTransactions(await getTransactions());
          }}
        />
        <BottomNav active="you" onNavigate={setPage} firstName={account.holderName.split(" ")[0]} profileImage={account.profileImage} />
      </div>
    );
  if (page === "groups")
    return (
      <div className="app-shell">
        <GroupExpensesPage
          groups={groups}
          account={account}
          onBack={() => setPage("home")}
          onSaveGroup={async (group) => {
            const saved = await saveGroup(group);
            setGroups((items) => [saved, ...items]);
          }}
          onSettle={async (group, participantId) => {
            const updated = {
              ...group,
              participants: group.participants.map((participant) =>
                participant.id === participantId
                  ? {
                      ...participant,
                      settled: true,
                      settledAt: new Date().toISOString(),
                    }
                  : participant,
              ),
            };
            const saved = await saveGroup(updated);
            setGroups((items) =>
              items.map((item) => (item.id === saved.id ? saved : item)),
            );
          }}
          onBudgetChange={async (value) => {
            const updated = { ...account, outingBudget: value };
            await saveAccount(updated);
            setAccount(updated);
          }}
        />
        <BottomNav
          active="home"
          onNavigate={setPage}
          firstName={account.holderName.split(" ")[0]}
          profileImage={account.profileImage}
        />
      </div>
    );
  if (page === "bills")
    return (
      <div className="app-shell">
        <BillsPage
          account={account}
          onBack={() => setPage("home")}
          onSubmit={handleTransaction}
        />
        <BottomNav
          active="home"
          onNavigate={setPage}
          firstName={account.holderName}
          profileImage={account.profileImage}
        />
      </div>
    );
  if (page === "send" || page === "receive")
    return (
      <div className="app-shell">
        <MoneyFormPage
          kind={page}
          account={account}
          initialContact={page === "send" ? selectedContact : null}
          onBack={() => setPage("home")}
          onSubmit={
            page === "send"
              ? (entry) => beginPayment(entry, "send")
              : handleTransaction
          }
        />
        <BottomNav
          active="home"
          onNavigate={setPage}
          firstName={account.holderName}
          profileImage={account.profileImage}
        />
      </div>
    );
  if (["bank-transfer", "recharge", "bill-payment"].includes(page)) {
    const initialCategory = {
      "bank-transfer": "Bank transfer",
      recharge: "Mobile recharge",
      "bill-payment": "Bills",
    }[page];
    return (
      <div className="app-shell">
        <MoneyFormPage
          kind="send"
          account={account}
          initialCategory={initialCategory}
          onBack={() => setPage("home")}
          onSubmit={(entry) => beginPayment(entry, page)}
        />
        <BottomNav active="home" onNavigate={setPage} firstName={account.holderName} profileImage={account.profileImage} />
      </div>
    );
  }
  if (page === "success" && successItem)
    return (
      <div className="app-shell">
        <SuccessPage item={successItem} onDone={() => setPage("home")} />
        <BottomNav
          active="home"
          onNavigate={setPage}
          firstName={account.holderName}
          profileImage={account.profileImage}
        />
      </div>
    );
  if (page === "activity")
    return (
      <div className="app-shell">
        <ActivityPage
          transactions={transactions}
          onBack={() => setPage("home")}
        />
        <BottomNav
          active="home"
          onNavigate={setPage}
          firstName={account.holderName.split(" ")[0]}
          profileImage={account.profileImage}
        />
      </div>
    );
  return (
    <div className="app-shell">
      {showExitHint && (
        <div className="back-exit-hint" role="status">Press back again to exit</div>
      )}
      <HomePage
        account={account}
        transactions={transactions}
        contacts={contacts}
        onNavigate={setPage}
        onContactSelect={(contact, origin) => openContactPayment(contact, origin)}
      />
    </div>
  );
}

export default App;
