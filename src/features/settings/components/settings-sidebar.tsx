'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, User, Sun, Palette } from 'lucide-react';
import { useColorTheme } from '@/providers/color-theme-provider';

export type SettingsTab = 'profile' | 'theme' | 'color';

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function SettingsSidebar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
}: SettingsSidebarProps) {
  const { accentColor } = useColorTheme();

  const menuItems: { id: SettingsTab; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'theme', label: 'Theme', icon: Sun },
    { id: 'color', label: 'Color', icon: Palette },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );

  return (
    <aside className="w-64 h-screen bg-white border-r border-[#E5E7EB] p-4 flex flex-col font-sans select-none flex-shrink-0">
      {/* Back to App Link */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-xs font-semibold text-[#374151] hover:text-[#111827] px-2 py-2 rounded-xl hover:bg-[#F3F4F6] transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to app</span>
      </Link>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#7C3AED] transition-colors"
        />
      </div>

      {/* Navigation Menu */}
      <div className="space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[#F3F4F6] text-[#111827] font-semibold'
                  : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827]'
              }`}
            >
              {item.id === 'color' ? (
                <span
                  className="w-3.5 h-3.5 rounded-xs flex-shrink-0"
                  style={{ backgroundColor: accentColor }}
                />
              ) : (
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#111827]' : 'text-[#6B7280]'
                  }`}
                />
              )}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
