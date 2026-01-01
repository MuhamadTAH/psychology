# Robot Wave Animation Guide

## How the Wave Animation Works

The robot's wave animation moves the arm through 3 positions by rotating it from the shoulder/elbow point.

---

## The Animation Code

### 1. CSS Animation (Keyframes)

Located in: `components/Robot3D.tsx` (lines 16-21)

```css
@keyframes hello-wave {
  0% { transform: rotate(-90deg); }   /* Position 1: Arm bent at elbow */
  33% { transform: rotate(-45deg); }  /* Position 2: Arm halfway extended */
  66% { transform: rotate(0deg); }    /* Position 3: Arm fully extended up */
  100% { transform: rotate(-90deg); } /* Back to Position 1 */
}
```

**What this does:**
- `0%` = Start position (arm bent 90 degrees down)
- `33%` = 1/3 through animation (arm at 45 degrees)
- `66%` = 2/3 through animation (arm straight horizontal)
- `100%` = End (returns to start position)

**How to change the positions:**
- **Make arm go higher**: Use smaller negative numbers (e.g., `-30deg` instead of `-45deg`)
- **Make arm go lower**: Use larger negative numbers (e.g., `-120deg` instead of `-90deg`)
- **Reverse direction**: Change negative to positive numbers

---

### 2. Animation Settings

Located in: `components/Robot3D.tsx` (lines 22-24)

```css
.gentle-waving-arm {
  animation: hello-wave 3s ease-in-out infinite;
  transform-origin: 173px 102px;
}
```

**What each part means:**

- `hello-wave` = Name of the animation (connects to keyframes above)
- `3s` = Duration (how long one wave cycle takes)
- `ease-in-out` = Speed curve (starts slow, speeds up, slows down at end)
- `infinite` = Keeps looping forever
- `transform-origin: 173px 102px` = The point where the arm rotates from (the shoulder/elbow position)

**How to change:**

- **Speed up wave**: Change `3s` to `1s` or `2s`
- **Slow down wave**: Change `3s` to `5s` or `10s`
- **Wave once then stop**: Change `infinite` to `1`
- **Different movement style**:
  - `linear` = constant speed
  - `ease-in` = starts slow
  - `ease-out` = ends slow
  - `ease-in-out` = smooth start and end

---

### 3. The Arm Structure (When Waving)

Located in: `components/Robot3D.tsx` (lines 151-161)

```javascript
{wave ? (
  <>
    {/* Upper arm - light colored - horizontal to the right */}
    <rect x="182" y="93" width="35" height="18" rx="9" fill="url(#bodyGradient)" />

    {/* Forearm - dark grey - diagonal upward to the right */}
    <rect x="217" y="58" width="18" height="35" rx="9" fill="url(#darkGradient)" transform="rotate(45 217 102)" />

    {/* Hand - spherical - at end of forearm angled up */}
    <circle cx="242" cy="67" r="11" fill="url(#bodyGradient)" />
    <circle cx="240" cy="65" r="9" fill="#ffffff" opacity="0.2" />
  </>
) : (
  {/* Arm down when not waving */}
)}
```

**Arm Parts:**

1. **Upper Arm (Light rectangle)**
   - `x="182" y="93"` = Starting position
   - `width="35" height="18"` = Size
   - Horizontal rectangle going right

2. **Forearm (Dark rectangle)**
   - `x="217" y="58"` = Starting position
   - `width="18" height="35"` = Size (vertical orientation)
   - `transform="rotate(45 217 102)"` = Rotated 45 degrees at elbow

3. **Hand (Circle)**
   - `cx="242" cy="67"` = Center position
   - `r="11"` = Radius (size)

**How to change arm appearance:**

- **Make arm longer**: Increase `width` or `height` values
- **Make arm shorter**: Decrease `width` or `height` values
- **Change arm angle**: Modify the `rotate(45 ...)` value (try 30, 60, 90)
- **Move arm position**: Change `x` and `y` values

---

## Common Modifications

### Make the wave faster
Change line 23: `animation: hello-wave 1s ease-in-out infinite;`

### Make the wave slower
Change line 23: `animation: hello-wave 5s ease-in-out infinite;`

### Change the wave range (how high/low arm goes)
Change lines 17-20:
```css
0% { transform: rotate(-60deg); }   /* Start lower */
33% { transform: rotate(-30deg); }  /* Middle */
66% { transform: rotate(10deg); }   /* Go higher */
```

### Add more positions to the wave
Add more keyframe steps:
```css
@keyframes hello-wave {
  0% { transform: rotate(-90deg); }
  20% { transform: rotate(-70deg); }
  40% { transform: rotate(-45deg); }
  60% { transform: rotate(-20deg); }
  80% { transform: rotate(0deg); }
  100% { transform: rotate(-90deg); }
}
```

### Make wave bounce (not smooth)
Change line 23: `animation: hello-wave 3s linear infinite;`

---

## Rotation Angles Explained

```
Positive numbers = Rotate clockwise (down)
Negative numbers = Rotate counter-clockwise (up)

-90deg = Arm bent down at elbow
-45deg = Arm halfway up
0deg = Arm horizontal
45deg = Arm angled down
90deg = Arm pointing straight down
```

---

## Important Numbers Explained in Detail

### Transform Origin: `173px 102px`

**What it is:**
- The pivot point where the arm rotates from
- Like a nail through paper - the paper spins around the nail

**The numbers:**
- `173px` = Horizontal position (left to right)
- `102px` = Vertical position (top to bottom)

**Where this point is:**
- Located at the elbow joint where upper arm meets forearm
- The entire arm group rotates around this point

