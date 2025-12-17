// 🧠 FILE PURPOSE
// This file contains the state machine and timeline controller for the streak badge.
// It's the SINGLE source of truth for all animations - all FX components read from
// the shared timeline.progress value. This prevents jitter, mismatched timing, and
// overlapping effects.

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Step 1: Define state machine types
export type BadgeState = 'idle' | 'celebrate' | 'milestone' | 'cooldown';
export type TriggerType = 'idle' | 'onUpdate' | 'onView';

export interface BadgeTimeline {
  state: BadgeState;
  progress: number;        // 0.0 - 1.0 (shared by all FX)
  triggerType: TriggerType;
  startTime: number;
  duration: number;
  canTrigger: boolean;     // Prevents spam
}

// Step 2: Define duration constants for each state
const STATE_DURATIONS = {
  idle: 3000,        // 3.0s breathing loop (will vary: 2.8-3.6s based on tier)
  celebrate: 400,    // 0.4s snap confirm (fast, quiet, controlled)
  milestone: 1600,   // 1.6s milestone animation (will vary: 1.2-2.0s)
  cooldown: 300,     // 0.3s cooldown after celebrate
  milestoneCooldown: 500, // 0.5s cooldown after milestone
  onView: 800,       // 0.8s calm entrance
};

// Step 3: Main hook - useStreakTimeline
// This is the single timeline controller that all FX components read from
export function useStreakTimeline(
  streakDay: number,
  initialTrigger: TriggerType = 'idle'
) {
  // State for the timeline
  const [timeline, setTimeline] = useState<BadgeTimeline>({
    state: 'idle',
    progress: 0,
    triggerType: initialTrigger,
    startTime: Date.now(),
    duration: STATE_DURATIONS.idle,
    canTrigger: true,
  });

  // Refs to track animation state without causing re-renders
  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  // Step 4: Animation loop using requestAnimationFrame
  // This single RAF loop updates timeline.progress for ALL FX components
  const animate = useCallback(() => {
    const now = Date.now();
    const elapsed = now - timeline.startTime;
    const progress = Math.min(elapsed / timeline.duration, 1);

    // Update timeline progress
    setTimeline((prev) => ({
      ...prev,
      progress,
    }));

    // Check if animation is complete
    if (progress >= 1) {
      // Handle state transitions
      if (timeline.state === 'celebrate') {
        // Celebrate complete → cooldown
        setTimeline({
          state: 'cooldown',
          progress: 0,
          triggerType: 'idle',
          startTime: now,
          duration: STATE_DURATIONS.cooldown,
          canTrigger: false,
        });
      } else if (timeline.state === 'milestone') {
        // Milestone complete → cooldown
        setTimeline({
          state: 'cooldown',
          progress: 0,
          triggerType: 'idle',
          startTime: now,
          duration: STATE_DURATIONS.milestoneCooldown,
          canTrigger: false,
        });
      } else if (timeline.state === 'cooldown') {
        // Cooldown complete → idle
        setTimeline({
          state: 'idle',
          progress: 0,
          triggerType: 'idle',
          startTime: now,
          duration: STATE_DURATIONS.idle,
          canTrigger: true,
        });
      } else if (timeline.state === 'idle') {
        // Idle loop restarts
        setTimeline((prev) => ({
          ...prev,
          progress: 0,
          startTime: now,
        }));
      }
    }

    // Continue animation loop
    rafIdRef.current = requestAnimationFrame(animate);
  }, [timeline.state, timeline.startTime, timeline.duration]);

  // Step 5: Start animation loop on mount
  useEffect(() => {
    rafIdRef.current = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [animate]);

  // Step 6: Trigger functions for celebrate and milestone
  const triggerCelebrate = useCallback(() => {
    if (!timeline.canTrigger) {
      console.log('Streak badge: Celebrate trigger blocked by cooldown');
      return;
    }

    console.log('Streak badge: Triggering celebrate animation');
    setTimeline({
      state: 'celebrate',
      progress: 0,
      triggerType: 'onUpdate',
      startTime: Date.now(),
      duration: STATE_DURATIONS.celebrate,
      canTrigger: false,
    });
  }, [timeline.canTrigger]);

  const triggerMilestone = useCallback((milestoneDay: 5 | 10 | 15 | 20 | 25 | 30) => {
    if (!timeline.canTrigger) {
      console.log('Streak badge: Milestone trigger blocked by cooldown');
      return;
    }

    // Vary milestone duration based on milestone type
    let duration = STATE_DURATIONS.milestone;
    if (milestoneDay === 5) duration = 1200;
    else if (milestoneDay === 10) duration = 1400;
    else if (milestoneDay === 15) duration = 1600;
    else if (milestoneDay === 20) duration = 1700;
    else if (milestoneDay === 25) duration = 1800;
    else if (milestoneDay === 30) duration = 2000;

    console.log(`Streak badge: Triggering milestone ${milestoneDay} animation`);
    setTimeline({
      state: 'milestone',
      progress: 0,
      triggerType: 'onUpdate',
      startTime: Date.now(),
      duration,
      canTrigger: false,
    });
  }, [timeline.canTrigger]);

  // Step 7: Return timeline and trigger functions
  return {
    timeline,
    triggerCelebrate,
    triggerMilestone,
  };
}

// ✅ In this section we achieved:
// A single timeline controller that prevents jitter and mismatched timing.
// State machine with proper transitions: idle → celebrate → cooldown → idle
// Cooldown mechanism that prevents spam without locking the entire screen.
// Single RAF loop for optimal performance (not multiple independent animations).
