// 🧠 FILE PURPOSE
// Admin page to share lessons from current user to all other users.
// This allows you to create lessons once and distribute them to everyone.

"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Copy, CheckCircle } from "lucide-react";

export default function ShareLessonsPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Get user email from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('userEmail');
      setUserEmail(email);
    }
  }, []);

  // Get current user's lessons count
  const myLessons = useQuery(
    api.lessons.getUserLessons,
    userEmail ? { email: userEmail } : "skip"
  );

  // Mutation to copy lessons to all users
  const copyLessonsToAllUsers = useMutation(api.lessons.copyLessonsToAllUsers);

  // Step 1: Handle sharing lessons
  const handleShareLessons = async () => {
    if (!userEmail) {
      alert("Please sign in first");
      return;
    }

    if (!myLessons || myLessons.length === 0) {
      alert("You don't have any lessons to share. Create lessons first.");
      return;
    }

    setIsSharing(true);
    setResult(null);

    try {
      const response = await copyLessonsToAllUsers({ email: userEmail });
      setResult(response);
    } catch (error: any) {
      setResult({ success: false, message: error.message });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f1419] p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/learn")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Learn
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Share Lessons</h1>
          <p className="text-gray-400">
            Copy your lessons to all other users in the system
          </p>
        </div>

        {/* Current User Info */}
        <div className="bg-[#1F1F1F] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-[#58CC02]" />
            <h2 className="text-xl font-bold text-white">Your Lessons</h2>
          </div>
          <p className="text-gray-300">
            Email: <span className="text-[#58CC02]">{userEmail || "Not signed in"}</span>
          </p>
          <p className="text-gray-300 mt-2">
            Total Lessons: <span className="text-[#58CC02] font-bold">{myLessons?.length || 0}</span>
          </p>
        </div>

        {/* Share Button */}
        <div className="bg-[#1F1F1F] rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Share Your Lessons</h2>
          <p className="text-gray-400 mb-6">
            This will copy all your lessons to every other user in the system.
            Their existing lessons will be replaced with yours.
          </p>
          <Button
            onClick={handleShareLessons}
            disabled={isSharing || !myLessons || myLessons.length === 0}
            className="w-full bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-6 text-lg"
          >
            {isSharing ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sharing Lessons...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Copy className="w-5 h-5" />
                Share Lessons to All Users
              </span>
            )}
          </Button>
        </div>

        {/* Result Display */}
        {result && (
          <div
            className={`rounded-xl p-6 ${
              result.success
                ? "bg-green-500/10 border-2 border-green-500"
                : "bg-red-500/10 border-2 border-red-500"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              {result.success ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <div className="w-6 h-6 text-red-500">❌</div>
              )}
              <h3
                className={`text-xl font-bold ${
                  result.success ? "text-green-400" : "text-red-400"
                }`}
              >
                {result.success ? "Success!" : "Error"}
              </h3>
            </div>
            <p className="text-white mb-2">{result.message}</p>
            {result.success && (
              <div className="text-gray-300 text-sm mt-4">
                <p>✅ Users Updated: {result.usersUpdated}</p>
                <p>✅ Lessons Created: {result.lessonsCreated}</p>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-[#1F1F1F] rounded-xl p-6 mt-6">
          <h2 className="text-xl font-bold text-white mb-4">How it works</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Create your English lessons by uploading a PDF or text</li>
            <li>Click "Share Lessons to All Users" button above</li>
            <li>All other users will now see your lessons on their Learn page</li>
            <li>Each user will have their own progress tracking</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
