"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export default function LessonPage() {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const question = "What is the capital of France?";
  const correctAnswer = "B";
  const options = [
    { id: "A", text: "London" },
    { id: "B", text: "Paris" },
    { id: "C", text: "Berlin" },
    { id: "D", text: "Madrid" },
  ];

  const handleCheckAnswer = () => {
    setIsChecked(true);
    if (selectedAnswer === correctAnswer) {
      setShowSuccessModal(true);
    }
  };

  const handleRepeat = () => {
    setSelectedAnswer(null);
    setIsChecked(false);
    setShowSuccessModal(false);
  };

  const handleEndLesson = () => {
    // Mark lesson as completed
    localStorage.setItem('lesson1Completed', 'true');
    router.push('/upload');
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className="min-h-screen bg-background p-8 relative">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
              {question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {options.map((option) => {
              const isSelected = selectedAnswer === option.id;
              const showCorrect = isChecked && option.id === correctAnswer;
              const showWrong = isChecked && isSelected && option.id !== correctAnswer;

              return (
                <button
                  key={option.id}
                  onClick={() => !isChecked && setSelectedAnswer(option.id)}
                  disabled={isChecked}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all flex items-center justify-between ${
                    showCorrect
                      ? "border-green-500 bg-green-50"
                      : showWrong
                      ? "border-red-500 bg-red-50"
                      : isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400 bg-white"
                  }`}
                >
                  <div>
                    <span className="font-semibold text-gray-700">
                      {option.id}.
                    </span>{" "}
                    <span className="text-gray-800">{option.text}</span>
                  </div>
                  {showCorrect && (
                    <Check className="h-6 w-6 text-green-600" />
                  )}
                  {showWrong && (
                    <X className="h-6 w-6 text-red-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              onClick={handleCheckAnswer}
              className="w-full"
              size="lg"
              disabled={!selectedAnswer || isChecked}
            >
              Check Answer
            </Button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="h-12 w-12 text-white" />
              </div>
            </div>

            {/* Well Done Message */}
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
              Well Done!
            </h2>
            <p className="text-center text-gray-600 mb-8">
              You got the correct answer!
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleRepeat}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Repeat Lesson
              </Button>
              <Button
                onClick={handleEndLesson}
                variant="secondary"
                className="w-full"
                size="lg"
              >
                End Lesson
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}