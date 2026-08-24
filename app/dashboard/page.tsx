'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Unique storage key per user (falls back to guest key)
  const storageKey = user?.uid ? `goodhabit_completed_days_${user.uid}` : 'goodhabit_completed_days';

  // Starts at 0 completed days for new users
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  const totalDays = 30;
  const habit = localStorage.getItem('goodhabit_initial_habit') || 'Your 30-Day Habit';

  // Automatically determine current active day based on user progress (Day 1 for new users)
  const currentDay = Math.min(
    totalDays,
    completedDays.length > 0 ? Math.max(...completedDays) + 1 : 1
  );

  const isTodayCompleted = completedDays.includes(currentDay);

  // Load returning user's saved progress from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load completed days progress
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setCompletedDays(JSON.parse(saved));
        } catch (err) {
          console.error('Failed to parse saved progress:', err);
        }
      }

      // Load saved 30-day habit title from signup
      const savedHabit = localStorage.getItem('goodhabit_initial_habit');
      if (savedHabit) {
        setHabitTitle(savedHabit);
      }

      setIsLoaded(true);
    }
  }, [storageKey]);

  // Helper to update state and save to local storage
  const saveCompletedDays = (newDays: number[]) => {
    setCompletedDays(newDays);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(newDays));
    }
  };

  useEffect(() => {
    // Check if app is already running in PWA standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(iosDevice);

    // Capture Android / Desktop Chrome install event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (iosDevice) {
      setShowInstallBanner(true);
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
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const toggleToday = () => {
    let updated: number[];
    if (isTodayCompleted) {
      updated = completedDays.filter((d) => d !== currentDay);
    } else {
      updated = [...completedDays, currentDay].sort((a, b) => a - b);
    }
    saveCompletedDays(updated);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  if (!isLoaded) return null; // Avoid hydration mismatch on initial mount

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans pb-24 sm:pb-12 selection:bg-emerald-500 selection:text-slate-900">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header Navigation */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800/80">
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <img
            src="/icon-192.png"
            alt="Good Habit Logo"
            className="w-8 h-8 rounded-lg object-cover"
          />
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white whitespace-nowrap">
            Good<span className="text-emerald-400">Habit</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex items-center gap-4 text-xs font-semibold">
            <Link
              href="/dashboard"
              className="text-emerald-400 font-bold border-b-2 border-emerald-400 pb-0.5"
            >
              Dashboard
            </Link>
            <Link
              href="/community"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Community
            </Link>
          </nav>

          <button
            onClick={handleSignOut}
            className="text-slate-400 hover:text-slate-200 bg-slate-800 border border-slate-700 text-xs py-1.5 px-3 rounded-lg transition-colors font-semibold shrink-0"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-3xl w-full mx-auto px-6 pt-8 flex-1">

        {/* Dashboard PWA Install Card */}
        {showInstallBanner && (
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-800/60 to-slate-800/40 border border-emerald-500/30 rounded-2xl p-4.5 mb-6 backdrop-blur-sm shadow-xl relative">
            <button
              onClick={() => setShowInstallBanner(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white text-xs font-bold p-1"
            >
              ✕
            </button>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="/icon-192.png"
                  alt="Good Habit Logo"
                  className="w-10 h-10 rounded-xl object-cover border border-emerald-500/30"
                />
                <div>
                  <h3 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <span>📱</span> Install Good Habit App
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {isIOS
                      ? 'Tap Share ⎋ then "Add to Home Screen" ➕ for 1-tap access.'
                      : 'Add to home screen for daily check-in reminders & quick access.'}
                  </p>
                </div>
              </div>

              {!isIOS && deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="w-full sm:w-auto shrink-0 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-emerald-500/20"
                >
                  Add to Home Screen
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Privacy / Identity Toggle */}
        <div className="bg-slate-800/50 border border-slate-800/80 rounded-2xl p-4 mb-6 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-sm">
              {isAnonymous ? '🕵️‍♂️' : '👤'}
            </div>
            <div>
              <span className="text-xs font-extrabold text-white block">
                Community Privacy Profile
              </span>
              <span className="text-[11px] text-slate-400">
                {isAnonymous
                  ? 'Appearing as "Anonymous" in local community feeds'
                  : 'Appearing with your First Name in local community feeds'}
              </span>
            </div>
          </div>

          <div className="flex bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsAnonymous(false)}
              className={`flex-1 sm:flex-none text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all ${
                !isAnonymous
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              First Name
            </button>
            <button
              type="button"
              onClick={() => setIsAnonymous(true)}
              className={`flex-1 sm:flex-none text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all ${
                isAnonymous
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Anonymous
            </button>
          </div>
        </div>

        {/* Active Challenge Header */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Active 30-Day Challenge
              </span>
              <h1 className="text-2xl font-black text-white">{habitTitle}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400">
                  {completedDays.length}
                </span>
                <span className="text-slate-400 text-sm font-semibold">
                  {' '}
                  / {totalDays} Days
                </span>
              </div>
            </div>
          </div>

          {/* Today's Action Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-0.5">
                Day {currentDay} Check-In
              </h3>
              <p className="text-xs text-slate-400">
                {isTodayCompleted
                  ? "Great job! You've checked off today's habit."
                  : "Tap to mark today's habit complete."}
              </p>
            </div>
            <button
              onClick={toggleToday}
              className={`w-full sm:w-auto font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
                isTodayCompleted
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 hover:bg-slate-700'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              <span>{isTodayCompleted ? '✓ Completed' : `Mark Day ${currentDay} Done`}</span>
            </button>
          </div>

          {/* 30-Day Progress Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              30-Day Tracker Grid
            </h3>
            <div className="grid grid-cols-6 gap-2 sm:gap-3">
              {Array.from({ length: totalDays }, (_, i) => {
                const dayNum = i + 1;
                const isDone = completedDays.includes(dayNum);
                const isCurrent = dayNum === currentDay;

                return (
                  <button
                    key={dayNum}
                    onClick={() => {
                      if (dayNum <= currentDay || isDone) {
                        const updated = isDone
                          ? completedDays.filter((d) => d !== dayNum)
                          : [...completedDays, dayNum].sort((a, b) => a - b);
                        saveCompletedDays(updated);
                      }
                    }}
                    disabled={dayNum > currentDay && !isDone}
                    className={`aspect-square rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-500 border border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/10'
                        : isCurrent
                        ? 'bg-slate-800 border-2 border-emerald-400 text-emerald-400 animate-pulse'
                        : dayNum < currentDay
                        ? 'bg-slate-800/80 border border-slate-700 text-slate-400'
                        : 'bg-slate-900/40 border border-slate-800/50 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-[9px] opacity-60">DAY</span>
                    <span>{dayNum}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 border-t border-slate-800 backdrop-blur-md py-2.5 px-6 flex items-center justify-around">
        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-1 text-emerald-400 font-bold"
        >
          <span className="text-lg">📊</span>
          <span className="text-[10px]">Dashboard</span>
        </Link>
        <Link
          href="/community"
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
        >
          <span className="text-lg">📍</span>
          <span className="text-[10px] font-bold">Community</span>
        </Link>
      </nav>
    </div>
  );
}