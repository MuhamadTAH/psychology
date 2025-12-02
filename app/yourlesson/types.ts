// 🧠 FILE PURPOSE
// This file contains all TypeScript interfaces and types used in the lesson system.
// It ensures type safety across all question types and lesson data structures.

// Main quiz question data structure
// Supports multiple question types: fill-in-blank, multiple-choice, matching, sentence-building
export interface QuizData {
  type?: string;
  question: string;
  scene?: string;  // Scene description for all question types (styled differently from question)

  // Fill-in-blank fields
  sentence?: string;
  correctAnswer?: string;  // Legacy single answer
  wrongOptions?: string[];  // Wrong options only
  fillInOptions?: string[];  // New format: all options (correct + wrong) for fill-in questions
  answers?: string[];  // New format: multiple correct answers for multi-blank questions
  explanation?: string;

  // Multiple choice fields
  options?: Array<{ id: string; text: string }>;  // Multiple choice options
  image?: string; // Optional image for multiple choice questions

  // Matching fields
  pairs?: { [key: string]: string }; // For simple pair matching
  columnA?: Array<{ id: string; text: string }>; // For column-based matching
  columnB?: Array<{ id: string; text: string }>;
  correctPairs?: { [key: string]: string };

  // Sentence building fields
  words?: string[]; // Available words to build sentence
  correctSentence?: string; // The correct sentence order
}

// Track wrong answers for review at the end
export interface WrongAnswer {
  questionIndex: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
}

// User statistics from gamification system
export interface UserStats {
  hearts: number;
  xp: number;
  streak: number;
}

// Lesson metadata
export interface LessonData {
  _id: string;
  lessonNumber: number;
  title: string;
  practice: QuizData[];
  quiz?: QuizData[];
  userId: string;
}
