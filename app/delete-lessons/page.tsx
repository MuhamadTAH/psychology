"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DeleteLessonsPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const deleteAllLessons = useMutation(api.lessons.deleteAllMyLessons);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('userEmail');
      setUserEmail(email);
    }
  }, []);

  const handleDelete = async () => {
    if (!userEmail) {
      alert("Please login first");
      return;
    }

    const confirmed = confirm("Are you sure you want to delete ALL your lessons? This cannot be undone!");

    if (!confirmed) return;

    setLoading(true);
    try {
      const result = await deleteAllLessons({ email: userEmail });
      alert(`Successfully deleted ${result.deletedLessons} lessons and ${result.deletedProgress} progress records!`);
      router.push('/dark-psychology-dashboard');
    } catch (error) {
      alert("Failed to delete lessons");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F2937] flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Delete All Lessons</h1>
        <p className="text-gray-600 mb-6 text-center">
          This will permanently delete all your lessons and progress. This action cannot be undone!
        </p>

        {userEmail ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">Logged in as: {userEmail}</p>
            <Button
              onClick={handleDelete}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4"
            >
              {loading ? "Deleting..." : "Delete All Lessons"}
            </Button>
            <Button
              onClick={() => router.push('/dark-psychology-dashboard')}
              variant="secondary"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <p className="text-red-500 text-center">Please login first</p>
        )}
      </div>
    </div>
  );
}
