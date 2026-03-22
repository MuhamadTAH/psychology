# DuoLearn Bot Persistence & Social Integration Plan

This document outlines the strategic plan for evolving the bot roster into a living, persistent population within the DuoLearn ecosystem.

## 1. Bot Database Centralization [DONE]
We have successfully transitioned the 100 bots from static code definitions into the central application database (Convex `bots` table). This allows bots to:
- Appear in global leaderboards alongside real players.
- Maintain consistent statistics that are visible to everyone in their rank tier.
- Exist as verifiable "entities" within the system.

## 2. Dynamic Progression & Ranking
Bots should not have static win rates or points. We need a system where:
- Bots gain or lose ranking points based on their actual match outcomes against players.
- Bot ranks fluctuate (moving between Bronze, Silver, Gold) over time.
- Their performance history is tracked so players can see their recent "form."

## 3. Interactive Bot Profiles (COMPLETED)
Every bot identity needs a dedicated profile page. When a player clicks on a bot like "BeastMode" in the lobby or rankings:
- [x] It opens a profile showing their bio, unique avatar, trophy count, and match history.
- [x] The interface should look identical to a real player's profile to maintain the illusion.

## 4. Social Integration (Friend Requests) (COMPLETED)
To deepen the "simulant" experience, we need to support social interactions:
- [x] Players should be able to send friend requests to bots from their profiles.
- [x] Bots should have logic to "accept" these requests based on their archetype (e.g., Pleasers accept quickly, Snipers rarely accept).
- [x] "Friended" bots could appear in the player's friend list with an "Online/Offline" status.

## 5. Proactive Bot Match Logic (Rematches & Invites) (COMPLETED)
Bots should be able to initiate actions, not just respond to them:
- [x] **Bot-Initiated Rematches**: After a match, instead of waiting for the player, a bot (especially a Rager or Troll) can send a rematch request to the player.
- [x] **Match Invitations**: If a player has a bot as a "friend," the bot could occasionally send a match invite when the player is in the lobby.

## 6. Simulated Global Activity
To make the world feel alive, we need a background system that:
- Simulates bot-vs-bot matches so their points change even when not playing against the user.
- Rotates which bots are "online" and "offline" based on the time of day.

## 7. Would you like me to add a "Promotion Celebration" screen so that when you (the player) get promoted, you see a special animation?

---

# 🤖 Advanced Bot Profile & Psychological Promotion System (IMPLEMENTED)

## 1️⃣ Core Objective ✅
Bot profiles must:
- Feel indistinguishable from real users over 50+ matches
- Promote locked avatars subtly
- Avoid detectable pattern repetition
- Avoid archetype clustering
- Support monetization psychology without exposing manipulation

The system must optimize for long-term believability, not short-term intimidation.

## 2️⃣ Bot Profile Structure ✅ (Schema + botRoster.ts + convex/bots.ts)
Each bot account must have two distinct layers.

**Static Attributes (Identity)** — Stored in Convex `bots` table
- Username
- Rank (Bronze / Silver / Gold)
- Winrate (imperfect distribution, slightly messy)
- Avatar ID
- Avatar Tier (1-4)
- Account Age (fake age in days) → `accountAgeDays`
- Match Count → `matchCount`
- Preferred Playstyle Tag (hidden system variable) → `playstyleTag`

**Dynamic Attributes (Changes Per Match - Behavior)** — Assigned in `assignBotMood()`
- Mood State (6 states: focused, neutral, tired, tilted, distracted, overconfident)
- Chat Frequency Level (40/35/20/5 distribution)
- Confidence Level (via `botEngine.ts` state)
- Tilt Probability (via `botEngine.ts` state)
- Avatar Probability Modifier (via tier coupling)

*If this separation doesn't exist, the system will feel scripted.*

## 3️⃣ Avatar Assignment Rules ✅ (`convex/bots.ts` → `pickAvatarForRank()`)
You are NOT randomly equipping cool avatars. You are controlling exposure frequency.

**Base Distribution (Per Rank)**
- **Bronze Bots:** 70% Tier 1 | 25% Tier 2 | 5% Tier 3 | 0% Tier 4
- **Silver Bots:** 40% Tier 1 | 35% Tier 2 | 20% Tier 3 | 5% Tier 4
- **Gold Bots:** 20% Tier 1 | 30% Tier 2 | 35% Tier 3 | 15% Tier 4

*If Tier 4 shows too often → illusion dies.*

## 4️⃣ Exposure Control (Critical) ✅ (`botExposure` table + gameplay selection filter)
For EACH real player:
- Do not show the same locked avatar more than twice in 10 matches.
- Do not show Tier 4 more than once every 5 matches.
- Randomize which specific Tier 3 or 4 appears.

The player should THINK: *"I keep seeing different cool avatars."*
Not: *"Everyone uses The Eye."*

## 5️⃣ Avatar ↔ Behavior Coupling (Loose, Not Hard) ✅ (`assignBotMood()`)
Do NOT lock behavior to avatar. That is amateur.
Instead:
- Tier 4 bots have 10–20% higher confidence probability.
- Tier 3 bots slightly more analytical tone.
- Tier 2 bots slightly more aggressive.
- Tier 1 bots most inconsistent.

But this must be probabilistic. Sometimes:
- Tier 4 bot plays badly.
- Tier 1 bot dominates.

*Humans are inconsistent. Your bots must be too.*

## 6️⃣ Mood System (Non-Negotiable) ✅ (`botRoster.ts` + `botEngine.ts`)
Before each match, assign bot one of:
- Focused
- Neutral
- Tired
- Tilted
- Distracted
- Overconfident

