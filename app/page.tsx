// 🧠 FILE PURPOSE
// Homepage - redirects to Dark Psychology dashboard.
// This is the entry point of the application.

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Step 1: Redirect to Dark Psychology dashboard
  useEffect(() => {
    router.push("/dark-psychology-dashboard");
  }, [router]);

  // Show loading while redirecting
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
// Homepage redirect to Dark Psychology dashboard.
// Clean loading screen with branding.
