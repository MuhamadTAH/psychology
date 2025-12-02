"use client";

interface BabyRobotProps {
  size?: number;
}

export default function BabyRobot({ size = 200 }: BabyRobotProps) {
  return (
    <>
      <style>{`
        @keyframes baby-wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-25deg); }
          75% { transform: rotate(25deg); }
        }
        .baby-waving-arm {
          animation: baby-wave 1s ease-in-out infinite;
          transform-origin: 139px 215px;
        }
      `}</style>
      <svg
        width={size}
        height={size * 1.8}
        viewBox="-20 0 240 360"
        xmlns="http://www.w3.org/2000/svg"
      >
      {/* Antenna - smaller */}
      <line x1="100" y1="10" x2="100" y2="30" stroke="#2d2d2d" strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="10" r="5" fill="#2d2d2d" />

      {/* Side panels/ears - smaller */}
      <g>
        {/* Left ear outer */}
        <ellipse cx="15" cy="95" rx="18" ry="22" fill="#0a3d4d" />
        {/* Stripes */}
        <rect x="10" y="82" width="10" height="3" fill="#a8c5e0" />
        <rect x="10" y="94" width="10" height="3" fill="#a8c5e0" />
        <rect x="10" y="106" width="10" height="3" fill="#a8c5e0" />
      </g>

      {/* Side panels/ears - Right */}
      <g>
        {/* Right ear outer */}
        <ellipse cx="185" cy="95" rx="18" ry="22" fill="#0a3d4d" />
        {/* Stripes */}
        <rect x="180" y="82" width="10" height="3" fill="#a8c5e0" />
        <rect x="180" y="94" width="10" height="3" fill="#a8c5e0" />
        <rect x="180" y="106" width="10" height="3" fill="#a8c5e0" />
      </g>

      {/* Outer helmet - bigger for baby proportions */}
      <ellipse cx="100" cy="95" rx="90" ry="80" fill="#a8c5e0" />

      {/* Inner face screen */}
      <rect x="45" y="60" width="110" height="65" rx="28" fill="#0a3d4d" />

      {/* Eyes - bigger for baby look */}
      <circle cx="70" cy="88" r="10" fill="#5dcea0" />
      <circle cx="130" cy="88" r="10" fill="#5dcea0" />

      {/* Smile - bigger */}
      <path
        d="M 70 108 Q 100 125 130 108"
        fill="#5dcea0"
        stroke="none"
      />

      {/* Neck - shorter */}
      <rect x="85" y="165" width="30" height="12" rx="3" fill="#0a3d4d" />

      {/* Upper Body/Torso - smaller and rounder */}
      {/* Main center panel */}
      <rect x="65" y="177" width="70" height="60" rx="10" fill="#a8c5e0" />

      {/* Curved dark side panel - left */}
      <path
        d="M 55 185 Q 50 200 50 215 Q 50 228 55 237 L 65 237 L 65 180 Q 60 180 55 185 Z"
        fill="#0a3d4d"
      />

      {/* Curved dark side panel - right */}
      <path
        d="M 145 185 Q 150 200 150 215 Q 150 228 145 237 L 135 237 L 135 180 Q 140 180 145 185 Z"
        fill="#0a3d4d"
      />

      {/* Diagonal strap */}
      <path
        d="M 70 180 L 75 178 L 130 233 L 125 235 Z"
        fill="#6ba3d4"
        opacity="0.7"
      />

      {/* Center chest screen - smaller */}
      <rect x="75" y="190" width="50" height="38" rx="7" fill="#d8e4f0" stroke="#b0c4d8" strokeWidth="2" />
      <rect x="79" y="194" width="42" height="30" rx="5" fill="#f0f4f8" />
      <rect x="79" y="194" width="42" height="15" rx="5" fill="#ffffff" opacity="0.5" />

      {/* Badge/emblem */}
      <circle cx="100" cy="209" r="8" fill="#c8d6e8" stroke="#a8bcd0" strokeWidth="1.5" />
      <circle cx="100" cy="209" r="5" fill="#e0e8f0" />

      {/* Waist belt */}
      <rect x="65" y="235" width="70" height="6" rx="2" fill="#0a3d4d" />

      {/* Left Arm - shorter and chubbier */}
      <rect x="135" y="185" width="16" height="35" rx="8" fill="#a8c5e0" />
      {/* Elbow joint */}
      <ellipse cx="143" cy="220" rx="9" ry="7" fill="#0a3d4d" />
      {/* Forearm and Hand - animated waving */}
      <g className="baby-waving-arm">
        <rect x="137" y="220" width="14" height="32" rx="7" fill="#a8c5e0" />
        {/* Hand - simple mitten */}
        <g transform="translate(144, 252) rotate(20)">
          <ellipse cx="0" cy="0" rx="9" ry="12" fill="#0a3d4d" />
        </g>
      </g>

      {/* Right Arm - shorter and chubbier */}
      <rect x="49" y="185" width="16" height="35" rx="8" fill="#a8c5e0" />
      {/* Elbow joint */}
      <ellipse cx="57" cy="220" rx="9" ry="7" fill="#0a3d4d" />
      {/* Forearm */}
      <rect x="51" y="220" width="14" height="32" rx="7" fill="#a8c5e0" />
      {/* Hand */}
      <g transform="translate(58, 252)">
        <ellipse cx="0" cy="0" rx="8" ry="11" fill="#0a3d4d" />
      </g>

      {/* Lower body/Pelvis - rounder baby shape */}
      <path
        d="M 70 241 L 130 241 Q 134 253 130 265 Q 115 273 100 273 Q 85 273 70 265 Q 66 253 70 241 Z"
        fill="#a8c5e0"
      />
      <path
        d="M 75 246 L 125 246 Q 128 256 125 264 Q 112 270 100 270 Q 88 270 75 264 Q 72 256 75 246 Z"
        fill="#0a3d4d"
        opacity="0.3"
      />

      {/* Left Leg - shorter and chubbier */}
      {/* Upper leg/thigh */}
      <rect x="105" y="270" width="18" height="38" rx="9" fill="#a8c5e0" />
      {/* Knee joint */}
      <ellipse cx="114" cy="308" rx="11" ry="9" fill="#0a3d4d" />
      <line x1="105" y1="306" x2="123" y2="306" stroke="#a8c5e0" strokeWidth="1.5" opacity="0.6" />
      <line x1="105" y1="310" x2="123" y2="310" stroke="#a8c5e0" strokeWidth="1.5" opacity="0.6" />
      {/* Lower leg - bell-bottomed but shorter */}
      <path
        d="M 108 313 L 120 313 L 126 345 L 102 345 Z"
        fill="#a8c5e0"
      />
      <line x1="114" y1="313" x2="114" y2="342" stroke="#b8d5f0" strokeWidth="1" opacity="0.4" />
      {/* Foot - chubbier */}
      <g>
        <ellipse cx="114" cy="353" rx="16" ry="11" fill="#a8c5e0" />
        <ellipse cx="123" cy="353" rx="9" ry="9" fill="#0a3d4d" />
      </g>

      {/* Right Leg - shorter and chubbier */}
      <rect x="77" y="270" width="18" height="38" rx="9" fill="#a8c5e0" />
      {/* Knee joint */}
      <ellipse cx="86" cy="308" rx="11" ry="9" fill="#0a3d4d" />
      <line x1="77" y1="306" x2="95" y2="306" stroke="#a8c5e0" strokeWidth="1.5" opacity="0.6" />
      <line x1="77" y1="310" x2="95" y2="310" stroke="#a8c5e0" strokeWidth="1.5" opacity="0.6" />
      {/* Lower leg */}
      <path
        d="M 80 313 L 92 313 L 98 345 L 74 345 Z"
        fill="#a8c5e0"
      />
      <line x1="86" y1="313" x2="86" y2="342" stroke="#b8d5f0" strokeWidth="1" opacity="0.4" />
      {/* Foot */}
      <g>
        <ellipse cx="86" cy="353" rx="16" ry="11" fill="#a8c5e0" />
        <ellipse cx="95" cy="353" rx="9" ry="9" fill="#0a3d4d" />
      </g>
      </svg>
    </>
  );
}
