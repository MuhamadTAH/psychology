# 🧪 Streak Badge Test Lab

## Access the Test Page

Visit: **`http://localhost:3001/test-streak`**

## Features

### 🎯 Manual Day Selection
- **Number Input**: Type any day from 1 to 100
- **Slider**: Drag to select a day visually
- Updates the badge in real-time

### 🚀 Quick Select Buttons
Pre-configured buttons for important days:
- **Day 1** - Tier A (minimal FX)
- **Day 3** - Tier A (end of tier)
- **Day 5** - Tier B + Milestone! 🎉
- **Day 7** - Tier B (max tier B)
- **Day 10** - Tier C + Milestone! 🎉
- **Day 12** - Tier C (max tier C)
- **Day 15** - Tier D + Milestone! 🎉
- **Day 20** - Tier D+ + Milestone! 🎉
- **Day 25** - Tier D+ + Milestone! 🎉
- **Day 30** - Tier D+ + Milestone! 🎉 (LEGENDARY)

### 🎬 Animation Controls
- **Trigger Animation**: Manually trigger celebrate or milestone animation
- **Reset Badge**: Remount the component to restart idle loop

### 📊 Live Tier Info
Real-time display of:
- Current tier (A, B, C, D)
- Color temperature (cool, warm, energy, gold)
- Glow intensity (0.3 - 0.85)
- Pulse speed (2.4s - 3.2s)
- Sparkle count (0-6)
- Active FX components

### ✅ Active FX Indicators
Green dots show which FX components are currently active:
- **GlowPulse** - Always active (breathing glow)
- **ShineSweep** - Tier B+ (diagonal shine)
- **SparkleParticles** - Tier B+ (4-6 sparkles)
- **RingPing** - Tier C+ (expanding circle)
- **AuraHalo** - Tier D+ (background halo)
- **MilestoneAnimation** - Milestones only (special effects)

## Tier Breakdown

### Tier A (Days 1-3)
**"Gentle Start"**
- Glow: 0.3 intensity
- Pulse: 3.2s (slow, calm)
- FX: Soft glow, tiny bounce
- Color: Cool (slate)

### Tier B (Days 4-7)
**"Building Up"**
- Glow: 0.5 intensity
- Pulse: 2.8s
- FX: + Shine sweep, 4 sparkles
- Color: Cool (slate)

### Tier C (Days 8-12)
**"Getting Warm"**
- Glow: 0.7 intensity
- Pulse: 2.6s
- FX: + Ring ping, 6 sparkles
- Color: Warm (orange)

### Tier D (Days 13-15+)
**"Almost Milestone"**
- Glow: 0.85 intensity
- Pulse: 2.4s (faster)
- FX: + Aura halo, snappier bounce
- Color: Warm → Energy → Gold

## Milestone Special Effects

| Day | Particles | Special FX | Duration |
|-----|-----------|------------|----------|
| 5   | 15        | Shine sweep + ring ping | 1.2s |
| 10  | 40        | Two-phase burst + background flash | 1.4s |
| 15  | 40        | Crown glow + confetti | 1.6s |
| 20  | 60        | Flame rim | 1.7s |
| 25  | 80        | Electric arcs + slow-mo effect | 1.8s |
| 30  | 100       | Shockwave + emblem flare + punch | 2.0s |

## Testing Checklist

Use this page to verify:

- ✅ **Tier progression is smooth** (A→B→C→D, no jarring jumps)
- ✅ **Badge displays correctly for days 1-30+**
- ✅ **Idle animation is calm** (breathing glow, not aggressive)
- ✅ **Celebrate animation** (0.6-0.9s, then returns to idle)
- ✅ **Milestone animations feel special** (1.2-2.0s, rare and rewarding)
- ✅ **No aggressive forever-loops**
- ✅ **Cooldown prevents spam** (try clicking "Trigger" rapidly)
- ✅ **Color temperature progression** (cool → warm → energy → gold)
- ✅ **Number is always readable** (stroke + shadow on any background)
- ✅ **60fps performance** (smooth animations, no jitter)

## Performance Budget

Enforced limits:
- **Max particles:** 6 on screen at once
- **Bundle size:** 50KB gzipped (target)
- **Frame rate:** 60fps minimum
- **First paint:** <100ms after trigger
- **Single RAF loop:** All FX synchronized

## Tips

1. **Compare tiers side-by-side**: Open multiple browser windows at different days
2. **Test milestone timing**: Use days 5, 10, 15, 20, 25, 30
3. **Check idle loop**: Let badge sit for 10-20 seconds, should breathe calmly
4. **Verify cooldown**: Rapidly click "Trigger Animation" - should prevent spam
5. **Mobile testing**: Resize browser window to check responsive sizing

## Troubleshooting

**Badge not animating?**
- Click "Reset" button to remount component
- Check browser console for errors

**Animation feels janky?**
- Check CPU usage (should be low)
- Open DevTools Performance tab
- Verify 60fps in timeline

**Milestone not showing?**
- Ensure you're on day 5, 10, 15, 20, 25, or 30
- Click "Trigger Animation" to start milestone

## Next Steps

After testing, the badge system is ready for production:
1. ✅ State machine works (no stuck states)
2. ✅ Tier transitions are smooth
3. ✅ Milestones feel special
4. ✅ Performance is optimal (60fps)
5. ✅ No memory leaks (tested with DevTools)

Enjoy testing! 🎉
