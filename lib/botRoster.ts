// =============================================================================
// 🤖 GAMBIT SIMULANT ROSTER v1.0
// =============================================================================
// 100 fixed bot identities. These are NOT random — they are persistent characters.
// Each bot has a personality archetype that determines their gameplay behavior.
// The user should never notice these are bots.
// =============================================================================

export type BotArchetype = 'rager' | 'pleaser' | 'sniper' | 'troll';
export type BotRankTier = 'Bronze' | 'Silver' | 'Gold';

// §6: Expanded Mood System (6 states, decoupled from archetype)
export type BotMood = 'focused' | 'neutral' | 'tired' | 'tilted' | 'distracted' | 'overconfident';

export interface BotIdentity {
    id: string;          // Unique key: "bot_001" through "bot_100"
    username: string;    // Realistic handle
    avatar: string;      // Profile image path or emoji
    avatarTier?: number; // 1-4 (Avatar tier system)
    rankTier: BotRankTier;
    rank: string;        // Full rank string: "Bronze I", "Silver III", etc.
    winRate: number;     // Believable stat: 28-78%
    bio: string;         // Short flavor text
    archetype: BotArchetype;
    mood?: BotMood;      // Dynamic state for this specific match
    chatFrequency?: 'silent' | 'occasional' | 'active' | 'loud'; // Per-match personality trait
    playstyleTag?: string; // Hidden: "aggressive", "defensive", "adaptive", "chaotic"
    accountAgeDays?: number; // Fake account age in days (§9)
    matchCount?: number; // Fake total matches played (§9)
    // Archetype-driven behavior modifiers
    aggressionBias: number;   // 0.0-1.0, how likely to pick aggressive option
    submissionBias: number;   // 0.0-1.0, how likely to pick submissive option
    correctBias: number;      // 0.0-1.0, how likely to pick correct option
    baseResponseMs: number;   // Base thinking time in ms (before jitter)
    typingSpeedMs: number;    // How fast they "type" a chat message
    isRepeatEncounter?: boolean; // Toggles the Rule 4 on_repeat_encounter greeting
}

// =============================================================================
// CHAT SYSTEM MASTER PLAN — 10 Universal Phrases, 4 Personas
// =============================================================================
// ALL bots pull from the SAME 10 phrases. No persona-exclusive vocabulary.
// Persona = usage style (frequency, triggers, silence rate), NOT vocabulary.
// This is what prevents pattern detection.
// =============================================================================

export const UNIVERSAL_PHRASES = [
    'nice', 'close', 'my bad', 'unlucky', 'good try',
    '??', 'bruh', 'what', 'ok', 'gg',
] as const;

// Trigger types (kept compatible with existing gameplay flow)
export type ChatTrigger =
    | 'match_start'
    | 'round_win'       // = opponent made a mistake
    | 'round_loss'      // = bot made a mistake
    | 'match_end_win'
    | 'match_end_loss'
    | 'tilt'            // = escalation state
    | 'confidence'
    | 'player_chat'     // = reaction to player message
    | 'on_repeat_encounter' // Rule 4
    | 'close_round'     // both picked same quality
    | 'weird_play';     // unexpected event

// Keep ChatBank interface for backwards compatibility with botEngine imports
export interface ChatBank {
    match_start: string[];
    round_win: string[];
    round_loss: string[];
    match_end_win: string[];
    match_end_loss: string[];
    tilt: string[];
    confidence: string[];
    player_chat: string[];
    on_repeat_encounter: string[];
    [key: string]: string[]; // allow close_round, weird_play
}

// Trigger → which phrases are valid for each event
export const TRIGGER_PHRASES: Record<string, string[]> = {
    match_start: ['ok', 'gg'],
    round_win: ['nice', '??'],           // opponent mistake
    round_loss: ['my bad', 'ok'],          // bot mistake
    match_end_win: ['gg'],
    match_end_loss: ['gg'],
    tilt: ['??', 'bruh'],            // escalation
    confidence: ['nice', 'ok'],
    player_chat: ['ok', 'nice', 'bruh', 'what', '??'],
    on_repeat_encounter: ['ok', '??', 'what'],
    close_round: ['close', 'unlucky'],
    weird_play: ['what', '??'],
};

