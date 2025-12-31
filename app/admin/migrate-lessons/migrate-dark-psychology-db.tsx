// 🧠 FILE PURPOSE
// Import Dark Psychology lessons to database for easy migration.
// Allows treating them like regular lessons instead of static files.

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Upload, CheckCircle, AlertCircle, Database, RefreshCw } from "lucide-react";
import { DARK_PSYCHOLOGY_LESSONS } from "@/md/lib/darkPsychologyLessons";

export function MigrateDarkPsychologyDB() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  // Check if Dark Psychology lessons are in database
  const dbStatus = useQuery(api.darkPsychologyDB.checkDarkPsychInDB);
  const storeLesson = useMutation(api.darkPsychologyDB.storeDarkPsychLesson);

  // Step 1: Import all Dark Psychology lessons to database
  const handleImportToDB = async () => {
    setIsImporting(true);
    setImportResult(null);

    let imported = 0;
    let updated = 0;
    let failed = 0;
    const errors: string[] = [];

    try {
      for (const lesson of DARK_PSYCHOLOGY_LESSONS) {
        try {
          const result = await storeLesson({ lessonData: lesson });
          if (result.action === "created") {
            imported++;
          } else if (result.action === "updated") {
            updated++;
          }
        } catch (error: any) {
          failed++;
          errors.push(`${lesson.title}: ${error.message}`);
        }
      }

      setImportResult({
        type: "success",
        message: `✅ Import complete! Created: ${imported}, Updated: ${updated}, Failed: ${failed}`,
        details: { imported, updated, failed, errors },
      });
    } catch (error: any) {
      setImportResult({
        type: "error",
        message: `❌ Import failed: ${error.message}`,
      });
    } finally {
      setIsImporting(false);
    }
  };

  if (!dbStatus) {
    return (
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border-2 border-purple-500/30 p-6">
        <p className="text-gray-300">Loading Dark Psychology status...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border-2 border-purple-500/30 p-6">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Database className="w-6 h-6 text-purple-400" />
        Dark Psychology Lessons Migration
      </h2>

      {/* Status */}
      <div className="mb-4 bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400">Static File Lessons:</span>
          <span className="text-white font-bold">{DARK_PSYCHOLOGY_LESSONS.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Database Lessons:</span>
          <span className={`font-bold ${dbStatus.inDatabase ? "text-green-400" : "text-yellow-400"}`}>
            {dbStatus.count}
          </span>
        </div>
      </div>

      {/* Import result */}
      {importResult && (
        <div
          className={`mb-4 p-4 rounded-lg border-2 ${importResult.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
        >
          <p className="font-semibold mb-2">{importResult.message}</p>
          {importResult.details && importResult.details.errors.length > 0 && (
            <div className="mt-2 text-sm max-h-32 overflow-y-auto">
              <p className="font-semibold mb-1">Errors:</p>
              <ul className="list-disc list-inside">
                {importResult.details.errors.map((error: string, idx: number) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!dbStatus.inDatabase ? (
        <div className="mb-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            <strong>Step 1:</strong> Import Dark Psychology lessons to the database first. This is a
            one-time operation that will allow you to migrate them like regular lessons.
          </p>
        </div>
      ) : (
        <div className="mb-4 bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-green-300 text-sm">
            Dark Psychology lessons are in the database! They will appear in the "Lessons Needing
            Migration" list below if they need updates.
          </p>
        </div>
      )}

      {/* Import/Update Button */}
      <button
        onClick={handleImportToDB}
        disabled={isImporting}
        className={`w-full font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${dbStatus.inDatabase
            ? "bg-yellow-600 hover:bg-yellow-500 text-white"
            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
          }`}
      >
        {isImporting ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Importing...</span>
          </>
        ) : dbStatus.inDatabase ? (
          <>
            <RefreshCw className="w-5 h-5" />
            <span>Re-Import / Update All ({DARK_PSYCHOLOGY_LESSONS.length} lessons)</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            <span>Import to Database ({DARK_PSYCHOLOGY_LESSONS.length} lessons)</span>
          </>
        )}
      </button>
    </div>
  );
}

// ✅ In this component we achieved:
// One-click import of Dark Psychology lessons to database.
// Status tracking (static file vs database).
// Re-import capability for updates.
