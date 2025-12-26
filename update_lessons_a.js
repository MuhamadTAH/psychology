
const fs = require('fs');
const path = require('path');

const directoryPath = 'D:\\duolingo\\duolearn\\Section A\\Section A';

// Helper function to recursively traverse and modify the object
function modifyExercises(obj, modifiedCount) {
    if (!obj || typeof obj !== 'object') {
        return modifiedCount;
    }

    // Check if it's an exercise object
    if (obj.type === 'reverse-scenario' && obj.answer) {
        console.log(`Found reverse-scenario with answer: "${obj.answer.substring(0, 20)}..."`);
        // NOTE: In this case, we prefer 'scene' due to cleaner naming, so we rename it.
        // The codebase now supports both, but consistent data is better.
        obj.scene = obj.answer;
        delete obj.answer;
        modifiedCount++;
    }

    // Recursively check children
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            modifiedCount = modifyExercises(obj[key], modifiedCount);
        }
    }

    return modifiedCount;
}

try {
    const files = fs.readdirSync(directoryPath);

    files.forEach(file => {
        if (path.extname(file) === '.json') {
            const filePath = path.join(directoryPath, file);
            const content = fs.readFileSync(filePath, 'utf8');

            try {
                const json = JSON.parse(content);
                let modifiedCount = 0;

                modifiedCount = modifyExercises(json, 0);

                if (modifiedCount > 0) {
                    console.log(`Updating ${file}: Modified ${modifiedCount} exercises.`);
                    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
                }
            } catch (parseError) {
                console.error(`Error parsing ${file}:`, parseError.message);
            }
        }
    });
    console.log('Bulk update for Section A complete.');
} catch (err) {
    console.error('Error reading directory:', err);
}
