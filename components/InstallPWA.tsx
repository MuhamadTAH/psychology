'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

/**
 * PWA Install Component
 * 
 * Shows a custom "Install App" button that allows users to install
 * the PWA to their home screen with one click.
 * 
 * Features:
 * - Detects if PWA can be installed
 * - Shows custom install prompt
 * - Works on Android (Chrome, Edge, Samsung Internet)
 * - Works on iOS (Safari - shows instructions)
 * - Dismissible banner
 * - Remembers if user dismissed it
 */

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if already installed (running in standalone mode)
        const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
        setIsStandalone(isInStandaloneMode);

        // Check if iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(iOS);

        // Check if user already dismissed the banner
        const dismissed = localStorage.getItem('pwa-install-dismissed');

        if (!isInStandaloneMode && !dismissed) {
            // Listen for the beforeinstallprompt event (Android/Desktop)
            const handleBeforeInstallPrompt = (e: Event) => {
                e.preventDefault();
                setDeferredPrompt(e as BeforeInstallPromptEvent);
                setShowInstallBanner(true);
            };

            window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

            // For iOS, show banner after 3 seconds if not installed
            if (iOS && !isInStandaloneMode) {
                setTimeout(() => {
                    setShowInstallBanner(true);
                }, 3000);
            }

            return () => {
                window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            };
        }
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            // Android/Desktop: Show native install prompt
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
                setShowInstallBanner(false);
            }

            setDeferredPrompt(null);
        }
        // For iOS, the instructions are already shown in the banner
    };

    const handleDismiss = () => {
        setShowInstallBanner(false);
        localStorage.setItem('pwa-install-dismissed', 'true');
    };

    // Don't show if already installed or dismissed
    if (isStandalone || !showInstallBanner) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl p-4 max-w-md mx-auto">
                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Dismiss"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-3">
                    <div className="bg-white/20 p-3 rounded-xl">
                        <Download className="w-6 h-6" />
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">Install DuoLearn</h3>

                        {isIOS ? (
                            // iOS Instructions
                            <div className="text-sm opacity-90 space-y-2">
                                <p>Install this app on your iPhone:</p>
                                <ol className="list-decimal list-inside space-y-1 text-xs">
                                    <li>Tap the Share button <span className="inline-block">⎙</span></li>
                                    <li>Scroll down and tap "Add to Home Screen"</li>
                                    <li>Tap "Add" in the top right</li>
                                </ol>
                            </div>
                        ) : (
                            // Android/Desktop
                            <div className="space-y-2">
                                <p className="text-sm opacity-90">
                                    Get quick access and work offline!
                                </p>
                                <button
                                    onClick={handleInstallClick}
                                    className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors w-full"
                                >
                                    Install Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
