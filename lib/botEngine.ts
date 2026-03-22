// =============================================================================
// 🧠 GAMBIT BOT ENGINE v1.0
// =============================================================================
// The Psychometric Engine — Determines HOW a bot plays.
// This file handles: Decision-making, Timing physics, Tilt system, Chat triggers.
// All logic runs client-side to avoid unnecessary Convex mutations.
// Bots do NOT touch the database — they are ephemeral opponents.
// =============================================================================

import {
    BotIdentity,
    BotArchetype,
    ChatBank,
    getBotChat,
    ARCHETYPE_TO_PERSONA,
    PERSONA_SILENCE,
    TRIGGER_PHRASES,
} from './botRoster';

// =============================================================================
// 1. THE DECISION ENGINE — How the bot "chooses" an option
// =============================================================================

export interface BotDecision {
    chosenOptionIndex: number; // 0, 1, or 2 (maps to the option array)
    thinkingTimeMs: number;   // How long the bot "thinks" before acting
    chatMessage: string | null; // Chat message triggered by the decision
    showTypingHesitation: boolean; // Whether to show the typing → stop → typing illusion
}

export interface BotState {
    bot: BotIdentity;
    consecutiveWins: number;
    consecutiveLosses: number;
    totalRoundsPlayed: number;
    isTilted: boolean;
    isConfident: boolean;
}

/** Create a fresh BotState for a new match */
export const createBotState = (bot: BotIdentity): BotState => ({
    bot,
    consecutiveWins: 0,
    consecutiveLosses: 0,
    totalRoundsPlayed: 0,
    isTilted: false,
    isConfident: false,
});

/**
 * THE CORE DECISION FUNCTION
 * 
 * Given the current bot state and the options for the current round,
 * determine what the bot picks and how long it takes.
 * 
 * The bot does NOT see option types — it picks based on its personality bias.
 * This means Ragers will often pick the aggressive option (often Fatal),
 * which hurts THEM. This is by design — bots make human-like mistakes.
 */
export const botMakeDecision = (
    state: BotState,
    options: Array<{ id: string; text: string; type: string }>,
    scenarioWordCount: number,
): BotDecision => {
    const { bot } = state;

    // --- STEP 1: Calculate bias modifiers from Tilt/Confidence/Mood ---
    let aggMod = bot.aggressionBias || 0.33;
    let subMod = bot.submissionBias || 0.33;
    let corMod = bot.correctBias || 0.34;

    if (state.isTilted) {
        aggMod = Math.min(1, aggMod + 0.25);
        corMod = Math.max(0, corMod - 0.2);
    }

    if (state.isConfident) {
        corMod = Math.min(1, corMod + 0.1);
        aggMod = Math.max(0, aggMod - 0.05);
    }

    // §6: Mood-based bias adjustments
    if (bot.mood === 'focused') {
        corMod = Math.min(1, corMod + 0.08);
    } else if (bot.mood === 'overconfident') {
        aggMod = Math.min(1, aggMod + 0.12);
        corMod = Math.max(0, corMod - 0.05);
    } else if (bot.mood === 'tired') {
        corMod = Math.max(0, corMod - 0.1);
        subMod = Math.min(1, subMod + 0.05);
    } else if (bot.mood === 'distracted') {
        // Distracted: more random, less correct
        corMod = Math.max(0, corMod - 0.15);
    }

    // Normalize biases to sum to 1
    const total = aggMod + subMod + corMod;
    const normAgg = aggMod / total;
    const normSub = subMod / total;
    // normCor = 1 - normAgg - normSub (implicit)

    // --- STEP 2: Map option types to bias categories ---
    // Find which option index corresponds to each type
    const fatalIdx = options.findIndex(o => o.type === 'Fatal');
    const weakIdx = options.findIndex(o => o.type === 'Weak');
    const winIdx = options.findIndex(o => o.type === 'Win');

    // --- STEP 3: Roll the dice ---
    const roll = Math.random();
    let chosenOptionIndex: number;

    if (roll < normAgg && fatalIdx !== -1) {
        chosenOptionIndex = fatalIdx; // Bot picks aggressive (Fatal)
    } else if (roll < normAgg + normSub && weakIdx !== -1) {
        chosenOptionIndex = weakIdx; // Bot picks submissive (Weak)
    } else if (winIdx !== -1) {
        chosenOptionIndex = winIdx; // Bot picks correct (Win)
    } else {
        // Fallback: random
        chosenOptionIndex = Math.floor(Math.random() * options.length);
    }

    // --- STEP 4: Calculate Reading + Thinking Time ---
    // Formula: (Scenario Word Count / 3 wps) * 1000ms + BaseResponseMs + Jitter
    const readingTimeMs = (scenarioWordCount / 3) * 1000;
    const baseResponse = bot.baseResponseMs || 2500; // Default 2.5s
    let jitter = (Math.random() - 0.5) * 1000; // ±500ms

    if (state.isTilted) {
        jitter -= 500;
    }
    if (state.isConfident) {
        jitter -= 300;
    }
    // §6: Mood timing modifiers
    if (bot.mood === 'focused') jitter -= 200;
    if (bot.mood === 'overconfident') jitter -= 400;
    if (bot.mood === 'tired') jitter += 600;
    if (bot.mood === 'distracted') jitter += 400;

    const thinkingTimeMs = Math.max(
        3000, // Minimum 3s — no human reads a scenario faster than this
        readingTimeMs + baseResponse + jitter
    );

    // --- STEP 5: Decide on Chat ---
    // Mid-round chat only happens when tilted or confident.
    // Probability is archetype-driven (Snipers ~5%, Ragers ~45% when tilted, etc.)
    let chatMessage: string | null = null;

    if (state.isTilted) {
        chatMessage = getEventChat(bot, 'tilt');
    } else if (state.isConfident) {
        chatMessage = getEventChat(bot, 'confidence');
    }
    // No mid-round chat when neutral — humans focus on the game

    // --- STEP 6: Typing Hesitation ---
    // 20% chance to show typed → deleted → retyped behavior
    const showTypingHesitation = Math.random() < 0.2;

    return {
        chosenOptionIndex,
        thinkingTimeMs,
        chatMessage,
        showTypingHesitation,
    };
};

