'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleLoginButton } from './google-login-button';
import { useGuestLoginMutation } from '../authApi';

export function LoginView() {
  const [guestLogin, { isLoading: isGuestLoading }] = useGuestLoginMutation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleGuestLogin = async () => {
    setErrorMsg(null);
    try {
      await guestLogin().unwrap();
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data: { message?: string } }).data.message ||
            'Failed to continue as guest'
          : err instanceof Error
          ? err.message
          : 'Failed to continue as guest';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-white dark:bg-neutral-950">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-8 h-8 rounded-lg bg-[#5B21B6] dark:bg-[#6D28D9] flex items-center justify-center shadow-sm">
          {/* Pyramid / Delta Logo */}
          <svg
            className="w-4 h-4 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 22h20L12 2z" fill="white" stroke="none" />
            <path d="M12 7L6 19h12L12 7z" fill="#5B21B6" stroke="none" />
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Pyramid
        </span>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-[420px] bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-sm">
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Let&apos;s get back on track
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            Enter your email below to login to your account.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs text-center">
            {errorMsg}
          </div>
        )}

        <div className="space-y-3">
          {/* Continue as Guest Button */}
          <button
            type="button"
            disabled={isGuestLoading}
            onClick={handleGuestLogin}
            className="w-full flex items-center justify-center py-3.5 px-4 rounded-full bg-[#18181B] hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-medium text-sm transition-all duration-200 shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGuestLoading ? (
              <div className="w-4 h-4 border-2 border-white dark:border-neutral-900 border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            <span>{isGuestLoading ? 'Creating session...' : 'Continue as Guest'}</span>
          </button>

          {/* Login with Google Button */}
          <GoogleLoginButton />
        </div>
      </div>

      {/* Footer Legal Terms */}
      <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center max-w-[320px] mt-7 leading-relaxed">
        By clicking continue, you agree to our{' '}
        <Link
          href="#"
          className="underline underline-offset-2 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href="#"
          className="underline underline-offset-2 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
