# Multi-Part Lesson System Guide

## How It Works

When you upload lesson parts separately, the system merges them by `lessonId`:

### Step 1: Upload Part 1
```json
{
  "lessonId": "A1-1",
  "lessonPart": 1,
  "lessonPartTitle": "The Cold Open",
  "contentScreens": [/* Part 1 exercises */]
}
```

This creates a **new lesson** with:
- `parts`: Array with 1 element (Part 1)
- `totalParts`: 1

### Step 2: Upload Part 2
```json
{
  "lessonId": "A1-1",  // SAME lessonId!
  "lessonPart": 2,
  "lessonPartTitle": "The Debrief",
  "contentScreens": [/* Part 2 exercises */]
}
```

This **merges** with the existing lesson:
- Finds lesson with `lessonId === "A1-1"`
- Adds Part 2 to the `parts` array
- Updates `totalParts` to 2

### Result
One lesson with:
```javascript
{
  number: 1,
  lessonId: "A1-1",
  totalParts: 2,
  parts: [
    {
      partNumber: 1,
      partTitle: "The Cold Open",
      questions: [/* 15 exercises from Part 1 */]
    },
    {
      partNumber: 2,
      partTitle: "The Debrief",
      questions: [/* 15 exercises from Part 2 */]
    }
  ],
  practice: [/* All 30 exercises combined */]
}
```

## Progress Ring

The progress ring divides into segments based on `totalParts`:
- 1 part = Full circle
- 2 parts = 2 halves
- 3 parts = 3 segments (like yours!)

As user completes parts:
- Complete Part 1 → 33% filled
- Complete Part 2 → 66% filled
- Complete Part 3 → 100% filled

## Current Status

✅ API updated to merge parts by `lessonId`
⏳ Lesson page needs update to load correct part based on user progress

**Next:** The lesson page will check which parts are completed and load the next incomplete part.
