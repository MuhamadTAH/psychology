// 🧠 FILE PURPOSE
// Certificate page shown when user completes all Dark Psychology lessons.
// Displays a beautiful certificate with user's name and completion date.

"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareCertificate } from "./share-certificate";

export default function DarkPsychologyCertificate() {
  const router = useRouter();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";
  const userName = user?.fullName || user?.firstName || "Student";

  // Step 1: Check if user has completed all lessons
  const dashboard = useQuery(api.darkPsychology.getDashboard, { email: userEmail });

  // Step 2: Get completion date
  const completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading certificate...</div>
      </div>
    );
  }

  // Step 3: Check if course is complete
  const isComplete = dashboard.completedLessons === dashboard.totalLessons;

  if (!isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center px-6">
          <Award className="w-24 h-24 text-gray-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Certificate Not Available</h2>
          <p className="text-gray-400 text-lg mb-8">
            Complete all {dashboard.totalLessons} Dark Psychology lessons to earn your certificate.
            <br />
            You've completed {dashboard.completedLessons} so far.
          </p>
          <Button
            onClick={() => router.push("/dark-psychology-dashboard")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Step 4: Render certificate
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <button
          onClick={() => router.push("/dark-psychology-dashboard")}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>
      </div>

      {/* Certificate */}
      <div className="max-w-4xl mx-auto px-6">
        <div
          id="certificate"
          className="bg-white rounded-xl shadow-2xl p-12 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          }}
        >
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-purple-500 opacity-20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-purple-500 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-purple-500 opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-purple-500 opacity-20"></div>

          {/* Certificate Content */}
          <div className="relative z-10 text-center">
            {/* Award Icon */}
            <div className="flex justify-center mb-6">
              <Award className="w-24 h-24 text-yellow-500" />
            </div>

            {/* Title */}
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Certificate of Completion
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-lg mb-8">
              This is to certify that
            </p>

            {/* User Name */}
            <h2 className="text-4xl font-bold text-purple-600 mb-8">
              {userName}
            </h2>

            {/* Description */}
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              has successfully completed the comprehensive
              <span className="font-bold text-purple-600"> Dark Psychology </span>
              course, demonstrating exceptional understanding of psychological
              manipulation techniques, defense strategies, and ethical applications.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{dashboard.totalLessons}</div>
                <div className="text-gray-600 text-sm">Lessons Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{dashboard.totalXP}</div>
                <div className="text-gray-600 text-sm">Total XP Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{dashboard.accuracy}%</div>
                <div className="text-gray-600 text-sm">Accuracy</div>
              </div>
            </div>

            {/* Date */}
            <p className="text-gray-600 mb-8">
              Completed on <span className="font-semibold">{completionDate}</span>
            </p>

            {/* Signature Line */}
            <div className="border-t-2 border-gray-300 w-64 mx-auto pt-2">
              <p className="text-gray-700 font-semibold">DuoLearn Academy</p>
              <p className="text-gray-500 text-sm">Course Director</p>
            </div>
          </div>

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-96 h-96 text-purple-500" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <Button
            onClick={() => window.print()}
            className="bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Download / Print
          </Button>
          <Button
            onClick={() => router.push("/dark-psychology-dashboard")}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
            size="lg"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Share Component */}
        <div className="mt-8">
          <ShareCertificate
            userName={userName}
            completedLessons={dashboard.completedLessons}
            totalXP={dashboard.totalXP}
            accuracy={dashboard.accuracy}
          />
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          button,
          .no-print {
            display: none !important;
          }
          #certificate {
            box-shadow: none !important;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}

// ✅ In this page we achieved:
// Beautiful certificate design with decorative elements.
// Displays user name, completion date, and statistics.
// Print/download functionality for saving certificate.
// Access restricted to users who completed all lessons.
