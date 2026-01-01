# AI Lesson Generation Guide for Dark Psychology Learning App

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Lesson Structure](#lesson-structure)
3. [Exercise Types](#exercise-types)
4. [JSON File Format](#json-file-format)
5. [Naming Conventions](#naming-conventions)
6. [Content Guidelines](#content-guidelines)
7. [Upload Process](#upload-process)
8. [Database Schema](#database-schema)

---

## 📚 Project Overview

This is a **Duolingo-style language learning app** adapted for teaching Dark Psychology concepts. The app uses:
- **Next.js 15** with App Router
- **React 19** and **TypeScript**
- **Convex** for backend/database
- **Clerk** for authentication
- **Tailwind CSS** for styling

### App Structure
- **Sections**: A, B, C, D (e.g., Section B = "Psychological Tactics")
- **Units**: Each section has multiple units (e.g., B1, B2, B3, B4, B5)
- **Lessons**: Each unit has 5 lessons
- **Parts**: Each lesson has 3 parts (Part 1, Part 2, Part 3)

---

## 🏗️ Lesson Structure

### Multi-Part Lesson System
Each lesson is split into **3 separate JSON files**:
- `Lesson_B1-1_Part_1.json` (Part 1 of lesson B1-1)
- `Lesson_B1-1_Part_2.json` (Part 2 of lesson B1-1)
- `Lesson_B1-1_Part_3.json` (Part 3 of lesson B1-1)

**IMPORTANT**: All 3 parts share the same `lessonId` and `lessonTitle`, but have different `lessonPart` numbers (1, 2, 3).

### Lesson Progression
Each lesson part contains **Content Screens**:
1. **Learn Screen** - Educational content
2. **Exercise Screen** - Practice exercises
3. **More Learn Screens** - Additional content
4. **More Exercise Screens** - More practice

---

## 🎨 Text Formatting & Styling

### Markdown-Style Formatting in Text
You can use **markdown-style formatting** in all text fields (questions, options, content, etc.) to add special styling:

#### Bold Text
Use `**text**` to make text bold:
```json
{
  "question": "What is **pacing** in communication?",
  "text": "This is a **very important** concept."
}
```
Renders as: "What is **pacing** in communication?"

#### Italic Text
Use `*text*` to make text italic:
```json
{
  "question": "Pacing means *matching* someone's style.",
  "text": "This technique is *extremely* powerful."
}
```
Renders as: "Pacing means *matching* someone's style."

#### Combined Bold + Italic
Use `***text***` for bold italic:
```json
{
  "question": "This is ***critically important*** to understand."
}
```
Renders as: "This is ***critically important*** to understand."

#### Code/Highlight Text
Use backticks `` `text` `` to highlight terms:
```json
{
  "question": "The `Milton Model` uses vague language."
}
```
Renders with special highlighting (usually monospace or highlighted background)

#### Special Styling Keywords

The system recognizes certain keywords and applies **automatic styling**:

**Scenario Questions** - Use `"Scenario:"` prefix:
```json
{
  "question": "Scenario: You meet someone who speaks very slowly..."
}
```
Renders with special scenario styling (different color/background)

**Example Prefix** - Use `"Example:"` or `"For example:"`:
```json
{
  "text": "Example: If they speak slowly, you speak slowly too."
}
```
Renders with example styling

**Warning/Important** - Use emojis like ⚠️, 🔴, ❗:
```json
{
  "text": "⚠️ Warning: Never use these techniques to manipulate people."
}
```
Renders with warning/alert styling

#### Emojis
Use emojis freely in all text - they render normally:
```json
{
  "text": "🎭 Pacing is like dancing with words 💬"
}
```

#### Line Breaks
Use `\n` for line breaks in text:
```json
{
  "text": "First point.\n\nSecond point after line break."
}
```

### Example with Multiple Formatting Styles

```json
{
  "question": "What does **pacing** mean in the context of the `Milton Model`?",
  "explanation": "⚠️ Remember: Pacing is *matching* someone's communication style to build ***rapport and trust***.\n\nExample: If they speak slowly 🐌, you speak slowly too."
}
```

---

## 📝 Exercise Types

The app supports **12 different exercise types**:

### 1. Multiple Choice (`type: "multiple-choice"`)
Choose one correct answer from multiple options.

```json
{
  "exerciseId": "B2-1-P1-E1",
  "type": "multiple-choice",
  "question": "What is a **Frame** in psychology?",
  "options": [
    "A wooden border for art.",
    "The mental structure or context that shapes how we interpret information.",
    "A lie.",
    "Being trapped."
  ],
  "correct": "The mental structure or context that shapes how we interpret information.",
  "difficulty": "easy",
  "feedback": {
    "correct": "Correct. It is the lens. If I frame a glass as 'half full,' you feel happy.",
    "incorrect": "It's not a physical object. It is the psychological context."
  }
}
```

**Important**: Use `"correct"` with the full answer text, NOT an index number.

### 2. True/False (`type: "true-false"`)
Simple true or false question.

```json
{
  "exerciseId": "B2-1-P1-E4",
  "type": "true-false",
  "scene": "Scenario: 'I know you are too busy to help me.'",
  "question": "Is this a Frame?",
  "options": ["True", "False"],
  "correct": "True",
  "difficulty": "medium",
  "feedback": {
    "correct": "Correct. This creates a 'Challenge Frame.'",
    "incorrect": "It is a specific frame called the 'Negative Frame'."
  }
}
```

### 3. Fill in the Blank (`type: "fill-in"`)
Complete the sentence with the correct word.

```json
{
  "exerciseId": "B2-1-P1-E3",
  "type": "fill-in",
  "sentence": "The person who sets the (--------) controls the conversation.",
  "options": ["frame", "volume", "time", "food"],
  "answers": ["frame"],
  "difficulty": "easy",
  "feedback": {
    "correct": "Correct. If I frame the debate as 'Safety vs. Danger,' you have to argue for Safety.",
    "incorrect": "It's not about volume. It's about the boundaries of the discussion."
  }
}
```

**Note**: Use `"sentence"` field with `(--------)` to show the blank, and `"answers"` as an array.

### 4. Matching (`type: "matching"`)
Match terms to definitions.

```json
{
  "exerciseId": "B2-1-P1-E5",
  "type": "matching",
  "question": "Match the Frame to the Meaning:",
  "pairs": [
    {
      "term": "The Problem Frame",
      "definition": "\"Why is this broken? Whose fault is it?\" (Past Focus)"
    },
    {
      "term": "The Outcome Frame",
      "definition": "\"What do we want? How do we get there?\" (Future Focus)"
    },
    {
      "term": "The Feedback Frame",
      "definition": "\"There is no failure, only learning.\""
    }
  ],
  "difficulty": "medium",
  "feedback": {
    "correct": "Correct. Leaders use the Outcome Frame. Victims use the Problem Frame.",
    "incorrect": "Look at the focus. Blame vs. Goal vs. Lesson."
  }
}
```

**Note**: Use `"term"` and `"definition"` (not "left" and "right").

### 5. Build Sentence / Ordering (`type: "build-sentence"`)
Arrange words in the correct order to form a sentence.

```json
{
  "exerciseId": "B2-1-P1-E6",
  "type": "build-sentence",
  "question": "Arrange these words to define the power of Reframing:",
  "words": ["meaning", "Changing", "context", "changes", "the", "the"],
  "correct": "Changing the context changes the meaning",
  "difficulty": "easy",
  "feedback": {
    "correct": "Correct. A scream in a haunted house is scary. A scream on a rollercoaster is fun.",
    "incorrect": "The event stays the same. The context alters the perception."
  }
}
```

### 6. Scenario (`type: "scenario"`)
Present a scenario and ask what to do.

```json
{
  "exerciseId": "B2-1-P1-E2",
  "type": "scenario",
  "scene": "Scenario: A store sells a jacket for $200. It seems expensive. They put a sign next to it: 'Regular Price $400, Now 50% Off.'",
  "question": "What did the sign do?",
  "options": [
    "It lowered the value.",
    "It set a 'Price Anchor' Frame, making $200 feel cheap by comparison.",
    "It lied.",
    "It made the jacket better."
  ],
  "correct": "It set a 'Price Anchor' Frame, making $200 feel cheap by comparison.",
  "difficulty": "medium",
  "feedback": {
    "correct": "Correct. The frame changed from 'Is $200 a lot?' to 'Look how much I am saving!'",
    "incorrect": "It didn't change the jacket. It changed the context of the price."
  }
}
```

**Note**: Use `"scene"` field for scenario description, separate from `"question"`.

### 7. Reverse Scenario (`type: "reverse-scenario"`)
Give the answer first, then ask what it describes.

```json
{
  "exerciseId": "B2-1-P1-E7",
  "type": "reverse-scenario",
  "answer": "A rhetorical tactic where you define the debate terms so the opponent loses no matter what they say (e.g., 'When did you stop hitting your wife?').",
  "question": "What is this?",
  "options": [
    "The Loaded Frame / Complex Question",
    "Gaslighting",
    "Pacing",
    "Honesty"
  ],
  "correct": "The Loaded Frame / Complex Question",
  "difficulty": "hard",
  "feedback": {
    "correct": "Correct. The frame assumes guilt. You must reject the frame.",
    "incorrect": "It loads the question with a presupposition (Frame) that traps the answerer."
  }
}
```

### 8. Ethical Dilemma (`type: "ethical-dilemma"`)
Present an ethical situation and ask for judgment.

```json
{
  "exerciseId": "B2-1-P1-E9",
  "type": "ethical-dilemma",
  "scene": "You are selling a used car with high mileage. You frame it as 'Road Tested and Reliable' instead of 'Old.'",
  "question": "Is this manipulation?",
  "options": [
    "Yes, but it is standard marketing (Reframing) as long as you disclose the actual mileage.",
    "No, it is truth.",
    "Yes, it is a scam.",
    "No, cars don't age."
  ],
  "correct": "Yes, but it is standard marketing (Reframing) as long as you disclose the actual mileage.",
  "difficulty": "medium",
  "feedback": {
    "correct": "Correct. Reframing highlights the positive aspect of a fact.",
    "incorrect": "It is manipulation of perception, but ethical if the facts remain true."
  }
}
```

### 9. Case Analysis (`type: "case-analysis"`)
Analyze a case study or wrap up a lesson part.

```json
{
  "exerciseId": "B2-1-P1-E15",
  "type": "case-analysis",
  "caseTitle": "Part 1 Complete: The Lens",
  "scene": "You now understand that Reality is subjective. The Frame dictates the meaning.",
  "question": "In Part 2, we will practice:",
  "options": [
    "Practice: Spotting the 'Pre-Frame' (Real-world examples).",
    "Building picture frames.",
    "Ignoring context.",
    "Lesson A1-1."
  ],
  "correct": "Practice: Spotting the 'Pre-Frame' (Real-world examples).",
  "difficulty": "easy",
  "feedback": {
    "correct": "Correct. We need to train you to hear the frame *before* the argument starts.",
    "incorrect": "Next up: Practical detection of the context trap."
  }
}
```

**Note**: Often used as the last exercise to transition to next part.

---

## 📄 JSON File Format

### Complete Lesson Part File Structure

```json
{
  "sectionId": "B",
  "sectionTitle": "The Tools of Influence",
  "unitId": "B2",
  "unitTitle": "The Frame Game: Controlling Perception",
  "lessonId": "B2-1",
  "lessonTitle": "Framing 101: The Lens of Reality",
  "lessonType": "Normal",
  "lessonPart": 1,
  "lessonPartTitle": "The Concept: Whoever Sets the Frame Wins the Argument",
  "objective": "To define 'Framing' as the art of setting the context or 'lens' through which information is perceived.",
  "gamification": {
    "progressRings": [
      {"ringId": "learn", "status": "pending", "label": "Part 1"},
      {"ringId": "practice", "status": "pending", "label": "Part 2"},
      {"ringId": "challenge", "status": "pending", "label": "Part 3"}
    ],
    "pointsValue": 100,
    "starsAvailable": 3,
    "badgeOnCompletion": null
  },
  "contentScreens": [
    {
      "screenId": "B2-1-P1-S1",
      "screenType": "Learn",
      "title": "The Lens is Everything",
      "content": [
        {
          "type": "paragraph",
          "text": "A picture has no meaning until you put a frame around it. A *small* frame focuses on details. A *large* frame shows the big picture."
        },
        {
          "type": "paragraph",
          "text": "In communication, the **Frame** is the context. Is this a 'problem' or an 'opportunity'? The person who sets the frame wins the argument before it even begins."
        },
        {
          "type": "alert",
          "alertType": "warning",
          "text": "The Rule: Do not argue with the content (the picture). Argue with the context (the frame)."
        }
      ]
    },
    {
      "screenId": "B2-1-P1-S2",
      "screenType": "Exercises",
      "title": "Defining the Frame",
      "exercises": [
        {
          "exerciseId": "B2-1-P1-E1",
          "type": "multiple-choice",
          "question": "What is a **Frame** in psychology?",
          "options": [
            "A wooden border for art.",
            "The mental structure or context that shapes how we interpret information.",
            "A lie.",
            "Being trapped."
          ],
          "correct": "The mental structure or context that shapes how we interpret information.",
          "difficulty": "easy",
          "feedback": {
            "correct": "Correct. It is the lens. If I frame a glass as 'half full,' you feel happy.",
            "incorrect": "It's not a physical object. It is the psychological context."
          }
        },
        {
          "exerciseId": "B2-1-P1-E2",
          "type": "scenario",
          "scene": "Scenario: A store sells a jacket for $200. They put a sign: 'Regular Price $400, Now 50% Off.'",
          "question": "What did the sign do?",
          "options": [
            "It lowered the value.",
            "It set a 'Price Anchor' Frame, making $200 feel cheap by comparison.",
            "It lied.",
            "It made the jacket better."
          ],
          "correct": "It set a 'Price Anchor' Frame, making $200 feel cheap by comparison.",
          "difficulty": "medium",
          "feedback": {
            "correct": "Correct. The frame changed from 'Is $200 a lot?' to 'Look how much I am saving!'",
            "incorrect": "It didn't change the jacket. It changed the context of the price."
          }
        }
      ]
    }
  ]
}
```

---

## 📛 Naming Conventions

### File Names
- Pattern: `Lesson_{UnitId}-{LessonNumber}_Part_{PartNumber}.json`
- Examples:
  - `Lesson_B1-1_Part_1.json`
  - `Lesson_B1-1_Part_2.json`
  - `Lesson_B1-1_Part_3.json`
  - `Lesson_B2-3_Part_1.json`

### IDs in JSON

**Section IDs**: `A`, `B`, `C`, `D`

**Unit IDs**: `{SectionId}{UnitNumber}`
- Examples: `B1`, `B2`, `B3`, `B4`, `B5`

**Lesson IDs**: `{UnitId}-{LessonNumber}`
- Examples: `B1-1`, `B1-2`, `B2-1`, `B2-5`

**Screen IDs**: `{LessonId}-P{PartNumber}-S{ScreenNumber}`
- Examples: `B1-1-P1-S1`, `B1-1-P1-S2`, `B1-1-P2-S1`

**Exercise IDs**: `{LessonId}-P{PartNumber}-E{ExerciseNumber}`
- Examples: `B1-1-P1-E1`, `B1-1-P1-E2`, `B1-1-P2-E1`

---

## 📚 Content Guidelines

### Learn Screen Content Types

Each Learn screen has a `"title"` and `"content"` array.

1. **Paragraph** (`type: "paragraph"`)
```json
{
  "type": "paragraph",
  "text": "A picture has no meaning until you put a frame around it. A *small* frame focuses on details."
}
```

2. **Alert** (`type: "alert"`)
Use for warnings, important notes, or callouts.

```json
{
  "type": "alert",
  "alertType": "warning",
  "text": "The Rule: Do not argue with the content (the picture). Argue with the context (the frame)."
}
```

**Alert Types**:
- `"warning"` - Yellow/orange warning box
- `"info"` - Blue information box
- `"danger"` - Red danger/critical box
- `"success"` - Green success box

3. **Bullet List** (if supported - check actual implementation)
```json
{
  "type": "bulletList",
  "items": [
    "First point",
    "Second point",
    "Third point"
  ]
}
```

4. **Quote** (if supported - check actual implementation)
```json
{
  "type": "quote",
  "text": "The key to influence is understanding, not manipulation.",
  "author": "Robert Cialdini"
}
```

### Content Best Practices

1. **Use Emojis**: Add relevant emojis to headings (🎭, 🎯, ⚠️, 🔍, 💡)
2. **Keep it Concise**: Each paragraph should be 2-4 sentences max
3. **Mix Content Types**: Alternate between paragraphs, lists, examples, and callouts
4. **Add Ethical Notes**: Include warnings about ethical use
5. **Use Real Examples**: Provide concrete, relatable scenarios

---

## 🚀 Upload Process

### Step 1: Prepare Lesson Files
Create 3 JSON files per lesson (Part 1, Part 2, Part 3) following the structure above.

### Step 2: Access Upload Page
Navigate to: `http://localhost:3000/admin/batch-upload-lessons`

### Step 3: Select Files
Click "Choose Files" and select all 75 JSON files (25 lessons × 3 parts)

### Step 4: Upload
Click "Upload All Lessons" - files will upload **sequentially** (one by one) to avoid memory limits

### Step 5: Verify
- Check console for success messages
- Navigate to Section B: `http://localhost:3000/dark-psychology/section/B`
- Should see 25 lessons with 3-part progress rings

---

## 🗄️ Database Schema

### Lessons Table (Convex)

```typescript
lessons: defineTable({
  userId: v.id("users"),           // System user ID
  lessonNumber: v.number(),        // Part number (1, 2, or 3)
  title: v.string(),               // Unique key: "B1-1-Part1"
  lessonJSON: v.any(),             // Full JSON content
  createdAt: v.number(),           // Timestamp
})
```

### Progress Table (Convex)

```typescript
progress: defineTable({
  userId: v.id("users"),           // User ID
  lessonNumber: v.number(),        // Lesson number
  darkPsychLessonId: v.string(),   // "B1-1-Part1", "B1-1-Part2", etc.
  isCompleted: v.boolean(),        // Is this part completed?
  completedParts: v.array(v.number()), // [1, 2, 3]
  reviewedParts: v.array(v.number()),  // [1, 2]
  xpEarned: v.number(),            // XP from this lesson
  lastReviewedAt: v.optional(v.number()),
})
```

### How Parts Are Stored

Each part file is stored as a **separate database entry**:
- Database entry 1: title = "B1-1-Part1", lessonJSON = {Part 1 content}
- Database entry 2: title = "B1-1-Part2", lessonJSON = {Part 2 content}
- Database entry 3: title = "B1-1-Part3", lessonJSON = {Part 3 content}

The frontend **groups** these 3 entries into ONE lesson display with a 3-segment progress ring.

---

## 🎯 Section B Structure Example

### Section B: "Psychological Tactics" (25 Lessons)

**Unit B1: The Hypnotist (5 lessons)**
1. B1-1: Pacing and Leading
2. B1-2: Embedded Commands & Subliminals
3. B1-3: The Double Bind: The Illusion of Choice
4. B1-4: The "Milton Model": Weaponized Vague Language
5. B1-5: Unit B1 Review: The Hypnotist

**Unit B2: The Architect (5 lessons)**
6. B2-1: Framing 101: The Lens of Reality
7. B2-2: Anchoring: The Price of Perception
8. B2-3: The Contrast Principle
9. B2-4: Labeling & Altercasting
10. B2-5: Unit B2 Review: The Architect

**Unit B3: The Engineer (5 lessons)**
11. B3-1: Social Proof: The Power of the Crowd
12. B3-2: The Authority Hack
13. B3-3: Pretexting & Phishing
14. B3-4: The Liking Bias: Weaponized Friendship
15. B3-5: Unit B3 Review: The Engineer

**Unit B4: The Lever (5 lessons)**
16. B4-1: Scarcity: The Fear of Loss
17. B4-2: Weaponized Reciprocity: The Debt Trap
18. B4-3: Fear-Mongering: The Boogeyman
19. B4-4: Hope-Mongering: Selling the Dream
20. B4-5: Unit B4 Review: The Lever

**Unit B5: Section B Boss Fight (5 lessons)**
21. B5-1: Language & Framing Review
22. B5-2: Social & Emotional Levers Review
23. B5-3: The "Salesman" Simulation
24. B5-4: The "Politician" Simulation
25. B5-5: The Section B Boss Fight

---

## ⚙️ How the System Works

### Frontend (Section Display)
1. Loads all 75 database entries for Section B
2. **Groups** them by `lessonId` (B1-1, B1-2, etc.)
3. Displays **25 lesson circles** (one per unique lessonId)
4. Each circle has **3 segments** (one per part)
5. Progress tracked separately for each part

### Lesson Flow
1. User clicks lesson circle
2. System loads Part 1 content screens
3. User completes Part 1 → Progress saved for "B1-1-Part1"
4. Part 2 loads automatically
5. User completes Part 2 → Progress saved for "B1-1-Part2"
6. Part 3 loads automatically
7. User completes Part 3 → Progress saved for "B1-1-Part3"
8. **Lesson fully complete** → All 3 segments filled

### XP System
- Each part completion: 10 XP
- Full lesson completion (3 parts): 30 XP total
- Review mode: 5 XP per part

---

## 🔧 Common Issues & Solutions

### Issue 1: "Lesson already exists" error
**Cause**: Duplicate `lessonId-PartX` in database
**Solution**: Clear section before re-uploading (use "Clear Section" button)

### Issue 2: Only 21 lessons showing instead of 25
**Cause**: Some lesson files missing or failed to upload
**Solution**: Check console logs for upload errors, verify all 75 files exist

### Issue 3: Progress ring shows only 2 segments
**Cause**: Only 2 part files uploaded instead of 3
**Solution**: Ensure all 3 part files exist for each lesson

### Issue 4: Memory limit exceeded during upload
**Cause**: Trying to upload too many files at once
**Solution**: System already uses sequential upload (one by one) - should not happen

---

## 📊 Lesson Content Density Guidelines

### Normal Lesson (like B2-1)
- **15 exercises per part** (Part 1, Part 2, Part 3)
- **45 total exercises** for complete lesson (3 parts × 15)
- **2-4 content screens per part** (alternating Learn → Exercise → Learn → Exercise)
- **Lesson structure**:
  - Part 1: Learn concept (15 exercises)
  - Part 2: Practice/Apply (15 exercises)
  - Part 3: Challenge/Master (15 exercises)

### Review Lesson (like B1-5, B2-5, etc.)
- **20-25 exercises per part**
- **60-75 total exercises** for complete lesson
- Reviews all concepts from the unit
- Mix of all exercise types learned

### Exercise Distribution
For a 15-exercise part, aim for:
- **3-4** multiple-choice
- **2-3** scenario or ethical-dilemma
- **2-3** true-false
- **2-3** fill-in or matching
- **2-3** build-sentence or reverse-scenario
- **1** case-analysis (usually last exercise to transition)

## 📋 Checklist for Creating New Lessons

- [ ] Create 3 JSON files per lesson (Part_1, Part_2, Part_3)
- [ ] Use correct naming: `Lesson_{UnitId}-{LessonNum}_Part_{PartNum}.json`
- [ ] Set correct `sectionId`, `unitId`, `lessonId`, `lessonPart`
- [ ] Same `lessonTitle` for all 3 parts of same lesson
- [ ] Include `sectionTitle`, `unitTitle`, `lessonType`, `lessonPartTitle`, `objective`
- [ ] Add `gamification` object with progress rings
- [ ] Each part should have **12-15 exercises** (normal) or **20-25** (review)
- [ ] Include 2-4 content screens per part
- [ ] **MUST alternate**: Learn → Exercises → Learn → Exercises
- [ ] Use variety of exercise types (at least 5 different types per part)
- [ ] Use `"difficulty": "easy"`, `"medium"`, or `"hard"` for each exercise
- [ ] Include `"feedback"` with `"correct"` and `"incorrect"` messages
- [ ] Use `"correct"` field with full answer text (NOT index number)
- [ ] Add screen `"title"` for both Learn and Exercise screens
- [ ] Use `**bold**`, `*italic*`, backticks for formatting
- [ ] Include ethical warnings using `"alert"` type
- [ ] Provide concrete, real-world examples in scenarios
- [ ] Last exercise should be `"case-analysis"` to transition to next part
- [ ] Test upload with small batch first
- [ ] Verify lessons appear correctly on section page
- [ ] Check progress tracking works

---

## 📞 Key Files to Reference

- **Upload Page**: `app/admin/batch-upload-lessons/page.tsx`
- **Section Display**: `app/dark-psychology/section/[sectionId]/page.tsx`
- **Upload Mutation**: `convex/darkPsychology.ts` (uploadSingleLesson)
- **Query Lessons**: `convex/lessons.ts` (getAllDarkPsychologyLessons)
- **Example Lesson**: `Section B/Section B/Lesson_B1-1_Part_1.json`

---

## 🎓 Final Notes

1. **Each lesson = 3 separate files** with same lessonId but different lessonPart
2. **System groups them** into one logical lesson on display
3. **Progress tracked separately** for each part
4. **Always include ethical considerations** in content
5. **Test thoroughly** before mass uploading
6. **Use sequential upload** to avoid memory issues

---

**Good luck generating amazing Dark Psychology lessons!** 🎭
