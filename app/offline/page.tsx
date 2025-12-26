// 🧠 FILE PURPOSE
// Offline fallback page shown when the app has no internet connection
// Provides a user-friendly message and retry option

"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#1F2937] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-white mb-4">
          You&apos;re Offline
        </h1>
        <p className="text-gray-400 mb-8">
          It looks like you&apos;ve lost your internet connection. Please check your network and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-3 px-8 rounded-xl transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// ✅ In this file we achieved:
// Created a simple offline fallback page for PWA
// Shows friendly message when network is unavailable
