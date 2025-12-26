"use client";

import { useEffect } from 'react';

interface ScanTransitionProps {
    onComplete: () => void;
}

export default function ScanTransition({ onComplete }: ScanTransitionProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
            {/* Wireframe Grid Background */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Vignette Overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle, transparent 40%, rgba(0, 0, 0, 0.8) 100%)'
                }}
            />

            {/* Horizontal Scanning Bar */}
            <div className="absolute inset-0">
                <div className="scan-bar" />
            </div>

            {/* Center Text */}
            <div className="relative z-10 text-center">
                <h1 className="text-2xl md:text-3xl font-mono text-white tracking-[0.3em] uppercase animate-pulse">
                    Analyzing Operative Profile<span className="blinking-cursor">_</span>
                </h1>
            </div>

            <style jsx>{`
        .scan-bar {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: white;
          box-shadow: 
            0 0 10px rgba(255, 255, 255, 0.8),
            0 0 20px rgba(255, 255, 255, 0.6),
            0 0 30px rgba(255, 255, 255, 0.4);
          animation: scan 2s ease-in-out infinite;
        }

        @keyframes scan {
          0%, 100% {
            top: 0;
            opacity: 1;
          }
          50% {
            top: 100%;
            opacity: 0.8;
          }
        }

        .blinking-cursor {
          animation: blink 1s step-start infinite;
        }

        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
}
