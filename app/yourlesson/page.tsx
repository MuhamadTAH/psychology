// 🧠 FILE PURPOSE
// This is the main lesson page that displays questions in a continuous flow.
// It supports 3 question types: fill-in-blank, matching, and multiple-choice.
// No stages - all questions are mixed together in one continuous lesson.

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FinalScore } from "./components/FinalScore";
import { StreakBadge } from "@/components/StreakBadge";
import { useStreakTimeline } from "@/md/lib/streakStateMachine";
import { getStreakTier } from "@/md/lib/streakFxConfig";
import { GlowPulse } from "@/components/streak-fx/GlowPulse";
import { ShineSweep } from "@/components/streak-fx/ShineSweep";
import { SparkleParticles } from "@/components/streak-fx/SparkleParticles";
import { RingPing } from "@/components/streak-fx/RingPing";
import { AuraHalo } from "@/components/streak-fx/AuraHalo";
import { MilestoneAnimation } from "@/components/MilestoneAnimation";

// Step 1: Define TypeScript interfaces for question types
// These interfaces ensure type safety for all question data structures
interface QuizData {
  type?: string;
  question: string;
  // True-false fields
  statement?: string; // true-false questions use 'statement' instead of 'question'
  // Fill-in-blank fields
  sentence?: string; // fill-in questions use 'sentence' instead of 'question'
  answers?: string[]; // fill-in questions use 'answers' array for multiple blanks
  correctAnswer?: string;
  wrongOptions?: string[];
  explanation?: string;
  // Multiple choice fields
  options?: Array<{ id: string; text: string }>;
  // Matching fields
  pairs?: { [key: string]: string };
  columnA?: Array<{ id: string; text: string }>;
  columnB?: Array<{ id: string; text: string }>;
  correctPairs?: { [key: string]: string };
  // Sentence building fields
  words?: string[]; // Available words to build sentence
  correctSentence?: string; // The correct sentence order
  // Micro-Sim fields
  scenarioTitle?: string;
  steps?: Array<{
    scene?: string;
    question?: string;
    options: string[];
    correct: string;
    feedback: {
      correct: string;
      incorrect: string;
    };
  }>;
}

