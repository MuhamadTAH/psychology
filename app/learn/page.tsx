// 🧠 FILE PURPOSE
// Main learning page - redirects to Dark Psychology dashboard.
// Dark Psychology is now the primary and only content in this app.

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LearnPage() {
  const router = useRouter();

  // Step 1: Automatically redirect to Dark Psychology dashboard
  useEffect(() => {
    router.push("/dark-psychology-dashboard");
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading Dark Psychology...</div>
    </div>
  );
}

// ✅ In this page we achieved:
// Automatic redirect to Dark Psychology dashboard.
// Dark Psychology is now the main content of the application.
