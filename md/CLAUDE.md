- do not run server I will run it by myself and you need to build this project to work on port 3000.
- do not push or commit anychange i will do it by myself.                 - you should install the lastest version of all packages.                - i give you a feature plan in the intro.md file after that i give you the step by step plan for that feature in the plan.md.
- we are follow a plan that another AI put i will give you that plan in the plan.md.
- in the console.md i wil give you what the console give in the test.    - in the terminal.md i will give you what the terminal show.              - in the error.md i will give you the error - after applying each plan and we test scessfully you need to update the progress.md file about what we applying in this chapter.

## 3D Robot Rotation Reference (ImagoRobot3D.tsx)

### Use Degrees Instead of Radians:
Use `THREE.MathUtils.degToRad(degrees)` to convert degrees to radians for readability.

**Example:**
```jsx
rotation={[0, 0, THREE.MathUtils.degToRad(90)]}  // 90 degrees
rotation={[0, 0, THREE.MathUtils.degToRad(-45)]} // -45 degrees
```

### Correct Arm Rotations:
- **Left Arm Shoulder**: `THREE.MathUtils.degToRad(-90)` (90° horizontal outward)
- **Left Arm Elbow**: `THREE.MathUtils.degToRad(-90)` (90° bend outward)
- **Right Arm Shoulder**: `THREE.MathUtils.degToRad(90)` (90° horizontal outward)
- **Right Arm Elbow**: `THREE.MathUtils.degToRad(90)` (90° bend outward)

### Leg Rotations:
- **Left Leg Hip**: `rotation={[THREE.MathUtils.degToRad(45), 0, 0]}` (45° forward - X axis)
- **Left Leg Knee**: `rotation={[THREE.MathUtils.degToRad(90), 0, 0]}` (90° backward bend - X axis)
- **Right Leg Hip**: `rotation={[THREE.MathUtils.degToRad(45), 0, 0]}` (45° forward - X axis)
- **Right Leg Knee**: `rotation={[THREE.MathUtils.degToRad(90), 0, 0]}` (90° backward bend - X axis)

### Rotation Axes:
- **rotation={[X, Y, Z]}** format
- **X axis** (1st value): Forward/backward rotation (pitch) - use for **knees**
- **Y axis** (2nd value): Left/right rotation (yaw)
- **Z axis** (3rd value): Roll/twist - use for **arms, hips**

### Rotation Direction Rules:
- **Positive X rotation (+)**: Bends backward (knees)
- **Negative X rotation (-)**: Bends forward
- **Positive Z rotation (+)**: Counter-clockwise when looking from front (arms)
- **Negative Z rotation (-)**: Clockwise when looking from front (arms)
- Left side limbs typically use negative Z rotation to go outward
- Right side limbs typically use positive Z rotation to go outward

### Rotatable Joints:
All body parts now have nested group structure for rotation:
- **Head/Neck**: Neck → Rotation 1 (neck top) → Rotation 2 (head center) → Head
  - **Line 198**: Rotates head around **neck connection point**
  - **Line 200**: Rotates head around **its own center** (like a gimbal/globe)
  - Can rotate BOTH independently or together!
- **Arms**: Shoulder Ball → Upper Arm → Elbow Ball → Forearm → Hand
- **Legs**: Hip Ball → Upper Leg → Knee Ball → Lower Leg → Foot

**Note:**
- Joint balls use light blue color `#a8c5e0` for visibility
- Head uses existing round helmet as the joint (no separate ball needed)
- Head has TWO rotation points: one at neck top, one at head center
- when i say ( do you understand , what is your plan) you need only answer that question and do not make any code.