// 🧠 FILE PURPOSE
// This file contains the central configuration for the streak badge FX system.
// It maps streak days to explicit visual parameters (no vibes, only numbers).
// This ensures consistent, scalable animations across all tiers.

// Step 1: Define the tier configuration interface
export interface StreakTierConfig {
  tier: 'A' | 'B' | 'C' | 'D' | 'milestone';

  // Glow parameters
  glowIntensity: number;        // 0.0 - 1.0
  glowRadius: number;           // px
  pulseSpeed: number;           // seconds per cycle

  // Animation flags
  shineEnabled: boolean;
  sparkleCount: number;         // 0-6 particles max
  ringPingEnabled: boolean;
  auraHaloEnabled: boolean;

  // Visual properties
  colorTemp: 'cool' | 'warm' | 'energy' | 'gold';
  bounceScale: number;          // 1.0 - 1.05 (percentage increase)
  bounceEasing: string;         // CSS easing function

  // Milestone detection
  isMilestone: boolean;
  milestoneType?: 5 | 10 | 15 | 20 | 25 | 30;

  // Performance budget
  maxParticles: number;         // Hard cap for this tier
  useGpuAcceleration: boolean;  // will-change: transform
}

// Step 2: Define explicit tier configurations
// These are the baseline configurations for days 1-15
const TIER_CONFIGS: Record<'A' | 'B' | 'C' | 'D', StreakTierConfig> = {
  // Tier A: Days 1-3 (Gentle Start)
  A: {
    tier: 'A',
    glowIntensity: 0.3,
    glowRadius: 40,
    pulseSpeed: 3.2,
    shineEnabled: false,
    sparkleCount: 0,
    ringPingEnabled: false,
    auraHaloEnabled: false,
    colorTemp: 'cool',
    bounceScale: 1.02,
    bounceEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    isMilestone: false,
    maxParticles: 0,
    useGpuAcceleration: true,
  },

  // Tier B: Days 4-7 (Building Up)
  B: {
    tier: 'B',
    glowIntensity: 0.5,
    glowRadius: 50,
    pulseSpeed: 2.8,
    shineEnabled: true,
    sparkleCount: 4,
    ringPingEnabled: false,
    auraHaloEnabled: false,
    colorTemp: 'cool',
    bounceScale: 1.03,
    bounceEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    isMilestone: false,
    maxParticles: 4,
    useGpuAcceleration: true,
  },

  // Tier C: Days 8-12 (Getting Warm)
  C: {
    tier: 'C',
    glowIntensity: 0.7,
    glowRadius: 60,
    pulseSpeed: 2.6,
    shineEnabled: true,
    sparkleCount: 6,
    ringPingEnabled: true,
    auraHaloEnabled: false,
    colorTemp: 'warm',
    bounceScale: 1.04,
    bounceEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    isMilestone: false,
    maxParticles: 6,
    useGpuAcceleration: true,
  },

  // Tier D: Days 13-15 (Almost Milestone)
  D: {
    tier: 'D',
    glowIntensity: 0.85,
    glowRadius: 70,
    pulseSpeed: 2.4,
    shineEnabled: true,
    sparkleCount: 6,
    ringPingEnabled: true,
    auraHaloEnabled: true,
    colorTemp: 'warm',
    bounceScale: 1.05,
    bounceEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    isMilestone: false,
    maxParticles: 6,
    useGpuAcceleration: true,
  },
};

// Step 3: Define milestone particle budgets
const MILESTONE_PARTICLE_COUNTS: Record<5 | 10 | 15 | 20 | 25 | 30, number> = {
  5: 20,   // 10-20 sparks
  10: 40,  // 40 sparks
  15: 40,  // 40 sparks
  20: 60,  // 60 sparks
  25: 80,  // 80 sparks
  30: 100, // 100 sparks
};

// Step 4: Main function to get tier config for any streak day
export function getStreakTier(day: number): StreakTierConfig {
  // Check if this is a milestone day
  const milestones = [5, 10, 15, 20, 25, 30];
  if (milestones.includes(day)) {
    // For milestones, use Tier D as base but mark as milestone
    const milestoneType = day as 5 | 10 | 15 | 20 | 25 | 30;
    return {
      ...TIER_CONFIGS.D,
      tier: 'milestone',
      isMilestone: true,
      milestoneType,
      maxParticles: MILESTONE_PARTICLE_COUNTS[milestoneType],
      colorTemp: day === 30 ? 'gold' : day >= 20 ? 'energy' : 'warm',
    };
  }

  // For non-milestone days, determine tier based on day count
  if (day >= 1 && day <= 3) {
    // Days 1-3: Cool blue (starting out)
    return TIER_CONFIGS.A;
  } else if (day >= 4 && day <= 7) {
    // Days 4-7: Still cool, but more features
    return TIER_CONFIGS.B;
  } else if (day >= 8 && day <= 12) {
    // Days 8-12: Warm orange (heating up!)
    return TIER_CONFIGS.C;
  } else if (day >= 13 && day <= 15) {
    // Days 13-15: Warm orange (almost milestone)
    return TIER_CONFIGS.D;
  } else if (day >= 16 && day <= 19) {
    // Days 16-19: Energy amber (building to milestone 20)
    return {
      ...TIER_CONFIGS.D,
      colorTemp: 'energy',
    };
  } else if (day >= 21 && day <= 24) {
    // Days 21-24: Energy amber (building to milestone 25)
    return {
      ...TIER_CONFIGS.D,
      colorTemp: 'energy',
    };
  }

  // For days 26+, use gold colors (legendary territory!)
  return {
    ...TIER_CONFIGS.D,
    colorTemp: 'gold',
  };
}

// ✅ In this section we achieved:
// A centralized configuration system with explicit numbers for all tiers.
// No guessing or "vibes" - every parameter is precisely defined.
// Easy to adjust parameters without touching component code.
