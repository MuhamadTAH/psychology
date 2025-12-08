// 🧠 FILE PURPOSE
// Homepage - Smart routing for new vs returning users.
// New users → Welcome page onboarding
// Returning users → Dark Psychology dashboard

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  // Step 1: Check if user is new or returning
  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to load

    if (!isSignedIn) {
      // New user (not signed in) → Show welcome page
      router.push("/welcome");
    } else {
      // Returning user (signed in) → Go to dashboard
      router.push("/dark-psychology-dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading while checking authentication
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🧠</div>
        <div className="text-white text-2xl font-bold mb-2">DuoLearn</div>
        <div className="text-gray-400">Master Dark Psychology</div>
      </div>
    </div>
  );
}

// ✅ In this page we achieved:
// Smart routing based on authentication status.
// New users see welcome page, returning users see dashboard.
// Works identically in PWA and mobile apps.
