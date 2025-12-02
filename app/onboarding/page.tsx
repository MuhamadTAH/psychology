"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const saveOnboarding = useMutation(api.onboarding.saveOnboardingAnswers);

  const questions = [
    {
      id: "subject",
      question: "What is your favorite subject?",
      options: [
        { value: "math", label: "🔢 Math" },
        { value: "science", label: "🔬 Science" },
        { value: "english", label: "📚 English" },
        { value: "history", label: "🏛️ History" },
        { value: "art", label: "🎨 Art" },
        { value: "music", label: "🎵 Music" },
      ],
    },
    {
      id: "study_time", 
      question: "When do you like to study?",
      options: [
        { value: "morning", label: "🌅 Morning" },
        { value: "afternoon", label: "☀️ Afternoon" },
        { value: "evening", label: "🌙 Evening" },
        { value: "anytime", label: "⏰ Anytime!" },
      ],
    },
    {
      id: "motivation",
      question: "Why are you learning?",
      options: [
        { value: "fun", label: "Just for fun" },
        { value: "education", label: "Support my education" },
        { value: "connect", label: "Connect with people" },
        { value: "productive", label: "Spend time productively" },
        { value: "career", label: "Boost my career" },
        { value: "travel", label: "Prepare for travel" },
      ],
    },
  ];

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleSelectOption = (value: string) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);
  };

  const handleContinue = async () => {
    if (!answers[currentQ.id]) return; // Don't proceed without selection
    
    if (isLastQuestion) {
      // Save answers to database
      try {
        await saveOnboarding({
          favoriteSubject: answers.subject,
          studyTime: answers.study_time,
          motivation: answers.motivation,
        });
      } catch (error) {
        console.error("Failed to save onboarding:", error);
      }
      router.push("/learn");
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        
        {/* Progress Bar */}
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Top Section: Character + Question */}
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 mb-6 lg:mb-8 max-w-2xl mx-auto">
          
          {/* Character Placeholder - Smaller on mobile */}
          <div className="w-32 h-32 lg:w-64 lg:h-64 bg-white rounded-3xl shadow-lg flex items-center justify-center border-2 border-gray-200">
            <p className="text-gray-500 text-sm lg:text-lg">3D Character</p>
            {/* You'll replace this with your 3D character component */}
          </div>

          {/* Question Text */}
          <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start">
            <h1 className="text-2xl lg:text-5xl font-bold text-gray-800 text-center lg:text-left leading-tight">
              {currentQ.question}
            </h1>
          </div>
        </div>

        {/* Bottom Section - Options & Continue Button */}
        <div className="max-w-2xl mx-auto">
          
          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelectOption(option.value)}
                className={`
                  w-full p-3 lg:p-4 rounded-2xl border-2 transition-all duration-200 text-left
                  ${
                    answers[currentQ.id] === option.value
                      ? "border-green-500 bg-green-50 shadow-md scale-[1.02]"
                      : "border-gray-300 bg-white hover:border-green-300 hover:bg-green-25"
                  }
                  flex items-center gap-3
                `}
              >
                <span className="text-xl lg:text-2xl">{option.label.split(' ')[0]}</span>
                <span className="text-base lg:text-lg font-medium text-gray-800">
                  {option.label.replace(option.label.split(' ')[0] + ' ', '')}
                </span>
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!answers[currentQ.id]}
            className={`
              w-full py-3 lg:py-4 px-6 rounded-2xl font-bold text-white text-base lg:text-lg transition-all duration-200
              ${
                answers[currentQ.id] 
                  ? "bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  : "bg-gray-400 cursor-not-allowed"
              }
            `}
          >
            CONTINUE
          </button>

          {/* Skip Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push("/learn")}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}