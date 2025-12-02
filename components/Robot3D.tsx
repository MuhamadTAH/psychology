"use client";

/**
 * ============================================
 * ROBOT WAVE ANIMATION GUIDE
 * ============================================
 *
 * HOW TO MODIFY THE WAVE ANIMATION:
 *
 * 1. WAVE SPEED (line 23):
 *    - Change `3s` to make faster/slower
 *    - 1s = super fast, 5s = slow, 10s = very slow
 *
 * 2. WAVE POSITIONS (lines 17-20):
 *    - 0%: rotate(-90deg) = Start position (arm bent down)
 *    - 33%: rotate(-45deg) = Middle position
 *    - 66%: rotate(0deg) = Top position (arm up)
 *    - Make arm go higher: use smaller negative numbers (-30deg)
 *    - Make arm go lower: use larger negative numbers (-120deg)
 *
 * 3. ROTATION POINT (line 24):
 *    - transform-origin: 173px 102px = pivot point (elbow/shoulder)
 *    - First number (173px): left/right position
 *    - Second number (102px): up/down position
 *    - Move right: increase 173px, Move left: decrease 173px
 *
 * 4. ANIMATION STYLE (line 23):
 *    - ease-in-out = smooth (current)
 *    - linear = constant speed
 *    - ease-in = starts slow
 *    - ease-out = ends slow
 *
 * 5. ARM SIZE (lines 151-156):
 *    - Upper arm width="35" height="18"
 *    - Forearm width="18" height="35"
 *    - Hand radius r="11"
 *    - Increase numbers = bigger arm, Decrease = smaller arm
 *
 * ROTATION ANGLES:
 * - Negative numbers = rotate counter-clockwise (up)
 * - Positive numbers = rotate clockwise (down)
 * - -90deg = bent down, -45deg = halfway, 0deg = horizontal
 */

export type Robot3DMood = "neutral" | "happy" | "sad" | "surprised" | "begging" | "crying";

interface Robot3DProps {
  size?: number;
  blink?: boolean;
  mood?: Robot3DMood;
  wave?: boolean;
  animatedHappy?: boolean;
}

