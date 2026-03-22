# Gameplay UI/UX Polish Plan

## Objective
Refine the `app/gameplay` interface to eliminate layout shifts ("jumping"), remove unnecessary elements, and upgrade the visual quality of the Matchmaking and Chat systems.

---

## 1. Matchmaking Screen (Lobby)
**Current Issue:** When an opponent is found, their details appear at the bottom, causing the page height to change and the layout to shift.
**The Fix:**
- **Unified Central Display:** Instead of appending opponent info at the bottom, we will transform the "Scanning Circle" directly into the "Opponent Profile".
- **Transition:** 
  1. State A: Scanning Radar / Spinner.
  2. State B (Found): Radar stops, changes color to "Locked" (Green/Red), and flips/fades into the Opponent Card.
- **Fixed Layout:** Enforce a strict height for this central container so the page never resizes during this process.

## 2. In-Match Interface Clean-up
**Current Issues:** Cluttered text and layout shifts during the "Waiting" phase.
**The Fixes:**
- **Remove Mode Badge:** Delete the "⚔️ CONTROL" / "🛡️ SURVIVE" badge entirely.
- **Simplify Round Info:** 
  - *Current:* "Whataboutism (Deflecting blame) • Round 1/5"
  - *New:* "Round 1/5" (Remove the tactic name/description text).
- **"Waiting for Opponent" Overlay:** 
  - Change `.sync-status-bar` from a relative element (which pushes content down) to an **Absolute Overlay**.
  - Position it in the exact center of the screen (or over the option buttons) with a semi-transparent backdrop.
  - This ensures the option buttons and player stats *never move* when this message appears.

## 3. Post-Match Stability
**Current Issue:** "Opponent has left" message appears and shifts the result boxes styling.
**The Fix:**
- **Toast Notification:** Move this message to a "Toast" style notification (floating pill) at the top or bottom of the screen.
- **Zero-Layout Impact:** Use `position: absolute` so it overlays on top of the victory/defeat screen without moving the "Rematch" or "Back to Base" buttons.

## 4. Chat System Redesign
**Current Issue:** The chat menu and speech bubbles have a basic/poor design that doesn't fit the game's aesthetic.
**The Fix:**
- **Chat Menu (`.chat-menu`):**
  - Implement a **Glassmorphic Design** (Blur background, subtle borders).
  - Use a sleek list style with hover effects (Neon glow).
  - Animate the opening (Scale/Fade in).
- **Speech Bubbles (`.bubble-speech`):**
  - Modernize the shape (adjust border-radius).
  - Add specific styles for Player (Blue/Cyan Gradient) vs Opponent (Red/Pink Gradient).
  - Improve typography (Font weight, spacing).
  - Add a crisp "tail" to the bubbles pointing accurately to the avatars.

5- we have a line that counter the remaining time in the page we have two line a one that going with the opponnet paly and the other one for mine when i chose the answer my line stop and also the opponent like stop that should not be work like that when i chose my answer the line should continue to count down for the opponent and when he chose his answer my line should continue to count down for me and out line that we chose the answer should be stop 

6- make these show real data 
Trophies
1847
⚔️
Wins
124
🔥
Streak
7

8- the section appear aftet the finding the opponent should have same size with the one that scanning circle.
---

## Implementation Order
1. **Clean-up (Item 2):** Delete the badges and text. Easy quick wins.
2. **Layout Locking (Items 2 & 3):** Fix the "Waiting" and "Opponent Left" shift issues using CSS positioning.
3. **Matchmaking Flow (Item 1):** Refactor the Lobby render logic.
4. **Style Overhaul (Item 4):** Rewrite CSS for Chat and Bubbles.
