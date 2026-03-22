import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'ai-logs');
const LOG_FILE = path.join(LOG_DIR, 'match-generations.json');

interface AILogEntry {
    id: string;
    timestamp: string;
    topic: string;
    model: string;
    promptSent: string;
    rawAIResponse: string | null;
    cleanedJSON: string | null;
    parsedData: unknown | null;
    roundsCount: number | null;
    success: boolean;
    error: string | null;
    durationMs: number;
}

function ensureLogDir() {
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    }
}

function readLogs(): AILogEntry[] {
    ensureLogDir();
    if (!fs.existsSync(LOG_FILE)) {
        return [];
    }
    try {
        const raw = fs.readFileSync(LOG_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function writeLogs(logs: AILogEntry[]) {
    ensureLogDir();
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), 'utf-8');
}

export function logAIInteraction(entry: AILogEntry) {
    const logs = readLogs();
    logs.push(entry);
    // Keep last 100 entries to avoid file getting too large
    const trimmed = logs.slice(-100);
    writeLogs(trimmed);
    console.log(`[AI-LOG] Saved entry ${entry.id} (${entry.success ? '✅' : '❌'})`);
}

export function generateLogId(): string {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const time = now.toISOString().slice(11, 19).replace(/:/g, '');
    const rand = Math.random().toString(36).substring(2, 6);
    return `${date}_${time}_${rand}`;
}

export type { AILogEntry };
