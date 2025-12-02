// 🧠 FILE PURPOSE
// Admin page for adding new Dark Psychology lessons via JSON input.
// Lessons are saved to darkPsychologyLessons.ts file and become globally available.

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

export default function AddDarkPsychologyLessonPage() {
  const router = useRouter();
  const [jsonInput, setJsonInput] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Step 1: Handle form submission
  // Parse the JSON and validate it has required fields
  const handleSubmit = async () => {
    setMessage("");
    setError("");

    try {
      // Step: Clean and parse JSON input
      // Remove any trailing content after the JSON
      let cleanedInput = jsonInput.trim();

      // Find the last closing brace or bracket
      const lastBrace = cleanedInput.lastIndexOf('}');
      const lastBracket = cleanedInput.lastIndexOf(']');
      const lastClosing = Math.max(lastBrace, lastBracket);

      if (lastClosing !== -1 && lastClosing < cleanedInput.length - 1) {
        // There's content after the JSON, trim it
        cleanedInput = cleanedInput.substring(0, lastClosing + 1);
      }

      const lessonData = JSON.parse(cleanedInput);

      // Validate required fields (support all three formats)
      const isSimpleFormat = lessonData.number && lessonData.title && lessonData.practice;
      const isComplexFormat = lessonData.lessons && Array.isArray(lessonData.lessons);
      const isComprehensiveFormat = lessonData.sectionId && lessonData.contentScreens;

      if (!isSimpleFormat && !isComplexFormat && !isComprehensiveFormat) {
        setError("JSON must be in simple format (number, title, practice), complex format (lessons array with stages), or comprehensive format (sectionId, contentScreens)");
        return;
      }

      // Send to API to save
      const response = await fetch("/api/add-dark-psychology-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lessonData),
      });

      const result = await response.json();

      if (response.ok) {
        const titles = result.lessonTitles?.join(", ") || lessonData.title;
        setMessage(`✅ ${result.message || `Lesson "${titles}" added successfully!`}`);
        setJsonInput(""); // Clear input

        // Reload the page after 2 seconds to show new lessons
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setError(result.error || "Failed to add lesson");
      }
    } catch (err) {
      setError("Invalid JSON format. Please check your input.");
      console.error(err);
    }
  };

  // ✅ This section provides the UI for admins to paste JSON and save lessons

  return (
    <div className="min-h-screen bg-[#1F2937] text-white">
      {/* Header */}
      <div className="bg-[#1F2937] border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Add Dark Psychology Lesson</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/learn")}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Learn
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-gray-800 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Instructions</h2>
          <p className="text-gray-300 mb-4">
            Paste your lesson JSON below. The system supports two formats:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-md font-semibold text-purple-400 mb-2">Format 1: Simple (Single Lesson)</h3>
              <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto text-green-400">
{`{
  "number": 1,
  "title": "Lesson Title",
  "practice": [...]
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-md font-semibold text-purple-400 mb-2">Format 2: Complex (Multiple Lessons with Stages)</h3>
              <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto text-green-400">
{`{
  "topic": "Topic Name",
  "lessons": [
    {
      "lessonNumber": 1,
      "title": "Lesson Title",
      "stages": [
        {
          "type": "Learn",
          "exercises": [
            { "type": "matching", "question": "...", "correct": "A: B; C: D", ... },
            { "type": "true-false", "question": "...", "correct": "True", ... },
            { "type": "fill-in", "question": "...", "correct": "answer", ... },
            { "type": "multiple-choice", "question": "...", "correct": "Option A", ... }
          ]
        },
        {
          "type": "Apply",
          "scenarios": [
            { "scene": "...", "question": "...", "options": [...], "correct": "...", ... }
          ]
        },
        {
          "type": "Challenge",
          "activities": [
            { "type": "build-sentence", "words": [...], "correct": "sentence", ... },
            { "type": "boss-scenario", "scene": "...", "question": "...", ... }
          ]
        }
      ]
    }
  ]
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-md font-semibold text-purple-400 mb-2">Format 3: Comprehensive (Section/Unit/Lesson with ContentScreens)</h3>
              <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto text-green-400">
{`{
  "sectionId": "A",
  "sectionTitle": "The Foundations of the Dark Mind",
  "unitId": "A1",
  "unitTitle": "The Unseen Influence",
  "lessonId": "A1-1",
  "lessonTitle": "Lesson Title",
  "lessonType": "Normal",
  "lessonPart": 1,
  "objective": "Learn about...",
  "gamification": {
    "progressRings": [
      {"ringId": "learn", "status": "incomplete", "label": "Learn"},
      {"ringId": "practice", "status": "incomplete", "label": "Practice"}
    ],
    "pointsValue": 50,
    "starsAvailable": 3
  },
  "contentScreens": [
    {
      "screenType": "exercise-block",
      "exercises": [
        { "type": "multiple-choice", "question": "...", "options": [...], "correct": "A" },
        { "type": "scenario", "scene": "...", "question": "...", "options": [...] },
        { "type": "ethical-dilemma", "dilemma": "...", "question": "...", "options": [...] },
        { "type": "micro-sim", "steps": [{"situation": "...", "options": [...]}] },
        { "type": "case-analysis", "case": "...", "question": "...", "options": [...] }
      ]
    }
  ]
}`}
              </pre>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded">
            <p className="text-yellow-300 text-xs">
              ⚠️ Complex format extracts all exercises/scenarios/activities.<br/>
              📝 Comprehensive format supports all metadata (sections, units, gamification) and exercise types (ethical-dilemma, micro-sim, case-analysis, reverse-scenario).
            </p>
          </div>
        </div>

        {/* JSON Input */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <label className="block text-lg font-bold mb-2">
            Lesson JSON:
          </label>
          <textarea
            className="w-full h-96 bg-gray-900 text-white p-4 rounded font-mono text-sm"
            placeholder="Paste your lesson JSON here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-600 text-white p-4 rounded mb-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-600 text-white p-4 rounded mb-4">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            onClick={handleSubmit}
            className="bg-[#58CC02] hover:bg-[#4CAF00] text-white px-8 py-6 text-lg"
          >
            Add Lesson
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dark-psychology")}
            className="px-8 py-6 text-lg"
          >
            View Dark Psychology Lessons
          </Button>
        </div>
      </div>
    </div>
  );
}
