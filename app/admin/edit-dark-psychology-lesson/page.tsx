// 🧠 FILE PURPOSE
// Admin page to edit an existing Dark Psychology lesson's exercises.
// Displays lesson metadata and allows editing the practice questions.

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function EditLessonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonNumber = searchParams.get("lessonNumber");
  const lessonId = searchParams.get("lessonId");

  const [lesson, setLesson] = useState<any>(null);
  const [jsonInput, setJsonInput] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Step 1: Query Convex for Dark Psychology lessons
  const dbLessons = useQuery(api.lessons.getAllDarkPsychologyLessons);

  // Step 2: Load the lesson when data is available
  useEffect(() => {
    if (!dbLessons) {
      console.log('⏳ [EDIT PAGE] Waiting for Convex data...');
      return;
    }

    if (lessonNumber || lessonId) {
      console.log('🔄 [EDIT PAGE] Searching for lesson in Convex database');
      console.log('🔄 [EDIT PAGE] Looking for:', lessonId ? `lessonId: ${lessonId}` : `lessonNumber: ${lessonNumber}`);
      console.log('📊 [EDIT PAGE] Total lessons in DB:', dbLessons.length);

      // Step: Find ALL parts of the lesson by lessonId
      // Multi-part lessons are stored as separate documents (Part 1, Part 2, etc.)
      console.log('🔍 [EDIT PAGE] Filtering lessons...');
      console.log('🔍 [EDIT PAGE] All lesson IDs in DB:', dbLessons.map((l: any) => l.lessonId));

      const lessonParts = lessonId
        ? dbLessons.filter((l: any) => {
            const matches = l.lessonId === lessonId;
            console.log(`  Checking lesson: ${l.lessonId} === ${lessonId}? ${matches}`);
            return matches;
          })
        : [dbLessons.find((l: any) => l.number === parseInt(lessonNumber!))].filter(Boolean);

      console.log('🔍 [EDIT PAGE] Found parts:', lessonParts.length);
      console.log('🔍 [EDIT PAGE] Parts:', lessonParts.map((p: any) => ({ lessonId: p.lessonId, part: p.lessonPart })));

      if (lessonParts.length > 0) {
        // Sort parts by lessonPart number
        lessonParts.sort((a: any, b: any) => (a.lessonPart || 0) - (b.lessonPart || 0));

        console.log('✅ [EDIT PAGE] Found lesson with', lessonParts.length, 'parts');
        console.log('📋 [EDIT PAGE] Lesson data:', {
          lessonId: lessonParts[0].lessonId,
          parts: lessonParts.map((p: any) => p.lessonPart),
          sectionId: lessonParts[0].sectionId,
          unitId: lessonParts[0].unitId,
          title: lessonParts[0].lessonTitle
        });

        // For multi-part lessons, show all parts
        if (lessonParts.length === 1) {
          setLesson(lessonParts[0]);
          setJsonInput(JSON.stringify(lessonParts[0], null, 2));
        } else {
          // Combine all parts into a single object for editing
          const combinedLesson = {
            lessonId: lessonParts[0].lessonId,
            lessonTitle: lessonParts[0].lessonTitle,
            sectionId: lessonParts[0].sectionId,
            unitId: lessonParts[0].unitId,
            parts: lessonParts
          };
          setLesson(combinedLesson);
          setJsonInput(JSON.stringify(combinedLesson, null, 2));
        }
      } else {
        console.error('❌ [EDIT PAGE] Lesson not found in Convex database');
        setError(`Lesson not found. Available lessons: ${[...new Set(dbLessons.map((l: any) => l.lessonId))].join(', ')}`);
      }
    }
  }, [dbLessons, lessonNumber, lessonId]);

  // Step 2: Handle save
  const handleSave = async () => {
    console.log('🔧 [SAVE] handleSave function called');
    console.log('🔧 [SAVE] lessonNumber:', lessonNumber);
    console.log('🔧 [SAVE] jsonInput length:', jsonInput?.length);

    setMessage("");
    setError("");

    try {
      console.log('🔧 [SAVE] Entered try block');

      console.log('🔧 [SAVE] Attempting to parse JSON...');
      const updatedLesson = JSON.parse(jsonInput);

      console.log('🔧 [SAVE] ✅ JSON parsed successfully!');
      console.log('🔧 [SAVE] Parsed lesson number:', updatedLesson.number);
      console.log('🔧 [SAVE] Parsed lesson ID:', updatedLesson.lessonId);
      console.log('🔧 [SAVE] Parsed lesson title:', updatedLesson.title || updatedLesson.lessonTitle);

      // ✅ FIX: Validate lesson identifier hasn't changed (use lessonId if available)
      if (lessonId) {
        if (updatedLesson.lessonId !== lessonId) {
          console.log('🔧 [SAVE] ❌ Lesson ID mismatch!', updatedLesson.lessonId, 'vs', lessonId);
          setError("Cannot change lesson ID. Delete and create new lesson instead.");
          return;
        }
      } else if (lessonNumber) {
        if (updatedLesson.number !== parseInt(lessonNumber!)) {
          console.log('🔧 [SAVE] ❌ Lesson number mismatch!', updatedLesson.number, 'vs', parseInt(lessonNumber!));
          setError("Cannot change lesson number. Delete and create new lesson instead.");
          return;
        }
      }

      console.log('🔧 [SAVE] Lesson identifier validated. Sending to API...');

      // ✅ FIX: Send to API with appropriate identifier
      const response = await fetch("/api/edit-dark-psychology-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonNumber: lessonNumber ? parseInt(lessonNumber!) : undefined,
          lessonId: lessonId || undefined,
          updatedLesson
        }),
      });

      console.log('🔧 [SAVE] API response status:', response.status);

      const result = await response.json();
      console.log('🔧 [SAVE] API response data:', result);

      if (response.ok) {
        console.log('🔧 [SAVE] ✅ Save successful!');
        setMessage(`✅ ${result.message}`);
        setTimeout(() => {
          router.push("/dark-psychology");
        }, 1500);
      } else {
        console.log('🔧 [SAVE] ❌ API returned error:', result.error);
        setError(result.error || "Failed to update lesson");
      }
    } catch (err) {
      console.error('🔧 [SAVE] ❌ Error caught:', err);
      console.error('🔧 [SAVE] Error details:', err instanceof Error ? err.message : err);
      console.error('🔧 [SAVE] Error stack:', err instanceof Error ? err.stack : 'No stack trace');
      setError(err instanceof Error ? err.message : "Invalid JSON format");
    }
  };

  if (!lesson && !error) {
    return (
      <div className="min-h-screen bg-[#1F2937] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F2937] text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/dark-psychology")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">
              Edit Lesson {lessonId || lessonNumber}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {error ? (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6">
            <p className="text-red-300">{error}</p>
          </div>
        ) : (
          <>
            {/* Lesson Info */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Lesson Information</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Number:</span>
                  <span className="ml-2 font-semibold">{lesson.number}</span>
                </div>
                <div>
                  <span className="text-gray-400">Title:</span>
                  <span className="ml-2 font-semibold">{lesson.title || lesson.lessonTitle}</span>
                </div>
                {lesson.sectionId && (
                  <div>
                    <span className="text-gray-400">Section:</span>
                    <span className="ml-2 font-semibold">{lesson.sectionId} - {lesson.sectionTitle}</span>
                  </div>
                )}
                {lesson.unitId && (
                  <div>
                    <span className="text-gray-400">Unit:</span>
                    <span className="ml-2 font-semibold">{lesson.unitId} - {lesson.unitTitle}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-400">Practice Questions:</span>
                  <span className="ml-2 font-semibold">{lesson.practice?.length || 0}</span>
                </div>
                {lesson.lessonType && (
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="ml-2 font-semibold">{lesson.lessonType}</span>
                  </div>
                )}
              </div>
            </div>

            {/* JSON Editor */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Edit Lesson JSON</h2>
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-4">
                <p className="text-blue-300 text-sm font-semibold mb-2">📝 Editing Instructions:</p>
                <ul className="text-blue-200 text-xs space-y-1 ml-4 list-disc">
                  <li className="font-bold text-yellow-300">This is the complete lesson JSON including all parts</li>
                  <li className="font-bold text-yellow-300">For multi-part lessons: Edit questions inside the "parts" array</li>
                  <li>Each part has a "questions" array - that's where the exercise loads from</li>
                  <li>Make sure all JSON brackets {`{}`}, quotes "", and commas are correct</li>
                  <li className="text-red-300">Cannot change lesson number - delete and recreate instead</li>
                </ul>
              </div>

              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full h-96 bg-gray-900 text-green-400 font-mono text-sm p-4 rounded border border-gray-700 focus:outline-none focus:border-purple-500"
                spellCheck="false"
              />

              {/* Messages */}
              {message && (
                <div className="mt-4 p-3 bg-green-900/30 border border-green-700 rounded">
                  <p className="text-green-300">{message}</p>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded">
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="mt-6 flex gap-4">
                <Button
                  onClick={handleSave}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={async () => {
                    console.log('🔄 [RELOAD] Reloading fresh data from Convex...');

                    if (!dbLessons) {
                      alert('❌ Database not loaded yet');
                      return;
                    }

                    const lessonParts = lessonId
                      ? dbLessons.filter((l: any) => l.lessonId === lessonId)
                      : [dbLessons.find((l: any) => l.number === parseInt(lessonNumber!))].filter(Boolean);

                    if (lessonParts.length > 0) {
                      lessonParts.sort((a: any, b: any) => (a.lessonPart || 0) - (b.lessonPart || 0));

                      if (lessonParts.length === 1) {
                        setLesson(lessonParts[0]);
                        setJsonInput(JSON.stringify(lessonParts[0], null, 2));
                      } else {
                        const combinedLesson = {
                          lessonId: lessonParts[0].lessonId,
                          lessonTitle: lessonParts[0].lessonTitle,
                          sectionId: lessonParts[0].sectionId,
                          unitId: lessonParts[0].unitId,
                          parts: lessonParts
                        };
                        setLesson(combinedLesson);
                        setJsonInput(JSON.stringify(combinedLesson, null, 2));
                      }
                      alert('✅ Reloaded fresh data from database!');
                    } else {
                      console.error('❌ [RELOAD] Lesson not found');
                      alert('❌ Lesson not found');
                    }
                  }}
                  variant="secondary"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Reload Fresh Data
                </Button>
                <Button
                  onClick={() => router.push("/dark-psychology")}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function EditDarkPsychologyLessonPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1F2937] flex items-center justify-center"><p className="text-white">Loading...</p></div>}>
      <EditLessonContent />
    </Suspense>
  );
}

// ✅ Edit page complete:
// - Loads lesson by lessonId or lessonNumber (lessonId takes priority)
// - Shows lesson metadata
// - Allows editing JSON
// - Validates lesson identifier hasn't changed
// - Saves via API with appropriate identifier
// - Supports both old (number-based) and new (ID-based) lesson identification
