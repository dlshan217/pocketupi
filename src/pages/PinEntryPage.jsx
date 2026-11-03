import { useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Brand from "../components/Brand";
import { hashPin } from "../utils/security";

function PinEntryPage({ pinRecord, title, subtitle, onBack, onVerified }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const length = pinRecord?.length || 4;
  async function verify(value) {
    setChecking(true);
    const valid = pinRecord
      ? (await hashPin(value, pinRecord.salt)) === pinRecord.hash
      : /^\d{4,8}$/.test(value);
    setChecking(false);
    if (!valid) {
      setPin("");
      setError("That PIN did not match. Try again.");
      return;
    }
    setError("");
    onVerified();
  }
  function addDigit(digit) {
    if (checking || pin.length >= length) return;
    const next = pin + digit;
    setPin(next);
    setError("");
    if (next.length === length) void verify(next);
  }
return (
  <main className="pin-entry-screen fixed inset-0 z-50 flex min-h-[100dvh] flex-col overflow-y-auto bg-[#f8f9fb] text-gray-900">

    {/* Header */}
    <header className="flex items-center justify-between px-6 pt-[max(24px,env(safe-area-inset-top))]">
      <button
        onClick={onBack}
        className="flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium shadow-sm active:scale-95"
      >
        <ArrowLeft size={18} />
       
      </button>

      
    </header>

    

    {/* PIN Content */}
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-7 pt-12">

      {/* Lock Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
        <ShieldCheck size={30} strokeWidth={1.8} />
      </div>

      {/* Heading */}
      <h1 className="mt-7 text-center text-2xl font-bold tracking-tight">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-2 max-w-[280px] text-center text-sm leading-relaxed text-gray-500">
          {subtitle}
        </p>
      )}

      {/* PIN Dots */}
      <div
        className="mt-10 flex items-center justify-center gap-5"
        aria-label={`${pin.length} of ${length} digits entered`}
      >
        {Array.from({ length }, (_, index) => (
          <span
            key={index}
            className={`h-4 w-4 rounded-full border-2 transition-all duration-200 ${
              index < pin.length
                ? "scale-110 border-green-600 bg-green-600"
                : "border-gray-300 bg-transparent"
            }`}
          />
        ))}
      </div>

      {/* Error */}
      <div
        className={`pin-error-slot mt-5${error ? " has-error" : ""}`}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        {error}
      </div>

      {/* Numeric Keypad */}
      <div className="mt-10 grid w-full max-w-[320px] grid-cols-3 gap-x-5 gap-y-4">

        {[
          "1", "2", "3",
          "4", "5", "6",
          "7", "8", "9",
          "clear", "0", "delete",
        ].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              if (key === "clear") {
                setPin("");
                setError("");
              } else if (key === "delete") {
                setPin((value) => value.slice(0, -1));
                setError("");
              } else {
                addDigit(key);
              }
            }}
            aria-label={
              key === "delete"
                ? "Delete digit"
                : key === "clear"
                  ? "Clear PIN"
                  : `Digit ${key}`
            }
        className={`pin-key flex aspect-square max-h-[76px] items-center justify-center rounded-2xl transition-all duration-150 active:scale-90 ${
              key === "clear" || key === "delete"
                ? "pin-key-subtle bg-gray-100 text-gray-500 hover:bg-gray-200"
                : "border border-gray-100 bg-white text-2xl font-semibold shadow-sm hover:bg-green-50 hover:text-green-700"
            }`}
          >
            {key === "clear" ? (
              <span className="text-xs font-semibold">CLEAR</span>
            ) : key === "delete" ? (
              <span className="text-2xl">⌫</span>
            ) : (
              key
            )}
          </button>
        ))}

      </div>

      {/* Helper */}
      {!pinRecord && (
        <div className="pin-practice-note mt-7 flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs leading-relaxed text-blue-700">
          <ShieldCheck size={16} className="mt-0.5 shrink-0" />
          No PIN set yet. Any 4-digit code works in practice mode.
        </div>
      )}

    </section>

    

  </main>
);
}

export default PinEntryPage;
