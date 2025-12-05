PROJECT ARCHITECTURE: DARK PSYCHOLOGY MASTERY

Module: Onboarding & First Launch (The Induction)

Version: 1.4 (Fixed C-Reactions & Nav Logic)
Tone: "Elite Leadership Training" (Public) / "Psychological Warfare" (Internal)
Visual Theme: Dark Mode, High Contrast, Terminal/System Aesthetic.

1. CORE VISUAL ASSETS (The "Soul")

A. The Brand Logo: "The Fractured Knight"

Concept: A minimalist white chess knight on a black background.

Detail: A sharp, jagged crack runs through the head.

Animation: Glitches slightly on load (Digital interference).

B. The Handler: "The Strategist" (SD Style)

Archetype: The Cold Mentor / The Tactician.

Style: "Tactical Miniature" / Super Deformed (SD).

Proportions: 3.5 Heads tall (Large head for readability, compact body).

Outfit: Sleek Charcoal Trench Coat over Black Turtleneck. NO tactical gear/straps.

Expression: Serious, analytical, unamused. Sharp eyes.

Pose: Hands in pockets (Open but confident).

Required Character States (Animation Loops):

IDLE (The Watcher): Standing still, coat moving slightly, blinking, subtle eye tracking.

APPROVING (The Nod): Subtle nod, eyes soften slightly. (Used for Login Success/Correct Answer).

JUDGING (The Glitch): Eyes narrow, static noise effect around him. (Used for Guest Mode/Wrong Input).

EXPLAINING (The Lesson): One hand comes out of pocket to gesture. (Used for Onboarding Slides).

2. THE FLOW: PHASE 0 - THE GATE (Launch)

Goal: Establish exclusivity. Filter users.

Screen 0.0: The Cold Open (Splash)

Visual: Pitch black screen.

Action: "The Fractured Knight" logo pulses in center.

Audio: Low-frequency "thrum" (Heartbeat).

Screen 0.5: Identity Verification (Auth Selection)

UI Layout: "The Strategist" (IDLE State) stands at top center.

Headline: IDENTIFY YOURSELF (Monospace Font).

Subtext: Access to this database is restricted.

Buttons (Stacked):

[ ACCESS EXISTING DOSSIER ] (Login)

[ CREATE OPERATIVE PROFILE ] (Sign Up)

[ PROCEED AS GHOST ] (Guest)

Logic & Interaction:
| User Action | Character Reaction | System Outcome |
| :--- | :--- | :--- |
| Click Login | APPROVING (Nod) | Inputs slide in: Agent ID (Email) & Key (Pass). |
| Click Sign Up | IDLE (Stare) | Immediate transition to Screen 1.0 (The Hook). |
| Click Guest | JUDGING (Narrow Eyes) | Warning Modal: "Ghost operatives cannot save progress. Data will be purged." -> Confirm -> Screen 1.0. |

3. THE FLOW: PHASE 1 - THE INDUCTION (Onboarding Slides)

Goal: Sell the value ("Hook") while remaining App Store safe ("Camouflage").

Screen 1.0: The Awareness (The Hook)

Visual Asset: [Motion Graphic: A puppet string being cut or an eye opening].

Character State: IDLE (Observing).

Headline: "You are being played."

Body Copy: "Every day, hidden psychological scripts are used to influence your decisions. It’s time you saw the strings."

Button: [ EXPLAIN ] (Right Arrow ->).

Screen 2.0: The Solution (The Arsenal)

Visual Asset: [Motion Graphic: A shield blocking a speech bubble].

Character State: EXPLAINING (Hand gesture).

Headline: "Master the Unspoken Rules."

Body Copy: "Learn the advanced negotiation and persuasion tactics used by elite leaders. Stop being a spectator. Become the player."

Button: [ START TRAINING ] (Right Arrow ->).

Screen 3.0: The Ethics (The Warning)

Visual Asset: [Motion Graphic: A heavy vault door locking or a scale of justice].

Character State: JUDGING (Intense stare).

Headline: "With Influence Comes Responsibility."

Body Copy: "This curriculum teaches powerful psychological principles. We provide these tools for defensive purposes only. Ethics are mandatory."

Button: [ I AGREE ] (Checkbox interaction).

4. THE FLOW: PHASE 2 - THE ASSESSMENT (Psychological Profiling)

Goal: Analyze the user's weaknesses (Sunk Cost) and demonstrate authority.

Screen 4.0: The Transition (Auto-plays 3s)

Visual: Animated 8x8 scanning grid with a vertical white line moving up and down over the UI.

Text: "INITIATING PSYCHOLOGICAL PROFILE..."

Screen 4.1: The Objective (Goal)

The Strategist: "First, state your intent."

Question: "Why do you seek this knowledge?"

Options:

