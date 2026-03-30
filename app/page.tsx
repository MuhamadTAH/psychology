// @refresh reset
"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePostHog } from "posthog-js/react";

// ─── Blinking cursor ──────────────────────────────────────────────────────────
function Cursor() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 530);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: "10px",
        height: "1.05em",
        background: on ? "#FF0000" : "transparent",
        verticalAlign: "text-bottom",
        marginLeft: "3px",
        transition: "background 0.05s",
      }}
    />
  );
}

// ─── Glitch headline effect ───────────────────────────────────────────────────
const CHARS = "!<>-_\\/[]{}—=+*^?#01▓░▒";

function useGlitch(text: string, active: boolean) {
  const [display, setDisplay] = useState(text);
  const iter = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    iter.current = 0;
    clearInterval(timer.current!);
    timer.current = setInterval(() => {
      setDisplay(
        text.split("").map((ch, i) => {
          if (i < iter.current) return ch;
          if (ch === " ") return " ";
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      iter.current += 0.35;
      if (iter.current >= text.length) {
        clearInterval(timer.current!);
        setDisplay(text);
      }
    }, 28);
    return () => clearInterval(timer.current!);
  }, [active, text]);

  return display;
}

// ─── Suppress PWA banner on the waitlist page ─────────────────────────────────
function SuppressPWA() {
  useEffect(() => {
    // Mark as dismissed in localStorage so InstallPWA doesn't pop up
    localStorage.setItem("pwa-install-dismissed", "true");
  }, []);
  return null;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type Phase = "email" | "test_intro" | "scenario" | "evaluating" | "feedback" | "locked";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<Phase>("email");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [glitching, setGlitching] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<"A" | "B" | null>(null);

  const joinWaitlist = useMutation(api.waitlist.joinWaitlist);
  const posthog = usePostHog();

  // Dynamic Headline based on phase
  let rawHeadline = "YOU'RE ALREADY LOSING. YOU JUST DON'T SEE IT.";
  if (phase === "test_intro" || phase === "scenario" || phase === "evaluating") {
    rawHeadline = "TEST 01 INITIATED";
  } else if (phase === "feedback") {
    rawHeadline = "EVALUATION COMPLETE";
  } else if (phase === "locked") {
    rawHeadline = "SYSTEM FULL ALREADY";
  }

  // Only run the glitch effect during the email phase
  const isEmailPhase = phase === "email";
  const displayed = useGlitch(rawHeadline, glitching && isEmailPhase);

  // Trigger glitch only on mount
  useEffect(() => {
    setGlitching(true);
    const id = setTimeout(() => setGlitching(false), 900);
    return () => clearTimeout(id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    const trimmed = email.trim();
    if (!trimmed) return;

    posthog?.capture("request_access_clicked", { email: trimmed });

    setStatus("loading");
    setErrorMsg("");
    try {
      await joinWaitlist({ email: trimmed });
      setStatus("idle");
      setPhase("test_intro");
      setTimeout(() => setPhase("scenario"), 2500);
    } catch (err: any) {
      // Clean up the error message from Convex
      const raw = err?.data ? String(err.data) : (err instanceof Error ? err.message : "Something went wrong.");
      const cleanMsg = raw.replace(/^\[?ConvexError\]?\s*:?\s*/i, "");
      
      // If they are already on the waitlist, don't punish them! Let them play the game.
      if (cleanMsg.includes("already on the waitlist")) {
        setStatus("idle");
        setPhase("test_intro");
        setTimeout(() => setPhase("scenario"), 2500);
        return;
      }

      setStatus("error");
      setErrorMsg(cleanMsg);
    }
  };

  const handleAnswer = (answer: "A" | "B") => {
    setSelectedAnswer(answer);
    setPhase("evaluating");
    
    // Hidden weapon delay: 0.8s evaluating tension
    setTimeout(() => {
      setPhase("feedback");
    }, 850);
  };

  // ─── Render Body Content ─────────────────────────────────────────────────────
  let content = null;

  if (phase === "email") {
    content = (
      <>
        {/* Sub-copy */}
        <p className="wl__sub">
          They&apos;re testing you. You just don&apos;t notice.
        </p>

        {/* Micro hook */}
        <p className="wl__hook">
          PASS THE FIRST ONE. THEN YOU GET IN.
        </p>

        <div className="wl__divider" aria-hidden />

        <form className="wl__form" onSubmit={handleSubmit} noValidate>
          <input
            id="waitlist-email"
            type="email"
            className="wl__input"
            placeholder="Enter email to begin"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            disabled={status === "loading"}
            autoComplete="email"
            spellCheck={false}
            aria-label="Email address"
            required
          />

          {status === "error" && errorMsg && (
            <div className="wl__error" role="alert">
              ⚠&nbsp;&nbsp;{errorMsg}
            </div>
          )}

          <button
            id="waitlist-submit"
            type="submit"
            className="wl__btn"
            disabled={status === "loading" || !email.trim()}
          >
            {status === "loading" ? (
              <span className="wl__spin-row">
                <span className="wl__spinner" />
                VERIFYING...
              </span>
            ) : (
              "ENTER THE ARENA"
            )}
          </button>

          <div className="wl__reward">
            &rarr; Your first test starts immediately
          </div>
        </form>

        {/* FOMO */}
        <p className="wl__fomo">
          Access is filtered. <em>Not everyone gets in.</em>
          <br />
          If you hesitate, you&apos;re already out.
        </p>
      </>
    );
  } else if (phase === "test_intro") {
    content = (
      <div className="wl__scenario-wrap">
        <p className="wl__sub" style={{ color: "#FF0000", fontWeight: "bold" }}>
          Most people fail this instantly.
        </p>
        <p className="wl__sub">
          This is a preview. Full system is restricted.
        </p>
        <div className="wl__spin-row" style={{ marginTop: 24 }}>
          <span className="wl__spinner" style={{ width: 12, height: 12, borderWidth: 1 }} />
          <span style={{ fontFamily: "'Share Tech Mono', monospace", color: "#666", fontSize: 13, letterSpacing: '0.1em' }}>
            LOADING SCENARIO...
          </span>
        </div>
      </div>
    );
  } else if (phase === "scenario" || phase === "evaluating") {
    content = (
      <div className="wl__scenario-wrap">
        <p className="wl__scenario-text">
          He says: &quot;Relax, you&apos;re overreacting.&quot;
        </p>
        
        <div className="wl__scenario-opts">
          <button 
            className="wl__scenario-btn" 
            onClick={() => handleAnswer("A")}
            disabled={phase === "evaluating"}
            style={selectedAnswer === "A" ? { borderColor: "#FF0000", color: "#FFF" } : {}}
          >
            A) &quot;I&apos;m just explaining my point.&quot;
          </button>
          <button 
            className="wl__scenario-btn" 
            onClick={() => handleAnswer("B")}
            disabled={phase === "evaluating"}
            style={selectedAnswer === "B" ? { borderColor: "#FF0000", color: "#FFF" } : {}}
          >
            B) Pause. Look at him. Say: &quot;Am I?&quot;
          </button>
        </div>
        
        {phase === "evaluating" && (
          <div className="wl__scenario-eval">
            <span className="wl__spinner" style={{ width: 10, height: 10, borderWidth: 1 }} />
            Evaluating response...
          </div>
        )}
      </div>
    );
  } else if (phase === "feedback") {
    content = (
      <div className="wl__scenario-wrap">
        <div className="wl__feedback">
          {selectedAnswer === "A" 
            ? "You defended. He set the frame — you followed." 
            : "You didn't react. Now he has to adjust to you."}
        </div>
        
        <button 
          className="wl__btn" 
          style={{ marginTop: 32 }}
          onClick={() => setPhase("locked")}
        >
          CONTINUE TO DOSSIER
        </button>
      </div>
    );
  } else if (phase === "locked") {
    content = (
      <div className="wl__scenario-wrap">
        <div className="wl__locked-box">
          <h2 className="wl__locked-h2">🔒 SYSTEM NOT PUBLIC</h2>
          <p className="wl__locked-p" style={{ color: "#FFF", marginBottom: 24, fontSize: 16 }}>
            That was one scenario.<br/>
            Most people fail the next five.
          </p>
          
          <div className="wl__divider" style={{ margin: "0 auto 24px", opacity: 0.3, maxWidth: 320 }} aria-hidden />
          
          <p className="wl__locked-p" style={{ color: "#00FF9F", fontWeight: "bold" }}>
            &gt; You&apos;ve been added to the access list.
          </p>
          <p className="wl__locked-p">
            Entry opens in waves. Early users get priority.
          </p>
          
          <p className="wl__locked-p" style={{ marginTop: 32, fontSize: 13, color: "#666" }}>
            If you ignore this, you stay untrained.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SuppressPWA />

      {/* Font loaded via link to avoid SSR hydration mismatch with @import */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@700;900&display=swap" rel="stylesheet" />

      <style suppressHydrationWarning>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; background: #0A0A0A; }

        /* ── Root ───────────────────────────────────────────────────── */
        .wl {
          position: fixed; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          background: #0A0A0A;
          padding: 24px;
          overflow: hidden;
        }

        /* Scanlines */
        .wl::before {
          content: '';
          position: fixed; inset: 0;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(255,255,255,0.018) 2px, rgba(255,255,255,0.018) 4px
          );
          pointer-events: none; z-index: 1;
        }

        /* Vignette */
        .wl::after {
          content: '';
          position: fixed; inset: 0;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.92) 100%);
          pointer-events: none; z-index: 1;
        }

        .wl__inner {
          position: relative; z-index: 2;
          width: 100%; max-width: 860px;
          display: flex; flex-direction: column;
          align-items: center;
        }

        /* ── Logo ───────────────────────────────────────────────────── */
        .wl__logo {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(10px, 1.6vw, 13px);
          letter-spacing: 0.55em;
          color: #666;
          text-transform: uppercase;
          margin-bottom: clamp(28px, 5vh, 52px);
          display: flex; align-items: center; gap: 14px;
        }
        .wl__dot {
          width: 6px; height: 6px;
          background: #FF0000; border-radius: 50%;
          animation: blink 2.2s ease-in-out infinite;
        }
        .wl__dot:last-child { animation-delay: 1.1s; }
        @keyframes blink {
          0%,100% { opacity:1; box-shadow: 0 0 8px #FF0000; }
          50%      { opacity:0.25; box-shadow: none; }
        }

        /* ── Red hairline ───────────────────────────────────────────── */
        .wl__bar {
          width: 36px; height: 3px;
          background: #FF0000;
          margin-bottom: 18px;
          box-shadow: 0 0 12px rgba(255,0,0,0.6);
        }

        /* ── H1 ─────────────────────────────────────────────────────── */
        .wl__h1 {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(30px, 5.8vw, 72px);
          line-height: 0.95;
          color: #FFFFFF;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.01em;
          margin-bottom: clamp(14px, 2.5vh, 24px);
          text-shadow:
            0 0 80px rgba(255,0,0,0.12),
            0 2px 40px rgba(0,0,0,0.8);
        }

        /* ── Sub-copy ────────────────────────────────────────────────── */
        .wl__sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(12px, 1.7vw, 15px);
          color: #BDBDBD;
          text-align: center;
          line-height: 1.75;
          letter-spacing: 0.04em;
          max-width: 520px;
          margin-bottom: clamp(6px, 1.5vh, 14px);
        }

        /* ── Micro hook ─────────────────────────────────────────────── */
        .wl__hook {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(12px, 1.5vw, 15px);
          color: #FF0000;
          text-align: center;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: clamp(24px, 4vh, 40px);
          animation: subtle-pulse 2s infinite alternate;
        }
        @keyframes subtle-pulse {
          from { text-shadow: 0 0 2px rgba(255, 0, 0, 0.4); opacity: 0.9; }
          to   { text-shadow: 0 0 10px rgba(255, 0, 0, 0.8); opacity: 1; }
        }

        /* ── Divider ─────────────────────────────────────────────────── */
        .wl__divider {
          width: 100%; max-width: 480px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #2e2e2e, transparent);
          margin-bottom: clamp(24px, 4vh, 40px);
        }

        /* ── Form ────────────────────────────────────────────────────── */
        .wl__form {
          display: flex; flex-direction: column;
          align-items: center; gap: 10px;
          width: 100%; max-width: 480px;
        }

        .wl__input {
          width: 100%;
          background: #111;
          border: 1px solid #3a3a3a;
          color: #F0F0F0;
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.04em;
          padding: 16px 20px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          caret-color: #FF0000;
        }
        .wl__input::placeholder { color: #666; }
        .wl__input:focus {
          border-color: #FF0000;
          box-shadow: 0 0 22px rgba(255,0,0,0.14), inset 0 0 14px rgba(255,0,0,0.04);
        }
        .wl__input:disabled { opacity: 0.45; cursor: not-allowed; }

        /* Button */
        .wl__btn {
          width: 100%; max-width: 480px;
          background: #FF0000;
          border: none;
          color: #FFF;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 17px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          padding: 17px 20px;
          cursor: pointer;
          position: relative; overflow: hidden;
          transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
        }
        .wl__btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 55%);
          pointer-events: none;
        }
        /* Shine sweep on hover */
        .wl__btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
          transition: left 0.4s ease;
        }
        .wl__btn:hover:not(:disabled)::after { left: 150%; }
        .wl__btn:hover:not(:disabled) {
          background: #FF1A1A;
          box-shadow:
            0 0 0 1px rgba(255,0,0,0.5),
            0 0 24px rgba(255,0,0,0.55),
            0 0 60px rgba(255,0,0,0.2);
          transform: translateY(-1px);
        }
        .wl__btn:active:not(:disabled) { transform: translateY(0); }
        .wl__btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Loading row */
        .wl__spin-row { display:inline-flex; align-items:center; gap:10px; }
        .wl__spinner {
          width:14px; height:14px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.55s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Error */
        .wl__error {
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px; color: #FF5555;
          letter-spacing: 0.04em;
          text-align: center; line-height: 1.6;
        }

        /* ── Action Reward ───────────────────────────────────────────── */
        .wl__reward {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(11px, 1.4vw, 13px);
          color: #FF0000;
          text-align: center;
          margin-top: 14px;
          letter-spacing: 0.04em;
        }

        /* ── FOMO footer ─────────────────────────────────────────────── */
        .wl__fomo {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(11px, 1.4vw, 14px);
          color: #888;
          text-align: center; line-height: 1.8;
          letter-spacing: 0.05em;
          margin-top: clamp(14px, 2.5vh, 24px);
          max-width: 420px;
        }
        .wl__fomo em {
          font-style: normal;
          color: #C0C0C0;
        }

        /* ── SCENARIO FLOW ──────────────────────────────────────────── */
        .wl__scenario-wrap {
          display: flex; flex-direction: column;
          align-items: center; gap: 0;
          width: 100%; max-width: 480px;
          animation: fade-in 0.4s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .wl__scenario-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(15px, 2vw, 18px);
          color: #E0E0E0;
          line-height: 1.6;
          text-align: center;
          margin-bottom: 24px;
          background: rgba(255,255,255,0.03);
          border-left: 2px solid #333;
          padding: 16px 20px;
          width: 100%;
        }

        .wl__scenario-opts {
          display: flex; flex-direction: column; gap: 12px;
          width: 100%;
        }

        .wl__scenario-btn {
          width: 100%;
          background: #0D0D0D;
          border: 1px solid #2A2A2A;
          color: #A0A0A0;
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px;
          padding: 18px 20px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          line-height: 1.5;
        }
        .wl__scenario-btn:hover:not(:disabled) {
          border-color: #FF0000;
          background: #1A0505;
          color: #FFF;
          box-shadow: inset 2px 0 0 #FF0000;
        }
        .wl__scenario-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .wl__scenario-eval {
          font-family: 'Share Tech Mono', monospace;
          color: #FF0000;
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 24px;
          display: flex; align-items: center; gap: 10px;
          animation: pulse 1s infinite alternate;
        }
        @keyframes pulse {
          from { opacity: 0.7; }
          to { opacity: 1; text-shadow: 0 0 8px rgba(255,0,0,0.6); }
        }

        .wl__feedback {
          font-family: 'Share Tech Mono', monospace;
          font-size: clamp(15px, 2vw, 18px);
          color: #00FF9F;
          text-align: center;
          line-height: 1.6;
          max-width: 420px;
          text-shadow: 0 0 12px rgba(0,255,159,0.3);
        }

        .wl__locked-box {
          border: 1px solid #FF0000;
          background: rgba(255,0,0,0.04);
          padding: 32px 24px;
          width: 100%; max-width: 480px;
          text-align: center;
          box-shadow: 0 0 40px rgba(255,0,0,0.05);
        }
        .wl__locked-h2 {
          font-family: 'Barlow Condensed', sans-serif;
          color: #FF0000;
          font-size: clamp(22px, 3.5vw, 26px);
          letter-spacing: 0.15em;
          margin-bottom: 20px;
          text-transform: uppercase;
        }
        .wl__locked-p {
          font-family: 'Share Tech Mono', monospace;
          color: #BDBDBD;
          font-size: 14px;
          line-height: 1.7;
          margin-bottom: 12px;
        }

        /* ── Corner brackets ─────────────────────────────────────────── */
        .wl__corner {
          position: fixed; width: 18px; height: 18px;
          border-color: #2a2a2a; border-style: solid; z-index: 2;
        }
        .wl__corner--tl { top:20px; left:20px; border-width:1px 0 0 1px; }
        .wl__corner--tr { top:20px; right:20px; border-width:1px 1px 0 0; }
        .wl__corner--bl { bottom:20px; left:20px; border-width:0 0 1px 1px; }
        .wl__corner--br { bottom:20px; right:20px; border-width:0 1px 1px 0; }

        /* Version stamp */
        .wl__stamp {
          position: fixed; bottom:22px; right:26px;
          font-family:'Share Tech Mono',monospace;
          font-size:10px; color:#272727;
          letter-spacing:0.12em; z-index:2;
        }

        @media (max-width:480px) {
          .wl__corner { display:none; }
          .wl { padding:20px 16px; }
        }
      `}</style>

      {/* Corner brackets */}
      <div className="wl__corner wl__corner--tl" aria-hidden />
      <div className="wl__corner wl__corner--tr" aria-hidden />
      <div className="wl__corner wl__corner--bl" aria-hidden />
      <div className="wl__corner wl__corner--br" aria-hidden />

      <main className="wl">
        <div className="wl__inner">

          {/* Logo */}
          <div className="wl__logo" aria-label="GAMPIT">
            <span className="wl__dot" />
            GAMPIT
            <span className="wl__dot" />
          </div>

          {/* Red hairline */}
          <div className="wl__bar" aria-hidden />

          {/* Dynamic H1 */}
          <h1 className="wl__h1" aria-label={rawHeadline}>
            {isEmailPhase ? displayed : rawHeadline}
          </h1>

          {/* Dynamic Action Content based on phase */}
          {content}

        </div>
      </main>

      <div className="wl__stamp" aria-hidden>GAMPIT // PRE-LAUNCH // v0.1</div>
    </>
  );
}
