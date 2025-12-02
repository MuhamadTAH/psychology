// 🧠 FILE PURPOSE
// This file provides a simple toast notification component.
// Used for showing streak notifications and other temporary messages.

"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  icon?: React.ReactNode;
  onClose: () => void;
  duration?: number; // Auto-close duration in ms
}

export function Toast({ message, type = "info", icon, onClose, duration = 3000 }: ToastProps) {
  // Step 1: Auto-close after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Step 2: Determine colors based on type
  const colors = {
    success: "bg-green-500/90 border-green-400",
    error: "bg-red-500/90 border-red-400",
    info: "bg-blue-500/90 border-blue-400",
  };

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] ${colors[type]} border-2 rounded-2xl px-6 py-4 shadow-2xl animate-slide-down max-w-md`}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        {icon && <div className="flex-shrink-0">{icon}</div>}

        {/* Message */}
        <p className="text-white font-bold text-lg flex-1">{message}</p>

        {/* Close button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// ✅ In this component we achieved:
// A reusable toast notification with auto-close and manual close.
// Supports success, error, and info types with appropriate colors.
// Positioned at top center with smooth animation.
