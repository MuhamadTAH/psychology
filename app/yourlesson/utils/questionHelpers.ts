// 🧠 FILE PURPOSE
// This file contains utility functions used throughout the lesson system.
// Includes shuffle algorithm, image detection, answer checking, and motivational messages.

import { QuizData } from '../types';

// Step 1: Fisher-Yates Shuffle Algorithm
// Randomly shuffles an array without modifying the original
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Step 2: Image Path Detection
// Checks if a string is an image path (starts with /images/ or http)
export function isImagePath(str: string): boolean {
  return str?.startsWith('/images/') || str?.startsWith('http');
}

// Step 2.5: Remove Challenge Tags
// Strips [Boss Challenge], [Challenge], etc. from question text
// These tags are for backend organization only, not for display
export function removeChallengeTags(text: string): string {
  if (!text) return text;
  // Remove tags like [Boss Challenge], [Challenge], [Boss], etc.
  // Pattern: [anything with "challenge" or "boss" inside brackets]
  return text.replace(/\[(Boss\s+)?Challenge\]/gi, '').replace(/\[Boss\]/gi, '').trim();
}

// Step 2.6: Parse Scene and Question
// Detects if content has "Scene: ... Question: ..." format
// Returns separated scene and question text, or just question if no scene
export function parseSceneAndQuestion(content: string): { scene: string | null; question: string } {
  if (!content) {
    return { scene: null, question: '' };
  }

  // Remove challenge tags first
  const cleanContent = removeChallengeTags(content);

  // Check for "Scene: ... Question: ..." format
  const sceneMatch = cleanContent.match(/^Scene\s*:\s*(.*?)\s*Question\s*:\s*(.*)$/is);

  if (sceneMatch) {
    return {
      scene: sceneMatch[1].trim(),
      question: sceneMatch[2].trim()
    };
  }

  // No scene format detected - return as question only
  return { scene: null, question: cleanContent };
}

// Step 3: Answer Validation
// Checks if the user's answer is correct based on question type
export function checkAnswer(
  question: QuizData | undefined,
  userAnswer: {
    fillInAnswer?: string;
    selectedAnswer?: string;
    selectedWords?: string[];
  }
): boolean {
  if (!question) return false;

  const { fillInAnswer, selectedAnswer, selectedWords } = userAnswer;

  // Fill-in-blank check
  // The fill-in-blank component uses selectedAnswer (not fillInAnswer)
  // ✅ FIX: Support both new format (answers array) and legacy format (correctAnswer)
  if (question.type === 'fill-in-blank' || question.type === 'fill-in') {
    const answer = selectedAnswer || fillInAnswer || '';
    const userAnswers = answer.split(', ').map(a => a.toLowerCase().trim());

    // New format: check if user's answers match the expected answers array
    if (question.answers && Array.isArray(question.answers)) {
      const expectedAnswers = question.answers.map(a => a.toLowerCase().trim());
      return userAnswers.length === expectedAnswers.length &&
             userAnswers.every((ua, i) => ua === expectedAnswers[i]);
    }

    // Legacy format: single correctAnswer
    if (question.correctAnswer) {
      const correctAnswers = Array.isArray(question.correctAnswer)
        ? question.correctAnswer
        : [question.correctAnswer];
      const expectedAnswers = correctAnswers.map(a => a.toLowerCase().trim());
      return userAnswers.length === expectedAnswers.length &&
             userAnswers.every((ua, i) => ua === expectedAnswers[i]);
    }

    return false;
  }

  // Multiple choice and scenario check
  // ✅ FIX: Support both 'correctAnswer' and 'correct' fields
  if (question.type === 'multiple-choice' || question.type === 'scenario') {
    const correctAnswer = question.correctAnswer || (question as any).correct;
    return selectedAnswer === correctAnswer;
  }

  // Sentence building check
  if (question.type === 'sentence-building') {
    const userSentence = selectedWords?.join(' ').toLowerCase().trim() || '';
    const correctSentence = question.correctSentence?.toLowerCase().trim() || '';
    return userSentence === correctSentence;
  }

  return false;
}

// Step 4: Get Sequential Motivational Message
// Returns a motivational message based on question index
// Each question gets a different message in rotation
let messageIndex = 0;
export function getMotivationalMessage(): string {
  const messages = [
    'Perfect!',
    'Correct!',
    'Amazing!',
    'Awesome!',
    'Excellent!',
    'Great job!',
    'Well done!',
    'Fantastic!',
    'Outstanding!',
    'Brilliant!',
    'Superb!',
    'Nice catch!',
  ];

  const message = messages[messageIndex % messages.length];
  messageIndex++;
  return message;
}

// Reset message index (called when starting new lesson)
export function resetMotivationalMessages(): void {
  messageIndex = 0;
}

// Step 5: Calculate Mistake Severity
// Determines if a wrong answer is "close" or completely wrong
// Used for "So close" vs "Incorrect" feedback
export function isCloseAnswer(
  question: QuizData | undefined,
  userAnswer: {
    selectedWords?: string[];
  }
): boolean {
  if (!question) return false;

  // Only applies to sentence building
  if (question.type !== 'sentence-building' || !userAnswer.selectedWords) {
    return false;
  }

  const userWords = userAnswer.selectedWords;
  const correctWords = question.correctSentence?.split(' ') || [];

  // Check if same words but different order
  const userWordsSorted = [...userWords].sort().join(' ');
  const correctWordsSorted = [...correctWords].sort().join(' ');

  if (userWordsSorted === correctWordsSorted) {
    return true; // Same words, just wrong order
  }

  // Check if only 1 word difference
  const correctSet = new Set(correctWords);
  const wrongWords = userWords.filter(word => !correctSet.has(word));

  return wrongWords.length === 1; // Only 1 wrong word
}

// ✅ In this file we achieved:
// A centralized location for all utility functions used in the lesson system.
// This makes the code more maintainable and reusable across components.
