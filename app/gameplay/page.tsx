'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import './gameplay.css';

// Bot Simulant System
import { BotIdentity, getRandomBot, getBotChat, applyPersonalityDrift, assignBotMood } from '@/lib/botRoster';
import {
    BotState,
    createBotState,
    botMakeDecision,
    updateBotState,
    getEventChat,
    getChatDelay,
    resetChatTracker,
    botRematchDecision,
    botInitiatesRematch,
} from '@/lib/botEngine';

// Helper to format scenario text (Bold/Color Tactics, Style Labels)
const formatScenarioText = (text: string) => {
    let content = text;
    let label = null;

    if (text.startsWith("MISSION:")) {
        label = <span className="scenario-label">MISSION</span>;
        content = text.substring("MISSION:".length).trim();
    } else if (text.startsWith("GOAL:")) {
        label = <span className="scenario-label">GOAL</span>;
        content = text.substring("GOAL:".length).trim();
    }

    const parts = content.split('*');
    const enriched = parts.map((part, i) =>
        i % 2 === 1
            ? <span key={i} className="tactic-highlight">{part}</span>
            : part
    );

    return <>{label} {enriched}</>;
};

// Helper to render avatars as either text/emojis or standard images
const renderAvatar = (avatarValue: string | undefined, extraClasses = '') => {
    if (!avatarValue) return "👤";
    if (avatarValue.includes('/Profile image/')) {
        return <img src={avatarValue} alt="Avatar" className={`w-full h-full object-cover rounded-full ${extraClasses}`} />;
    }
    return avatarValue;
};

type GameState = 'dashboard' | 'lobby' | 'arena' | 'post-match';

interface Option {
    id: string;
    text: string;
    type: 'Fatal' | 'Weak' | 'Win';
    damage: number;
    feedback: string;
}

interface Round {
    round_num: number;
    mode: 'DEFENSE' | 'OFFENSE';
    scenario: string;
    options: Option[];
}

interface MatchData {
    rank_level: number;
    topic: string;
    rounds: Round[];
}

// Chat message type for the battle chat
interface ChatMessage {
    sender: 'bot' | 'system' | 'player';
    text: string;
    timestamp: number;
}