**How to find the right position:**
1. Look at the arm coordinates
2. Upper arm ends at x="182" + half its width (18/2 = 9) = ~182
3. But we want rotation at the shoulder/elbow, so we use the elbow point
4. Elbow is at approximately x="173", y="102"

**How to change:**
- Move pivot point right: Increase `173px` to `180px` or `200px`
- Move pivot point left: Decrease `173px` to `160px`
- Move pivot point down: Increase `102px` to `110px` or `120px`
- Move pivot point up: Decrease `102px` to `90px` or `80px`

---

### Rotation Degrees: `-90deg`, `-45deg`, `0deg`

**What each number means in the animation:**

**`rotate(-90deg)` at 0% (Position 1):**
```
Before rotation (0deg):
    shoulder→→→→arm→→→→elbow→→→→forearm→→→→hand

After rotate(-90deg):
    shoulder
       ↓
      arm
       ↓
     elbow←←←←forearm←←←←hand
```
- Rotates 90 degrees counter-clockwise
- Arm bends down, forearm points right
- This is the starting wave position

**`rotate(-45deg)` at 33% (Position 2):**
```
After rotate(-45deg):
    shoulder
       ↘
        arm
          ↘
          elbow→forearm→hand
```
- Rotates 45 degrees counter-clockwise
- Halfway between down and horizontal
- Middle of the wave

**`rotate(0deg)` at 66% (Position 3):**
```
After rotate(0deg):
    shoulder→→arm→→elbow↗
                         ↗forearm
                              ↗hand
```
- No rotation (original position)
- Arm is horizontal with forearm angled up
- Top of the wave

**How these create the wave:**
1. Animation starts at -90deg (arm bent down)
2. Gradually rotates to -45deg (lifting up)
3. Continues to 0deg (arm horizontal, hand up)
4. Returns back to -90deg (completing the cycle)

---

### Arm Position Coordinates

**Upper Arm:** `x="182" y="93" width="35" height="18"`
- `x="182"` = Starts 182 pixels from left edge
- `y="93"` = Starts 93 pixels from top edge
- `width="35"` = 35 pixels wide (horizontal length)
- `height="18"` = 18 pixels tall (thickness)

**Forearm:** `x="217" y="58" width="18" height="35"`
- `x="217"` = Starts where upper arm ends (182 + 35 = 217)
- `y="58"` = Higher up (93 - 35 = 58, positioned above)
- `width="18"` = 18 pixels wide (thickness, perpendicular to upper arm)
- `height="35"` = 35 pixels tall (vertical length when rotated)

**Hand:** `cx="242" cy="67" r="11"`
- `cx="242"` = Center at 242 pixels from left (217 + 25 = ~242)
- `cy="67"` = Center at 67 pixels from top
- `r="11"` = Radius of 11 pixels (size of hand circle)

**How these work together:**
```
Position calculation:
- Upper arm: starts at shoulder (182, 93)
- Forearm: connects at elbow (217, 58)
  → 217 = 182 + 35 (end of upper arm)
- Hand: connects at wrist (242, 67)
  → 242 ≈ 217 + 25 (end of forearm)

When animation rotates around (173, 102):
- All these pieces spin together as one unit
- They maintain their relative positions
- Creating the wave motion
```

---

### Animation Timing: `3s`, `0%`, `33%`, `66%`, `100%`

**Duration:** `3s` = 3 seconds
- Total time for one complete wave cycle
- 3000 milliseconds

**Keyframe percentages:**
- `0%` = 0 seconds (start)
- `33%` = 1 second (1/3 of 3s)
- `66%` = 2 seconds (2/3 of 3s)
- `100%` = 3 seconds (end, loops back)

**How timing works:**
```
Time: 0s ─────── 1s ─────── 2s ─────── 3s (loop)
      ↓          ↓          ↓          ↓
Pos:  -90°  →  -45°   →   0°    →   -90°
      (down)   (mid)     (up)     (down)

The `ease-in-out` makes it:
- Slow start (0s to 0.5s)
- Fast middle (0.5s to 2.5s)
- Slow end (2.5s to 3s)
```

**Change speed by changing duration:**
- `1s` = Super fast wave (1 wave per second)
- `2s` = Fast wave
- `3s` = Normal wave (current)
- `5s` = Slow wave
- `10s` = Very slow wave

**Change timing distribution:**
```css
/* Equal spacing: */
0% { rotate(-90deg); }
50% { rotate(-45deg); }
100% { rotate(0deg); }

/* Fast start, slow end: */
0% { rotate(-90deg); }
20% { rotate(-45deg); }
100% { rotate(0deg); }

/* Slow start, fast end: */
0% { rotate(-90deg); }
80% { rotate(-45deg); }
100% { rotate(0deg); }
```

---

## File Locations

- **Animation code**: `components/Robot3D.tsx` (lines 16-26)
- **Arm structure**: `components/Robot3D.tsx` (lines 149-171)
- **Controls/buttons**: `app/mascot-demo/page.tsx` (lines 76-80)

---

## Quick Reference

| What you want to change | Where to look | What to modify |
|------------------------|---------------|----------------|
| Wave speed | Line 23 | Change `3s` to different number |
| Wave positions | Lines 17-20 | Change `rotate(...)` degrees |
| Rotation point | Line 24 | Change `173px 102px` coordinates |
| Arm length | Lines 151-159 | Change `width` and `height` |
| Start/stop wave | `wave` prop | Button toggles true/false |

---

## Need Help?

If you want to modify something specific, find the relevant section above and follow the "How to change" instructions!
