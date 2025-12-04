// 🧠 FILE PURPOSE
// "The Induction" - Dark Psychology onboarding experience
// Phase 0: The Gate (Cold Open + Identity Verification)

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { Shield, Eye, Lock, Terminal, MessageSquare, Scale, CheckCircle, ArrowRight, ArrowDown } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { signUp } = useSignUp();

  const [step, setStep] = useState<"coldOpen" | "identityVerification" | "loginForm" | "phase1_awareness" | "phase1_solution" | "phase1_ethics" | "phase2_assessment" | "phase3_lockdown" | "phase3_result">("coldOpen");
  const [showGhostWarning, setShowGhostWarning] = useState(false);
  const [statueState, setStatueState] = useState<"idle" | "nod" | "evaluate" | "suspicion" | "explain" | "judging">("idle");
  const [ethicsAgreed, setEthicsAgreed] = useState(false);

  // Phase 2: Assessment State
  const [assessmentQuestion, setAssessmentQuestion] = useState(0);
  const [assessmentScore, setAssessmentScore] = useState({ defense: 0, influence: 0, strategic: 0 });
  const [userArchetype, setUserArchetype] = useState<string | null>(null);
  const [showComputing, setShowComputing] = useState(false);

  // Login Form State
  const [loginError, setLoginError] = useState(false);
  const [formData, setFormData] = useState({ identifier: "", password: "" });

  // Identity Verification State
  const [glitch, setGlitch] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const fullText = "ACCESS TO THIS DATABASE IS RESTRICTED.";

  // Auto-advance from Cold Open after 3 seconds
  useEffect(() => {
    if (step === "coldOpen") {
      const timer = setTimeout(() => {
        setStep("identityVerification");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Typewriter effect
  useEffect(() => {
    if (step === "identityVerification" && textIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTextIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [textIndex, step]);

  // Random glitch effect
  useEffect(() => {
    if (step === "identityVerification") {
      const interval = setInterval(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 200);
      }, 4000);
      return () => clearInterval(interval);
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
  if (step === "identityVerification" || step === "loginForm") {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-red-900 selection:text-white">

        {/* Background Texture (Scanlines) */}
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}>
        </div>

        {/* THE "STATUE" - Replaces the Cat */}
        <div className={`mb-8 relative transition-all duration-500 
          ${glitch ? '-translate-x-1 translate-y-1 opacity-80' : ''}
          ${statueState === 'evaluate' ? 'scale-125' : ''}
          ${statueState === 'nod' ? 'animate-nod' : ''}
        `}>
          {/* Abstract Geometric Bust Representation */}
          <div className="w-32 h-32 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              {/* Head Silhouette */}
              <path d="M50 10 C 30 10, 25 35, 25 50 C 25 70, 35 80, 35 90 L 65 90 C 65 80, 75 70, 75 50 C 75 35, 70 10, 50 10" fill={statueState === 'suspicion' ? "#2a0a0a" : "#e5e5e5"} className="transition-colors duration-500" />
              {/* The Gold Crack (Kintsugi) */}
              <path d="M50 10 L 45 30 L 55 45 L 40 60 L 50 90" fill="none" stroke="#D4AF37" strokeWidth="1.5" className="animate-pulse" />
              {/* Sensor Bar over Eyes */}
              <rect x="30" y="35" width="40" height={statueState === 'suspicion' ? "4" : "8"} fill={statueState === 'suspicion' ? "#ff0000" : "#000"} className="transition-all duration-300" />
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
        {/* Action Buttons - Only show if NOT in login form mode */}
        {step === "identityVerification" && (
          <div className="w-full max-w-sm space-y-4 z-10">

            {/* Primary Action - Existing User */}
            <button
              onClick={() => {
                setStep("loginForm");
                setStatueState("nod");
              }}
              className="group w-full border border-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 py-4 px-6 flex items-center justify-between uppercase tracking-wider text-sm"
            >
              <span>Access Existing Dossier</span>
              <Lock size={16} className="group-hover:text-black text-gray-500 transition-colors" />
            </button>

            {/* Secondary Action - New User */}
            <button
              onClick={() => {
                setStatueState("evaluate");
                setTimeout(() => setStep("phase1_awareness"), 800);
              }}
              className="group w-full border border-gray-600 bg-transparent hover:border-white hover:bg-zinc-900 transition-all duration-300 py-4 px-6 flex items-center justify-between uppercase tracking-wider text-sm text-gray-300 hover:text-white"
            >
              <span>Create Operative Profile</span>
              <Shield size={16} className="group-hover:text-white text-gray-600 transition-colors" />
            </button>

            {/* Tertiary Action - Ghost Mode */}
            <button
              onClick={() => {
                setStatueState("suspicion");
                setGlitch(true);
                setTimeout(() => setGlitch(false), 500);
                setShowGhostWarning(true);
              }}
              className="group w-full border-t border-b border-transparent hover:border-zinc-800 py-3 px-6 flex items-center justify-center uppercase tracking-widest text-xs text-gray-600 hover:text-red-500 transition-colors mt-8"
            >
              <Eye size={12} className="mr-2" />
              <span>Proceed as Ghost</span>
            </button>

          </div>
        )}

        {/* Inline Login Form */}
        {step === "loginForm" && (
          <div className={`w-full max-w-sm space-y-4 z-10 ${loginError ? 'animate-shake' : 'animate-slide-up'}`}>
            <div className="space-y-2">
              <label className="text-xs text-gray-500 uppercase tracking-widest">Agent ID</label>
              <input
                type="email"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                className="w-full bg-zinc-900/50 border border-gray-700 p-3 text-white font-mono text-sm focus:border-white focus:outline-none transition-colors"
                placeholder="ENTER EMAIL"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-500 uppercase tracking-widest">Decryption Key</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-zinc-900/50 border border-gray-700 p-3 text-white font-mono text-sm focus:border-white focus:outline-none transition-colors"
                placeholder="ENTER PASSWORD"
              />
            </div>

            <button
              onClick={async () => {
                if (!isLoaded || !signIn) return;

                try {
                  const result = await signIn.create({
                    identifier: formData.identifier,
                    password: formData.password,
                  });

                  if (result.status === "complete") {
                    await setActive({ session: result.createdSessionId });
                    // Visual Success Feedback
                    const btn = document.getElementById('login-btn');
                    if (btn) {
                      btn.innerText = "IDENTITY VERIFIED";
                      btn.classList.remove('bg-white', 'text-black');
                      btn.classList.add('bg-green-500', 'text-black', 'border-green-500');
                    }
                    setTimeout(() => {
                      router.push("/dark-psychology-dashboard");
                    }, 800);
                  }
                } catch (err) {
                  setLoginError(true);
                  setGlitch(true);
                  setTimeout(() => {
                    setLoginError(false);
                    setGlitch(false);
                  }, 1500);
                }
              }}
              id="login-btn"
              className={`w-full py-4 px-6 uppercase tracking-widest text-sm font-bold transition-all duration-200 mt-4 ${loginError
                ? 'bg-red-900/20 border border-red-600 text-red-500 animate-pulse'
                : 'bg-white text-black hover:bg-gray-200'
                }`}
            >
              {loginError ? "ACCESS DENIED - INTRUDER ALERT" : "Verify Identity"}
            </button>

            {/* Google Login */}
            <button
              onClick={() => {
                if (!isLoaded || !signIn) return;
                signIn.authenticateWithRedirect({
                  strategy: "oauth_google",
                  redirectUrl: "/sso-callback",
                  redirectUrlComplete: "/dark-psychology-dashboard",
                });
              }}
              className="w-full border border-zinc-700 bg-zinc-900/50 text-gray-400 py-4 px-6 uppercase tracking-widest text-xs hover:bg-zinc-800 hover:text-white transition-colors mt-4 flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Authenticate via Google</span>
            </button>

            <button
              onClick={() => {
                setStep("identityVerification");
                setStatueState("idle");
              }}
              className="w-full text-center text-xs text-gray-600 uppercase tracking-widest hover:text-white transition-colors mt-4"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Footer / Version */}
        <div className="absolute bottom-6 text-[10px] text-gray-700 font-mono tracking-widest">
          SECURE CONNECTION // v.0.9.2
        </div>

        {/* Ghost Mode Warning Modal */}
        {showGhostWarning && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center px-6 z-50">
            <div className="bg-black border border-red-600 max-w-md w-full p-8 rounded-none shadow-[0_0_20px_rgba(220,38,38,0.2)]">
              <h2 className="text-xl font-mono text-red-500 mb-4 uppercase tracking-widest">UNSECURED CONNECTION DETECTED</h2>
              <p className="text-gray-400 mb-8 text-xs font-mono leading-relaxed uppercase">
                Ghost operatives cannot save progress. All combat data will be purged upon exit. Proceed?
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowGhostWarning(false);
                    setStatueState("idle");
                  }}
                  className="flex-1 py-3 px-6 bg-transparent border border-gray-600 text-gray-400 text-xs font-mono uppercase tracking-widest hover:bg-white/5 transition-colors rounded-none"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowGhostWarning(false);
                    setStep("phase1_awareness");
                  }}
                  className="flex-1 py-3 px-6 bg-red-900/20 border border-red-600 text-red-500 text-xs font-mono uppercase tracking-widest hover:bg-red-900/40 transition-colors rounded-none"
                >
                  Initialize Ghost Mode
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

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          .animate-shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          }

          @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-slide-up {
            animation: slide-up 0.5s ease-out forwards;
          }

          @keyframes scan {
            0% { top: -10%; opacity: 0; }
            50% { opacity: 1; }
            100% { top: 110%; opacity: 0; }
          }

          .animate-scan {
            animation: scan 2s linear infinite;
            background: linear-gradient(to bottom, transparent, #10b981, transparent);
            height: 100px;
            width: 100%;
            position: absolute;
            left: 0;
            z-index: 20;
            pointer-events: none;
          }

          @keyframes nod {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(10px); }
          }
          
          .animate-nod {
            animation: nod 0.4s ease-in-out;
          }
        `}</style>

        {/* Green Scan Line for Login Mode */}
        {step === "loginForm" && (
          <div className="animate-scan"></div>
        )}

        {/* Cold Overlay for Sign Up Evaluation */}
        <div className={`absolute inset-0 bg-blue-900/20 pointer-events-none transition-opacity duration-500 ${statueState === 'evaluate' ? 'opacity-100' : 'opacity-0'}`}></div>

      </div>
    );
  }

  // Phase 1.0: The Awareness ("The Hook")
  if (step === "phase1_awareness") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div key="phase1_awareness" className="animate-slide-in-right flex flex-col items-center">
          {/* Statue: Idle (Observing) */}
          <div className="mb-8 opacity-80">
            <div className="w-24 h-24 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <path d="M50 10 C 30 10, 25 35, 25 50 C 25 70, 35 80, 35 90 L 65 90 C 65 80, 75 70, 75 50 C 75 35, 70 10, 50 10" fill="#e5e5e5" />
                <path d="M50 10 L 45 30 L 55 45 L 40 60 L 50 90" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                <rect x="30" y="35" width="40" height="8" fill="#000" />
              </svg>
            </div>
          </div>

          {/* Visual: Puppet String (Abstract) */}
          <div className="mb-12 relative w-full max-w-xs h-32 flex items-center justify-center">
            <div className="absolute inset-0 border-t border-gray-800 animate-pulse"></div>
            <div className="w-1 h-32 bg-gray-800 absolute top-0 left-1/2 -translate-x-1/2 origin-top animate-swing"></div>
            <Eye size={48} className="text-white relative z-10" />
          </div>

          <h1 className="text-2xl md:text-3xl font-mono font-bold text-white tracking-widest uppercase mb-6">
            You are being played.
          </h1>
          <p className="text-gray-400 font-mono text-xs md:text-sm max-w-md leading-relaxed mb-12">
            Every day, hidden psychological scripts are used to influence your decisions. It's time you saw the strings.
          </p>

          <button
            onClick={() => {
              setStep("phase1_solution");
              setStatueState("explain");
            }}
            className="group border border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300 py-4 px-8 flex items-center justify-center gap-3 uppercase tracking-widest text-sm font-mono"
          >
            <span>Explain</span>
            <ArrowDown size={16} className="group-hover:translate-y-1 transition-transform" />
          </button>
        </div>

        <style jsx>{`
          @keyframes swing {
            0%, 100% { transform: translateX(-50%) rotate(-5deg); }
            50% { transform: translateX(-50%) rotate(5deg); }
          }
          .animate-swing {
            animation: swing 3s ease-in-out infinite;
          }
          .animate-fade-in {
            animation: fadeIn 1s ease-out forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // Phase 1.1: The Solution ("The Arsenal")
  if (step === "phase1_solution") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div key="phase1_solution" className="animate-slide-in-right flex flex-col items-center">
          {/* Statue: Explain (Hand Gesture / Glowing) */}
          <div className="mb-8 opacity-90">
            <div className="w-24 h-24 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <path d="M50 10 C 30 10, 25 35, 25 50 C 25 70, 35 80, 35 90 L 65 90 C 65 80, 75 70, 75 50 C 75 35, 70 10, 50 10" fill="#e5e5e5" />
                <path d="M50 10 L 45 30 L 55 45 L 40 60 L 50 90" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                <rect x="30" y="35" width="40" height="8" fill="#000" />
                {/* Hand Gesture Representation */}
                <circle cx="80" cy="70" r="10" fill="#fff" className="animate-pulse opacity-50" />
              </svg>
            </div>
          </div>

          {/* Visual: Shield/Speech */}
          <div className="mb-12 relative w-full max-w-xs h-32 flex items-center justify-center gap-4">
            <Shield size={48} className="text-gray-600" />
            <ArrowRight size={24} className="text-gray-800" />
            <MessageSquare size={48} className="text-white" />
          </div>

          <h1 className="text-2xl md:text-3xl font-mono font-bold text-white tracking-widest uppercase mb-6">
            Master the Unspoken Rules.
          </h1>
          <p className="text-gray-400 font-mono text-xs md:text-sm max-w-md leading-relaxed mb-12">
            Learn the advanced negotiation and persuasion tactics used by elite leaders. Stop being a spectator. Become the player.
          </p>

          <button
            onClick={() => {
              setStep("phase1_ethics");
              setStatueState("judging");
            }}
            className="group border border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300 py-4 px-8 flex items-center justify-center gap-3 uppercase tracking-widest text-sm font-mono"
          >
            <span>Start Training</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Phase 1.2: The Ethics ("The Warning")
  if (step === "phase1_ethics") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div key="phase1_ethics" className="animate-slide-in-right flex flex-col items-center">
          {/* Statue: Judging (Red Eyes) */}
          <div className="mb-8 opacity-100">
            <div className="w-24 h-24 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                <path d="M50 10 C 30 10, 25 35, 25 50 C 25 70, 35 80, 35 90 L 65 90 C 65 80, 75 70, 75 50 C 75 35, 70 10, 50 10" fill="#2a0a0a" />
                <path d="M50 10 L 45 30 L 55 45 L 40 60 L 50 90" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                <rect x="30" y="35" width="40" height="4" fill="#ff0000" className="animate-pulse" />
              </svg>
            </div>
          </div>

          {/* Visual: Vault/Scale */}
          <div className="mb-12 relative w-full max-w-xs h-32 flex items-center justify-center">
            <Scale size={64} className="text-red-900" />
          </div>

          <h1 className="text-2xl md:text-3xl font-mono font-bold text-red-500 tracking-widest uppercase mb-6">
            With Influence Comes Responsibility.
          </h1>
          <p className="text-gray-400 font-mono text-xs md:text-sm max-w-md leading-relaxed mb-12">
            This curriculum teaches powerful psychological principles. We provide these tools for <span className="text-white font-bold">defensive purposes only</span>. Ethics are mandatory.
          </p>

          {/* Mandatory Checkbox */}
          <div
            onClick={() => setEthicsAgreed(!ethicsAgreed)}
            className="flex items-center gap-4 mb-12 cursor-pointer group"
          >
            <div className={`w-6 h-6 border transition-colors flex items-center justify-center ${ethicsAgreed ? 'bg-white border-white' : 'border-gray-600 group-hover:border-white'}`}>
              {ethicsAgreed && <CheckCircle size={16} className="text-black" />}
            </div>
            <span className={`font-mono text-xs uppercase tracking-wider ${ethicsAgreed ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
              I Agree to the Code of Ethics
            </span>
          </div>

          <button
            onClick={() => {
              setStep("phase2_assessment");
              setStatueState("idle");
            }}
            disabled={!ethicsAgreed}
            className={`group border transition-all duration-300 py-4 px-8 flex items-center justify-center gap-3 uppercase tracking-widest text-sm font-mono ${ethicsAgreed
              ? 'border-red-600 bg-red-900/20 text-red-500 hover:bg-red-900/40 cursor-pointer'
              : 'border-gray-800 text-gray-800 cursor-not-allowed'
              }`}
          >
            <span>Proceed</span>
            <ArrowRight size={16} className={ethicsAgreed ? "group-hover:translate-x-1 transition-transform" : ""} />
          </button>
        </div>
      </div>
    );
  }

  // Phase 2: The Assessment
  if (step === "phase2_assessment") {
    const questions = [
      {
        headline: "Why do you seek this knowledge?",
        options: [
          { text: "To protect myself from manipulation.", type: "defense" },
          { text: "To master high-level persuasion.", type: "influence" }
        ]
      },
      {
        headline: "A colleague takes credit for your work in a meeting. You...",
        options: [
          { text: "Confront them immediately.", type: "aggressive" },
          { text: "Wait and complain privately.", type: "passive" },
          { text: "Ask a strategic question to expose their ignorance.", type: "strategic" }
        ]
      },
      {
        headline: "What is your ultimate objective?",
        options: [
          { text: "Invulnerability.", type: "defense" },
          { text: "Command & Authority.", type: "influence" }
        ]
      }
    ];

    const currentQ = questions[assessmentQuestion];

    const handleAnswer = (type: string) => {
      const newScore = { ...assessmentScore };
      if (type === 'defense' || type === 'influence' || type === 'strategic') {
        newScore[type as keyof typeof assessmentScore] = (assessmentScore[type as keyof typeof assessmentScore] || 0) + 1;
      }
      setAssessmentScore(newScore);

      if (assessmentQuestion < 2) {
        setAssessmentQuestion(prev => prev + 1);
      } else {
        // Finished Assessment - Calculate Result
        setShowComputing(true);
        setTimeout(() => {
          // Determine archetype
          let archetype = "TACTICAL ANALYST";
          if (newScore.strategic >= 1) {
            archetype = "DARK PSYCHOLOGIST";
          } else if (newScore.defense > newScore.influence) {
            archetype = "DEFENSIVE STRATEGIST";
          } else if (newScore.influence > newScore.defense) {
            archetype = "ASSERTIVE NEGOTIATOR";
          }
          setUserArchetype(archetype);
          setShowComputing(false);
          setStep("phase3_result");
        }, 3000);
      }
    };

    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div key={assessmentQuestion} className="animate-slide-in-right flex flex-col items-center w-full">
          {/* Progress Bar */}
          <div className="w-full max-w-md h-1 bg-gray-900 mb-12 relative">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${((assessmentQuestion + 1) / 3) * 100}%` }}
            ></div>
          </div>

          {/* Statue: Idle (Observing) */}
          <div className="mb-8 opacity-80">
            <div className="w-20 h-20 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <path d="M50 10 C 30 10, 25 35, 25 50 C 25 70, 35 80, 35 90 L 65 90 C 65 80, 75 70, 75 50 C 75 35, 70 10, 50 10" fill="#e5e5e5" />
                <path d="M50 10 L 45 30 L 55 45 L 40 60 L 50 90" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                <rect x="30" y="35" width="40" height="8" fill="#000" />
              </svg>
            </div>
          </div>

          <h2 className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-4">
            Assessment {assessmentQuestion + 1} / {questions.length}
          </h2>

          <h1 className="text-xl md:text-2xl font-mono font-bold text-white tracking-wider uppercase mb-12 max-w-lg">
            {currentQ.headline}
          </h1>

          <div className={`grid gap-4 w-full max-w-2xl ${currentQ.options.length === 3 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option.type)}
                className="group border border-white bg-transparent hover:bg-white hover:text-black p-6 flex items-center justify-center gap-4 transition-all duration-300"
              >
                {idx === 0 && <Shield size={24} className="text-white group-hover:text-black transition-colors" />}
                {idx === 1 && <Eye size={24} className="text-white group-hover:text-black transition-colors" />}
                {idx === 2 && <Terminal size={24} className="text-white group-hover:text-black transition-colors" />}
                <span className="font-mono text-xs uppercase tracking-widest text-white group-hover:text-black transition-colors">
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Phase 2.5: Computing Animation
  if (showComputing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mb-8">
            <Terminal size={64} className="text-white mx-auto animate-pulse" />
          </div>
          <h1 className="text-2xl font-mono text-white tracking-widest uppercase mb-4 animate-pulse">
            Computing...
          </h1>
          <div className="w-64 h-1 bg-gray-900 mx-auto relative overflow-hidden">
            <div className="absolute h-full bg-white animate-scan-horizontal"></div>
          </div>
        </div>
        <style jsx>{`
          @keyframes scan-horizontal {
            0% { width: 0%; left: 0%; }
            50% { width: 100%; left: 0%; }
            100% { width: 0%; left: 100%; }
          }
          .animate-scan-horizontal {
            animation: scan-horizontal 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // Phase 3: The Analysis (Result)
  if (step === "phase3_result") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <div className="animate-slide-in-right max-w-md">
          {/* Statue: Approving */}
          <div className="mb-8 opacity-100">
            <div className="w-24 h-24 relative mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <path d="M50 10 C 30 10, 25 35, 25 50 C 25 70, 35 80, 35 90 L 65 90 C 65 80, 75 70, 75 50 C 75 35, 70 10, 50 10" fill="#e5e5e5" />
                <path d="M50 10 L 45 30 L 55 45 L 40 60 L 50 90" fill="none" stroke="#D4AF37" strokeWidth="1.5" className="animate-pulse" />
                <rect x="30" y="35" width="40" height="8" fill="#000" />
              </svg>
            </div>
          </div>

          <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">
            Profile Generated
          </h2>

          <div className="border-2 border-white p-8 mb-12">
            <h1 className="text-2xl md:text-3xl font-mono font-bold text-white tracking-widest uppercase">
              {userArchetype}
            </h1>
          </div>

          <p className="text-gray-400 font-mono text-xs mb-12">
            Your custom curriculum is ready.
          </p>

          <button
            onClick={() => {
              // Reset for demo purposes
              setStep("coldOpen");
              setStatueState("idle");
              setAssessmentQuestion(0);
              setAssessmentScore({ defense: 0, influence: 0, strategic: 0 });
              setEthicsAgreed(false);
              setUserArchetype(null);
            }}
            className="border border-white bg-transparent text-white hover:bg-white hover:text-black py-4 px-8 text-xs font-mono uppercase tracking-widest transition-colors"
          >
            Enter The System
          </button>
        </div>
      </div>
    );
  }

  // Phase 3: Account Lockdown (Old Placeholder - Keep for now)
  if (step === "phase3_lockdown") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center animate-fade-in">
        <div className="max-w-md">
          <h1 className="text-3xl font-mono text-white tracking-widest uppercase mb-4">
            Analysis Complete.
          </h1>
          <p className="text-gray-400 font-mono text-sm mb-8">
            Your psychological profile has been generated.
            <br />
            <span className="text-white font-bold">
              Result: {assessmentScore.defense > assessmentScore.influence ? "DEFENSIVE STRATEGIST" : "INFLUENCE SPECIALIST"}
            </span>
          </p>
          <button
            onClick={() => {
              // Reset for demo purposes as requested
              setStep("coldOpen");
              setStatueState("idle");
              setAssessmentQuestion(0);
              setAssessmentScore({ defense: 0, influence: 0, strategic: 0 });
              setEthicsAgreed(false);
            }}
            className="border border-white py-3 px-6 text-xs font-mono uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            Restart Simulation
          </button>
        </div>
      </div>
    );
  }

  return null; // Should not reach here
}

// ✅ Phase 0: The Gate implemented
// - Screen 0: Cold Open (pure black + glitching video, 3s auto-advance)
// - Screen 0.5: Identity Verification (ghost buttons + Clerk integration)
