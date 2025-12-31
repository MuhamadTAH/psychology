// 🧠 FILE PURPOSE
// This component creates a faint halo glow behind the badge for Tier D and above.
// It only renders when tier.auraHaloEnabled is true.
// The halo has a subtle pulse driven by timeline.progress in idle state.

'use client';

import React from 'react';
import { type StreakTierConfig } from '@/md/lib/streakFxConfig';
import { type BadgeTimeline } from '@/md/lib/streakStateMachine';

interface AuraHaloProps {
  timeline: BadgeTimeline;
  tierConfig: StreakTierConfig;
  size: number;
}

export function AuraHalo({ timeline, tierConfig, size }: AuraHaloProps) {
  // Step 1: Only render if aura halo is enabled (Tier D and above)
  if (!tierConfig.auraHaloEnabled) {
    return null;
  }

  // Step 2: Calculate opacity based on timeline state
  const getOpacity = () => {
    if (timeline.state === 'idle') {
      // Subtle pulse: sine wave between 0.15 and 0.3
      const pulse = 0.15 + Math.sin(timeline.progress * Math.PI * 2) * 0.075;
      return pulse;
    } else if (timeline.state === 'celebrate') {
      // During celebrate: slightly brighter
      return 0.35;
    } else if (timeline.state === 'milestone') {
      // During milestone: much brighter
      return 0.5;
    }
    // During cooldown: fade out
    return 0.15 * (1 - timeline.progress);
  };

  // Step 3: Get halo color based on tier color temperature
  const getHaloColor = () => {
    switch (tierConfig.colorTemp) {
      case 'cool':
        return 'rgba(148, 163, 184, 0.4)'; // slate-400
      case 'warm':
        return 'rgba(251, 146, 60, 0.4)'; // orange-400
      case 'energy':
        return 'rgba(251, 191, 36, 0.5)'; // amber-400
      case 'gold':
        return 'rgba(250, 204, 21, 0.6)'; // yellow-400
    }
  };

  const opacity = getOpacity();
  const haloColor = getHaloColor();

  // Step 4: Render halo (behind badge, larger than badge)
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{
        width: size,
        height: size,
        // Position it behind the badge (z-index managed by parent)
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: size * 1.6,
          height: size * 1.6,
          background: `radial-gradient(circle, ${haloColor} 0%, transparent 60%)`,
          opacity: opacity,
          willChange: 'opacity',
          transition: 'opacity 0.3s ease-out',
        }}
      />
    </div>
  );
}

// ✅ In this section we achieved:
// A subtle halo glow for high-tier streaks (Tier D+).
// Breathing pulse driven by timeline.progress in idle state.
// Color matches tier color temperature.
// GPU-accelerated with opacity changes only.
// Larger than badge (1.6x size) to create depth.
