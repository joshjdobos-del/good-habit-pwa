'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [onboardingData, setOnboardingData] = useState({
    habitTitle: '',
    category: 'Health & Fitness',
    city: '',
    reminderTime: '08:00',
    notificationsEnabled: true,
  });

  const categories = ['Health & Fitness', 'Productivity', 'Mindfulness', 'Learning', 'Creative'];

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Request browser notification permission if enabled
      if (onboardingData.notificationsEnabled && 'Notification' in window) {
        await Notification.requestPermission();
      }

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        habitTitle: onboardingData.habitTitle,
        habitCategory: onboardingData.category,
        city: onboardingData.city.trim().toLowerCase(),
        reminderTime: onboardingData.reminderTime,
        notificationsEnabled: onboardingData.notificationsEnabled,
        onboardingCompleted: true,
        completedDays: [],
        createdAt: new Date().toISOString(),
      });

      router.push('/dashboard');
    } catch (err) {
      console.error('Error saving onboarding data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-lg bg-slate-800/50 border border-slate-700/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        {/* Progress Bar Header */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Step {step} of 3
          </span>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 w-8 rounded-full transition-all ${
                  i <= step ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Goal Definition */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">What habit are you committing to?</h1>
              <p className="text-slate-400 text-sm">Pick a goal you will execute every single day for the next 30 days.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Habit Name</label>
              <input
                type="text"
                placeholder="e.g., 30 Minutes of Morning Reading"
                value={onboardingData.habitTitle}
                onChange={(e) => setOnboardingData({ ...onboardingData, habitTitle: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setOnboardingData({ ...onboardingData, category: cat })}
                    className={`py-2.5 px-3 rounded-lg text-xs font-semibold text-left border transition-all ${
                      onboardingData.category === cat
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={!onboardingData.habitTitle.trim()}
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-emerald-500 text-slate-950 font-bold rounded-xl disabled:opacity-50 hover:bg-emerald-400 transition-all"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: City Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Where are you building from?</h1>
              <p className="text-slate-400 text-sm">Join local anonymous motivation feeds with builders in your city.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">City Name</label>
              <input
                type="text"
                placeholder="e.g., Pasadena, Los Angeles, Austin"
                value={onboardingData.city}
                onChange={(e) => setOnboardingData({ ...onboardingData, city: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 border border-slate-700 text-slate-300 font-semibold rounded-xl hover:bg-slate-800"
              >
                Back
              </button>
              <button
                disabled={!onboardingData.city.trim()}
                onClick={() => setStep(3)}
                className="w-2/3 py-3.5 bg-emerald-500 text-slate-950 font-bold rounded-xl disabled:opacity-50 hover:bg-emerald-400 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Reminders & Push Setup */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Smart Daily Reminders</h1>
              <p className="text-slate-400 text-sm">We send automated checks at 8:00 AM and 8:00 PM if your day is not marked complete.</p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-700/80 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Daily Accountability Pushes</p>
                  <p className="text-xs text-slate-400">8:00 AM kickstart & 8:00 PM wrap-up check</p>
                </div>
                <input
                  type="checkbox"
                  checked={onboardingData.notificationsEnabled}
                  onChange={(e) => setOnboardingData({ ...onboardingData, notificationsEnabled: e.target.checked })}
                  className="w-5 h-5 accent-emerald-500 rounded"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3.5 border border-slate-700 text-slate-300 font-semibold rounded-xl hover:bg-slate-800"
              >
                Back
              </button>
              <button
                disabled={loading}
                onClick={handleFinish}
                className="w-2/3 py-3.5 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-50"
              >
                {loading ? 'Setting up...' : 'Complete Setup'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}