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
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-white select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 mb-7">
        <div className="w-[30px] h-[30px] rounded-lg bg-[#7C3AED] flex items-center justify-center shadow-sm">
          {/* Stylized Pyramid Logo */}
          <svg
            className="w-4 h-4 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 22h20L12 2z" fill="white" stroke="none" />
            <path d="M12 7.5L6.5 19h11L12 7.5z" fill="#7C3AED" stroke="none" />
          </svg>
        </div>
        <span className="text-[20px] font-bold tracking-tight text-[#0F172A] font-sans">
          Pyramid
        </span>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-[430px] bg-white border border-[#E5E7EB] rounded-[28px] px-8 py-9 sm:px-10 sm:py-10 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="text-center mb-7">
          <h1 className="text-[24px] sm:text-[26px] font-bold tracking-tight text-[#111827]">
            Let&apos;s get back on track
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-1.5 leading-normal">
            Enter your email below to login to your account.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center">
            {errorMsg}
          </div>
        )}

        <div className="space-y-3">
          {/* Continue as Guest Button */}
          <button
            type="button"
            disabled={isGuestLoading}
            onClick={handleGuestLogin}
            className="w-full flex items-center justify-center py-3.5 px-6 rounded-full bg-[#18181B] hover:bg-[#09090B] text-white font-medium text-[14px] transition-all duration-150 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGuestLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            <span>
              {isGuestLoading ? 'Creating session...' : 'Continue as Guest'}
            </span>
          </button>

          {/* Login with Google Button */}
          <GoogleLoginButton />
        </div>
      </div>

      {/* Footer Legal Terms */}
      <p className="text-[12px] text-[#9CA3AF] text-center max-w-[290px] mt-6 leading-relaxed">
        By clicking continue, you agree to our{' '}
        <Link
          href="#"
          className="underline underline-offset-2 hover:text-[#4B5563] transition-colors"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href="#"
          className="underline underline-offset-2 hover:text-[#4B5563] transition-colors"
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