// =============================================================================
// PERSONA SYSTEM — 4 Personas mapped from Archetypes
// =============================================================================
// A = Competitive / Slightly Aggressive  → rager
// B = Neutral / Balanced                 → troll
// C = Supportive / Low Ego               → pleaser
// D = Quiet / Detached                   → sniper
// =============================================================================

export type ChatPersona = 'A' | 'B' | 'C' | 'D';

export const ARCHETYPE_TO_PERSONA: Record<BotArchetype, ChatPersona> = {
    rager: 'A',
    troll: 'B',
    pleaser: 'C',
    sniper: 'D',
};

// Persona chat probability (base chance to speak at all in a match)
export const PERSONA_CHAT_CHANCE: Record<ChatPersona, number> = {
    A: 0.50,
    B: 0.35,
    C: 0.30,
    D: 0.20,
};

// Persona phrase weights (0-1). Higher = more likely to pick THIS phrase.
export const PERSONA_WEIGHTS: Record<ChatPersona, Record<string, number>> = {
    A: { 'nice': 0.3, 'close': 0.5, 'my bad': 0.3, 'unlucky': 0.4, 'good try': 0.1, '??': 0.9, 'bruh': 0.8, 'what': 0.7, 'ok': 0.4, 'gg': 0.5 },
    B: { 'nice': 0.6, 'close': 0.5, 'my bad': 0.5, 'unlucky': 0.5, 'good try': 0.5, '??': 0.4, 'bruh': 0.4, 'what': 0.4, 'ok': 0.7, 'gg': 0.7 },
    C: { 'nice': 0.9, 'close': 0.5, 'my bad': 0.8, 'unlucky': 0.5, 'good try': 0.9, '??': 0.1, 'bruh': 0.1, 'what': 0.3, 'ok': 0.6, 'gg': 0.7 },
    D: { 'nice': 0.3, 'close': 0.4, 'my bad': 0.2, 'unlucky': 0.3, 'good try': 0.2, '??': 0.15, 'bruh': 0.05, 'what': 0.15, 'ok': 0.6, 'gg': 0.5 },
};

// Persona silence override per trigger (probability of saying NOTHING)
export const PERSONA_SILENCE: Record<ChatPersona, Record<string, number>> = {
    A: { match_start: 0.80, round_win: 0.40, round_loss: 0.30, match_end_win: 0.40, match_end_loss: 0.50, tilt: 0.20, confidence: 0.50, player_chat: 0.30, on_repeat_encounter: 0.20 },
    B: { match_start: 0.85, round_win: 0.50, round_loss: 0.50, match_end_win: 0.50, match_end_loss: 0.50, tilt: 0.40, confidence: 0.60, player_chat: 0.40, on_repeat_encounter: 0.30 },
    C: { match_start: 0.80, round_win: 0.60, round_loss: 0.40, match_end_win: 0.45, match_end_loss: 0.50, tilt: 0.55, confidence: 0.50, player_chat: 0.35, on_repeat_encounter: 0.25 },
    D: { match_start: 0.90, round_win: 0.80, round_loss: 0.80, match_end_win: 0.50, match_end_loss: 0.55, tilt: 0.70, confidence: 0.75, player_chat: 0.70, on_repeat_encounter: 0.40 },
};

// Legacy CHAT_BANKS kept for type compatibility — now points to TRIGGER_PHRASES
// The actual phrase selection is done by getBotChat() using persona weights
const _buildBank = (): ChatBank => ({
    match_start: TRIGGER_PHRASES['match_start'],
    round_win: TRIGGER_PHRASES['round_win'],
    round_loss: TRIGGER_PHRASES['round_loss'],
    match_end_win: TRIGGER_PHRASES['match_end_win'],
    match_end_loss: TRIGGER_PHRASES['match_end_loss'],
    tilt: TRIGGER_PHRASES['tilt'],
    confidence: TRIGGER_PHRASES['confidence'],
    player_chat: TRIGGER_PHRASES['player_chat'],
    on_repeat_encounter: TRIGGER_PHRASES['on_repeat_encounter'],
});

