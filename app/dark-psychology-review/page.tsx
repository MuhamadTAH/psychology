// 🧠 FILE PURPOSE
// Review Mode redirect page - loads wrong answers and starts them in the lesson UI.
// Redirects to the lesson page with review questions loaded.

"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Trophy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DarkPsychologyReview() {
  const router = useRouter();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  // Step 1: Load all wrong answers for review
  const allWrongAnswers = useQuery(api.darkPsychology.getAllWrongAnswers, { email: userEmail });

  // Step 2: When wrong answers load, store them and redirect to lesson page
  useEffect(() => {
    if (allWrongAnswers && allWrongAnswers.length > 0) {
      // Store review questions in localStorage
      const reviewQuestions = allWrongAnswers.map((item: any) => ({
        question: item.question,
        correctAnswer: item.correctAnswer,
        type: item.questionType,
        // Add options for multiple choice if available
        options: item.userAnswer !== item.correctAnswer ? [item.userAnswer] : [],
      }));

      localStorage.setItem('reviewMode', 'true');
      localStorage.setItem('reviewQuestions', JSON.stringify(reviewQuestions));
      localStorage.setItem('lessonCategory', 'dark-psychology-review');

      // Redirect to lesson page
      router.push('/yourlesson');
    }
  }, [allWrongAnswers, router]);

  if (!allWrongAnswers) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading review questions...</div>
      </div>
    );
  }

  // Step 3: Handle no questions to review
  if (allWrongAnswers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <button
            onClick={() => router.push("/dark-psychology-dashboard")}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="text-center py-20">
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">No Questions to Review!</h2>
            <p className="text-gray-400 text-lg mb-8">
              You haven't made any mistakes yet, or you've mastered all your review questions.
            </p>
            <Button
              onClick={() => router.push("/dark-psychology-dashboard")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">Preparing review questions...</div>
    </div>
  );
}

// ✅ In this page we achieved:
// Loads wrong answers from the review system.
// Stores them in localStorage for the lesson page to use.
// Redirects to /yourlesson which uses the same UI as regular lessons.
