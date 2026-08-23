'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.username ||
      !formData.password
    ) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      // Pass auth credentials & custom profile metadata
      if (signUp) {
        await signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              username: formData.username,
            },
          },
        });
      }

      // Store display details locally for quick frontend access
      localStorage.setItem('goodhabit_user_firstname', formData.firstName);
      localStorage.setItem('goodhabit_user_username', formData.username);

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-slate-900">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Header Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
            <img
              src="/icon-192.png"
              alt="Good Habit Logo"
              className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-emerald-500/20"
            />
            <span className="text-2xl font-black tracking-tight text-white">
              Good<span className="text-emerald-400">Habit</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-white mt-1">Create Your Account</h1>
          <p className="text-xs text-slate-400 mt-1">
            Start your 30-day challenge & stay accountable
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* First & Last Name Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Alex"
                  required
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Morgan"
                  required
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@example.com"
                required
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-bold">@</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="alex_habits"
                  required
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account & Start'}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-xs text-slate-400 mt-6">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-emerald-400 font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}