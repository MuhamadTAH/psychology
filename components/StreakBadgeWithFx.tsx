// 🧠 FILE PURPOSE
// This is a wrapper component that combines StreakBadge with all FX components.
// It manages the timeline and passes it down to all FX layers.
// This is the component that should be used throughout the app.

'use client';

import React from 'react';
import { StreakBadge } from './StreakBadge';
import { getStreakTier } from '@/md/lib/streakFxConfig';
import { useStreakTimeline, type TriggerType } from '@/md/lib/streakStateMachine';
import { GlowPulse } from './streak-fx/GlowPulse';
import { ShineSweep } from './streak-fx/ShineSweep';
import { SparkleParticles } from './streak-fx/SparkleParticles';
import { RingPing } from './streak-fx/RingPing';
import { AuraHalo } from './streak-fx/AuraHalo';
import { MilestoneAnimation } from './MilestoneAnimation';

interface StreakBadgeWithFxProps {
  streakCount: number;
  triggerType?: TriggerType;
  size?: number;
  onAnimationComplete?: () => void;
}

export function StreakBadgeWithFx({
  streakCount,
  triggerType = 'idle',
  size = 140,
  onAnimationComplete,
}: StreakBadgeWithFxProps) {
  // Step 1: Initialize timeline
  const { timeline, triggerCelebrate, triggerMilestone } = useStreakTimeline(
    streakCount,
    triggerType
  );

  // Step 2: Get tier configuration
  const tierConfig = getStreakTier(streakCount);

  // Step 3: Call onAnimationComplete when animation finishes
  React.useEffect(() => {
    if (timeline.state === 'idle' && timeline.progress > 0.9 && onAnimationComplete) {
      // Animation cycle completed, call callback
      onAnimationComplete();
    }
  }, [timeline.state, timeline.progress, onAnimationComplete]);

  // Step 4: Expose trigger functions for parent components
  // Store in ref to allow external triggering
  React.useEffect(() => {
    // You can attach these to window or context if needed
    // For now, they're available via useStreakTimeline hook
  }, [triggerCelebrate, triggerMilestone]);

  return (
    <div className="relative">
      <StreakBadge streakCount={streakCount} timeline={timeline} size={size}>
        {/* FX Layer 1: Aura Halo (behind everything) */}
        <AuraHalo timeline={timeline} tierConfig={tierConfig} size={size} />

        {/* FX Layer 2: Glow Pulse (breathing effect) */}
        <GlowPulse timeline={timeline} tierConfig={tierConfig} size={size} />

        {/* FX Layer 3: Ring Ping (expanding circle) */}
        <RingPing timeline={timeline} tierConfig={tierConfig} size={size} />

        {/* FX Layer 4: Shine Sweep (diagonal sweep) */}
        <ShineSweep timeline={timeline} tierConfig={tierConfig} size={size} />

        {/* FX Layer 5: Sparkle Particles */}
        <SparkleParticles timeline={timeline} tierConfig={tierConfig} size={size} />

        {/* FX Layer 6: Milestone Animation (on top of everything) */}
        {tierConfig.isMilestone && tierConfig.milestoneType && (
          <MilestoneAnimation
            milestoneDay={tierConfig.milestoneType}
            timeline={timeline}
            size={size}
            onComplete={onAnimationComplete}
          />
        )}
      </StreakBadge>
    </div>
  );
}

// Export trigger functions hook for external use
export function useStreakBadgeTriggers(streakCount: number) {
  const { triggerCelebrate, triggerMilestone } = useStreakTimeline(streakCount, 'idle');
  return { triggerCelebrate, triggerMilestone };
}

// ✅ In this section we achieved:
// A single wrapper component that manages all FX layers.
// Proper layering: Aura → Glow → Ring → Shine → Sparkles → Milestone.
// Timeline shared across all FX components (no jitter).
// Callback when animation completes.
// Exportable trigger functions for external use.
