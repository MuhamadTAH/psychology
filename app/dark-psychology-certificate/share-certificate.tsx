// 🧠 FILE PURPOSE
// Share certificate component for social media sharing.
// Allows users to share their completion on Twitter, Facebook, LinkedIn, etc.

"use client";

import { useState } from "react";
import { Share2, Twitter, Facebook, Linkedin, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareCertificateProps {
  userName: string;
  completedLessons: number;
  totalXP: number;
  accuracy: number;
}

export function ShareCertificate({ userName, completedLessons, totalXP, accuracy }: ShareCertificateProps) {
  const [copied, setCopied] = useState(false);

  // Step 1: Create share text
  const shareText = `🎓 I just completed the Dark Psychology course on DuoLearn!\n\n✅ ${completedLessons} lessons completed\n⚡ ${totalXP} XP earned\n🎯 ${accuracy}% accuracy\n\nReady to master psychological defense strategies!`;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Step 2: Share URLs for different platforms
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent('Check out my Dark Psychology completion!')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`,
  };

  // Step 3: Copy to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText + '\n\n' + shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl border-2 border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-purple-400" />
        <h3 className="text-xl font-bold text-white">Share Your Achievement</h3>
      </div>

      <p className="text-gray-400 text-sm mb-6">
        Let others know about your accomplishment!
      </p>

      {/* Social Share Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors"
        >
          <Twitter className="w-4 h-4" />
          <span className="font-medium">Twitter</span>
        </a>

        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
        >
          <Facebook className="w-4 h-4" />
          <span className="font-medium">Facebook</span>
        </a>

        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white py-3 px-4 rounded-lg transition-colors"
        >
          <Linkedin className="w-4 h-4" />
          <span className="font-medium">LinkedIn</span>
        </a>

        <a
          href={shareLinks.email}
          className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors"
        >
          <Mail className="w-4 h-4" />
          <span className="font-medium">Email</span>
        </a>
      </div>

      {/* Copy Link Button */}
      <Button
        onClick={handleCopyLink}
        variant="outline"
        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Copied to Clipboard!
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 mr-2" />
            Copy Share Link
          </>
        )}
      </Button>
    </div>
  );
}

// ✅ In this component we achieved:
// Social media sharing buttons for Twitter, Facebook, LinkedIn, Email.
// Copy to clipboard functionality.
// Dynamic share text with user's real statistics.
