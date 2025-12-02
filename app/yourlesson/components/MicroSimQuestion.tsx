// 🧠 FILE PURPOSE
// Renders micro-simulation questions with multiple steps.
// Each step is a mini scenario with scene, options, and feedback.
// Shows correct/incorrect feedback based on answer choice (not explanation).

"use client";

interface MicroSimStep {
  scene: string;
  options: string[];
  correct: string;
  feedback: {
    correct: string;
    incorrect: string;
  } | string; // Can be object or legacy string format
}

interface MicroSimQuestionProps {
  mainTitle: string;
  scenarioTitle: string;
  steps: MicroSimStep[];
  currentStepIndex: number;
  selectedAnswer: string | null;
  isChecked: boolean;
  onAnswerSelect: (answer: string) => void;
}

export function MicroSimQuestion({
  mainTitle,
  scenarioTitle,
  steps,
  currentStepIndex,
  selectedAnswer,
  isChecked,
  onAnswerSelect,
}: MicroSimQuestionProps) {

  const currentStep = steps[currentStepIndex];
  if (!currentStep) return null;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Main title and scenario title */}
      <div className="text-center space-y-2">
        <h3 className="text-xl md:text-2xl font-bold text-gray-200">{mainTitle}</h3>
        <p className="text-base md:text-lg text-blue-400 font-semibold">{scenarioTitle}</p>
        <p className="text-sm text-gray-400">Step {currentStepIndex + 1} of {steps.length}</p>
      </div>

      {/* Character and Speech Bubble Area */}
      <div className="flex items-start justify-center gap-4 md:gap-6">
        <div className="flex-shrink-0">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-0.5 shadow-lg shadow-blue-500/30">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-800 p-1 flex items-center justify-center overflow-hidden">
              <img
                src="/cat-character.png"
                alt="Cat character"
                className="w-full h-full object-contain scale-200"
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
              {/* Scene text in italic gray */}
              <p className="text-gray-300 text-base md:text-lg italic">{currentStep.scene}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Answer options grid */}
      <div className="grid grid-cols-1 gap-3 md:gap-4 max-w-2xl mx-auto">
        {currentStep.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const showCorrect = isChecked && option === currentStep.correct;
          const showWrong = isChecked && isSelected && option !== currentStep.correct;

          return (
            <button
              key={index}
              onClick={() => !isChecked && onAnswerSelect(option)}
              disabled={isChecked}
              className={`p-4 md:p-6 rounded-xl md:rounded-2xl border-2 md:border-4 transition-all flex items-center justify-center min-h-[80px] ${
                showCorrect
                  ? "border-[#58CC02] bg-[#1a2332] text-[#58CC02]"
                  : showWrong
                  ? "border-red-500 bg-[#1a2332] text-red-400"
                  : isSelected
                  ? "border-[#58CC02] bg-[#1a2332] text-[#58CC02] scale-105"
                  : "border-gray-600 bg-[#1a2332] text-white hover:border-gray-500"
              } ${!isChecked ? 'hover:scale-105 active:scale-95' : ''}`}
            >
              <span className="text-sm md:text-base font-semibold text-left">
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ✅ In this component we achieved:
// Support for multi-step micro-simulation scenarios.
// Display scene in italic for story immersion.
// Handle correct/incorrect feedback (to be shown in parent component).
