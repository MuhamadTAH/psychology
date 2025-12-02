# Detailed 3D Plan for Imago Robot (Three.js)

Based on the imago.png design - Complete implementation plan

---

## Phase 1: Head Assembly

### 1.1 Antenna (Top)
- **Stick**: CylinderGeometry
  - Radius: 0.03
  - Height: 0.25
  - Position: [0, 1.3, 0]
  - Color: #0a3d4d (dark teal)

- **Ball on top**: SphereGeometry
  - Radius: 0.06
  - Position: [0, 1.45, 0]
  - Color: #0a3d4d (dark teal)

### 1.2 Helmet/Head Shell
- **Main helmet**: Ellipsoid (SphereGeometry scaled)
  - Base radius: 0.6
  - Scale: [1.4, 1.2, 1] (wider horizontally)
  - Position: [0, 1.0, 0]
  - Color: #a8c5e0 (light blue)
  - Material: MeshStandardMaterial with slight glossy finish

### 1.3 Side Ear Panels (x2)
- **Left ear panel**: BoxGeometry with RoundedBox
  - Size: [0.15, 0.25, 0.2]
  - Position: [-0.75, 1.0, 0]
  - Color: #0a3d4d (dark teal)

- **Right ear panel**: BoxGeometry with RoundedBox
  - Size: [0.15, 0.25, 0.2]
  - Position: [0.75, 1.0, 0]
  - Color: #0a3d4d (dark teal)

- **Stripes on each ear**: Small BoxGeometry (x3 per ear)
  - Size: [0.05, 0.04, 0.05]
  - Color: #a8c5e0 (light blue)
  - Positions: Stacked vertically with gaps

### 1.4 Face Screen
- **Screen**: RoundedBox
  - Size: [1.0, 0.6, 0.1]
  - Radius: 0.25 (very rounded)
  - Position: [0, 1.0, 0.4]
  - Color: #0a3d4d (dark teal)

### 1.5 Face Features
- **Eyes (x2)**: SphereGeometry
  - Radius: 0.08
  - Positions: [-0.25, 1.05, 0.45], [0.25, 1.05, 0.45]
  - Color: #5dcea0 (bright green)
  - Emissive: #5dcea0 with low intensity (glowing effect)

- **Smile**: Custom curve or stretched TorusGeometry
  - Width: 0.5
  - Position: [0, 0.85, 0.45]
  - Color: #5dcea0 (bright green)
  - Shape: Curved upward smile

---

## Phase 2: Neck

- **Neck cylinder**: CylinderGeometry
  - Radius top: 0.15
  - Radius bottom: 0.15
  - Height: 0.15
  - Position: [0, 0.65, 0]
  - Color: #0a3d4d (dark teal)

---

## Phase 3: Upper Body/Torso

### 3.1 Main Torso
- **Center panel**: RoundedBox
  - Size: [0.8, 0.75, 0.4]
  - Radius: 0.08
  - Position: [0, 0.2, 0]
  - Color: #a8c5e0 (light blue)

### 3.2 Curved Side Panels (x2)
- **Left side panel**: Custom curved geometry or bent BoxGeometry
  - Size: [0.15, 0.7, 0.35]
  - Position: [-0.5, 0.2, 0]
  - Color: #0a3d4d (dark teal)
  - Curve outward slightly

- **Right side panel**: Same as left, mirrored
  - Position: [0.5, 0.2, 0]

### 3.3 Diagonal Strap/Sash
- **Strap**: Thin BoxGeometry or PlaneGeometry with rotation
  - Width: 0.08
  - Length: 0.9 (diagonal from shoulder to hip)
  - Rotation: Angled ~35 degrees
  - Position: Start at [-0.3, 0.5, 0.21], end at [0.4, -0.15, 0.21]
  - Color: #6ba3d4 (medium blue)
  - Opacity: 0.7 (slightly transparent)

### 3.4 Chest Screen/Badge Panel
- **Outer frame**: RoundedBox
  - Size: [0.6, 0.45, 0.08]
  - Radius: 0.08
  - Position: [0, 0.25, 0.25]
  - Color: #d8e4f0 (light grey-blue)

- **Inner screen**: RoundedBox
  - Size: [0.52, 0.37, 0.04]
  - Radius: 0.06
  - Position: [0, 0.25, 0.27]
  - Color: #f0f4f8 (very light grey)

