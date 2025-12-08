// 🧠 FILE PURPOSE
// This page is shown when the user is offline and tries to access a page
// that isn't cached. It provides a friendly offline experience.

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1cb0f6] to-[#1899d6] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Step 1: Show offline icon */}
        <div className="mb-6">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        {/* Step 2: Display offline message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          You're Offline
        </h1>

        <p className="text-gray-600 mb-6">
          It looks like you've lost your internet connection. Don't worry, you can still access your downloaded lessons!
        </p>

        {/* Step 3: Provide helpful actions */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Try Again
          </button>

          <a
            href="/dark-psychology-dashboard"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Go to Dashboard
          </a>

          <a
            href="/"
            className="block w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
          >
            Back to Home
          </a>
        </div>

        {/* Step 4: Show connection tips */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            💡 <strong>Tip:</strong> Once you're back online, your progress will automatically sync.
          </p>
        </div>
      </div>
    </div>
  );
}

// ✅ In this page we achieved:
// A friendly offline experience with clear messaging
// Action buttons to retry connection or navigate to cached pages
// Tips for users about how offline functionality works
