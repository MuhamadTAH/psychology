"use client";

import { Robot3DMood } from "./Robot3D";

interface Robot3DSideProps {
  size?: number;
  blink?: boolean;
  mood?: Robot3DMood;
}

export default function Robot3DSide({ size = 200, blink = false, mood = "neutral" }: Robot3DSideProps) {
  return (
    <>
      <svg
        width={size}
        height={size * 1.3}
        viewBox="-20 0 200 260"
        xmlns="http://www.w3.org/2000/svg"
      >
      {/* Define gradients for 3D effect */}
      <defs>
        <linearGradient id="bodyGradientSide" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d0d0d0" />
          <stop offset="50%" stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#d0d0d0" />
        </linearGradient>
        <linearGradient id="darkGradientSide" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5a5a5a" />
          <stop offset="50%" stopColor="#8a8a8a" />
          <stop offset="100%" stopColor="#5a5a5a" />
        </linearGradient>
      </defs>

      {/* Left Antenna (from side) */}
      <g transform="translate(70, 30)">
        <ellipse cx="0" cy="0" rx="6" ry="12" fill="none" stroke="#b0b0b0" strokeWidth="4" />
        <rect x="-3" y="10" width="6" height="15" rx="3" fill="#c0c0c0" />
      </g>

      {/* Right Antenna (behind, slightly visible) */}
      <g transform="translate(85, 30)" opacity="0.3">
        <ellipse cx="0" cy="0" rx="6" ry="12" fill="none" stroke="#b0b0b0" strokeWidth="4" />
        <rect x="-3" y="10" width="6" height="15" rx="3" fill="#c0c0c0" />
      </g>

      {/* Head - side view (narrow depth) */}
      <rect x="50" y="35" width="50" height="115" rx="20" fill="url(#bodyGradientSide)" />

      {/* Head depth shadow */}
      <rect x="52" y="37" width="10" height="111" rx="18" fill="#000000" opacity="0.1" />

      {/* Side panel/vent on head */}
      <rect x="45" y="75" width="10" height="50" rx="4" fill="#6a6a6a" />

      {/* Arm (only one visible from side) */}
      {/* Upper arm - light colored */}
      <rect x="30" y="85" width="18" height="35" rx="9" fill="url(#bodyGradientSide)" />
      {/* Forearm - dark grey */}
      <rect x="30" y="118" width="18" height="35" rx="9" fill="url(#darkGradientSide)" />
      {/* Hand - spherical */}
      <circle cx="39" cy="162" r="11" fill="url(#bodyGradientSide)" />
      <circle cx="37" cy="160" r="9" fill="#ffffff" opacity="0.2" />

      {/* Leg (only one visible from side) */}
      {/* Upper leg */}
      <rect x="70" y="150" width="18" height="50" rx="9" fill="url(#darkGradientSide)" />
      {/* Knee band */}
      <rect x="70" y="195" width="18" height="6" rx="2" fill="#a0a0a0" />
      {/* Lower leg */}
      <rect x="70" y="200" width="18" height="40" rx="9" fill="#e8e8e8" />
      {/* Leg highlight */}
      <rect x="71" y="202" width="16" height="15" rx="7" fill="#ffffff" opacity="0.3" />

      {/* Foot (side view - oval) */}
      <g>
        <ellipse cx="79" cy="245" rx="18" ry="11" fill="#e8e8e8" />
        <ellipse cx="85" cy="245" rx="12" ry="9" fill="#808080" />
        <ellipse cx="79" cy="242" rx="15" ry="6" fill="#ffffff" opacity="0.3" />
      </g>

      {/* Back leg (partially visible, faded) */}
      <g opacity="0.3">
        <rect x="90" y="150" width="18" height="50" rx="9" fill="url(#darkGradientSide)" />
        <rect x="90" y="195" width="18" height="6" rx="2" fill="#a0a0a0" />
        <rect x="90" y="200" width="18" height="40" rx="9" fill="#e8e8e8" />
        <ellipse cx="99" cy="245" rx="18" ry="11" fill="#e8e8e8" />
      </g>
      </svg>
    </>
  );
}
