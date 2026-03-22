import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// =============================================================================
// BOT LOGIC - MIGRATED FROM lib/botRoster.ts
// =============================================================================

const archetypeBiases = (archetype: string) => {
    switch (archetype) {
        case 'rager':
            return {
                aggressionBias: 0.55 + Math.random() * 0.2,
                submissionBias: 0.05 + Math.random() * 0.1,
                tiltChance: 0.4,
                mercyChance: 0.05,
                baseResponseMs: 1200 + Math.random() * 800,
                typingSpeedMs: 400 + Math.random() * 300,
            };
        case 'pleaser':
            return {
                aggressionBias: 0.05 + Math.random() * 0.1,
                submissionBias: 0.5 + Math.random() * 0.25,
                tiltChance: 0.1,
                mercyChance: 0.6,
                baseResponseMs: 2500 + Math.random() * 1500,
                typingSpeedMs: 800 + Math.random() * 500,
            };
        case 'sniper':
            return {
                aggressionBias: 0.05 + Math.random() * 0.1,
                submissionBias: 0.05 + Math.random() * 0.1,
                tiltChance: 0.15,
                mercyChance: 0.1,
                baseResponseMs: 1800 + Math.random() * 1200,
                typingSpeedMs: 600 + Math.random() * 400,
            };
        case 'troll':
            return {
                aggressionBias: 0.25 + Math.random() * 0.2,
                submissionBias: 0.15 + Math.random() * 0.15,
                tiltChance: 0.3,
                mercyChance: 0.2,
                baseResponseMs: 1000 + Math.random() * 2000,
                typingSpeedMs: 300 + Math.random() * 600,
            };
        default:
            return {
                aggressionBias: 0.1,
                submissionBias: 0.1,
                tiltChance: 0.1,
                mercyChance: 0.1,
                baseResponseMs: 2000,
                typingSpeedMs: 500,
            };
    }
};

