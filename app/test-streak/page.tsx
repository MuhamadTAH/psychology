// 🧠 FILE PURPOSE
// This is a test page for the streak badge system.
// It allows you to manually select any streak day (1-30+) and see the badge animations.
// You can test all tiers (A, B, C, D) and milestones (5, 10, 15, 20, 25, 30).

"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { StreakBadge } from "@/components/StreakBadge";
import { getStreakTier } from "@/lib/streakFxConfig";
import { useStreakTimeline } from "@/lib/streakStateMachine";
import { GlowPulse } from "@/components/streak-fx/GlowPulse";
import { ShineSweep } from "@/components/streak-fx/ShineSweep";
import { SparkleParticles } from "@/components/streak-fx/SparkleParticles";
import { RingPing } from "@/components/streak-fx/RingPing";
import { AuraHalo } from "@/components/streak-fx/AuraHalo";
import { MilestoneAnimation } from "@/components/MilestoneAnimation";
import { ArrowLeft, Play, RotateCcw } from "lucide-react";

export default function TestStreakPage() {
  const router = useRouter();

  // Step 1: State management
  const [selectedDay, setSelectedDay] = useState(1);
  const [resetKey, setResetKey] = useState(0);
  const badgeSize = 180;

  // Step 2: Get tier info and timeline for selected day
  const tierConfig = getStreakTier(selectedDay);
  const { timeline, triggerCelebrate, triggerMilestone } = useStreakTimeline(selectedDay, 'onView');

  // Step 3: Quick day selection buttons
  const quickDays = [
    { label: "Day 1", day: 1, tier: "A" },
    { label: "Day 3", day: 3, tier: "A" },
    { label: "Day 5", day: 5, tier: "B (Milestone)" },
    { label: "Day 7", day: 7, tier: "B" },
    { label: "Day 10", day: 10, tier: "C (Milestone)" },
    { label: "Day 12", day: 12, tier: "C" },
    { label: "Day 15", day: 15, tier: "D (Milestone)" },
    { label: "Day 20", day: 20, tier: "D+ (Milestone)" },
    { label: "Day 25", day: 25, tier: "D+ (Milestone)" },
    { label: "Day 30", day: 30, tier: "D+ (Milestone)" },
  ];

  // Step 4: Trigger animation
  const handleTriggerAnimation = () => {
    const milestones = [5, 10, 15, 20, 25, 30];

    if (milestones.includes(selectedDay)) {
      triggerMilestone(selectedDay as 5 | 10 | 15 | 20 | 25 | 30);
    } else {
      triggerCelebrate();
    }
  };

  // Step 5: Reset badge (force remount)
  const handleReset = () => {
    setResetKey(prev => prev + 1);
  };

  // Step 6: Handle day selection
  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    // Reset on day change to restart animation
    setResetKey(prev => prev + 1);

    // Auto-trigger animation after brief delay (let remount settle)
    setTimeout(() => {
      const milestones = [5, 10, 15, 20, 25, 30];
      if (milestones.includes(day)) {
        triggerMilestone(day as 5 | 10 | 15 | 20 | 25 | 30);
      } else {
        triggerCelebrate();
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b-2 border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={() => router.push("/dark-psychology-dashboard")}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-white">🧪 Streak Badge Test Lab</h1>
          <p className="text-gray-400 mt-2">Test all tiers and milestones - Click "Trigger Animation" to see effects!</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Badge Display */}
          <div className="space-y-6">
            {/* Badge Display Card */}
            <div className="bg-gray-800 rounded-2xl border-2 border-gray-700 p-8">
              <div className="flex flex-col items-center">
                <h2 className="text-white text-2xl font-bold mb-6">
                  Day {selectedDay} Streak Badge
                </h2>

                {/* Badge Display with FX */}
                <div key={resetKey} className="mb-6 relative">
                  <StreakBadge streakCount={selectedDay} timeline={timeline} size={badgeSize}>
                    {/* FX Layers */}
                    <AuraHalo timeline={timeline} tierConfig={tierConfig} size={badgeSize} />
                    <GlowPulse timeline={timeline} tierConfig={tierConfig} size={badgeSize} />
                    <RingPing timeline={timeline} tierConfig={tierConfig} size={badgeSize} />
                    <ShineSweep timeline={timeline} tierConfig={tierConfig} size={badgeSize} />
                    <SparkleParticles timeline={timeline} tierConfig={tierConfig} size={badgeSize} />
                    {tierConfig.isMilestone && tierConfig.milestoneType && (
                      <MilestoneAnimation
                        milestoneDay={tierConfig.milestoneType}
                        timeline={timeline}
                        size={badgeSize}
                      />
                    )}
                  </StreakBadge>
                </div>

                {/* Timeline State Debug */}
                <div className="bg-gray-900 rounded-lg p-3 mb-4 w-full">
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>State: <span className="text-green-400 font-bold">{timeline.state}</span></div>
                    <div>Progress: <span className="text-blue-400 font-bold">{(timeline.progress * 100).toFixed(1)}%</span></div>
                    <div>Trigger: <span className="text-yellow-400 font-bold">{timeline.triggerType}</span></div>
                    <div>Can Trigger: <span className={timeline.canTrigger ? "text-green-400" : "text-red-400"}>{timeline.canTrigger ? "Yes" : "No (Cooldown)"}</span></div>
                  </div>
                </div>

                {/* Tier Info */}
                <div className="bg-gray-900 rounded-xl p-4 w-full mb-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Tier:</span>
                      <span className="text-white font-bold ml-2">{tierConfig.tier}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Color:</span>
                      <span className="text-white font-bold ml-2 capitalize">{tierConfig.colorTemp}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Glow:</span>
                      <span className="text-white font-bold ml-2">{tierConfig.glowIntensity}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Pulse:</span>
                      <span className="text-white font-bold ml-2">{tierConfig.pulseSpeed}s</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Sparkles:</span>
                      <span className="text-white font-bold ml-2">{tierConfig.sparkleCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Ring Ping:</span>
                      <span className="text-white font-bold ml-2">{tierConfig.ringPingEnabled ? "Yes" : "No"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Shine:</span>
                      <span className="text-white font-bold ml-2">{tierConfig.shineEnabled ? "Yes" : "No"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Halo:</span>
                      <span className="text-white font-bold ml-2">{tierConfig.auraHaloEnabled ? "Yes" : "No"}</span>
                    </div>
                    {tierConfig.isMilestone && (
                      <div className="col-span-2">
                        <span className="text-yellow-400 font-bold">🎉 MILESTONE DAY!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 w-full">
                  {/* Main trigger button (milestone or celebrate based on day) */}
                  <button
                    onClick={handleTriggerAnimation}
                    disabled={!timeline.canTrigger}
                    className={`flex-1 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                      timeline.canTrigger
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <Play className="w-5 h-5" />
                    {timeline.canTrigger ? "Trigger Animation" : "Cooldown..."}
                  </button>

                  {/* Snap confirm button (increments day and shows transition) */}
                  <button
                    onClick={() => {
                      const nextDay = selectedDay + 1;
                      setSelectedDay(nextDay);

                      // Small delay to let state update, then trigger animation
                      setTimeout(() => {
                        triggerCelebrate();
                      }, 50);
                    }}
                    disabled={!timeline.canTrigger}
                    className={`flex-1 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                      timeline.canTrigger
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    Next Day ({selectedDay} → {selectedDay + 1})
                  </button>

                  {/* Reset button */}
                  <button
                    onClick={handleReset}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* FX Details Card */}
            <div className="bg-gray-800 rounded-2xl border-2 border-gray-700 p-6">
              <h3 className="text-white text-xl font-bold mb-4">Active FX Components</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${true ? 'bg-green-500' : 'bg-gray-600'}`} />
                  <span className="text-white">GlowPulse (Always active)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${tierConfig.shineEnabled ? 'bg-green-500' : 'bg-gray-600'}`} />
                  <span className="text-white">ShineSweep (Tier B+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${tierConfig.sparkleCount > 0 ? 'bg-green-500' : 'bg-gray-600'}`} />
                  <span className="text-white">SparkleParticles (Tier B+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${tierConfig.ringPingEnabled ? 'bg-green-500' : 'bg-gray-600'}`} />
                  <span className="text-white">RingPing (Tier C+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${tierConfig.auraHaloEnabled ? 'bg-green-500' : 'bg-gray-600'}`} />
                  <span className="text-white">AuraHalo (Tier D+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${tierConfig.isMilestone ? 'bg-yellow-500' : 'bg-gray-600'}`} />
                  <span className="text-white">MilestoneAnimation (Milestones only)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Controls */}
          <div className="space-y-6">
            {/* Manual Day Input */}
            <div className="bg-gray-800 rounded-2xl border-2 border-gray-700 p-6">
              <h3 className="text-white text-xl font-bold mb-4">Manual Day Selection</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Enter Streak Day (1-100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={selectedDay}
                    onChange={(e) => handleDaySelect(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    className="w-full bg-gray-900 text-white text-2xl font-bold px-4 py-3 rounded-xl border-2 border-gray-700 focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Or use slider</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={selectedDay}
                    onChange={(e) => handleDaySelect(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="flex justify-between text-gray-500 text-xs mt-1">
                    <span>1</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Selection Buttons */}
            <div className="bg-gray-800 rounded-2xl border-2 border-gray-700 p-6">
              <h3 className="text-white text-xl font-bold mb-4">Quick Select</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickDays.map((item) => (
                  <button
                    key={item.day}
                    onClick={() => handleDaySelect(item.day)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedDay === item.day
                        ? "bg-green-600 border-green-500 text-white"
                        : "bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    <div className="font-bold text-lg">{item.label}</div>
                    <div className="text-sm opacity-80 mt-1">{item.tier}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tier Guide */}
            <div className="bg-gray-800 rounded-2xl border-2 border-gray-700 p-6">
              <h3 className="text-white text-xl font-bold mb-4">Tier Guide</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="text-blue-400 font-bold mb-1">Tier A (Days 1-3)</div>
                  <div className="text-gray-400">Gentle start: soft glow, tiny bounce</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="text-green-400 font-bold mb-1">Tier B (Days 4-7)</div>
                  <div className="text-gray-400">Building up: + shine sweep, 4 sparkles</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="text-orange-400 font-bold mb-1">Tier C (Days 8-12)</div>
                  <div className="text-gray-400">Getting warm: + ring ping, warmer glow</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="text-yellow-400 font-bold mb-1">Tier D (Days 13-15+)</div>
                  <div className="text-gray-400">Almost milestone: + aura halo, snappier</div>
                </div>
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-3 border-2 border-yellow-500/30">
                  <div className="text-yellow-300 font-bold mb-1">🎉 Milestones</div>
                  <div className="text-gray-300">Days 5, 10, 15, 20, 25, 30: Special animations!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ In this section we achieved:
// A complete test page for the streak badge system.
// Users can select any day (1-100) and see tier progression.
// Quick buttons for important days (milestones and tier boundaries).
// Live tier info display showing all active FX components.
// Manual trigger button to test animations on demand.
// Timeline state debug info to see what's happening.