export default function YourLessonPage() {
  const router = useRouter();
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const userEmail = isSignedIn
    ? (user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || null)
    : null;
  const shouldLoadUserData = isUserLoaded && isSignedIn;

  // Step 1.5: Helper function to get question text (supports 'question', 'prompt', 'statement')
  const getQuestionText = (question: any): string => {
    return question.question || (question as any).prompt || question.statement || '';
  };

  // Step 1.6: Helper function to get case description/scene (supports 'caseDescription' and 'scene')
  const getCaseDescription = (question: any): string => {
    return (question as any).caseDescription || question.scene || '';
  };

  // Step 2: Setup state management for the lesson
  // These states track the current question, answers, and lesson progress
  const [allQuestions, setAllQuestions] = useState<QuizData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Answer states for different question types
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null); // For multiple choice
  const [fillInAnswer, setFillInAnswer] = useState(''); // For fill-in-blank (single blank - legacy)
  const [fillInAnswers, setFillInAnswers] = useState<string[]>([]); // For fill-in (multiple blanks)
  const [shuffledFillInOptions, setShuffledFillInOptions] = useState<string[]>([]); // Shuffled options for fill-in-blank

  // Matching question states
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<{ [key: string]: string }>({});
  const [wrongMatch, setWrongMatch] = useState<{ term: string, definition: string } | null>(null);
  const [selectedColumnA, setSelectedColumnA] = useState<string | null>(null);
  const [shuffledDefinitions, setShuffledDefinitions] = useState<string[]>([]); // Shuffled definitions for matching

  // Sentence building question states
  const [selectedWords, setSelectedWords] = useState<string[]>([]); // Words user has selected
  const [availableWords, setAvailableWords] = useState<string[]>([]); // Words still available to select
  const [draggedWordIndex, setDraggedWordIndex] = useState<number | null>(null); // Track which word is being dragged from selected
  const [draggedAvailableIndex, setDraggedAvailableIndex] = useState<number | null>(null); // Track which word is being dragged from available
  const [draggedBlankIndex, setDraggedBlankIndex] = useState<number | null>(null); // Track which fill-in blank is being dragged

  // Micro-Sim (chat-style conversation) states
  const [microSimStep, setMicroSimStep] = useState(0); // Current step in the micro-sim
  const [chatHistory, setChatHistory] = useState<Array<{ speaker: 'villain' | 'user'; text: string }>>([]); // Chat conversation history

  // Lesson metadata
  const [currentLessonNumber, setCurrentLessonNumber] = useState<number | null>(null);
  const [hadWrongAttempt, setHadWrongAttempt] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<Array<{ questionIndex: number, question: string, userAnswer: string, correctAnswer: string }>>([]);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<any[]>([]);

  // Step: Sound effects state
  // Audio objects for playing sound effects during the lesson
  const [soundEffects] = useState(() => {
    if (typeof window === 'undefined') return {
      startLesson: null,
      changingExercise: null,
      lessonComplete: null,
      correctAnswer: null,
      wrongAnswer: null,
    };


    return {
      startLesson: new Audio('/sounds/start-lesson.mp3'),
      changingExercise: new Audio('/sounds/changing-exercise.mp3'),
      lessonComplete: new Audio('/sounds/lesson-complete.mp3'),
      correctAnswer: new Audio('/sounds/correct-answer.mp3'),
      wrongAnswer: new Audio('/sounds/wrong-answer.mp3'),
    };
  });

  const [lessonCategory, setLessonCategory] = useState<string | null>(null);
  const [darkPsychLessonId, setDarkPsychLessonId] = useState<string | null>(null);

  // Step: Video animation state for character
  // This controls which part of the video plays based on user state
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [currentAnimation, setCurrentAnimation] = useState<'thinking' | 'correct' | 'wrong'>('thinking');

  // Step: Streak badge celebration state
  // Shows the streak badge overlay when user completes first lesson of the day
  const [showStreakBadge, setShowStreakBadge] = useState(false);
  const [celebrationStreak, setCelebrationStreak] = useState(0);
  const [streakFreezeUsed, setStreakFreezeUsed] = useState(false);

  // Step: Exercise transition animation state
  // Controls fade out and slide in animations when switching exercises
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Step: Motivational message state
  // Store the selected motivational message to prevent it from changing on every render
  const [motivationalMessage, setMotivationalMessage] = useState('');

  // Step: Track last logged UI mode to prevent repeated logs
  const [lastLoggedMode, setLastLoggedMode] = useState<string>('');

  // Step: Retry wrong answers state
  // Track if we're in retry mode for wrong answers
  const [isRetryMode, setIsRetryMode] = useState(false);
  const [retryQuestions, setRetryQuestions] = useState<QuizData[]>([]);

  // Step: Lesson Part Progression State
  // Track which part of the lesson the user is currently on (0, 1, 2...)
  const [activePartIndex, setActivePartIndex] = useState(0);
  const [totalLessonParts, setTotalLessonParts] = useState(1);

  // Step 3: Load data from Convex backend
  // Query lessons and user stats from the database
  const lessons = useQuery(api.lessons.getUserLessons, shouldLoadUserData ? {} : "skip");
  const progress = useQuery(api.lessons.getUserProgress, shouldLoadUserData ? {} : "skip");
  const userStats = useQuery(api.gamification.getUserStats, shouldLoadUserData ? {} : "skip");

  // Query Dark Psychology lessons if this is a Dark Psychology lesson
  const darkPsychLessons = useQuery(
    api.lessons.getAllDarkPsychologyLessons,
    lessonCategory === 'dark-psychology' && shouldLoadUserData ? {} : "skip"
  );

  const loseHeartMutation = useMutation(api.gamification.loseHeart);
  const addXPMutation = useMutation(api.gamification.addXP);
  const updateStreakMutation = useMutation(api.gamification.updateStreak);
  const updateLessonProgressMutation = useMutation(api.lessons.updateLessonProgress);

  // Record completion of a Dark Psychology lesson part so the map ring fills segment-by-segment.
  const markDarkPsychPartComplete = async (partNumber: number) => {
    if (!darkPsychLessonId || !shouldLoadUserData) return;

    try {
      await updateLessonProgressMutation({
        lessonNumber: partNumber,
        darkPsychLessonId: `${darkPsychLessonId}-Part${partNumber}`,
        stage: "completed",
        score: correctAnswers,
        mistakes: wrongAnswers,
        isCompleted: true,
        currentPart: partNumber,
        completedParts: [partNumber],
        totalParts: totalLessonParts,
      });
    } catch (error) {
      // If progress fails, don't block the UI; the next lesson tap can retry.
    }
  };

  // Step: Initialize streak timeline for badge celebration
  // Use celebrationStreak when showing badge, otherwise use current streak
  const { timeline, triggerCelebrate, triggerMilestone } = useStreakTimeline(
    celebrationStreak || userStats?.streak || 0,
    'idle'
  );

  // Get tier config for the celebration streak
  const celebrationTierConfig = getStreakTier(celebrationStreak || 0);

  // Step 4: Initialize lesson from localStorage
  // Get the current lesson number and user email
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lessonNum = localStorage.getItem('currentLessonNumber');
      if (lessonNum) {
        setCurrentLessonNumber(parseInt(lessonNum));
      }

      // Load lesson category and Dark Psychology lesson ID
      const category = localStorage.getItem('lessonCategory');
      setLessonCategory(category);

      const dpLessonId = localStorage.getItem('darkPsychLessonId');
      if (dpLessonId) {
        setDarkPsychLessonId(dpLessonId);
      }

      // Dark Psychology Quiz Mode: load quiz questions from localStorage
      const quizQuestions = localStorage.getItem('quizQuestions');
      if (quizQuestions) {
        const parsed = JSON.parse(quizQuestions);
        setAllQuestions(parsed);
        return; // Skip other loading logic
      }

      // Dark Psychology Review Mode: load review questions from localStorage
      const reviewQuestions = localStorage.getItem('reviewQuestions');
      if (reviewQuestions) {
        const parsed = JSON.parse(reviewQuestions);
        setAllQuestions(parsed);
        return; // Skip other loading logic
      }

      // Legacy support: check for old quiz format
      const stored = localStorage.getItem('currentQuiz');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setAllQuestions(parsed);
        } else {
          setAllQuestions([parsed]);
        }
      }
    }
  }, []);

  // Helper function to split question into scene and question parts
  const parseQuestionText = (text: string) => {
    const parts = text.split('\n\n');
    if (parts.length >= 2) {
      // Remove "Scenario:" prefix if present
      let scene = parts[0];
      if (scene.startsWith('Scenario:')) {
        scene = scene.replace(/^Scenario:\s*/i, '');
      }
      return {
        scene: scene,
        question: parts.slice(1).join('\n\n')
      };
    }
    return { scene: null, question: text };
  };

  // Helper function to render markdown-style bold and italic text
  const renderTextWithBold = (text: string) => {
    // Handle undefined/null text
    if (!text) return '';

    // Split by **bold**, *italic*, and (parentheses) patterns
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\(.*?\))/g);
    return parts.map((part, index) => {
      // Skip empty or undefined parts
      if (!part) return null;

      // Handle **bold** (double asterisks)
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`bold-${index}`}>{part.slice(2, -2)}</strong>;
      }
      // Handle *italic* (single asterisks)
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={`italic-${index}`}>{part.slice(1, -1)}</em>;
      }
      // Handle (parentheses) as bold anchors - key concepts
      if (part.startsWith('(') && part.endsWith(')') && part.length > 2) {
        return <span key={`parens-${index}`}>(<strong className="text-blue-400">{part.slice(1, -1)}</strong>)</span>;
      }
      return <span key={`text-${index}`}>{part}</span>;
    });
  };

  // Helper function for options - plain text without parentheses styling
  const renderOptionText = (text: string) => {
    // Handle undefined/null text
    if (!text) return '';

    // Split by **bold** and *italic* patterns only (no parentheses)
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
      // Skip empty or undefined parts
      if (!part) return null;

      // Handle **bold** (double asterisks)
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`bold-${index}`}>{part.slice(2, -2)}</strong>;
      }
      // Handle *italic* (single asterisks)
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={`italic-${index}`}>{part.slice(1, -1)}</em>;
      }
      return <span key={`text-${index}`}>{part}</span>;
    });
  };

  // Step: Determine UI Mode based on exercise type
  // This function decides which UI mode to use: Combat, Training, or Puzzle
  const getUIMode = (question: QuizData) => {
    // Combat Mode: scenario-based exercises with scene OR micro-sim
    if (question.type === 'micro-sim') return 'combat';
    if (question.type === 'scenario' || (parseQuestionText(question.question).scene !== null)) {
      return 'combat';
    }

    // Combat Mode: reverse-scenario (has answer OR scene field that becomes the scene)
    if (question.type === 'reverse-scenario' && ((question as any).answer || (question as any).scene)) {
      return 'combat';
    }

    // Combat Mode: multiple-choice, fill-in, or scenario that should be auto-converted (has only question, no scene/caseDescription)
    const questionTextRaw = getQuestionText(question);
    const parsed = parseQuestionText(questionTextRaw);
    const caseDesc = getCaseDescription(question);
    const shouldAutoConvert = (question.type === 'multiple-choice' || question.type === 'fill-in' || question.type === 'scenario')
      && !caseDesc && !parsed.scene;
    if (shouldAutoConvert) return 'combat';

    // Puzzle Mode: matching exercises
    if (question.type === 'matching') return 'puzzle';

    // Training Mode: all other types (true-false, etc.)
    return 'training';
  };

  // Step 5: Load and combine all questions from lesson data
  // Merge practice and quiz questions into one continuous array
  useEffect(() => {
    // Handle Dark Psychology lessons
    if (lessonCategory === 'dark-psychology' && darkPsychLessons && darkPsychLessonId) {
      const lessonParts = darkPsychLessons.filter((l: any) => {
        const lessonData = l.lessonJSON || l.content;
        const lessonId = lessonData?.lessonId;
        return lessonId && lessonId === darkPsychLessonId;
      });

      if (lessonParts.length > 0) {
        lessonParts.sort((a: any, b: any) => {
          const partA = (a.lessonJSON || a.content)?.lessonPart || 0;
          const partB = (b.lessonJSON || b.content)?.lessonPart || 0;
          return partA - partB;
        });

        const combinedQuestions: QuizData[] = [];

        // Step: Play start lesson sound when questions are loaded
        // This plays only once when the lesson begins
        if (soundEffects.startLesson && currentQuestionIndex === 0) {
          soundEffects.startLesson.play().catch(() => { });
        }

        // Determine current part based on localStorage
        let currentPart = activePartIndex || 0;
        if (typeof window !== 'undefined' && darkPsychLessonId) {
          const savedPart = localStorage.getItem(`lesson_progress_${darkPsychLessonId}`);
          const savedIndex = savedPart ? parseInt(savedPart, 10) : null;
          // Prefer in-memory activePartIndex (from Continue) if it is ahead of saved progress
          if (savedIndex !== null) {
            currentPart = Math.max(activePartIndex, savedIndex);
          }
          // Ensure we don't go out of bounds if lesson structure changed
          if (currentPart >= lessonParts.length) {
            currentPart = lessonParts.length - 1; // Cap at last part
            if (currentPart > lessonParts.length - 1) currentPart = lessonParts.length - 1;
          }
        }
        setActivePartIndex(currentPart);
        setTotalLessonParts(lessonParts.length);


        // ONLY process the SINGLE active part
        const activeLessonPart = lessonParts[currentPart];
        const data = activeLessonPart?.lessonJSON || activeLessonPart?.content;


        if (data) {
          // Process just this part (previously we looped through all parts)
          if (data?.contentScreens && Array.isArray(data.contentScreens)) {
            data.contentScreens.forEach((screen: any, screenIndex: number) => {


              if (screen.exercises && Array.isArray(screen.exercises)) {
                screen.exercises.forEach((exercise: any, exerciseIndex: number) => {
                  // Step: Handle micro-sim exercises specially
                  // Micro-sims have a "steps" array and use a different data structure
                  // Also handle exercises with scenarioTitle + steps (even without explicit type)
                  if ((exercise.type === 'micro-sim' || exercise.scenarioTitle) && Array.isArray(exercise.steps)) {
                    const microSimQuestion: QuizData = {
                      type: 'micro-sim',
                      question: '', // Not used for micro-sims
                      scenarioTitle: exercise.scenarioTitle || 'Micro-Simulation',
                      steps: exercise.steps, // Keep the original steps array
                    };
                    combinedQuestions.push(microSimQuestion);
                    return; // Skip the rest of the processing
                  }

                  // Step: Handle regular exercises (multiple-choice, scenario, etc.)
                  // Different question types use different field names:
                  // - 'true-false' uses 'statement' instead of 'question'
                  // - 'fill-in' uses 'sentence' instead of 'question'
                  // - Most others use 'question'
                  let baseQuestionText = exercise.question || exercise.statement || exercise.sentence || '';

                  const questionText = exercise.scene
                    ? `${exercise.scene}\n\n${baseQuestionText}`
                    : baseQuestionText;

                  const formattedOptions = Array.isArray(exercise.options)
                    ? exercise.options.map((opt: any, idx: number) =>
                      typeof opt === 'string'
                        ? { id: String.fromCharCode(65 + idx), text: opt }
                        : opt
                    )
                    : [];

                  const correctAnswerText = exercise.correct || exercise.correctAnswer;
                  const correctAnswerId = formattedOptions.find((opt: any) => opt.text === correctAnswerText)?.id || correctAnswerText;

                  let pairsObject: { [key: string]: string } | undefined;
                  if (exercise.type === 'matching' && Array.isArray(exercise.pairs)) {
                    pairsObject = {};
                    exercise.pairs.forEach((pair: any) => {
                      if (pair.term && pair.definition) {
                        pairsObject![pair.term] = pair.definition;
                      }
                    });
                  }

                  const wordsArray = exercise.type === 'build-sentence' && Array.isArray(exercise.words)
                    ? exercise.words
                    : undefined;

                  const standardQuestion: QuizData = {
                    type: exercise.type || 'multiple-choice',
                    question: questionText.trim(),
                    options: formattedOptions,
                    correctAnswer: correctAnswerId,
                    explanation: exercise.feedback?.correct || exercise.explanation,
                    pairs: pairsObject,
                    words: wordsArray,
                    correctSentence: exercise.type === 'build-sentence' ? correctAnswerText : undefined,
                    // Copy answers array for fill-in questions
                    answers: exercise.type === 'fill-in' && Array.isArray(exercise.answers) ? exercise.answers : undefined,
                    // Copy sentence for fill-in questions
                    sentence: exercise.sentence,
                  };

                  // Check if question should be added
                  const shouldAdd = standardQuestion.question || pairsObject || wordsArray;

                  if (shouldAdd) {
                    combinedQuestions.push(standardQuestion);
                  }
                });
              }
            });
          }

          setAllQuestions(combinedQuestions);
          return;
        }
      }
    }

    // Handle regular lessons
    if (lessons && currentLessonNumber && lessonCategory !== 'dark-psychology') {
      const lesson = lessons.find(l => l.lessonNumber === currentLessonNumber);

      if (lesson) {
        const data = lesson.lessonJSON || lesson.content;
        const combinedQuestions = [];

        if (data?.practice && data.practice.length > 0) {
          combinedQuestions.push(...data.practice);
        }

        if (data?.quiz && data.quiz.length > 0) {
          const filteredQuiz = data.quiz.filter((q: QuizData) => q.type !== 'true-false');
          combinedQuestions.push(...filteredQuiz);
        }

        setAllQuestions(combinedQuestions);
      }
    }
  }, [lessons, currentLessonNumber, lessonCategory, darkPsychLessons, darkPsychLessonId, activePartIndex]);

  const currentQuestion = isRetryMode
    ? retryQuestions[currentQuestionIndex]
    : allQuestions[currentQuestionIndex];

  // Safety check: if in retry mode but no retry questions, exit retry mode
  if (isRetryMode && retryQuestions.length === 0) {
    setIsRetryMode(false);
  }

  // Step 5.5: Control video animation based on state
  // Play different segments of the video for thinking, correct, or wrong states
  useEffect(() => {
    if (!videoRef) return;

    let isInitialized = false;

    const handleTimeUpdate = () => {
      if (!isInitialized) return; // Don't check until initial seek is done

      if (currentAnimation === 'thinking') {
        // Loop thinking animation (0 to 6.15s)
        if (videoRef.currentTime >= 6.15) {
          videoRef.currentTime = 0;
        }
      } else if (currentAnimation === 'correct') {
        // Play correct animation once (19.15 to 22.12s)
        if (videoRef.currentTime >= 22.12) {
          videoRef.pause();
          setCurrentAnimation('thinking');
        }
      } else if (currentAnimation === 'wrong') {
        // Play wrong animation once (15.30 to 18.15s)
        if (videoRef.currentTime >= 18.15) {
          videoRef.pause();
          setCurrentAnimation('thinking');
        }
      }
    };

    // Set initial time and play
    const initializeAnimation = async () => {
      // Check if video element is still in the DOM
      if (!videoRef.isConnected) return;

      if (currentAnimation === 'thinking') {
        videoRef.currentTime = 0;
      } else if (currentAnimation === 'correct') {
        videoRef.currentTime = 19.15;
      } else if (currentAnimation === 'wrong') {
        videoRef.currentTime = 15.30;
      }

      // Wait a bit for the seek to complete, then mark as initialized
      setTimeout(() => {
        // Check again before playing
        if (videoRef.isConnected) {
          isInitialized = true;
          videoRef.play().catch(() => {
            // Silently handle play interruption
          });
        }
      }, 50);
    };

    initializeAnimation();
    videoRef.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      videoRef.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentAnimation, videoRef]);

  // Step 6: Shuffle definitions when question changes (for matching questions)
  // This prevents answers from being displayed in order
  useEffect(() => {
    // Shuffle standard multiple choice options
    if (currentQuestion?.options && currentQuestion.options.length > 0) {
      const shuffled = [...currentQuestion.options];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledOptions(shuffled);
    } else {
      setShuffledOptions([]);
    }

    // Shuffle fill-in-blank options
    if (currentQuestion?.type === 'fill-in-blank' && (currentQuestion.wrongOptions || currentQuestion.correctAnswer)) {
      const options = [currentQuestion.correctAnswer, ...(currentQuestion.wrongOptions || [])].filter(Boolean) as string[];
      const shuffled = [...options];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledFillInOptions(shuffled);
    }

    if (currentQuestion?.type === 'matching' && currentQuestion.pairs) {
      const definitions = Object.values(currentQuestion.pairs);
      // Fisher-Yates shuffle algorithm
      const shuffled = [...definitions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledDefinitions(shuffled);
    }

    // Initialize sentence building question words (supports both types)
    if ((currentQuestion?.type === 'sentence-building' || currentQuestion?.type === 'build-sentence') && currentQuestion.words) {
      // Lowercase all words to prevent capitalization cheat (unless proper nouns)
      const lowercasedWords = currentQuestion.words.map(word => {
        // Keep proper nouns capitalized (e.g., NLP, Gaslighting as technique names)
        if (word === word.toUpperCase() || word.match(/^[A-Z]{2,}/)) {
          return word; // Keep acronyms like NLP
        }
        return word.toLowerCase();
      });

      // Add 2 distractor words to make it harder
      const distractors = ['reality', 'truth', 'mind', 'thought', 'belief', 'perception', 'experience', 'behavior'];
      const randomDistractors = distractors
        .filter(d => !lowercasedWords.includes(d)) // Don't add words already in the sentence
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      // Combine correct words with distractors
      const allWords = [...lowercasedWords, ...randomDistractors];

      // Shuffle the available words
      const shuffled = [...allWords];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setAvailableWords(shuffled);
      setSelectedWords([]);
    }
  }, [currentQuestionIndex, currentQuestion]);

  // Step 7: Check if lesson is already completed
  // Used to determine if user should lose hearts or gain XP
  const isLessonAlreadyCompleted = () => {
    if (!progress || !currentLessonNumber) return false;
    return progress.some(p => p.lessonNumber === currentLessonNumber && p.isCompleted);
  };

  const canAnswer = (userStats?.hearts || 5) > 0 || isLessonAlreadyCompleted();


  // ✅ In this section we achieved:
  // Loaded all lesson data and combined questions from practice and quiz into one array

  // Step 7: Handle answer checking for all question types
  // Check if the user's answer is correct based on question type
  const handleCheckAnswer = async () => {
    // Step: Prevent checking sentence building with no words selected
    // This ensures user must select at least one word before checking
    if ((currentQuestion.type === 'sentence-building' || currentQuestion.type === 'build-sentence') && selectedWords.length === 0) {
      return;
    }

    setIsChecked(true);

    let isCorrect = false;
    let userAnswer = '';

    // Check answer based on question type
    if (currentQuestion.type === 'micro-sim' && currentQuestion.steps) {
      // Micro-Sim: check if selected answer matches correct answer for current step
      const currentStep = currentQuestion.steps[microSimStep];
      if (currentStep && selectedAnswer) {
        const selectedOptionIndex = selectedAnswer.charCodeAt(0) - 65; // A=0, B=1, etc.
        const selectedOptionText = currentStep.options[selectedOptionIndex];
        isCorrect = selectedOptionText === currentStep.correct;
        userAnswer = selectedOptionText;
      }
    } else if (currentQuestion.type === 'fill-in-blank') {
      isCorrect = fillInAnswer.toLowerCase().trim() === currentQuestion.correctAnswer?.toLowerCase().trim();
      userAnswer = fillInAnswer;
    } else if (currentQuestion.type === 'fill-in') {
      // Step: Check fill-in answers by comparing arrays in order
      // User must select the correct words in the correct sequence
      if (currentQuestion.answers && fillInAnswers.length === currentQuestion.answers.length) {
        isCorrect = fillInAnswers.every((answer, index) =>
          answer.toLowerCase().trim() === currentQuestion.answers![index].toLowerCase().trim()
        );
        userAnswer = fillInAnswers.join(', ');
      }
    } else if (currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'scenario' || currentQuestion.type === 'true-false' || currentQuestion.type === 'reverse-scenario' || currentQuestion.type === 'boss-scenario' || currentQuestion.type === 'ethical-dilemma' || currentQuestion.type === 'case-analysis') {
      isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
      userAnswer = selectedAnswer || '';
    } else if (currentQuestion.type === 'sentence-building' || currentQuestion.type === 'build-sentence') {
      // Join selected words with spaces and compare to correct sentence
      const userSentence = selectedWords.join(' ').toLowerCase().trim();
      const correctSentence = currentQuestion.correctSentence?.toLowerCase().trim() || '';
      isCorrect = userSentence === correctSentence;
      userAnswer = selectedWords.join(' ');
    }

    if (isCorrect) {
      // Step: Play correct answer sound
      // Positive audio feedback when user gets the answer right
      if (soundEffects.correctAnswer) {
        soundEffects.correctAnswer.play().catch(() => { });
      }

      // Correct answer - add XP if first try and lesson not completed
      setCorrectAnswers(correctAnswers + 1);
      // Trigger correct animation
      setCurrentAnimation('correct');

      // Step: Set random motivational message once
      // This prevents the message from changing on every render
      const messages = ['Nice catch!', 'Correct!', 'Awesome!', 'Amazing!', 'Perfect!', 'Excellent!', 'Great job!', 'Well done!'];
      setMotivationalMessage(messages[Math.floor(Math.random() * messages.length)]);

      if (!hadWrongAttempt && !isLessonAlreadyCompleted()) {
        try {
          if (isSignedIn) {
            await addXPMutation({ amount: 5 });
          }
        } catch (error) {
          // Error adding XP
        }
      }
    } else {
      // Step: Play wrong answer sound
      // Negative audio feedback when user gets the answer wrong
      if (soundEffects.wrongAnswer) {
        soundEffects.wrongAnswer.volume = 1.0; // Full volume for wrong answers
        soundEffects.wrongAnswer.play().catch(() => { });
      }

      // Wrong answer - lose heart and XP
      setHadWrongAttempt(true);
      // Trigger wrong animation
      setCurrentAnimation('wrong');

      if (currentLessonNumber && isSignedIn) {
        try {
          const lesson = lessons?.find(l => l.lessonNumber === currentLessonNumber);
          if (lesson) {
            await loseHeartMutation({ lessonId: lesson._id });
          }
        } catch (error) {
          // Error losing heart
        }
      }

      try {
        if (isSignedIn) {
          await addXPMutation({ amount: -5 });
        }
      } catch (error) {
        // Error subtracting XP
      }

      // Track wrong answer for reinforcement
      setWrongAnswers([...wrongAnswers, {
        questionIndex: currentQuestionIndex,
        question: getQuestionText(currentQuestion),
        userAnswer: userAnswer,
        correctAnswer: currentQuestion.correctAnswer || ''
      }]);
    }
  };

  // Step 8: Handle moving to next question
  // Reset all states and move to next question or show final score
  const handleNext = async () => {
    // Micro-Sim: Handle step progression within the same question
    if (currentQuestion.type === 'micro-sim' && currentQuestion.steps) {
      const currentStep = currentQuestion.steps[microSimStep];

      // Add messages to chat history
      if (currentStep && selectedAnswer) {
        const selectedOptionIndex = selectedAnswer.charCodeAt(0) - 65;
        const selectedOptionText = currentStep.options[selectedOptionIndex];

        // Add villain's message and user's response to chat history
        const newHistory = [
          ...chatHistory,
          { speaker: 'villain' as const, text: getCaseDescription(currentStep) || getQuestionText(currentStep) },
          { speaker: 'user' as const, text: selectedOptionText }
        ];
        setChatHistory(newHistory);
      }

      // Check if there are more steps in the micro-sim
      if (microSimStep < currentQuestion.steps.length - 1) {
        // Move to next step within the same micro-sim
        setMicroSimStep(microSimStep + 1);
        setSelectedAnswer(null);
        setIsChecked(false);
        setHadWrongAttempt(false);
        return; // Stay on the same question
      } else {
        // Micro-sim complete, move to next question
        setMicroSimStep(0);
        setChatHistory([]);
      }
    }

    const questionsArray = isRetryMode ? retryQuestions : allQuestions;
    if (currentQuestionIndex < questionsArray.length - 1) {
      // Step: Hide feedback bar immediately before transition starts
      // This ensures feedback doesn't stay visible during animations
      setIsChecked(false);

      // Step: Start transition animation
      // Fade out current exercise and prepare for slide in
      setIsTransitioning(true);

      // Step: Play changing exercise sound BEFORE moving to next question
      // This makes it feel more immediate and responsive
      if (soundEffects.changingExercise) {
        soundEffects.changingExercise.play().catch(() => { });
      }

      // Wait for fade out animation to complete (300ms)
      setTimeout(() => {
        // Move to next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setFillInAnswer('');
        setFillInAnswers([]); // Reset fill-in multiple blanks
        setHadWrongAttempt(false);
        // Reset to thinking animation for next question
        setCurrentAnimation('thinking');
        // Reset matching states
        setSelectedColumnA(null);
        setMatchedPairs({});
        setSelectedTerm(null);
        setWrongMatch(null);
        setShuffledDefinitions([]); // Will be re-shuffled by useEffect
        // Reset sentence building states
        setSelectedWords([]);
        setAvailableWords([]); // Will be re-shuffled by useEffect
        setDraggedWordIndex(null);
        setDraggedAvailableIndex(null);

        // End transition immediately so new question can slide in
        setIsTransitioning(false);
      }, 300);
    } else {
      // Check if we should start retry mode
      if (!isRetryMode && wrongAnswers.length > 0) {
        // Build retry questions from wrong answers
        const retry = wrongAnswers.map(wa => allQuestions[wa.questionIndex]);
        setRetryQuestions(retry);
        setIsRetryMode(true);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setFillInAnswer('');
        setFillInAnswers([]);
        setIsChecked(false);
        setHadWrongAttempt(false);
        setWrongAnswers([]); // Clear wrong answers for retry round

        // Reset matching states
        setSelectedColumnA(null);
        setMatchedPairs({});
        setSelectedTerm(null);
        setWrongMatch(null);
        setShuffledDefinitions([]);

        // Reset sentence building states
        setSelectedWords([]);
        setAvailableWords([]);
        setDraggedWordIndex(null);
        setDraggedAvailableIndex(null);

        return; // Don't show final score yet
      }

      // Step: Play lesson complete sound
      // Celebration sound when user finishes all questions
      if (soundEffects.lessonComplete) {
        soundEffects.lessonComplete.play().catch(() => { });
      }

      // Step: Handle Dark Psychology Segment Progression
      // If the lesson has multiple parts, we check if the user just finished a part
      // but hasn't finished the WHOLE lesson yet.
      if (lessonCategory === 'dark-psychology' && darkPsychLessonId) {
        const currentPartNumber = activePartIndex + 1;
        await markDarkPsychPartComplete(currentPartNumber);

        const nextPart = activePartIndex + 1;

        if (typeof window !== 'undefined') {
          localStorage.setItem(`lesson_progress_${darkPsychLessonId}`, nextPart.toString());
        }

        // If NOT the last part, stop here (don't mark full lesson as complete)
        if (activePartIndex < totalLessonParts - 1) {
          setShowFinalScore(true); // Show score screen ("Lesson Complete")
          // When they click "Back", they go to map. 
          // Clicking lesson again loads next part from localStorage.
          return;
        }
      }

      // Step 8a: Lesson completed - mark as completed and update streak
      // This unlocks the next lesson in the learning path
      try {
        if (isSignedIn && currentLessonNumber) {
          const lesson = lessons?.find(l => l.lessonNumber === currentLessonNumber);
          if (lesson) {
            // Mark lesson as completed so next lesson unlocks
            await updateLessonProgressMutation({
              lessonId: lesson._id,
              lessonNumber: currentLessonNumber,
              stage: "completed",
              score: correctAnswers,
              mistakes: wrongAnswers,
              isCompleted: true,
            });
          }

          // Update daily streak and show celebration
          const streakResult = await updateStreakMutation({});

          // Show streak badge celebration if this is first lesson today
          if (streakResult && !streakResult.isToday) {
            const newStreak = streakResult.streak;
            const freezeUsed = (streakResult.streakFreezesUsed ?? 0) > 0;

            setCelebrationStreak(newStreak);
            setStreakFreezeUsed(freezeUsed);
            setShowStreakBadge(true);

            // Check if this is a milestone
            const milestones = [5, 10, 15, 20, 25, 30];
            if (milestones.includes(newStreak)) {
              triggerMilestone(newStreak as 5 | 10 | 15 | 20 | 25 | 30);
            } else {
              triggerCelebrate();
            }

            // Auto-hide badge after animation completes
            setTimeout(() => {
              setShowStreakBadge(false);
            }, 3000);
          }
        }
      } catch (error) {
        // Error completing lesson
      }

      setShowFinalScore(true);
    }
  };

  // Step 9: Handle matching question clicks
  // Check if the selected pair is correct for matching questions
  const handleMatchClick = async (columnAId: string, columnBId: string) => {
    const correctPairs = currentQuestion?.correctPairs || {};

    if (correctPairs[columnAId] === columnBId) {
      // Correct match
      setMatchedPairs({ ...matchedPairs, [columnAId]: columnBId });
      setSelectedColumnA(null);

      // Check if all pairs are matched
      const totalPairs = Object.keys(correctPairs).length;
      if (Object.keys(matchedPairs).length + 1 === totalPairs) {
        setCorrectAnswers(correctAnswers + 1);

        // Award XP for completing matching question
        if (!isLessonAlreadyCompleted() && isSignedIn) {
          try {
            await addXPMutation({ amount: 5 });
          } catch (error) {
            // Error adding XP
          }
        }

        setTimeout(() => handleNext(), 1000);
      }
    } else {
      // Wrong match - flash red
      setWrongFlash(true);
      setTimeout(() => setWrongFlash(false), 500);
      setSelectedColumnA(null);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setFillInAnswer('');
    setIsChecked(false);
    setCorrectAnswers(0);
    setShowFinalScore(false);
    setWrongAnswers([]);
  };

  // ✅ In this section we achieved:
  // Implemented all answer checking logic and navigation between questions

  // Step 10: Render "No Lesson" state
  // Show this if no questions are loaded
  if (!currentQuestion && allQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-[#1F2937] flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-3xl font-bold text-white mb-4">No Lesson Loaded</h1>
          <p className="text-gray-400 mb-6">Please select a lesson from the dashboard</p>

          <Button onClick={() => router.push('/upload')}>Go to Upload</Button>
        </div>
      </div>
    );
  }

  // Step 11: Render final score modal
  // Show results and reinforcement if user got questions wrong
  if (showFinalScore) {
    const hasMorePartsFlag = lessonCategory === 'dark-psychology' && activePartIndex < totalLessonParts - 1;
    const handleBack = () => {
      if (lessonCategory === 'dark-psychology') {
        const storedSection = typeof window !== 'undefined' ? localStorage.getItem('darkPsychSectionId') : null;
        const inferredSection = darkPsychLessonId ? darkPsychLessonId.split('-')[0] : null;
        const sectionId = storedSection || inferredSection || 'B';
        router.push(`/dark-psychology/section/${sectionId}`);
      } else {
        router.push('/dark-psychology-dashboard');
      }
    };
    const currentPartForDisplay = activePartIndex + 1; // show next part label correctly

    return (
      <FinalScore
        correctAnswers={correctAnswers}
        totalQuestions={allQuestions.length}
        wrongAnswers={wrongAnswers}
        totalXP={correctAnswers * 5}
        lessonTime={0}
        lessonId={darkPsychLessonId || undefined}
        lessonNumber={currentLessonNumber || undefined}
        userEmail={userEmail}
        firstTryWrongCount={wrongAnswers.length}
        hasMoreParts={hasMorePartsFlag}
        currentPart={currentPartForDisplay}
        totalParts={totalLessonParts}
        onRetry={handleRestartQuiz}
        onBackToLessons={handleBack}
        onContinueNextPart={() => {
          const nextPartIndex = Math.min(activePartIndex + 1, totalLessonParts - 1);
          const progressKey = darkPsychLessonId ? `lesson_progress_${darkPsychLessonId}` : null;

          if (progressKey && typeof window !== 'undefined') {
            localStorage.setItem(progressKey, nextPartIndex.toString());
          }

          // Prepare to load next part in-place
          setShowFinalScore(false);
          setActivePartIndex(nextPartIndex);
          setCurrentQuestionIndex(0);
          setIsRetryMode(false);
          setRetryQuestions([]);
          setWrongAnswers([]);
          setIsChecked(false);

          // No full refresh; loader effect will pick up new activePartIndex
        }}
      />
    );
  }

  // In this section we achieved:
  // Completed the final score screen with reinforcement for wrong answers

  // Safety check: Don't render if no current question
  if (!currentQuestion) {
    return null;
  }

  // Step 12: Render main lesson interface
  // This is the main UI that shows questions and answer options
  return (
    <div className={`min-h-screen relative transition-all ${wrongFlash ? 'bg-red-500/20' : 'bg-[#1F2937]'}`}>
      {/* CSS for transition animations */}
      <style jsx>{`
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .exercise-fade-out {
          animation: fadeOut 0.3s ease-out forwards;
        }
        .exercise-slide-in {
          animation: slideInFromRight 0.3s ease-out forwards;
        }
      `}</style>
      {/* Step 12a: Top Header - Matches plan.md design */}
      {/* X button, progress bar with XP display, hearts counter */}
      {/* Step 12a: Top Header - Premium Design */}
      <div className="fixed top-0 left-0 right-0 bg-[#1F2937]/90 backdrop-blur-md z-50 border-b border-gray-700/50 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-6">
            {/* Close Button - More subtle hover effect */}
            <button
              onClick={() => {
                if (lessonCategory === 'dark-psychology' && typeof window !== 'undefined') {
                  const sectionId = localStorage.getItem('darkPsychSectionId') || 'B';
                  router.push(`/dark-psychology/section/${sectionId}`);
                } else {
                  router.push('/dark-psychology-dashboard');
                }
              }}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
            >
              <X className="h-6 w-6" strokeWidth={2.5} />
            </button>

            {/* Progress Bar Container - Sleeker design */}
            <div className="flex-1 relative h-3 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="absolute inset-0 bg-[#58CC02] transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(88,204,2,0.4)]"
                style={{ width: `${((currentQuestionIndex + 1) / (isRetryMode ? retryQuestions.length : allQuestions.length)) * 100}%` }}
              >
                {/* Shine effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>
              </div>
            </div>

            {/* Stats Group - Grouped together for better visual flow */}
            <div className="flex items-center gap-4">
              {/* XP Pill - Shows current session earnings */}
              <div className="flex items-center gap-1.5 bg-[#58CC02]/10 px-3 py-1 rounded-full border border-[#58CC02]/20">
                <span className="text-[#58CC02] text-xs font-bold tracking-wider">EXP</span>
                <span className="text-[#58CC02] font-bold text-sm tabular-nums">+{correctAnswers * 5}</span>
              </div>

              {/* Hearts Counter - Premium detailed icon style */}
              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <span className="text-2xl drop-shadow-md">⚡</span>
                  <div className="absolute inset-0 bg-yellow-400/20 blur-sm rounded-full"></div>
                </div>
                <span className="text-white font-bold text-lg tabular-nums">{userStats?.hearts || 5}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-32">
        {/* Step 13: Render UI based on mode (Combat/Training/Puzzle) */}
        {/* This section dynamically switches between three different UI modes */}
        {(() => {
          const uiMode = getUIMode(currentQuestion);

          // Combat Mode: Villain avatar, dark atmosphere, speech bubble
          if (uiMode === 'combat') {
            // Check if this is a micro-sim
            const isMicroSim = currentQuestion.type === 'micro-sim' && currentQuestion.steps;
            const currentStep = isMicroSim ? currentQuestion.steps[microSimStep] : null;

            // Micro-sim: Auto-convert logic for steps
            let microSimScene = '';
            let microSimPrompt = '';
            if (isMicroSim && currentStep) {
              const stepCaseDesc = getCaseDescription(currentStep);
              const stepQuestionText = getQuestionText(currentStep);
              const stepParsed = parseQuestionText(stepQuestionText);

              // Check if step has ONLY scene (no separate question/prompt)
              const hasOnlyScene = stepCaseDesc && !stepQuestionText && !stepParsed.question;

              if (hasOnlyScene) {
                // Auto-convert: scene goes to speech bubble, add generic prompt
                microSimScene = stepCaseDesc;
                microSimPrompt = 'Choose the correct answer';
              } else if (stepCaseDesc) {
                // Has both scene and question
                microSimScene = stepCaseDesc;
                microSimPrompt = stepParsed.question || stepQuestionText;
              } else if (stepQuestionText) {
                // Has only question, treat as scene
                microSimScene = stepQuestionText;
                microSimPrompt = 'Choose your response';
              } else {
                // Fallback
                microSimScene = stepCaseDesc || stepParsed.scene || '';
                microSimPrompt = stepParsed.question || stepQuestionText || 'Choose your response';
              }
            }

            // Regular Scenario: Single scene with static speech bubble
            const questionTextRaw = getQuestionText(currentQuestion);
            const parsed = parseQuestionText(questionTextRaw);
            const caseDesc = getCaseDescription(currentQuestion);

            // Special handling for reverse-scenario: answer field becomes the scene
            let finalScene = '';
            let finalPrompt = '';
            let questionText = '';

            if (currentQuestion.type === 'reverse-scenario' && ((currentQuestion as any).answer || (currentQuestion as any).scene)) {
              // Reverse-scenario: answer/scene goes to speech bubble, question is the prompt
              finalScene = (currentQuestion as any).answer || (currentQuestion as any).scene || '';
              finalPrompt = questionTextRaw || 'What is this?';
              questionText = finalPrompt;
            } else {
              // Auto-convert question to scene for multiple-choice, fill-in, and scenario (if no explicit scene/caseDescription)
              const shouldAutoConvert = (currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'fill-in' || currentQuestion.type === 'scenario')
                && !caseDesc && !parsed.scene;
              finalScene = shouldAutoConvert ? questionTextRaw : (caseDesc || parsed.scene);
              finalPrompt = shouldAutoConvert
                ? (currentQuestion.type === 'multiple-choice' ? 'Choose the correct answer' :
                  currentQuestion.type === 'fill-in' ? 'Complete the sentence' :
                    'Choose your response')
                : parsed.question;
              questionText = finalScene ? finalPrompt : questionTextRaw;
            }

            return (
              <div className="mb-6 md:mb-8">
                {/* Combat Title - Centered */}
                <h2 className="text-xl md:text-2xl font-bold text-red-500 mb-6 md:mb-8 text-center">
                  {isMicroSim ? `⚔️ ${currentQuestion.scenarioTitle || 'Micro-Simulation'}` : '⚔️ Active Practice - Field Scenario'}
                </h2>

                {/* Character and Speech Bubble Container - Absolute Character to prevent layout shift */}
                <div className="relative mb-2 min-h-[200px] md:min-h-[300px]">
                  {/* Character Avatar - Absolute Positioned to hang off the left */}
                  <div className="absolute -left-[100px] md:-left-[100px] -top-30 z-10 opacity-100 pointer-events-none">
                    <div className="w-[350px] h-[350px] md:w-[550px] md:h-[550px] rounded-2xl overflow-hidden bg-transparent opacity-100">
                      <video
                        ref={(ref) => setVideoRef(ref)}
                        className="w-full h-full object-contain opacity-100"
                        muted
                        playsInline
                        style={{ opacity: 1 }}
                      >
                        <source src="/animations/character-standing.mp4" type="video/mp4" />
                        <source src="/animations/character-standing.webm" type="video/webm" />
                      </video>
                    </div>
                  </div>

                  {/* Speech Bubble - Pushed right to clear the character */}
                  <div className={`ml-[160px] md:ml-[280px] pt-12 md:pt-10 transition-all duration-300 relative z-20 ${isTransitioning ? 'exercise-fade-out' : 'exercise-slide-in'}`}>
                    <div className="relative">
                      <div className="bg-[#2a1f1f] rounded-2xl px-5 py-4 md:px-6 md:py-5 shadow-xl border-2 border-red-900/30 relative">
                        {/* Speech bubble pointer */}
                        <div className="absolute left-0 top-16 transform -translate-x-2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-[#2a1f1f]"></div>

                        {/* Micro-sim: Show current step's scene (auto-converted or explicit) */}
                        {isMicroSim && currentStep && microSimScene && (
                          <p className="text-red-200 text-base md:text-lg italic mb-2">
                            {renderTextWithBold(microSimScene)}
                          </p>
                        )}

                        {/* Regular scenario: Scene/caseDescription text (or auto-converted question) */}
                        {!isMicroSim && finalScene && (
                          <p className="text-red-200 text-base md:text-lg italic mb-2">
                            {currentQuestion.type === 'fill-in' && currentQuestion.sentence ? (
                              // For fill-in questions, show sentence with interactive blanks
                              (() => {
                                const normalizedSentence = currentQuestion.sentence
                                  .replace(/_{3,}/g, '(--------)')
                                  .replace(/\([-]+\)/g, '(--------)');
                                const parts = normalizedSentence.split('(--------)');
                                return (
                                  <span className="inline-flex flex-wrap items-center gap-1">
                                    {parts.map((part, index) => (
                                      <span key={index} className="inline-flex flex-wrap items-center gap-1">
                                        <span>{part}</span>
                                        {index < parts.length - 1 && (
                                          <span
                                            onClick={() => {

                                              if (!isChecked && fillInAnswers[index]) {
                                                const newAnswers = [...fillInAnswers];
                                                newAnswers[index] = '';
                                                setFillInAnswers(newAnswers);
                                              } else {
                                              }
                                            }}
                                            className={`inline-flex items-center justify-center px-4 py-1.5 rounded-lg border-2 font-semibold text-sm md:text-base min-w-[140px] transition-all ${fillInAnswers[index]
                                              ? 'bg-[#58CC02] border-[#46A302] text-white cursor-pointer hover:opacity-80 hover:scale-105'
                                              : 'bg-gray-800/50 border-gray-600 text-gray-500 cursor-default border-dashed'
                                              }`}>
                                            {fillInAnswers[index] || '___________'}
                                          </span>
                                        )}
                                      </span>
                                    ))}
                                  </span>
                                );
                              })()
                            ) : (
                              renderTextWithBold(finalScene)
                            )}
                          </p>
                        )}
                        {!isMicroSim && !finalScene && (
                          <p className="text-white text-base md:text-lg font-semibold">{renderTextWithBold(questionTextRaw)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Question Text Area - Consistent Spacing below character/bubble */}
                {/* Only show if we have a separate question line (like in scenarios or auto-converted) */}
                <div className={`min-h-[60px] flex items-center justify-center mb-6 transition-all duration-300 ${isTransitioning ? 'exercise-fade-out' : 'exercise-slide-in'}`}>
                  {/* Micro-sim: Show prompt if scene exists */}
                  {isMicroSim && microSimScene && microSimPrompt && (
                    <p className="text-white text-lg md:text-xl font-bold text-center">
                      {renderTextWithBold(microSimPrompt)}
                    </p>
                  )}
                  {/* Regular scenario: Show prompt if scene exists */}
                  {!isMicroSim && finalScene && questionText && (
                    <p className="text-white text-lg md:text-xl font-bold text-center">
                      {renderTextWithBold(questionText)}
                    </p>
                  )}
                </div>
              </div>
            );
          }

          // Training Mode: Clean cards, lighter background
          if (uiMode === 'training') {
            return (
              <div className="mb-6 md:mb-8">
                {/* Training Title - Centered */}
                <h2 className={`text-xl md:text-2xl font-bold text-blue-400 mb-6 md:mb-8 text-center transition-all duration-300 ${isTransitioning ? 'exercise-fade-out' : 'exercise-slide-in'}`}>
                  📚 Theory Learning - The Lab
                </h2>

                {/* Character and Speech Bubble Container - Absolute Character */}
                <div className="relative mb-2 min-h-[200px] md:min-h-[300px]">
                  {/* Character Avatar - Left Side Absolute - Always visible, no fade */}
                  <div className="absolute -left-[100px] md:-left-[100px] -top-30 z-10 opacity-100 pointer-events-none">
                    <div className="w-[350px] h-[350px] md:w-[550px] md:h-[550px] rounded-2xl overflow-hidden bg-transparent opacity-100">
                      <video
                        ref={(ref) => setVideoRef(ref)}
                        className="w-full h-full object-contain opacity-100"
                        muted
                        playsInline
                        style={{ opacity: 1 }}
                      >
                        <source src="/animations/character-standing.mp4" type="video/mp4" />
                        <source src="/animations/character-standing.webm" type="video/webm" />
                      </video>
                    </div>
                  </div>

                  {/* Speech Bubble - Pushed right */}
                  <div className={`ml-[160px] md:ml-[280px] pt-12 md:pt-10 transition-all duration-300 ${isTransitioning ? 'exercise-fade-out' : 'exercise-slide-in'}`}>
                    <div className="relative">
                      <div className="bg-[#1e2a3a] rounded-2xl px-5 py-4 md:px-6 md:py-5 shadow-xl border-2 border-blue-900/30 relative">
                        {/* Speech bubble pointer */}
                        <div className="absolute left-0 top-16 transform -translate-x-2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-[#1e2a3a]"></div>
                        {/* Question text */}
                        <p className="text-white text-base md:text-lg font-semibold leading-relaxed">
                          {currentQuestion.type === 'fill-in' && currentQuestion.sentence ? (
                            // For fill-in questions, show sentence with blanks that fill in as user selects words
                            (() => {
                              // Convert ___ to (--------) for consistency
                              const normalizedSentence = currentQuestion.sentence
                                .replace(/_{3,}/g, '(--------)')
                                .replace(/\([-]+\)/g, '(--------)');
                              const parts = normalizedSentence.split('(--------)');
                              return (
                                <span className="inline-flex flex-wrap items-center gap-1">
                                  {parts.map((part, index) => (
                                    <span key={index} className="inline-flex flex-wrap items-center gap-1">
                                      <span>{part}</span>
                                      {index < parts.length - 1 && (
                                        <span
                                          draggable={!isChecked && !!fillInAnswers[index]}
                                          onDragStart={(e) => {
                                            if (!isChecked && fillInAnswers[index]) {
                                              setDraggedBlankIndex(index);
                                              e.dataTransfer.effectAllowed = 'move';
                                            }
                                          }}
                                          onDragEnd={() => {
                                            setDraggedBlankIndex(null);
                                          }}
                                          onDragOver={(e) => {
                                            e.preventDefault();
                                            e.dataTransfer.dropEffect = 'move';
                                          }}
                                          onDrop={(e) => {
                                            e.preventDefault();
                                            if (isChecked || draggedBlankIndex === null || draggedBlankIndex === index) return;

                                            // Reorder fill-in answers
                                            const newAnswers = [...fillInAnswers];
                                            const draggedWord = newAnswers[draggedBlankIndex];

                                            // Remove from old position
                                            newAnswers.splice(draggedBlankIndex, 1, '');

                                            // Insert at new position
                                            newAnswers[index] = draggedWord;

                                            setFillInAnswers(newAnswers);
                                            setDraggedBlankIndex(null);
                                          }}
                                          onClick={() => {
                                            if (!isChecked && fillInAnswers[index]) {
                                              // Remove this word from the blank
                                              const newAnswers = [...fillInAnswers];
                                              newAnswers[index] = '';
                                              // Clean up empty trailing positions
                                              while (newAnswers.length > 0 && !newAnswers[newAnswers.length - 1]) {
                                                newAnswers.pop();
                                              }
                                              setFillInAnswers(newAnswers);
                                            }
                                          }}
                                          className={`inline-flex items-center justify-center px-4 py-1.5 rounded-lg border-2 font-semibold text-sm md:text-base min-w-[140px] transition-all duration-300 ease-in-out ${fillInAnswers[index]
                                            ? 'bg-[#58CC02] border-[#46A302] text-white cursor-move hover:opacity-80 hover:scale-105'
                                            : 'bg-gray-800/50 border-gray-600 text-gray-500 cursor-default border-dashed'
                                            } ${draggedBlankIndex === index ? 'opacity-50 scale-95' : ''}`}>
                                          {fillInAnswers[index] || '___________'}
                                        </span>
                                      )}
                                    </span>
                                  ))}
                                </span>
                              );
                            })()
                          ) : (
                            renderTextWithBold(getQuestionText(currentQuestion))
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Question Text Area - Consistent Spacing (Empty for Training to maintian layout) */}
                <div className="min-h-[60px] mb-6"></div>
              </div>
            );
          }

          // Puzzle Mode: No avatar, full screen, minimal UI
          if (uiMode === 'puzzle') {
            return (
              <div className="mb-6 md:mb-8">
                {/* Puzzle Title - Purple and pattern-focused */}
                <h2 className="text-xl md:text-2xl font-bold text-purple-400 mb-6 md:mb-8 text-center">
                  🧩 Pattern Recognition Exercise
                </h2>

                {/* Character Avatar - Consistent Layout */}
                <div className="relative mb-2 min-h-[200px] md:min-h-[300px]">
                  <div className="absolute -left-[100px] md:-left-[100px] -top-30 z-10 opacity-100 pointer-events-none">
                    <div className="w-[350px] h-[350px] md:w-[550px] md:h-[550px] rounded-2xl overflow-hidden bg-transparent opacity-100">
                      <video
                        ref={(ref) => setVideoRef(ref)}
                        className="w-full h-full object-contain opacity-100"
                        muted
                        playsInline
                        style={{ opacity: 1 }}
                      >
                        <source src="/animations/character-standing.mp4" type="video/mp4" />
                        <source src="/animations/character-standing.webm" type="video/webm" />
                      </video>
                    </div>
                  </div>

                  {/* Speech Bubble - Identical to Combat/Training Modes */}
                  <div className={`ml-[160px] md:ml-[280px] pt-12 md:pt-10 transition-all duration-300 relative z-20 ${isTransitioning ? 'exercise-fade-out' : 'exercise-slide-in'}`}>
                    <div className="relative">
                      <div className="bg-[#1e2a3a] rounded-2xl px-5 py-4 md:px-6 md:py-5 shadow-xl border-2 border-purple-900/30 relative">
                        {/* Speech bubble pointer */}
                        <div className="absolute left-0 top-16 transform -translate-x-2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-[#1e2a3a]"></div>
                        {/* Instruction Text as Speech Bubble Content */}
                        <p className="text-white text-base md:text-lg font-semibold leading-relaxed">
                          Match the terms with their definitions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spacer to push matching box down to match options position */}
                <div className="min-h-[40px] md:min-h-[60px]"></div>
              </div>
            );
          }
        })()}

        {/* ✅ In this section we achieved:
            Three distinct UI modes that signal different learning contexts:
            - Combat Mode: Dark, ominous, villain avatar with red accents
            - Training Mode: Clean, educational, mentor icon with blue accents
            - Puzzle Mode: Minimal, focused, no avatar with purple accents
        */}


        {/* Step 14: Render Matching Question (Practice Style) */}
        {/* Show two columns: terms on left, definitions on right */}
        {currentQuestion.type === 'matching' && currentQuestion.pairs && (
          <div className={`space-y-4 md:space-y-6 ${isTransitioning ? 'exercise-fade-out' : 'exercise-slide-in'}`}>
            {/* Headers */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 mb-2 md:mb-3">
              <p className="text-xs md:text-sm font-semibold text-gray-400 text-center">Terms</p>
              <p className="text-xs md:text-sm font-semibold text-gray-400 text-center">Definitions</p>
            </div>

            {/* Rows - each row contains one term and one definition with consistent spacing */}
            <div className="space-y-3 md:space-y-4">
              {(() => {
                const unmatchedTerms = Object.keys(currentQuestion.pairs).filter(term => !matchedPairs[term]);
                const unmatchedDefs = shuffledDefinitions.filter((def: any) => !Object.values(matchedPairs).includes(def));
                const maxItems = Math.max(unmatchedTerms.length, unmatchedDefs.length);

                // Helper function to check if content is an image path
                const isImagePath = (str: string) => str?.startsWith('/images/') || str?.startsWith('http');

                return Array.from({ length: maxItems }).map((_, index) => {
                  const term = unmatchedTerms[index];
                  const definition = unmatchedDefs[index];

                  const isSelected = selectedTerm === term;
                  const isWrongTerm = wrongMatch?.term === term;
                  const isWrongDef = wrongMatch?.definition === definition;

                  return (
                    <div key={`row-${index}`} className="grid grid-cols-2 gap-4 md:gap-6">
                      {/* Left - Term (can be text or image) */}
                      {term ? (
                        <button
                          onClick={() => setSelectedTerm(term)}
                          className={`rounded-xl md:rounded-2xl border-2 md:border-3 text-sm md:text-base font-semibold transition-all overflow-hidden flex items-center justify-center min-h-[60px] md:min-h-[70px] ${isImagePath(term) ? 'p-2' : 'p-4 md:p-5'
                            } ${isWrongTerm
                              ? 'bg-[#1a2332] border-red-500 text-red-400 animate-shake'
                              : isSelected
                                ? 'bg-[#1a2332] border-[#58CC02] text-[#58CC02] scale-105'
                                : 'bg-[#1a2332] border-gray-600 hover:border-gray-500 text-white'
                            }`}
                        >
                          {isImagePath(term) ? (
                            <img src={term} alt="Match item" className="w-24 h-24 md:w-28 md:h-28 object-cover rounded" />
                          ) : (
                            <span className="text-center">{term}</span>
                          )}
                        </button>
                      ) : (
                        <div />
                      )}

                      {/* Right - Definition (can be text or image) - Center-aligned */}
                      {definition ? (
                        <button
                          onClick={async () => {
                            if (!selectedTerm) return;

                            const correctDef = currentQuestion.pairs![selectedTerm];
                            if (definition === correctDef) {
                              setMatchedPairs({ ...matchedPairs, [selectedTerm]: definition });
                              setSelectedTerm(null);
                              setWrongMatch(null);

                              // Check if all matched
                              if (Object.keys(matchedPairs).length + 1 === Object.keys(currentQuestion.pairs!).length) {
                                setCorrectAnswers(correctAnswers + 1);

                                // Award XP for completing matching question
                                if (!isLessonAlreadyCompleted() && isSignedIn) {
                                  try {
                                    await addXPMutation({ amount: 5 });
                                  } catch (error) {
                                    // Error adding XP
                                  }
                                }

                                setTimeout(() => handleNext(), 1000);
                              }
                            } else {
                              setWrongMatch({ term: selectedTerm, definition });
                              setTimeout(() => {
                                setWrongMatch(null);
                                setSelectedTerm(null);
                              }, 1000);
                            }
                          }}
                          disabled={!selectedTerm}
                          className={`rounded-xl md:rounded-2xl border-2 md:border-3 text-sm md:text-base transition-all overflow-hidden flex items-center justify-center min-h-[60px] md:min-h-[70px] ${isImagePath(definition) ? 'p-2' : 'p-4 md:p-5'
                            } ${isWrongDef
                              ? 'bg-[#1a2332] border-red-500 text-red-400 animate-shake'
                              : !selectedTerm
                                ? 'bg-[#1a2332] border-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                                : 'bg-[#1a2332] border-gray-600 hover:border-[#58CC02] text-white cursor-pointer'
                            }`}
                        >
                          {isImagePath(definition) ? (
                            <img src={definition} alt="Match item" className="w-24 h-24 md:w-28 md:h-28 object-cover rounded" />
                          ) : (
                            <span className="text-center leading-relaxed">{definition}</span>
                          )}
                        </button>
                      ) : (
                        <div />
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* Step 15: Render Fill-in-Blank Question with Word Buttons */}
        {/* This combines the sentence and word selection in one interface */}
        {currentQuestion.type === 'fill-in-blank' && currentQuestion.sentence && (
          <div className={`space-y-4 md:space-y-6 ${isTransitioning ? 'exercise-fade-out' : 'exercise-slide-in'}`}>
            <h3 className="text-lg md:text-2xl font-bold text-white mb-4 md:mb-6 text-center">
              Complete the sentence
            </h3>

            <div className="bg-[#1a2332] p-4 md:p-6 rounded-xl md:rounded-2xl border-2 border-gray-700">
              <p className="text-base md:text-xl text-white text-center leading-relaxed">
                {currentQuestion.sentence.split('___').map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="inline-flex items-center">
                        <span className={`mx-1 md:mx-2 px-3 md:px-4 py-1 md:py-2 rounded-lg border-2 font-semibold text-sm md:text-lg ${fillInAnswer
                          ? 'bg-[#58CC02] border-[#46A302] text-white'
                          : 'bg-gray-800 border-gray-600 text-gray-400'
                          }`}>
                          {fillInAnswer || '___'}
                        </span>
                      </span>
                    )}
                  </span>
                ))}
              </p>
            </div>

            {/* Word Options */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {shuffledFillInOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setFillInAnswer(option)}
                  disabled={isChecked}
                  className={`p-3 md:p-4 rounded-lg md:rounded-xl border-2 md:border-4 text-sm md:text-base font-semibold transition-all ${fillInAnswer === option
                    ? 'bg-[#1a2332] border-[#58CC02] text-[#58CC02] scale-105'
                    : 'bg-[#1a2332] border-gray-600 hover:border-gray-500 text-white'
                    } ${isChecked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 15.5: Render Fill-In Questions with Multiple Blanks */}
        {/* Show sentence with numbered blank slots and clickable word buttons below */}
        {currentQuestion.type === 'fill-in' && currentQuestion.sentence && currentQuestion.answers && (
          <div className={`space-y-6 md:space-y-8 ${isTransitioning ? 'exercise-fade-out' : 'exercise-slide-in'}`}>

            {/* Word option buttons */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-2xl mx-auto px-4">
              {(() => {
                return currentQuestion.options?.map((option) => {
                  const isSelected = fillInAnswers.includes(option.text);
                  // Count non-empty answers (filter out empty strings)
                  const filledCount = fillInAnswers.filter(a => a && a.trim()).length;
                  const isDisabled = isChecked || filledCount >= (currentQuestion.answers?.length || 0);

                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        if (!isChecked) {
                          const maxBlanks = currentQuestion.answers?.length || 0;
                          const newAnswers = [...fillInAnswers];
                          let inserted = false;
                          for (let i = 0; i < maxBlanks; i++) {
                            if (!newAnswers[i]) {
                              newAnswers[i] = option.text;
                              inserted = true;
                              break;
                            }
                          }
                          if (!inserted && newAnswers.length < maxBlanks) {
                            newAnswers.push(option.text);
                          }

                          if (inserted || newAnswers.length <= maxBlanks) {
                            setFillInAnswers(newAnswers);
                          } else {
                          }
                        }
                      }}
                      disabled={isSelected || isDisabled}
                      className={`p-4 md:p-5 rounded-xl md:rounded-2xl border-2 md:border-3 text-sm md:text-lg font-semibold transition-all ${isSelected
                        ? 'bg-gray-800 border-gray-700 text-gray-500 opacity-50 cursor-not-allowed'
                        : isDisabled
                          ? 'bg-[#1a2332] border-gray-600 text-gray-400 opacity-70 cursor-not-allowed'
                          : 'bg-[#1a2332] border-gray-600 hover:border-[#58CC02] text-white hover:scale-105 active:scale-95'
                        }`}
                    >
                      {option.text}
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* Step 15.5.5: Render Micro-Sim Options */}
        {currentQuestion.type === 'micro-sim' && currentQuestion.steps && (() => {
          const currentStep = currentQuestion.steps[microSimStep];
          if (!currentStep || !currentStep.options) return null;

          return (
            <div className="mb-6 md:mb-8">
              {/* Options Grid - ANIMATED */}
              <div className={`flex justify-center ${isTransitioning ? 'exercise-fade-out' : 'exercise-slide-in'}`}>
                <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-3xl w-full px-4">
                  {currentStep.options.map((optionText, index) => {
                    const optionId = String.fromCharCode(65 + index); // A, B, C, D
                    const isSelected = selectedAnswer === optionId;
                    const showCorrect = isChecked && optionText === currentStep.correct;
                    const showWrong = isChecked && isSelected && optionText !== currentStep.correct;

                    return (
                      <button
                        key={optionId}
                        onClick={() => !isChecked && setSelectedAnswer(optionId)}
                        disabled={isChecked}
                        className={`p-4 md:p-5 rounded-xl md:rounded-2xl border-2 md:border-3 transition-all text-left ${showCorrect
                          ? "border-[#58CC02] bg-green-900/40 text-[#58CC02]"
                          : showWrong
                            ? "border-red-500 bg-[#1a2332] text-red-400"
                            : isSelected
                              ? "border-[#58CC02] bg-[#1a2332] text-[#58CC02]"
                              : "border-gray-600 bg-[#1a2332] text-white hover:border-gray-500"
                          } ${!isChecked ? 'hover:scale-102 active:scale-98' : ''}`}
                      >
                        <span className="text-sm md:text-base font-semibold">
                          {optionText}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Step 15.6: Render Multiple Choice and Similar Question Types */}
        {['multiple-choice', 'scenario', 'true-false', 'reverse-scenario', 'ethical-dilemma', 'boss-scenario', 'case-analysis'].includes(currentQuestion.type) && currentQuestion.options && (
          <div className="mb-6 md:mb-8">
            {/* Options Grid - ANIMATED, Centered below character and bubble */}
            <div className={`flex justify-center ${isTransitioning ? 'exercise-fade-out' : 'exercise-slide-in'}`}>
              <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-3xl w-full px-4">
                {(shuffledOptions.length > 0 ? shuffledOptions : currentQuestion.options).map((option) => {
                  // Skip options with undefined text
                  if (!option || !option.text) return null;

                  const isSelected = selectedAnswer === option.id;
                  const showCorrect = isChecked && option.id === currentQuestion.correctAnswer;
                  const showWrong = isChecked && isSelected && option.id !== currentQuestion.correctAnswer;

                  return (
                    <button
                      key={option.id}
                      onClick={() => !isChecked && setSelectedAnswer(option.id)}
                      disabled={isChecked}
                      className={`p-4 md:p-6 rounded-xl md:rounded-2xl border-2 md:border-4 transition-all flex items-center justify-center min-h-[100px] md:min-h-[120px] ${showCorrect
                        ? "border-[#58CC02] bg-green-900/40 text-[#58CC02]"
                        : showWrong
                          ? "border-red-500 bg-[#1a2332] text-red-400"
                          : isSelected
                            ? "border-[#58CC02] bg-[#1a2332] text-[#58CC02] scale-105"
                            : "border-gray-600 bg-[#1a2332] text-white hover:border-gray-500"
                        } ${!isChecked ? 'hover:scale-105 active:scale-95' : ''}`}
                    >
                      <span className="text-sm md:text-lg font-semibold text-center">
                        {renderOptionText(option.text)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Character Animation removed (integrated into Training Mode UI) */}

        {/* Step 15.7: Render Sentence Building Question - Individual Ghost Slots */}
        {/* Individual empty boxes for each word, showing exactly how many words needed */}
        {(currentQuestion.type === 'sentence-building' || currentQuestion.type === 'build-sentence') && currentQuestion.words && (
          <div className={`space-y-6 md:space-y-8 -mt-10 md:-mt-16 ${isTransitioning ? 'exercise-fade-out' : 'exercise-slide-in'}`}>
            {/* Ghost Slots - Individual boxes for each word */}
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center items-center min-h-[100px]">
              {(() => {
                // Calculate number of words in correct sentence
                const correctWordCount = currentQuestion.correctSentence?.split(' ').length || currentQuestion.words.length;

                return Array.from({ length: correctWordCount }).map((_, index) => {
                  const word = selectedWords[index];
                  const isFirstWord = index === 0;

                  return (
                    <div
                      key={index}
                      onClick={() => { /* Slot click handler */ }}
                      className={`min-w-[80px] md:min-w-[100px] h-12 md:h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ease-in-out ${word
                        ? isChecked
                          ? selectedWords.join(' ').toLowerCase().trim() === currentQuestion.correctSentence?.toLowerCase().trim()
                            ? 'bg-[#58CC02] border-[#46A302] text-white'
                            : 'bg-red-500 border-red-700 text-white'
                          : 'bg-white border-gray-300 text-gray-800'
                        : 'border-dashed border-gray-600 bg-[#1a2332]'
                        } ${draggedWordIndex === index ? 'opacity-50 scale-95' : ''}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (isChecked) return;

                        // Dropping from word bank
                        if (draggedAvailableIndex !== null && !word) {
                          const droppedWord = availableWords[draggedAvailableIndex];
                          const newWords = [...selectedWords];
                          newWords[index] = droppedWord;
                          setSelectedWords(newWords);
                          setAvailableWords(availableWords.filter((_, i) => i !== draggedAvailableIndex));
                          setDraggedAvailableIndex(null);
                        }
                        // Reordering within sentence slots
                        else if (draggedWordIndex !== null && draggedWordIndex !== index) {
                          const newWords = [...selectedWords];
                          const draggedWord = newWords[draggedWordIndex];

                          // Remove from old position
                          newWords.splice(draggedWordIndex, 1);

                          // Insert at new position
                          newWords.splice(index, 0, draggedWord);

                          setSelectedWords(newWords);
                          setDraggedWordIndex(null);
                        }
                      }}
                    >
                      {word ? (
                        <button
                          draggable={!isChecked}
                          onDragStart={(e) => {
                            if (!isChecked) {
                              setDraggedWordIndex(index);
                              e.dataTransfer.effectAllowed = 'move';
                            }
                          }}
                          onDragEnd={() => {
                            setDraggedWordIndex(null);
                          }}
                          onClick={() => {
                            if (!isChecked) {
                              const newWords = [...selectedWords];
                              newWords[index] = '';
                              const filtered = newWords.filter(w => w !== '');
                              setSelectedWords(filtered);
                              setAvailableWords([...availableWords, word]);
                            } else {
                            }
                          }}
                          disabled={isChecked}
                          className="px-3 py-2 text-sm md:text-base font-semibold w-full h-full cursor-move hover:opacity-80 transition-opacity duration-200"
                        >
                          {/* Auto-capitalize first word for display */}
                          {isFirstWord && word ? word.charAt(0).toUpperCase() + word.slice(1) : word}
                        </button>
                      ) : (
                        <span className="text-transparent">·</span>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Word Bank - Available words to choose from with distractors */}
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
              {availableWords.map((word, index) => (
                <div
                  key={index}
                  draggable={!isChecked}
                  onDragStart={(e) => {
                    if (!isChecked) {
                      setDraggedAvailableIndex(index);
                      e.dataTransfer.effectAllowed = 'move';
                    }
                  }}
                  onDragEnd={() => {
                    setDraggedAvailableIndex(null);
                  }}
                  className={`transition-all ${draggedAvailableIndex === index ? 'opacity-50' : ''}`}
                >
                  <button
                    onClick={() => {
                      if (!isChecked) {
                        // Add word to the next available slot
                        const correctWordCount = currentQuestion.correctSentence?.split(' ').length || currentQuestion.words!.length;
                        if (selectedWords.length < correctWordCount) {
                          setSelectedWords([...selectedWords, word]);
                          setAvailableWords(availableWords.filter((_, i) => i !== index));
                        }
                      }
                    }}
                    disabled={isChecked}
                    className="px-6 md:px-8 py-3 md:py-4 h-12 md:h-14 bg-white text-gray-800 border-2 border-gray-300 hover:border-blue-400 rounded-xl text-sm md:text-base font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                  >
                    {word}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 16: Render Matching Question (Quiz Style with columns) */}
        {/* This is the alternative matching format with Column A and Column B */}
        {/* Each row contains one box from each column, aligned horizontally */}
        {currentQuestion.type === 'matching' && currentQuestion.columnA && currentQuestion.columnB && (
          <div className={`space-y-2 md:space-y-3 ${isTransitioning ? 'exercise-fade-out' : 'exercise-slide-in'}`}>
            {/* Column headers */}
            <div className="grid grid-cols-2 gap-3 md:gap-8 mb-2 md:mb-4">
              <h3 className="font-semibold text-white text-xs md:text-sm text-center">Column A</h3>
              <h3 className="font-semibold text-white text-xs md:text-sm text-center">Column B</h3>
            </div>

            {/* Get max number of items to create rows */}
            {(() => {
              const unmatchedA = currentQuestion.columnA.filter(item => !matchedPairs[item.id]);
              const unmatchedB = currentQuestion.columnB.filter(item => !Object.values(matchedPairs).includes(item.id));
              const maxItems = Math.max(unmatchedA.length, unmatchedB.length);

              return Array.from({ length: maxItems }).map((_, index) => {
                const itemA = unmatchedA[index];
                const itemB = unmatchedB[index];

                return (
                  <div key={`row-${index}`} className="grid grid-cols-2 gap-3 md:gap-8 items-center">
                    {/* Column A button */}
                    {itemA ? (
                      <button
                        onClick={() => setSelectedColumnA(itemA.id)}
                        className={`w-full p-2 md:p-4 text-left rounded-lg border-2 transition-all text-xs md:text-base self-center ${selectedColumnA === itemA.id
                          ? 'border-[#58CC02] bg-[#1a2332] text-[#58CC02]'
                          : 'border-gray-600 hover:border-gray-500 bg-[#1a2332] text-white'
                          }`}
                      >
                        <span className="font-semibold">{itemA.id}.</span> <span>{itemA.text}</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    {/* Column B button */}
                    {itemB ? (
                      <button
                        onClick={() => {
                          if (selectedColumnA) {
                            handleMatchClick(selectedColumnA, itemB.id);
                          }
                        }}
                        disabled={!selectedColumnA}
                        className={`w-full p-2 md:p-4 text-left rounded-lg border-2 transition-all text-xs md:text-base self-center ${!selectedColumnA
                          ? 'border-gray-700 bg-[#1a2332] text-gray-500 cursor-not-allowed opacity-50'
                          : 'border-gray-600 hover:border-[#58CC02] bg-[#1a2332] text-white cursor-pointer'
                          }`}
                      >
                        <span className="font-semibold">{itemB.id})</span> <span>{itemB.text}</span>
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>

      {/* Step 17: Bottom Action Bar - Matches plan.md design */}
      {/* Large CHECK button before answer, feedback panel after */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Before Answer - Show CHECK button (matches plan.md large button style) */}
        {!isChecked && currentQuestion.type !== 'matching' && (
          <div className="bg-[#1F2937] border-t-4 border-gray-700 px-6 py-6">
            <div className="max-w-4xl mx-auto">
              <button
                onClick={handleCheckAnswer}
                disabled={
                  (currentQuestion.type === 'multiple-choice' && !selectedAnswer) ||
                  (currentQuestion.type === 'fill-in-blank' && !fillInAnswer) ||
                  (currentQuestion.type === 'fill-in' && (!currentQuestion.answers || fillInAnswers.length < currentQuestion.answers.length)) ||
                  (currentQuestion.type === 'sentence-building' && selectedWords.length === 0) ||
                  !canAnswer
                }
                className="w-full bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-6 text-xl rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all border-b-4 border-[#46A302] active:border-b-0 active:mt-1"
              >
                {canAnswer ? 'CHECK' : 'Out of Hearts! 💔'}
              </button>
            </div>
          </div>
        )}

        {/* After Answer - Show feedback panel (matches plan.md design) */}
        {isChecked && currentQuestion.type !== 'matching' && (
          <div className={`border-t-4 px-6 py-6 ${
            // Check correctness based on question type
            (() => {
              if (currentQuestion.type === 'micro-sim' && currentQuestion.steps) {
                const currentStep = currentQuestion.steps[microSimStep];
                if (currentStep && selectedAnswer) {
                  const selectedOptionIndex = selectedAnswer.charCodeAt(0) - 65;
                  const selectedOptionText = currentStep.options[selectedOptionIndex];
                  return selectedOptionText === currentStep.correct;
                }
                return false;
              }
              return fillInAnswer.toLowerCase().trim() === currentQuestion.correctAnswer?.toLowerCase().trim() ||
                (currentQuestion.type === 'fill-in' && currentQuestion.answers && fillInAnswers.length === currentQuestion.answers.length && fillInAnswers.every((answer, index) => answer.toLowerCase().trim() === currentQuestion.answers![index].toLowerCase().trim())) ||
                selectedAnswer === currentQuestion?.correctAnswer ||
                ((currentQuestion.type === 'sentence-building' || currentQuestion.type === 'build-sentence') && selectedWords.join(' ').toLowerCase().trim() === currentQuestion.correctSentence?.toLowerCase().trim());
            })()
              ? 'bg-[#58CC02] border-[#46A302]' : 'bg-red-500 border-red-700'
            }`}>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between gap-4">
                {/* Left side - Feedback message */}
                <div className="flex items-start gap-3">
                  {/* Checkmark or X icon */}
                  {(() => {
                    let isCorrect = false;
                    if (currentQuestion.type === 'micro-sim' && currentQuestion.steps) {
                      const currentStep = currentQuestion.steps[microSimStep];
                      if (currentStep && selectedAnswer) {
                        const selectedOptionIndex = selectedAnswer.charCodeAt(0) - 65;
                        const selectedOptionText = currentStep.options[selectedOptionIndex];
                        isCorrect = selectedOptionText === currentStep.correct;
                      }
                    } else {
                      isCorrect = fillInAnswer.toLowerCase().trim() === currentQuestion.correctAnswer?.toLowerCase().trim() ||
                        (currentQuestion.type === 'fill-in' && currentQuestion.answers && fillInAnswers.length === currentQuestion.answers.length && fillInAnswers.every((answer, index) => answer.toLowerCase().trim() === currentQuestion.answers![index].toLowerCase().trim())) ||
                        selectedAnswer === currentQuestion?.correctAnswer ||
                        ((currentQuestion.type === 'sentence-building' || currentQuestion.type === 'build-sentence') && selectedWords.join(' ').toLowerCase().trim() === currentQuestion.correctSentence?.toLowerCase().trim());
                    }

                    return isCorrect ? (
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                        <Check className="h-6 w-6 text-[#58CC02]" strokeWidth={4} />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                        <X className="h-6 w-6 text-red-500" strokeWidth={4} />
                      </div>
                    );
                  })()}

                  {/* Motivational message */}
                  <div>
                    {(() => {
                      let isCorrect = false;
                      let feedbackText = '';

                      if (currentQuestion.type === 'micro-sim' && currentQuestion.steps) {
                        const currentStep = currentQuestion.steps[microSimStep];
                        if (currentStep && selectedAnswer) {
                          const selectedOptionIndex = selectedAnswer.charCodeAt(0) - 65;
                          const selectedOptionText = currentStep.options[selectedOptionIndex];
                          isCorrect = selectedOptionText === currentStep.correct;
                          feedbackText = isCorrect ? currentStep.feedback.correct : currentStep.feedback.incorrect;
                        }
                      } else {
                        isCorrect = fillInAnswer.toLowerCase().trim() === currentQuestion.correctAnswer?.toLowerCase().trim() ||
                          (currentQuestion.type === 'fill-in' && currentQuestion.answers && fillInAnswers.length === currentQuestion.answers.length && fillInAnswers.every((answer, index) => answer.toLowerCase().trim() === currentQuestion.answers![index].toLowerCase().trim())) ||
                          selectedAnswer === currentQuestion?.correctAnswer ||
                          ((currentQuestion.type === 'sentence-building' || currentQuestion.type === 'build-sentence') && selectedWords.join(' ').toLowerCase().trim() === currentQuestion.correctSentence?.toLowerCase().trim());
                        feedbackText = currentQuestion.explanation || '';
                      }

                      return (
                        <>
                          <p className="text-white font-bold text-lg md:text-2xl">
                            {isCorrect
                              ? motivationalMessage
                              : 'Incorrect'}
                          </p>
                          {feedbackText && (
                            <p className="text-white/90 text-sm mt-1">
                              {feedbackText}
                            </p>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Right side - Action buttons */}
                <div className="flex items-center gap-3">
                  {/* Share and Report buttons (only on correct answer) */}
                  {(fillInAnswer.toLowerCase().trim() === currentQuestion.correctAnswer?.toLowerCase().trim() ||
                    (currentQuestion.type === 'fill-in' && currentQuestion.answers && fillInAnswers.length === currentQuestion.answers.length && fillInAnswers.every((answer, index) => answer.toLowerCase().trim() === currentQuestion.answers![index].toLowerCase().trim())) ||
                    selectedAnswer === currentQuestion?.correctAnswer ||
                    ((currentQuestion.type === 'sentence-building' || currentQuestion.type === 'build-sentence') && selectedWords.join(' ').toLowerCase().trim() === currentQuestion.correctSentence?.toLowerCase().trim())) && (
                      <>
                        <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                          </svg>
                        </button>
                      </>
                    )}

                  {/* CONTINUE button */}
                  <button
                    onClick={handleNext}
                    className="bg-white hover:bg-gray-100 text-[#58CC02] font-bold px-8 py-3 text-lg rounded-xl border-b-4 border-gray-300 active:border-b-0 active:mt-1 transition-all"
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Final Score Modal */}
      {showFinalScore && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100]">
          <div className="bg-[#1a2332] p-6 md:p-8 rounded-2xl md:rounded-3xl max-w-md w-full mx-4 border-4 border-[#58CC02]">
            <h2 className="text-2xl md:text-4xl font-bold text-[#58CC02] text-center mb-4 md:mb-6">
              Lesson Complete!
            </h2>
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <div className="flex justify-between items-center text-white">
                <span className="text-base md:text-lg">Correct Answers:</span>
                <span className="text-xl md:text-2xl font-bold text-[#58CC02]">{correctAnswers}/{allQuestions.length}</span>
              </div>
              <div className="flex justify-between items-center text-white">
                <span className="text-base md:text-lg">Score:</span>
                <span className="text-xl md:text-2xl font-bold text-[#58CC02]">
                  {Math.round((correctAnswers / allQuestions.length) * 100)}%
                </span>
              </div>
            </div>
            <Button
              onClick={() => router.push('/dark-psychology-dashboard')}
              className="w-full bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-4 md:py-6 text-base md:text-lg rounded-xl"
            >
              Continue Learning
            </Button>
          </div>
        </div>
      )}

      {/* Streak Badge Celebration Overlay */}
      {showStreakBadge && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[150] pointer-events-none">
          <div className="flex flex-col items-center gap-4">
            <StreakBadge streakCount={celebrationStreak} timeline={timeline} size={160}>
              {/* FX Layers */}
              <AuraHalo timeline={timeline} tierConfig={celebrationTierConfig} size={160} />
              <GlowPulse timeline={timeline} tierConfig={celebrationTierConfig} size={160} />
              <RingPing timeline={timeline} tierConfig={celebrationTierConfig} size={160} />
              <ShineSweep timeline={timeline} tierConfig={celebrationTierConfig} size={160} />
              <SparkleParticles timeline={timeline} tierConfig={celebrationTierConfig} size={160} />
              {celebrationTierConfig.isMilestone && celebrationTierConfig.milestoneType && (
                <MilestoneAnimation
                  milestoneDay={celebrationTierConfig.milestoneType}
                  timeline={timeline}
                  size={160}
                />
              )}
            </StreakBadge>
            <div className="text-white text-2xl font-bold text-center">
              {celebrationStreak} Day Streak!
              {streakFreezeUsed && (
                <div className="text-blue-400 text-lg mt-2">
                  ❄️ Streak Freeze Used
                </div>
              )}
              {[5, 10, 15, 20, 25, 30].includes(celebrationStreak) && (
                <div className="text-yellow-400 text-lg mt-2">
                  🎉 Milestone Achieved! 🎉
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
