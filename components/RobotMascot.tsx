"use client";
import React from "react";
import { motion } from "framer-motion";

export type Subject = "default" | "math" | "science" | "english";
export type Mood = "idle" | "happy" | "thinking" | "sad" | "excited";

const SUBJECT_COLORS: Record<Subject, string> = {
  default: "#8b5cf6", // purple
  math: "#0ea5e9",    // blue
  science: "#16a34a", // green
  english: "#f59e0b", // amber
};

const moodBlinks = {
  idle: 1.5,
  thinking: 0.75,
  happy: 3,
  excited: 4,
  sad: 2.5,
};

type Props = {
  subject?: Subject;
  mood?: Mood;
  size?: number; // px
  className?: string;
};

export default function RobotMascot({
  subject = "default",
  mood = "idle",
  size = 160,
  className,
}: Props) {
  const color = SUBJECT_COLORS[subject] ?? SUBJECT_COLORS.default;
  const blinkSpeed = moodBlinks[mood] ?? 1.5;

  // simple hover "encourage" animation for CTA
  const hoverScale = mood === "excited" ? 1.06 : 1.03;

  // eye variants (open/close)
  const eyeVariants = {
    open: { scaleY: 1 },
    closed: { scaleY: 0.1 },
  };

  // head tilt for thinking
  const headVariants = {
    idle: { rotate: 0 },
    thinking: { rotate: [-4, 4, -2, 2, 0], transition: { duration: 2 } },
    happy: { rotate: [0, -6, 6, 0], transition: { duration: 0.9 } },
    excited: { rotate: [0, -8, 8, 0], transition: { duration: 0.6 } },
    sad: { rotate: [0, -2, -1, 0], transition: { duration: 1.2 } },
  };

  return (
    <motion.div
      className={className}
      initial="visible"
      whileHover={{ scale: hoverScale }}
      style={{ width: size, height: size, display: "inline-block", cursor: "default" }}
    >
      {/* Body container */}
      <motion.svg
        viewBox="0 0 120 120"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* shadow */}
        <ellipse cx="60" cy="108" rx="28" ry="6" fill="rgba(0,0,0,0.12)" />

        {/* legs */}
        <rect x="36" y="86" width="12" height="14" rx="3" fill="#2d2d2d" />
        <rect x="72" y="86" width="12" height="14" rx="3" fill="#2d2d2d" />

        {/* body */}
        <rect x="20" y="34" width="80" height="56" rx="12" fill="#e6eef6" stroke="#ccc" strokeWidth="1.2" />

        {/* subject badge (top-left) */}
        <rect x="26" y="28" width="16" height="10" rx="2" fill={color} />
        <text x="34" y="36" fontSize="6" textAnchor="middle" fill="#fff" fontFamily="Arial" fontWeight="700">
          {subject[0].toUpperCase()}
        </text>

        {/* head group (animated tilt) */}
        <motion.g
          style={{ transformOrigin: "60px 26px" }}
          animate={mood}
          variants={headVariants}
        >
          {/* antennas */}
          <line x1="60" y1="6" x2="60" y2="14" stroke="#444" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="60" cy="6" r="2.2" fill={color} />

          {/* head */}
          <rect x="38" y="14" width="44" height="26" rx="6" fill="#fff" stroke="#cfcfcf" strokeWidth="1.2" />

          {/* eyes (animated blink) */}
          <g transform="translate(60,26)">
            <motion.ellipse
              cx="-10"
              cy="-6"
              rx="6"
              ry="4"
              fill="#111827"
              variants={eyeVariants}
              animate={["open"]}
              transition={{ yoyo: Infinity, duration: blinkSpeed, ease: "easeInOut" }}
              style={{ transformOrigin: "center" }}
            />
            <motion.ellipse
              cx="10"
              cy="-6"
              rx="6"
              ry="4"
              fill="#111827"
              variants={eyeVariants}
              animate={["open"]}
              transition={{ yoyo: Infinity, duration: blinkSpeed + 0.2, ease: "easeInOut" }}
              style={{ transformOrigin: "center" }}
            />
          </g>

          {/* mouth (changes with mood) */}
          {mood === "happy" || mood === "excited" ? (
            <motion.path d="M46 34 Q60 44 74 34" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" animate={{ scaleY: 1 }} />
          ) : mood === "sad" ? (
            <path d="M46 38 Q60 30 74 38" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <rect x="52" y="32" width="16" height="4" rx="2" fill="#1f2937" />
          )}
        </motion.g>

        {/* torso decoration - screen */}
        <rect x="34" y="50" width="52" height="28" rx="6" fill="#f8fbff" stroke="#c8d6e8" />
        <g transform="translate(34,50)">
          {/* small subject icon - center */}
          <circle cx="26" cy="14" r="6" fill={color} />
          {/* progress arc (simple) */}
          <motion.path
            d="M20 14 A8 8 0 0 1 32 14"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: subject === "math" ? 1 : subject === "science" ? 0.7 : 0.4 }}
            transition={{ duration: 0.8 }}
          />
        </g>

        {/* arms */}
        <rect x="14" y="46" width="8" height="28" rx="3" fill="#dfe9f5" />
        <rect x="98" y="46" width="8" height="28" rx="3" fill="#dfe9f5" />
      </motion.svg>
    </motion.div>
  );
}
