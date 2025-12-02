"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowLeft, Award, Lock } from "lucide-react";
import { useEffect } from "react";

export default function Achievements() {
  const router = useRouter();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";
  const achievements = useQuery(api.darkPsychology.getUserAchievements, { email: userEmail });
  const checkAchievements = useMutation(api.darkPsychology.checkAndUnlockAchievements);

  useEffect(() => {
    if (userEmail) checkAchievements({ email: userEmail });
  }, [userEmail]);

  const allAchievements = [
    { id: "first_lesson", name: "First Steps", description: "Complete your first lesson", icon: "🎯" },
    { id: "unit_a_complete", name: "Manipulation Master", description: "Complete Unit A", icon: "🧠" },
    { id: "unit_b_complete", name: "Defense Expert", description: "Complete Unit B", icon: "🛡️" },
    { id: "perfect_accuracy", name: "Perfectionist", description: "Complete lesson with 100% accuracy", icon: "⭐" },
    { id: "all_complete", name: "Psychology Master", description: "Complete all lessons", icon: "🏆" },
  ];

  const unlockedIds = new Set(achievements?.map(a => a.achievementId) || []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pb-20">
      <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b-2 border-gray-700">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button onClick={() => router.push("/dark-psychology-dashboard")} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Achievements</h1>
          </div>
          <p className="text-gray-400 mt-2">{unlockedIds.size} of {allAchievements.length} unlocked</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {allAchievements.map(achievement => {
          const unlocked = unlockedIds.has(achievement.id);
          return (
            <div key={achievement.id} className={`rounded-xl p-6 border-2 transition-all ${unlocked ? 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/30' : 'bg-gray-800/50 border-gray-700 opacity-60'}`}>
              <div className="flex items-start gap-4">
                <div className={`text-6xl ${unlocked ? '' : 'grayscale opacity-50'}`}>{achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white font-bold text-xl">{achievement.name}</h3>
                    {!unlocked && <Lock className="w-4 h-4 text-gray-500" />}
                  </div>
                  <p className="text-gray-400">{achievement.description}</p>
                  {unlocked && achievements && (
                    <p className="text-yellow-400 text-sm mt-2">Unlocked {new Date(achievements.find(a => a.achievementId === achievement.id)?.unlockedAt || 0).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
