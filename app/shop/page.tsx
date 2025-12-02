// 🧠 FILE PURPOSE
// This page displays the gem shop where users can purchase power-ups.
// Users can buy hearts refills, streak freezes, and XP boosts using gems.

"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Gem, Heart, Zap, Snowflake, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ShopPage() {
  const { user } = useUser();
  const userStats = useQuery(api.gamification.getUserStats, {
    email: user?.emailAddresses[0]?.emailAddress,
  });

  // Step 1: Get shop items and user stats
  const shopItems = useQuery(api.shop.getShopItems);

  // Step 2: Purchase mutations
  const purchaseHearts = useMutation(api.shop.purchaseHeartsRefill);
  const purchaseStreakFreeze = useMutation(api.shop.purchaseStreakFreeze);
  const purchaseDoubleXP = useMutation(api.shop.purchaseDoubleXP);

  // Step 3: State for purchase feedback
  const [purchaseMessage, setPurchaseMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Step 4: Handle purchase click
  const handlePurchase = async (itemId: string) => {
    setIsPurchasing(true);
    setPurchaseMessage(null);

    try {
      let result;

      if (itemId === "refill_hearts") {
        result = await purchaseHearts();
      } else if (itemId === "streak_freeze") {
        result = await purchaseStreakFreeze();
      } else if (itemId === "double_xp") {
        result = await purchaseDoubleXP();
      }

      setPurchaseMessage({
        type: "success",
        message: `✅ Successfully purchased ${result?.itemPurchased}!`,
      });
    } catch (error: any) {
      setPurchaseMessage({
        type: "error",
        message: error.message || "Purchase failed. Please try again.",
      });
    } finally {
      setIsPurchasing(false);

      // Clear message after 3 seconds
      setTimeout(() => setPurchaseMessage(null), 3000);
    }
  };

  // Step 5: Loading state
  if (!shopItems || !userStats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading shop...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pb-20">
      {/* Step 6: Header with back button and user gems */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b-2 border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/learn"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>

            <div className="flex items-center gap-6">
              {/* Hearts display */}
              <div className="flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-full border border-red-500/30">
                <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                <span className="text-white font-bold">{userStats.hearts}</span>
              </div>

              {/* Gems display */}
              <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full border border-purple-500/30">
                <Gem className="w-5 h-5 text-purple-400" />
                <span className="text-white font-bold">{userStats.gems}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 7: Main content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <ShoppingBag className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Gem Shop</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Spend your gems on power-ups and boosts!
          </p>
        </div>

        {/* Purchase message */}
        {purchaseMessage && (
          <div
            className={`mb-6 p-4 rounded-xl border-2 ${
              purchaseMessage.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <p className="text-center font-semibold">{purchaseMessage.message}</p>
          </div>
        )}

        {/* Step 8: Shop items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopItems.map((item) => {
            const canAfford = (userStats.gems ?? 0) >= item.cost;

            // Get appropriate icon component
            const IconComponent =
              item.id === "refill_hearts"
                ? Heart
                : item.id === "streak_freeze"
                ? Snowflake
                : Zap;

            return (
              <div
                key={item.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-gray-700 p-6 hover:border-purple-500/50 transition-all"
              >
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center border-2 border-purple-500/30">
                    <IconComponent className="w-10 h-10 text-purple-400" />
                  </div>
                </div>

                {/* Item name */}
                <h3 className="text-xl font-bold text-white text-center mb-2">
                  {item.name}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm text-center mb-4 min-h-[40px]">
                  {item.description}
                </p>

                {/* Cost */}
                <div className="flex items-center justify-center gap-2 mb-4 bg-purple-500/10 py-2 px-4 rounded-full border border-purple-500/20">
                  <Gem className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-bold text-lg">{item.cost}</span>
                </div>

                {/* Purchase button */}
                <button
                  onClick={() => handlePurchase(item.id)}
                  disabled={!canAfford || isPurchasing}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all ${
                    canAfford && !isPurchasing
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-2 border-purple-500/50 hover:scale-105 active:scale-95"
                      : "bg-gray-700 border-2 border-gray-600 cursor-not-allowed opacity-50"
                  }`}
                >
                  {isPurchasing
                    ? "Processing..."
                    : canAfford
                    ? "Purchase"
                    : "Not Enough Gems"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Step 9: How to get more gems */}
        <div className="mt-12 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border-2 border-purple-500/30 p-6">
          <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
            <Gem className="w-6 h-6 text-purple-400" />
            How to Get More Gems
          </h2>
          <ul className="text-gray-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Open treasure chests (every 3 lessons) for +5 gems each</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Complete lessons and practice regularly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Keep your streak alive for bonus rewards</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ✅ In this page we achieved:
// A fully functional gem shop where users can purchase power-ups.
// Real-time gem/hearts display, purchase confirmation, and error handling.
// Responsive design with visual feedback for all actions.