- **Badge circle**: CylinderGeometry (flat disk)
  - Radius: 0.1
  - Height: 0.02
  - Rotation: [Math.PI/2, 0, 0]
  - Position: [0, 0.25, 0.29]
  - Color: #c8d6e8 (grey-blue)

- **Inner badge detail**: CylinderGeometry (smaller disk)
  - Radius: 0.06
  - Height: 0.01
  - Position: [0, 0.25, 0.295]
  - Color: #e0e8f0 (lighter grey-blue)

### 3.5 Waist Belt
- **Belt**: CylinderGeometry
  - Radius: 0.42
  - Height: 0.08
  - Position: [0, -0.18, 0]
  - Color: #0a3d4d (dark teal)

---

## Phase 4: Arms (x2)

### 4.1 Left Arm
- **Shoulder connection point**: [0, 0.45, 0]

- **Upper arm**: CylinderGeometry
  - Radius: 0.08
  - Height: 0.4
  - Position: [-0.5, 0.25, 0]
  - Color: #a8c5e0 (light blue)

- **Elbow joint**: SphereGeometry
  - Radius: 0.09
  - Position: [-0.5, 0.05, 0]
  - Color: #0a3d4d (dark teal)

- **Forearm**: CylinderGeometry
  - Radius: 0.08
  - Height: 0.4
  - Position: [-0.5, -0.15, 0]
  - Color: #a8c5e0 (light blue)

- **Hand**: SphereGeometry (ellipsoid)
  - Radius: 0.09
  - Scale: [1, 1.4, 0.8] (mitten shape)
  - Position: [-0.5, -0.4, 0]
  - Color: #0a3d4d (dark teal)

### 4.2 Right Arm (Waving)
- Same structure as left arm
- **Position offset**: [0.5, 0.25, 0]
- **Rotation**: Add rotation animations for waving gesture
  - Upper arm: Rotate outward
  - Forearm: Rotate up at elbow
- **Hand**: Add slight rotation for waving effect

---

## Phase 5: Lower Body/Pelvis

### 5.1 Pelvis Shield Shape
- **Main pelvis dome**: Custom geometry (inverted shield shape)
  - Use SphereGeometry with custom scale or LatheGeometry
  - Width at top: 0.6
  - Height: 0.4
  - Taper to point at bottom
  - Position: [0, -0.4, 0]
  - Color: #a8c5e0 (light blue)

- **Shield outline/edge**: Slightly larger same shape
  - Scale: 1.05x
  - Color: #0a3d4d (dark teal)
  - Opacity: 0.3
  - Position: Same as main pelvis, slightly behind

- **Alternative approach**: Use path/curve to create shield shape
  ```
  Top: Straight line [(-0.3, -0.22), (0.3, -0.22)]
  Sides: Curves down and inward
  Bottom: Point at [0, -0.6]
  ```

---

## Phase 6: Legs (x2)

### 6.1 Left Leg
- **Hip connection**: [-0.15, -0.6, 0]

- **Upper leg/thigh**: CylinderGeometry
  - Radius: 0.09
  - Height: 0.45
  - Position: [-0.15, -0.85, 0]
  - Color: #a8c5e0 (light blue)

- **Knee joint**: SphereGeometry
  - Radius: 0.11
  - Position: [-0.15, -1.08, 0]
  - Color: #0a3d4d (dark teal)

- **Knee detail lines (x2)**: TorusGeometry (thin rings)
  - Radius: 0.11
  - Tube: 0.01
  - Position: Wrap around knee sphere
  - Color: #a8c5e0 (light blue)
  - Opacity: 0.6

- **Lower leg (bell-bottomed)**: CylinderGeometry (cone)
  - Radius top: 0.08
  - Radius bottom: 0.11
  - Height: 0.5
  - Position: [-0.15, -1.35, 0]
  - Color: #a8c5e0 (light blue)

- **Shin detail line**: Thin CylinderGeometry
  - Radius: 0.005
  - Height: 0.45
  - Position: Center front of shin
  - Color: #b8d5f0 (lighter blue)
  - Opacity: 0.4

### 6.2 Foot (Boot Shape)
- **Foot base**: SphereGeometry (ellipsoid)
  - Radius: 0.14
  - Scale: [1.5, 0.8, 1.6] (wide and flat)
  - Position: [-0.15, -1.65, 0.08]
  - Color: #a8c5e0 (light blue)

