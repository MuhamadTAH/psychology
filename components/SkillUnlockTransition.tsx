"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

export default function SkillUnlockTransition({
  skillName,
  skillImage,
  onComplete,
}: {
  skillName: string;
  skillImage?: string;
  onComplete: () => void;
}) {
  // We use detailed sub-phases based on timestamps
  const [phase, setPhase] = useState<
    "icon-intro" | "bar-open" | "display-hold" | "bar-close" | "icon-zoom-out" | "done"
  >("icon-intro");

  useEffect(() => {
    const audio = new Audio("/VIdeo/Sound effect/Skill unlock  sound effect.mp4");
    audio.play().catch(console.error);

    // Timeline sequence matching 8.22 audio
    const timers = [
      setTimeout(() => setPhase("bar-open"), 1020),
      setTimeout(() => setPhase("display-hold"), 1210),
      setTimeout(() => setPhase("bar-close"), 7020),
      setTimeout(() => setPhase("icon-zoom-out"), 7160),
      setTimeout(() => {
        setPhase("done");
        onComplete();
      }, 8220),
    ];

    return () => {
      timers.forEach(clearTimeout);
      audio.pause();
    };
  }, [onComplete]);

  // Computed styles based on the strict timeline logic
  // The Bar
  const barWidth =
    phase === "icon-intro" || phase === "icon-zoom-out" || phase === "done"
      ? "32px" // Invisible (tucked entirely behind the right half of the 64px icon)
      : phase === "bar-open" || phase === "display-hold"
      ? "360px" // Fully open
      : "32px"; // Closing collapses it completely out of sight

  const barOpacity =
    phase === "icon-zoom-out" || phase === "done" ? 0 : 1;

  // The Icon
  const iconScale = phase === "icon-zoom-out" ? "scale(0)" : "scale(1)";
  const iconOpacity = phase === "icon-zoom-out" || phase === "done" ? 0 : 1;

  // Texts and internal elements fade out during bar-close, and stay hidden during intro/zoom
  const innerOpacity = phase === "display-hold" || phase === "bar-open" ? 1 : 0;
  const innerTransitionDelay = phase === "bar-open" ? "100ms" : "0ms";

  return (
    <div className="fixed inset-0 z-[300] bg-black flex items-center justify-center overflow-hidden">
      
      {/* 
        The Container Box
        Because this box is justified center on the screen, as `barWidth` grows, 
        flexbox pushes the left side (Icon) left, and the right side (Bar) right, 
        creating a perfect symmetrical "Center-Split Expansion" natively.
      */}
      <div className="flex items-center">
        
        {/* The Skill Icon (Left side) */}
        <div
          className="relative z-10 w-16 h-16 shrink-0 rounded-full border-[3px] border-slate-900 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)] overflow-hidden"
          style={{
            transform: iconScale,
            opacity: iconOpacity,
            transition:
              phase === "icon-zoom-out"
                ? "transform 930ms cubic-bezier(0.5, 0, 0.1, 1), opacity 930ms ease-in"
                : "none",
          }}
        >
          {skillImage ? (
            <img src={skillImage} className="w-full h-full object-cover" alt={skillName} />
          ) : (
            <div className="w-full h-full bg-cyan-600 flex items-center justify-center">
              {/* Stylized White X Fallback purely for safety */}
              <div className="relative w-6 h-6">
                <div className="absolute top-1/2 left-1/2 w-full h-1 bg-white -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full" />
                <div className="absolute top-1/2 left-1/2 w-full h-1 bg-white -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* The Expandable Bar (Right side, tucked behind icon) */}
        <div
          className="h-16 bg-slate-900 rounded-r-full flex items-center overflow-hidden border-y border-r border-slate-800"
          style={{
            marginLeft: "-32px",  // Slides the left edge directly to the dead-center of the icon
            width: barWidth,
            opacity: barOpacity,
            transition:
              phase === "bar-open"
                ? "width 190ms cubic-bezier(0.2, 0.8, 0.2, 1)"
                : phase === "bar-close"
                ? "width 140ms ease-in"
                : "none",
          }}
        >
          {/* Internal Content of the Bar */}
          <div
            className="flex items-center whitespace-nowrap pl-12" // Padding clears the hidden tucked half
            style={{
              opacity: innerOpacity,
              transition: `opacity 120ms ease-out ${innerTransitionDelay}`,
            }}
          >
            {/* The Diamond */}
            <div className="w-2.5 h-2.5 bg-cyan-500 rotate-45 mr-4 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            
            <span className="text-cyan-400 font-bold uppercase tracking-widest text-sm mr-4">
              {skillName}
            </span>
            
            {/* The '+' Symbol */}
            <Plus className="text-white w-4 h-4" />
          </div>
        </div>

      </div>
    </div>
  );
}
