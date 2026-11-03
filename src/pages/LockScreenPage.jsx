import { useState } from "react";
import Brand from "../components/Brand";

function LockScreenPage({ pinRecord, onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    if ((await hashPin(pin, pinRecord.salt)) === pinRecord.hash) onUnlock();
    else setError("That PIN did not match. Try again.");
  }
  return (
    <main className="setup-wrap">
      <section className="setup-card">
        <Brand />
        <div className="eyebrow">APP LOCKED</div>
        <h1>Enter your PocketUPI PIN</h1>
        <p className="muted">Use your PIN to unlock your account.</p>
        <form className="setup-form" onSubmit={submit}>
          <label>
            App PIN
            <input
              autoFocus
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-btn">Unlock account</button>
        </form>
      </section>
    </main>
  );
}

export default LockScreenPage;

import { hashPin } from "../utils/security";
