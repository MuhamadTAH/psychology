// 🧠 FILE PURPOSE
// This component creates a diagonal shine sweep effect across the badge.
// It ONLY renders when timeline.triggerType === 'onUpdate' AND tier.shineEnabled.
// The sweep moves from left to right, driven by timeline.progress.

'use client';

import React from 'react';
import { type StreakTierConfig } from '@/lib/streakFxConfig';
import { type BadgeTimeline } from '@/lib/streakStateMachine';

interface ShineSweepProps {
  timeline: BadgeTimeline;
  tierConfig: StreakTierConfig;
  size: number;
}

export function ShineSweep({ timeline, tierConfig, size }: ShineSweepProps) {
  // Step 1: Only render during onUpdate trigger and if shine is enabled
  if (timeline.triggerType !== 'onUpdate' || !tierConfig.shineEnabled) {
    return null;
  }

  // Only show during celebrate state
  if (timeline.state !== 'celebrate') {
    return null;
  }

  // Step 2: Calculate shine position based on timeline.progress
  // Progress 0.0 = left edge, 1.0 = right edge (moves left to right)
  const translateX = (timeline.progress * 150) - 50; // -50% to 100%

  // Step 3: Calculate opacity for fade in/out
  // Fade in during first 20%, stay visible, fade out during last 20%
  const getOpacity = () => {
    if (timeline.progress < 0.2) {
      return timeline.progress / 0.2; // Fade in
    } else if (timeline.progress > 0.8) {
      return (1 - timeline.progress) / 0.2; // Fade out
    }
    return 1; // Full visibility
  };

  const opacity = getOpacity();

  // Step 4: Render diagonal shine sweep
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        className="absolute inset-y-0 w-16"
        style={{
          left: '50%',
          transform: `translateX(${translateX}%)  rotate(15deg)`,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
          opacity: opacity,
          willChange: 'transform, opacity',
          transition: 'none', // No transition, driven by progress
        }}
      />
    </div>
  );
}

// ✅ In this section we achieved:
// A diagonal shine sweep that only triggers during celebrate state.
// Position driven by timeline.progress (0.0 - 1.0).
// Smooth fade in/out to avoid jarring appearance/disappearance.
// GPU-accelerated with transform and opacity (composited properties).
