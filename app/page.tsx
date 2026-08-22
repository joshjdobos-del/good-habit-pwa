'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LandingPage() {
  // 1. Remove signInWithGoogle from the destructuring
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      // 2. Simply route the user to your existing signup/onboarding flow
      router.push('/onboarding'); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-900">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <img
            src="/icon-192.png"
            alt="Good Habit Logo"
            className="w-8 h-8 rounded-lg object-cover"
          />
          <span className="text-xl font-extrabold tracking-tight text-white">
            Good<span className="text-emerald-400">Habit</span>
          </span>
        </div>

        <div>
          {user ? (
            <Link
              href="/dashboard"
              className="text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all py-2.5 px-4 rounded-lg font-bold"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors py-2 px-3.5 rounded-lg inline-block"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-6 pt-16 pb-20 flex-1 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          The Challenge Engine, Build or Break a Habit in 30 Days
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-3xl mb-6">
          Build consistency with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">focused 30-day</span> habits.
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mb-8 leading-relaxed">
          No complex streak math or overwhelming features. Just pick one core habit to build or break, see your progress every day, and build lasting momentum.
        </p>

        {/* Hero CTA */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md mb-16">
          <button
            onClick={handleGetStarted}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-sm flex items-center justify-center gap-2 group"
          >
            {user ? 'Open Your Dashboard' : 'Start Your 30-Day Challenge'}
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        </div>

        {/* Interactive Preview Mockup */}
        <div className="w-full max-w-3xl bg-slate-800/40 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-2xl text-left">
          <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Active Challenge Preview
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                30 Days of No Doomscrolling
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-emerald-400">18</span>
              <span className="text-slate-400 text-sm font-semibold"> / 30 Days</span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {Array.from({ length: 18 }, (_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-emerald-500 border border-emerald-400 text-slate-950 font-bold text-xs flex flex-col items-center justify-center"
              >
                <span className="text-[9px] opacity-60">DAY</span>
                <span>{i + 1}</span>
              </div>
            ))}
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i + 18}
                className="aspect-square rounded-lg bg-slate-800/60 border border-slate-800 text-slate-500 text-xs flex flex-col items-center justify-center"
              >
                <span className="text-[9px] opacity-40">DAY</span>
                <span>{i + 19}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-3 gap-6 w-full max-w-4xl mt-20 text-left">
          <div className="bg-slate-800/30 border border-slate-800/80 rounded-xl p-5">
            <div className="text-2xl mb-2">🗨️</div>
            <h3 className="font-bold text-white text-base mb-1">Easy Accountability</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A private link available for you to share with a trusted person in your life so they can view your progress in real time.
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-800/80 rounded-xl p-5">
            <div className="text-2xl mb-2">🔔</div>
            <h3 className="font-bold text-white text-base mb-1">Smart Reminders</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated 8:00 AM and 8:00 PM checks keep you accountable without spamming you.
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-800/80 rounded-xl p-5">
            <div className="text-2xl mb-2">📍</div>
            <h3 className="font-bold text-white text-base mb-1">City Feed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              View what habits others around you are trying to build or break in your city. Stay motivated and know you're not alone.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Good Habit • Built for 30-day consistency.
      </footer>
    </div>
  );
}