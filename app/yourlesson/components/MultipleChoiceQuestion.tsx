// 🧠 FILE PURPOSE
// Renders the multiple-choice question type with dynamic layouts:
// - Chat bubble with character for questions WITH a scene
// - Clean card for questions WITHOUT a scene

"use client";

import { Volume2 } from 'lucide-react';
import { isImagePath, parseSceneAndQuestion } from '../utils/questionHelpers';
import { FormattedText } from '../utils/textFormatter';

interface MultipleChoiceQuestionProps {
  mainTitle: string;
  bubbleContent: string;
  options: Array<{ id: string, text: string }>;
  correctAnswer: string;
  selectedAnswer: string | null;
  isChecked: boolean;
  onAnswerSelect: (answerId: string) => void;
}

export function MultipleChoiceQuestion({
  mainTitle,
  bubbleContent,
  options,
  correctAnswer,
  selectedAnswer,
  isChecked,
  onAnswerSelect,
}: MultipleChoiceQuestionProps) {

  // Step 1: Check if this question has a scene
  const { scene, question } = isImagePath(bubbleContent)
    ? { scene: null, question: bubbleContent }
    : parseSceneAndQuestion(bubbleContent);

  const hasScene = scene !== null;

  return (
    <div className="space-y-4 md:space-y-6">
      <h3 className="text-xl md:text-2xl font-bold text-gray-200">{mainTitle}</h3>

      {/* Step 2: Render CHAT BUBBLE layout if scene exists */}
      {hasScene && bubbleContent && (
        <div className="flex items-start gap-4 md:gap-6 mr-10">
          <div className="flex-shrink-0">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-0.5 shadow-lg shadow-blue-500/30">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-800 p-1 flex items-center justify-center overflow-hidden">
                <img
                  src="/cat-character.png"
                  alt="Cat character"
                  className="w-full h-full object-contain scale-110"
                />
              </div>
            </div>
          </div>
          <div className="relative w-fit">
            <div className="relative bg-[#4a5460] rounded-2xl p-6 border-2 border-[#5c6672] shadow-lg
                           before:content-[''] before:absolute before:w-6 before:h-6
                           before:bg-[#4a5460] before:border-b-2 before:border-l-2
                           before:border-[#5c6672] before:top-6 before:left-[-14px]
                           before:rotate-45 before:rounded-bl-lg">
              <div className="flex items-center gap-4">
                {isImagePath(bubbleContent) ? (
                  <img src={bubbleContent} alt="Question content" className="rounded-lg w-40 h-40 object-cover" />
                ) : (
                  <div className="flex-1">
                    {/* Scene text: italic and lighter gray */}
                    <p className="text-gray-300 text-base md:text-lg italic mb-3 leading-relaxed">
                      <FormattedText text={scene} />
                    </p>
                    {/* Question text: bold and white */}
                    <p className="text-white text-lg md:text-xl font-bold">
                      <FormattedText text={question} />
                    </p>
                  </div>
                )}
                {/* Sound icon only for text */}
                {!isImagePath(bubbleContent) && (
                  <button className="text-[#77c6f3] hover:text-[#a9e0ff] transition-colors self-start" aria-label="Play audio">
                    <Volume2 className="w-7 h-7 md:w-8 md:h-8" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Render CLEAN CARD layout if NO scene */}
      {!hasScene && bubbleContent && !isImagePath(bubbleContent) && (
        <div className="flex items-center justify-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border-2 border-gray-600 shadow-xl p-6 md:p-8 max-w-2xl w-full">
            <div className="flex items-start">
              <p className="text-white text-lg md:text-xl font-semibold leading-relaxed">
                <FormattedText text={question} />
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Render image if provided */}
      {isImagePath(bubbleContent) && (
        <div className="flex justify-center">
          <img src={bubbleContent} alt="Question content" className="rounded-2xl border-2 border-gray-600 shadow-lg max-w-md" />
        </div>
      )}

      {/* Step 5: Answer options grid (same for both layouts) */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const showCorrect = isChecked && option.id === correctAnswer;
          const showWrong = isChecked && isSelected && option.id !== correctAnswer;

          return (
            <button
              key={option.id}
              onClick={() => !isChecked && onAnswerSelect(option.id)}
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
                <FormattedText text={option.text} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ✅ In this component we achieved:
// Two distinct visual styles: chat bubble for scenes, clean card for direct questions.
// Responsive design works for both layouts.
