const fs = require('fs');

const botRosterPatch = 'd:/duolingo/duolearn/lib/botRoster.ts';
const convexBotsPath = 'd:/duolingo/duolearn/convex/bots.ts';

function assignAvatar(rankTier) {
    if (rankTier.includes('Bronze')) {
        const pool = [1, 2, 3, 4, 5, 7];
        return pool[Math.floor(Math.random() * pool.length)];
    } else if (rankTier.includes('Silver')) {
        const pool = [6, 8, 9, 10, 11, 12];
        return pool[Math.floor(Math.random() * pool.length)];
    } else {
        // Gold
        const pool = [12, 13, 14, 15, 8, 10];
        return pool[Math.floor(Math.random() * pool.length)];
    }
}

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // We want to replace `avatar: "..."` with `avatar: "/Profile image/X.jpg"`
    // Also we need to make sure the replacement respects the rankTier logic.
    // The easiest way is to use a replacer function in standard regex for each line that looks like a bot definition.

    content = content.replace(/{ username: "([^"]+)", avatar: "([^"]+)", rankTier: "([^"]+)",/g, (match, username, oldAvatar, rankTier) => {
        // Deterministic sequence based on username length or just random with seed
        // We'll just randomly assign based on rankTier for each script run, but to keep both files in sync,
        // we can seed it or just generate it once. Actually, mapping by username is best!
        return `{ username: "${username}", avatar: "AVATAR_PLACEHOLDER_${rankTier}_${username}", rankTier: "${rankTier}",`;
    });

    return content;
}

let content1 = updateFile(botRosterPatch);
let content2 = updateFile(convexBotsPath);

// Create a deterministic map to keep both files in sync
const avatarMap = {};
const finalReplacer = (match, p1) => {
    if (!avatarMap[p1]) {
        const rankTier = p1.split('_')[0];
        avatarMap[p1] = assignAvatar(rankTier);
    }
    return `avatar: "/Profile image/${avatarMap[p1]}.jpg"`;
};

content1 = content1.replace(/avatar: "AVATAR_PLACEHOLDER_([^_]+)_([^"]+)"/g, finalReplacer);
content2 = content2.replace(/avatar: "AVATAR_PLACEHOLDER_([^_]+)_([^"]+)"/g, finalReplacer);

fs.writeFileSync(botRosterPatch, content1, 'utf8');
fs.writeFileSync(convexBotsPath, content2, 'utf8');

console.log('Successfully updated bots with new profile images.');