const RAW_BOTS = [
    // === RAGERS ===
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

    // === PLEASERS ===
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

    // === SNIPERS ===
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

    // === TROLLS ===
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

const rankFromTier = (tier: string) => {
    const suffixes = ['I', 'II', 'III'];
    return `${tier} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
};

// =============================================================================
// AVATAR TIER SYSTEM (§3 — Exposure-Controlled Distribution)
// =============================================================================
// Tier 1: 1.jpg, 2.jpg, 3.jpg (The Pawn, The Silhouette, The Shield)
// Tier 2: 4.jpg, 5.jpg, 6.jpg, 7.jpg (The Viper, The Flame, The Shattered Glass, The Fist)
// Tier 3: 8.jpg, 9.jpg, 10.jpg, 11.jpg (The Eye, The Grid, The Rook, The Radar)
// Tier 4: 12.jpg, 13.jpg, 14.jpg, 15.jpg (The Marble Mask, The Crown, The Void, The Chess King)

const AVATAR_TIERS: Record<number, string[]> = {
    1: ['/Profile image/1.jpg', '/Profile image/2.jpg', '/Profile image/3.jpg'],
    2: ['/Profile image/4.jpg', '/Profile image/5.jpg', '/Profile image/6.jpg', '/Profile image/7.jpg'],
    3: ['/Profile image/8.jpg', '/Profile image/9.jpg', '/Profile image/10.jpg', '/Profile image/11.jpg'],
    4: ['/Profile image/12.jpg', '/Profile image/13.jpg', '/Profile image/14.jpg', '/Profile image/15.jpg'],
};

// §3: Base Distribution Per Rank
const TIER_DISTRIBUTION: Record<string, number[]> = {
    'Bronze': [0.70, 0.25, 0.05, 0.00], // 70% T1, 25% T2, 5% T3, 0% T4
    'Silver': [0.40, 0.35, 0.20, 0.05], // 40% T1, 35% T2, 20% T3, 5% T4
    'Gold': [0.20, 0.30, 0.35, 0.15], // 20% T1, 30% T2, 35% T3, 15% T4
};

const pickAvatarForRank = (rankTier: string): { avatar: string; avatarTier: number } => {
    const dist = TIER_DISTRIBUTION[rankTier] || TIER_DISTRIBUTION['Bronze'];
    const roll = Math.random();
    let cumulative = 0;
    let selectedTier = 1;
    for (let i = 0; i < dist.length; i++) {
        cumulative += dist[i];
        if (roll < cumulative) {
            selectedTier = i + 1;
            break;
        }
    }
    const pool = AVATAR_TIERS[selectedTier];
    const avatar = pool[Math.floor(Math.random() * pool.length)];
    return { avatar, avatarTier: selectedTier };
};

// §9: Account Age Simulation
const generateAccountAge = (): { accountAgeDays: number; matchCount: number } => {
    const roll = Math.random();
    let ageDays: number;
    if (roll < 0.30) ageDays = 10 + Math.floor(Math.random() * 20);       // 10-30 days
    else if (roll < 0.70) ageDays = 30 + Math.floor(Math.random() * 90);   // 30-120 days
    else if (roll < 0.90) ageDays = 120 + Math.floor(Math.random() * 120); // 4-8 months
    else ageDays = 240 + Math.floor(Math.random() * 365);                  // 8mo-1.5yr+

    // Match count aligned with age (avg 2-5 matches/day with randomness)
    const avgMatchesPerDay = 1.5 + Math.random() * 3.5;
    const matchCount = Math.floor(ageDays * avgMatchesPerDay * (0.5 + Math.random() * 0.6));
    return { accountAgeDays: ageDays, matchCount };
};

// §2: Playstyle Tags (hidden system variable)
const PLAYSTYLE_TAGS = ['aggressive', 'defensive', 'adaptive', 'chaotic'];
const pickPlaystyleTag = (): string => {
    return PLAYSTYLE_TAGS[Math.floor(Math.random() * PLAYSTYLE_TAGS.length)];
};

// =============================================================================
// PERSISTENCE FUNCTIONS
// =============================================================================

export const seedBots = mutation({
    args: {},
    handler: async (ctx) => {
        // 1. Clear existing bots
        const existing = await ctx.db.query("bots").collect();
        for (const bot of existing) {
            await ctx.db.delete(bot._id);
        }

        // 2. Insert all bots with full Advanced Profile System
        const botsToInsert = RAW_BOTS.map((raw, index) => {
            const biases = archetypeBiases(raw.archetype);
            const { avatar, avatarTier } = pickAvatarForRank(raw.rankTier);
            const { accountAgeDays, matchCount } = generateAccountAge();

            // §7: Chat frequency (40/35/20/5 — NOT clustered by archetype)
            let frequency = 'occasional';
            const freqRand = Math.random();
            if (freqRand < 0.40) frequency = 'silent';
            else if (freqRand < 0.75) frequency = 'occasional';
            else if (freqRand < 0.95) frequency = 'active';
            else frequency = 'loud';

            return {
                botId: `bot_${String(index + 1).padStart(3, '0')}`,
                username: raw.username,
                avatar,
                avatarTier,
                rankTier: raw.rankTier,
                rank: rankFromTier(raw.rankTier),
                winRate: raw.winRate,
                points: Math.floor(raw.winRate * 20 + Math.random() * 500),
                bio: raw.bio,
                archetype: raw.archetype,
                chatFrequency: frequency,
                playstyleTag: pickPlaystyleTag(),
                accountAgeDays,
                matchCount,
                ...biases,
                isOnline: Math.random() > 0.5,
                lastActive: Date.now(),
            };
        });

        for (const bot of botsToInsert) {
            await ctx.db.insert("bots", bot);
        }

        return `Seeded ${botsToInsert.length} bots with Advanced Profile System.`;
    },
});

// =============================================================================
// §4: EXPOSURE CONTROL — Per-Player Avatar Tracking
// =============================================================================

export const recordBotExposure = mutation({
    args: {
        email: v.string(),
        botId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return;

        const existing = await ctx.db
            .query("botExposure")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        const now = Date.now();
        if (existing) {
            let encounteredBots = existing.encounteredBots || [];

            // Remove old entries (> 30 days) to prevent infinite data growth
            const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
            encounteredBots = encounteredBots.filter(b => now - b.timestamp < THIRTY_DAYS);

            const botIndex = encounteredBots.findIndex(b => b.botId === args.botId);
            if (botIndex >= 0) {
                encounteredBots[botIndex].timestamp = now; // update to newest encounter time
            } else {
                encounteredBots.push({ botId: args.botId, timestamp: now });
            }

            await ctx.db.patch(existing._id, {
                encounteredBots,
                lastUpdated: now,
            });
        } else {
            await ctx.db.insert("botExposure", {
                email: args.email,
                encounteredBots: [{ botId: args.botId, timestamp: now }],
                lastUpdated: now,
            });
        }
    },
});

export const getPlayerExposure = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("botExposure")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
    },
});

// =============================================================================
// STANDARD QUERIES
// =============================================================================

export const getBotsByTier = query({
    args: { tier: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("bots")
            .withIndex("by_rankTier", (q) => q.eq("rankTier", args.tier))
            .collect();
    },
});

export const getBotById = query({
    args: { botId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("bots")
            .withIndex("by_botId", (q) => q.eq("botId", args.botId))
            .first();
    },
});

export const getBotByUsername = query({
    args: { username: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("bots")
            .withIndex("by_username", (q) => q.eq("username", args.username))
            .first();
    },
});

// =============================================================================
// §11: ENTROPY SAFEGUARDS — Weekly Shuffle
// =============================================================================

export const entropyShuffleBots = mutation({
    args: {},
    handler: async (ctx) => {
        const allBots = await ctx.db.query("bots").collect();
        let shuffled = 0;

        for (const bot of allBots) {
            // Shuffle ~10% of bots
            if (Math.random() > 0.10) continue;
            shuffled++;

            const { avatar, avatarTier } = pickAvatarForRank(bot.rankTier);

            // Slightly modify winrate (±2 points)
            const winRateShift = (Math.random() - 0.5) * 4;
            const newWinRate = Math.max(20, Math.min(80, bot.winRate + winRateShift));

            // Occasionally switch playstyle tag (30% chance within shuffled set)
            const newPlaystyle = Math.random() < 0.30 ? pickPlaystyleTag() : (bot.playstyleTag || pickPlaystyleTag());

            // Increment match count naturally
            const matchInc = Math.floor(Math.random() * 15) + 3;

            await ctx.db.patch(bot._id, {
                avatar,
                avatarTier,
                winRate: Math.round(newWinRate * 10) / 10,
                playstyleTag: newPlaystyle,
                matchCount: (bot.matchCount || 0) + matchInc,
                accountAgeDays: (bot.accountAgeDays || 30) + 7, // Age grows by 1 week
            });
        }

        return `Entropy shuffle complete. ${shuffled}/${allBots.length} bots modified.`;
    },
});
