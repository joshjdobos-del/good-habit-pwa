'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface CommunityPost {
  id: string;
  userId: string;
  user: string;
  location: string;
  habit: string;
  day: number;
  totalDays: number;
  timeAgo: string;
  hasHighFived: boolean;
}

export default function CommunityPage() {
  const { signOut } = useAuth();
  const router = useRouter();

  // Current logged-in user profile info
  const currentUser = {
    firstName: 'Josh',
    city: 'Pasadena, CA',
  };

  const [isAnonymous, setIsAnonymous] = useState(false);

  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      userId: 'user_101',
      user: 'Alex R.',
      location: 'Pasadena, CA',
      habit: '30 Days of Morning Cold Plunge & Mobility',
      day: 19,
      totalDays: 30,
      timeAgo: '2 hours ago',
      hasHighFived: false,
    },
    {
      id: '2',
      userId: 'user_102',
      user: 'Elena M.',
      location: 'Los Angeles, CA',
      habit: '30 Days of Writing 500 Words Daily',
      day: 12,
      totalDays: 30,
      timeAgo: '4 hours ago',
      hasHighFived: false,
    },
    {
      id: '3',
      userId: 'user_103',
      user: 'Jordan K.',
      location: 'Glendale, CA',
      habit: '30 Days of No Sugar & Clean Eating',
      day: 28,
      totalDays: 30,
      timeAgo: '6 hours ago',
      hasHighFived: false,
    },
  ]);

  const handleHighFive = async (postId: string, recipientId: string) => {
    const targetPost = posts.find((p) => p.id === postId);
    const willBeHighFived = !targetPost?.hasHighFived;

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, hasHighFived: willBeHighFived }
          : post
      )
    );

    if (willBeHighFived) {
      try {
        await fetch('/api/highfive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientId,
            senderFirstName: currentUser.firstName,
            senderCity: currentUser.city,
            isAnonymous,
          }),
        });
      } catch (err) {
        console.error('Failed to dispatch high five push:', err);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans pb-24 sm:pb-12 selection:bg-emerald-500 selection:text-slate-900">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
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

          <button
            onClick={handleSignOut}
            className="text-slate-400 hover:text-slate-200 bg-slate-800 border border-slate-700 text-xs py-1.5 px-3 rounded-lg transition-colors font-semibold shrink-0"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-xl w-full mx-auto px-4 sm:px-6 pt-8 flex-1">
        {/* Header & Privacy Quick Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Local Feed
            </span>
            <h1 className="text-2xl font-black text-white leading-snug">
              See active 30-day challenges from people building or breaking a habit in your area.
            </h1>
          </div>

          <div className="flex bg-slate-800/80 border border-slate-700/80 rounded-xl p-1 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setIsAnonymous(false)}
              className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all ${
                !isAnonymous
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              First Name
            </button>
            <button
              onClick={() => setIsAnonymous(true)}
              className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all ${
                isAnonymous
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Anonymous
            </button>
          </div>
        </div>

        {/* Feed Posts */}
        <div className="space-y-4">
          {posts.map((post) => {
            const progressPercentage = Math.round((post.day / post.totalDays) * 100);

            return (
              <div
                key={post.id}
                className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm shadow-xl flex flex-col gap-4"
              >
                {/* User Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700/80 border border-slate-600 flex items-center justify-center font-extrabold text-sm text-slate-200">
                      {post.user
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        {post.user}
                      </h3>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        📍 {post.location} • {post.timeAgo}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Day {post.day} / {post.totalDays}
                  </span>
                </div>

                {/* Habit Title */}
                <div>
                  <h4 className="text-base font-extrabold text-white">
                    {post.habit}
                  </h4>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900/80 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                {/* Footer / High Five Action */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleHighFive(post.id, post.userId)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      post.hasHighFived
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    <span>🙌</span>
                    <span>
                      {post.hasHighFived ? 'High Fived!' : 'High Five'}
                    </span>
                  </button>

                  <span className="text-[11px] text-slate-500 font-medium">
                    Good Habit Daily Check-in
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
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