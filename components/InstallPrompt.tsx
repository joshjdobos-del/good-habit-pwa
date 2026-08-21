'use client';

import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [isMounted, setIsMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // 1. Check if app is already running in standalone (PWA) mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) return;

    // 2. Check if previously dismissed in this session
    const isDismissed = sessionStorage.getItem('pwa_prompt_dismissed');
    if (isDismissed) return;

    // 3. Detect iOS platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      setIsVisible(true);
      return;
    }

    // 4. Capture native install prompt on Android/Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Prevent rendering on server and during initial hydration match
  if (!isMounted || !isVisible) return null;

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 max-w-md mx-auto z-50 bg-slate-800 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-xl shrink-0">
            G
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Install Good Habit</h4>
            <p className="text-xs text-slate-400">
              Add to your home screen for quick check-ins and 8 AM/PM reminders.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white text-lg font-bold px-1"
          aria-label="Close prompt"
        >
          ✕
        </button>
      </div>

      {/* Action Area */}
      <div className="mt-3.5 pt-3 border-t border-slate-700/60 flex items-center justify-between">
        <button
          onClick={handleDismiss}
          className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          Maybe Later
        </button>
        <button
          onClick={handleInstallClick}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2 px-4 rounded-lg shadow-md transition-all flex items-center gap-1.5"
        >
          <span>📲</span> {isIOS ? 'How to Install' : 'Install App'}
        </button>
      </div>

      {/* iOS Modal Instructions */}
      {showIOSInstructions && (
        <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-300 space-y-1.5">
          <p className="font-semibold text-emerald-400">To install on iOS:</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-400">
            <li>Tap the <strong className="text-white">Share</strong> icon in Safari toolbar.</li>
            <li>Scroll down and select <strong className="text-white">Add to Home Screen</strong>.</li>
            <li>Tap <strong className="text-white">Add</strong> in the top-right corner.</li>
          </ol>
        </div>
      )}
    </div>
  );
}