"use client";

interface RobotHeadProps {
  size?: number;
}

export default function RobotHead({ size = 200 }: RobotHeadProps) {
  return (
    <>
      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-20deg); }
          75% { transform: rotate(20deg); }
        }
        .waving-arm {
          animation: wave 1.5s ease-in-out infinite;
          transform-origin: 149px 245px;
        }
      `}</style>
      <svg
        width={size}
        height={size * 2.1}
        viewBox="-20 0 240 420"
        xmlns="http://www.w3.org/2000/svg"
      >
      {/* Antenna */}
      <line x1="100" y1="10" x2="100" y2="35" stroke="#2d2d2d" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="10" r="6" fill="#2d2d2d" />

      {/* Side panels/ears - Left - draw first (behind helmet) */}
      <g>
        {/* Left ear outer */}
        <ellipse cx="10" cy="110" rx="20" ry="25" fill="#0a3d4d" />
        {/* Stripes */}
        <rect x="5" y="95" width="10" height="4" fill="#a8c5e0" />
        <rect x="5" y="108" width="10" height="4" fill="#a8c5e0" />
        <rect x="5" y="121" width="10" height="4" fill="#a8c5e0" />
      </g>

      {/* Side panels/ears - Right - draw first (behind helmet) */}
      <g>
        {/* Right ear outer */}
        <ellipse cx="190" cy="110" rx="20" ry="25" fill="#0a3d4d" />
        {/* Stripes */}
        <rect x="185" y="95" width="10" height="4" fill="#a8c5e0" />
        <rect x="185" y="108" width="10" height="4" fill="#a8c5e0" />
        <rect x="185" y="121" width="10" height="4" fill="#a8c5e0" />
      </g>

      {/* Outer helmet (light blue oval) - on top of ears */}
      <ellipse cx="100" cy="110" rx="85" ry="75" fill="#a8c5e0" />

      {/* Inner face screen (dark rounded rectangle) - on top of helmet */}
      <rect x="50" y="75" width="100" height="60" rx="25" fill="#0a3d4d" />

      {/* Eyes (green circles) */}
      <circle cx="75" cy="100" r="8" fill="#5dcea0" />
      <circle cx="125" cy="100" r="8" fill="#5dcea0" />

      {/* Smile (green arc) */}
      <path
        d="M 75 115 Q 100 130 125 115"
        fill="#5dcea0"
        stroke="none"
      />

      {/* Neck */}
      <rect x="85" y="175" width="30" height="15" rx="3" fill="#0a3d4d" />

      {/* Upper Body/Torso */}
      {/* Main center panel - light blue */}
      <rect x="60" y="190" width="80" height="75" rx="8" fill="#a8c5e0" />

      {/* Curved dark side panel - left */}
      <path
        d="M 50 200 Q 45 220 45 240 Q 45 255 50 265 L 60 265 L 60 195 Q 55 195 50 200 Z"
        fill="#0a3d4d"
      />

      {/* Curved dark side panel - right */}
      <path
        d="M 150 200 Q 155 220 155 240 Q 155 255 150 265 L 140 265 L 140 195 Q 145 195 150 200 Z"
        fill="#0a3d4d"
      />

      {/* Diagonal strap - from left shoulder to right hip */}
      <path
        d="M 65 195 L 70 193 L 135 260 L 130 262 Z"
        fill="#6ba3d4"
        opacity="0.7"
      />

      {/* Center chest screen/badge panel */}
      {/* Outer screen frame */}
      <rect x="70" y="205" width="60" height="45" rx="8" fill="#d8e4f0" stroke="#b0c4d8" strokeWidth="2" />

      {/* Inner lighter screen */}
      <rect x="74" y="209" width="52" height="37" rx="6" fill="#f0f4f8" />

      {/* Subtle gradient effect */}
      <rect x="74" y="209" width="52" height="18" rx="6" fill="#ffffff" opacity="0.5" />

      {/* Badge/emblem circle */}
      <circle cx="100" cy="227" r="10" fill="#c8d6e8" stroke="#a8bcd0" strokeWidth="1.5" />

      {/* Inner emblem detail */}
      <circle cx="100" cy="227" r="6" fill="#e0e8f0" />

      {/* Faded text effect lines */}
      <line x1="78" y1="217" x2="92" y2="217" stroke="#c8d6e8" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <line x1="78" y1="222" x2="88" y2="222" stroke="#c8d6e8" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <line x1="108" y1="237" x2="122" y2="237" stroke="#c8d6e8" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <line x1="112" y1="242" x2="122" y2="242" stroke="#c8d6e8" strokeWidth="1" opacity="0.3" strokeLinecap="round" />

      {/* Wide waist belt */}
      <rect x="60" y="262" width="80" height="8" rx="2" fill="#0a3d4d" />

      {/* Left Arm (robot's left, viewer's right) */}
      {/* Upper arm */}
      <rect x="140" y="200" width="18" height="45" rx="9" fill="#a8c5e0" />
      {/* Elbow joint */}
      <ellipse cx="149" cy="245" rx="10" ry="8" fill="#0a3d4d" />
      {/* Forearm and Hand - animated waving */}
      <g className="waving-arm">
        {/* Forearm */}
        <rect x="141" y="245" width="16" height="40" rx="8" fill="#a8c5e0" />
        {/* Hand - simple mitten shape */}
        <g transform="translate(149, 285) rotate(20)">
          {/* Hand mitten shape */}
          <ellipse cx="0" cy="0" rx="10" ry="14" fill="#0a3d4d" />
        </g>
      </g>

      {/* Right Arm (robot's right, viewer's left) */}
      {/* Upper arm */}
      <rect x="42" y="200" width="18" height="45" rx="9" fill="#a8c5e0" />
      {/* Elbow joint */}
      <ellipse cx="51" cy="245" rx="10" ry="8" fill="#0a3d4d" />
      {/* Forearm */}
      <rect x="43" y="245" width="16" height="40" rx="8" fill="#a8c5e0" />
      {/* Hand - closed/relaxed */}
      <g transform="translate(51, 285)">
        {/* Palm/fist */}
        <ellipse cx="0" cy="0" rx="7" ry="9" fill="#0a3d4d" />
        {/* Knuckles suggestion */}
        <rect x="-5" y="-4" width="10" height="3" rx="1.5" fill="#0a3d4d" opacity="0.5" />
      </g>

      {/* Lower body/Pelvis - Shield/Dome shape like imago */}
      {/* Main pelvis dome - rounded shield */}
      <path
        d="M 70 270 L 130 270 Q 135 285 130 300 Q 115 310 100 310 Q 85 310 70 300 Q 65 285 70 270 Z"
        fill="#a8c5e0"
      />
      {/* Inner shield highlight */}
      <path
        d="M 75 275 L 125 275 Q 128 287 125 297 Q 112 305 100 305 Q 88 305 75 297 Q 72 287 75 275 Z"
        fill="#0a3d4d"
        opacity="0.3"
      />

      {/* Left Leg (robot's left, viewer's right) */}
      {/* Upper leg/thigh */}
      <rect x="105" y="305" width="20" height="45" rx="10" fill="#a8c5e0" />
      {/* Knee joint */}
      <ellipse cx="115" cy="350" rx="12" ry="10" fill="#0a3d4d" />
      {/* Knee horizontal lines */}
      <line x1="105" y1="348" x2="125" y2="348" stroke="#a8c5e0" strokeWidth="1.5" opacity="0.6" />
      <line x1="105" y1="352" x2="125" y2="352" stroke="#a8c5e0" strokeWidth="1.5" opacity="0.6" />
      {/* Lower leg/shin - bell-bottomed (narrow at top, wider at bottom) */}
      <path
        d="M 109 355 L 121 355 L 128 395 L 102 395 Z"
        fill="#a8c5e0"
      />
      {/* Vertical line detail on shin */}
      <line x1="115" y1="355" x2="115" y2="390" stroke="#b8d5f0" strokeWidth="1" opacity="0.4" />
      {/* Foot */}
      <g>
        {/* Foot base - larger boot shape */}
        <ellipse cx="115" cy="405" rx="18" ry="12" fill="#a8c5e0" />
        {/* Toe section - darker front */}
        <ellipse cx="125" cy="405" rx="10" ry="10" fill="#0a3d4d" />
      </g>

      {/* Right Leg (robot's right, viewer's left) */}
      {/* Upper leg/thigh */}
      <rect x="75" y="305" width="20" height="45" rx="10" fill="#a8c5e0" />
      {/* Knee joint */}
      <ellipse cx="85" cy="350" rx="12" ry="10" fill="#0a3d4d" />
      {/* Knee horizontal lines */}
      <line x1="75" y1="348" x2="95" y2="348" stroke="#a8c5e0" strokeWidth="1.5" opacity="0.6" />
      <line x1="75" y1="352" x2="95" y2="352" stroke="#a8c5e0" strokeWidth="1.5" opacity="0.6" />
      {/* Lower leg/shin - bell-bottomed (narrow at top, wider at bottom) */}
      <path
        d="M 79 355 L 91 355 L 98 395 L 72 395 Z"
        fill="#a8c5e0"
      />
      {/* Vertical line detail on shin */}
      <line x1="85" y1="355" x2="85" y2="390" stroke="#b8d5f0" strokeWidth="1" opacity="0.4" />
      {/* Foot */}
      <g>
        {/* Foot base - larger boot shape */}
        <ellipse cx="85" cy="405" rx="18" ry="12" fill="#a8c5e0" />
        {/* Toe section - darker front */}
        <ellipse cx="95" cy="405" rx="10" ry="10" fill="#0a3d4d" />
      </g>
      </svg>
    </>
  );
}
