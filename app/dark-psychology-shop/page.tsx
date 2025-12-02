// 🧠 FILE PURPOSE
// Dark Psychology Power-ups Shop page where users spend gems to buy power-ups.
// Displays available power-ups, prices, owned quantities, and gem balance.
// Users can purchase power-ups to use during lessons for various advantages.

"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowLeft, Gem, ShoppingCart, Sparkles } from "lucide-react";
import { useState } from "react";

export default function DarkPsychologyShop() {
  const router = useRouter();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  // Step 1: Load shop data with gem balance and power-ups
  const shopData = useQuery(api.darkPsychology.getShopData, { email: userEmail });
  const purchasePowerUp = useMutation(api.darkPsychology.purchasePowerUp);

  const [purchaseQuantity, setPurchaseQuantity] = useState<Record<string, number>>({});
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  if (!shopData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading shop...</div>
      </div>
    );
  }

  // Step 2: Handle power-up purchase
  const handlePurchase = async (item: any) => {
    const quantity = purchaseQuantity[item.id] || 1;
    const totalCost = item.price * quantity;

    if (shopData.gems < totalCost) {
      setPurchaseError(`Not enough gems! You need ${totalCost} gems but only have ${shopData.gems}.`);
      setTimeout(() => setPurchaseError(null), 3000);
      return;
    }

    try {
      const result = await purchasePowerUp({
        email: userEmail,
        powerUpType: item.id,
        powerUpName: item.name,
        gemsCost: item.price,
        quantity,
      });

      setPurchaseMessage(`Successfully purchased ${quantity}x ${item.name}! You now have ${result.newQuantity}.`);
      setPurchaseQuantity({ ...purchaseQuantity, [item.id]: 1 });
      setTimeout(() => setPurchaseMessage(null), 3000);
    } catch (error: any) {
      setPurchaseError(error.message || "Purchase failed");
      setTimeout(() => setPurchaseError(null), 3000);
    }
  };

  // Step 3: Update purchase quantity
  const updateQuantity = (itemId: string, delta: number) => {
    const current = purchaseQuantity[itemId] || 1;
    const newQuantity = Math.max(1, Math.min(10, current + delta));
    setPurchaseQuantity({ ...purchaseQuantity, [itemId]: newQuantity });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b-2 border-gray-700">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button
            onClick={() => router.push("/dark-psychology-dashboard")}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">Power-ups Shop</h1>
            </div>
            {/* Gem Balance */}
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/50 rounded-xl px-6 py-3">
              <div className="flex items-center gap-2">
                <Gem className="w-6 h-6 text-blue-400" />
                <span className="text-white font-bold text-2xl">{shopData.gems}</span>
              </div>
              <p className="text-blue-300 text-xs text-center">Gems</p>
            </div>
          </div>
          <p className="text-gray-400 mt-2">Use gems to purchase power-ups that help you in lessons!</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Purchase Messages */}
        {purchaseMessage && (
          <div className="bg-green-500/20 border-2 border-green-500/50 rounded-xl p-4 mb-6">
            <p className="text-green-300 text-center font-semibold">{purchaseMessage}</p>
          </div>
        )}

        {purchaseError && (
          <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-4 mb-6">
            <p className="text-red-300 text-center font-semibold">{purchaseError}</p>
          </div>
        )}

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shopData.shopItems.map((item) => {
            const quantity = purchaseQuantity[item.id] || 1;
            const totalCost = item.price * quantity;
            const canAfford = shopData.gems >= totalCost;

            return (
              <div
                key={item.id}
                className="bg-gray-800/50 rounded-xl border-2 border-gray-700 p-6 hover:border-purple-500 transition-all"
              >
                {/* Item Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-5xl">{item.icon}</div>
                    <div>
                      <h3 className="text-white font-bold text-xl">{item.name}</h3>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>

                {/* Owned Quantity */}
                {item.owned > 0 && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2 mb-4">
                    <p className="text-purple-300 text-sm text-center">
                      You own: <span className="font-bold">{item.owned}</span>
                    </p>
                  </div>
                )}

                {/* Price Display */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Gem className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-bold text-2xl">{item.price}</span>
                  <span className="text-gray-400 text-sm">per item</span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-10 h-10 bg-gray-700 rounded-lg text-white font-bold hover:bg-gray-600 transition-all"
                  >
                    −
                  </button>
                  <div className="w-16 text-center">
                    <span className="text-white font-bold text-xl">{quantity}</span>
                  </div>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-10 h-10 bg-gray-700 rounded-lg text-white font-bold hover:bg-gray-600 transition-all"
                  >
                    +
                  </button>
                </div>

                {/* Total Cost */}
                <div className="bg-gray-900/50 rounded-lg p-3 mb-4">
                  <p className="text-gray-400 text-sm text-center mb-1">Total Cost:</p>
                  <div className="flex items-center justify-center gap-2">
                    <Gem className="w-5 h-5 text-blue-400" />
                    <span className={`font-bold text-xl ${canAfford ? "text-white" : "text-red-400"}`}>
                      {totalCost}
                    </span>
                  </div>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={() => handlePurchase(item)}
                  disabled={!canAfford}
                  className={`w-full py-3 px-6 rounded-lg font-bold transition-all ${
                    canAfford
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-500 hover:to-purple-600"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {canAfford ? `Buy ${quantity}x ${item.name}` : "Not Enough Gems"}
                </button>
              </div>
            );
          })}
        </div>

        {/* How to Earn Gems */}
        <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-6 mt-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <h3 className="text-white font-bold text-lg">How to Earn Gems</h3>
          </div>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Complete lessons to earn gems as rewards</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Daily quests reward gems for various tasks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Weekly challenges offer larger gem bonuses</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Maintain your streak to unlock gem rewards at milestones</span>
            </li>
          </ul>
        </div>

        {/* Power-up Usage Guide */}
        <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-6 mt-6">
          <h3 className="text-white font-bold text-lg mb-4">📖 Power-up Usage Guide</h3>
          <div className="space-y-3 text-gray-300 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="text-white font-semibold">Hint</p>
                <p className="text-gray-400">Click during a question to eliminate wrong options</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏭️</span>
              <div>
                <p className="text-white font-semibold">Skip Question</p>
                <p className="text-gray-400">Skip a difficult question without losing points</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏸️</span>
              <div>
                <p className="text-white font-semibold">Time Freeze</p>
                <p className="text-gray-400">Pause the timer for 30 seconds (timed lessons only)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">❤️</span>
              <div>
                <p className="text-white font-semibold">Extra Heart</p>
                <p className="text-gray-400">Restore 1 heart if you run out during a lesson</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🧊</span>
              <div>
                <p className="text-white font-semibold">Streak Freeze</p>
                <p className="text-gray-400">Automatically protects your streak if you miss a day</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ In this page we achieved:
// Complete power-ups shop with real gem spending.
// Display all power-ups with prices, descriptions, and owned quantities.
// Quantity selector for bulk purchases (1-10 items).
// Real-time gem balance checking before purchase.
// Purchase confirmation messages and error handling.
// Guide on how to earn gems and how to use power-ups.