export const CHAT_BANKS: Record<BotArchetype, ChatBank> = {
    rager: _buildBank(),
    pleaser: _buildBank(),
    sniper: _buildBank(),
    troll: _buildBank(),
};

// Helper: Generate a rank string from tier
const rankFromTier = (tier: BotRankTier): string => {
    const suffixes = ['I', 'II', 'III'];
    return `${tier} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

// Helper: Generate archetype-appropriate biases
const archetypeBiases = (archetype: BotArchetype) => {
    switch (archetype) {
        case 'rager':
            return {
                aggressionBias: 0.55 + Math.random() * 0.2,    // 0.55-0.75
                submissionBias: 0.05 + Math.random() * 0.1,     // 0.05-0.15
                correctBias: 0.15 + Math.random() * 0.15,       // 0.15-0.30
                baseResponseMs: 1200 + Math.random() * 800,      // 1.2-2.0s (fast/impulsive)
                typingSpeedMs: 400 + Math.random() * 300,
            };
        case 'pleaser':
            return {
                aggressionBias: 0.05 + Math.random() * 0.1,     // 0.05-0.15
                submissionBias: 0.5 + Math.random() * 0.25,     // 0.50-0.75
                correctBias: 0.15 + Math.random() * 0.15,       // 0.15-0.30
                baseResponseMs: 2500 + Math.random() * 1500,     // 2.5-4.0s (slow/hesitant)
                typingSpeedMs: 800 + Math.random() * 500,
            };
        case 'sniper':
            return {
                aggressionBias: 0.05 + Math.random() * 0.1,     // 0.05-0.15
                submissionBias: 0.05 + Math.random() * 0.1,     // 0.05-0.15
                correctBias: 0.65 + Math.random() * 0.2,        // 0.65-0.85 (high win rate)
                baseResponseMs: 1800 + Math.random() * 1200,     // 1.8-3.0s (calculated)
                typingSpeedMs: 600 + Math.random() * 400,
            };
        case 'troll':
            return {
                aggressionBias: 0.25 + Math.random() * 0.2,     // 0.25-0.45
                submissionBias: 0.15 + Math.random() * 0.15,    // 0.15-0.30
                correctBias: 0.2 + Math.random() * 0.3,         // 0.20-0.50 (unpredictable)
                baseResponseMs: 1000 + Math.random() * 2000,     // 1.0-3.0s (erratic)
                typingSpeedMs: 300 + Math.random() * 600,
            };
    }
};

// =============================================================================
// THE ROSTER — 100 Fixed Identities
// =============================================================================
// Designed to pass as real players. Name formats are mixed:
//   - firstname.initial (sarah.j, rob.h, mari.)
//   - Short gaming handles (FrameK, coldread, exec_)
//   - Casual phrases (bored.af, touchgrass, nocap.fr)
//   - Realistic gamer tags (DarkKnight42, Reaper42, killshot_)
// Bios vary in length, tone, punctuation, and include typos/slang.
// Win rates follow rank: Gold 55–74, Silver 46–62, Bronze 25–45.
// Avatars are unique within each archetype group (no reuse per 25).
// =============================================================================

const RAW_BOTS: Array<{
    username: string;
    avatar: string;
    rankTier: BotRankTier;
    winRate: number;
    bio: string;
    archetype: BotArchetype;
}> = [
        // === RAGERS (25) ===
        { username: "FrameKiller", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 58, bio: "grinding ranked since 2022. if u miss lethal i will flame u. sorry not sorry", archetype: "rager" },
        { username: "shadowcove", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 67, bio: "playing on trackpad don't judge. aiming for diamond this season.", archetype: "rager" },
        { username: "rageq", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 38, bio: "i don't quit i just… restart", archetype: "rager" },
        { username: "DestroyerD", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 56, bio: "here to dominate. thats it", archetype: "rager" },
        { username: "AlphaWolf88", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 63, bio: "sigma grindset or whatver", archetype: "rager" },
        { username: "noMercy", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 59, bio: "competitive not toxic. theres a diff", archetype: "rager" },
        { username: "DarkKnight42", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 53, bio: "the night is mine", archetype: "rager" },
        { username: "BeastMode", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 68, bio: "always on. always.", archetype: "rager" },
        { username: "toxiccc", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 42, bio: "they call me toxic. i disagree lol", archetype: "rager" },
        { username: "Reaper42", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 57, bio: "collecting souls since tuesday", archetype: "rager" },
        { username: "fury.k", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 44, bio: "built diff ngl", archetype: "rager" },
        { username: "killshot22", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 65, bio: "one shot. one kill. sometimes two", archetype: "rager" },
        { username: "HeadHunter", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 60, bio: "hunting szn fr", archetype: "rager" },
        { username: "RageFac", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 35, bio: "tilted but learning. gg", archetype: "rager" },
        { username: "godcomp", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 71, bio: "humility? never heard of her", archetype: "rager" },
        { username: "venom", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 55, bio: "silent but deadly fr", archetype: "rager" },
        { username: "wardog", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 58, bio: "off the leash rn", archetype: "rager" },
        { username: "BladeRunner", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 64, bio: "running through ur defense", archetype: "rager" },
        { username: "NukeThem", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 39, bio: "scorched earth policy lol", archetype: "rager" },
        { username: "Brutal", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 52, bio: "honest player. brutally honest.", archetype: "rager" },
        { username: "TitanMode", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 66, bio: "unmovable tbh. unless i get tilted", archetype: "rager" },
        { username: "firestarter", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 41, bio: "watch it burn", archetype: "rager" },
        { username: "exec_", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 61, bio: "sentence: defeat", archetype: "rager" },
        { username: "chaoslrd", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 37, bio: "i like disorder idk", archetype: "rager" },
        { username: "WarMachine", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 70, bio: "calculating ur end. gg", archetype: "rager" },

        // === PLEASERS (25) ===
        { username: "SarahJ", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 34, bio: "med student just de-stressing between exams! pls be nice <3 playing from library", archetype: "pleaser" },
        { username: "niceperson23", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 52, bio: "dad of 3. only get to play 1 hour a week so lets make it count! gl all", archetype: "pleaser" },
        { username: "softiee", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 38, bio: "be kind always ✨ also im bad at this", archetype: "pleaser" },
        { username: "SunnyDay", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 49, bio: "positive vibes only (mostly)", archetype: "pleaser" },
        { username: "peacemaker01", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 41, bio: "why cant we all get along tho", archetype: "pleaser" },
        { username: "mari_art", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 53, bio: "artist / streamer. check my bio for sketch comms! (actually just playing for fun today)", archetype: "pleaser" },
        { username: "lilypad", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 36, bio: "floating thru life and also this game", archetype: "pleaser" },
        { username: "Gemini_", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 33, bio: "sweet but will fight back (jk probably not)", archetype: "pleaser" },
        { username: "butterfly", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 48, bio: "transforming into someone better hopefully", archetype: "pleaser" },
        { username: "hug_me", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 39, bio: "sending virtual hugs to my oponents", archetype: "pleaser" },
        { username: "rainbowkid", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 51, bio: "every cloud has a lining right??", archetype: "pleaser" },
        { username: "kindred_spirit", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 55, bio: "we're in this together gl", archetype: "pleaser" },
        { username: "MoonBeam", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 35, bio: "night owl 🦉 playing at 3am again", archetype: "pleaser" },
        { username: "StarLight", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 50, bio: "reaching for the stars (and failing)", archetype: "pleaser" },
        { username: "daisychain", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 40, bio: "making freinds not enemies", archetype: "pleaser" },
        { username: "WarmHeart", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 54, bio: "empathy is power i think", archetype: "pleaser" },
        { username: "CloudNine", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 32, bio: "head in the clouds ngl. brain off", archetype: "pleaser" },
        { username: "HoneyBee", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 47, bio: "busy learning 🍯 also procrastinating", archetype: "pleaser" },
        { username: "angeleyes", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 37, bio: "looking for the good in everyone (hard)", archetype: "pleaser" },
        { username: "tender.h", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 52, bio: "care bear energy fr", archetype: "pleaser" },
        { username: "petal", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 36, bio: "delicate but growing ig", archetype: "pleaser" },
        { username: "sparkle22", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 50, bio: "shine bright!! (unless im losing)", archetype: "pleaser" },
        { username: "dove.peace", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 30, bio: "peace ✌️ also i dont know what im doing", archetype: "pleaser" },
        { username: "lullaby_", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 46, bio: "soft melodies and hard losses", archetype: "pleaser" },
        { username: "RoseGold", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 53, bio: "classy vibes. messy gameplay", archetype: "pleaser" },

        // === SNIPERS (25) ===
        { username: "mike_821", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 72, bio: "read the patch notes 3 times. i know the meta better than u. debate me.", archetype: "sniper" },
        { username: "logic_prime", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 74, bio: "software dev by day, sweat by night. optimizing my win path efficiency.", archetype: "sniper" },
        { username: "Analytical", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 71, bio: "overthinking every round tbh", archetype: "sniper" },
        { username: "coldread", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 62, bio: "reading the room. always.", archetype: "sniper" },
        { username: "Precision", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 73, bio: "surgical precision. mostly", archetype: "sniper" },
        { username: "Calculated", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 68, bio: "every move matters", archetype: "sniper" },
        { username: "ImJustHere", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 61, bio: "law school sucks", archetype: "sniper" },
        { username: "QuietStorm", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 69, bio: "", archetype: "sniper" },
        { username: "zen_master", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 72, bio: "patience wins.", archetype: "sniper" },
        { username: "chess_mind", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 70, bio: "idk i just aim", archetype: "sniper" },
        { username: "void_", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 60, bio: "empty mind, full focus", archetype: "sniper" },
        { username: "silent.judge", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 67, bio: "observing.", archetype: "sniper" },
        { username: "hawk_eye", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 71, bio: "nothing escapes me (except bugs)", archetype: "sniper" },
        { username: "Neo", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 58, bio: "see the patterns", archetype: "sniper" },
        { username: "deep_focus", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 73, bio: "locked in.", archetype: "sniper" },
        { username: "stoic_one", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 69, bio: "unmoved by chat. or anything really", archetype: "sniper" },
        { username: "bin.mind", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 59, bio: "yes or no. no maybe", archetype: "sniper" },
        { username: "owl_watcher", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 70, bio: "watching. always. even when eating", archetype: "sniper" },
        { username: "RazorLogic", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 74, bio: "cut the noise", archetype: "sniper" },
        { username: "stealth_op", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 63, bio: "you won't see me coming", archetype: "sniper" },
        { username: "MindReader", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 71, bio: "predictable players everywhere tbh", archetype: "sniper" },
        { username: "RobH", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 57, bio: "logic over ego. streak lost to rng", archetype: "sniper" },
        { username: "scope_in", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 72, bio: "zoomed in.", archetype: "sniper" },
        { username: "DataPoint", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 60, bio: "another data point collected", archetype: "sniper" },
        { username: "GlassCannon", avatar: "/Profile image/8.jpg", rankTier: "Gold", winRate: 68, bio: "fragile precision. one bad round and im done", archetype: "sniper" },

        // === TROLLS (25) ===
        { username: "NateK", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 45, bio: "just logging in for my daily streak rewards then dipping. low energy today.", archetype: "troll" },
        { username: "dont_at_me", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 56, bio: "chaos is a ladder or whatever lol", archetype: "troll" },
        { username: "hehe_xd", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 42, bio: "hehehe idk why im here", archetype: "troll" },
        { username: "bigbrain", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 54, bio: "lag", archetype: "troll" },
        { username: "HONK", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 38, bio: "honk.", archetype: "troll" },
        { username: "lmaoo__", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 51, bio: "literally dying rn", archetype: "troll" },
        { username: "sus.player", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 43, bio: "kinda sus ngl", archetype: "troll" },
        { username: "WiFi_lag", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 55, bio: "playing from mcdonalds wifi honestly. if i teleport, its a feature not a bug.", archetype: "troll" },
        { username: "PlayerOne", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 40, bio: "trying to climb ranks, gg's", archetype: "troll" },
        { username: "random_crit", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 50, bio: "RNG is my best friend and worst enemy", archetype: "troll" },
        { username: "GhostMode", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 39, bio: "sorry for spamming. anyway *spams*", archetype: "troll" },
        { username: "bored.af", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 49, bio: "playing with my eyes closed (not rly)", archetype: "troll" },
        { username: "bruhmoment", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 41, bio: "bruh.", archetype: "troll" },
        { username: "chaotic_good", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 57, bio: "lol imagine", archetype: "troll" },
        { username: "SkillIssue", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 36, bio: "it's a skill issue (mine)", archetype: "troll" },
        { username: "Copium", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 52, bio: "inhaling copium rn ngl", archetype: "troll" },
        { username: "fourtwenty", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 38, bio: "vibing thru ranked somehow", archetype: "troll" },
        { username: "urmom_lol", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 35, bio: "ur mom said hi", archetype: "troll" },
        { username: "NoCap", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 53, bio: "no cap fr fr (all cap)", archetype: "troll" },
        { username: "RatioKing", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 58, bio: "L", archetype: "troll" },
        { username: "touchgrass", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 40, bio: "go outside (no)", archetype: "troll" },
        { username: "BasedTake", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 55, bio: "unpopular opinion: i'm bad at this", archetype: "troll" },
        { username: "MainChar", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 43, bio: "?", archetype: "troll" },
        { username: "GlitchMob", avatar: "/Profile image/11.jpg", rankTier: "Silver", winRate: 51, bio: "mic broke sry. also keyboard broke", archetype: "troll" },
        { username: "oof_size", avatar: "/Profile image/5.jpg", rankTier: "Bronze", winRate: 37, bio: "oof size: large. brain size: small", archetype: "troll" },
    ];

// Build the full roster with generated IDs and archetype biases
export const BOT_ROSTER: BotIdentity[] = RAW_BOTS.map((raw, index) => {
    const biases = archetypeBiases(raw.archetype);
    return {
        id: `bot_${String(index + 1).padStart(3, '0')}`,
        username: raw.username,
        avatar: raw.avatar,
        rankTier: raw.rankTier,
        rank: rankFromTier(raw.rankTier),
        winRate: raw.winRate,
        bio: raw.bio,
        archetype: raw.archetype,
        ...biases,
    };
});

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/** Get a random bot from the roster */
export const getRandomBot = (): BotIdentity => {
    return BOT_ROSTER[Math.floor(Math.random() * BOT_ROSTER.length)];
};

/** Get a random bot filtered by rank tier */
export const getBotByTier = (tier: BotRankTier): BotIdentity => {
    const tiered = BOT_ROSTER.filter(b => b.rankTier === tier);
    return tiered[Math.floor(Math.random() * tiered.length)];
};

/** Get a bot by its fixed ID */
export const getBotById = (id: string): BotIdentity | undefined => {
    return BOT_ROSTER.find(b => b.id === id);
};

// =============================================================================
// PERSONA-WEIGHTED PHRASE SELECTOR
// =============================================================================
// All bots pull from the SAME 10 phrases.
// Persona determines WHICH phrase is more likely, not which phrases exist.
// =============================================================================

/** Weighted random pick from a phrase list using persona weights */
const weightedPick = (phrases: string[], persona: ChatPersona): string => {
    if (phrases.length === 0) return '';
    if (phrases.length === 1) return phrases[0];

    const weights = PERSONA_WEIGHTS[persona];
    const weighted = phrases.map(p => ({ phrase: p, weight: weights[p] ?? 0.5 }));
    const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const w of weighted) {
        roll -= w.weight;
        if (roll <= 0) return w.phrase;
    }
    return phrases[0];
};

/** Get a chat message for a bot given an event trigger.
 *  Uses the Chat System Master Plan: universal phrases + persona weighting. */
export const getBotChat = (
    botOrArchetype: BotIdentity | BotArchetype,
    trigger: keyof ChatBank
): string => {
    const archetype = typeof botOrArchetype === 'string' ? botOrArchetype : botOrArchetype.archetype;
    const persona = ARCHETYPE_TO_PERSONA[archetype];

    // Get phrases valid for this trigger
    const phrases = TRIGGER_PHRASES[trigger as string] || [];
    if (phrases.length === 0) return '';

    return weightedPick(phrases, persona);
};

/** Apply a 15% chance to swap archetype for this match (Population Noise) */
export const applyPersonalityDrift = (bot: BotIdentity): BotIdentity => {
    if (Math.random() > 0.15) return bot;

    const driftMap: Record<BotArchetype, BotArchetype> = {
        'rager': 'sniper',   // Silent
        'pleaser': 'rager',  // Frustrated
        'sniper': 'troll',   // Joking
        'troll': 'sniper',   // Tryhard
    };

    const newArchetype = driftMap[bot.archetype];
    return {
        ...bot,
        archetype: newArchetype,
        ...archetypeBiases(newArchetype),
    };
};

// =============================================================================
// §6: EXPANDED MOOD SYSTEM — 6 States, Decoupled from Archetype
// =============================================================================
// Avatar does NOT determine mood. State determines behavior.
// Mood is assigned FRESH every match — no persistence.

export const assignBotMood = (bot: BotIdentity): BotIdentity => {
    const rand = Math.random();
    let mood: BotMood;

    // Base distribution: Neutral 35%, Focused 20%, Tired 15%, Distracted 10%, Tilted 10%, Overconfident 10%
    if (rand < 0.35) mood = 'neutral';
    else if (rand < 0.55) mood = 'focused';
    else if (rand < 0.70) mood = 'tired';
    else if (rand < 0.80) mood = 'distracted';
    else if (rand < 0.90) mood = 'tilted';
    else mood = 'overconfident';

    // §5: Avatar-Behavior Coupling (Loose, Not Hard)
    // Tier 4 bots have 10-20% higher confidence probability
    if (bot.avatarTier === 4 && Math.random() < 0.15) mood = 'overconfident';
    // Tier 2 bots slightly more aggressive mood
    if (bot.avatarTier === 2 && mood === 'neutral' && Math.random() < 0.2) mood = 'focused';
    // But sometimes Tier 4 plays badly (humans are inconsistent)
    if (bot.avatarTier === 4 && Math.random() < 0.08) mood = 'tired';
    // Tier 1 is most inconsistent — any mood is equally valid (no override)

    // §7: Chat Frequency Distribution (40/35/20/5 — NOT clustered by archetype)
    let frequency: 'silent' | 'occasional' | 'active' | 'loud' = 'occasional';
    const freqRand = Math.random();
    if (freqRand < 0.40) frequency = 'silent';
    else if (freqRand < 0.75) frequency = 'occasional';
    else if (freqRand < 0.95) frequency = 'active';
    else frequency = 'loud';

    // Mood influences chat (not archetype!)
    // Tilted players talk more. Tired players talk less.
    if (mood === 'tilted' && frequency === 'silent' && Math.random() < 0.5) frequency = 'occasional';
    if (mood === 'tired' && frequency === 'active' && Math.random() < 0.4) frequency = 'occasional';
    if (mood === 'overconfident' && frequency === 'silent' && Math.random() < 0.3) frequency = 'active';

    return { ...bot, mood, chatFrequency: frequency };
};
