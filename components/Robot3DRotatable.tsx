"use client";

import { Robot3DMood } from "./Robot3D";

interface Robot3DRotatableProps {
  size?: number;
  blink?: boolean;
  mood?: Robot3DMood;
  rotation?: number; // 0 to 45 degrees
}

export default function Robot3DRotatable({
  size = 200,
  blink = false,
  mood = "neutral",
  rotation = 0
}: Robot3DRotatableProps) {

  // Calculate interpolation factor (0 = front, 1 = 45° angle)
  const t = Math.min(Math.max(rotation / 45, 0), 1);

  // Interpolate dimensions and positions
  const headWidth = 120 - (t * 70); // 120 -> 50
  const headX = 40 + (t * 10); // 40 -> 50

  // Left arm stays fully visible, right arm less visible
  const leftArmOpacity = 1; // Always 1
  const rightArmOpacity = 1 - (t * 0.3); // 1 -> 0.7

  // Left leg stays fully visible
  const leftLegOpacity = 1; // Always 1
  const rightLegOpacity = 1 - (t * 0.3); // 1 -> 0.7

  // Face screen visibility
  const faceOpacity = 1 - (t * 0.3); // Face fades slightly

  // Calculate positions
  const leftArmX = 18 + (t * 12); // 18 -> 30
  const rightArmX = 164 - (t * 34); // 164 -> 130

  const leftLegX = 75 - (t * 5); // 75 -> 70
  const rightLegX = 107 + (t * 10); // 107 -> 117

  return (
    <>
      <svg
        width={size}
        height={size * 1.3}
        viewBox="-20 0 280 260"
        xmlns="http://www.w3.org/2000/svg"
      >
      {/* Define gradients for 3D effect */}
      <defs>
        <linearGradient id="bodyGradientRot" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#d0d0d0" />
        </linearGradient>
        <linearGradient id="darkGradientRot" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8a8a8a" />
          <stop offset="100%" stopColor="#5a5a5a" />
        </linearGradient>
        <radialGradient id="screenGradientRot">
          <stop offset="0%" stopColor="#4a4a4a" />
          <stop offset="100%" stopColor="#2a2a2a" />
        </radialGradient>
      </defs>

      {/* Left Antenna Ring */}
      <g transform={`translate(${80 - t * 10}, 30)`}>
        <ellipse cx="0" cy="0" rx="12" ry="12" fill="none" stroke="#b0b0b0" strokeWidth="6" />
        <ellipse cx="0" cy="0" rx="9" ry="9" fill="none" stroke="#d5d5d5" strokeWidth="3" />
        <rect x="-3" y="10" width="6" height="15" rx="3" fill="#c0c0c0" />
      </g>

      {/* Right Antenna Ring */}
      <g transform={`translate(${120 - t * 35}, 30)`} opacity={rightArmOpacity}>
        <ellipse cx="0" cy="0" rx="12" ry="12" fill="none" stroke="#b0b0b0" strokeWidth="6" />
        <ellipse cx="0" cy="0" rx="9" ry="9" fill="none" stroke="#d5d5d5" strokeWidth="3" />
        <rect x="-3" y="10" width="6" height="15" rx="3" fill="#c0c0c0" />
      </g>

      {/* Head - rotating width */}
      <rect x={headX} y="35" width={headWidth} height="115" rx="20" fill="url(#bodyGradientRot)" />

      {/* Head inner shadow for depth */}
      <rect x={headX + 2} y="37" width={headWidth - 4} height="20" rx="18" fill="#ffffff" opacity="0.4" />

      {/* Left side panel/vent on head */}
      <rect x={headX - 5} y="75" width="18" height="50" rx="4" fill="#6a6a6a" opacity={leftArmOpacity} />
      <rect x={headX - 4} y="77" width="16" height="46" rx="3" fill="#5a5a5a" opacity={leftArmOpacity} />

      {/* Right side panel/vent on head */}
      <rect x={headX + headWidth - 13} y="75" width="18" height="50" rx="4" fill="#6a6a6a" opacity={rightArmOpacity} />
      <rect x={headX + headWidth - 12} y="77" width="16" height="46" rx="3" fill="#5a5a5a" opacity={rightArmOpacity} />

      {/* Face screen */}
      <rect x={headX + 15} y="60" width={headWidth - 30} height="70" rx="15" fill="url(#screenGradientRot)" opacity={faceOpacity} />

      {/* Screen border highlight */}
      <rect x={headX + 15} y="60" width={headWidth - 30} height="70" rx="15" fill="none" stroke="#f0f0f0" strokeWidth="3" opacity={0.8 * faceOpacity} />

      {/* Left Eye */}
      {!blink ? (
        <>
          <ellipse cx={headX + 40} cy="90" rx={mood === "begging" ? "12" : "10"} ry={mood === "begging" ? "16" : "14"} fill="#ffffff" opacity={faceOpacity} />
          <ellipse cx={headX + 38} cy="88" rx={mood === "begging" ? "10" : "8"} ry={mood === "begging" ? "14" : "12"} fill="#f5f5f5" opacity={faceOpacity} />
        </>
      ) : (
        <line x1={headX + 30} y1="90" x2={headX + 50} y2="90" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity={faceOpacity} />
      )}

      {/* Right Eye */}
      {!blink ? (
        <>
          <ellipse cx={headX + 80} cy="90" rx={mood === "begging" ? "12" : "10"} ry={mood === "begging" ? "16" : "14"} fill="#ffffff" opacity={faceOpacity} />
          <ellipse cx={headX + 78} cy="88" rx={mood === "begging" ? "10" : "8"} ry={mood === "begging" ? "14" : "12"} fill="#f5f5f5" opacity={faceOpacity} />
        </>
      ) : (
        <line x1={headX + 70} y1="90" x2={headX + 90} y2="90" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity={faceOpacity} />
      )}

      {/* Left Blush */}
      <ellipse cx={headX + 25} cy="100" rx="6" ry="4" fill="#ff6b6b" opacity={0.7 * faceOpacity} />

      {/* Right Blush */}
      <ellipse cx={headX + 95} cy="100" rx="6" ry="4" fill="#ff6b6b" opacity={0.7 * faceOpacity} />

      {/* Tears - only show when crying */}
      {mood === "crying" && (
        <>
          {/* Left tear */}
          <ellipse cx={headX + 35} cy="102" rx="3" ry="5" fill="#6dd5ed" opacity={0.8 * faceOpacity} />
          <ellipse cx={headX + 33} cy="108" rx="2.5" ry="4" fill="#6dd5ed" opacity={0.7 * faceOpacity} />
          {/* Right tear */}
          <ellipse cx={headX + 85} cy="102" rx="3" ry="5" fill="#6dd5ed" opacity={0.8 * faceOpacity} />
          <ellipse cx={headX + 83} cy="108" rx="2.5" ry="4" fill="#6dd5ed" opacity={0.7 * faceOpacity} />
        </>
      )}

      {/* Mouth - changes based on mood */}
      {mood === "neutral" && (
        <path
          d={`M ${headX + 45} 108 Q ${headX + 60} 115 ${headX + 75} 108`}
          fill="none"
          stroke="#ff6b6b"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={faceOpacity}
        />
      )}
      {mood === "happy" && (
        <path
          d={`M ${headX + 40} 105 Q ${headX + 60} 120 ${headX + 80} 105`}
          fill="none"
          stroke="#ff6b6b"
          strokeWidth="3"
          strokeLinecap="round"
          opacity={faceOpacity}
        />
      )}
      {mood === "sad" && (
        <path
          d={`M ${headX + 45} 115 Q ${headX + 60} 108 ${headX + 75} 115`}
          fill="none"
          stroke="#ff6b6b"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={faceOpacity}
        />
      )}
      {mood === "surprised" && (
        <ellipse cx={headX + 60} cy="110" rx="8" ry="10" fill="none" stroke="#ff6b6b" strokeWidth="2.5" opacity={faceOpacity} />
      )}
      {mood === "begging" && (
        <path
          d={`M ${headX + 48} 112 Q ${headX + 60} 108 ${headX + 72} 112`}
          fill="none"
          stroke="#ff6b6b"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={faceOpacity}
        />
      )}
      {mood === "crying" && (
        <path
          d={`M ${headX + 45} 118 Q ${headX + 60} 110 ${headX + 75} 118`}
          fill="none"
          stroke="#ff6b6b"
          strokeWidth="3"
          strokeLinecap="round"
          opacity={faceOpacity}
        />
      )}

      {/* Left Arm - becomes more visible */}
      <g opacity={leftArmOpacity}>
        <rect x={leftArmX} y="85" width="18" height="35" rx="9" fill="url(#bodyGradientRot)" />
        <rect x={leftArmX} y="118" width="18" height="35" rx="9" fill="url(#darkGradientRot)" />
        <circle cx={leftArmX + 9} cy="162" r="11" fill="url(#bodyGradientRot)" />
        <circle cx={leftArmX + 9} cy="160" r="9" fill="#ffffff" opacity="0.2" />
      </g>

      {/* Right Arm - becomes less visible */}
      <g opacity={rightArmOpacity}>
        <rect x={rightArmX} y="85" width="18" height="35" rx="9" fill="url(#bodyGradientRot)" />
        <rect x={rightArmX} y="118" width="18" height="35" rx="9" fill="url(#darkGradientRot)" />
        <circle cx={rightArmX + 9} cy="162" r="11" fill="url(#bodyGradientRot)" />
        <circle cx={rightArmX + 9} cy="160" r="9" fill="#ffffff" opacity="0.2" />
      </g>

      {/* Left Leg - becomes more visible */}
      <g opacity={leftLegOpacity}>
        <rect x={leftLegX} y="150" width="18" height="50" rx="9" fill="url(#darkGradientRot)" />
        <rect x={leftLegX} y="195" width="18" height="6" rx="2" fill="#a0a0a0" />
        <rect x={leftLegX} y="200" width="18" height="40" rx="9" fill="#e8e8e8" />
        <rect x={leftLegX + 1} y="202" width="16" height="15" rx="7" fill="#ffffff" opacity="0.3" />
        <g>
          <ellipse cx={leftLegX + 9} cy="245" rx="14" ry="11" fill="#e8e8e8" />
          <ellipse cx={leftLegX + 16} cy="245" rx="9" ry="9" fill="#808080" />
          <ellipse cx={leftLegX + 9} cy="242" rx="12" ry="6" fill="#ffffff" opacity="0.3" />
        </g>
      </g>

      {/* Right Leg - becomes less visible */}
      <g opacity={rightLegOpacity}>
        <rect x={rightLegX} y="150" width="18" height="50" rx="9" fill="url(#darkGradientRot)" />
        <rect x={rightLegX} y="195" width="18" height="6" rx="2" fill="#a0a0a0" />
        <rect x={rightLegX} y="200" width="18" height="40" rx="9" fill="#e8e8e8" />
        <rect x={rightLegX + 1} y="202" width="16" height="15" rx="7" fill="#ffffff" opacity="0.3" />
        <g>
          <ellipse cx={rightLegX + 9} cy="245" rx="14" ry="11" fill="#e8e8e8" />
          <ellipse cx={rightLegX + 16} cy="245" rx="9" ry="9" fill="#808080" />
          <ellipse cx={rightLegX + 9} cy="242" rx="12" ry="6" fill="#ffffff" opacity="0.3" />
        </g>
      </g>
      </svg>
    </>
  );
}
