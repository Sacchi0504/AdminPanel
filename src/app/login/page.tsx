'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, User as UserIcon, Eye, EyeOff, Loader2, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ username?: string; password?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // If already authenticated, redirect to /products
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const from = searchParams.get('from') || '/products';
      router.replace(from);
    }
  }, [isAuthenticated, authLoading, router, searchParams]);

  // Fill default demo credentials from PRD
  const handleQuickFill = () => {
    setUsername('emilys');
    setPassword('emilyspass');
    setFormErrors({});
    setApiError(null);
  };

  const validate = (): boolean => {
    const errors: { username?: string; password?: string } = {};
    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions if already submitting
    if (isSubmitting) return;

    setApiError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ username, password });
      const from = searchParams.get('from') || '/products';
      router.push(from);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials. Please verify your username and password.';
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 mb-4 shadow-lg shadow-teal-500/5">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
        <p className="text-sm text-slate-400 mt-1">Sign in to manage product catalog and inventory</p>
      </div>

      {/* Main Card */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Quick Fill Demo Banner */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between text-xs">
          <div className="text-slate-300">
            <span className="font-semibold text-teal-400">Demo Account:</span> emilys / emilyspass
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Auto-fill
          </button>
        </div>

        {/* API Error Alert */}
        {apiError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 animate-fade-in"
          >
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-snug">{apiError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Username Field */}
          <div>
            <label htmlFor="username-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                id="username-input"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (formErrors.username) setFormErrors((prev) => ({ ...prev, username: undefined }));
                }}
                disabled={isSubmitting}
                placeholder="Enter username"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/70 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                  formErrors.username
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-slate-700 focus:border-teal-500 focus:ring-teal-500/20'
                } disabled:opacity-50`}
              />
            </div>
            {formErrors.username && (
              <p className="mt-1.5 text-xs text-rose-400 font-medium">{formErrors.username}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password-input"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formErrors.password) setFormErrors((prev) => ({ ...prev, password: undefined }));
                }}
                disabled={isSubmitting}
                placeholder="Enter password"
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-900/70 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                  formErrors.password
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-slate-700 focus:border-teal-500 focus:ring-teal-500/20'
                } disabled:opacity-50`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formErrors.password && (
              <p className="mt-1.5 text-xs text-rose-400 font-medium">{formErrors.password}</p>
            )}
          </div>

          {/* Submit Button (Duplicate submission protected) */}
          <button
            type="submit"
            id="login-submit-button"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-teal-500/30"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-slate-500 mt-6">
        Protected Admin Access &bull; Powered by DummyJSON API
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-teal-500" />
            Loading login...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
