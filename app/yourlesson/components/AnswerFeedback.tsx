// 🧠 FILE PURPOSE
// This component renders the bottom action bar with CHECK button and feedback panel.
// Shows motivational messages, share/report buttons, and CONTINUE button after checking.

"use client";

import { Check, X } from "lucide-react";
import { getMotivationalMessage } from '../utils/questionHelpers';

interface AnswerFeedbackProps {
  isChecked: boolean;
  isCorrect: boolean;
  canAnswer: boolean;
  isMatching: boolean;
  hasAnswer: boolean;
  explanation?: string; // Legacy single explanation
  feedback?: {
    correct?: string;
    incorrect?: string;
  }; // New feedback format
  correctAnswer?: string; // For showing correct answer when wrong
  motivationalMessage?: string; // Pre-generated message to avoid changing
  onCheck: () => void;
  onContinue: () => void;
}

export function AnswerFeedback({
  isChecked,
  isCorrect,
  canAnswer,
  isMatching,
  hasAnswer,
  explanation,
  feedback,
  correctAnswer,
  motivationalMessage,
  onCheck,
  onContinue,
}: AnswerFeedbackProps) {

  // Determine which feedback to show
  // Priority: feedback object > explanation (legacy) > default messages
  console.log('🔍 [FEEDBACK] Component received:', { feedback, explanation, isCorrect, isChecked });

  const feedbackText = feedback
    ? (isCorrect ? feedback.correct : feedback.incorrect)
    : explanation || (isCorrect ? 'Correct!' : 'Incorrect. Try again!');

  console.log('🔍 [FEEDBACK] Final feedbackText:', feedbackText);

  // Don't show for matching questions (they auto-continue)
  if (isMatching) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Before Answer - Show CHECK button (matches plan.md large button style) */}
      {!isChecked && (
        <div className="bg-[#1F2937] border-t-4 border-gray-700 px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={onCheck}
              disabled={!hasAnswer || !canAnswer}
              className="w-full bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-6 text-xl rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all border-b-4 border-[#46A302] active:border-b-0 active:mt-1"
            >
              {canAnswer ? 'CHECK' : 'Out of Hearts! 💔'}
            </button>
          </div>
        </div>
      )}

      {/* After Answer - Show feedback panel (matches plan.md design) */}
      {isChecked && (
        <div className={`border-t-4 px-6 py-6 ${
          isCorrect
            ? 'bg-[#58CC02] border-[#46A302]'
            : 'bg-red-500 border-red-700'
        }`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start justify-between gap-4">
              {/* Left side - Feedback message */}
              <div className="flex items-start gap-3">
                {/* Checkmark or X icon */}
                {isCorrect ? (
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
                    {isCorrect ? (motivationalMessage || 'Correct!') : 'Incorrect'}
                  </p>
                  {!isCorrect && correctAnswer && (
                    <p className="text-white/90 text-sm mt-1">
                      <span className="font-semibold">Correct answer:</span> {correctAnswer}
                    </p>
                  )}
                  {feedbackText && (
                    <p className="text-white/90 text-sm mt-1">
                      {feedbackText}
                    </p>
                  )}
                </div>
              </div>

              {/* Right side - Action buttons */}
              <div className="flex items-center gap-3">
                {/* Share and Report buttons (only on correct answer) */}
                {isCorrect && (
                  <>
                    {/* Share button */}
                    <button
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      aria-label="Share"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                    {/* Report button */}
                    <button
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      aria-label="Report"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                    </button>
                  </>
                )}

                {/* CONTINUE button */}
                <button
                  onClick={onContinue}
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
  );
}

// ✅ In this component we achieved:
// A complete feedback system matching the plan.md design.
// Large CHECK button, green/red feedback panel, motivational messages, and action buttons.
