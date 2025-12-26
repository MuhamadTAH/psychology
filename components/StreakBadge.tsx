// 🧠 FILE PURPOSE
// This is the main streak badge component with 5 mandatory layers:
// 1. Back plate (shield body)
// 2. Inner plate (inset area)
// 3. Number (centered, chunky font with stroke + shadow)
// 4. Edge highlight (rim light)
// 5. FX overlay (glow/sweep/particles - controlled by timeline)

'use client';

import React, { useState, useEffect } from 'react';
import { getStreakTier, type StreakTierConfig } from '@/lib/streakFxConfig';
import { type BadgeTimeline } from '@/lib/streakStateMachine';

interface StreakBadgeProps {
  streakCount: number;
  timeline: BadgeTimeline;
  size?: number; // Size in pixels (default: 140)
  children?: React.ReactNode; // FX overlay components go here
}

export function StreakBadge({
  streakCount,
  timeline,
  size = 140,
  children,
}: StreakBadgeProps) {
  // Step: Pre-load streak sound for instant playback
  // This sound plays when the day number changes
  const [streakSound] = useState(() => {
    if (typeof window !== 'undefined') {
      const sound = new Audio('/sounds/streak-sound.mp3');
      sound.volume = 0.7;
      return sound;
    }
    return null;
  });

  // Step: Play sound when streak count changes
  // Detects when the number updates and plays celebration sound
  useEffect(() => {
    if (streakCount > 0 && streakSound) {
      streakSound.currentTime = 0;
      streakSound.play().catch(() => {});
    }
  }, [streakCount, streakSound]);

  // Step 1: Get tier configuration for this streak day
  const tierConfig = getStreakTier(streakCount);

  // Step 2: Calculate scale and number offset for "snap confirm" transition
  const getScale = () => {
    if (timeline.state === 'celebrate') {
      // Snap confirm: 1.0 → 1.04 → 1.0 (fast, controlled)
      const snapProgress = Math.min(timeline.progress * 2.5, 1);
      return 1 + (0.04 * Math.sin(snapProgress * Math.PI));
    } else if (timeline.state === 'milestone') {
      // Milestone: bigger bounce (reward moment)
      return 1 + ((tierConfig.bounceScale - 1) * Math.sin(timeline.progress * Math.PI));
    }
    return 1;
  };

  const getNumberOffset = () => {
    if (timeline.state === 'celebrate') {
      // Slight upward slide (2-4px) during snap confirm
      const snapProgress = Math.min(timeline.progress * 2.5, 1);
      return -3 * Math.sin(snapProgress * Math.PI);
    }
    return 0;
  };

  const scale = getScale();
  const numberOffset = getNumberOffset();

  // Step 3: Get color theme based on tier
  const getColorTheme = (colorTemp: StreakTierConfig['colorTemp']) => {
    switch (colorTemp) {
      case 'cool':
        return {
          backStart: '#3B82F6', // Bright blue
          backEnd: '#1E40AF',   // Deep blue
          innerStart: '#60A5FA', // Light blue
          innerEnd: '#3B82F6',   // Bright blue
          edgeColor: '#93C5FD',  // Very light blue
          numberColor: '#FFFFFF', // Pure white
          strokeColor: '#1E3A8A', // Dark blue
        };
      case 'warm':
        return {
          backStart: '#F97316', // Bright orange
          backEnd: '#C2410C',   // Deep orange
          innerStart: '#FB923C', // Light orange
          innerEnd: '#F97316',   // Bright orange
          edgeColor: '#FDBA74',  // Very light orange
          numberColor: '#FFFFFF',
          strokeColor: '#7C2D12', // Dark orange
        };
      case 'energy':
        return {
          backStart: '#F59E0B', // Bright amber
          backEnd: '#B45309',   // Deep amber
          innerStart: '#FCD34D', // Light amber
          innerEnd: '#F59E0B',   // Bright amber
          edgeColor: '#FDE68A',  // Very light amber
          numberColor: '#FFFFFF',
          strokeColor: '#78350F', // Dark amber
        };
      case 'gold':
        return {
          backStart: '#FBBF24', // Bright yellow
          backEnd: '#D97706',   // Deep yellow
          innerStart: '#FDE047', // Light yellow
          innerEnd: '#FBBF24',   // Bright yellow
          edgeColor: '#FEF3C7',  // Very light yellow
          numberColor: '#FFFFFF',
          strokeColor: '#92400E', // Dark yellow
        };
    }
  };

  const colors = getColorTheme(tierConfig.colorTemp);

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
        transform: `scale(${scale})`,
        transition: 'transform 0.1s ease-out',
        willChange: tierConfig.useGpuAcceleration ? 'transform' : 'auto',
      }}
    >
      {/* Step 4: FX Overlay Layer (behind badge) */}
      <div className="absolute inset-0 pointer-events-none">
        {children}
      </div>

      {/* Step 5: Main Badge Container */}
      <div className="relative w-full h-full">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))' }}
        >
          <defs>
            {/* Back plate gradient */}
            <linearGradient id={`backGradient-${streakCount}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.backStart} />
              <stop offset="100%" stopColor={colors.backEnd} />
            </linearGradient>

            {/* Inner plate gradient */}
            <linearGradient id={`innerGradient-${streakCount}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.innerStart} />
              <stop offset="100%" stopColor={colors.innerEnd} />
            </linearGradient>

            {/* Edge highlight gradient */}
            <linearGradient id={`edgeGradient-${streakCount}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.edgeColor} stopOpacity="0.8" />
              <stop offset="50%" stopColor={colors.edgeColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colors.edgeColor} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Layer 1: Back Plate (Shield Body) - Dark outer layer */}
          <path
            d="M 50 8
               C 62 8, 72 10, 82 20
               L 88 52
               C 88 74, 77 88, 50 98
               C 23 88, 12 74, 12 52
               L 18 20
               C 28 10, 38 8, 50 8 Z"
            fill={`url(#backGradient-${streakCount})`}
          />

          {/* Layer 2: Inner Plate (Visible lighter inset) */}
          <path
            d="M 50 16
               C 59 16, 66 18, 74 26
               L 79 52
               C 79 69, 70 81, 50 89
               C 30 81, 21 69, 21 52
               L 26 26
               C 34 18, 41 16, 50 16 Z"
            fill={`url(#innerGradient-${streakCount})`}
          />

          {/* Layer 3: Edge Highlight (Top rim light) */}
          <path
            d="M 50 8
               C 62 8, 72 10, 82 20
               L 88 40
               L 12 40
               L 18 20
               C 28 10, 38 8, 50 8 Z"
            fill={`url(#edgeGradient-${streakCount})`}
          />

          {/* Layer 4: Rim outline (Makes edge crisp and visible) */}
          <path
            d="M 50 8
               C 62 8, 72 10, 82 20
               L 88 52
               C 88 74, 77 88, 50 98
               C 23 88, 12 74, 12 52
               L 18 20
               C 28 10, 38 8, 50 8 Z"
            fill="none"
            stroke={colors.edgeColor}
            strokeWidth="1"
            opacity="0.4"
          />
        </svg>

        {/* Layer 5: Number (DOMINANT - Thick, bright, readable) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            style={{
              fontSize: streakCount >= 100 ? size * 0.38 : size * 0.48,
              fontFamily: '"Nunito", "Fredoka", "Montserrat", sans-serif',
              fontWeight: 900,
              color: colors.numberColor,
              textShadow: `
                3px 3px 6px rgba(0, 0, 0, 0.6),
                0 0 8px rgba(0, 0, 0, 0.4)
              `,
              WebkitTextStroke: `${size * 0.012}px ${colors.strokeColor}`,
              paintOrder: 'stroke fill',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              transform: `translateY(${numberOffset}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          >
            {streakCount}
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <span className="sr-only">Streak: {streakCount} days</span>
    </div>
  );
}

// ✅ In this section we achieved:
// A 5-layer badge structure that stays consistent across all streak days.
// Color temperature progression (cool → warm → energy → gold).
// Bounce animation driven by timeline.progress.
// Readable number with stroke + shadow on any background.
// GPU acceleration for smooth 60fps performance.
