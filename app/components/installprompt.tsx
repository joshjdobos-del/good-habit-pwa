'use client';

import React, { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // 1. Check if user is already running the app in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // 2. Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(iosDevice);

    // 3. Catch Android / Chrome native prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show custom prompt banner for iOS if not already installed
    if (iosDevice) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 bg-slate-800/95 border border-slate-700/90 p-4 rounded-2xl shadow-2xl backdrop-blur-md animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src="/icon-192.png"
            alt="Good Habit"
            className="w-10 h-10 rounded-xl object-cover"
          />
          <div>
            <h4 className="text-xs font-bold text-white">Install Good Habit</h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              {isIOS
                ? 'Tap Share below, then select "Add to Home Screen"'
                : 'Add to your home screen for instant access'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="text-slate-400 hover:text-white text-xs font-bold p-1"
        >
          ✕
        </button>
      </div>

      {/* Android / Desktop Direct Install Button */}
      {!isIOS && deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className="mt-3 w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-emerald-500/10"
        >
          Add to Home Screen
        </button>
      )}

      {/* iOS visual hint */}
      {isIOS && (
        <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
          <span>1. Tap Share ⎋</span>
          <span>2. Tap "Add to Home Screen" ➕</span>
        </div>
      )}
    </div>
  );
}