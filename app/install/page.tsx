'use client';

import { useEffect, useState } from 'react';
import { Download, Smartphone, Globe, CheckCircle, Copy } from 'lucide-react';

/**
 * Install Page
 * 
 * A dedicated page users can visit to install the PWA.
 * You can share this link: https://your-app.com/install
 * 
 * Features:
 * - Step-by-step installation instructions
 * - Platform-specific guidance (iOS, Android, Desktop)
 * - Shareable link
 * - QR code support (optional)
 */

export default function InstallPage() {
    const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('android');
    const [copied, setCopied] = useState(false);
    const [installUrl, setInstallUrl] = useState('');

    useEffect(() => {
        // Detect platform
        const userAgent = navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);

        if (isIOS) {
            setPlatform('ios');
        } else if (isAndroid) {
            setPlatform('android');
        } else {
            setPlatform('desktop');
        }

        // Get current URL for sharing
        setInstallUrl(window.location.origin);
    }, []);

    const copyLink = () => {
        navigator.clipboard.writeText(installUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-lg">
                        <Download className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Install DuoLearn
                    </h1>
                    <p className="text-lg text-gray-600">
                        Get the full app experience with offline access and faster performance
                    </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Smartphone className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Native Feel</h3>
                        <p className="text-sm text-gray-600">Works like a real app</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Globe className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Offline Access</h3>
                        <p className="text-sm text-gray-600">Learn without internet</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                        <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="w-6 h-6 text-pink-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Quick Launch</h3>
                        <p className="text-sm text-gray-600">One tap from home screen</p>
                    </div>
                </div>

                {/* Installation Instructions */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        How to Install
                    </h2>

                    {/* Platform Tabs */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setPlatform('ios')}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${platform === 'ios'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            iOS
                        </button>
                        <button
                            onClick={() => setPlatform('android')}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${platform === 'android'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Android
                        </button>
                        <button
                            onClick={() => setPlatform('desktop')}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${platform === 'desktop'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Desktop
                        </button>
                    </div>

                    {/* iOS Instructions */}
                    {platform === 'ios' && (
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Open in Safari</h3>
                                    <p className="text-gray-600">Make sure you're using Safari browser (not Chrome or other browsers)</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Tap the Share button</h3>
                                    <p className="text-gray-600">Tap the <span className="inline-block text-xl">⎙</span> share icon at the bottom of the screen</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                    3
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Add to Home Screen</h3>
                                    <p className="text-gray-600">Scroll down and tap "Add to Home Screen" <span className="inline-block">➕</span></p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                    4
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Confirm</h3>
                                    <p className="text-gray-600">Tap "Add" in the top right corner. Done! 🎉</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Android Instructions */}
                    {platform === 'android' && (
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Open in Chrome</h3>
                                    <p className="text-gray-600">Visit this page in Chrome, Edge, or Samsung Internet</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Tap "Install"</h3>
                                    <p className="text-gray-600">A banner will appear at the bottom - tap "Install" or "Add to Home Screen"</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                    3
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Alternative Method</h3>
                                    <p className="text-gray-600">Tap the menu (⋮) → "Install app" or "Add to Home screen"</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                    4
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Launch</h3>
                                    <p className="text-gray-600">Find the DuoLearn icon on your home screen. Done! 🎉</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Desktop Instructions */}
                    {platform === 'desktop' && (
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Open in Chrome or Edge</h3>
                                    <p className="text-gray-600">Visit this page in Chrome, Edge, or Brave browser</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Click Install Icon</h3>
                                    <p className="text-gray-600">Look for the install icon (➕ or ⬇️) in the address bar</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                    3
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Alternative Method</h3>
                                    <p className="text-gray-600">Click menu (⋮) → "Install DuoLearn" or "Create shortcut"</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                    4
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Launch</h3>
                                    <p className="text-gray-600">Find DuoLearn in your apps or desktop. Done! 🎉</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Share Link */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-xl p-8 text-white">
                    <h2 className="text-2xl font-bold mb-4">Share This Page</h2>
                    <p className="mb-4 opacity-90">
                        Send this link to others so they can install DuoLearn too!
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={installUrl}
                            readOnly
                            className="flex-1 px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30"
                        />
                        <button
                            onClick={copyLink}
                            className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
                        >
                            {copied ? (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-5 h-5" />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
