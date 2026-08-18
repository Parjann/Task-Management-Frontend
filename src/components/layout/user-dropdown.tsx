'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Sun,
  Moon,
  ChevronRight,
  Settings,
  Check,
  LogOut,
} from 'lucide-react';
import { useColorTheme, ColorMode } from '@/providers/color-theme-provider';
import { useLogoutUserMutation } from '@/features/auth';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    name?: string;
    email?: string;
    avatarUrl?: string | null;
  } | null;
}

export function UserDropdown({ isOpen, onClose, user }: UserDropdownProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { colorMode, setColorMode, accentColor } = useColorTheme();
  const [logoutUser] = useLogoutUserMutation();

  // Submenu state: 'theme' | 'color' | null
  const [activeSubmenu, setActiveSubmenu] = useState<'theme' | 'color' | null>(
    null,
  );

  if (!isOpen) return null;

  const displayName = user?.name || 'Dexter';
  const displayEmail = user?.email || 'Dexter@gmail.com';
  const displayAvatar =
    user?.avatarUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face';

  const colorOptions: { id: ColorMode; label: string; swatchBg: string }[] = [
    { id: 'amber', label: 'Amber', swatchBg: '#F59E0B' },
    { id: 'blue', label: 'Blue', swatchBg: '#7C3AED' },
    { id: 'pink', label: 'Pink', swatchBg: '#EC4899' },
    { id: 'rose', label: 'Rose', swatchBg: '#F43F5E' },
    { id: 'emerald', label: 'Emerald', swatchBg: '#10B981' },
    { id: 'black', label: 'Black', swatchBg: '#18181B' },
  ];

  const handleLogout = async () => {
    onClose();
    await logoutUser().unwrap();
    router.push('/login');
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => {
          setActiveSubmenu(null);
          onClose();
        }}
      />

      <div className="absolute top-16 left-3 z-50 w-52 bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xl animate-in fade-in zoom-in-95 duration-100 select-none">
        {/* User Card Header matching Figma */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-[#F3F4F6]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayAvatar}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100 mb-2"
          />
          <h4 className="text-xs font-bold text-[#111827]">{displayName}</h4>
          <p className="text-[11px] text-[#9CA3AF] truncate max-w-full">
            {displayEmail}
          </p>
        </div>

        {/* Menu Items */}
        <div className="pt-2 space-y-1 relative">
          {/* 1. Change Theme with Flyout */}
          <div
            className="relative"
            onMouseEnter={() => setActiveSubmenu('theme')}
          >
            <button
              type="button"
              onClick={() =>
                setActiveSubmenu(activeSubmenu === 'theme' ? null : 'theme')
              }
              className="w-full flex items-center justify-between px-2 py-2 rounded-xl text-xs font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-[#6B7280]" />
                <span>Change Theme</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>

            {/* Theme Flyout Submenu (Screenshot 1) */}
            {activeSubmenu === 'theme' && (
              <div className="absolute left-[calc(100%+8px)] top-0 z-50 w-36 bg-white border border-[#E5E7EB] rounded-2xl p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                <p className="text-[11px] font-semibold text-[#9CA3AF] px-2 py-1 mb-1">
                  Theme
                </p>
                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-[#F9FAFB] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-3.5 h-3.5 text-[#6B7280]" />
                      <span className="text-[#111827]">Light</span>
                    </div>
                    {theme === 'light' && (
                      <Check className="w-3.5 h-3.5 text-[#111827] stroke-[2.5]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-[#F9FAFB] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-3.5 h-3.5 text-[#6B7280]" />
                      <span className="text-[#111827]">Dark</span>
                    </div>
                    {theme === 'dark' && (
                      <Check className="w-3.5 h-3.5 text-[#111827] stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Color Mode with Flyout (Screenshot 3) */}
          <div
            className="relative"
            onMouseEnter={() => setActiveSubmenu('color')}
          >
            <button
              type="button"
              onClick={() =>
                setActiveSubmenu(activeSubmenu === 'color' ? null : 'color')
              }
              className="w-full flex items-center justify-between px-2 py-2 rounded-xl text-xs font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-4 h-4 rounded-md flex-shrink-0 transition-colors"
                  style={{ backgroundColor: accentColor }}
                />
                <span>Color Mode</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>

            {/* Color Mode Flyout Submenu */}
            {activeSubmenu === 'color' && (
              <div className="absolute left-[calc(100%+8px)] top-0 z-50 w-36 bg-white border border-[#E5E7EB] rounded-2xl p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                <p className="text-[11px] font-semibold text-[#9CA3AF] px-2 py-1 mb-1">
                  Color Mode
                </p>
                <div className="space-y-0.5">
                  {colorOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setColorMode(opt.id)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-[#F9FAFB] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-xs"
                          style={{ backgroundColor: opt.swatchBg }}
                        />
                        <span className="text-[#111827]">{opt.label}</span>
                      </div>
                      {colorMode === opt.id && (
                        <Check className="w-3.5 h-3.5 text-[#111827] stroke-[2.5]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Settings */}
          <button
            type="button"
            onClick={() => {
              onClose();
              router.push('/dashboard');
            }}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl text-xs font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
          >
            <Settings className="w-4 h-4 text-[#6B7280]" />
            <span>Settings</span>
          </button>

          {/* 4. Sign Out */}
          <div className="pt-1 border-t border-[#F3F4F6]">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