- **Toe cap**: SphereGeometry
  - Radius: 0.1
  - Scale: [1, 0.9, 1]
  - Position: [-0.15, -1.65, 0.2]
  - Color: #0a3d4d (dark teal)

### 6.3 Right Leg
- Same as left leg
- **Hip connection**: [0.15, -0.6, 0]
- Mirror positions on X-axis

---

## Phase 7: Grouping & Hierarchy

```
Robot (root)
├── HeadGroup [0, 1.0, 0]
│   ├── Antenna
│   │   ├── Stick
│   │   └── Ball
│   ├── Helmet (main ellipsoid)
│   ├── LeftEar
│   │   ├── EarPanel
│   │   └── Stripes (x3)
│   ├── RightEar
│   │   ├── EarPanel
│   │   └── Stripes (x3)
│   ├── FaceScreen
│   ├── LeftEye
│   ├── RightEye
│   └── Smile
├── Neck [0, 0.65, 0]
├── TorsoGroup [0, 0.2, 0]
│   ├── MainTorso
│   ├── LeftSidePanel
│   ├── RightSidePanel
│   ├── DiagonalStrap
│   ├── ChestScreen
│   │   ├── OuterFrame
│   │   ├── InnerScreen
│   │   ├── BadgeCircle
│   │   └── InnerBadge
│   └── WaistBelt
├── LeftArmGroup [-0.5, 0.45, 0] (pivot at shoulder)
│   ├── UpperArm
│   ├── ElbowJoint
│   ├── Forearm
│   └── Hand
├── RightArmGroup [0.5, 0.45, 0] (pivot at shoulder)
│   ├── UpperArm
│   ├── ElbowJoint
│   ├── Forearm
│   └── Hand
├── PelvisGroup [0, -0.4, 0]
│   ├── MainShield
│   └── ShieldOutline
├── LeftLegGroup [-0.15, -0.6, 0] (pivot at hip)
│   ├── UpperLeg
│   ├── KneeJoint
│   ├── KneeLines (x2)
│   ├── LowerLeg
│   ├── ShinLine
│   ├── FootBase
│   └── ToeCap
└── RightLegGroup [0.15, -0.6, 0] (pivot at hip)
    ├── UpperLeg
    ├── KneeJoint
    ├── KneeLines (x2)
    ├── LowerLeg
    ├── ShinLine
    ├── FootBase
    └── ToeCap
```

---

## Phase 8: Materials & Colors

### Color Palette (from imago.png)
- **Light blue (main)**: #a8c5e0
- **Dark teal (accents)**: #0a3d4d
- **Medium blue (strap)**: #6ba3d4
- **Bright green (eyes/smile)**: #5dcea0
- **Light grey-blue**: #d8e4f0
- **Very light grey**: #f0f4f8
- **Lighter blue (highlights)**: #b8d5f0

### Material Settings
1. **Main body parts** (light blue):
   - Color: #a8c5e0
   - Metalness: 0.1
   - Roughness: 0.4
   - Slight glossy finish

2. **Dark accents** (dark teal):
   - Color: #0a3d4d
   - Metalness: 0.2
   - Roughness: 0.5
   - Slightly more matte

3. **Eyes** (glowing green):
   - Color: #5dcea0
   - Metalness: 0.1
   - Roughness: 0.3
   - Emissive: #5dcea0
   - EmissiveIntensity: 0.5 (glowing effect)

4. **Helmet/head** (light blue):
   - Color: #a8c5e0
   - Metalness: 0.15
   - Roughness: 0.35
   - Slightly more glossy than body

5. **Screen/badge panels**:
   - Color: #d8e4f0 to #f0f4f8
   - Metalness: 0.2
   - Roughness: 0.3
   - Clean, screen-like appearance

---

## Phase 9: Proportions & Scale

### Overall Height: ~3.5 units
- Head (including antenna): 1.5 units (43%)
- Neck: 0.15 units (4%)
- Torso: 0.75 units (21%)
- Pelvis: 0.4 units (11%)
- Legs: 1.1 units (31%)
- Feet: 0.2 units (6%) (included in leg height)

### Width Ratios:
- Head width: 1.4 units (widest point)
- Torso width: 0.8 units
- Pelvis width: 0.6 units (top)
- Leg spacing: 0.3 units apart

