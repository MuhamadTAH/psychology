// 🧠 FILE PURPOSE
// Random Quiz redirect page - creates random quiz from all lessons and starts in lesson UI.
// Redirects to the lesson page with random quiz questions loaded.

"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DARK_PSYCHOLOGY_LESSONS } from "@/lib/darkPsychologyLessons";

export default function DarkPsychologyQuiz() {
  const router = useRouter();

  // Step 1: Generate random questions from all lessons
  const randomQuestions = useMemo(() => {
    const allQuestions: any[] = [];

    // Collect all questions from all Dark Psychology lessons
    DARK_PSYCHOLOGY_LESSONS.forEach((lesson) => {
      if (lesson.practice && lesson.practice.length > 0) {
        lesson.practice.forEach((q: any) => {
          allQuestions.push({
            ...q,
            lessonTitle: lesson.lessonTitle || lesson.title,
          });
        });
      }

      // Also collect from parts if multi-part lesson
      if (lesson.parts && lesson.parts.length > 0) {
        lesson.parts.forEach((part: any) => {
          if (part.questions && part.questions.length > 0) {
            part.questions.forEach((q: any) => {
              allQuestions.push({
                ...q,
                lessonTitle: lesson.lessonTitle || lesson.title,
              });
            });
          }
        });
      }
    });

    // Shuffle and take 10 random questions
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(10, shuffled.length));
  }, []);

  // Step 2: Store quiz questions and redirect to lesson page
  useEffect(() => {
    if (randomQuestions.length > 0) {
      localStorage.setItem('quizMode', 'true');
      localStorage.setItem('quizQuestions', JSON.stringify(randomQuestions));
      localStorage.setItem('lessonCategory', 'dark-psychology-quiz');

      // Redirect to lesson page
      router.push('/yourlesson');
    }
  }, [randomQuestions, router]);

  if (randomQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shuffle className="w-24 h-24 text-gray-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">No Questions Available</h2>
          <p className="text-gray-400 text-lg mb-8">
            Complete some lessons first to unlock the quiz!
          </p>
          <Button
            onClick={() => router.push("/dark-psychology-dashboard")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">Preparing quiz...</div>
    </div>
  );
}

// ✅ In this page we achieved:
// Generates 10 random questions from all Dark Psychology lessons.
// Stores them in localStorage for the lesson page to use.
// Redirects to /yourlesson which uses the same UI as regular lessons.
