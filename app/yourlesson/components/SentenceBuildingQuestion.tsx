// 🧠 FILE PURPOSE
// This component renders the sentence-building question type.
// The styling has been updated to match the dark, immersive Duolingo theme.

"use client";

import { Volume2 } from 'lucide-react';
import { isImagePath, parseSceneAndQuestion } from '../utils/questionHelpers';

interface SentenceBuildingQuestionProps {
  mainTitle: string;
  bubbleContent: string;
  correctSentence: string;
  selectedWords: string[];
  availableWords: string[];
  isChecked: boolean;
  draggedWordIndex: number | null;
  draggedAvailableIndex: number | null;
  onSelectedWordsChange: (words: string[]) => void;
  onAvailableWordsChange: (words: string[]) => void;
  onDraggedWordIndexChange: (index: number | null) => void;
  onDraggedAvailableIndexChange: (index: number | null) => void;
}

export function SentenceBuildingQuestion({
  mainTitle,
  bubbleContent,
  correctSentence,
  selectedWords,
  availableWords,
  isChecked,
  draggedWordIndex,
  draggedAvailableIndex,
  onSelectedWordsChange,
  onAvailableWordsChange,
  onDraggedWordIndexChange,
  onDraggedAvailableIndexChange,
}: SentenceBuildingQuestionProps) {

  const isCorrect = selectedWords.join(' ').toLowerCase().trim() === (correctSentence || '').toLowerCase().trim();

  return (
    <div className="space-y-6 md:space-y-8">
      <h3 className="text-xl md:text-2xl font-bold text-gray-200">
        {mainTitle}
      </h3>
      <div className="flex items-start gap-4 md:gap-6">
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
        {bubbleContent && (
          <div className="flex-1 relative">
            <div className="relative bg-[#4a5460] rounded-2xl p-6 border-2 border-[#5c6672] shadow-lg
                           before:content-[''] before:absolute before:w-6 before:h-6 
                           before:bg-[#4a5460] before:border-b-2 before:border-l-2 
                           before:border-[#5c6672] before:top-6 before:left-[-14px] 
                           before:rotate-45 before:rounded-bl-lg">
              <div className="flex items-center gap-4">
                {isImagePath(bubbleContent) ? (
                  <img src={bubbleContent} alt="Question content" className="rounded-lg w-full h-auto object-cover" />
                ) : (
                  // Step: Check if bubbleContent contains scene and question
                  // Parse and display with different styling
                  (() => {
                    const { scene, question } = parseSceneAndQuestion(bubbleContent);
                    if (scene) {
                      return (
                        <div className="flex-1">
                          {/* Scene text: italic and gray */}
                          <p className="text-gray-400 text-base md:text-lg italic mb-2">{scene}</p>
                          {/* Question text: bold and white */}
                          <p className="text-white text-base md:text-lg font-bold">{question}</p>
                        </div>
                      );
                    }
                    // No scene - show question as before
                    return <p className="text-white text-base md:text-lg font-bold flex-1">{question}</p>;
                  })()
                )}
                {/* ✅ FIX: Sound icon now only shows for text */}
                {!isImagePath(bubbleContent) && (
                  <button className="text-[#77c6f3] hover:text-[#a9e0ff] transition-colors self-start" aria-label="Play audio">
                    <Volume2 className="w-7 h-7 md:w-8 md:h-8" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3 Input Lines - Styling remains mostly the same */}
      <div className="space-y-3">
        {[0, 1, 2].map((lineIndex) => (
          <div
            key={lineIndex}
            className={`w-full border-b-2 ${
              isChecked && selectedWords.length > 0
                ? isCorrect
                  ? 'border-[#58CC02]'
                  : 'border-red-500'
                : 'border-gray-500'
            } pb-2 min-h-[44px] flex items-center gap-2 flex-wrap`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (!isChecked && draggedAvailableIndex !== null) {
                const word = availableWords[draggedAvailableIndex];
                onSelectedWordsChange([...selectedWords, word]);
                onAvailableWordsChange(availableWords.filter((_, i) => i !== draggedAvailableIndex));
                onDraggedAvailableIndexChange(null);
              }
            }}
          >
            {lineIndex === 0 && selectedWords.map((word, index) => (
              <div
                key={`${word}-${index}`}
                draggable={!isChecked}
                onDragStart={(e) => !isChecked && onDraggedWordIndexChange(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isChecked && draggedWordIndex !== null && draggedWordIndex !== index) {
                    const newWords = [...selectedWords];
                    // ✅ FIX IS HERE: Removed the extra ']'
                    const [draggedItem] = newWords.splice(draggedWordIndex, 1);
                    newWords.splice(index, 0, draggedItem);
                    onSelectedWordsChange(newWords);
                  }
                  onDraggedWordIndexChange(null);
                }}
                onDragEnd={() => onDraggedWordIndexChange(null)}
                className={`transition-all ${draggedWordIndex === index ? 'opacity-50 scale-105' : ''}`}
              >
                <button
                  onClick={() => {
                    if (!isChecked) {
                      onSelectedWordsChange(selectedWords.filter((_, i) => i !== index));
                      onAvailableWordsChange([...availableWords, word]);
                    }
                  }}
                  disabled={isChecked}
                  className={`px-4 py-2 rounded-lg text-sm md:text-base font-bold transition-all disabled:cursor-not-allowed ${
                    isChecked && isCorrect
                      ? 'bg-[#58CC02] text-white border-b-4 border-[#46A302]'
                      : 'bg-[#374151] text-white border-b-4 border-gray-800 hover:bg-gray-600'
                  }`}
                >
                  {word}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Word Bank - Available words (Updated Styling) */}
      <div className="flex flex-wrap gap-2 md:gap-3 justify-center pb-4">
        {availableWords.map((word, index) => (
          <div
            key={`${word}-${index}`}
            draggable={!isChecked}
            onDragStart={(e) => !isChecked && onDraggedAvailableIndexChange(index)}
            onDragEnd={() => onDraggedAvailableIndexChange(null)}
            className={`transition-all ${draggedAvailableIndex === index ? 'opacity-50' : ''}`}
          >
            <button
              onClick={() => {
                if (!isChecked) {
                  onSelectedWordsChange([...selectedWords, word]);
                  onAvailableWordsChange(availableWords.filter((_, i) => i !== index));
                }
              }}
              disabled={isChecked}
              className="px-5 py-2 md:px-6 md:py-3 bg-[#374151] text-white border-2 border-gray-600 border-b-4 border-b-gray-800 hover:bg-gray-600 rounded-2xl text-sm md:text-base font-bold transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {word}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}