### Relative Sizes:
- Head is largest feature (character's main focal point)
- Arms are slightly thinner than legs
- Hands and feet are proportionally large (cartoonish)
- Bell-bottomed legs create stable base

---

## Phase 10: Lighting & Shadows

### Recommended Lighting Setup:
1. **Ambient Light**:
   - Intensity: 0.5
   - Color: #ffffff
   - Provides base illumination

2. **Directional Light** (main):
   - Position: [5, 8, 5]
   - Intensity: 1.0
   - Cast shadows: true
   - Color: #ffffff
   - Creates depth with shadows

3. **Point Light** (front left):
   - Position: [-3, 3, 5]
   - Intensity: 0.4
   - Color: #a8d8ff (cool blue)
   - Highlights face and chest

4. **Point Light** (right):
   - Position: [4, 2, 3]
   - Intensity: 0.3
   - Color: #ffd4a8 (warm orange)
   - Adds warmth and dimension

### Shadow Settings:
- Enable shadows on all meshes (castShadow: true)
- Ground plane receives shadows (receiveShadow: true)
- Shadow map size: 2048x2048 for quality

---

## Phase 11: Animation Ideas (Future)

### Idle Animation:
- Slight breathing motion (torso scale)
- Head gentle rotation left-right
- Eyes blink periodically

### Wave Animation:
- Right arm rotates up at shoulder
- Forearm rotates at elbow
- Hand rotates slightly side-to-side

### Walk Cycle:
- Legs swing forward/back (hip rotation)
- Arms swing opposite to legs
- Torso subtle rotation
- Vertical bob motion

### Happy Jump:
- Full body moves up
- Arms raise
- Legs bend at knees
- Eyes get bigger (scale)
- Smile widens

---

## Phase 12: Props Interface

```typescript
interface Imago3DRobotProps {
  size?: number;
  mood?: "neutral" | "happy" | "sad" | "surprised" | "thinking";
  animation?: "idle" | "wave" | "walk" | "jump" | "none";
  rotation?: number; // 0-360 degrees
  autoRotate?: boolean;
  showShadows?: boolean;
  enableControls?: boolean;
}
```

---

## Implementation Order (Recommended):

1. ✅ Phase 1.2-1.5: Head shell and face (most recognizable feature)
2. ✅ Phase 1.1: Antenna (quick, establishes top reference point)
3. ✅ Phase 1.3: Ear panels (defines head width)
4. ✅ Phase 2: Neck (connects head to body)
5. ✅ Phase 3.1-3.2: Main torso and side panels (body foundation)
6. ✅ Phase 3.4-3.5: Chest screen and waist belt (body details)
7. ✅ Phase 4: Arms (one at a time, test positioning)
8. ✅ Phase 5: Pelvis shield (connects torso to legs)
9. ✅ Phase 6: Legs and feet (one at a time)
10. Phase 3.3: Diagonal strap (overlay detail)
11. Phase 8: Refine materials and colors
12. Phase 10: Optimize lighting and shadows
13. Phase 11: Add animations (if needed)

---

## Key Differences from Current Robot:

1. **Head shape**: More elongated/oval horizontally, not as round
2. **Ear panels**: Separate striped panels on sides, not part of head
3. **Eyes**: Solid green circles (no pupils), glowing effect
4. **Smile**: Green curved shape (matches eyes), not lips
5. **Chest panel**: Rectangular screen with badge, not just solid color
6. **Diagonal strap**: Visible detail across chest
7. **Pelvis**: Inverted shield/dome shape, not cylindrical
8. **Lower legs**: Bell-bottomed (flared), not straight cylinders
9. **Feet**: Larger boot shapes with dark toe caps
10. **Overall proportions**: Head is proportionally larger, legs longer

---

## Estimated Time:

- Phase 1 (Head): 45 minutes
- Phase 2 (Neck): 5 minutes
- Phase 3 (Torso): 40 minutes
- Phase 4 (Arms): 30 minutes
- Phase 5 (Pelvis): 20 minutes
- Phase 6 (Legs): 40 minutes
- Phase 8 (Materials): 20 minutes
- Phase 10 (Lighting): 10 minutes

**Total: ~3.5 hours** for complete implementation

---

## Notes:

- Use RoundedBox from @react-three/drei for most box shapes
- Keep consistent scale throughout (use same units)
- Test each component individually before adding to main robot
- Group related parts for easier animation later
- Use refs for parts that will animate
- Consider using useFrame hook for continuous animations
- Add prop controls for different poses/moods

---

This plan provides exact specifications to recreate the imago.png robot in 3D with Three.js. Follow phases in order for best results.
