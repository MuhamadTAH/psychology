"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "entering" | "locked";

// Preload the audio statically at the module level so the browser fetches it immediately in the background
let preloadedCheckmarkAudio: HTMLAudioElement | null = null;
if (typeof window !== "undefined") {
  preloadedCheckmarkAudio = new Audio("/VIdeo/Sound%20effect/Check%20mark%20sound%20effect.mp4");
  preloadedCheckmarkAudio.volume = 0.6;
  preloadedCheckmarkAudio.preload = "auto";
}

export default function CheckmarkAnimation({ isCompleted }: { isCompleted: boolean }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [showRing, setShowRing] = useState(false);
  const prevCompleted = useRef(false);

  useEffect(() => {
    // Only trigger when transitioning from false → true
    if (isCompleted && !prevCompleted.current) {
      setPhase("entering");
      setShowRing(true);

      // Trigger the preloaded sound effect instantly
      try {
        if (preloadedCheckmarkAudio) {
          // Reset time in case it was already played rapidly
          preloadedCheckmarkAudio.currentTime = 0;
          preloadedCheckmarkAudio.play().catch(console.error);
        } else {
          // Failsafe if SSR check messed up
          const audio = new Audio("/VIdeo/Sound%20effect/Check%20mark%20sound%20effect.mp4");
          audio.volume = 0.6;
          audio.play().catch(console.error);
        }
      } catch (e) {
        console.error("DEBUG: Audio checkmark failed", e);
      }

      // LOCK-IN at 100ms — checkmark at full scale, ring expands
      const lockTimer = setTimeout(() => {
        setPhase("locked");
      }, 100);

      // Extinguish ring at 300ms
      const ringTimer = setTimeout(() => {
        setShowRing(false);
      }, 300);

      prevCompleted.current = true;
      return () => {
        clearTimeout(lockTimer);
        clearTimeout(ringTimer);
      };
    }

    if (!isCompleted) {
      prevCompleted.current = false;
      setPhase("idle");
      setShowRing(false);
    }
  }, [isCompleted]);

  if (!isCompleted) return null;

  return (
    <span className="relative inline-flex items-center justify-center w-5 h-5 flex-shrink-0">
      {/* Shock ring */}
      {showRing && (
        <span
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px solid rgba(34, 197, 94, 0.4)",
            animation: "ck-ring 280ms ease-out forwards",
          }}
        />
      )}

      {/* Icon container */}
      <span
        className="relative flex items-center justify-center w-5 h-5 rounded-full"
        style={{
          animation:
            phase === "entering"
              ? "ck-enter 120ms ease-out forwards"
              : undefined,
          opacity: phase === "idle" ? 0 : 1,
          transform: phase === "idle" ? "scale(0.95)" : "scale(1)",
          filter:
            phase === "entering"
              ? "drop-shadow(0 0 4px rgba(34, 197, 94, 0.35))"
              : "none",
          transition: "filter 200ms ease-out",
        }}
      >
        {/* SVG checkmark — raw path, no extra elements */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M2 7L5.5 10.5L12 4"
            stroke="#22c55e"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 14,
              strokeDashoffset: phase === "idle" ? 14 : 0,
              transition: "stroke-dashoffset 180ms ease-out",
            }}
          />
        </svg>
      </span>

      {/* CSS keyframes injected inline to avoid global stylesheet dependency */}
      <style>{`
        @keyframes ck-enter {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes ck-ring {
          from { transform: scale(1);   opacity: 0.3; }
          to   { transform: scale(1.5); opacity: 0;   }
        }
      `}</style>
    </span>
  );
}
