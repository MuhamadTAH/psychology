// 🧠 FILE PURPOSE
// Renders a button-based fill-in-the-blank question.
// Supports multiple blanks (___) or (--------) in one sentence.
// Blanks are styled as distinctive input boxes with purple/blue brand colors.
// The sentence is presented inside a speech bubble next to the character.

"use client";

import { useState, useEffect } from 'react';
import { shuffleArray, parseSceneAndQuestion } from '../utils/questionHelpers';
import { FormattedText } from '../utils/textFormatter';

// Props updated to support multiple blanks and new data format
interface FillInBlankQuestionProps {
  mainTitle: string;
  sentence: string;
  // New format (preferred)
  fillInOptions?: string[]; // All word options (correct + wrong) for fill-in questions
  answers?: string[]; // Multiple correct answers
  // Legacy format (backward compatible)
  correctAnswer?: string | string[]; // Can be single answer or array for multiple blanks
  wrongOptions?: string[]; // Wrong options only
  selectedAnswer: string | null;
  isChecked: boolean;
  onAnswerSelect: (answer: string) => void;
}

export function FillInBlankQuestion({
  mainTitle,
  sentence,
  fillInOptions,
  answers,
  correctAnswer,
  wrongOptions,
  selectedAnswer,
  isChecked,
  onAnswerSelect,
}: FillInBlankQuestionProps) {

  // Step 1: Detect how many blanks are in the sentence
  // Support both '___' and '(--------)' formats
  let parts: string[];
  let blankCount: number;

  if (sentence.includes('___')) {
    // Format 1: Three underscores (legacy format)
    parts = sentence.split('___');
    blankCount = parts.length - 1;
  } else if (sentence.includes('(--------)')) {
    // Format 2: Dashes in parentheses (new format)
    parts = sentence.split('(--------)');
    blankCount = parts.length - 1;
  } else {
    // No blanks detected
    parts = [sentence];
    blankCount = 0;
  }

  // Step 2: State for multiple blanks
  // filledBlanks[0] = first blank answer, filledBlanks[1] = second blank answer, etc.
  const [filledBlanks, setFilledBlanks] = useState<(string | null)[]>(Array(blankCount).fill(null));
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);

  // Step 3: Initialize shuffled options on mount
  // ✅ FIX: Support both new format (fillInOptions + answers) and legacy format (correctAnswer + wrongOptions)
  useEffect(() => {
    let allOptions: string[];

    if (fillInOptions && fillInOptions.length > 0) {
      // New format: use provided fillInOptions array
      allOptions = [...fillInOptions];
    } else if (correctAnswer && wrongOptions) {
      // Legacy format: combine correctAnswer and wrongOptions
      const correctAnswers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
      allOptions = [...correctAnswers, ...wrongOptions];
    } else {
      allOptions = [];
    }

    setAvailableOptions(shuffleArray(allOptions));
    setFilledBlanks(Array(blankCount).fill(null));
  }, [fillInOptions, answers, correctAnswer, wrongOptions, blankCount]);

  // Step 4: Handle option click - fills the next empty blank
  const handleOptionClick = (option: string) => {
    if (isChecked) return;

    // Find the first empty blank
    const firstEmptyIndex = filledBlanks.findIndex(blank => blank === null);
    if (firstEmptyIndex === -1) return; // All blanks filled

    // Fill that blank
    const newFilledBlanks = [...filledBlanks];
    newFilledBlanks[firstEmptyIndex] = option;
    setFilledBlanks(newFilledBlanks);

    // Remove option from available
    setAvailableOptions(availableOptions.filter(opt => opt !== option));

    // Notify parent with all answers joined
    onAnswerSelect(newFilledBlanks.filter(b => b !== null).join(', '));
  };

  // Step 5: Handle blank click - returns word to options
  const handleBlankClick = (index: number) => {
    if (isChecked) return;

    const word = filledBlanks[index];
    if (!word) return;

    // Remove from filled
    const newFilledBlanks = [...filledBlanks];
    newFilledBlanks[index] = null;
    setFilledBlanks(newFilledBlanks);

    // Add back to available
    setAvailableOptions([...availableOptions, word]);

    // Notify parent
    onAnswerSelect(newFilledBlanks.filter(b => b !== null).join(', '));
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Dynamic Title */}
      <h3 className="text-xl md:text-2xl font-bold text-gray-200 text-center">{mainTitle}</h3>

      {/* Character and Speech Bubble Area */}
      <div className="flex items-start justify-center gap-4 md:gap-6 mt-4">
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

        {/* The sentence is now inside a speech bubble container */}
        <div className="relative w-fit max-w-2xl">
          <div className="relative bg-[#4a5460] rounded-2xl p-6 border-2 border-[#5c6672] shadow-lg
                         before:content-[''] before:absolute before:w-6 before:h-6
                         before:bg-[#4a5460] before:border-b-2 before:border-l-2
                         before:border-[#5c6672] before:top-6 before:left-[-14px]
                         before:rotate-45 before:rounded-bl-lg">

            {/* Step: Parse and display scene and sentence with blanks */}
            {(() => {
              const { scene, question } = parseSceneAndQuestion(sentence);

              // 🔍 DEBUG: Log fill-in-blank parsing
              console.log('✏️ [FILL-IN-BLANK] === RENDER DEBUG ===');
              console.log('✏️ [FILL-IN-BLANK] sentence:', sentence);
              console.log('✏️ [FILL-IN-BLANK] Parsed scene:', scene);
              console.log('✏️ [FILL-IN-BLANK] Parsed question:', question);
              console.log('✏️ [FILL-IN-BLANK] Blank format detected:', sentence.includes('___') ? '___' : sentence.includes('(--------)') ? '(--------)' : 'NONE');

              // If there's a scene, show it first in gray italic
              return (
                <div className="flex flex-col gap-3">
                  {scene && (
                    <p className="text-gray-400 text-base md:text-lg italic">
                      <FormattedText text={scene} />
                    </p>
                  )}

                  {/* Render sentence parts with blanks */}
                  <div className="text-gray-200 text-lg md:text-xl flex flex-wrap items-center gap-x-2 gap-y-2">
                    {parts.map((part, index) => (
                      <span key={index} className="inline-flex items-center gap-2">
                        <span><FormattedText text={part} /></span>
                        {index < parts.length - 1 && (
                          // Render a blank slot - Styled as distinctive input box with brand color
                          <button
                            onClick={() => handleBlankClick(index)}
                            disabled={!filledBlanks[index]}
                            className={`rounded-xl px-5 py-2.5 min-w-[140px] text-center font-bold border-2 border-b-4 transition-all ${
                              filledBlanks[index]
                                ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500 text-purple-200 hover:border-red-500 hover:from-red-500/20 hover:to-red-500/10 cursor-pointer shadow-lg shadow-purple-500/20'
                                : 'bg-gray-800/50 border-dashed border-purple-500/40 text-purple-400/60 cursor-default'
                              }`}
                          >
                            {filledBlanks[index] || '________'}
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* The shuffled word options as buttons */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-md mx-auto">
        {availableOptions.map((option, index) => (
          <button
            key={`${option}-${index}`}
            onClick={() => handleOptionClick(option)}
            disabled={isChecked}
            className={`p-3 md:p-4 rounded-xl border-2 border-b-4 transition-all font-bold
                       bg-[#374151] border-gray-600 text-white hover:bg-gray-600
                       disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <FormattedText text={option} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ✅ In this component we achieved:
// Support for multiple blanks in one sentence.
// Styled blanks as distinctive input boxes with brand colors (purple/blue gradient).
// Dashed border and underscore placeholder draws attention to empty blanks.
// Click options to fill blanks sequentially, click filled blanks to return words.