// =============================================================================
// 2. THE TILT SYSTEM — Updates after each round
// =============================================================================

/**
 * Update the bot's emotional state after a round.
 * @param state Current bot state
 * @param botWonRound Whether the bot won this round
 * @returns Updated bot state
 */
export const updateBotState = (
    state: BotState,
    botWonRound: boolean,
): BotState => {
    const newState = { ...state };
    newState.totalRoundsPlayed += 1;

    if (botWonRound) {
        newState.consecutiveWins += 1;
        newState.consecutiveLosses = 0;
    } else {
        newState.consecutiveLosses += 1;
        newState.consecutiveWins = 0;
    }

    // Tilt Check: 2+ consecutive losses
    newState.isTilted = newState.consecutiveLosses >= 2;

    // Confidence Check: 2+ consecutive wins
    newState.isConfident = newState.consecutiveWins >= 2;

    return newState;
};

// =============================================================================
// 3. CHAT SYSTEM MASTER PLAN — Event-based, persona-driven, hard-limited
// =============================================================================
// - ALL bots use the same 10 phrases.
// - Persona controls silence rate, phrase weight, and escalation.
// - Hard limits per match prevent detection.
// =============================================================================

// --- Per-Match Chat State Tracker (module-level, reset per match) ---
interface ChatTracker {
    messageCount: number;          // Hard limit: max 5 per match
    phraseUsage: Record<string, number>; // Track phrase repetition (max 2 identical)
    escalationCount: number;       // Hard limit: max 2 escalation phrases per match
    negativeTriggerStreak: number; // Consecutive negative events (for escalation)
}

const _chatTrackers: Map<string, ChatTracker> = new Map();

const _getTracker = (botId: string): ChatTracker => {
    if (!_chatTrackers.has(botId)) {
        _chatTrackers.set(botId, {
            messageCount: 0,
            phraseUsage: {},
            escalationCount: 0,
            negativeTriggerStreak: 0,
        });
    }
    return _chatTrackers.get(botId)!;
};

/** Call this when a new match starts to reset chat tracking for the bot */
export const resetChatTracker = (botId: string): void => {
    _chatTrackers.delete(botId);
};

// Escalation phrases (the only phrases that count toward escalation cap)
const ESCALATION_PHRASES = new Set(['??', 'bruh']);

