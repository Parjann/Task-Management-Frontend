'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Check } from 'lucide-react';
import { useUpdateProfileMutation } from '@/features/auth';

export function ThemeTab() {
  const { theme, setTheme } = useTheme();
  const [updateProfile] = useUpdateProfileMutation();

  const applyTheme = (value: 'light' | 'dark') => {
    setTheme(value);
    void updateProfile({
      theme: value === 'dark' ? 'DARK' : 'LIGHT',
    });
  };

  return (
    <div className="max-w-3xl space-y-6 font-sans">
      <div>
        <h1 className="text-[26px] md:text-[28px] font-bold text-[#111827] tracking-tight">
          Theme
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Choose how Pyramid looks to you. Select a light or dark theme.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => applyTheme('light')}
          className={`bg-white border rounded-2xl p-5 cursor-pointer transition-all ${
            theme === 'light'
              ? 'border-[#18181B] ring-2 ring-[#18181B]/10 shadow-md'
              : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#6B7280]" />
              <h3 className="text-sm font-bold text-[#111827]">Light</h3>
            </div>
            {theme === 'light' && (
              <span className="w-5 h-5 rounded-full bg-[#18181B] text-white flex items-center justify-center text-xs">
                <Check className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
          <div className="h-24 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-2.5 flex flex-col gap-1.5">
            <div className="h-2 w-16 bg-[#E5E7EB] rounded-full" />
            <div className="h-10 bg-white border border-[#E5E7EB] rounded-lg p-1.5 flex gap-2">
              <div className="w-6 h-6 rounded-full bg-[#E5E7EB]" />
              <div className="flex-1 space-y-1 py-1">
                <div className="h-1.5 w-20 bg-[#E5E7EB] rounded-full" />
                <div className="h-1.5 w-12 bg-[#F3F4F6] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div
          onClick={() => applyTheme('dark')}
          className={`bg-white border rounded-2xl p-5 cursor-pointer transition-all ${
            theme === 'dark'
              ? 'border-[#18181B] ring-2 ring-[#18181B]/10 shadow-md'
              : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-[#6B7280]" />
              <h3 className="text-sm font-bold text-[#111827]">Dark</h3>
            </div>
            {theme === 'dark' && (
              <span className="w-5 h-5 rounded-full bg-[#18181B] text-white flex items-center justify-center text-xs">
                <Check className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
          <div className="h-24 bg-[#18181B] border border-[#27272A] rounded-xl p-2.5 flex flex-col gap-1.5">
            <div className="h-2 w-16 bg-[#27272A] rounded-full" />
            <div className="h-10 bg-[#27272A] border border-[#3F3F46] rounded-lg p-1.5 flex gap-2">
              <div className="w-6 h-6 rounded-full bg-[#3F3F46]" />
              <div className="flex-1 space-y-1 py-1">
                <div className="h-1.5 w-20 bg-[#3F3F46] rounded-full" />
                <div className="h-1.5 w-12 bg-[#27272A] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