Mood modifies: Chat frequency, Reaction time, Risk-taking, Aggression, Likelihood to blame others.
*Avatar does NOT determine mood. State determines behavior.*

## 7️⃣ Chat Frequency Distribution ✅ (`assignBotMood()` — NOT archetype-clustered)
Across all bots globally:
- 40% Silent players
- 35% Occasional chat (1–3 messages)
- 20% Active chatters
- 5% Loud personalities

Do not cluster this by archetype. Even trolls must sometimes be silent.

## 8️⃣ Winrate Distribution (Make It Messy) ✅ (RAW_BOTS data already includes outliers)
Do NOT smooth curves. Add outliers:
- Bronze at 49%
- Silver at 63%
- Gold at 54%
- Gold at 72% (rare)
- Bronze at 28%

*Humans are uneven. Smooth curves expose design.*

## 9️⃣ Account Age Simulation ✅ (`generateAccountAge()` in convex/bots.ts)
Bots must not all look new. Distribution example:
- 30% appear 10–30 days old
- 40% appear 30–120 days old
- 20% appear 4–8 months old
- 10% appear 1+ year old

Match count must align with age. Nothing screams fake like: *Account age 2 days, 400 matches.*

## 🔟 Psychological Promotion Strategy ✅ (Tier distribution + loose behavior coupling)
Bots are NOT advertisements. They are ambient aspiration.
Rules:
- Tier 4 bots should win slightly more often but not dominate.
- Tier 3 should feel achievable.
- Tier 2 should feel common.
- Tier 1 should still sometimes outperform Tier 3.

The player must think: *"If I grind, I can look like that."*
Not: *"Only bots look like that."*

## 11️⃣ Entropy Safeguards ✅ (`entropyShuffleBots` mutation in convex/bots.ts)
Add system-level randomness:
- Weekly shuffle avatar assignment for 10% of bots.
- Slightly modify winrates over time.
- Randomly decay streak stats.
- Occasionally switch a bot's playstyle tag.

*No static population. Static systems get reverse-engineered.*

## 12️⃣ Hard Rules (Do Not Break) ✅ (Enforced by design)
- Never use names referencing bots.
- Never make locked avatars appear exclusively on bots.
- Never let Tier 4 dominate visibility.
- Never let behavior align too cleanly with rank.
- Never let chat personalities cluster perfectly.

*If any of these happen → your illusion collapses.*

## AI Developer Directive
Build a bot profile system driven by probabilistic distribution, mood-based behavior variance, exposure control per real user, and non-deterministic avatar assignment tied loosely to rank but never fixed. The system must optimize for long-term statistical believability over immediate visual impact.

CHAT SYSTEM MASTER PLAN

This is a structured, limited, scalable system using only ~10 phrases.

1️⃣ The 10 Shared Universal Phrases

All bots pull from the same pool:

"nice"

"close"

"my bad"

"unlucky"

"good try"

"??"

"bruh"

"what"

"ok"

"gg"

No persona-exclusive phrases.

That’s how you avoid pattern detection.

2️⃣ Persona = Usage Style, Not Vocabulary

You have 4 personas.
They differ in:

Chat frequency

Reaction triggers

Escalation probability

Silence rate

Tilt behavior

NOT in phrase vocabulary.

3️⃣ Global Chat Frequency Distribution

Across ALL bots:

40% Silent (0 messages)

35% Light (1 message)

20% Medium (2 messages)

5% Heavy (3–5 messages)

If this distribution shifts → system becomes obvious.

4️⃣ Persona Behavior Model
Persona A — Competitive / Slightly Aggressive

Higher chance to use:

"??"

"bruh"

"what"

Lower chance to say:

"good try"

Slightly lower chance to say "my bad"

Escalation chance: Medium

Chat probability:

50% chance to talk at least once

Persona B — Neutral / Balanced

Even distribution across phrases

Most likely to say:

"nice"

"ok"

"gg"

Chat probability:

35% chance to talk

Persona C — Supportive / Low Ego

Higher chance to say:

"good try"

"my bad"

"nice"

Very low chance to use:

"??"

"bruh"

Chat probability:

30%

Persona D — Quiet / Detached

70% silence rate

When speaking:

"ok"

"gg"

"close"

Never escalates

Chat probability:

20%

5️⃣ Event Triggers

Bots don’t speak randomly.

They speak after specific events.

Trigger Types:

Bot makes mistake

Teammate makes mistake

Opponent makes mistake

Close round

Unexpected event

End of match

Each persona has different trigger sensitivity.

6️⃣ Trigger → Phrase Mapping
Bot Mistake

"my bad"

"ok"

Aggressive persona: 30% chance silence instead.

Teammate Mistake

"??"

"bruh"

silence

Support persona: 60% chance silence.

Opponent Mistake

"nice"

"??"

Quiet persona: 80% silence.

Close Round

"close"

"unlucky"

Weird Play

"what"

"??"

End of Match

50% chance:

"gg"

50% silence

Never 100% “gg”. That’s fake.

7️⃣ Escalation Logic

If same bot experiences 2 negative triggers in a row:

Increase probability of:

"??"

"bruh"

But cap at 2 uses per match.

No spam.

8️⃣ Timing Variance (Critical)

Reaction delay random between:

0.8s – 4.5s

Occasionally:

Instant reaction

No reaction

Never fixed delay.

9️⃣ Hard Limits Per Match

Per bot per match:

Max 5 messages

Max 2 identical phrases

Max 2 escalation phrases

Minimum 1 match gap before repeating heavy chat behavior

This prevents detection.

🔟 Long-Term Entropy

Every 20 matches:

Slightly adjust persona probabilities

Change silence rate ±5%

Randomly lower escalation threshold

No static bots.

Static bots get exposed.