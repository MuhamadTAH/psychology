// 🧠 FILE PURPOSE
// This page is used to test cat animation videos.
// It displays the video with controls so you can see how it works.

"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AnimationTestPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState<string>("");

  // Step 1: Define video segments
  // You can add more segments here for different animations
  const [currentVideo, setCurrentVideo] = useState("/animations/character-standing.webm");

  // Step 2: Handle video playback
  // Play video from start when button is clicked
  const playVideo = async () => {
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
        await videoRef.current.play();
      } catch (error) {
      }
    }
  };

  // Step 3: Handle video pause
  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Step 4: Handle video reset
  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  };

  // Step 5: Handle fullscreen
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // ✅ In this section we achieved:
  // Created basic video controls for testing cat animations

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🐱 Cat Animation Test</h1>
          <p className="text-gray-400">Test your cat animation videos here</p>
        </div>

        {/* Video Player */}
        <div className="mb-6">
          <video
            ref={videoRef}
            className="w-full h-auto"
            preload="auto"
            playsInline
            onError={(e) => {
              const target = e.target as HTMLVideoElement;
              setVideoError(`Video error: ${target.error?.message || 'Unknown error'}`);
            }}
            onLoadedData={() => {
              setVideoError("");
            }}
          >
            <source src={currentVideo} type="video/webm" />
            Your browser does not support the video tag.
          </video>
          {videoError && (
            <p className="text-red-500 mt-4 text-center">{videoError}</p>
          )}
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Button
            onClick={playVideo}
            className="bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-4 text-lg rounded-xl"
          >
            ▶️ Play
          </Button>
          <Button
            onClick={pauseVideo}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 text-lg rounded-xl"
          >
            ⏸️ Pause
          </Button>
          <Button
            onClick={resetVideo}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 text-lg rounded-xl"
          >
            🔄 Reset
          </Button>
          <Button
            onClick={toggleFullscreen}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 text-lg rounded-xl"
          >
            ⛶ Fullscreen
          </Button>
        </div>

        {/* Video Info */}
        <div className="bg-[#1a2332] p-6 rounded-xl border-2 border-gray-700 mb-6">
          <h3 className="text-xl font-bold text-white mb-3">Current Video:</h3>
          <p className="text-gray-300 font-mono text-sm break-all">{currentVideo}</p>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            onClick={() => router.push('/dark-psychology-dashboard')}
            variant="outline"
            className="flex-1 py-4 text-lg"
          >
            ← Back to Dashboard
          </Button>
          <Button
            onClick={() => router.push('/yourlesson')}
            variant="outline"
            className="flex-1 py-4 text-lg"
          >
            Go to Lesson →
          </Button>
        </div>
      </div>
    </div>
  );
}

// ✅ In this section we achieved:
// Created a complete animation test page with video controls and navigation
