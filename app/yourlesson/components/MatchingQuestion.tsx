// 🧠 FILE PURPOSE
// Renders the matching question type with a puzzle/game style.
// Terms appear as light blue chips, definitions as light gray chips.
// Visual connectors (dots) between columns make it look interactive.

"use client";

import { isImagePath, parseSceneAndQuestion } from '../utils/questionHelpers';
import { FormattedText } from '../utils/textFormatter';
import { ArrowRight } from 'lucide-react';

interface MatchingQuestionProps {
  mainTitle: string;
  pairs: { [term: string]: string };
  selectedTerm: string | null;
  matchedPairs: { [key: string]: string };
  wrongMatch: { term: string; definition: string } | null;
  shuffledDefinitions: string[];
  onTermSelect: (term: string) => void;
  onDefinitionClick: (definition: string) => void;
}

export function MatchingQuestion({
  mainTitle,
  pairs,
  selectedTerm,
  matchedPairs,
  wrongMatch,
  shuffledDefinitions,
  onTermSelect,
  onDefinitionClick,
}: MatchingQuestionProps) {

  const unmatchedTerms = Object.keys(pairs).filter(term => !matchedPairs[term]);
  const unmatchedDefs = shuffledDefinitions.filter((def: any) => !Object.values(matchedPairs).includes(def));
  const maxItems = Math.max(unmatchedTerms.length, unmatchedDefs.length);

  // Step 1: Parse title for scene/question
  const { scene, question } = parseSceneAndQuestion(mainTitle);
  const hasScene = scene !== null;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Step 2: Show chat bubble if scene exists, otherwise show clean title */}
      {hasScene ? (
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
                <div className="flex-1">
                  <p className="text-gray-400 text-base md:text-lg italic mb-2">
                    <FormattedText text={scene} />
                  </p>
                  <p className="text-white text-base md:text-lg font-bold">
                    <FormattedText text={question} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h3 className="text-xl md:text-2xl font-bold text-gray-200 text-center">
          <FormattedText text={question} />
        </h3>
      )}

      {/* Step 3: Instruction text */}
      <p className="text-gray-400 text-center text-sm md:text-base">
        Select a term from the left, then tap its matching definition on the right
      </p>

      {/* Step 4: Matching grid with chip/tile style */}
      <div className="space-y-3 md:space-y-4 max-w-3xl mx-auto">
        {Array.from({ length: maxItems }).map((_, index) => {
          const term = unmatchedTerms[index];
          const definition = unmatchedDefs[index];
          const isSelected = selectedTerm === term;
          const isWrongTerm = wrongMatch?.term === term;
          const isWrongDef = wrongMatch?.definition === definition;

          return (
            <div key={`row-${index}`} className="flex items-center gap-3 md:gap-4">
              {/* Left Column - Terms (Light Blue Chips) */}
              {term ? (
                <div className={`flex-1 ${isImagePath(term) ? 'flex justify-center' : ''}`}>
                  <button
                    onClick={() => onTermSelect(term)}
                    className={`w-full rounded-xl border-2 text-sm md:text-base font-semibold transition-all overflow-hidden ${
                      isImagePath(term) ? 'p-2' : 'p-4 md:p-5'
                    } ${
                      isWrongTerm
                        ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                        : isSelected
                        ? 'bg-blue-500/30 border-blue-400 text-blue-200 scale-105 shadow-lg shadow-blue-500/30'
                        : 'bg-blue-500/10 border-blue-500/30 text-blue-200 hover:bg-blue-500/20 hover:border-blue-400'
                    }`}
                  >
                    {isImagePath(term) ? (
                      <img src={term} alt="Match term" className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-lg" />
                    ) : (
                      <FormattedText text={term} />
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex-1" />
              )}

              {/* Connector - Arrow Icon */}
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  selectedTerm === term
                    ? 'bg-blue-500/30 border-2 border-blue-400'
                    : 'bg-gray-700/50 border-2 border-gray-600'
                }`}>
                  <ArrowRight className={`w-4 h-4 ${
                    selectedTerm === term ? 'text-blue-300' : 'text-gray-500'
                  }`} />
                </div>
              </div>

              {/* Right Column - Definitions (Light Gray Chips) */}
              {definition ? (
                <div className={`flex-1 ${isImagePath(definition) ? 'flex justify-center' : ''}`}>
                  <button
                    onClick={() => onDefinitionClick(definition)}
                    disabled={!selectedTerm}
                    className={`w-full rounded-xl border-2 text-sm md:text-base font-semibold transition-all overflow-hidden ${
                      isImagePath(definition) ? 'p-2' : 'p-4 md:p-5'
                    } ${
                      isWrongDef
                        ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                        : !selectedTerm
                        ? 'bg-gray-700/30 border-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                        : 'bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/60 hover:border-green-500 cursor-pointer'
                    }`}
                  >
                    {isImagePath(definition) ? (
                      <img src={definition} alt="Match definition" className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-lg" />
                    ) : (
                      <FormattedText text={definition} />
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ✅ In this component we achieved:
// Interactive chip/tile style with distinct colors (blue for terms, gray for definitions).
// Visual arrow connectors between columns for better UX.
// Responsive design with hover states and selection feedback.
