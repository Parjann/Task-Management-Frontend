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
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#E5E7EB] p-3 sm:p-4 flex flex-col font-sans select-none flex-shrink-0 md:h-screen">
      {/* Top Header Row on Mobile / Standard on Desktop */}
      <div className="flex items-center justify-between gap-3 md:block mb-3 md:mb-4">
        {/* Back to App Link */}
        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#374151] hover:text-[#111827] px-2.5 py-2 rounded-xl hover:bg-[#F3F4F6] transition-colors md:mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to app</span>
        </Link>

        {/* Search Input on Mobile (compact) & Desktop (full width) */}
        <div className="relative flex-1 max-w-[200px] md:max-w-none md:mb-3">
          <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#7C3AED] transition-colors"
          />
        </div>
      </div>

      {/* Navigation Menu: Horizontal tabs on Mobile, Vertical list on Desktop */}
      <div className="flex md:flex-col gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 md:w-full ${
                isActive
                  ? 'bg-[#F3F4F6] text-[#111827] font-semibold shadow-2xs'
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
