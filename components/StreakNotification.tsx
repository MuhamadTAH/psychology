// 🧠 FILE PURPOSE
// This component shows a toast notification when users maintain their streak.
// Appears automatically when a user completes their first lesson of the day.

"use client";

import { useEffect, useState } from "react";
import { Toast } from "./ui/toast";
import { Flame } from "lucide-react";

interface StreakNotificationProps {
  streak: number; // Current streak count
  isNewStreak: boolean; // True if this is a new streak (first lesson today)
}

export function StreakNotification({ streak, isNewStreak }: StreakNotificationProps) {
  const [showToast, setShowToast] = useState(false);

  // Step 1: Show toast when streak is updated
  useEffect(() => {
    if (isNewStreak && streak > 0) {
      setShowToast(true);
    }
  }, [isNewStreak, streak]);

  // Step 2: Don't render if not showing
  if (!showToast) return null;

  return (
    <Toast
      message={`${streak} day streak! Keep it going! 🔥`}
      type="success"
      icon={<Flame className="w-6 h-6 text-yellow-400" />}
      onClose={() => setShowToast(false)}
      duration={4000}
    />
  );
}

// ✅ In this component we achieved:
// Automatic streak notification that appears after completing first lesson of the day.
// Shows current streak count with fire emoji for motivation.
// Auto-dismisses after 4 seconds.
