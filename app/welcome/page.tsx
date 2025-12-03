// 🧠 FILE PURPOSE
// "The Induction" - Dark Psychology onboarding experience
// Phase 0: The Gate (Cold Open + Identity Verification)

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { Shield, Eye, Lock, Terminal } from "lucide-react";

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
        {/* CSS for glitch effect, specific to coldOpen */}
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

  // Screen 0.5: Identity Verification
  if (step === "identityVerification") {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-red-900 selection:text-white">

        {/* Background Texture (Scanlines) */}
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}>
        </div>

        {/* THE "STATUE" - Replaces the Cat */}
        <div className={`mb-8 relative transition-transform duration-100 ${glitch ? '-translate-x-1 translate-y-1 opacity-80' : ''}`}>
          {/* Abstract Geometric Bust Representation */}
          <div className="w-32 h-32 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              {/* Head Silhouette */}
              <path d="M50 10 C 30 10, 25 35, 25 50 C 25 70, 35 80, 35 90 L 65 90 C 65 80, 75 70, 75 50 C 75 35, 70 10, 50 10" fill="#e5e5e5" />
              {/* The Gold Crack (Kintsugi) */}
              <path d="M50 10 L 45 30 L 55 45 L 40 60 L 50 90" fill="none" stroke="#D4AF37" strokeWidth="1.5" className="animate-pulse" />
              {/* Sensor Bar over Eyes */}
              <rect x="30" y="35" width="40" height="8" fill="#000" />
            </svg>
            {/* Glitch Overlay Elements */}
            {glitch && (
              <>
                <div className="absolute top-0 left-0 w-full h-full bg-red-500 mix-blend-multiply opacity-30 translate-x-1"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-cyan-500 mix-blend-multiply opacity-30 -translate-x-1"></div>
              </>
            )}
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-widest mb-2 text-center uppercase border-b-2 border-white pb-2">
          Identify Yourself
        </h1>

        {/* Subtext with Typewriter Effect */}
        <p className="text-gray-400 text-xs md:text-sm tracking-widest mb-12 h-6 flex items-center">
          <Terminal size={12} className="mr-2 inline-block text-red-500" />
          {fullText.substring(0, textIndex)}
          <span className="animate-pulse">_</span>
        </p>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4 z-10">

          {/* Primary Action - Existing User */}
          <button
            onClick={() => router.push("/sign-in")}
            className="group w-full border border-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 py-4 px-6 flex items-center justify-between uppercase tracking-wider text-sm"
          >
            <span>Access Existing Dossier</span>
            <Lock size={16} className="group-hover:text-black text-gray-500 transition-colors" />
          </button>

          {/* Secondary Action - New User */}
          <button
            onClick={() => router.push("/sign-up")}
            className="group w-full border border-gray-600 bg-transparent hover:border-white hover:bg-zinc-900 transition-all duration-300 py-4 px-6 flex items-center justify-between uppercase tracking-wider text-sm text-gray-300 hover:text-white"
          >
            <span>Create Operative Profile</span>
            <Shield size={16} className="group-hover:text-white text-gray-600 transition-colors" />
          </button>

          {/* Tertiary Action - Ghost Mode */}
          <button
            onClick={() => setShowGhostWarning(true)}
            className="group w-full border-t border-b border-transparent hover:border-zinc-800 py-3 px-6 flex items-center justify-center uppercase tracking-widest text-xs text-gray-600 hover:text-red-500 transition-colors mt-8"
          >
            <Eye size={12} className="mr-2" />
            <span>Proceed as Ghost</span>
          </button>

        </div>

        {/* Footer / Version */}
        <div className="absolute bottom-6 text-[10px] text-gray-700 font-mono tracking-widest">
          SECURE CONNECTION // v.0.9.2
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

        {/* CSS for fonts */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
          
          .font-mono {
            font-family: 'JetBrains Mono', monospace;
          }
        `}</style>

      </div>
    );
  }

  return null; // Should not reach here
}

// ✅ Phase 0: The Gate implemented
// - Screen 0: Cold Open (pure black + glitching video, 3s auto-advance)
// - Screen 0.5: Identity Verification (ghost buttons + Clerk integration)
