// 🧠 FILE PURPOSE
// This component creates tiny sparkle particles that appear during celebrate state.
// It respects tier.sparkleCount and tier.maxParticles budget.
// Each particle has random position and fades based on timeline.progress.

'use client';

import React, { useMemo } from 'react';
import { type StreakTierConfig } from '@/lib/streakFxConfig';
import { type BadgeTimeline } from '@/lib/streakStateMachine';

interface SparkleParticlesProps {
  timeline: BadgeTimeline;
  tierConfig: StreakTierConfig;
  size: number;
}

interface Particle {
  id: number;
  x: number; // Position in %
  y: number; // Position in %
  delay: number; // Delay in progress (0.0 - 0.3)
  size: number; // Size in px
}

export function SparkleParticles({ timeline, tierConfig, size }: SparkleParticlesProps) {
  // Step 1: Only render during onUpdate trigger
  if (timeline.triggerType !== 'onUpdate') {
    return null;
  }

  // Only show during celebrate state
  if (timeline.state !== 'celebrate') {
    return null;
  }

  // Step 2: Generate random particle positions (memoized to avoid regeneration)
  const particles = useMemo<Particle[]>(() => {
    const count = Math.min(tierConfig.sparkleCount, tierConfig.maxParticles);
    const result: Particle[] = [];

    for (let i = 0; i < count; i++) {
      result.push({
        id: i,
        // Random position around the badge (not directly on center)
        x: 30 + Math.random() * 40, // 30-70%
        y: 20 + Math.random() * 60, // 20-80%
        delay: Math.random() * 0.3, // Stagger appearance
        size: 3 + Math.random() * 3, // 3-6px
      });
    }

    return result;
  }, [tierConfig.sparkleCount, tierConfig.maxParticles]);

  // Step 3: Calculate opacity for each particle based on progress and delay
  const getParticleOpacity = (particle: Particle) => {
    const adjustedProgress = timeline.progress - particle.delay;

    if (adjustedProgress < 0) {
      return 0; // Not yet visible
    } else if (adjustedProgress < 0.2) {
      return adjustedProgress / 0.2; // Fade in
    } else if (adjustedProgress < 0.6) {
      return 1; // Full visibility
    } else {
      return 1 - ((adjustedProgress - 0.6) / 0.4); // Fade out
    }
  };

  // Step 4: Render particles
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        width: size,
        height: size,
      }}
    >
      {particles.map((particle) => {
        const opacity = getParticleOpacity(particle);

        // Don't render if not visible
        if (opacity <= 0) return null;

        return (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              opacity: opacity,
              transform: `translate(-50%, -50%) scale(${1 + timeline.progress * 0.5})`,
              willChange: 'opacity, transform',
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
            }}
          />
        );
      })}
    </div>
  );
}

// ✅ In this section we achieved:
// Sparkle particles that respect the tier's maxParticles budget (max 6).
// Random positions with staggered appearance (looks more organic).
// Fade in/out driven by timeline.progress.
// GPU-accelerated with transform + opacity.
// Memoized particle generation (no re-renders during animation).
