// 🧠 FILE PURPOSE
// Admin page for migrating lessons to new formats automatically.
// Shows progress, statistics, and allows batch or individual migration.

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Database,
  Zap,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import { MigrateDarkPsychologyDB } from "./migrate-dark-psychology-db";

export default function MigrateLessonsPage() {
  // Step 1: Get migration data
  const migrationStats = useQuery(api.lessonMigration.getMigrationStats);
  const lessonsNeedingMigration = useQuery(api.lessonMigration.getLessonsNeedingMigration);

  // Step 2: Migration mutations
  const migrateSingle = useMutation(api.lessonMigration.migrateSingleLesson);
  const migrateAll = useMutation(api.lessonMigration.migrateAllLessons);

  // Step 3: State
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<any>(null);
  const [currentMigrating, setCurrentMigrating] = useState<string | null>(null);

  // Step 4: Handle single lesson migration
  const handleMigrateSingle = async (lessonId: Id<"lessons">, title: string) => {
    setCurrentMigrating(lessonId);
    try {
      const result = await migrateSingle({ lessonId });
      setMigrationResult({
        type: "success",
        message: `✅ Successfully migrated: ${result.title}`,
      });
    } catch (error: any) {
      setMigrationResult({
        type: "error",
        message: `❌ Failed to migrate ${title}: ${error.message}`,
      });
    } finally {
      setCurrentMigrating(null);
      setTimeout(() => setMigrationResult(null), 5000);
    }
  };

  // Step 5: Handle batch migration
  const handleMigrateAll = async () => {
    if (!confirm("Are you sure you want to migrate ALL lessons? This cannot be undone.")) {
      return;
    }

    setIsMigrating(true);
    setMigrationResult(null);

    try {
      const result = await migrateAll();
      setMigrationResult({
        type: "success",
        message: `✅ Migration complete! Migrated: ${result.migratedCount}, Skipped: ${result.skippedCount}, Errors: ${result.errors.length}`,
        details: result,
      });
    } catch (error: any) {
      setMigrationResult({
        type: "error",
        message: `❌ Migration failed: ${error.message}`,
      });
    } finally {
      setIsMigrating(false);
    }
  };

  // Step 6: Loading state
  if (!migrationStats || !lessonsNeedingMigration) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading migration data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b-2 border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Admin</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Database className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Lesson Migration Tool</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Automatically upgrade lessons to support new features
          </p>
        </div>

        {/* Migration result message */}
        {migrationResult && (
          <div
            className={`mb-6 p-4 rounded-xl border-2 ${
              migrationResult.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <p className="font-semibold mb-2">{migrationResult.message}</p>
            {migrationResult.details && migrationResult.details.errors.length > 0 && (
              <div className="mt-2 text-sm">
                <p className="font-semibold mb-1">Errors:</p>
                <ul className="list-disc list-inside">
                  {migrationResult.details.errors.map((error: string, idx: number) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Lessons */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border-2 border-blue-500/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Total Lessons</h3>
            </div>
            <p className="text-4xl font-bold text-blue-400">{migrationStats.totalLessons}</p>
          </div>

          {/* Needs Migration */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-xl border-2 border-yellow-500/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-bold text-white">Needs Migration</h3>
            </div>
            <p className="text-4xl font-bold text-yellow-400">{migrationStats.needsMigration}</p>
          </div>

          {/* Already Migrated */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border-2 border-green-500/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-bold text-white">Up to Date</h3>
            </div>
            <p className="text-4xl font-bold text-green-400">{migrationStats.alreadyMigrated}</p>
          </div>
        </div>

        {/* Dark Psychology Migration Section */}
        <MigrateDarkPsychologyDB />

        {/* Upgrade Types Breakdown */}
        {Object.keys(migrationStats.upgradeTypeCounts).length > 0 && (
          <div className="mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              Upgrade Types Needed
            </h2>
            <div className="space-y-2">
              {Object.entries(migrationStats.upgradeTypeCounts).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                  <span className="text-gray-300">{type.replace(/_/g, " ")}</span>
                  <span className="text-white font-bold">{count as number} lessons</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Batch Migration Button */}
        {migrationStats.needsMigration > 0 && (
          <div className="mb-8">
            <button
              onClick={handleMigrateAll}
              disabled={isMigrating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-6 rounded-xl border-2 border-purple-500/50 hover:from-purple-500 hover:to-blue-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMigrating ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span>Migrating All Lessons...</span>
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  <span>Migrate All Lessons ({migrationStats.needsMigration})</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Lessons Needing Migration List */}
        {lessonsNeedingMigration.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Lessons Needing Migration ({lessonsNeedingMigration.length})
            </h2>
            <div className="space-y-3">
              {lessonsNeedingMigration.map((lesson) => (
                <div
                  key={lesson._id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-gray-700 p-4 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg mb-1">
                        Lesson {lesson.lessonNumber}: {lesson.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {lesson.neededUpgrades.map((upgrade) => (
                          <span
                            key={upgrade}
                            className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full border border-yellow-500/30"
                          >
                            {upgrade.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleMigrateSingle(lesson._id, lesson.title)}
                      disabled={currentMigrating === lesson._id}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentMigrating === lesson._id ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Migrating...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>Migrate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border-2 border-green-500/30 p-12">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">All Lessons Up to Date!</h2>
            <p className="text-gray-400">
              All your lessons are using the latest formats. No migration needed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ In this page we achieved:
// Complete migration tool with statistics and progress tracking.
// Batch migration (all lessons) and individual migration options.
// Real-time feedback with success/error messages.
// Detailed breakdown of upgrade types needed.
