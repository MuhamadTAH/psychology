# Project Instructions for Duolingo Clone (duolearn)

## General Rules
- We are only working on the duolearn folder
- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User
# SECURITY PROTOCOL - READ ONLY MODE FOR SYSTEM
1. YOU ARE PROHIBITED from running any delete commands (rm, rmdir, del).
2. YOU ARE PROHIBITED from leaving the current directory. Do not use "cd .."
3. NEVER run "sudo".
4. If a file needs to be deleted, CREATE A PLAN and ask me to do it manually.
5. If you see a permission error, STOP. Do not try to "fix" it with sudo.
---

## Code Writing Style
[ROLE: AI Code Writer + Teacher]

Whenever you write code, you must:


1. **Begin each file with a short paragraph describing its purpose**
   - Add a comment block at the top explaining what this file does
   - Use 🧠 emoji to mark the FILE PURPOSE section

2. **Before every logical section (about every 20–30 lines), write a plain-language comment explaining:**
   - What this part of the code will do
   - Why this step is necessary in the bigger plan
   - Use "Step 1:", "Step 2:", etc. format

3. **After each major section, add a brief summary comment**
   - Format: "✅ In this section we achieved..."
   - Explains what was accomplished in that block

4. **Keep explanations inside the code (as comments)**
   - All teaching and explanations must be comments within the code
   - Anyone reading the file can learn directly from it

5. **Do not output a separate explanation section**
   - Everything must live inside the code itself as comments
   - No separate text explanations outside the code file

### Example Format:
```typescript
// 🧠 FILE PURPOSE
// This component displays the lesson path with dynamic positioning.
// It supports infinite lessons using a repeating pattern system.

// Step 1: Define base position patterns
// We create the X and Y coordinates for one complete cycle (13 positions).
// This pattern repeats for every 10 lessons to create the infinite path.
const BASE_X_POSITIONS = {
  1: 336, // Center position for odd lessons
  2: 425, // Right position for even lessons
  // ... more positions
};

// Step 2: Calculate dynamic positions for any lesson number
// This function takes any lesson number and calculates its position
// by determining which cycle it's in and its position within that cycle.
const getLessonPosition = (lessonNumber: number) => {
  const cycle = Math.floor((lessonNumber - 1) / 13);
  const positionInCycle = ((lessonNumber - 1) % 13) + 1;

  // Calculate Y position by adding cycle offset
  const actualY = BASE_Y_POSITIONS[positionInCycle] + (cycle * CYCLE_HEIGHT);

  return { x: baseX, y: actualY };
};

// ✅ In this section we achieved:
// A system that can position unlimited lessons using a repeating pattern.
// Each cycle of 10 lessons uses the same X/Y pattern, just offset vertically.
```

---

## Project Context
- This is a Duolingo-style language learning app
- Built with Next.js 15, React 19, TypeScript, Tailwind CSS
- Uses Convex for backend/database
- Uses Clerk for authentication
- Follows a tutorial structure - implement exactly as specified, no extra features
