// 🧠 FILE PURPOSE
// Admin page to clean up legacy progress records that don't have darkPsychLessonId
// This fixes the issue where Unit 1 Lesson 1 and Unit 2 Lesson 1 get mixed up

"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function MigrateProgressPage() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const deleteLegacyProgress = useMutation(api.migrationHelper.deleteLegacyDarkPsychProgress);

  const handleMigrate = async () => {
    if (!confirm("This will delete all old Dark Psychology progress that doesn't have unique lesson IDs. Are you sure?")) {
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await deleteLegacyProgress({});
      setResult(`✅ Success! ${response.message}`);
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
          <h1 className="text-3xl font-bold text-white mb-4">🔧 Progress Migration</h1>
          <p className="text-gray-300 mb-6">
            This tool will delete old Dark Psychology progress records that were created before the unique lesson ID system was added.
            This fixes the issue where lessons from different units with the same number (like Unit 1 Lesson 1 and Unit 2 Lesson 1) get mixed up.
          </p>

          <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 mb-6">
            <p className="text-yellow-200 text-sm">
              ⚠️ <strong>Warning:</strong> This will delete your progress on old Dark Psychology lessons.
              New progress saved after the update will NOT be affected.
            </p>
          </div>

          <Button
            onClick={handleMigrate}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl"
          >
            {isLoading ? "Migrating..." : "Clean Up Old Progress"}
          </Button>

          {result && (
            <div className={`mt-6 p-4 rounded-lg ${
              result.startsWith('✅')
                ? 'bg-green-900/30 border border-green-500/50'
                : 'bg-red-900/30 border border-red-500/50'
            }`}>
              <p className={result.startsWith('✅') ? 'text-green-200' : 'text-red-200'}>
                {result}
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-700">
            <h2 className="text-xl font-bold text-white mb-3">How it works:</h2>
            <ul className="text-gray-300 space-y-2 text-sm list-disc list-inside">
              <li>Finds all progress records without <code className="text-purple-400">darkPsychLessonId</code></li>
              <li>Deletes only those legacy records</li>
              <li>Your new progress (with unique IDs) remains intact</li>
              <li>After cleanup, each lesson in each unit will track progress separately</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
