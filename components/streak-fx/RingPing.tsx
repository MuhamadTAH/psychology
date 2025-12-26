// 🧠 FILE PURPOSE
// This component creates an expanding ring effect that "pings" outward from the badge center.
// It only renders when tier.ringPingEnabled is true and during celebrate state.
// Scale and opacity are driven by timeline.progress.

'use client';

import React from 'react';
import { type StreakTierConfig } from '@/lib/streakFxConfig';
import { type BadgeTimeline } from '@/lib/streakStateMachine';

interface RingPingProps {
  timeline: BadgeTimeline;
  tierConfig: StreakTierConfig;
  size: number;
}

export function RingPing({ timeline, tierConfig, size }: RingPingProps) {
  // Step 1: Only render if ring ping is enabled
  if (!tierConfig.ringPingEnabled) {
    return null;
  }

  // Only render during onUpdate trigger
  if (timeline.triggerType !== 'onUpdate') {
    return null;
  }

  // Only show during celebrate state
  if (timeline.state !== 'celebrate') {
    return null;
  }

  // Step 2: Calculate scale based on timeline.progress
  // Starts at 1.0 (badge size) and expands to 2.0 (double badge size)
  const scale = 1 + timeline.progress;

  // Step 3: Calculate opacity - fade out as it expands
  const opacity = Math.max(0, 1 - timeline.progress);

  // Step 4: Get ring color based on tier color temperature
  const getRingColor = () => {
    switch (tierConfig.colorTemp) {
      case 'cool':
        return 'rgba(148, 163, 184, 0.6)'; // slate-400
      case 'warm':
        return 'rgba(251, 146, 60, 0.6)'; // orange-400
      case 'energy':
        return 'rgba(251, 191, 36, 0.6)'; // amber-400
      case 'gold':
        return 'rgba(250, 204, 21, 0.7)'; // yellow-400
    }
  };

  const ringColor = getRingColor();

  // Step 5: Render expanding ring
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        className="absolute rounded-full border-4"
        style={{
          width: size * 0.9,
          height: size * 0.9,
          borderColor: ringColor,
          transform: `scale(${scale})`,
          opacity: opacity,
          willChange: 'transform, opacity',
          transition: 'none', // Driven by progress, no CSS transition
        }}
      />
    </div>
  );
}

// ✅ In this section we achieved:
// An expanding ring that "pings" outward from badge center.
// Only renders when tier config enables it (Tier C and above).
// Scale and opacity driven by timeline.progress.
// GPU-accelerated with transform + opacity.
// Color matches tier color temperature.