// Negative triggers (increase escalation streak)
const NEGATIVE_TRIGGERS = new Set(['round_loss', 'tilt']);

/**
 * MASTER PLAN: getEventChat
 * 
 * Flow:
 * 1. Check hard limits (max 5 messages, max 2 escalation)
 * 2. Roll persona silence rate for this trigger
 * 3. If escalation streak >= 2, boost escalation phrase probability
 * 4. Pick phrase via persona-weighted selector
 * 5. Enforce max 2 identical phrases
 * 6. Track usage and return
 */
export const getEventChat = (
    bot: BotIdentity,
    eventType: keyof ChatBank,
): string | null => {
    const tracker = _getTracker(bot.id);
    const persona = ARCHETYPE_TO_PERSONA[bot.archetype];

    // --- Update escalation streak ---
    if (NEGATIVE_TRIGGERS.has(eventType as string)) {
        tracker.negativeTriggerStreak++;
    } else {
        tracker.negativeTriggerStreak = 0;
    }

    // --- Hard Limit: Max 5 messages per match ---
    if (tracker.messageCount >= 5) return null;

    // --- Rule 4 Exception: on_repeat_encounter is ALWAYS 100% ---
    if (eventType === 'on_repeat_encounter') {
        const text = getBotChat(bot, eventType);
        if (text) {
            tracker.messageCount++;
            tracker.phraseUsage[text] = (tracker.phraseUsage[text] || 0) + 1;
        }
        return text || null;
    }

    // --- Persona silence rate for this trigger ---
    const silenceRate = PERSONA_SILENCE[persona]?.[eventType as string] ?? 0.60;
    if (Math.random() < silenceRate) return null;

    // --- End of match: 50% chance "gg", 50% silence (per plan) ---
    if (eventType === 'match_end_win' || eventType === 'match_end_loss') {
        if (Math.random() > 0.50) return null;
    }

    // --- Escalation logic: 2+ consecutive negative triggers ---
    // Boost escalation phrases but cap at 2 per match
    let useEscalation = false;
    if (tracker.negativeTriggerStreak >= 2 && tracker.escalationCount < 2) {
        useEscalation = true;
    }

    // --- Hard Limit: Max 2 escalation phrases ---
    if (useEscalation) {
        const escalationPhrases = TRIGGER_PHRASES['tilt'] || ['??', 'bruh'];
        const phrase = escalationPhrases[Math.floor(Math.random() * escalationPhrases.length)];

        // Check max 2 identical
        if ((tracker.phraseUsage[phrase] || 0) >= 2) return null;

        tracker.messageCount++;
        tracker.escalationCount++;
        tracker.phraseUsage[phrase] = (tracker.phraseUsage[phrase] || 0) + 1;
        return phrase;
    }

    // --- Normal phrase selection via persona-weighted getBotChat ---
    const text = getBotChat(bot, eventType);
    if (!text) return null;

    // Hard Limit: Max 2 identical phrases per match
    if ((tracker.phraseUsage[text] || 0) >= 2) return null;

    tracker.messageCount++;
    tracker.phraseUsage[text] = (tracker.phraseUsage[text] || 0) + 1;

    // Track escalation phrases
    if (ESCALATION_PHRASES.has(text)) {
        tracker.escalationCount++;
    }

    return text;
};

// =============================================================================
// TIMING — Chat System Master Plan §8: 0.8–4.5s variance
// =============================================================================
// Never fixed delay. Occasional instant or no reaction.
// =============================================================================

export const getChatDelay = (bot: BotIdentity): number => {
    // Base range: 800ms – 4500ms (per plan §8)
    const min = 800;
    const max = 4500;
    let delay = min + Math.random() * (max - min);

    // 5% chance of near-instant reaction (human impulse)
    if (Math.random() < 0.05) delay = 200 + Math.random() * 300;

    // Mood modifiers (keep from original system)
    if (bot.mood === 'tired' || bot.mood === 'distracted') delay *= 1.3;
    if (bot.mood === 'tilted') delay *= 0.7;
    if (bot.mood === 'overconfident') delay *= 0.6;

    return delay;
};

// =============================================================================
// 4. THE TIMING PHYSICS — For the "Opponent is typing..." illusion
// =============================================================================

