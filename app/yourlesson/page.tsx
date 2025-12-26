// 🧠 FILE PURPOSE
// This is the main lesson page that displays questions in a continuous flow.
// It supports 3 question types: fill-in-blank, matching, and multiple-choice.
// No stages - all questions are mixed together in one continuous lesson.

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Step 1: Define TypeScript interfaces for question types
// These interfaces ensure type safety for all question data structures
interface QuizData {
  type?: string;
  question: string;
  // Fill-in-blank fields
  sentence?: string;
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
}

export default function YourLessonPage() {
  const router = useRouter();

  // Step 2: Setup state management for the lesson
  // These states track the current question, answers, and lesson progress
  const [allQuestions, setAllQuestions] = useState<QuizData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Answer states for different question types
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null); // For multiple choice
  const [fillInAnswer, setFillInAnswer] = useState(''); // For fill-in-blank

  // Matching question states
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<{[key: string]: string}>({});
  const [wrongMatch, setWrongMatch] = useState<{term: string, definition: string} | null>(null);
  const [selectedColumnA, setSelectedColumnA] = useState<string | null>(null);
  const [shuffledDefinitions, setShuffledDefinitions] = useState<string[]>([]); // Shuffled definitions for matching

  // Sentence building question states
  const [selectedWords, setSelectedWords] = useState<string[]>([]); // Words user has selected
  const [availableWords, setAvailableWords] = useState<string[]>([]); // Words still available to select
  const [draggedWordIndex, setDraggedWordIndex] = useState<number | null>(null); // Track which word is being dragged from selected
  const [draggedAvailableIndex, setDraggedAvailableIndex] = useState<number | null>(null); // Track which word is being dragged from available

  // Lesson metadata
  const [currentLessonNumber, setCurrentLessonNumber] = useState<number | null>(null);
  const [hadWrongAttempt, setHadWrongAttempt] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<Array<{questionIndex: number, question: string, userAnswer: string, correctAnswer: string}>>([]);
  const [wrongFlash, setWrongFlash] = useState(false);

  // Get user email from localStorage
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [lessonCategory, setLessonCategory] = useState<string | null>(null);
  const [darkPsychLessonId, setDarkPsychLessonId] = useState<string | null>(null);

  // Step 3: Load data from Convex backend
  // Query lessons and user stats from the database
  const lessons = useQuery(api.lessons.getUserLessons, userEmail ? { email: userEmail } : "skip");
  const progress = useQuery(api.lessons.getUserProgress, userEmail ? { email: userEmail } : "skip");
  const userStats = useQuery(api.gamification.getUserStats, userEmail ? { email: userEmail } : "skip");

  // Query Dark Psychology lessons if this is a Dark Psychology lesson
  const darkPsychLessons = useQuery(
    api.lessons.getAllDarkPsychologyLessons,
    lessonCategory === 'dark-psychology' ? {} : "skip"
  );

  // Step: Setup Convex mutations for gamification
  // Heart deduction uses V2 which respects premium status
  const loseHeartMutation = useMutation(api.gamification.loseHeartV2);
  const addXPMutation = useMutation(api.gamification.addXP);
  const updateStreakMutation = useMutation(api.gamification.updateStreak);
  const updateLessonProgressMutation = useMutation(api.lessons.updateLessonProgress);

  // Step: Query subscription status to check if user is premium
  // Premium users get unlimited hearts displayed as ∞
  const subscriptionData = useQuery(api.gamification.getSubscriptionStatus, userEmail ? { email: userEmail } : "skip");
  const isPremium = subscriptionData?.isPremium ?? false;

  // Step 4: Initialize lesson from localStorage
  // Get the current lesson number and user email
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('userEmail');
      setUserEmail(email);

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
      return {
        scene: parts[0],
        question: parts.slice(1).join('\n\n')
      };
    }
    return { scene: null, question: text };
  };

  // Helper function to render markdown-style bold text
  const renderTextWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`bold-${index}`}>{part.slice(2, -2)}</strong>;
      }
      return <span key={`text-${index}`}>{part}</span>;
    });
  };

  // Step 5: Load and combine all questions from lesson data
  // Merge practice and quiz questions into one continuous array
  useEffect(() => {
    // Handle Dark Psychology lessons
    if (lessonCategory === 'dark-psychology' && darkPsychLessons && darkPsychLessonId) {
      console.log('📚 [DARK PSYCH LESSON] Loading lesson with ID:', darkPsychLessonId);

      const lessonParts = darkPsychLessons.filter((l: any) => {
        const lessonData = l.lessonJSON || l.content;
        const lessonId = lessonData?.lessonId;
        return lessonId && lessonId === darkPsychLessonId;
      });

      console.log(`📚 [DARK PSYCH LESSON] Found ${lessonParts.length} parts`);

      if (lessonParts.length > 0) {
        lessonParts.sort((a: any, b: any) => {
          const partA = (a.lessonJSON || a.content)?.lessonPart || 0;
          const partB = (b.lessonJSON || b.content)?.lessonPart || 0;
          return partA - partB;
        });

        const combinedQuestions: QuizData[] = [];

        lessonParts.forEach((part: any) => {
          const data = part.lessonJSON || part.content;

          if (data?.contentScreens && Array.isArray(data.contentScreens)) {
            data.contentScreens.forEach((screen: any) => {
              if (screen.exercises && Array.isArray(screen.exercises)) {
                screen.exercises.forEach((exercise: any) => {
                  const questionText = exercise.scene
                    ? `${exercise.scene}\n\n${exercise.question || ''}`
                    : (exercise.question || '');

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
                  };

                  if (standardQuestion.question || pairsObject || wordsArray) {
                    combinedQuestions.push(standardQuestion);
                  }
                });
              }
            });
          }
        });

        console.log(`✅ [DARK PSYCH LESSON] Loaded ${combinedQuestions.length} total questions`);
        setAllQuestions(combinedQuestions);
        return;
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
  }, [lessons, currentLessonNumber, lessonCategory, darkPsychLessons, darkPsychLessonId]);

  const currentQuestion = allQuestions[currentQuestionIndex];

  // Step 6: Shuffle definitions when question changes (for matching questions)
  // This prevents answers from being displayed in order
  useEffect(() => {
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
      // Shuffle the available words
      const shuffled = [...currentQuestion.words];
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

  // Step: Check if user can answer questions
  // Premium users always can answer, free users need hearts, completed lessons are reviewable
  const canAnswer = isPremium || (userStats?.hearts || 5) > 0 || isLessonAlreadyCompleted();

  // ✅ In this section we achieved:
  // Loaded all lesson data and combined questions from practice and quiz into one array

  // Step 7: Handle answer checking for all question types
  // Check if the user's answer is correct based on question type
  const handleCheckAnswer = async () => {
    setIsChecked(true);

    let isCorrect = false;
    let userAnswer = '';

    // Check answer based on question type
    if (currentQuestion.type === 'fill-in-blank') {
      isCorrect = fillInAnswer.toLowerCase().trim() === currentQuestion.correctAnswer?.toLowerCase().trim();
      userAnswer = fillInAnswer;
    } else if (currentQuestion.type === 'multiple-choice') {
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
      // Correct answer - add XP if first try and lesson not completed
      setCorrectAnswers(correctAnswers + 1);

      if (!hadWrongAttempt && !isLessonAlreadyCompleted()) {
        try {
          if (userEmail) {
            await addXPMutation({ amount: 5, email: userEmail });
          }
        } catch (error) {
          console.error("Error adding XP:", error);
        }
      }
    } else {
      // Wrong answer - lose heart and XP
      setHadWrongAttempt(true);

      if (currentLessonNumber) {
        try {
          const lesson = lessons?.find(l => l.lessonNumber === currentLessonNumber);
          if (lesson && userEmail) {
            await loseHeartMutation({ lessonId: lesson._id, email: userEmail });
          }
        } catch (error) {
          console.error("Error losing heart:", error);
        }
      }

      try {
        if (userEmail) {
          await addXPMutation({ amount: -5, email: userEmail });
        }
      } catch (error) {
        console.error("Error subtracting XP:", error);
      }

      // Track wrong answer for reinforcement
      setWrongAnswers([...wrongAnswers, {
        questionIndex: currentQuestionIndex,
        question: currentQuestion.question,
        userAnswer: userAnswer,
        correctAnswer: currentQuestion.correctAnswer || ''
      }]);
    }
  };

  // Step 8: Handle moving to next question
  // Reset all states and move to next question or show final score
  const handleNext = async () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setFillInAnswer('');
      setIsChecked(false);
      setHadWrongAttempt(false);
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
    } else {
      // Step 8a: Lesson completed - mark as completed and update streak
      // This unlocks the next lesson in the learning path
      try {
        if (userEmail && currentLessonNumber) {
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
              email: userEmail,
            });
          }

          // Update daily streak
          await updateStreakMutation({ email: userEmail });
        }
      } catch (error) {
        console.error("Error completing lesson:", error);
      }

      setShowFinalScore(true);
    }
  };

  // Step 9: Handle matching question clicks
  // Check if the selected pair is correct for matching questions
  const handleMatchClick = (columnAId: string, columnBId: string) => {
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
        if (!isLessonAlreadyCompleted() && userEmail) {
          try {
            addXPMutation({ amount: 5, email: userEmail });
          } catch (error) {
            console.error("Error adding XP:", error);
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
          <h1 className="text-3xl font-bold text-white mb-4">Cat Animation Test</h1>
          <p className="text-gray-400 mb-6">Testing the celebrating cat animation</p>

          {/* Cat Animation Video Player */}
          <div className="bg-[#1a2332] p-6 rounded-2xl border-2 border-gray-700 mb-6">
            <video
              className="w-full h-auto rounded-xl"
              controls
              autoPlay
              loop
            >
              <source src="/cat animation/celebrating .mov" type="video/quicktime" />
              Your browser does not support the video tag.
            </video>
          </div>

          <Button onClick={() => router.push('/upload')}>Go to Upload</Button>
        </div>
      </div>
    );
  }

  // Step 11: Render final score modal
  // Show results and reinforcement if user got questions wrong
  if (showFinalScore) {
    return (
      <div className="min-h-screen bg-[#1F2937] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-6xl">🏆</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Lesson Complete!</h2>
          <p className="text-center text-gray-600 mb-4">
            You got <span className="text-2xl font-bold text-blue-600">{correctAnswers}</span> out of{" "}
            <span className="text-2xl font-bold">{allQuestions.length}</span> correct!
          </p>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
            <div
              className="bg-green-500 h-4 rounded-full transition-all"
              style={{ width: `${(correctAnswers / allQuestions.length) * 100}%` }}
            ></div>
          </div>

          {wrongAnswers.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-orange-800 mb-4">📚 Review Wrong Answers</h3>
              <p className="text-gray-700 mb-4">
                You got {wrongAnswers.length} question{wrongAnswers.length > 1 ? 's' : ''} wrong:
              </p>

              <div className="space-y-6">
                {wrongAnswers.map((mistake, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 border-2 border-orange-200">
                    <p className="font-semibold text-gray-800 mb-2">❌ {mistake.question}</p>
                    <p className="text-sm text-red-600 mb-1">Your answer: {mistake.userAnswer}</p>
                    <p className="text-sm text-green-600 font-semibold">✅ Correct: {mistake.correctAnswer}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <Button onClick={handleRestartQuiz} className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
                  Retry Lesson
                </Button>
                <Button onClick={() => router.push('/learn')} variant="secondary" className="w-full" size="lg">
                  Back to Lessons
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-green-700 text-lg mb-4">🎉 Perfect score! No mistakes!</p>
              <Button onClick={() => router.push('/learn')} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                Back to Lessons
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ✅ In this section we achieved:
  // Completed the final score screen with reinforcement for wrong answers

  // Step 12: Render main lesson interface
  // This is the main UI that shows questions and answer options
  return (
    <div className={`min-h-screen relative transition-all ${wrongFlash ? 'bg-red-500/20' : 'bg-[#1F2937]'}`}>
      {/* Step 12a: Top Header - Matches plan.md design */}
      {/* X button, progress bar with XP display, hearts counter */}
      <div className="fixed top-0 left-0 right-0 bg-[#1F2937] z-50 border-b-2 border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center gap-4">
            {/* Close Button - X */}
            <button
              onClick={() => router.push('/learn')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" strokeWidth={3} />
            </button>

            {/* Progress Bar with XP Counter */}
            <div className="flex-1 relative">
              <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden border-2 border-gray-600">
                <div
                  className="bg-[#58CC02] h-full transition-all duration-300 flex items-center justify-center"
                  style={{ width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%` }}
                >
                  {/* XP earned so far in this lesson */}
                  <span className="text-[10px] font-bold text-white px-2">
                    {correctAnswers * 5} XP
                  </span>
                </div>
              </div>
            </div>

            {/* Hearts Counter - ⚡ style */}
            <div className="flex items-center gap-1">
              <span className="text-2xl">⚡</span>
              <span className="text-white font-bold text-lg">
                {isPremium ? "∞" : (userStats?.hearts || 5)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-32">
        {/* Step 13: Character + Speech Bubble UI for ALL question types */}
        {/* This section shows the character with speech bubble for every question */}
        <div className="mb-6 md:mb-8">
          {/* Title - "Chose the correct answer" */}
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 text-center">
            {currentQuestion.type === 'sentence-building' || currentQuestion.type === 'build-sentence'
              ? 'Translate this sentence'
              : currentQuestion.type === 'matching'
              ? 'Match the terms with their definitions'
              : currentQuestion.type === 'fill-in'
              ? 'Fill in the blank'
              : 'Chose the correct answer'}
          </h2>

          {/* Character Area with Speech Bubble */}
          <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Character Circle with Blue Ring */}
            <div className="flex-shrink-0">
              <div className="relative">
                {/* Character circle with dark background and blue ring */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#2c3e50] border-4 border-blue-500 flex items-center justify-center shadow-2xl">
                  {/* Cat character image */}
                  <img
                    src="/cat animation/cat1.png"
                    alt="Character"
                    className="w-20 h-20 md:w-24 md:h-24 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Speech Bubble with Question */}
            <div className="flex-1 relative">
              <div className="bg-[#4a5568] rounded-2xl px-5 py-4 md:px-6 md:py-5 shadow-xl relative">
                {/* Speech bubble pointer (triangle) */}
                <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-[#4a5568]"></div>

                {/* Question text with speaker icon */}
                <div className="flex items-start gap-3">
                  <p className="text-white text-base md:text-lg font-normal flex-1">
                    {(() => {
                      const parsed = parseQuestionText(currentQuestion.question);
                      if (parsed.scene) {
                        return (
                          <>
                            <span className="block mb-2">{renderTextWithBold(parsed.scene)}</span>
                            <span className="block font-medium">{renderTextWithBold(parsed.question)}</span>
                          </>
                        );
                      }
                      return renderTextWithBold(currentQuestion.question);
                    })()}
                  </p>
                  <button className="text-blue-400 hover:text-blue-300 transition-colors flex-shrink-0">
                    <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ In this section we achieved:
            Character circle with blue ring glow effect matching the old system design.
            Dark gray speech bubble with white text and triangle pointer.
            "Chose the correct answer" title that changes based on question type.
            Speaker icon in the speech bubble for audio playback.
            Support for scene + question parsing with bold markdown rendering.
        */}


        {/* Step 14: Render Matching Question (Practice Style) */}
        {/* Show two columns: terms on left, definitions on right */}
        {currentQuestion.type === 'matching' && currentQuestion.pairs && (
          <div className="space-y-4 md:space-y-6">
            {/* Headers */}
            <div className="grid grid-cols-2 gap-3 md:gap-6 mb-2 md:mb-3">
              <p className="text-xs md:text-sm font-semibold text-gray-400">Terms</p>
              <p className="text-xs md:text-sm font-semibold text-gray-400">Definitions</p>
            </div>

            {/* Rows - each row contains one term and one definition aligned by center */}
            <div className="space-y-2 md:space-y-3">
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
                    <div key={`row-${index}`} className="grid grid-cols-2 gap-3 md:gap-6 items-center">
                      {/* Left - Term (can be text or image) */}
                      {term ? (
                        <div className={isImagePath(term) ? 'flex justify-center' : ''}>
                          <button
                            onClick={() => setSelectedTerm(term)}
                            className={`rounded-lg md:rounded-xl border-2 md:border-4 text-sm md:text-base font-semibold transition-all overflow-hidden ${
                              isImagePath(term) ? 'p-1' : 'p-3 md:p-4 w-full'
                            } ${
                              isWrongTerm
                                ? 'bg-[#1a2332] border-red-500 text-red-400 animate-shake'
                                : isSelected
                                ? 'bg-[#1a2332] border-[#58CC02] text-[#58CC02] scale-105'
                                : 'bg-[#1a2332] border-gray-600 hover:border-gray-500 text-white'
                            }`}
                          >
                            {isImagePath(term) ? (
                              <img src={term} alt="Match item" className="w-28 h-28 md:w-32 md:h-32 object-cover rounded" />
                            ) : (
                              term
                            )}
                          </button>
                        </div>
                      ) : (
                        <div />
                      )}

                      {/* Right - Definition (can be text or image) */}
                      {definition ? (
                        <div className={isImagePath(definition) ? 'flex justify-center' : ''}>
                          <button
                            onClick={async () => {
                              if (!selectedTerm) return;

                              const correctDef = currentQuestion.pairs![selectedTerm];
                              if (definition === correctDef) {
                                setMatchedPairs({...matchedPairs, [selectedTerm]: definition});
                                setSelectedTerm(null);
                                setWrongMatch(null);

                                // Check if all matched
                                if (Object.keys(matchedPairs).length + 1 === Object.keys(currentQuestion.pairs!).length) {
                                  setCorrectAnswers(correctAnswers + 1);

                                  // Award XP for completing matching question
                                  if (!isLessonAlreadyCompleted() && userEmail) {
                                    try {
                                      await addXPMutation({ amount: 5, email: userEmail });
                                    } catch (error) {
                                      console.error("Error adding XP:", error);
                                    }
                                  }

                                  setTimeout(() => handleNext(), 1000);
                                }
                              } else {
                                setWrongMatch({term: selectedTerm, definition});
                                setTimeout(() => {
                                  setWrongMatch(null);
                                  setSelectedTerm(null);
                                }, 1000);
                              }
                            }}
                            disabled={!selectedTerm}
                            className={`rounded-lg md:rounded-xl border-2 md:border-4 text-sm md:text-base transition-all overflow-hidden ${
                              isImagePath(definition) ? 'p-1' : 'p-3 md:p-4 w-full'
                            } ${
                              isWrongDef
                                ? 'bg-[#1a2332] border-red-500 text-red-400 animate-shake'
                                : !selectedTerm
                                ? 'bg-[#1a2332] border-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                                : 'bg-[#1a2332] border-gray-600 hover:border-[#58CC02] text-white cursor-pointer'
                            }`}
                          >
                            {isImagePath(definition) ? (
                              <img src={definition} alt="Match item" className="w-28 h-28 md:w-32 md:h-32 object-cover rounded" />
                            ) : (
                              definition
                            )}
                          </button>
                        </div>
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
          <div className="space-y-4 md:space-y-6">
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
                        <span className={`mx-1 md:mx-2 px-3 md:px-4 py-1 md:py-2 rounded-lg border-2 font-semibold text-sm md:text-lg ${
                          fillInAnswer
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
              {(currentQuestion.wrongOptions || currentQuestion.correctAnswer) &&
                [currentQuestion.correctAnswer, ...(currentQuestion.wrongOptions || [])]
                .filter(Boolean)
                .sort(() => Math.random() - 0.5)
                .map((option) => (
                  <button
                    key={option}
                    onClick={() => setFillInAnswer(option!)}
                    disabled={isChecked}
                    className={`p-3 md:p-4 rounded-lg md:rounded-xl border-2 md:border-4 text-sm md:text-base font-semibold transition-all ${
                      fillInAnswer === option
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

        {/* Step 15.5: Render Multiple Choice Question */}
        {/* Show question with 4 answer options in a grid */}
        {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
          <div className="space-y-4 md:space-y-6">
            {/* Show image if present */}
            {currentQuestion.image && (
              <div className="flex justify-center mb-4 md:mb-6">
                <img
                  src={currentQuestion.image}
                  alt="Question image"
                  className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-xl border-4 border-gray-600"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const showCorrect = isChecked && option.id === currentQuestion.correctAnswer;
                const showWrong = isChecked && isSelected && option.id !== currentQuestion.correctAnswer;

                return (
                  <button
                    key={option.id}
                    onClick={() => !isChecked && setSelectedAnswer(option.id)}
                    disabled={isChecked}
                    className={`p-4 md:p-6 rounded-xl md:rounded-2xl border-2 md:border-4 transition-all flex items-center justify-center min-h-[100px] md:min-h-[120px] ${
                      showCorrect
                        ? "border-[#58CC02] bg-[#1a2332] text-[#58CC02]"
                        : showWrong
                        ? "border-red-500 bg-[#1a2332] text-red-400"
                        : isSelected
                        ? "border-[#58CC02] bg-[#1a2332] text-[#58CC02] scale-105"
                        : "border-gray-600 bg-[#1a2332] text-white hover:border-gray-500"
                    } ${!isChecked ? 'hover:scale-105 active:scale-95' : ''}`}
                  >
                    <span className="text-sm md:text-lg font-semibold text-center">
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 15.7: Render Sentence Building Question - Matches plan.md design */}
        {/* 3 input lines for building sentence, word bank below */}
        {(currentQuestion.type === 'sentence-building' || currentQuestion.type === 'build-sentence') && currentQuestion.words && (
          <div className="space-y-6 md:space-y-8">
            {/* 3 Input Lines - Matches plan.md design */}
            <div className="space-y-3">
              {[0, 1, 2].map((lineIndex) => (
                <div
                  key={lineIndex}
                  className={`w-full border-b-2 ${
                    isChecked && selectedWords.length > 0
                      ? selectedWords.join(' ').toLowerCase().trim() === currentQuestion.correctSentence?.toLowerCase().trim()
                        ? 'border-[#58CC02]'
                        : 'border-red-500'
                      : 'border-gray-500'
                  } pb-2 min-h-[40px] flex items-center gap-2 flex-wrap`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (!isChecked && draggedAvailableIndex !== null) {
                      const word = availableWords[draggedAvailableIndex];
                      setSelectedWords([...selectedWords, word]);
                      setAvailableWords(availableWords.filter((_, i) => i !== draggedAvailableIndex));
                      setDraggedAvailableIndex(null);
                    }
                  }}
                >
                  {lineIndex === 0 && selectedWords.map((word, index) => (
                    <div
                      key={index}
                      draggable={!isChecked}
                      onDragStart={(e) => {
                        if (!isChecked) {
                          setDraggedWordIndex(index);
                          e.dataTransfer.effectAllowed = 'move';
                        }
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isChecked && draggedWordIndex !== null && draggedWordIndex !== index) {
                          const newWords = [...selectedWords];
                          const draggedWord = newWords[draggedWordIndex];
                          newWords.splice(draggedWordIndex, 1);
                          const targetIndex = draggedWordIndex < index ? index : index;
                          newWords.splice(targetIndex, 0, draggedWord);
                          setSelectedWords(newWords);
                          setDraggedWordIndex(null);
                        }
                      }}
                      onDragEnd={() => setDraggedWordIndex(null)}
                      className={`transition-all ${draggedWordIndex === index ? 'opacity-50' : ''}`}
                    >
                      <button
                        onClick={() => {
                          if (!isChecked) {
                            setSelectedWords(selectedWords.filter((_, i) => i !== index));
                            setAvailableWords([...availableWords, word]);
                          }
                        }}
                        disabled={isChecked}
                        className={`px-4 py-2 rounded-lg text-sm md:text-base font-semibold transition-all ${
                          isChecked && selectedWords.join(' ').toLowerCase().trim() === currentQuestion.correctSentence?.toLowerCase().trim()
                            ? 'bg-[#58CC02] text-white border-2 border-[#46A302]'
                            : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {word}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Word Bank - Available words to choose from (matches plan.md style) */}
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
                        setSelectedWords([...selectedWords, word]);
                        setAvailableWords(availableWords.filter((_, i) => i !== index));
                      }
                    }}
                    disabled={isChecked}
                    className="px-6 md:px-8 py-3 md:py-4 bg-white text-gray-800 border-2 border-gray-300 hover:border-blue-400 rounded-xl text-sm md:text-base font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
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
          <div className="space-y-2 md:space-y-3">
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
                        className={`w-full p-2 md:p-4 text-left rounded-lg border-2 transition-all text-xs md:text-base self-center ${
                          selectedColumnA === itemA.id
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
                        className={`w-full p-2 md:p-4 text-left rounded-lg border-2 transition-all text-xs md:text-base self-center ${
                          !selectedColumnA
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
            fillInAnswer.toLowerCase().trim() === currentQuestion.correctAnswer?.toLowerCase().trim() ||
            selectedAnswer === currentQuestion?.correctAnswer ||
            (currentQuestion.type === 'sentence-building' && selectedWords.join(' ').toLowerCase().trim() === currentQuestion.correctSentence?.toLowerCase().trim())
            ? 'bg-[#58CC02] border-[#46A302]' : 'bg-red-500 border-red-700'
          }`}>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between gap-4">
                {/* Left side - Feedback message */}
                <div className="flex items-start gap-3">
                  {/* Checkmark or X icon */}
                  {(fillInAnswer.toLowerCase().trim() === currentQuestion.correctAnswer?.toLowerCase().trim() ||
                    selectedAnswer === currentQuestion?.correctAnswer ||
                    (currentQuestion.type === 'sentence-building' && selectedWords.join(' ').toLowerCase().trim() === currentQuestion.correctSentence?.toLowerCase().trim())) ? (
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                      <Check className="h-6 w-6 text-[#58CC02]" strokeWidth={4} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                      <X className="h-6 w-6 text-red-500" strokeWidth={4} />
                    </div>
                  )}

                  {/* Motivational message */}
                  <div>
                    <p className="text-white font-bold text-lg md:text-2xl">
                      {(fillInAnswer.toLowerCase().trim() === currentQuestion.correctAnswer?.toLowerCase().trim() ||
                        selectedAnswer === currentQuestion?.correctAnswer ||
                        (currentQuestion.type === 'sentence-building' && selectedWords.join(' ').toLowerCase().trim() === currentQuestion.correctSentence?.toLowerCase().trim()))
                        ? ['Nice catch!', 'Correct!', 'Awesome!', 'Amazing!', 'Perfect!', 'Excellent!', 'Great job!', 'Well done!'][Math.floor(Math.random() * 8)]
                        : 'Incorrect'}
                    </p>
                    {currentQuestion.explanation && (
                      <p className="text-white/90 text-sm mt-1">
                        {currentQuestion.explanation}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side - Action buttons */}
                <div className="flex items-center gap-3">
                  {/* Share and Report buttons (only on correct answer) */}
                  {(fillInAnswer.toLowerCase().trim() === currentQuestion.correctAnswer?.toLowerCase().trim() ||
                    selectedAnswer === currentQuestion?.correctAnswer ||
                    (currentQuestion.type === 'sentence-building' && selectedWords.join(' ').toLowerCase().trim() === currentQuestion.correctSentence?.toLowerCase().trim())) && (
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
              onClick={() => router.push('/learn')}
              className="w-full bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-4 md:py-6 text-base md:text-lg rounded-xl"
            >
              Continue Learning
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
