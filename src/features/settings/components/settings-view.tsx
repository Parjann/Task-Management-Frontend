'use client';

import React, { useState } from 'react';
import { SettingsSidebar, SettingsTab } from './settings-sidebar';
import { ProfileTab } from './profile-tab';
import { ThemeTab } from './theme-tab';
import { ColorTab } from './color-tab';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] font-sans overflow-x-hidden">
      {/* Settings Sidebar / Mobile Header */}
      <SettingsSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 lg:p-12 bg-[#FAFAFA] dark:bg-[#09090B] min-w-0">
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'theme' && <ThemeTab />}
        {activeTab === 'color' && <ColorTab />}
      </main>
    </div>
  );
}
