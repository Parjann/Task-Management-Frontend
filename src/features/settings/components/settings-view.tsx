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
    <div className="flex w-full min-h-screen bg-[#FAFAFA] font-sans overflow-hidden">
      {/* Settings Left Sidebar */}
      <SettingsSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 md:p-12">
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'theme' && <ThemeTab />}
        {activeTab === 'color' && <ColorTab />}
      </main>
    </div>
  );
}
