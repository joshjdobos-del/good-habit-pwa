'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function PublicSharePage() {
  const params = useParams();
  const userId = params?.userId as string;

  const [habitTitle, setHabitTitle] = useState('30-Day Challenge');
  const [userName, setUserName] = useState('');
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchPublicProgress = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.habitTitle) setHabitTitle(data.habitTitle);
          if (data.completedDays) setCompletedDays(data.completedDays);
          if (data.firstName) {
            setUserName(`${data.firstName}'s`);
          } else {
            setUserName('User Progress');
          }
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching public progress:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProgress();
  }, [userId]);

  const progressPercentage = Math.round((completedDays.length / 30) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
        Loading public tracker...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-100 p-6">
        <h1 className="text-2xl font-bold mb-2">Challenge Not Found</h1>
        <p className="text-slate-400 text-sm mb-6">This accountability page doesn't exist or has been removed.</p>
        <a
          href="/"
          className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-all"
        >
          Create Your Own Challenge
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-900">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-5xl w-full mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-900 text-lg">
            H
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Habit<span className="text-emerald-400">Pulse</span>
          </span>
        </div>

        <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
          Read-Only View
        </span>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl w-full mx-auto px-6 py-10 flex-1 flex flex-col justify-center">
        {/* Card Header */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 block">
                {userName ? `${userName} Public Tracker` : 'Public Accountability Link'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {habitTitle}
              </h1>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-3xl font-black text-emerald-400">
                {completedDays.length}
              </span>
              <span className="text-slate-400 text-lg font-bold"> / 30 Days</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400 mt-2 font-medium">
            <span>{progressPercentage}% Completed</span>
            <span>Live Syncing</span>
          </div>
        </div>

        {/* 30-Day Read-Only Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-3 sm:gap-4">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const isCompleted = completedDays.includes(day);
            return (
              <div
                key={day}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center font-bold text-sm sm:text-base border cursor-default transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-sm'
                    : 'bg-slate-800/20 border-slate-800/60 text-slate-600'
                }`}
              >
                <span className="text-[10px] uppercase opacity-60 font-semibold mb-0.5">Day</span>
                <span>{day}</span>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center bg-slate-800/30 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">Want to track your own 30-day goal?</h2>
          <p className="text-sm text-slate-400 mb-4">Start your own free challenge and share progress with your accountability partners.</p>
          <a
            href="/"
            className="inline-block px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/10"
          >
            Start Your Challenge
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/60 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} GoodHabit. Accountability made simple.
      </footer>
    </div>
  );
}