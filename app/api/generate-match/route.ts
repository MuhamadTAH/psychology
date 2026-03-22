import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { generateLogId } from '@/lib/ai-logger';

const MODEL_NAME = 'meta/llama-3.1-405b-instruct';

// --- TACTICS & TOPICS DATA ---
const TACTICS = [
    "Gaslighting (Denying Reality)", "Love Bombing (Overwhelming Affection)", "The Silent Treatment (Punitive Silence)",
    "Triangulation (Bringing in a 3rd person)", "Projection (Accusing you of their flaw)", "The Double Bind (No-win situation)",
    "Moving the Goalposts (Changing rules)", "Strawman Argument (Distorting your words)", "Ad Hominem (Attacking your character)",
    "Guilt Tripping (Weaponizing pity)", "Victim Playing (Darvo)", "Future Faking (Promising a fake future)",
    "Catastrophizing (Blowing things up)", "Minimization (Making your pain small)", "Negging (Backhanded compliments)",
    "Breadcrumbing (Giving just enough attention)", "Stonewalling (Refusing to engage)", "Word Salad (Confusing nonsense)",
    "Reactive Abuse (Baiting you to explode)", "Hoovering (Sucking you back in)", "Flying Monkeys (Using others to spy)",
    "Dog Whistling (Hidden insults)", "Sealioning (Fake polite questions)", "Whataboutism (Deflecting blame)",
    "Smear Campaign (Ruining reputation)"
];

const TOPICS = [
    "Romantic Dinner", "First Date", "Breakup Conversation", "Meeting with Boss", "Performance Review",
    "Salary Negotiation", "Team Project Dispute", "Family Holiday Meal", "Phone Call with Parent", "Sibling Rivalry",
    "Roommate Dispute", "Landlord Confrontation", "Traffic / Road Rage", "Customer Service Complaint",
    "Returning an Item", "Bar / Nightclub Interaction", "Online Comment Section", "Group Chat Drama",
    "Borrowing Money", "Lending Money", "Apology Situation", "Accusation of Lying", "Planning a Trip",
    "Critique of Creative Work", "Political Debate"
];

// Helper to get random items
const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomUnique = (arr: string[], count: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Helper to shuffle options and re-assign IDs (a, b, c)
const shuffleAndReindex = (rounds: any[]) => {
    rounds.forEach((round) => {
        if (round.options && Array.isArray(round.options)) {
            const shuffled = round.options.sort(() => 0.5 - Math.random());
            round.options = shuffled.map((opt: any, index: number) => ({
                ...opt,
                id: String.fromCharCode(97 + index)
            }));
        }
    });
};

export async function POST(req: Request) {
    // Initialize clients lazily inside the handler (not at module level)
    // so env vars are available at runtime, not build time.
    const openai = new OpenAI({
        apiKey: process.env.NVIDIA_API_KEY,
        baseURL: 'https://integrate.api.nvidia.com/v1',
    });
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    const logId = generateLogId();
    const startTime = Date.now();
    let promptSent = '';
    let rawResponse: string | null = null;
    let cleanedJSON: string | null = null;
    let availableLesson = "The 3-Second Pause";
    let difficultyLevel = 3;

    try {
        const requestBody = await req.json().catch(() => ({}));
        availableLesson = requestBody.availableLesson || availableLesson;
        difficultyLevel = requestBody.difficultyLevel || difficultyLevel;

        console.log(`[GAMBIT API] [${logId}] Match Config: Lesson: ${availableLesson}, Difficulty: ${difficultyLevel}`);

        const mockMatchData = {
            rank_level: 1,
            topic: "MOCK DRILL",
            rounds: [
                {
                    round_num: 1,
                    mode: "DEFENSE",
                    scenario: "What is your name?",
                    options: [
                        { id: "a", text: "John", type: "Win", damage: 0, feedback: "Correct." },
                        { id: "b", text: "I don't know", type: "Weak", damage: -20, feedback: "Incorrect." },
                        { id: "c", text: "Why do you care?", type: "Fatal", damage: -40, feedback: "Too aggressive." }
                    ]
                },
                {
                    round_num: 2,
                    mode: "OFFENSE",
                    scenario: "What is your family name?",
                    options: [
                        { id: "a", text: "Smith", type: "Win", damage: 0, feedback: "Correct." },
                        { id: "b", text: "No family", type: "Weak", damage: -20, feedback: "Incorrect." },
                        { id: "c", text: "None of your business", type: "Fatal", damage: -40, feedback: "Too aggressive." }
                    ]
                },
                {
                    round_num: 3,
                    mode: "DEFENSE",
                    scenario: "What is your father's name?",
                    options: [
                        { id: "a", text: "Robert", type: "Win", damage: 0, feedback: "Correct." },
                        { id: "b", text: "Umm...", type: "Weak", damage: -20, feedback: "Incorrect." },
                        { id: "c", text: "Leave my father out of this!", type: "Fatal", damage: -40, feedback: "Too aggressive." }
                    ]
                }
            ]
        };

        return NextResponse.json(mockMatchData);

    } catch (error) {
        let errorInfo = String(error);
        if (error instanceof Error) errorInfo = error.message;
        console.error(`[GAMBIT API] [${logId}] ERROR:`, errorInfo);

        const fallbackMatch = {
            rank_level: 1,
            topic: availableLesson || "Offline Mode",
            rounds: [
                {
                    round_num: 1,
                    mode: "DEFENSE",
                    scenario: "Breakup: Ex says 'I never cheated, you're just crazy!'",
                    options: [
                        { id: "a", text: "I AM NOT CRAZY!", type: "Fatal", damage: -40, feedback: "Defensiveness suggests doubt." },
                        { id: "b", text: "Maybe I am imagining it...", type: "Weak", damage: -20, feedback: "Accepted their reality." },
                        { id: "c", text: "I know what I saw.", type: "Win", damage: 0, feedback: "Trusting your own reality." }
                    ]
                }
            ]
        };

        shuffleAndReindex(fallbackMatch.rounds);

        await convex.mutation(api.gambitLogs.saveLog, {
            topic: 'FALLBACK_MODE', model: MODEL_NAME, promptSent, rawAIResponse: rawResponse || undefined,
            success: false, error: errorInfo, durationMs: Date.now() - startTime
        }).catch(e => console.error(e));

        return NextResponse.json({ ...fallbackMatch, _debug_error: errorInfo, _using_fallback: true });
    }
}
