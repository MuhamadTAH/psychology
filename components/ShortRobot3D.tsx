"use client";

import { Robot3DMood } from "./Robot3D";

interface ShortRobot3DProps {
  size?: number;
  blink?: boolean;
  mood?: Robot3DMood;
}

export default function ShortRobot3D({ size = 200, blink = false, mood = "neutral" }: ShortRobot3DProps) {
  return (
    <>
      <svg
        width={size}
        height={size * 1.1}
        viewBox="-20 0 280 220"
        xmlns="http://www.w3.org/2000/svg"
      >
      {/* Define gradients for 3D effect */}
      <defs>
        <linearGradient id="bodyGradientShort" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#d0d0d0" />
        </linearGradient>
        <linearGradient id="darkGradientShort" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8a8a8a" />
          <stop offset="100%" stopColor="#5a5a5a" />
        </linearGradient>
        <radialGradient id="screenGradientShort">
          <stop offset="0%" stopColor="#4a4a4a" />
          <stop offset="100%" stopColor="#2a2a2a" />
        </radialGradient>
      </defs>

      {/* Left Antenna Ring */}
      <g transform="translate(80, 30)">
        <ellipse cx="0" cy="0" rx="12" ry="12" fill="none" stroke="#b0b0b0" strokeWidth="6" />
        <ellipse cx="0" cy="0" rx="9" ry="9" fill="none" stroke="#d5d5d5" strokeWidth="3" />
        <rect x="-3" y="10" width="6" height="15" rx="3" fill="#c0c0c0" />
      </g>

      {/* Right Antenna Ring */}
      <g transform="translate(120, 30)">
        <ellipse cx="0" cy="0" rx="12" ry="12" fill="none" stroke="#b0b0b0" strokeWidth="6" />
        <ellipse cx="0" cy="0" rx="9" ry="9" fill="none" stroke="#d5d5d5" strokeWidth="3" />
        <rect x="-3" y="10" width="6" height="15" rx="3" fill="#c0c0c0" />
      </g>

      {/* Head - rounded box - taller */}
      <rect x="40" y="35" width="120" height="115" rx="20" fill="url(#bodyGradientShort)" />

      {/* Head inner shadow for depth */}
      <rect x="42" y="37" width="116" height="20" rx="18" fill="#ffffff" opacity="0.4" />

      {/* Left side panel/vent on head */}
      <rect x="35" y="75" width="18" height="50" rx="4" fill="#6a6a6a" />
      <rect x="36" y="77" width="16" height="46" rx="3" fill="#5a5a5a" />

      {/* Right side panel/vent on head */}
      <rect x="147" y="75" width="18" height="50" rx="4" fill="#6a6a6a" />
      <rect x="148" y="77" width="16" height="46" rx="3" fill="#5a5a5a" />

      {/* Face screen */}
      <rect x="55" y="60" width="90" height="70" rx="15" fill="url(#screenGradientShort)" />

      {/* Screen border highlight */}
      <rect x="55" y="60" width="90" height="70" rx="15" fill="none" stroke="#f0f0f0" strokeWidth="3" opacity="0.8" />

      {/* Left Eye */}
      {!blink ? (
        <>
          <ellipse cx="80" cy="90" rx={mood === "begging" ? "12" : "10"} ry={mood === "begging" ? "16" : "14"} fill="#ffffff" />
          <ellipse cx="78" cy="88" rx={mood === "begging" ? "10" : "8"} ry={mood === "begging" ? "14" : "12"} fill="#f5f5f5" />
        </>
      ) : (
        <line x1="70" y1="90" x2="90" y2="90" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      )}

      {/* Right Eye */}
      {!blink ? (
        <>
          <ellipse cx="120" cy="90" rx={mood === "begging" ? "12" : "10"} ry={mood === "begging" ? "16" : "14"} fill="#ffffff" />
          <ellipse cx="118" cy="88" rx={mood === "begging" ? "10" : "8"} ry={mood === "begging" ? "14" : "12"} fill="#f5f5f5" />
        </>
      ) : (
        <line x1="110" y1="90" x2="130" y2="90" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      )}

      {/* Left Blush */}
      <ellipse cx="65" cy="100" rx="6" ry="4" fill="#ff6b6b" opacity="0.7" />

      {/* Right Blush */}
      <ellipse cx="135" cy="100" rx="6" ry="4" fill="#ff6b6b" opacity="0.7" />

      {/* Tears - only show when crying */}
      {mood === "crying" && (
        <>
          {/* Left tear */}
          <ellipse cx="75" cy="102" rx="3" ry="5" fill="#6dd5ed" opacity="0.8" />
          <ellipse cx="73" cy="108" rx="2.5" ry="4" fill="#6dd5ed" opacity="0.7" />
          {/* Right tear */}
          <ellipse cx="125" cy="102" rx="3" ry="5" fill="#6dd5ed" opacity="0.8" />
          <ellipse cx="123" cy="108" rx="2.5" ry="4" fill="#6dd5ed" opacity="0.7" />
        </>
      )}

      {/* Mouth - changes based on mood */}
      {mood === "neutral" && (
        <path
          d="M 85 108 Q 100 115 115 108"
          fill="none"
          stroke="#ff6b6b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
      {mood === "happy" && (
        <path
          d="M 80 105 Q 100 120 120 105"
          fill="none"
          stroke="#ff6b6b"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
      {mood === "sad" && (
        <path
          d="M 85 115 Q 100 108 115 115"
          fill="none"
          stroke="#ff6b6b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
      {mood === "surprised" && (
        <ellipse cx="100" cy="110" rx="8" ry="10" fill="none" stroke="#ff6b6b" strokeWidth="2.5" />
      )}
      {mood === "begging" && (
        <path
          d="M 88 112 Q 100 108 112 112"
          fill="none"
          stroke="#ff6b6b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
      {mood === "crying" && (
        <path
          d="M 85 118 Q 100 110 115 118"
          fill="none"
          stroke="#ff6b6b"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}

      {/* Left Arm - coming from head side panel */}
      {/* Upper arm - light colored */}
      <rect x="18" y="85" width="18" height="35" rx="9" fill="url(#bodyGradientShort)" />
      {/* Forearm - dark grey */}
      <rect x="18" y="118" width="18" height="35" rx="9" fill="url(#darkGradientShort)" />
      {/* Hand - spherical */}
      <circle cx="27" cy="162" r="11" fill="url(#bodyGradientShort)" />
      <circle cx="27" cy="160" r="9" fill="#ffffff" opacity="0.2" />

      {/* Right Arm */}
      {/* Upper arm - light colored */}
      <rect x="164" y="85" width="18" height="35" rx="9" fill="url(#bodyGradientShort)" />
      {/* Forearm - dark grey */}
      <rect x="164" y="118" width="18" height="35" rx="9" fill="url(#darkGradientShort)" />
      {/* Hand - spherical */}
      <circle cx="173" cy="162" r="11" fill="url(#bodyGradientShort)" />
      <circle cx="173" cy="160" r="9" fill="#ffffff" opacity="0.2" />

      {/* Left Leg - SHORTER (no lower leg) */}
      {/* Upper leg only */}
      <rect x="75" y="150" width="18" height="50" rx="9" fill="url(#darkGradientShort)" />
      {/* Knee band */}
      <rect x="75" y="195" width="18" height="6" rx="2" fill="#a0a0a0" />

      {/* Foot - directly attached */}
      <g>
        <ellipse cx="84" cy="210" rx="14" ry="11" fill="#e8e8e8" />
        <ellipse cx="91" cy="210" rx="9" ry="9" fill="#808080" />
        <ellipse cx="84" cy="207" rx="12" ry="6" fill="#ffffff" opacity="0.3" />
      </g>

      {/* Right Leg - SHORTER (no lower leg) */}
      {/* Upper leg only */}
      <rect x="107" y="150" width="18" height="50" rx="9" fill="url(#darkGradientShort)" />
      {/* Knee band */}
      <rect x="107" y="195" width="18" height="6" rx="2" fill="#a0a0a0" />

      {/* Foot - directly attached */}
      <g>
        <ellipse cx="116" cy="210" rx="14" ry="11" fill="#e8e8e8" />
        <ellipse cx="123" cy="210" rx="9" ry="9" fill="#808080" />
        <ellipse cx="116" cy="207" rx="12" ry="6" fill="#ffffff" opacity="0.3" />
      </g>
      </svg>
    </>
  );
}
