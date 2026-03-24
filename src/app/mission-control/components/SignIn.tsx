'use client';

import React, { useState } from 'react';
import { useAuth } from '../lib/auth-context';

export default function SignIn() {
  const { login, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    try {
      await login(email, password);
    } catch {
      // Error handled in context
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060a12] relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4 shadow-lg shadow-blue-500/20">
            <span className="text-2xl">&#x1F52D;</span>
          </div>
          <h1
            className="text-2xl font-bold tracking-[0.2em] text-cyan-400"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            MISSION CONTROL
          </h1>
          <p className="text-slate-500 text-sm mt-2">The Clarion Agency &mdash; Authorised Access Only</p>
        </div>

        {/* Sign In Card */}
        <div className="bg-[#111827] border border-[#2a3550] rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-[#0a0e17] border border-[#2a3550] rounded-lg text-slate-200 placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-[#0a0e17] border border-[#2a3550] rounded-lg text-slate-200 placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
              />
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold rounded-lg transition-all text-sm tracking-wide"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#2a3550]">
            <p className="text-xs text-slate-600 text-center leading-relaxed">
              This system is invite-only. No registration is available.
              <br />
              If you need access, contact the administrator.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p
            className="text-[10px] text-slate-600 tracking-wider"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            THE CLARION AGENCY &bull; EST. 2026 &bull; A CLEAR SIGNAL IN THE NOISE
          </p>
        </div>
      </div>
    </div>
  );
}