export default function Robot3D({ size = 200, blink = false, mood = "neutral", wave = false, animatedHappy = false }: Robot3DProps) {
  return (
    <>
      <style>{`
        @keyframes hello-wave {
          0% { transform: rotate(90deg); }   /* Position 1: V-shape down */
          0% { transform: rotate(90deg); }   /* Transition */
          25% { transform: rotate(0deg); }   /* Position 2: Horizontal */
          75% { transform: rotate(0deg); }     /* Position 3: Up diagonal - hold for forearm repeats */
          80% { transform: rotate(0deg); }     /* Hold - forearm repeat 1 */
          85% { transform: rotate(0deg); }     /* Hold - forearm repeat 1 */
          87% { transform: rotate(0deg); }     /* Hold - forearm repeat 2 */
          89% { transform: rotate(0deg); }     /* Hold - forearm repeat 2 */
          91% { transform: rotate(0deg); }     /* Hold - forearm repeat 2 */
          100% { transform: rotate(90deg); } /* Back to Position 1 */
        }
        @keyframes forearm-bend {
          0% { transform: rotate(0deg); }    /* Position 1: bent down-right */
          0% { transform: rotate(0deg); }   /* Transition */
          25% { transform: rotate(-90deg); }   /* Position 2: straight horizontal */
          34.375% { transform: rotate(-45deg); }  /* Position 3: bent up diagonal / */
          43.75% { transform: rotate(-90deg); }  /* Position 4: straight up | */
          53.125% { transform: rotate(-45deg); }   /* Position 5: bent down-right \ */
          62.5% { transform: rotate(-90deg); }  /* Repeat 1: / */
          71.875% { transform: rotate(-45deg); }  /* Repeat 1: | */
          81.25% { transform: rotate(-90deg); }   /* Repeat 1: \ */
          90.625% { transform: rotate(-45deg); }  /* Repeat 2: / */
          100% { transform: rotate(0deg); }  /* Back to Position 1 */
        }
        .gentle-waving-arm {
          animation: hello-wave 4s ease-in-out infinite;
          transform-origin: 185px 90px;
        }
        .waving-forearm {
          animation: forearm-bend 4s ease-in-out infinite;
          transform-origin: 217px 90px;
        }
        @keyframes arm-morph {
          0% { width: 33px; height: 16px; }
          25% { width: 40px; height: 16px; }
          100% { width: 35px; height: 16px; }
         }
        @keyframes mouth-to-happy {
          0% { opacity: 0; }
          25% { opacity: 1; }
          100% { opacity: 1; }
        }
        @keyframes mouth-from-neutral {
          0% { opacity: 1; }
          25% { opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
      <svg
        width={size}
        height={size * 1.3}
        viewBox="-20 0 280 260"
        xmlns="http://www.w3.org/2000/svg"
      >
      {/* Define gradients for 3D effect */}
      <defs>
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#d0d0d0" />
        </linearGradient>
        <linearGradient id="darkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8a8a8a" />
          <stop offset="100%" stopColor="#5a5a5a" />
        </linearGradient>
        <radialGradient id="screenGradient">
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
      <rect x="40" y="35" width="120" height="115" rx="20" fill="url(#bodyGradient)" />

      {/* Head inner shadow for depth */}
      <rect x="42" y="37" width="116" height="20" rx="18" fill="#ffffff" opacity="0.4" />

      {/* Left side panel/vent on head */}
      <rect x="35" y="75" width="18" height="50" rx="4" fill="#6a6a6a" />
      <rect x="36" y="77" width="16" height="46" rx="3" fill="#5a5a5a" />

      {/* Right side panel/vent on head */}
      <rect x="147" y="75" width="18" height="50" rx="4" fill="#6a6a6a" />
      <rect x="148" y="77" width="16" height="46" rx="3" fill="#5a5a5a" />

      {/* Face screen */}
      <rect x="55" y="60" width="90" height="70" rx="15" fill="url(#screenGradient)" />

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
      {animatedHappy ? (
        <>
          {/* Neutral mouth fading out */}
          <path
            d="M 85 108 Q 100 115 115 108"
            fill="none"
            stroke="#ff6b6b"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ animation: 'mouth-from-neutral 4s ease-in-out forwards' }}
          />
          {/* Happy mouth fading in */}
          <path
            d="M 80 105 Q 100 120 120 105"
            fill="none"
            stroke="#ff6b6b"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ animation: 'mouth-to-happy 4s ease-in-out forwards' }}
          />
        </>
      ) : (
        <>
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
        </>
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
      <rect x="18" y="85" width="18" height="35" rx="9" fill="url(#bodyGradient)" />
      {/* Forearm - dark grey */}
      <rect x="18" y="118" width="18" height="35" rx="9" fill="url(#darkGradient)" />
      {/* Hand - spherical */}
      <circle cx="27" cy="162" r="11" fill="url(#bodyGradient)" />
      <circle cx="27" cy="160" r="9" fill="#ffffff" opacity="0.2" />

      {/* Right Arm - animated through all three positions */}
      <g className={wave ? "gentle-waving-arm" : ""}>
        {wave ? (
          <>
            {/* Upper arm - light colored - horizontal to the right */}
            <rect x="182" y="93" width="35" height="18" rx="9" fill="url(#bodyGradient)" style={{ animation: 'arm-morph 4s ease-in-out infinite' }} />
            {/* Forearm and Hand - animated bending at elbow */}
            <g className="waving-forearm">
              {/* Forearm - dark grey */}
              <rect x="217" y="93" width="35" height="18" rx="9" fill="url(#darkGradient)" />
              {/* Hand - spherical */}
              <circle cx="261" cy="102" r="11" fill="url(#bodyGradient)" />
              <circle cx="259" cy="102" r="9" fill="#ffffff" opacity="0.2" />
            </g>
          </>
        ) : (
          <>
            {/* No wave - arm down */}
            <rect x="164" y="85" width="18" height="35" rx="9" fill="url(#bodyGradient)" />
            <rect x="164" y="118" width="18" height="35" rx="9" fill="url(#darkGradient)" />
            <circle cx="173" cy="162" r="11" fill="url(#bodyGradient)" />
            <circle cx="173" cy="160" r="9" fill="#ffffff" opacity="0.2" />
          </>
        )}
      </g>

      {/* Left Leg */}
      {/* Upper leg */}
      <rect x="75" y="150" width="18" height="50" rx="9" fill="url(#darkGradient)" />
      {/* Knee band */}
      <rect x="75" y="195" width="18" height="6" rx="2" fill="#a0a0a0" />
      {/* Lower leg */}
      <rect x="75" y="200" width="18" height="40" rx="9" fill="#e8e8e8" />
      {/* Leg highlight */}
      <rect x="76" y="202" width="16" height="15" rx="7" fill="#ffffff" opacity="0.3" />

      {/* Foot */}
      <g>
        <ellipse cx="84" cy="245" rx="14" ry="11" fill="#e8e8e8" />
        <ellipse cx="91" cy="245" rx="9" ry="9" fill="#808080" />
        <ellipse cx="84" cy="242" rx="12" ry="6" fill="#ffffff" opacity="0.3" />
      </g>

      {/* Right Leg */}
      {/* Upper leg */}
      <rect x="107" y="150" width="18" height="50" rx="9" fill="url(#darkGradient)" />
      {/* Knee band */}
      <rect x="107" y="195" width="18" height="6" rx="2" fill="#a0a0a0" />
      {/* Lower leg */}
      <rect x="107" y="200" width="18" height="40" rx="9" fill="#e8e8e8" />
      {/* Leg highlight */}
      <rect x="108" y="202" width="16" height="15" rx="7" fill="#ffffff" opacity="0.3" />

      {/* Foot */}
      <g>
        <ellipse cx="116" cy="245" rx="14" ry="11" fill="#e8e8e8" />
        <ellipse cx="123" cy="245" rx="9" ry="9" fill="#808080" />
        <ellipse cx="116" cy="242" rx="12" ry="6" fill="#ffffff" opacity="0.3" />
      </g>
      </svg>
    </>
  );
}
