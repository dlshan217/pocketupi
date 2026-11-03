import {
  Check,
  LockKeyhole,
  QrCode,
  Smartphone,
  UsersRound,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import Brand from "../components/Brand";

const links = [
  {
    label: "GitHub",
    href: "https://github.com/dlshan217",
    icon: "github-icon",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dlshan217/",
    icon: "linkedin",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/dlshaaaan/",
    icon: "instagram",
  },
 
  
  {
    label: "Discord",
    href: "https://discord.gg/v9Kv8ZWvX",
    icon: "discord-icon",
  },
  {
    label: "Portfolio",
    href: "https://dlshan217.github.io/dlshan.github.io/",
    icon: "globe",
  },
];

function SocialIcon({ name }) {
  if (name === "github-icon" || name === "discord-icon") {
    return <svg className="about-social-brand-icon" aria-hidden="true"><use href={`/icons.svg#${name}`} /></svg>;
  }

  const common = { className: "about-social-brand-icon", viewBox: "0 0 24 24", "aria-hidden": true };
  if (name === "linkedin") return <svg {...common}><path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.34 18H5.67V9.4h2.67ZM7 8.23a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1ZM18.33 18h-2.66v-4.18c0-1-.02-2.29-1.4-2.29s-1.62 1.1-1.62 2.22V18H10V9.4h2.55v1.17h.04a2.8 2.8 0 0 1 2.5-1.38c2.68 0 3.24 1.76 3.24 4.05Z" /></svg>;
  if (name === "globe") return <svg {...common}><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M3.5 12h17M12 3c2.2 2.4 3.3 5.4 3.3 9S14.2 18.6 12 21c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
  if (name === "instagram") return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.7" r="1.2" fill="currentColor"/></svg>;
  if (name === "youtube") return <svg {...common}><path fill="currentColor" d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2a31 31 0 0 0-.5 4.8 31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.7 15.6V8.4l6.2 3.6Z"/></svg>;
  return <svg {...common}><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20c1.1 0 1.8-.6 1.8-1.4 0-.4-.2-.7-.5-1.1-.2-.2-.4-.5-.4-.8 0-.4.4-.8.9-.8h1.5a6.6 6.6 0 0 0 6.7-6.6C22 6.2 17.5 2 12 2Zm-4 10a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8Zm4-2.3a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8Zm4.1 2.3a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8ZM8.4 14.4c1 1 2.2 1.5 3.6 1.5s2.6-.5 3.6-1.5a.6.6 0 0 1 .9.8 6.2 6.2 0 0 1-9 0 .6.6 0 0 1 .9-.8Z"/></svg>;
}

const features = [
  {
    title: "Pay flows",
    detail: "Try a payment flow from contacts, a QR, or a payment form.",
    icon: Smartphone,
  },
  {
    title: "Your setup",
    detail: "Your profile, saved contacts, and preferences stay on this device.",
    icon: UsersRound,
  },
  {
    title: "PIN screens",
    detail: "Explore PIN checks and the screens around a payment.",
    icon: LockKeyhole,
  },
  {
    title: "QR profile",
    detail: "Add a QR image to your profile for display.",
    icon: QrCode,
  },
];

function AboutPage({ onBack, onboarding = false, onGetStarted }) {
  return (
    <>
      {!onboarding && (
        <header className="gpay-header about-header">
          <button
            className="back-button"
            onClick={onBack}
            aria-label="Back to profile"
          >
            <ArrowLeft size={19} />
          </button>
          <Brand />
        </header>
      )}

      <main className="page-wrap about-page">

        {/* INTRO */}
        <section className="about-intro" style={{ padding: "1.25rem 1rem" }}>
          {onboarding && <div className="about-brand"><Brand /></div>}

          <p className="about-kicker">
            NOT YOUR USUAL PAYMENT APP
          </p>

          <h1>
            The story behind
            <br />
            <span>PocketUPI.</span>
          </h1>

          <p className="about-copy">
            Hey, I'm Dilshan. And this app exists because of one
            extremely familiar problem: going out with friends.
            Well, some very selectively broke friends.
            (They're not actually broke.)
            <br/>
          </p>
        </section>
        <br/>
        

        {/* THE PROBLEM */}
        <section className="about-story">
          <div className="story-label">
            <span className="story-number">01</span>
            THE PROBLEM
          </div>

          <h2>
            Everyone has money.
            <br />
            Nobody has money.
          </h2>

          <p>
            You go out, grab some food, enjoy the day, and then
            the bill arrives. Suddenly, everyone's broke.
          </p>

          <div className="story-chat">
            <div className="chat-line">
              <span>Friend</span>
              <p>"Bro, who has money?"</p>
            </div>

            <div className="chat-line chat-mine">
              <span>Me</span>
              <p>"Let's split it?"</p>
            </div>

            <div className="chat-line">
              <span>Friend</span>
              <p>"Bro, you pay. We'll send it later."</p>
            </div>
          </div>

          <p className="story-punchline">
            They won't.

            <br /><br />

            These same people somehow manage to find money for
            cigarettes, smoking and drinks. Their financial situation
            isn't exactly hopeless. Their priorities are just...
            interesting.

            <br /><br />

            And when it comes to food or coffee, someone else is
            somehow expected to cover the bill.

            <br /><br />

            Paying for a friend occasionally? Absolutely fine.
            Coffee, snacks, food, no big deal.

            But when they secretly have money, spend it on their
            own stuff, and expect you to pay for them instead?
            That's where it gets annoying.
          </p>
        </section>

        {/* THE AWKWARD PART */}
        <section className="about-story about-story-muted">
          <div className="story-label">
            <span className="story-number">02</span>
            THE AWKWARD PART
          </div>

          <h2>"Show us your balance."</h2>

          <p>
            Refuse to pay or say you don't have that much money?
            Now you have to prove it.
          </p>

          <div className="story-chat">
            <div className="chat-line">
              <span>Friend</span>
              <p>"Bro, show your bank balance then."</p>
            </div>

            <div className="chat-line chat-mine">
              <span>Me</span>
              <p>"Why do I have to show you that?"</p>
            </div>
          </div>

          <p className="story-punchline">
            Refusing to show your balance might make things even
            more suspicious. Apparently, if you don't show it,
            that must mean you've got money sitting in your account.

            <br /><br />

            Congratulations, your savings are now public information.

            <br /><br />

            Sure, you can always say, "I'm only paying for mine."
            And that's fair. But what if they genuinely don't have
            money? You don't want to leave a friend stranded either.

            <br /><br />

            So where do you draw the line between helping a friend
            and becoming everyone's unofficial ATM?
          </p>
        </section>

        {/* THE SOLUTION */}
        <section className="about-solution">
          <div className="story-label">
            <span className="story-number">03</span>
            THE SOLUTION
          </div>

          <h2>
            So I built
            <br />
            PocketUPI.
          </h2>

          <p>
            A personal, offline payment simulator where I control
            the demo account, balance and transaction history.
            No bank connection. No real money. Just a little
            project inspired by a very real social problem.
          </p>

          <div className="solution-points">
            <div>
              <Check size={17} />
              <span>Custom demo balance</span>
            </div>

            <div>
              <Check size={17} />
              <span>Simulated transactions</span>
            </div>

            <div>
              <Check size={17} />
              <span>Simulated insufficient-balance errors</span>
            </div>

            <div>
              <Check size={17} />
              <span>Offline and locally stored</span>
            </div>

            <div>
              <Check size={17} />
              <span>My account, my settings</span>
            </div>
          </div>

          <div className="solution-footer">
            <span>QUESTIONABLE SOLUTION</span>
          </div>
        </section>

        {/* FEATURES */}
        <section className="about-features-section">
          <div className="about-section-heading">
            <span className="about-kicker">INSIDE THE APP</span>
            <h2>What's inside?</h2>
            <p>More than just a balance screen.</p>
          </div>

          <div className="about-feature-grid"> {features.map(({ title, detail }) => ( <article className="about-feature-card" key={title}> <strong>{title}</strong> <p>{detail}</p> </article> ))} </div>
        </section>
        {onboarding && (
          <div className="about-onboarding-cta">
            <button
              type="button"
              className="about-get-started"
              onClick={onGetStarted}
            >
              Get Started <ArrowRight size={18} />
            </button>
          </div>
        )}
        {/* SOCIAL LINKS */}
        <section className="about-social-section">
          <div className="about-section-heading">
            <span className="about-kicker">
              ELSEWHERE ON THE INTERNET
            </span>

            <h2>Find me around.</h2>

            <p>Check out my other stuff. Or just say hi.</p>
          </div>

          <div className="about-social-list">
          {links.map(({ label, href, icon }) => (
              <a
                key={label}
                className="about-social-link"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${label}`}
              >
                <SocialIcon name={icon} />
              </a>
            ))}
          </div>
        </section>

        {/* SIGN OFF */}
        <footer className="about-signoff">
          <h3>That's the story.</h3>

          <p>from dlshan</p>

          <small>POCKETUPI · OFFLINE UPI SIMULATOR</small>
        </footer>

      </main>
    </>
  );
}

export default AboutPage;
