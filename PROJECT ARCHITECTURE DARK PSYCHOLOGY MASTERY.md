PROJECT ARCHITECTURE: DARK PSYCHOLOGY MASTERY

Module: Onboarding & First Launch (The Induction)

Version: 1.7 (Added Tactical Pricing UI & Walk of Shame Logic)
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

Animation Spec (See Sec 7): "The Severed String"

Character State: IDLE (Observing).

Headline: "You are being played."

Body Copy: "Every day, hidden psychological scripts are used to influence your decisions. It’s time you saw the strings."

Button: [ EXPLAIN ] (Right Arrow ->).

Screen 2.0: The Solution (The Arsenal)

Animation Spec (See Sec 7): "The Kinetic Shield"

Character State: EXPLAINING (Hand gesture).

Headline: "Master the Unspoken Rules."

Body Copy: "Learn the advanced negotiation and persuasion tactics used by elite leaders. Stop being a spectator. Become the player."

Button: [ START TRAINING ] (Right Arrow ->).

Screen 3.0: The Ethics (The Warning)

Animation Spec (See Sec 7): "The Heavy Vault"

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

5. THE FLOW: PHASE 3 - THE COMMITMENT (Streak & Pricing)

Goal: Establish the "Discipline" loop and convert the user.

Screen 5.0: The Calculation (Dynamic Tag Injection)

Animation Spec (See Sec 7): "The Terminal Compiler"

Visual: A high-speed "Terminal Scroll" animation. Lines of code/data rapidly scrolling up the screen.

Headline: "COMPILING OPERATIVE PROFILE..."

Dynamic Text (Flashes based on user choices):

If Q4.1 = A (Defense): "OPTIMIZING SHIELD PROTOCOLS..."

If Q4.1 = B (Influence): "CALIBRATING PERSUASION VECTORS..."

If Q4.2 = A (Self-Sabotage): "DETECTING SUBCONSCIOUS LOOPS..."

If Q4.6 = A (Avoidance): "CONFIDENCE TRAINING REQUIRED..."

If Q4.7 = Wrong: "VULNERABILITY DETECTED..."

Always: "ENCRYPTING DATA..."

Transition: The text gltiches into the final result -> Screen 5.1.

Screen 5.1: The Contract (Streak Setting)

The Strategist: "Consistency is not a habit. It is survival."

Question: "Set your training intensity."

Options:

[ CASUAL ]: "I will train occasionally." (Reaction: "Mediocrity is a choice.")

[ SERIOUS ]: "I will train daily." (Reaction: "Good. We begin immediately.")

System Note: This sets the notification permission prompt.

Screen 5.2: The Clearance (The Paywall/Tactical Pricing)

Visual: Top Secret Folder icon with "LOCKED" padlock.

Headline: "CLEARANCE REQUIRED."

Subtext: "Your profile indicates high aptitude for [Result from Q4.1]. Access to the advanced curriculum is restricted to Operatives."

The Card Container (Select One):

Card A: The Hero (Founding Offer)

State: Selected by default (Glowing White Border).

Badge: [ FOUNDING OFFER: -75% ] (Green).

Headline: 12 MONTH ASSIGNMENT

Price: $59.99 / year (Strike-through ~~$239.99~~).

Math: "That is $4.99 / month."

Hook: "Includes 7-Day Field Test. You are not charged today."

Card B: The Decoy (Mercenary)

State: Dimmed (Grey Border).

Headline: MONTHLY CONTRACT

Price: $19.99 / month.

Trap: No discount. High short-term cost.

The Actions:

Primary Button:

If Annual Selected: [ INITIALIZE 7-DAY FIELD TEST ] (Pulse Animation).

If Monthly Selected: [ INITIALIZE ACCESS ($19.99) ] (No Trial).

Click Action: Trigger RevenueCat / In-App Purchase.

Secondary Button: [ REMAIN CIVILIAN ] (Small, grey text).

The Walk of Shame (Logic for 'Remain Civilian'):

Trigger: User clicks "Remain Civilian."

Visual: Screen dims Red. Strategist Glitches.

Modal Text: "Warning: You are declining advanced weaponry. You will enter the field unprotected. Confirm?"

Modal Buttons:

[ GO BACK ] (Return to Paywall).

[ I ACCEPT MEDIOCRITY ] (Proceed to restricted Free Tier).

6. APP STORE SAFETY PROTOCOL (Camouflage)

Strict Rule: To ensure approval, use the vocabulary on the Right.

BANNED: Weapons, Manipulation, Mind Control, Destroy, Enemy.

SAFE: Tactics, Influence, Strategy, Outsmart, Counterpart.

7. TECHNICAL ANIMATION SPECS (For AI/Dev)

Copy and paste these specs directly to your developer to ensure high-end visuals.

Spec A: Screen 1.0 - "The Severed String"

Style: Flat Vector Minimalist (Kurzgesagt Noir).

Elements:

The Anchor (Top): A white "Puppet Control Cross" (looks like a fan/cross).

The String: A single vertical white line pulling tight against the anchor.

Action (The Snap):

Frame 1: Static tension.

Frame 2 (The Cut): Invisible blade hits center.

The Reaction (Physics):

Bottom Half: Curls and falls rapidly off-screen.

Top Half: Recoils sharply UPWARD towards the Anchor.

The Anchor: Jerks slightly upwards (releasing tension) and then stabilizes.

Loop: Snap -> Fall/Recoil -> Fade Out -> Reset.

Colors: String (#FFFFFF), Background (#000000).

Spec B: Screen 2.0 - "The Kinetic Shield"

Style: Geometric / System UI.

Elements: A jagged speech bubble (representing an attack) flies from Left to Right. A vertical bar (The Shield) appears instantly.

Action: The bubble hits the bar and shatters into small pixels (particles). The bar glows slightly upon impact.

Vibe: Heavy impact. Like a bullet hitting bulletproof glass.

Colors: Shield (Blue-Grey #64748b), Attack (Red #ef4444).

Spec C: Screen 3.0 - "The Heavy Vault"

Style: Industrial / Skeuomorphic-Lite.

Elements: A circular vault locking mechanism (3 concentric rings).

Action: The rings spin in opposite directions. They click into place one by one (Chunk... Chunk... THUD). A center light turns from Red to Green.

Vibe: Security. Finality. Weight.

Spec D: Screen 5.0 - "The Terminal Compiler"

Style: Matrix/Linux Boot Screen but in Monochrome.

Elements: Scrolling text (Monospace font, size 10px).

Action: Text scrolls upward at 60fps (very fast). Random hex codes and binary strings in the background. The "Dynamic Text" (e.g., "OPTIMIZING SHIELD") appears in BOLD WHITE overlaid on top of the scrolling grey text.

Effect: Glitch/Chromatic Aberration (Red/Blue shift) on the bold text to make it pop.