'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // User Onboarding Preferences
  const [habitName, setHabitName] = useState('Morning Movement');
  const [location, setLocation] = useState('Pasadena, CA');
  const [reminderTime, setReminderTime] = useState('08:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((prev) => prev + 1);
    }
  };

  const handleCompleteSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Attempt browser notification permission if requested and supported
      if (
        notificationsEnabled &&
        typeof window !== 'undefined' &&
        'Notification' in window
      ) {
        if (Notification.permission === 'default') {
          await Notification.requestPermission();
        }
      }
    } catch (err) {
      console.warn('Notification setup skipped or blocked:', err);
    } finally {
      // Always route to dashboard regardless of permission result
      setIsSubmitting(false);
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-900 justify-between">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-xl w-full mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-800/80">
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/icon-192.png"
            alt="Good Habit Logo"
            className="w-8 h-8 rounded-lg object-cover"
          />
          <span className="text-xl font-extrabold tracking-tight text-white">
            Good<span className="text-emerald-400">Habit</span>
          </span>
        </Link>
        <span className="text-xs font-semibold text-slate-400">
          Step {step} of 3
        </span>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-xl w-full mx-auto px-6 py-8 flex-1 flex flex-col justify-center">
        {/* Progress Dots Bar */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-10 bg-emerald-400'
                  : i < step
                  ? 'w-2 bg-emerald-500/50'
                  : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: Core Habit Selection */}
        {step === 1 && (
          <form
            onSubmit={handleNextStep}
            className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Step 1: Your Focus
            </span>
            <h1 className="text-2xl font-black text-white mb-2">
              What 30-day habit are you starting?
            </h1>
            <p className="text-xs text-slate-400 mb-6">
              Pick one single core habit to stick with for the next 30 days.
            </p>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Habit Title
                </label>
                <input
                  type="text"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  placeholder="e.g. 30 Days of Morning Movement"
                  required
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              {/* Preset Quick Options */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  'Morning Movement',
                  '500 Words Daily',
                  'No Sugar',
                  'Cold Plunge',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setHabitName(`30 Days of ${preset}`)}
                    className="text-[11px] font-semibold bg-slate-800 hover:bg-slate-700/80 text-slate-300 border border-slate-700 py-1.5 px-3 rounded-lg transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition-all text-sm shadow-lg shadow-emerald-500/20"
            >
              Continue to Step 2 →
            </button>
          </form>
        )}

        {/* STEP 2: City / Location Feed */}
        {step === 2 && (
          <form
            onSubmit={handleNextStep}
            className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Step 2: City Feed
            </span>
            <h1 className="text-2xl font-black text-white mb-2">
              Where are you building?
            </h1>
            <p className="text-xs text-slate-400 mb-6">
              Connect your habit progress with local creators and builders in your city feed.
            </p>

            <div className="mb-8">
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Your City or Area
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Pasadena, CA"
                required
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold py-3.5 px-4 rounded-xl transition-colors text-sm"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition-all text-sm shadow-lg shadow-emerald-500/20"
              >
                Continue to Step 3 →
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Smart Daily Reminders */}
        {step === 3 && (
          <form
            onSubmit={handleCompleteSetup}
            className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Step 3 of 3
            </span>
            <h1 className="text-2xl font-black text-white mb-2">
              Smart Daily Reminders
            </h1>
            <p className="text-xs text-slate-400 mb-6">
              Get an automated daily push reminder to check off your 30-day challenge.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                <div>
                  <h3 className="text-xs font-bold text-white">
                    Enable Daily Push Check-In
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Get accountability notifications on your device
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              {notificationsEnabled && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Preferred Daily Reminder Time
                  </label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={isSubmitting}
                className="w-1/3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold py-3.5 px-4 rounded-xl transition-colors text-sm"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition-all text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Saving...</span>
                ) : (
                  <span>Complete Setup ✓</span>
                )}
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/60 py-4 text-center text-xs text-slate-500">
        Good Habit • Step {step} of 3
      </footer>
    </div>
  );
}