export interface TypingPhysics {
    showBubbleDelayMs: number;     // Delay before showing "typing..." bubble
    firstBubbleDurationMs: number; // How long first bubble shows
    pauseMs: number;               // Gap (simulates deleting/hesitation)
    secondBubbleDurationMs: number; // Second typing bubble
    messageAppearDelayMs: number;  // Delay before chat message actually appears
}

/**
 * Generate realistic typing physics for a chat message.
 * This controls the "Opponent is typing..." → pause → "Opponent is typing..." → message flow.
 */
export const calculateTypingPhysics = (
    bot: BotIdentity,
    messageLength: number,
    showHesitation: boolean,
): TypingPhysics => {
    // Humans read before typing.
    const reactionTime = 800 + Math.random() * 1200;

    // Typing speed: faster for short messages, slower for long (fatigue/thinking)
    // ~5 characters per 'beat'
    // Typing speed: faster for short messages, slower for long (fatigue/thinking)
    // ~5 characters per 'beat'
    const complexityFactor = Math.max(1, messageLength / 20);
    const typingSpeed = bot.typingSpeedMs || 500;
    let baseTyping = (messageLength * typingSpeed) / 5 * complexityFactor;

    // Mood modifiers on typing speed
    if (bot.mood === 'tired') baseTyping *= 1.4; // 40% slower
    if (bot.mood === 'tilted') baseTyping *= 0.8; // 20% faster (angry typing)
    if (bot.mood === 'distracted') baseTyping *= 1.2; // 20% slower

    if (showHesitation) {
        return {
            showBubbleDelayMs: reactionTime,
            firstBubbleDurationMs: baseTyping * 0.4 + Math.random() * 500,
            pauseMs: 800 + Math.random() * 1500, // Re-thinking what to say
            secondBubbleDurationMs: baseTyping * 0.6 + Math.random() * 400,
            messageAppearDelayMs: 100 + Math.random() * 200,
        };
    }

    return {
        showBubbleDelayMs: reactionTime,
        firstBubbleDurationMs: baseTyping + Math.random() * 300,
        pauseMs: 0,
        secondBubbleDurationMs: 0,
        messageAppearDelayMs: 100 + Math.random() * 200,
    };
};

// =============================================================================
// 5. REMATCH DECISION — Bot "intelligence" on accepting/declining rematches
// =============================================================================

/**
 * Determine if the bot accepts or declines a rematch request from the player.
 */
export const botRematchDecision = (
    bot: BotIdentity,
    botWonMatch: boolean,
): { accepted: boolean; responseDelayMs: number } => {
    let acceptChance: number;

    switch (bot.archetype) {
        case 'rager':
            acceptChance = botWonMatch ? 0.7 : 0.9; // Ragers NEED the rematch (ego)
            break;
        case 'pleaser':
            acceptChance = 0.6; // Pleasers usually agree
            break;
        case 'sniper':
            acceptChance = botWonMatch ? 0.3 : 0.2; // Snipers move on
            break;
        case 'troll':
            acceptChance = 0.5; // Coin flip
            break;
        default:
            acceptChance = 0.5;
    }

    return {
        accepted: Math.random() < acceptChance,
        responseDelayMs: 1500 + Math.random() * 3000,
    };
};

/**
 * Determine if the bot proactively INITIATES a rematch request.
 */
export const botInitiatesRematch = (
    bot: BotIdentity,
    botWonMatch: boolean,
): { initiates: boolean; delayMs: number } => {
    let initiateChance: number;

    switch (bot.archetype) {
        case 'rager':
            // Ragers always want to run it back if they lost (80%), or gloat if won (30%)
            initiateChance = botWonMatch ? 0.3 : 0.8;
            break;
        case 'pleaser':
            // Pleasers want meaningful connections
            initiateChance = 0.4;
            break;
        case 'sniper':
            // Snipers are efficiency monsters - usually leave
            initiateChance = 0.05;
            break;
        case 'troll':
            // Trolls spam buttons
            initiateChance = 0.6;
            break;
        default:
            initiateChance = 0.3;
    }

    return {
        initiates: Math.random() < initiateChance,
        delayMs: 2000 + Math.random() * 3000, // Waits 2-5s
    };
};
