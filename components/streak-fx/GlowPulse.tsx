// 🧠 FILE PURPOSE
// This component creates the breathing glow effect behind the streak badge.
// It reads from timeline.progress and tier.glowIntensity to create a calm,
// pulsing radial gradient. This is the ONLY idle animation (always running).

'use client';

import React from 'react';
import { type StreakTierConfig } from '@/lib/streakFxConfig';
import { type BadgeTimeline } from '@/lib/streakStateMachine';

interface GlowPulseProps {
  timeline: BadgeTimeline;
  tierConfig: StreakTierConfig;
  size: number;
}

export function GlowPulse({ timeline, tierConfig, size }: GlowPulseProps) {
  // Step 1: Calculate opacity based on timeline.progress
  // For idle state: create a sine wave for breathing effect
  // For other states: fade out to not interfere
  const getOpacity = () => {
    if (timeline.state === 'idle') {
      // Breathing: sine wave oscillates between 0.5 and 1.0
      const breathe = 0.5 + Math.sin(timeline.progress * Math.PI * 2) * 0.5;
      return tierConfig.glowIntensity * breathe;
    } else if (timeline.state === 'celebrate') {
      // During celebrate: boost glow slightly
      return tierConfig.glowIntensity * 1.2;
    } else if (timeline.state === 'milestone') {
      // During milestone: much stronger glow
      return tierConfig.glowIntensity * 1.5;
    }
    // During cooldown: fade out
    return tierConfig.glowIntensity * (1 - timeline.progress);
  };

  // Step 2: Get glow color based on tier color temperature
  const getGlowColor = () => {
    switch (tierConfig.colorTemp) {
      case 'cool':
        return 'rgba(148, 163, 184, {opacity})'; // slate-400
      case 'warm':
        return 'rgba(251, 146, 60, {opacity})'; // orange-400
      case 'energy':
        return 'rgba(251, 191, 36, {opacity})'; // amber-400
      case 'gold':
        return 'rgba(250, 204, 21, {opacity})'; // yellow-400
    }
  };

  const opacity = getOpacity();
  const glowColor = getGlowColor().replace('{opacity}', opacity.toString());

  // Step 3: Render radial gradient glow
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{
        willChange: 'opacity',
      }}
    >
      <div
        className="rounded-full"
        style={{
          width: size + tierConfig.glowRadius * 2,
          height: size + tierConfig.glowRadius * 2,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          opacity: opacity,
          transition: 'opacity 0.2s ease-out',
        }}
      />
    </div>
  );
}

// ✅ In this section we achieved:
// A breathing glow effect driven by timeline.progress (sine wave).
// GPU-accelerated using CSS opacity changes (composited property).
// Color temperature progression matching the badge tier.
// Smooth transitions between states without jarring jumps.
