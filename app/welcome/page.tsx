// 🧠 FILE PURPOSE
// "The Induction" - Dark Psychology onboarding experience
// Phase 0: The Gate (Cold Open + Identity Verification)

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { ArrowRight, CheckSquare, Shield, Eye, Terminal, Lock, ArrowDown, MessageSquare, Scale, CheckCircle, Folder, AlertTriangle } from "lucide-react";
import ScanTransition from "@/components/ScanTransition";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Step: Declare Paddle global type for TypeScript
declare global {
  interface Window {
    Paddle: any;
  }
}

export default function WelcomePage() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { signUp } = useSignUp();
  const setSubscription = useMutation(api.gamification.setSubscriptionStatus);

  const [step, setStep] = useState<"coldOpen" | "identityVerification" | "loginForm" | "phase1_awareness" | "phase1_solution" | "phase1_ethics" | "phase2_assessment" | "phase3_calculation" | "phase3_commitment" | "phase3_paywall" | "phase3_lockdown" | "phase3_result">("coldOpen");

  // Step: Initialize Paddle on component mount
  // This loads Paddle payment system with sandbox credentials
  // Sandbox mode uses test_ token prefix, production uses live_ prefix
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Paddle) {
      window.Paddle.Initialize({
        token: 'test_ccebce130edda8da55f5ecd309b',
      });
    }
  }, []);
  const [showGhostWarning, setShowGhostWarning] = useState(false);
  const [statueState, setStatueState] = useState<"idle" | "nod" | "evaluate" | "suspicion" | "explain" | "judging">("idle");
  const [ethicsAgreed, setEthicsAgreed] = useState(false);

  // Phase 2: Assessment State
  const [assessmentQuestion, setAssessmentQuestion] = useState(-1);
  const [assessmentScore, setAssessmentScore] = useState({ defense: 0, influence: 0, strategic: 0 });
  const [userArchetype, setUserArchetype] = useState<string | null>(null);
  const [showComputing, setShowComputing] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({}); // Track answers by question index

  // Login Form State
  const [loginError, setLoginError] = useState(false);
  const [formData, setFormData] = useState({ identifier: "", password: "" });

  // Phase 2: Reaction State (for showing character reactions after answers)
  const [showReaction, setShowReaction] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Character animation state
  const [currentAnimation, setCurrentAnimation] = useState<'thinking' | 'correct' | 'wrong'>('thinking');
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  // Typewriter effect state
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [borderPulse, setBorderPulse] = useState(true);

  // Identity Verification State
  const [glitch, setGlitch] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const fullText = "ACCESS TO THIS DATABASE IS RESTRICTED.";

  // Phase 3: Calculation State (must be at top level, not inside if block)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Phase 3: Payment State
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
  const [showWalkOfShame, setShowWalkOfShame] = useState(false);

  // Manual skip for Cold Open - removed auto-advance
  // useEffect(() => {
  //   if (step === "coldOpen") {
  //     const timer = setTimeout(() => {
  //       setStep("identityVerification");
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [step]);

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
        setTimeout(() => setGlitch(false), 100);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Typewriter effect for reactions
  useEffect(() => {
    if (!showReaction || !selectedReaction) return;

    let currentIndex = 0;
    setDisplayedText('');
    setBorderPulse(true);

    // Border pulse for 300ms
    const pulseTimer = setTimeout(() => {
      setBorderPulse(false);
    }, 300);

    // Typewriter effect: 25ms per character
    const typeInterval = setInterval(() => {
      if (currentIndex < selectedReaction.length) {
        setDisplayedText(selectedReaction.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 25);

    // Cursor blinking
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearTimeout(pulseTimer);
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, [showReaction, selectedReaction]);

  // Character video animation control
  useEffect(() => {
    if (!videoRef) return;

    let isInitialized = false;

    const handleTimeUpdate = () => {
      if (!isInitialized) return;

      if (currentAnimation === 'thinking') {
        if (videoRef.currentTime >= 6.15) {
          videoRef.currentTime = 0;
        }
      } else if (currentAnimation === 'correct') {
        if (videoRef.currentTime >= 22.12) {
          videoRef.pause();
          setCurrentAnimation('thinking');
        }
      } else if (currentAnimation === 'wrong') {
        if (videoRef.currentTime >= 18.15) {
          videoRef.pause();
          setCurrentAnimation('thinking');
        }
      }
    };

    const initializeAnimation = async () => {
      if (!videoRef.isConnected) return;

      if (currentAnimation === 'thinking') {
        videoRef.currentTime = 0;
      } else if (currentAnimation === 'correct') {
        videoRef.currentTime = 19.15;
      } else if (currentAnimation === 'wrong') {
        videoRef.currentTime = 15.30;
      }

      setTimeout(() => {
        if (videoRef.isConnected) {
          isInitialized = true;
          videoRef.play().catch(() => { });
        }
      }, 50);
    };

    initializeAnimation();
    videoRef.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      videoRef.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentAnimation, videoRef]);

  // Phase 3 Calculation: Dynamic message cycling
  useEffect(() => {
    if (step === "phase3_calculation") {
      const interval = setInterval(() => {
        setCurrentMessageIndex(prev => {
          // We'll calculate max based on userAnswers
          const maxMessages = 5; // Will be updated dynamically in render
          if (prev < maxMessages - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [step, userAnswers]);

  // Screen 0: Cold Open - Pure black with glitching video
  if (step === "coldOpen") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex justify-center relative" onClick={() => setStep("identityVerification")}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-64 h-64 object-contain glitch-video cursor-pointer"
          >
            <source src="/logo-animation.webm" type="video/webm" />
          </video>
          {/* Skip hint */}
          <div className="absolute bottom-0 text-gray-700 text-xs font-mono uppercase tracking-widest animate-pulse">
            Click to continue
          </div>
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

        {/* Character Animation - Absolute fixed position at top */}
        <div className="absolute top-4 md:top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-72 h-72 md:w-96 md:h-96 object-contain"
            onTimeUpdate={(e) => {
              const video = e.currentTarget;
              if (video.currentTime >= 6.15) {
                video.currentTime = 0;
              }
            }}
          >
            <source src="/animations/character-standing.webm" type="video/webm" />
          </video>
        </div>

        <div className="relative z-20 mt-56 md:mt-72">
          {/* Main Headline */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-widest mb-2 text-center uppercase border-b-2 border-white pb-2">
            Identify Yourself
          </h1>

          {/* Subtext with Typewriter Effect */}
          <p className="text-gray-400 text-xs md:text-sm tracking-widest mb-12 h-6 flex items-center justify-center">
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
        </div>

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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center relative">
        {/* Character Animation - Absolute fixed position at top */}
        <div className="absolute top-4 md:top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-72 h-72 md:w-96 md:h-96 object-contain"
            onTimeUpdate={(e) => {
              const video = e.currentTarget;
              if (video.currentTime >= 6.15) {
                video.currentTime = 0;
              }
            }}
          >
            <source src="/animations/character-standing.webm" type="video/webm" />
          </video>
        </div>

        <div key="phase1_awareness" className="animate-slide-in-right flex flex-col items-center relative z-20 mt-56 md:mt-72">

          {/* Visual: Eye Icon */}
          <div className="mb-12 relative w-full max-w-xs h-32 flex items-center justify-center">
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
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center relative">
        {/* Character Animation - Absolute fixed position at top */}
        <div className="absolute top-4 md:top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-72 h-72 md:w-96 md:h-96 object-contain"
            onTimeUpdate={(e) => {
              const video = e.currentTarget;
              if (video.currentTime >= 6.15) {
                video.currentTime = 0;
              }
            }}
          >
            <source src="/animations/character-standing.webm" type="video/webm" />
          </video>
        </div>

        <div key="phase1_solution" className="animate-slide-in-right flex flex-col items-center relative z-20 mt-56 md:mt-72">

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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center relative">
        {/* Character Animation - Absolute fixed position at top */}
        <div className="absolute top-4 md:top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-72 h-72 md:w-96 md:h-96 object-contain"
            onTimeUpdate={(e) => {
              const video = e.currentTarget;
              if (video.currentTime >= 6.15) {
                video.currentTime = 0;
              }
            }}
          >
            <source src="/animations/character-standing.webm" type="video/webm" />
          </video>
        </div>

        <div key="phase1_ethics" className="animate-slide-in-right flex flex-col items-center relative z-20 mt-56 md:mt-72">

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

  // Phase 2.0: The Transition (Military HUD Scanner)
  if (step === "phase2_assessment" && assessmentQuestion === -1) {
    return (
      <ScanTransition onComplete={() => setAssessmentQuestion(0)} />
    );
  }

  // Manual skip for Analyzing screen - removed auto-advance
  // useEffect(() => {
  //   if (step === "phase2_assessment" && assessmentQuestion === -1) {
  //     const timer = setTimeout(() => {
  //       setAssessmentQuestion(0);
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [step, assessmentQuestion]);

  // Phase 2: The Assessment (Questions)
  if (step === "phase2_assessment") {
    const questions = [
      {
        strategist: "First, state your intent.",
        headline: "Why do you seek this knowledge?",
        options: [
          { text: "To stop others from controlling me.", type: "defense", reaction: "A prudent choice. Shields up." },
          { text: "To advance my career and lead others.", type: "influence", reaction: "Ambition is useful. We will sharpen it." },
          { text: "To understand human behavior.", type: "psychology", reaction: "Knowledge is power. But application is control." }
        ]
      },
      {
        strategist: "The most dangerous manipulator is yourself.",
        headline: "Do you destroy your own success just as you achieve it?",
        options: [
          { text: "Frequently.", type: "sabotage", reaction: "Self-sabotage is a subconscious script. We will rewrite it." },
          { text: "Sometimes.", type: "sabotage", reaction: "Self-sabotage is a subconscious script. We will rewrite it." },
          { text: "Rarely.", type: "confident", reaction: "Good. Confidence is vital." }
        ]
      },
      {
        strategist: "If you are prey, you attract predators.",
        headline: "Do you find yourself constantly surrounded by toxic or narcissistic personalities?",
        options: [
          { text: "Yes, it keeps happening.", type: "vulnerable", reaction: "You are broadcasting vulnerability. We must change your frequency." },
          { text: "Only in the workplace.", type: "workplace", reaction: "Confined toxicity is still toxicity. We will address it." },
          { text: "No, I spot them early.", type: "vigilant", reaction: "Excellent. Vigilance is working." }
        ]
      },
      {
        strategist: "Data point: High Emotional Intelligence correlates with executive leadership success.",
        headline: "Are you prepared to do what is necessary to lead?",
        options: [
          { text: "I will do whatever it takes.", type: "ruthless", reaction: "Ruthlessness is a tool. Use it wisely." },
          { text: "I want to lead, but ethically.", type: "ethical", reaction: "Ethics are a luxury of the powerful." },
          { text: "I prefer to stay in the background.", type: "background", reaction: "The shadow is a strategic position. We will teach you to strike from it." }
        ]
      },
      {
        strategist: "Look at this image. What do you see first?",
        headline: "[VISUAL PLACEHOLDER: Ambiguous Image]",
        options: [
          { text: "The Skull (The Threat).", type: "threat", reaction: "You are threat-focused. Good for defense." },
          { text: "The Mirror (The Opportunity).", type: "opportunity", reaction: "You are opportunity-focused. Good for influence." }
        ]
      },
      {
        strategist: "Honesty is required. How do you currently handle conflict?",
        headline: "",
        options: [
          { text: "I stay quiet to keep the peace.", type: "avoidance", reaction: "Silence is a vulnerability." },
          { text: "I fight back immediately.", type: "confrontation", reaction: "Reactive emotion is a weakness." },
          { text: "I wait for the right moment.", type: "strategy", reaction: "Patience is a weapon.", correct: true }
        ]
      },
      {
        strategist: "Let us test your instincts.",
        headline: "A counterpart smiles while delivering bad news. What does it mean?",
        options: [
          { text: "They are nervous.", type: "wrong", correct: false, reaction: "Incorrect. You missed the micro-aggression." },
          { text: "They are hiding hostility.", type: "correct", correct: true, reaction: "Correct. Duper's Delight." },
          { text: "They are trying to soften the blow.", type: "wrong", correct: false, reaction: "Incorrect. You missed the micro-aggression." }
        ]
      }
    ];

    const currentQ = questions[assessmentQuestion];

    const handleAnswer = (option: any) => {
      // Track user's answer
      setUserAnswers(prev => ({ ...prev, [assessmentQuestion]: option.type }));

      // If no reaction, skip directly to next question (play correct animation for any answer)
      if (!option.reaction) {
        setCurrentAnimation('correct');
        setTimeout(() => {
          setCurrentAnimation('thinking');
          if (assessmentQuestion < 6) {
            setAssessmentQuestion(prev => prev + 1);
          } else {
            setStep("phase3_calculation");
          }
        }, 3000);
        return;
      }

      // Show reaction first and trigger animation
      if (option.correct !== undefined) {
        setIsCorrect(option.correct);
        setStatueState(option.correct ? "nod" : "suspicion");
        // Trigger correct or wrong animation
        setCurrentAnimation(option.correct ? 'correct' : 'wrong');
      } else {
        // No specific correct/wrong, play correct animation
        setCurrentAnimation('correct');
      }
      setSelectedReaction(option.reaction);
      setShowReaction(true);

      // After 2 seconds, move to next question or finish
      setTimeout(() => {
        setShowReaction(false);
        setStatueState("idle");
        setIsCorrect(null);
        setCurrentAnimation('thinking');

        if (assessmentQuestion < 6) {
          setAssessmentQuestion(prev => prev + 1);
        } else {
          // Finished Assessment - Go to Phase 3
          setStep("phase3_calculation");
        }
      }, 2500);
    };

    if (showReaction) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center relative">
          {/* Character Animation - Absolute fixed position at top */}
          <div className="absolute top-4 md:top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
            <video
              ref={(ref) => setVideoRef(ref)}
              autoPlay
              loop
              muted
              playsInline
              className="w-72 h-72 md:w-96 md:h-96 object-contain"
            >
              <source src="/animations/character-standing.webm" type="video/webm" />
            </video>
          </div>

          <div className="max-w-md animate-slide-in-right relative z-20 mt-56 md:mt-72">

            {/* Text Box with Border Pulse */}
            <div
              className={`border - 2 p - 6 transition - all duration - 300 ${borderPulse
                ? (isCorrect === false ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'border-white shadow-[0_0_20px_rgba(255,255,255,0.5)]')
                : 'border-gray-700'
                } `}
            >
              <p className={`font - mono text - sm tracking - wider italic ${isCorrect === false ? 'text-red-500' : 'text-gray-300'} `}>
                "{displayedText}
                {displayedText.length < (selectedReaction?.length || 0) && showCursor && (
                  <span className="inline-block">█</span>
                )}
                {displayedText.length === (selectedReaction?.length || 0) && showCursor && (
                  <span className="inline-block">█</span>
                )}
                "
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center relative">
        {/* Character Animation - Absolute fixed position at top */}
        <div className="absolute top-4 md:top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <video
            ref={(ref) => setVideoRef(ref)}
            autoPlay
            loop
            muted
            playsInline
            className="w-72 h-72 md:w-96 md:h-96 object-contain"
          >
            <source src="/animations/character-standing.webm" type="video/webm" />
          </video>
        </div>

        <div key={assessmentQuestion} className="animate-slide-in-right flex flex-col items-center max-w-2xl mx-auto relative z-20 mt-56 md:mt-80">
          {/* Progress Bar */}
          <div className="w-full max-w-md h-1 bg-gray-900 mb-12 relative">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${((assessmentQuestion + 1) / 7) * 100}% ` }}
            ></div>
          </div>

          <h2 className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-2">
            Assessment {assessmentQuestion + 1} / 7
          </h2>

          <p className="text-gray-400 font-mono text-sm italic mb-8 max-w-lg">
            "{currentQ.strategist}"
          </p>

          {currentQ.headline && (
            <h1 className="text-xl md:text-2xl font-mono font-bold text-white tracking-wider uppercase mb-12 max-w-lg">
              {currentQ.headline}
            </h1>
          )}

          <div className="grid grid-cols-1 gap-4 w-full max-w-2xl">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className="group border border-white bg-transparent hover:bg-white hover:text-black p-6 flex items-center justify-start gap-4 transition-all duration-300 text-left"
              >
                <span className="font-mono text-xs uppercase tracking-wider text-white group-hover:text-black transition-colors">
                  {String.fromCharCode(65 + idx)})
                </span>
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
          @keyframes scan - horizontal {
            0 % { width: 0 %; left: 0 %; }
            50 % { width: 100 %; left: 0 %; }
            100 % { width: 0 %; left: 100 %; }
          }
          .animate - scan - horizontal {
        animation: scan - horizontal 2s ease -in -out infinite;
      }
      `}</style>
      </div>
    );
  }

  // Phase 3.0: The Calculation (Dynamic Tag Injection)
  if (step === "phase3_calculation") {
    // Generate dynamic messages based on user answers
    const dynamicMessages = [];

    // Q1: Intent (index 0)
    if (userAnswers[0] === 'defense') {
      dynamicMessages.push('OPTIMIZING SHIELD PROTOCOLS...');
    } else if (userAnswers[0] === 'influence') {
      dynamicMessages.push('CALIBRATING PERSUASION VECTORS...');
    }

    // Q2: Self-Sabotage (index 1)
    if (userAnswers[1] === 'sabotage') {
      dynamicMessages.push('DETECTING SUBCONSCIOUS LOOPS...');
    }

    // Q6: Conflict Avoidance (index 5)
    if (userAnswers[5] === 'avoidance') {
      dynamicMessages.push('CONFIDENCE TRAINING REQUIRED...');
    }

    // Q7: Micro-Test Wrong (index 6)
    if (userAnswers[6] === 'wrong') {
      dynamicMessages.push('VULNERABILITY DETECTED...');
    }

    // Always show
    dynamicMessages.push('ENCRYPTING DATA...');

    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center relative">
        {/* Character Animation - Absolute fixed position at top */}
        <div className="absolute top-4 md:top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-72 h-72 md:w-96 md:h-96 object-contain"
            onTimeUpdate={(e) => {
              const video = e.currentTarget;
              if (video.currentTime >= 6.15) {
                video.currentTime = 0;
              }
            }}
          >
            <source src="/animations/character-standing.webm" type="video/webm" />
          </video>
        </div>

        <div className="text-center animate-slide-in-right relative z-20 mt-56 md:mt-72">
          <h1 className="text-2xl font-mono text-white tracking-widest uppercase mb-4 animate-pulse">
            Compiling Operative Profile...
          </h1>

          {/* Dynamic Messages */}
          <div className="h-32 flex flex-col items-center justify-center mb-8">
            {dynamicMessages.slice(0, currentMessageIndex + 1).map((msg, idx) => (
              <p
                key={idx}
                className={`font - mono text - xs mb - 2 transition - all duration - 500 ${idx === currentMessageIndex ? 'text-white font-bold animate-pulse' : 'text-gray-700'
                  } `}
                style={{
                  animation: idx === currentMessageIndex ? 'glitch 0.3s infinite' : 'none'
                }}
              >
                {msg}
              </p>
            ))}
          </div>

          <div className="w-64 h-1 bg-gray-900 mx-auto relative overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${((currentMessageIndex + 1) / dynamicMessages.length) * 100}%` }}
            ></div>
          </div>

          {/* Skip Button */}
          <button
            onClick={() => setStep("phase3_commitment")}
            className="mt-8 border border-gray-700 bg-transparent text-gray-500 hover:border-white hover:text-white py-3 px-6 text-xs font-mono uppercase tracking-widest transition-colors"
          >
            Continue
          </button>
        </div>

        <style jsx>{`
      @keyframes scan - horizontal {
        0 % { width: 0 %; left: 0 %; }
        50 % { width: 100 %; left: 0 %; }
        100 % { width: 0 %; left: 100 %; }
      }
          .animate - scan - horizontal {
      animation: scan - horizontal 2s ease -in -out infinite;
    }
    @keyframes glitch {
      0 %, 100 % { text- shadow: 2px 0 #ff0000, -2px 0 #00ffff;
    }
    50 % { text- shadow: -2px 0 #ff0000, 2px 0 #00ffff;
  }
}
`}</style>
      </div>
    );
  }

  // Phase 3.1: The Commitment (Streak Setting)
  if (step === "phase3_commitment") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <div className="animate-slide-in-right max-w-md">
          {/* CHARACTER PLACEHOLDER */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gray-800 mx-auto border border-gray-600 flex items-center justify-center">
              <span className="text-gray-600 text-xs">STATUE</span>
            </div>
          </div>

          <p className="text-gray-400 font-mono text-sm italic mb-8">
            "Consistency is not a habit. It is survival."
          </p>

          <h1 className="text-2xl font-mono font-bold text-white tracking-wider uppercase mb-12">
            Set Your Training Intensity
          </h1>

          <div className="grid grid-cols-1 gap-4 w-full">
            <button
              onClick={() => setStep("phase3_paywall")}
              className="group border border-gray-700 bg-transparent hover:border-white hover:bg-white hover:text-black p-6 flex flex-col items-center justify-center gap-2 transition-all duration-300"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-gray-500 group-hover:text-black transition-colors">
                Casual
              </span>
              <span className="font-mono text-xs text-gray-600 group-hover:text-black transition-colors">
                I will train occasionally.
              </span>
              <span className="font-mono text-xs italic text-red-800 group-hover:text-red-600 transition-colors">
                "Mediocrity is a choice."
              </span>
            </button>

            <button
              onClick={() => setStep("phase3_paywall")}
              className="group border border-white bg-transparent hover:bg-white hover:text-black p-6 flex flex-col items-center justify-center gap-2 transition-all duration-300"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-white group-hover:text-black transition-colors">
                Serious
              </span>
              <span className="font-mono text-xs text-gray-400 group-hover:text-black transition-colors">
                I will train daily.
              </span>
              <span className="font-mono text-xs italic text-green-600 group-hover:text-green-800 transition-colors">
                "Good. We begin immediately."
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Phase 3.2: The Clearance (The Paywall/Tactical Pricing)
  if (step === "phase3_paywall") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        {/* Walk of Shame Modal */}
        {showWalkOfShame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-900/20 backdrop-blur-sm animate-fade-in">
            <div className="bg-black border-2 border-red-600 p-8 max-w-sm w-full shadow-[0_0_50px_rgba(220,38,38,0.5)] animate-shake">
              {/* Glitching Character - Red */}
              <div className="mb-6">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-24 h-24 mx-auto object-contain"
                  style={{ filter: 'hue-rotate(0deg) saturate(200%) brightness(0.8) sepia(100%) saturate(500%) hue-rotate(-50deg)' }} // Very Red
                >
                  <source src="/welcome-animation.webm" type="video/webm" />
                </video>
              </div>

              <h2 className="text-red-500 font-mono text-lg font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                <AlertTriangle size={20} />
                WARNING
              </h2>

              <p className="text-gray-300 font-mono text-xs mb-8 leading-relaxed">
                You are declining advanced weaponry. You will enter the field unprotected. This decision is illogical.
                <br /><br />
                Confirm?
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setShowWalkOfShame(false)}
                  className="w-full bg-white text-black font-mono text-xs font-bold uppercase py-3 tracking-widest hover:bg-gray-200"
                >
                  Go Back
                </button>
                <button
                  onClick={async () => {
                    try {
                      // Set as free user
                      await setSubscription({
                        status: "free",
                      });
                      router.push("/dark-psychology-dashboard");
                    } catch (error) {
                      router.push("/dark-psychology-dashboard");
                    }
                  }}
                  className="w-full bg-transparent border border-red-900 text-red-900 font-mono text-[10px] uppercase py-3 tracking-widest hover:text-red-500 hover:border-red-500 transition-colors"
                >
                  I Accept Mediocrity
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={`animate-slide-in-right max-w-lg w-full ${showWalkOfShame ? 'blur-sm grayscale' : ''}`}>

          {/* Top Secret Folder Icon */}
          <div className="mb-8 relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-yellow-600/10 rounded-lg transform rotate-3"></div>
            <Folder size={80} className="text-yellow-700 mx-auto relative z-0" fill="#4d3a1e" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-black p-2 rounded-full border border-red-900">
              <Lock className="text-red-500 w-8 h-8" />
            </div>
          </div>

          <h1 className="text-2xl font-mono font-bold text-white tracking-widest uppercase mb-2">
            Clearance Required
          </h1>

          <p className="text-gray-400 font-mono text-xs mb-8">
            Select your contract duration.
          </p>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

            {/* Card A: The Hero (Annual) */}
            <div
              onClick={() => setSelectedPlan('annual')}
              className={`relative border-2 p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between ${selectedPlan === 'annual' ? 'border-white bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'border-gray-800 opacity-50 hover:opacity-80'}`}
            >
              {/* Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-black text-[10px] font-bold px-3 py-1 uppercase tracking-wide whitespace-nowrap shadow-lg">
                Founding Offer: -75%
              </div>

              <div className="mt-2">
                <h3 className="text-gray-400 font-mono text-[10px] uppercase tracking-widest mb-4">12 Month Assignment</h3>
                <div className="flex flex-col items-center">
                  <span className="text-gray-600 line-through text-xs font-mono">$239.99</span>
                  <span className="text-white text-2xl font-mono font-bold my-1">$59.99<span className="text-xs font-normal text-gray-500">/yr</span></span>
                  <span className="text-green-400 text-xs font-mono font-bold">That is $4.99 / mo</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-gray-300 text-[10px] font-mono">Includes 7-Day Field Test</p>
                <p className="text-gray-500 text-[10px] font-mono italic">You are not charged today.</p>
              </div>
            </div>

            {/* Card B: The Decoy (Mercenary) */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`relative border-2 p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between ${selectedPlan === 'monthly' ? 'border-white bg-white/5' : 'border-gray-800 opacity-50 hover:opacity-80'}`}
            >
              <div className="mt-2">
                <h3 className="text-gray-400 font-mono text-[10px] uppercase tracking-widest mb-4">Monthly Contract</h3>
                <div className="flex flex-col items-center">
                  <span className="text-transparent text-xs select-none">.</span>
                  <span className="text-white text-2xl font-mono font-bold my-1">$19.99<span className="text-xs font-normal text-gray-500">/mo</span></span>
                  <span className="text-gray-600 text-xs font-mono">Billed monthly</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-gray-500 text-[10px] font-mono">No discount.</p>
                <p className="text-gray-500 text-[10px] font-mono italic">Immediate billing.</p>
              </div>
            </div>

          </div>

          {/* Primary Action */}
          <button
            onClick={() => {
              // Step: Open Paddle checkout overlay
              // Select the correct price ID based on selected plan
              const priceId = selectedPlan === 'annual'
                ? 'pri_01kdebw86anasb9gk72jq604vp'  // Annual plan
                : 'pri_01kdeb8gbzrfrcfhp9shj1ymjk'; // Monthly plan

              if (window.Paddle) {
                window.Paddle.Checkout.open({
                  items: [{ priceId, quantity: 1 }],
                  successCallback: async (data: any) => {
                    // Step: Payment successful - save subscription to database
                    try {
                      await setSubscription({
                        status: "premium",
                        plan: selectedPlan,
                      });
                      router.push("/dark-psychology-dashboard");
                    } catch (error) {
                      router.push("/dark-psychology-dashboard");
                    }
                  },
                  closeCallback: () => {
                    // User closed the checkout without completing payment
                  },
                });
              }
            }}
            className="w-full border-2 border-white bg-white text-black hover:bg-black hover:text-white py-4 px-8 text-sm font-mono uppercase tracking-widest transition-colors mb-4 animate-pulse"
          >
            {selectedPlan === 'annual' ? 'Initialize 7-Day Field Test' : 'Initialize Access ($19.99)'}
          </button>

          {/* Secondary Action - Trigger Walk of Shame */}
          <button
            onClick={() => setShowWalkOfShame(true)}
            className="text-gray-700 hover:text-gray-500 text-xs font-mono uppercase tracking-widest transition-colors"
          >
            Remain Civilian
          </button>
        </div>
      </div>
    );
  }

  // Phase 3: The Analysis (Result) - OLD PLACEHOLDER
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
