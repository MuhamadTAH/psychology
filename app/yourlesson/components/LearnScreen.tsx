// 🧠 FILE PURPOSE
// LearnScreen component for displaying "Learn" type content screens.
// Shows paragraphs and alerts one by one with slide-down animation.
// Continue button reveals next content item until all items shown, then proceeds to next screen.

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, XCircle, CheckCircle } from "lucide-react";

// Step 1: Define content item types
interface ParagraphContent {
  type: "paragraph";
  text: string;
}

interface AlertContent {
  type: "alert";
  alertType: "warning" | "info" | "danger" | "success";
  text: string;
}

type ContentItem = ParagraphContent | AlertContent;

interface LearnScreenProps {
  title: string;
  content: ContentItem[];
  onContinue: () => void; // Called when all content shown and user clicks final continue
}

// Step 2: AlertBox component with different styles based on alertType
function AlertBox({ alertType, text }: { alertType: string; text: string }) {
  const styles = {
    warning: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/50",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
      textColor: "text-yellow-200",
    },
    info: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/50",
      icon: <Info className="w-5 h-5 text-blue-400" />,
      textColor: "text-blue-200",
    },
    danger: {
      bg: "bg-red-500/10",
      border: "border-red-500/50",
      icon: <XCircle className="w-5 h-5 text-red-400" />,
      textColor: "text-red-200",
    },
    success: {
      bg: "bg-green-500/10",
      border: "border-green-500/50",
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      textColor: "text-green-200",
    },
  };

  const style = styles[alertType as keyof typeof styles] || styles.info;

  return (
    <div className={`${style.bg} border-2 ${style.border} rounded-xl p-4 flex items-start gap-3`}>
      {style.icon}
      <p className={`${style.textColor} text-base leading-relaxed`}>{text}</p>
    </div>
  );
}

// Step 3: Main LearnScreen component
export default function LearnScreen({ title, content, onContinue }: LearnScreenProps) {
  const [visibleItems, setVisibleItems] = useState(1); // Start with first item visible

  // Step 4: Handle continue button click
  const handleContinue = () => {
    if (visibleItems < content.length) {
      // More content to show - reveal next item with slide-down animation
      setVisibleItems(visibleItems + 1);
    } else {
      // All content shown - proceed to next screen (exercises)
      onContinue();
    }
  };

  const isLastItem = visibleItems >= content.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900/90 backdrop-blur-sm border-b-2 border-gray-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white text-center">{title}</h1>
      </div>

      {/* Content Area with slide-down animation */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="max-w-2xl w-full space-y-6">
          <AnimatePresence mode="sync">
            {content.slice(0, visibleItems).map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index === visibleItems - 1 ? 0.2 : 0, // Only animate the newest item
                  ease: "easeOut",
                }}
              >
                {item.type === "paragraph" ? (
                  <p className="text-gray-200 text-lg leading-relaxed">
                    {/* Parse markdown-style bold text */}
                    {item.text.split(/(\*\*.*?\*\*|\*.*?\*)/).map((part, i) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return (
                          <strong key={i} className="text-white font-bold">
                            {part.slice(2, -2)}
                          </strong>
                        );
                      }
                      if (part.startsWith("*") && part.endsWith("*")) {
                        return (
                          <em key={i} className="text-purple-300 italic">
                            {part.slice(1, -1)}
                          </em>
                        );
                      }
                      return <span key={i}>{part}</span>;
                    })}
                  </p>
                ) : item.type === "alert" ? (
                  <AlertBox alertType={item.alertType} text={item.text} />
                ) : null}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Continue Button - Fixed at bottom */}
      <div className="bg-gray-900/90 backdrop-blur-sm border-t-2 border-gray-700 px-6 py-4">
        <motion.button
          onClick={handleContinue}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
            isLastItem
              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-500 hover:to-purple-600"
              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLastItem ? "Continue to Exercises" : "Continue"}
        </motion.button>

        {/* Progress indicator */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {content.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index < visibleItems
                  ? "w-8 bg-purple-500"
                  : "w-2 bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ✅ In this component we achieved:
// Learn screen that displays content items one by one with slide-down animation.
// Continue button reveals next paragraph/alert until all shown.
// When all content visible, button changes to "Continue to Exercises" and calls onContinue.
// AlertBox component with 4 variants (warning, info, danger, success) with proper styling.
// Markdown-style text parsing for **bold** and *italic* formatting.
// Progress indicator dots showing current position in content.