export default function GameplayPage() {
    // Auth Status
    const { isAuthenticated } = useConvexAuth();

    const router = useRouter();
    const [gameState, setGameState] = useState<GameState>('dashboard');
    const [scanProgress, setScanProgress] = useState(0);
    const [playerHealth, setPlayerHealth] = useState(100);
    const [opponentHealth, setOpponentHealth] = useState(100);

    // Simulant Bot State
    const [opponent, setOpponent] = useState<BotIdentity | null>(null);
    const [botState, setBotState] = useState<BotState | null>(null);

    // Chat system
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [botIsTyping, setBotIsTyping] = useState(false);
    const [chatMinimized, setChatMinimized] = useState(false);

    // Multi-round match state
    const [matchData, setMatchData] = useState<MatchData | null>(null);
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [roundResult, setRoundResult] = useState<'win' | 'loss' | null>(null);

    const [timeLeft, setTimeLeft] = useState(10);
    const [isVictory, setIsVictory] = useState(false);
    const [finalXpChange, setFinalXpChange] = useState<number | null>(null);
    const [screenShake, setScreenShake] = useState(false);
    const [playerGlow, setPlayerGlow] = useState(false);

    // Moved up to fix initialization error
    const [opponentThinking, setOpponentThinking] = useState(false);
    const [damageFlash, setDamageFlash] = useState<'player' | 'opponent' | null>(null);
    const [rematchRequested, setRematchRequested] = useState(false);
    const [rematchDeclined, setRematchDeclined] = useState(false);
    const [opponentRevealed, setOpponentRevealed] = useState(false);
    const [botStatus, setBotStatus] = useState<string | null>(null);

    // Proactive Bot Logic
    const botFriends = useQuery(api.friends.getBotFriends, isAuthenticated ? undefined : "skip");
    const [inviteNotification, setInviteNotification] = useState<{ name: string, botId: string } | null>(null);
    const [rematchModalOpen, setRematchModalOpen] = useState(false);

    // Dashboard Invite Logic
    useEffect(() => {
        if (gameState !== 'dashboard' || !botFriends || botFriends.length === 0) return;
        const interval = setInterval(() => {
            // 2% chance every 10s if friends exist
            if (Math.random() < 0.02) {
                const onlineBots = botFriends.filter((b: any) => b.status === 'online');
                if (onlineBots.length > 0) {
                    const bot = onlineBots[Math.floor(Math.random() * onlineBots.length)];
                    setInviteNotification({ name: bot.name, botId: bot.botId });

                    // Auto-clear after 8s
                    setTimeout(() => setInviteNotification(null), 8000);
                }
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [gameState, botFriends]);

    // Post-Match Rematch Logic
    useEffect(() => {
        if (gameState === 'post-match' && opponent && !rematchRequested && !rematchDeclined) {
            // Check if bot wants to rematch
            const { initiates, delayMs } = botInitiatesRematch(opponent, !isVictory);

            console.log('[GAMBIT] Bot Rematch:', initiates, delayMs);

            if (initiates) {
                const timer = setTimeout(() => {
                    setRematchModalOpen(true);
                }, delayMs);
                return () => clearTimeout(timer);
            } else {
                const timer = setTimeout(() => {
                    setBotStatus("Opponent has left.");
                }, delayMs + 2000);
                return () => clearTimeout(timer);
            }
        }
    }, [gameState, opponent, isVictory, rematchRequested, rematchDeclined]);

    const handleAcceptInvite = async (botId: string) => {
        setInviteNotification(null);
        if (botFriends) {
            const bot = botFriends.find((b: any) => b.botId === botId);
            if (bot) {
                const identity = { ...bot, id: bot.botId } as unknown as BotIdentity;
                setOpponent(identity);
                setBotState(createBotState(identity));
                setGameState('lobby');
                setScanProgress(0);
            }
        }
    };

    const handleAcceptRematch = () => {
        setRematchModalOpen(false);
        setRematchRequested(true);
        setTimeout(() => {
            // Reset for new match with SAME opponent
            setGameState('lobby');
            setScanProgress(0); // Triggers scan -> loadMatch
            setPlayerHealth(100);
            setOpponentHealth(100);
            setMatchData(null);
            setCurrentRoundIndex(0);
            setFeedbackMessage(null);
            setBotChoiceIndex(null);
            setOpponentRevealed(false);
            setRematchRequested(false);
            setRematchDeclined(false);
            setChatMessages([]);
            setBotIsTyping(false);
            setBotLockedIn(false);
            setPlayerLockedIn(false);
            setPlayerChoice(null);
            setSelectedOptionId(null);
            setSyncPhase(false);
        }, 1000);
    };


    // Live Reveal Protocol — Parallel Play state
    const [botLockedIn, setBotLockedIn] = useState(false);
    const [playerLockedIn, setPlayerLockedIn] = useState(false);
    const [playerChoice, setPlayerChoice] = useState<Option | null>(null);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [syncPhase, setSyncPhase] = useState(false);

    // Speed Damage — PvP Race tracking
    const [roundStartTime, setRoundStartTime] = useState<number>(0);
    const [playerAnswerTime, setPlayerAnswerTime] = useState<number | null>(null); // seconds
    const [botAnswerTime, setBotAnswerTime] = useState<number | null>(null); // seconds

    // Player stats from DB
    const userStats = useQuery(api.gamification.getUserStats, isAuthenticated ? undefined : "skip");

    // Default fallback to prevent UI breaking
    const playerStats = {
        trophies: userStats?.xp ?? 0,
        wins: userStats?.wins ?? 0,
        streak: userStats?.streak ?? 0,
        rank: 'Gold II',
        avatar: '/Profile image/1.jpg',
    };

    // Fetch bots from DB for matchmaking
    const botPool = useQuery(api.bots.getBotsByTier, { tier: 'Gold' });
    const finishGameMutation = useMutation(api.games.finishGame);

    // §4: Exposure Control — Track which avatars player has seen
    const playerEmail = userStats ? 'current_player' : null; // Placeholder for actual email
    const playerExposure = useQuery(
        api.bots.getPlayerExposure,
        playerEmail ? { email: playerEmail } : 'skip'
    );
    const recordExposureMutation = useMutation(api.bots.recordBotExposure);

    // =========================================================================
    // CHAT SYSTEM — Add messages with "typing..." illusion
    // =========================================================================

    const addBotChat = useCallback((message: string, delayMs: number = 0, showTyping: boolean = true) => {
        if (!message) return;

        if (showTyping) {
            // Show "typing..." bubble first
            setTimeout(() => {
                setBotIsTyping(true);
            }, delayMs);

            // Then show the actual message after typing duration
            const typingDuration = 600 + Math.random() * 1200;
            setTimeout(() => {
                setBotIsTyping(false);
                setChatMessages(prev => [...prev, {
                    sender: 'bot',
                    text: message,
                    timestamp: Date.now(),
                }]);
            }, delayMs + typingDuration);
        } else {
            setTimeout(() => {
                setChatMessages(prev => [...prev, {
                    sender: 'bot',
                    text: message,
                    timestamp: Date.now(),
                }]);
            }, delayMs);
        }
    }, []);



    // QUICK CHAT SYSTEM
    const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
    const [playerBubble, setPlayerBubble] = useState<string | null>(null);
    const [opponentBubble, setOpponentBubble] = useState<string | null>(null);

    const quickChatOptions = [
        "nice", "close", "my bad", "unlucky", "good try", "??", "bruh", "what", "ok", "gg"
    ];

    const handleQuickChat = (text: string) => {
        setIsChatMenuOpen(false);
        setPlayerBubble(text);
        setTimeout(() => setPlayerBubble(null), 3000);

        setChatMessages(prev => [...prev, { sender: 'player', text, timestamp: Date.now() }]);

        // Bot Reply — uses 'player_chat' event with archetype-driven chance
        // Ragers clap back. Trolls always have something to say. Snipers ignore you.
        const replyChance: Record<string, number> = {
            rager: 0.40, pleaser: 0.30, sniper: 0.06, troll: 0.45
        };
        if (opponent && Math.random() < (replyChance[opponent.archetype] ?? 0.1)) {
            // Realistic delay: Use mood-aware delay + thinking time
            const replyDelay = getChatDelay(opponent) + 1500;
            setTimeout(() => {
                const reply = getEventChat(opponent, 'player_chat') || getBotChat(opponent, 'player_chat');
                setOpponentBubble(reply);
                setTimeout(() => setOpponentBubble(null), 3500);

                setChatMessages(prev => [...prev, { sender: 'bot', text: reply, timestamp: Date.now() }]);
            }, replyDelay);
        }
    };

    // =========================================================================
    // MATCH LOADING
    // =========================================================================

    const loadMatch = async () => {
        console.log('[GAMBIT] loadMatch() called');
        try {
            const response = await fetch('/api/generate-match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: 'General Conflict' }),
            });

            console.log('[GAMBIT] API response status:', response.status);

            if (!response.ok) {
                const errText = await response.text();
                console.error('[GAMBIT] API error body:', errText);
                throw new Error('Failed to fetch match');
            }

            const data = await response.json();
            console.log('[GAMBIT] API returned data:', JSON.stringify(data, null, 2));
            console.log('[GAMBIT] Rounds count:', data?.rounds?.length);

            if (data._using_fallback) {
                console.warn('[GAMBIT] ⚠️ NVIDIA API FAILED! Server returned fallback data.');
                console.error('[GAMBIT] ❌ ERROR:', data._debug_error);
            } else {
                console.log('[GAMBIT] ✅ AI generated fresh data successfully!');
            }

            setMatchData(data as MatchData);
            setCurrentRoundIndex(0);
            setFeedbackMessage(null);
            setTimeLeft(10);
            console.log('[GAMBIT] matchData SET successfully');
        } catch (error) {
            console.error('[GAMBIT] loadMatch FAILED:', error);
            const localFallback: MatchData = {
                rank_level: 1,
                topic: 'Offline Mode',
                rounds: [
                    {
                        round_num: 1,
                        mode: 'DEFENSE',
                        scenario: "Boss screams: 'This is garbage!'",
                        options: [
                            { id: 'a', text: "Your face is garbage!", type: 'Fatal', damage: -40, feedback: 'You lost your composure.' },
                            { id: 'b', text: "I'm so sorry, please...", type: 'Weak', damage: -20, feedback: 'You crumbled under pressure.' },
                            { id: 'c', text: 'Be specific.', type: 'Win', damage: 0, feedback: 'Redirected to facts. Frame held.' },
                        ],
                    },
                    {
                        round_num: 2,
                        mode: 'OFFENSE',
                        scenario: 'Student ignores your instruction.',
                        options: [
                            { id: 'a', text: "You're an idiot!", type: 'Fatal', damage: -40, feedback: 'Emotional outburst. Lost authority.' },
                            { id: 'b', text: 'Please listen to me...', type: 'Weak', damage: -20, feedback: 'Begging shows weakness.' },
                            { id: 'c', text: 'Sit down. Now.', type: 'Win', damage: 0, feedback: 'Direct command. Authority maintained.' },
                        ],
                    },
                    {
                        round_num: 3,
                        mode: 'DEFENSE',
                        scenario: "Coworker snaps: 'You always mess things up!'",
                        options: [
                            { id: 'a', text: "At least I'm not you!", type: 'Fatal', damage: -40, feedback: 'Counter-attack reveals insecurity.' },
                            { id: 'b', text: "You're right, I'm terrible...", type: 'Weak', damage: -20, feedback: 'Self-destruction under fire.' },
                            { id: 'c', text: 'Give me an example.', type: 'Win', damage: 0, feedback: 'Demanded specifics. Frame held.' },
                        ],
                    },
                    {
                        round_num: 4,
                        mode: 'OFFENSE',
                        scenario: 'Team member refuses to follow the process.',
                        options: [
                            { id: 'a', text: "Follow it or you're fired!", type: 'Fatal', damage: -40, feedback: 'Threats destroy trust.' },
                            { id: 'b', text: 'Could you maybe try?', type: 'Weak', damage: -20, feedback: 'Unsure leaders get ignored.' },
                            { id: 'c', text: 'Follow the process. Now.', type: 'Win', damage: 0, feedback: 'Clear, firm, no emotion.' },
                        ],
                    },
                    {
                        round_num: 5,
                        mode: 'DEFENSE',
                        scenario: "Parent yells: 'You never listen to me!'",
                        options: [
                            { id: 'a', text: "You never listen either!", type: 'Fatal', damage: -40, feedback: 'Mirror aggression = double loss.' },
                            { id: 'b', text: "I'm sorry, you're right...", type: 'Weak', damage: -20, feedback: 'Automatic apology = surrender.' },
                            { id: 'c', text: "I hear you. Lower your voice.", type: 'Win', damage: 0, feedback: 'Acknowledged + boundary. Perfect.' },
                        ],
                    },
                ],
            };
            console.log('[GAMBIT] Using LOCAL FALLBACK data (5 rounds)');
            setMatchData(localFallback);
            setCurrentRoundIndex(0);
            setFeedbackMessage(null);
            setTimeLeft(10);
        }
    };

    // =========================================================================
    // LOBBY LOGIC
    // =========================================================================

    const matchLoadedRef = useRef(false);

    useEffect(() => {
        if (gameState === 'lobby') {
            matchLoadedRef.current = false;
            setScanProgress(0);

            console.log('[GAMBIT] Lobby entered, starting scan...');
            const scanInterval = setInterval(() => {
                setScanProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(scanInterval);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 30);
            return () => clearInterval(scanInterval);
        }
    }, [gameState]);

    // Trigger Match Load when Scan Complete
    useEffect(() => {
        if (scanProgress >= 100 && gameState === 'lobby' && !matchLoadedRef.current) {
            console.log('[GAMBIT] Scan complete (100%)');
            matchLoadedRef.current = true;

            setTimeout(() => {
                // SIMULANT: Pick a persistent bot from DB (fallback to local if loading/empty)
                // §4: Exposure-aware bot selection
                const getDbBot = () => {
                    let isRepeatEncounter = false;
                    let selectedRawBot: BotIdentity;

                    if (botPool && botPool.length > 0) {
                        let candidates = botPool.map(b => ({ ...b, id: b.botId } as unknown as BotIdentity));

                        // §4: Filter by player exposure history (Rule 3)
                        if (playerExposure) {
                            const encounteredBots = playerExposure.encounteredBots || [];
                            const now = Date.now();
                            const COOLDOWN_48H = 48 * 60 * 60 * 1000;

                            // Bots encountered in the last 48 hours are on cooldown
                            const botsOnCooldown = new Set(
                                encounteredBots
                                    .filter((b: any) => now - b.timestamp < COOLDOWN_48H)
                                    .map((b: any) => b.botId)
                            );

                            candidates = candidates.filter(bot => !botsOnCooldown.has(bot.id));

                            if (candidates.length === 0) {
                                // Fallback if all bots are on cooldown (very active player)
                                candidates = botPool.map(b => ({ ...b, id: b.botId } as unknown as BotIdentity));
                            }

                            selectedRawBot = candidates[Math.floor(Math.random() * candidates.length)];

                            // Check if they have EVER fought this bot before
                            const hasFoughtBefore = encounteredBots.some((b: any) => b.botId === selectedRawBot.id);
                            if (hasFoughtBefore) {
                                isRepeatEncounter = true;
                            }
                        } else {
                            selectedRawBot = candidates[Math.floor(Math.random() * candidates.length)];
                        }
                    } else {
                        selectedRawBot = getRandomBot();
                    }

                    return { bot: selectedRawBot, isRepeatEncounter };
                };

                let rawBot: BotIdentity;
                let isRepeatEncounter = false;

                if (opponent) {
                    rawBot = opponent;
                    // Rematches use same identity without triggering "repeat encounter" surprise
                    isRepeatEncounter = false;
                } else {
                    const dbBotResult = getDbBot();
                    rawBot = dbBotResult.bot;
                    isRepeatEncounter = dbBotResult.isRepeatEncounter;
                }

                const selectedBot = opponent ? opponent : assignBotMood(applyPersonalityDrift(rawBot));
                if (isRepeatEncounter) {
                    selectedBot.isRepeatEncounter = true; // Rule 4 toggle
                }

                console.log('[GAMBIT] Simulant selected:', selectedBot.username, `(${selectedBot.archetype}), Mood: ${selectedBot.mood}`);
                setOpponent(selectedBot);
                setBotState(createBotState(selectedBot));
                resetChatTracker(selectedBot.id); // Reset per-match chat limits

                // Track exposure to enforce Rule 3 (48h cooldown)
                if (playerEmail) {
                    recordExposureMutation({
                        email: playerEmail,
                        botId: selectedBot.id,
                    }).catch(console.error);
                }

                setChatMessages([]);

                console.log('[GAMBIT] Calling loadMatch()...');
                loadMatch();

                setTimeout(() => setOpponentRevealed(true), 100);
            }, 800);

            setTimeout(() => {
                console.log('[GAMBIT] Transitioning to arena state');
                setGameState('arena');
            }, 3500);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scanProgress, gameState]);

    // =========================================================================
    // BOT MATCH START CHAT — Fires when entering the arena
    // =========================================================================

    useEffect(() => {
        if (gameState === 'arena' && opponent && botState) {
            // Rule 4: Repeat encounter greeting interception
            let startChat = null;
            if (opponent.isRepeatEncounter) {
                // Rule 4 guarantees the bot will send the repeat encounter message
                startChat = getEventChat(opponent, 'on_repeat_encounter');
            } else {
                startChat = getEventChat(opponent, 'match_start');
            }

            if (startChat) {
                addBotChat(startChat, getChatDelay(opponent));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState]);

    // =========================================================================
    // TIMER LOGIC — Stops once the player locks in
    // =========================================================================

    useEffect(() => {
        if (gameState === 'arena' && timeLeft > 0 && !feedbackMessage && matchData && (!playerLockedIn || !botLockedIn)) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 0.1);
            }, 100);
            return () => clearInterval(timer);
        } else if (timeLeft <= 0 && gameState === 'arena' && !feedbackMessage && matchData && (!playerLockedIn || !botLockedIn)) {
            handleTimeOut();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState, timeLeft, feedbackMessage, matchData, playerLockedIn, botLockedIn]);

    // =========================================================================
    // OPPONENT "THINKING" — Bot picks its answer, then LOCKS IN visually
    // =========================================================================

    const [botChoiceIndex, setBotChoiceIndex] = useState<number | null>(null);

    useEffect(() => {
        if (gameState === 'arena' && matchData && !feedbackMessage && opponent && botState && !playerLockedIn) {
            const currentRound = matchData.rounds[currentRoundIndex];
            if (!currentRound) return;

            // Bot DECIDES which option to pick (based on personality + tilt)
            const wordCount = currentRound.scenario.split(' ').length;
            const decision = botMakeDecision(botState, currentRound.options, wordCount);

            // Store the bot's actual pick (hidden from player)
            setBotChoiceIndex(decision.chosenOptionIndex);
            setOpponentThinking(true);
            setBotLockedIn(false);

            // Round starts NOW — record the timestamp for speed tracking
            const startTime = Date.now();
            setRoundStartTime(startTime);

            // Bot's answer time (in seconds) = its thinking time
            const botTime = Math.min(decision.thinkingTimeMs, 8000) / 1000;
            setBotAnswerTime(botTime);

            // Bot "finishes thinking" → LOCKS IN (shows ✓ READY)
            const timer = setTimeout(() => {
                setOpponentThinking(false);
                setBotLockedIn(true);
            }, Math.min(decision.thinkingTimeMs, 8000));

            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRoundIndex, gameState, matchData, feedbackMessage]);

    // =========================================================================
    // THE TRIGGER — When BOTH players have locked in, start the reveal
    // =========================================================================

    useEffect(() => {
        if (playerLockedIn && botLockedIn && gameState === 'arena' && !syncPhase && !feedbackMessage) {
            // Both locked in → Start "Server Sync" phase
            setSyncPhase(true);

            // Network illusion delay (0.6 - 1.0s) before the slam reveal
            const syncDelay = 600 + Math.random() * 400;
            setTimeout(() => {
                resolveRound();
            }, syncDelay);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerLockedIn, botLockedIn, gameState, syncPhase, feedbackMessage]);

    // =========================================================================
    // GAME ACTIONS — Both player and bot independently answer the same question
    // =========================================================================
    //
    // HOW IT WORKS:
    // - Each round, BOTH you and the bot pick an option independently
    // - Your HP changes based on YOUR pick quality
    // - Bot's HP changes based on ITS pick quality
    // - Win = correct answer = 0 damage to yourself
    // - Weak = bad answer = -20 damage to yourself
    // - Fatal = worst answer = -40 damage to yourself
    // - First to 0 HP loses
    //
    // WHY BOTS ARE DIFFERENT:
    // - Ragers pick Fatal 55-75% → they take 40 damage most rounds → easy
    // - Snipers pick Win 70-85% → they rarely take damage → hard
    // - Pleasers pick Weak 60-70% → they take 20 damage often → medium
    // - Trolls pick randomly → unpredictable
    // =========================================================================

    // Accuracy classification
    const isCorrect = (type: string | undefined): boolean => type === 'Win';

    // --- PLAYER ACTIONS (No instant resolve — just lock in + record time) ---

    const handleTimeOut = () => {
        if (!playerLockedIn) {
            setPlayerChoice(null);
            setPlayerLockedIn(true);
            setPlayerAnswerTime(10); // Max time = 10s
        }
        if (!botLockedIn) {
            setBotLockedIn(true);
            setOpponentThinking(false);
        }
    };

    const handleAnswer = (option: Option) => {
        if (playerLockedIn) return;
        setPlayerChoice(option);
        setPlayerLockedIn(true);
        setSelectedOptionId(option.id);
        // Record how fast the player answered (in seconds)
        const elapsed = (Date.now() - roundStartTime) / 1000;
        setPlayerAnswerTime(Math.round(elapsed * 10) / 10); // 1 decimal
    };

    /**
     * THE SHOWDOWN — Accuracy-First, Then Speed War
     *
     * Case A: One correct, one wrong → Correct player deals 30 base damage
     * Case B: Both wrong → Both take self-damage
     * Case C: Both correct → Speed war! Slower player takes bonus damage
     */
    const resolveRound = () => {
        if (!matchData || !opponent || !botState) return;

        const currentRound = matchData.rounds[currentRoundIndex];
        if (!currentRound) return;

        // Get both picks
        const botIdx = botChoiceIndex ?? 0;
        const botOption = currentRound.options[botIdx];

        const playerCorrect = playerChoice ? isCorrect(playerChoice.type) : false;
        const botCorrect = isCorrect(botOption.type);

        const pTime = playerAnswerTime ?? 10;
        const bTime = botAnswerTime ?? 5;

        let playerDmg = 0;
        let botDmg = 0;
        let resultType: 'win' | 'loss' | null = null;
        let speedNote = '';

        if (playerCorrect && !botCorrect) {
            // === CASE A: Player correct, Bot wrong ===
            botDmg = 30;
            resultType = 'win';

        } else if (!playerCorrect && botCorrect) {
            // === CASE A (reversed): Bot correct, Player wrong ===
            playerDmg = 30;
            resultType = 'loss';

        } else if (!playerCorrect && !botCorrect) {
            // === CASE B: Both wrong → self-damage ===
            playerDmg = playerChoice ? (playerChoice.type === 'Fatal' ? 40 : 20) : 40;
            botDmg = botOption.type === 'Fatal' ? 40 : 20;
            resultType = playerDmg < botDmg ? 'win' : botDmg < playerDmg ? 'loss' : null;

        } else {
            // === CASE C: Both correct → SPEED WAR ===
            const gap = Math.abs(pTime - bTime);
            const bonusDmg = Math.min(Math.floor(gap * 5), 20);

            if (bonusDmg === 0) {
                // Near-tie — clash
                speedNote = `⚡ Clash! Both answered in ~${pTime.toFixed(1)}s — No damage.`;
                resultType = null;
            } else if (pTime < bTime) {
                // Player was faster!
                botDmg = bonusDmg;
                speedNote = `⚡ Faster Draw! You: ${pTime.toFixed(1)}s vs ${opponent.username}: ${bTime.toFixed(1)}s (+${bonusDmg} dmg)`;
                resultType = 'win';
            } else {
                // Bot was faster
                playerDmg = bonusDmg;
                speedNote = `⚡ Too Slow! ${opponent.username}: ${bTime.toFixed(1)}s vs You: ${pTime.toFixed(1)}s (+${bonusDmg} dmg)`;
                resultType = 'loss';
            }
        }

        // === PHASE 1: THE HIT (instant) ===
        setPlayerHealth((prev) => Math.max(0, prev - playerDmg));
        setOpponentHealth((prev) => Math.max(0, prev - botDmg));

        if (resultType === 'win') {
            setRoundResult('win');
            setDamageFlash('opponent');
            setPlayerGlow(true);
        } else if (resultType === 'loss') {
            setRoundResult('loss');
            setDamageFlash('player');
            setScreenShake(true);
        } else {
            setRoundResult(null);
            if (playerDmg > 0) setDamageFlash('player');
        }

        setTimeout(() => {
            setDamageFlash(null);
            setPlayerGlow(false);
            setScreenShake(false);
        }, 600);

        // === PHASE 2: THE FEEDBACK (delayed 700ms) ===
        const botPickLabel = botCorrect ? '✅ Correct' : botOption.type === 'Weak' ? '⚠️ Weak' : '💀 Fatal';
        const playerPickLabel = playerChoice ? (playerCorrect ? '✅ Correct' : playerChoice.type === 'Weak' ? '⚠️ Weak' : '💀 Fatal') : '⏰ Timeout';

        setTimeout(() => {
            setSyncPhase(false);

            // Build multi-line feedback
            const lines: string[] = [];

            // Line 1: Player's feedback text
            if (playerChoice) {
                lines.push(playerChoice.feedback);
            } else {
                lines.push('Time ran out! You froze.');
            }

            // Line 2: Speed note (only for Case C)
            if (speedNote) {
                lines.push(speedNote);
            }

            // Line 3: Damage summary
            if (playerDmg > 0 && botDmg > 0) {
                lines.push(`You took ${playerDmg} damage. ${opponent.username} took ${botDmg} damage.`);
            } else if (playerDmg > 0) {
                lines.push(`You took ${playerDmg} damage.`);
            } else if (botDmg > 0) {
                lines.push(`${opponent.username} took ${botDmg} damage!`);
            }

            // Line 4: Bot's pick
            lines.push(`🤖 ${opponent.username} picked: "${botOption.text}" (${botPickLabel})`);

            setFeedbackMessage(lines.join('\n'));

            // Bot chat + emotional state
            if (resultType === 'win') {
                const lossChat = getEventChat(opponent, 'round_loss');
                if (lossChat) addBotChat(lossChat, getChatDelay(opponent));
                setBotState(prev => prev ? updateBotState(prev, false) : prev);
            } else if (resultType === 'loss') {
                const winChat = getEventChat(opponent, 'round_win');
                if (winChat) addBotChat(winChat, getChatDelay(opponent));
                setBotState(prev => prev ? updateBotState(prev, true) : prev);
            }
        }, 700);

        // === PHASE 3: KO CHECK / NEXT ROUND ===
        const newPlayerHP = playerHealth - playerDmg;
        const newBotHP = opponentHealth - botDmg;

        if (newPlayerHP <= 0 && newBotHP <= 0) {
            setTimeout(() => endGame(false), 3200);
        } else if (newPlayerHP <= 0) {
            setTimeout(() => endGame(false), 3200);
        } else if (newBotHP <= 0) {
            setTimeout(() => endGame(true), 3200);
        } else {
            setTimeout(() => nextRound(), 3200);
        }
    };

    const nextRound = () => {
        if (!matchData) return;

        if (currentRoundIndex < matchData.rounds.length - 1) {
            setCurrentRoundIndex(prev => prev + 1);
            setFeedbackMessage(null);
            setRoundResult(null);
            setBotChoiceIndex(null);
            setTimeLeft(10);
            // Reset Live Reveal Protocol state
            setBotLockedIn(false);
            setPlayerLockedIn(false);
            setPlayerChoice(null);
            setSelectedOptionId(null);
            setSyncPhase(false);
            // Reset speed tracking
            setPlayerAnswerTime(null);
            setBotAnswerTime(null);
        } else {
            // All rounds finished — whoever has more HP wins
            endGame(playerHealth >= opponentHealth);
        }
    };

    const endGame = (victory: boolean) => {
        setIsVictory(victory);
        setGameState('post-match');

        // Call Backend to record result (XP/Points)
        if (opponent && opponent.id) {
            finishGameMutation({
                result: victory ? 'win' : 'loss',
                opponentBotId: opponent.id,
                playerScore: playerHealth,
                opponentScore: opponentHealth,
            })
                .then(res => setFinalXpChange(res.xpChange))
                .catch(err => console.error("Failed to save game result:", err));
        }

        // Bot end-of-match chat (archetype decides probability)
        if (opponent && botState) {
            const trigger = victory ? 'match_end_loss' : 'match_end_win';
            const endChat = getEventChat(opponent, trigger);
            if (endChat) {
                addBotChat(endChat, getChatDelay(opponent));
            }
        }
    };

    const handleFindMatch = () => {
        setGameState('lobby');
        setScanProgress(0);
        setPlayerHealth(100);
        setOpponentHealth(100);
        setMatchData(null);
        setCurrentRoundIndex(0);
        setFeedbackMessage(null);
        setOpponent(null);
        setBotState(null);
        setBotChoiceIndex(null);
        setOpponentRevealed(false);
        setRematchRequested(false);
        setRematchDeclined(false);
        setChatMessages([]);
        setBotIsTyping(false);
        // Reset Live Reveal Protocol
        setBotLockedIn(false);
        setPlayerLockedIn(false);
        setPlayerChoice(null);
        setSelectedOptionId(null);
        setSyncPhase(false);
        // Reset speed tracking
        setPlayerAnswerTime(null);
        setBotAnswerTime(null);
    };

    const handleBackToDashboard = () => {
        setGameState('dashboard');
        setOpponent(null);
        setMatchData(null);
        setChatMessages([]);
    };

    const handleRequestRematch = () => {
        if (!opponent || !botState) return;

        setRematchRequested(true);

        // Bot decides using personality-driven logic
        const decision = botRematchDecision(opponent, !isVictory);

        setTimeout(() => {
            if (decision.accepted) {
                // Bot accepted — start new match with SAME opponent
                // Reset game state but KEEP opponent/botState for now
                setGameState('lobby');
                setScanProgress(0); // Triggers scan → loadMatch
                setPlayerHealth(100);
                setOpponentHealth(100);
                setMatchData(null);
                setCurrentRoundIndex(0);
                setFeedbackMessage(null);
                setBotChoiceIndex(null);
                setOpponentRevealed(false);
                setRematchRequested(false);
                setRematchDeclined(false);
                setChatMessages([]);
                setBotIsTyping(false);
                // Reset live reveal
                setBotLockedIn(false);
                setPlayerLockedIn(false);
                setPlayerChoice(null);
                setSelectedOptionId(null);
                setSyncPhase(false);
                setPlayerAnswerTime(null);
                setBotAnswerTime(null);
            } else {
                setRematchDeclined(true);
                setRematchRequested(false);

                // Bot declines with chat
                const declineMessages: Record<string, string> = {
                    rager: "nah. i'm done.",
                    pleaser: "sorry, gotta go! gg though ☺️",
                    sniper: "no.",
                    troll: "lmaooo nah bye 🤡",
                };
                addBotChat(declineMessages[opponent.archetype], 0, true);
            }
        }, decision.responseDelayMs);
    };

    // Helper to get current round
    const currentRound = matchData?.rounds?.[currentRoundIndex];

    // Debug: Log render state
    useEffect(() => {
        console.log('[GAMBIT] Render state:', {
            gameState,
            hasMatchData: !!matchData,
            roundsCount: matchData?.rounds?.length,
            currentRoundIndex,
            currentRound: currentRound ? `Round ${currentRound.round_num} (${currentRound.mode})` : 'null',
            hasOpponent: !!opponent,
            botArchetype: opponent?.archetype,
            botTilted: botState?.isTilted,
            botConfident: botState?.isConfident,
            playerHealth,
            opponentHealth,
        });
    }, [gameState, matchData, currentRoundIndex, opponent, botState, playerHealth, opponentHealth, currentRound]);

    return (
        <div className="gameplay-container" suppressHydrationWarning>
            {/* DASHBOARD */}
            {gameState === 'dashboard' && (
                <div className="dashboard">
                    {/* Bot Invite Notification */}
                    {inviteNotification && (
                        <div className="absolute top-20 right-4 bg-[#1F2937] border border-green-500/50 p-4 rounded-xl shadow-2xl z-50 flex items-center gap-4 animate-slide-in">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-xl">
                                    🤖
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-gray-800"></div>
                            </div>
                            <div>
                                <p className="font-bold text-white text-sm">{inviteNotification.name}</p>
                                <p className="text-xs text-green-400">Invited you to a match!</p>
                            </div>
                            <div className="flex gap-2 ml-2">
                                <button
                                    onClick={() => handleAcceptInvite(inviteNotification.botId)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition-colors"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => setInviteNotification(null)}
                                    className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-lg text-xs transition-colors"
                                >
                                    Ignore
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="dashboard-header">
                        <div className="stat-card">
                            <div className="stat-icon">🏆</div>
                            <div className="stat-info">
                                <span className="stat-label">Trophies</span>
                                <span className="stat-value">{playerStats.trophies}</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">⚔️</div>
                            <div className="stat-info">
                                <span className="stat-label">Wins</span>
                                <span className="stat-value">{playerStats.wins}</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className={`stat-icon ${playerStats.streak > 3 ? 'flame-flicker' : ''}`}>🔥</div>
                            <div className="stat-info">
                                <span className="stat-label">Streak</span>
                                <span className="stat-value">{playerStats.streak}</span>
                            </div>
                        </div>
                    </div>

                    <div className="arena-preview">
                        <div className="arena-banner">
                            <h2>Rank 1: Bronze</h2>
                            <p className="arena-subtitle">Basic Training: Defense &amp; Offense</p>
                        </div>
                        <div className="arena-stage">
                            <div className="stage-glow"></div>
                            <div className="stage-platform">
                                <div className="platform-icon">🛡️</div>
                                <div className="vs-badge">VS</div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-actions">
                        <button className="primary-btn battle-btn pulse-btn" onClick={handleFindMatch}>
                            <span className="btn-icon">⚔️</span>
                            <span className="btn-text">Start Drill</span>
                        </button>
                        <button className="secondary-btn practice-btn" onClick={() => router.push('/dark-psychology')}>
                            <span className="btn-icon">📚</span>
                            <span className="btn-text">Theory</span>
                        </button>
                    </div>

                    {/* Bottom navigation */}
                    <div className="bottom-nav">
                        <button className="nav-item active">
                            <div className="nav-icon">⚔️</div>
                            <span>Battle</span>
                        </button>
                        <button className="nav-item" onClick={() => router.push('/leagues')}>
                            <div className="nav-icon">🏆</div>
                            <span>Leagues</span>
                        </button>
                        <button className="nav-item" onClick={() => router.push('/shop')}>
                            <div className="nav-icon">🛒</div>
                            <span>Shop</span>
                        </button>
                        <button className="nav-item" onClick={() => router.push('/profile')}>
                            <div className="nav-icon">👤</div>
                            <span>Profile</span>
                        </button>
                    </div>
                </div>
            )}

            {/* LOBBY */}
            {gameState === 'lobby' && (
                <div className="lobby">
                    <div className="logo">
                        <div className="spark-wrapper">
                            <div className="bubble attack">⚡</div>
                            <div className="bubble defense">🛡️</div>
                        </div>
                        <h1>GAMBIT</h1>
                    </div>
                    <div className="lobby-center-fixed">
                        {(!opponent || scanProgress < 100) ? (
                            <>
                                <div className="radar-container">
                                    <div className="radar-pulse" style={{ width: `${scanProgress}%`, height: `${scanProgress}%` }}></div>
                                    <div className="radar-center"></div>
                                </div>
                                <div className="scan-text">
                                    {scanProgress < 30 && <p>Connecting to Drill Sergeant...</p>}
                                    {scanProgress >= 30 && scanProgress < 70 && <p className="blink">Training Protocol Found.</p>}
                                    {scanProgress >= 70 && scanProgress < 100 && <p className="success">Opponent Locked.</p>}
                                </div>
                            </>
                        ) : (
                            <div className={`opponent-card-reveal ${opponentRevealed ? 'slam-in' : ''}`}>
                                <div
                                    className="avatar-huge cursor-pointer transition-transform hover:scale-110 p-0 overflow-hidden"
                                    onClick={() => router.push(`/profile/${opponent.id}?type=bot`)}
                                >
                                    {renderAvatar(opponent.avatar)}
                                </div>
                                <h2>{opponent.username}</h2>
                                <div className="bot-bio">{opponent.bio}</div>
                                <div className="stats-reveal">
                                    <span className="rank-large">Rank: {opponent.rank}</span>
                                    <span className="win-rate-large">Win Rate: {opponent.winRate}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ARENA */}
            {gameState === 'arena' && (
                <>
                    {(!matchData) ? (
                        <div className="arena-loading">
                            <div className="loading-spinner"></div>
                            <p>Downloading Drill Scenarios...</p>
                        </div>
                    ) : (
                        currentRound && opponent && (
                            <div className={`arena ${screenShake ? 'shake' : ''}`}>
                                {/* Feedback Overlay — Shows BOTH picks */}
                                {feedbackMessage && (
                                    <div className={`feedback-overlay ${roundResult === 'win' ? 'feedback-win' : roundResult === 'loss' ? 'feedback-loss' : 'feedback-draw'}`}>
                                        <h2>
                                            {roundResult === 'win' ? 'ROUND WON' : roundResult === 'loss' ? 'ROUND LOST' : 'DRAW'}
                                        </h2>
                                        {feedbackMessage.split('\n').map((line, i) => (
                                            <p key={i} className={
                                                line.startsWith('🤖') ? 'bot-pick-line' :
                                                    line.startsWith('⚡') ? 'speed-note-line' : ''
                                            }>
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {/* Opponent Half */}
                                <div className="opponent-section">
                                    <div className="player-info">
                                        <div className="avatar-small p-0 overflow-hidden">{renderAvatar(opponent.avatar)}</div>
                                        <div className="details">
                                            <span className="name">
                                                {opponent.username}
                                                {botState?.isTilted && <span className="tilt-indicator">😤</span>}
                                                {botState?.isConfident && <span className="confidence-indicator">😏</span>}
                                            </span>
                                            <div className="health-bar">
                                                <div className="health-label">STATUS</div>
                                                <div className="bar-thick">
                                                    <div
                                                        className={`fill opponent-fill ${damageFlash === 'opponent' ? 'damage-flash' : ''}`}
                                                        style={{ width: `${opponentHealth}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                        {opponentThinking && (
                                            <div className="thinking-bubble">
                                                <span className="dot"></span>
                                                <span className="dot"></span>
                                                <span className="dot"></span>
                                            </div>
                                        )}
                                        {botLockedIn && !feedbackMessage && !opponentThinking && (
                                            <div className="bot-ready-badge">✓ READY</div>
                                        )}
                                        {opponentBubble && (
                                            <div className="bubble-speech opponent">{opponentBubble}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Center: Scenario + Timer */}
                                <div className="scenario-section">
                                    {matchData.topic && (
                                        <div className="topic-badge">Round {currentRound.round_num}/5</div>
                                    )}

                                    {/* Dual Timer Lines (Dynamic Borders) */}
                                    <div className="absolute top-0 left-0 w-full h-[3px] bg-red-950/30 overflow-hidden shadow-[0_1px_10px_rgba(255,0,85,0.3)]">
                                        <div
                                            className="h-full bg-[var(--color-attack)] transition-all duration-100 ease-linear shadow-[0_0_15px_var(--color-attack)]"
                                            style={{ width: `${botLockedIn ? ((10 - (botAnswerTime || 0)) / 10) * 100 : (timeLeft / 10) * 100}%` }}
                                        />
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-950/30 overflow-hidden shadow-[0_-1px_10px_rgba(0,136,255,0.3)]">
                                        <div
                                            className="h-full bg-[var(--color-primary)] transition-all duration-100 ease-linear shadow-[0_0_15px_var(--color-primary)]"
                                            style={{ width: `${playerLockedIn ? ((10 - (playerAnswerTime || 0)) / 10) * 100 : (timeLeft / 10) * 100}%` }}
                                        />
                                    </div>

                                    <div className="scenario-text-large">
                                        <p>{formatScenarioText(currentRound.scenario)}</p>
                                    </div>



                                    <div className="options">
                                        {currentRound.options.map((opt) => (
                                            <button
                                                key={opt.id}
                                                className={`option-btn ${selectedOptionId === opt.id ? 'option-selected' : ''}`}
                                                onClick={() => handleAnswer(opt)}
                                                disabled={!!feedbackMessage || playerLockedIn}
                                            >
                                                <span className="option-id">{opt.id.toUpperCase()}</span>
                                                <span className="option-text">{opt.text.replace(/\*/g, '')}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Live Reveal Protocol — Sync Status */}
                                    {playerLockedIn && !feedbackMessage && (
                                        <div className="sync-overlay">
                                            {syncPhase ? (
                                                <div className="sync-locked">
                                                    <span className="lock-icon">🔒</span> LOCKED — Resolving...
                                                </div>
                                            ) : !botLockedIn ? (
                                                <div className="sync-waiting">
                                                    <span className="sync-spinner"></span> Waiting for opponent...
                                                </div>
                                            ) : (
                                                <div className="sync-ready">
                                                    Both ready — syncing...
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Player Half */}
                                <div className={`player-section ${playerGlow ? 'glow' : ''}`}>
                                    <div className="player-info" style={{ position: 'relative' }}>
                                        {playerBubble && (
                                            <div className="bubble-speech player">{playerBubble}</div>
                                        )}

                                        <div className="avatar-small p-0 overflow-hidden">{renderAvatar(playerStats.avatar)}</div>
                                        <div className="details">
                                            <span className="name">You</span>
                                            <div className="health-bar">
                                                <div className="health-label">STATUS</div>
                                                <div className="bar-thick">
                                                    <div
                                                        className={`fill player-fill ${damageFlash === 'player' ? 'damage-flash' : ''}`}
                                                        style={{ width: `${playerHealth}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CHAT BUTTON & MENU */}
                                        <button
                                            className="chat-btn"
                                            onClick={() => setIsChatMenuOpen(!isChatMenuOpen)}
                                        >
                                            💬
                                        </button>

                                        {isChatMenuOpen && (
                                            <div className="chat-menu">
                                                {quickChatOptions.map((opt, i) => (
                                                    <button
                                                        key={i}
                                                        className="chat-option"
                                                        onClick={() => handleQuickChat(opt)}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* BATTLE CHAT PANEL */}
                                <div className={`battle-chat ${chatMinimized ? 'minimized' : ''}`}>
                                    <div
                                        className="chat-header"
                                        onClick={() => setChatMinimized(!chatMinimized)}
                                    >
                                        <span className="chat-title">💬 Chat</span>
                                        <span className="chat-toggle">{chatMinimized ? '▲' : '▼'}</span>
                                    </div>
                                    {!chatMinimized && (
                                        <div className="chat-body">
                                            {chatMessages.length === 0 && !botIsTyping && (
                                                <div className="chat-empty">No messages yet...</div>
                                            )}
                                            {chatMessages.map((msg, i) => (
                                                <div key={i} className={`chat-msg ${msg.sender}`}>
                                                    {msg.sender === 'bot' && (
                                                        <span className="chat-sender">{opponent.username}:</span>
                                                    )}
                                                    {msg.sender === 'player' && (
                                                        <span className="chat-sender player-sender">You:</span>
                                                    )}
                                                    <span className="chat-text">{msg.text}</span>
                                                </div>
                                            ))}
                                            {botIsTyping && (
                                                <div className="chat-msg bot typing">
                                                    <span className="chat-sender">{opponent.username}:</span>
                                                    <span className="typing-dots">
                                                        <span className="tdot"></span>
                                                        <span className="tdot"></span>
                                                        <span className="tdot"></span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    )}
                </>
            )}

            {/* POST-MATCH */}
            {gameState === 'post-match' && (
                <div className="post-match">
                    <div className={`result ${isVictory ? 'victory' : 'defeat'}`}>
                        {isVictory ? 'VICTORY' : 'FAILED'}
                    </div>
                    {botStatus && (
                        <div className="toast-notification">
                            {botStatus}
                        </div>
                    )}

                    {/* Rematch Modal */}
                    {rematchModalOpen && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                            <div className="bg-[#1F2937] p-6 rounded-2xl border-2 border-yellow-500/50 max-w-sm w-full mx-4 shadow-2xl transform scale-100 animate-pop-in">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl overflow-hidden p-0 border border-gray-600">
                                        {renderAvatar(opponent?.avatar)}
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{opponent?.username}</h3>
                                    <p className="text-yellow-400 font-bold mt-1">Wants a rematch!</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAcceptRematch}
                                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-xl transition-colors"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => setRematchModalOpen(false)}
                                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bot chat in post match */}
                    {chatMessages.length > 0 && (
                        <div className="post-match-chat">
                            {chatMessages.slice(-3).map((msg, i) => (
                                <div key={i} className={`chat-msg ${msg.sender} post`}>
                                    {msg.sender === 'bot' && opponent && (
                                        <span className="chat-sender">{opponent.username}:</span>
                                    )}
                                    <span className="chat-text">{msg.text}</span>
                                </div>
                            ))}
                            {botIsTyping && opponent && (
                                <div className="chat-msg bot typing post">
                                    <span className="chat-sender">{opponent.username}:</span>
                                    <span className="typing-dots">
                                        <span className="tdot"></span>
                                        <span className="tdot"></span>
                                        <span className="tdot"></span>
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="progression-large">
                        <p>Rank Progression</p>
                        <div className="progress-bar-large">
                            <div
                                className={isVictory ? "progress-fill-animated" : "progress-fill-stalled"}
                                style={{ width: isVictory ? '85%' : '65%' }}
                            ></div>
                        </div>
                        <span className="progress-text">
                            {finalXpChange !== null
                                ? `${finalXpChange > 0 ? '+' : ''}${finalXpChange} XP`
                                : (isVictory ? "Processing..." : "No points awarded.")}
                        </span>
                    </div>

                    <div className="actions">
                        <button
                            className={`rematch-btn ${rematchRequested ? 'requesting' : ''} ${rematchDeclined ? 'declined' : ''}`}
                            onClick={handleRequestRematch}
                            disabled={rematchRequested || rematchDeclined}
                        >
                            {rematchRequested ? 'Requesting...' : rematchDeclined ? 'Declined' : 'Retry Drill'}
                        </button>

                        <button className="exit-btn" onClick={handleBackToDashboard}>
                            Back to Base
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
