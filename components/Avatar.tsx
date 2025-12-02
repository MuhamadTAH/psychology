"use client";

interface AvatarProps {
  theme?: string;
  size?: number;
  animate?: boolean;
}

export default function Avatar({ theme = "default", size = 100, animate = true }: AvatarProps) {
  // Define theme classes
  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case "red-black":
        return "theme-red-black";
      case "bold":
        return "theme-default style-bold";
      case "shadow":
        return "theme-default style-shadow";
      case "sunset":
        return "theme-sunset";
      case "grayscale":
        return "theme-grayscale";
      case "outline":
        return "style-outline";
      case "sunrise":
        return "theme-sunrise";
      case "neon":
        return "theme-neon";
      case "mono-blue":
        return "theme-mono-blue";
      case "square-head":
        return "theme-default square-head";
      default:
        return "theme-default";
    }
  };

  const isSquareHead = theme === "square-head";

  return (
    <>
      <style jsx>{`
        @keyframes lookAround {
          0%, 100% { transform: translate(0, 0); }
          15% { transform: translate(0, -7px); }
          40% { transform: translate(-7px, 0); }
          80% { transform: translate(7px, 0); }
        }
        @keyframes bodyBounce {
          0%, 100% { transform: scaleY(1) rotate(0deg); }
          15% { transform: scaleY(0.95) rotate(0deg); }
          40% { transform: scaleY(1) rotate(5deg); }
          80% { transform: scaleY(1) rotate(-5deg); }
        }
        .user-icon-head { ${animate ? 'animation: lookAround 3s ease-in-out infinite;' : ''} }
        .user-icon-body { transform-origin: bottom; ${animate ? 'animation: bodyBounce 3s ease-in-out infinite;' : ''} }

        /* Theme styles */
        .theme-default .user-icon-body { fill: #60a5fa; }
        .theme-default .user-icon-head circle, .theme-default .user-icon-head rect { fill: #facc15; }

        .theme-red-black .user-icon-body { fill: #1f2937; }
        .theme-red-black .user-icon-head circle { fill: #ef4444; }

        .theme-sunset .user-icon-body { fill: #c026d3; }
        .theme-sunset .user-icon-head circle { fill: #f59e0b; }

        .theme-grayscale .user-icon-body { fill: #4b5563; }
        .theme-grayscale .user-icon-head circle { fill: #d1d5db; }

        .theme-sunrise .user-icon-body { fill: #1e3a8a; }
        .theme-sunrise .user-icon-head circle { fill: url(#sunrise-gradient); }

        .theme-neon .user-icon-body { fill: #d946ef; }
        .theme-neon .user-icon-head circle { fill: #22d3ee; }
        .theme-neon .user-icon { filter: drop-shadow(0 0 7px #d946ef) drop-shadow(0 0 3px #22d3ee); }

        .theme-mono-blue .user-icon-body { fill: #2563eb; }
        .theme-mono-blue .user-icon-head circle { fill: #93c5fd; }

        .style-bold .user-icon-body,
        .style-bold .user-icon-head circle,
        .style-bold .user-icon-head rect {
          stroke: #1f2937;
          stroke-width: 5px;
        }

        .style-outline .user-icon-body,
        .style-outline .user-icon-head circle {
          fill: transparent;
          stroke: #1f2937;
          stroke-width: 5px;
        }

        .style-shadow .user-icon { filter: drop-shadow(4px 4px 3px rgba(0,0,0,0.2)); }
      `}</style>

      <svg
        className={`user-icon ${getThemeClasses(theme)}`}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        {theme === "sunrise" && (
          <defs>
            <linearGradient id="sunrise-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#fde047", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#f97316", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        )}
        <path className="user-icon-body" d="M0 100 C0 65, 20 50, 50 50 C80 50, 100 65, 100 100 Z" />
        <g className="user-icon-head">
          {isSquareHead ? (
            <rect x="25" y="0" width="50" height="50" rx="5" />
          ) : (
            <circle cx="50" cy="25" r="25" />
          )}
        </g>
      </svg>
    </>
  );
}
