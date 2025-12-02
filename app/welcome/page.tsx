// 🧠 FILE PURPOSE
// "The Induction" - Dark Psychology onboarding experience
// Phase 0: The Gate (Cold Open + Identity Verification)

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignIn, useSignUp } from "@clerk/nextjs";

export default function WelcomePage() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const [step, setStep] = useState<"coldOpen" | "identityVerification">("coldOpen");
  const [showGhostWarning, setShowGhostWarning] = useState(false);

  // Auto-advance from Cold Open after 3 seconds
  useEffect(() => {
    if (step === "coldOpen") {
      const timer = setTimeout(() => {
        setStep("identityVerification");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Screen 0: Cold Open - Pure black with glitching video
  if (step === "coldOpen") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-64 h-64 object-contain glitch-video"
          >
            <source src="/welcome-animation.webm" type="video/webm" />
          </video>
        </div>
      </div>
    );
  }

  // Screen 0.5: Identity Verification
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Video logo removed per strict visual directives */}

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-mono text-white text-center mb-4 tracking-tighter">
          IDENTIFY YOURSELF.
        </h1>

        {/* Subtext */}
        <p className="text-gray-400 text-center mb-12 text-sm font-mono">
          ACCESS TO THIS DATABASE IS RESTRICTED.
        </p>

        {/* Three Ghost Buttons */}
        <div className="space-y-4">
          {/* Button 1: Sign In */}
          <button
            onClick={() => {
              // Trigger Clerk sign-in
              router.push("/sign-in");
            }}
            className="w-full py-4 px-8 bg-transparent border border-white text-white text-sm font-mono uppercase tracking-[0.2em] hover:bg-white/10 transition-colors rounded-none"
          >
            Access Existing Dossier
          </button>

          {/* Button 2: Sign Up */}
          <button
            onClick={() => {
              // Trigger Clerk sign-up
              router.push("/sign-up");
            }}
            className="w-full py-4 px-8 bg-transparent border border-white text-white text-sm font-mono uppercase tracking-[0.2em] hover:bg-white/10 transition-colors rounded-none"
          >
            Create Operative Profile
          </button>

          {/* Button 3: Ghost Mode */}
          <button
            onClick={() => setShowGhostWarning(true)}
            className="w-full py-4 px-8 bg-transparent border border-white text-white text-sm font-mono uppercase tracking-[0.2em] hover:bg-white/10 transition-colors rounded-none"
          >
            Proceed as Ghost
          </button>
        </div>

        {/* Demo Exit Link (subtle) */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-gray-700 hover:text-gray-500 text-[10px] font-mono uppercase tracking-widest transition-colors"
          >
            Exit Demo
          </button>
        </div>
      </div>

      {/* Ghost Mode Warning Modal */}
      {showGhostWarning && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center px-6 z-50">
          <div className="bg-black border border-red-600 max-w-md w-full p-8 rounded-none shadow-[0_0_20px_rgba(220,38,38,0.2)]">
            <h2 className="text-xl font-mono text-red-500 mb-4 uppercase tracking-widest">Warning: Ghost Mode</h2>
            <p className="text-gray-400 mb-8 text-xs font-mono leading-relaxed uppercase">
              Data will not be encrypted or saved across devices. Your progress will be lost when you close this session.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowGhostWarning(false)}
                className="flex-1 py-3 px-6 bg-transparent border border-gray-600 text-gray-400 text-xs font-mono uppercase tracking-widest hover:bg-white/5 transition-colors rounded-none"
              >
                Cancel
              </button>
              <button
                onClick={() => router.push("/dark-psychology-dashboard")}
                className="flex-1 py-3 px-6 bg-red-900/20 border border-red-600 text-red-500 text-xs font-mono uppercase tracking-widest hover:bg-red-900/40 transition-colors rounded-none"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for glitch effect */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }

        @keyframes glitch {
          0%, 100% {
            filter: contrast(1.2) brightness(0.9);
            transform: translate(0);
          }
          10% {
            filter: contrast(1.5) brightness(0.7) hue-rotate(5deg);
            transform: translate(-2px, 2px);
          }
          20% {
            transform: translate(2px, -2px);
          }
          30% {
            transform: translate(-2px, -2px);
          }
          40% {
            transform: translate(2px, 2px);
          }
          45% {
            filter: contrast(1.2) brightness(0.9);
            transform: translate(0);
          }
        }

        .glitch-video {
          animation: glitch 3s infinite;
        }
      `}</style>
    </div>
  );
}

// ✅ Phase 0: The Gate implemented
// - Screen 0: Cold Open (pure black + glitching video, 3s auto-advance)
// - Screen 0.5: Identity Verification (ghost buttons + Clerk integration)
