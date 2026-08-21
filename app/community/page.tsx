'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface CommunityPost {
  id: string;
  userName: string;
  userAvatar?: string;
  location: string;
  habitTitle: string;
  currentDay: number;
  totalDays: number;
  note: string;
  timestamp: string;
  highFives: number;
  hasHighFived?: boolean;
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: '1',
    userName: 'Alex R.',
    location: 'Pasadena, CA',
    habitTitle: '30 Days of Morning Cold Plunge & Mobility',
    currentDay: 19,
    totalDays: 30,
    note: 'Day 19 complete! Shoulders feel 10x better already. Consistency over intensity every single morning.',
    timestamp: '2 hours ago',
    highFives: 14,
    hasHighFived: false,
  },
  {
    id: '2',
    userName: 'Elena M.',
    location: 'Los Angeles, CA',
    habitTitle: '30 Days of Writing 500 Words Daily',
    currentDay: 12,
    totalDays: 30,
    note: 'Drafted scene 4 of the new script today before starting work. Staying accountable on Good Habit!',
    timestamp: '4 hours ago',
    highFives: 22,
    hasHighFived: false,
  },
  {
    id: '3',
    userName: 'Jordan K.',
    location: 'Glendale, CA',
    habitTitle: '30 Days of No Sugar & Clean Eating',
    currentDay: 28,
    totalDays: 30,
    note: 'Almost at the finish line! Day 28 done. Energy levels have stabilized completely.',
    timestamp: '6 hours ago',
    highFives: 31,
    hasHighFived: false,
  },
];

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'local'>('all');

  const handleHighFive = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const hasHighFived = !post.hasHighFived;
          return {
            ...post,
            hasHighFived,
            highFives: hasHighFived ? post.highFives + 1 : post.highFives - 1,
          };
        }
        return post;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans pb-24 sm:pb-12 selection:bg-emerald-500 selection:text-slate-900">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header Navigation */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-800/80">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <img
            src="/icon-192.png"
            alt="Good Habit Logo"
            className="w-8 h-8 rounded-lg object-cover"
          />
          <span className="text-xl font-extrabold tracking-tight text-white">
            Good<span className="text-emerald-400">Habit</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-xs font-semibold">
          <Link
            href="/dashboard"
            className="text-slate-400 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/community"
            className="text-emerald-400 font-bold border-b-2 border-emerald-400 pb-0.5"
          >
            Community
          </Link>
        </nav>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-3xl w-full mx-auto px-6 pt-8 flex-1">
        {/* Page Banner Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <span>📍</span> City Feed
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Local Builders & Creators
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            See active 30-day challenges from people completing habits in your area.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`text-xs font-bold py-1.5 px-3.5 rounded-lg transition-colors ${
                activeFilter === 'all'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              All Activity
            </button>
            <button
              onClick={() => setActiveFilter('local')}
              className={`text-xs font-bold py-1.5 px-3.5 rounded-lg transition-colors ${
                activeFilter === 'local'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              Nearby Only
            </button>
          </div>

          <span className="text-xs text-slate-500">
            {posts.length} Active Feeds
          </span>
        </div>

        {/* Community Posts Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-lg hover:border-slate-700/80 transition-all"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                    {post.userName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {post.userName}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      📍 {post.location} • {post.timestamp}
                    </p>
                  </div>
                </div>

                {/* Day Badge */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-xs px-2.5 py-1 rounded-lg shrink-0">
                  Day {post.currentDay} / {post.totalDays}
                </div>
              </div>

              {/* Habit Title */}
              <h4 className="text-sm font-semibold text-slate-200 mb-2">
                {post.habitTitle}
              </h4>

              {/* Note / Check-in content */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800/60 mb-4">
                "{post.note}"
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-slate-900/80 h-2 rounded-full overflow-hidden mb-4 border border-slate-800">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
                  style={{
                    width: `${(post.currentDay / post.totalDays) * 100}%`,
                  }}
                />
              </div>

              {/* Interaction Bar */}
              <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
                <button
                  onClick={() => handleHighFive(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg transition-all ${
                    post.hasHighFived
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 hover:bg-slate-700/80 text-slate-300'
                  }`}
                >
                  <span>🙌</span>
                  <span>High Five</span>
                  <span className="text-[10px] opacity-75 font-mono ml-0.5">
                    ({post.highFives})
                  </span>
                </button>

                <span className="text-[11px] text-slate-500">
                  Good Habit Daily Check-in
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (PWA Standard) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 border-t border-slate-800 backdrop-blur-md py-2.5 px-6 flex items-center justify-around">
        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
        >
          <span className="text-lg">📊</span>
          <span className="text-[10px] font-bold">Dashboard</span>
        </Link>
        <Link
          href="/community"
          className="flex flex-col items-center gap-1 text-emerald-400 font-bold"
        >
          <span className="text-lg">📍</span>
          <span className="text-[10px]">Community</span>
        </Link>
      </nav>
    </div>
  );
}