import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  ImagePlus,
  ScanLine,
  ShieldCheck,
  X,
} from "lucide-react";
import { parseUpiQr } from "../utils/upiQr";

function ScanPayPage({ onBack, onSubmit }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanTimerRef = useRef(null);
  const detectingRef = useRef(false);

  const [scannerOn, setScannerOn] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [details, setDetails] = useState(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [scanStatus, setScanStatus] = useState("Camera is off");

  const stopCamera = useCallback(() => {
    if (scanTimerRef.current) {
      window.clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    detectingRef.current = false;
    setScannerOn(false);
    setScanStatus("Camera is off");
  }, []);

  const acceptCode = useCallback(
    (value) => {
      try {
        const decoded = parseUpiQr(value);
        setDetails(decoded);
        setAmount(decoded.amount || "");
        setManualCode(value);
        setError("");
        stopCamera();
      } catch (issue) {
        setError(issue?.message || "This QR code is not a valid UPI payment code.");
      }
    },
    [stopCamera],
  );

  async function startCamera() {
    setError("");
    if (!("BarcodeDetector" in window)) {
      setError(
        "QR scanning is not supported by this browser. Try a Chromium-based browser or upload a QR image.",
      );
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is not available in this browser.");
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = mediaStream;
      setScannerOn(true);
      setScanStatus("Looking for a UPI QR code…");
    } catch {
      setError("Camera permission was denied or the camera is unavailable.");
      setScanStatus("Camera unavailable");
    }
  }

  useEffect(() => {
    if (!scannerOn || !streamRef.current || !videoRef.current) return undefined;

    const video = videoRef.current;
    const mediaStream = streamRef.current;
    const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
    let active = true;

    video.srcObject = mediaStream;

    const scanFrame = async () => {
      if (!active || !streamRef.current) return;

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !detectingRef.current) {
        detectingRef.current = true;
        try {
          const codes = await detector.detect(video);
          if (codes[0]?.rawValue) {
            acceptCode(codes[0].rawValue);
            return;
          }
        } catch {
          setError("Unable to read this camera frame. Keep the QR code inside the frame.");
        } finally {
          detectingRef.current = false;
        }
      }

      if (active) {
        // Check the live camera frame every 700ms. No scan button is needed.
        scanTimerRef.current = window.setTimeout(scanFrame, 700);
      }
    };

    video
      .play()
      .then(() => {
        setScanStatus("Scanning automatically");
        scanFrame();
      })
      .catch(() => {
        setError("The camera could not start. Check browser camera permissions.");
        stopCamera();
      });

    return () => {
      active = false;
      if (scanTimerRef.current) {
        window.clearTimeout(scanTimerRef.current);
        scanTimerRef.current = null;
      }
      if (video.srcObject === mediaStream) video.srcObject = null;
    };
  }, [scannerOn, acceptCode, stopCamera]);

  useEffect(
    () => () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);
    },
    [],
  );

  async function scanImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (!("BarcodeDetector" in window)) {
        throw new Error("Image QR scanning is not supported by this browser.");
      }
      const bitmap = await createImageBitmap(file);
      try {
        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        const codes = await detector.detect(bitmap);
        if (!codes[0]?.rawValue) throw new Error("No QR code found in that image.");
        acceptCode(codes[0].rawValue);
      } finally {
        bitmap.close();
      }
    } catch (issue) {
      setError(issue.message || "Could not scan that image.");
    } finally {
      event.target.value = "";
    }
  }

  async function pay(event) {
    event.preventDefault();
    const value = Number(amount);
    if (!details) {
      setError("Scan a QR code or enter UPI payment details first.");
      return;
    }
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    setError("");
    await onSubmit({
      type: "send",
      amount: value,
      recipient: details.name,
      identifier: details.vpa,
      category: "Other",
      note: details.note || "QR payment practice",
    });
  }

  function goBack() {
    stopCamera();
    onBack();
  }

  return (
    <>
      {!details ? (
        <main className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[#080d0b] text-white">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-32 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-emerald-700/10 blur-3xl" />
          </div>

          <header className="relative z-10 flex items-center justify-between px-5 pb-4 pt-[max(18px,env(safe-area-inset-top))] sm:px-8">
            <button
              onClick={goBack}
              aria-label="Go back"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] transition hover:bg-white/10"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400">Pocket Pay</p>
              <h1 className="mt-1 text-lg font-semibold tracking-tight">Scan & pay</h1>
            </div>
            <div className="h-11 w-11" />
          </header>

          <section className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col px-5 pb-7 sm:px-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Scan any UPI QR</h2>
                <p className="mt-1 text-sm text-white/50">Place the code inside the frame.</p>
              </div>
              <span className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium ${scannerOn ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-white/10 bg-white/[0.04] text-white/45"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${scannerOn ? "animate-pulse bg-emerald-400" : "bg-white/30"}`} />
                {scannerOn ? "LIVE" : "STANDBY"}
              </span>
            </div>

            <div className="relative isolate flex min-h-[310px] flex-1 items-center justify-center overflow-hidden rounded-[30px] border border-white/10 bg-[#111a16] shadow-2xl shadow-black/20 sm:min-h-[390px]">
              {scannerOn ? (
                <video ref={videoRef} playsInline muted className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.10),_transparent_65%)]">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300">
                    <ScanLine size={36} strokeWidth={1.5} />
                  </div>
                  <p className="mt-5 text-sm font-medium text-white/75">Your scanner is ready</p>
                  <p className="mt-1 text-xs text-white/40">Turn on the camera to begin</p>
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-black/10" />
              <div className="pointer-events-none relative z-10 aspect-square w-[min(70%,280px)]">
                <div className="absolute inset-0 rounded-[28px] border border-white/20" />
                <span className="absolute -left-px -top-px h-10 w-10 rounded-tl-[28px] border-l-[3px] border-t-[3px] border-emerald-400" />
                <span className="absolute -right-px -top-px h-10 w-10 rounded-tr-[28px] border-r-[3px] border-t-[3px] border-emerald-400" />
                <span className="absolute -bottom-px -left-px h-10 w-10 rounded-bl-[28px] border-b-[3px] border-l-[3px] border-emerald-400" />
                <span className="absolute -bottom-px -right-px h-10 w-10 rounded-br-[28px] border-b-[3px] border-r-[3px] border-emerald-400" />
                {scannerOn && <span className="absolute left-4 right-4 top-1/2 h-px animate-scan bg-emerald-300 shadow-[0_0_14px_2px_rgba(52,211,153,0.8)]" />}
              </div>

              {scannerOn && (
                <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/45 px-3 py-2 text-xs text-white/80 backdrop-blur-md">
                  {scanStatus}
                </div>
              )}
            </div>

            <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
              <button
                onClick={scannerOn ? stopCamera : startCamera}
                className="flex min-h-14 items-center justify-center gap-2.5 rounded-2xl bg-emerald-400 px-5 text-sm font-semibold text-[#062016] transition hover:bg-emerald-300 active:scale-[0.98]"
              >
                {scannerOn ? <X size={19} /> : <Camera size={19} />}
                {scannerOn ? "Turn camera off" : "Open camera"}
              </button>
              <label className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-sm font-medium text-white transition hover:bg-white/10 active:scale-[0.98]">
                <ImagePlus size={19} className="text-emerald-300" />
                <span className="hidden sm:inline">Upload QR</span>
                <span className="sm:hidden">Upload</span>
                <input type="file" accept="image/*" onChange={scanImage} className="hidden" />
              </label>
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <label htmlFor="manual-upi" className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                Enter UPI payment link instead
              </label>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (manualCode.trim()) acceptCode(manualCode.trim());
                }}
                className="flex gap-2 rounded-2xl border border-white/10 bg-white/[0.05] p-1.5 focus-within:border-emerald-400/50"
              >
                <input
                  id="manual-upi"
                  value={manualCode}
                  onChange={(event) => setManualCode(event.target.value)}
                  placeholder="upi://pay?pa=name@bank"
                  className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25"
                />
                <button type="submit" disabled={!manualCode.trim()} aria-label="Use UPI link" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-300 transition hover:bg-emerald-400 hover:text-[#062016] disabled:cursor-not-allowed disabled:opacity-30">
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>

            {error && <p className="mt-4 rounded-xl border border-red-400/15 bg-red-400/[0.07] px-4 py-3 text-sm text-red-300" role="alert">{error}</p>}

            
          </section>
        </main>
      ) : (
        <main className="scan-details-screen min-h-screen bg-[#f5f7f6] px-5 pb-10 pt-8 text-gray-900">
          <header className="flex items-center gap-4">
            <button onClick={() => { setDetails(null); setError(""); }} className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm" aria-label="Back to scanner">
              <ArrowLeft size={20} />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">QR scanned</p>
              <strong className="text-lg">Payment details</strong>
            </div>
          </header>

          <section className="scan-detail-card mt-8 rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-2xl font-bold text-emerald-600">
              {details.name.slice(0, 1).toUpperCase()}
            </div>
            <p className="mt-5 text-[11px] font-semibold tracking-[0.18em] text-gray-400">PAYING TO</p>
            <h2 className="mt-2 text-xl font-bold text-gray-900">{details.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{details.vpa}</p>
            {details.note && <p className="mt-3 text-sm text-gray-400">{details.note}</p>}
            <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <CheckCircle2 size={14} /> QR details verified
            </div>
          </section>

          <section className="scan-detail-card mt-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Enter payment amount</h2>
            <p className="mt-1 text-sm text-gray-500">Review the recipient and amount before continuing.</p>
            <form className="mt-6 space-y-5" onSubmit={pay}>
              <label className="block text-sm font-medium text-gray-600">
                Amount (INR)
                <input type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-4 text-2xl font-semibold text-gray-900 outline-none focus:border-emerald-500" />
              </label>
              {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98]" type="submit">
                Continue to PIN <ArrowRight size={18} />
              </button>
            </form>
          </section>

          <div className="mt-6 text-center text-xs text-gray-400">
            <ShieldCheck size={14} className="mr-1 inline" />
            Practice mode · No real payments
          </div>
        </main>
      )}
    </>
  );
}

export default ScanPayPage;
