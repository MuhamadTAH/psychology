# Yourlesson Module - Refactored Structure

This module has been refactored from a single 1000+ line file into multiple smaller, maintainable components.

## File Structure

```
yourlesson/
├── page.tsx                    # Main orchestrator (~200-250 lines)
├── page.tsx.backup            # Original file backup
├── types.ts                    # TypeScript interfaces (~50 lines)
├── utils/
│   └── questionHelpers.ts     # Utility functions (~100 lines)
└── components/
    ├── QuestionHeader.tsx           # Top header with progress (~70 lines)
    ├── SentenceBuildingQuestion.tsx # Sentence building UI (~200 lines)
    ├── MatchingQuestion.tsx         # Matching question UI (~130 lines)
    ├── MultipleChoiceQuestion.tsx   # Multiple choice UI (~80 lines)
    ├── FillInBlankQuestion.tsx      # Fill-in-blank UI (~80 lines)
    ├── AnswerFeedback.tsx           # CHECK button & feedback (~150 lines)
    └── FinalScore.tsx               # Final score modal (~110 lines)
```

## Components Overview

### Main Page (page.tsx)
- Manages all state
- Handles data fetching from Convex
- Orchestrates question flow
- Routes between components

### Types (types.ts)
- `QuizData` - Main question interface
- `WrongAnswer` - Wrong answer tracking
- `UserStats` - User gamification stats
- `LessonData` - Lesson metadata

### Utilities (utils/questionHelpers.ts)
- `shuffleArray()` - Fisher-Yates shuffle
- `isImagePath()` - Detect image paths
- `checkAnswer()` - Validate answers
- `getMotivationalMessage()` - Random motivational text
- `isCloseAnswer()` - Detect minor mistakes

### Components

#### QuestionHeader
- X close button
- Progress bar with XP counter
- Hearts display

#### SentenceBuildingQuestion
- Character placeholder
- Speech bubble
- 3 input lines
- Word bank with drag-and-drop
- Plan.md compliant design

#### MatchingQuestion
- Two-column layout
- Image support
- Visual feedback for matches
- Auto-continues on completion

#### MultipleChoiceQuestion
- Optional image display
- 2x2 grid of options
- Visual feedback for selection

#### FillInBlankQuestion
- Sentence with blank space
- Word option buttons
- Dynamic answer display

#### AnswerFeedback
- Large CHECK button
- Green/red feedback panel
- Motivational messages
- Share/Report buttons
- CONTINUE button

#### FinalScore
- Trophy and score display
- Wrong answer review
- Retry/Continue options

## Benefits of Refactoring

1. **Maintainability** - Each component has a single responsibility
2. **Reusability** - Components can be used in other parts of the app
3. **Testability** - Easier to test individual components
4. **Readability** - Smaller files are easier to understand
5. **Collaboration** - Multiple developers can work on different components
6. **Performance** - React can optimize re-renders better with smaller components

## Next Steps

To complete the refactoring, update `page.tsx` to import and use these components instead of inline rendering.

See the `.backup` file for the original implementation.
