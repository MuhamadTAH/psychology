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
        {/* Optional: Small video logo at top */}
        <div className="flex justify-center mb-8">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-16 h-16 object-contain opacity-70"
          >
            <source src="/welcome-animation.webm" type="video/webm" />
          </video>
        </div>

        {/* Headline */}
        <h1 className="text-5xl font-serif text-white text-center mb-4 tracking-tight">
          Identify Yourself.
        </h1>

        {/* Subtext */}
        <p className="text-gray-400 text-center mb-12 text-sm">
          Access to this database is restricted.
        </p>

        {/* Three Ghost Buttons */}
        <div className="space-y-4">
          {/* Button 1: Sign In */}
          <button
            onClick={() => {
              // Trigger Clerk sign-in
              router.push("/sign-in");
            }}
            className="w-full py-4 px-8 bg-transparent border border-white text-white text-sm uppercase tracking-wider hover:bg-white/10 transition-colors rounded-none"
          >
            Access Existing Dossier
          </button>

          {/* Button 2: Sign Up */}
          <button
            onClick={() => {
              // Trigger Clerk sign-up
              router.push("/sign-up");
            }}
            className="w-full py-4 px-8 bg-transparent border border-white text-white text-sm uppercase tracking-wider hover:bg-white/10 transition-colors rounded-none"
          >
            Create Operative Profile
          </button>

          {/* Button 3: Ghost Mode */}
          <button
            onClick={() => setShowGhostWarning(true)}
            className="w-full py-4 px-8 bg-transparent border border-white text-white text-sm uppercase tracking-wider hover:bg-white/10 transition-colors rounded-none"
          >
            Proceed as Ghost
          </button>
        </div>

        {/* Demo Exit Link (subtle) */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-gray-600 hover:text-gray-400 text-xs uppercase tracking-wider transition-colors"
          >
            Exit Demo
          </button>
        </div>
      </div>

      {/* Ghost Mode Warning Modal */}
      {showGhostWarning && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center px-6 z-50">
          <div className="bg-zinc-900 border-2 border-red-600 max-w-md w-full p-8 rounded-none">
            <h2 className="text-2xl font-serif text-white mb-4">Warning: Ghost Mode</h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              Data will not be encrypted or saved across devices. Your progress will be lost when you close this session.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowGhostWarning(false)}
                className="flex-1 py-3 px-6 bg-transparent border border-white text-white text-sm uppercase tracking-wider hover:bg-white/10 transition-colors rounded-none"
              >
                Cancel
              </button>
              <button
                onClick={() => router.push("/dark-psychology-dashboard")}
                className="flex-1 py-3 px-6 bg-red-600 border border-red-600 text-white text-sm uppercase tracking-wider hover:bg-red-700 transition-colors rounded-none"
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for glitch effect */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        
        .font-serif {
          font-family: 'Playfair Display', serif;
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
