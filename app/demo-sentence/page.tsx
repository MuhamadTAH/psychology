// 🧠 FILE PURPOSE
// Demo page to create and test sentence-building question type

"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DemoSentencePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const createMockLesson = useMutation(api.lessons.createMockSentenceBuildingLesson);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('userEmail');
      setUserEmail(email);
    }
  }, []);

  const handleCreateMockLesson = async () => {
    if (!userEmail) {
      alert("Please login first");
      return;
    }

    try {
      await createMockLesson({ email: userEmail });
      alert("Mock lesson created! Redirecting to dashboard...");
      router.push('/dark-psychology-dashboard');
    } catch (error) {
      alert("Failed to create mock lesson");
    }
  };

  return (
    <div className="min-h-screen bg-[#1F2937] flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Sentence Building Demo</h1>
        <p className="text-gray-600 mb-6">
          This will create a mock lesson with sentence-building questions.
        </p>

        {userEmail ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Logged in as: {userEmail}</p>
            <Button
              onClick={handleCreateMockLesson}
              className="w-full bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-4"
            >
              Create Mock Lesson
            </Button>
          </div>
        ) : (
          <p className="text-red-500">Please login first</p>
        )}
      </div>
    </div>
  );
}