A) "To stop others from controlling me."

B) "To advance my career and lead others."

C) "To understand human behavior."

Reaction:

A: "A prudent choice. Shields up."

B: "Ambition is useful. We will sharpen it."

C: "Knowledge is power. But application is control."

Screen 4.2: The Enemy Within (Self-Sabotage)

The Strategist: "The most dangerous manipulator is yourself."

Question: "Do you destroy your own success just as you achieve it?"

Options:

A) "Frequently."

B) "Sometimes."

C) "Rarely."

Reaction:

A/B: "Self-sabotage is a subconscious script. We will rewrite it."

C: "Good. Confidence is vital."

Screen 4.3: The Pattern (Attraction)

The Strategist: "If you are prey, you attract predators."

Question: "Do you find yourself constantly surrounded by toxic or narcissistic personalities?"

Options:

A) "Yes, it keeps happening."

B) "Only in the workplace."

C) "No, I spot them early."

Reaction:

A: "You are broadcasting vulnerability. We must change your frequency."

C: "Excellent. Vigilance is working."

Screen 4.4: The Value (Status)

The Strategist: "Data point: High Emotional Intelligence correlates with executive leadership success."

Question: "Are you prepared to do what is necessary to lead?"

Options:

A) "I will do whatever it takes."

B) "I want to lead, but ethically."

C) "I prefer to stay in the background."

Reaction:

A: "Ruthlessness is a tool. Use it wisely."

B: "Ethics are a luxury of the powerful."

C: "The shadow is a strategic position. We will teach you to strike from it."

Screen 4.5: The Perception Check (Visual Test)

Visual: [An ambiguous optical illusion image - e.g., Skull vs. Woman looking in mirror].

The Strategist: "Look at this image. What do you see first?"

Options:

A) "The Skull (The Threat)."

B) "The Mirror (The Opportunity)."

Reaction:

A: "You are threat-focused. Good for defense."

B: "You are opportunity-focused. Good for influence."

Screen 4.6: The Baseline (Conflict)

The Strategist: "Honesty is required. How do you currently handle conflict?"

Options:

A) "I stay quiet to keep the peace."

B) "I fight back immediately."

C) "I wait for the right moment."

Reaction:

A: "Silence is a vulnerability."

B: "Reactive emotion is a weakness."

C: "Patience is a weapon." (APPROVING Nod).

Screen 4.7: The Micro-Test (Pass/Fail)

The Strategist: "Let us test your instincts."

Question: "A counterpart smiles while delivering bad news. What does it mean?"

Options:

A) "They are nervous." ❌ WRONG

B) "They are hiding hostility." ✅ CORRECT

C) "They are trying to soften the blow." ❌ WRONG

Reaction Logic (Fail Forward):

If WRONG: Screen shakes/Red Text. "Incorrect. You missed the micro-aggression." -> Auto-advance to Phase 3 after 2s.

If CORRECT: White Text/Nod. "Correct. Duper's Delight." -> Auto-advance to Phase 3 after 2s.

5. THE FLOW: PHASE 3 - THE COMMITMENT (Streak & Trial)

Goal: Establish the "Discipline" loop and convert the user.

Screen 5.0: The Calculation

Visual: "CALCULATING CURRICULUM..." (Progress bar fills rapidly).

Text: "Building Operative Profile... Encrypting Data... Generating Strategy..."

Screen 5.1: The Contract (Streak Setting)

The Strategist: "Consistency is not a habit. It is survival."

Question: "Set your training intensity."

Options:

[ CASUAL ]: "I will train occasionally." (Reaction: "Mediocrity is a choice.")

[ SERIOUS ]: "I will train daily." (Reaction: "Good. We begin immediately.")

System Note: This sets the notification permission prompt.

Screen 5.2: The Clearance (The Paywall/Trial)

Visual: A Top Secret Folder with a "LOCKED" padlock icon.

Headline: "CLEARANCE REQUIRED."

Subtext: "Your profile indicates high aptitude for [Result from Q4.1]. Access to the advanced curriculum is restricted to Operatives."

The Offer: "7-Day Field Test."

Action: [ INITIALIZE 7-DAY FIELD TEST ] (Pulse Animation).

Secondary Action: [ REMAIN CIVILIAN ] (Small, grey text - continues to restricted free version).

6. APP STORE SAFETY PROTOCOL (Camouflage)

Strict Rule: To ensure approval, use the vocabulary on the Right.

| ❌ BANNED (Internal) | ✅ SAFE (Public/App Store) |
| Weapons | Tactics / Tools |
| Manipulation | Influence / Persuasion |
| Mind Control | Psychological Strategy |
| Destroy / Attack | Defend / Outsmart |
| Dangerous | Powerful |
| Enemy | Counterpart / Opponent |