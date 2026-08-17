'use client';

import React from 'react';
import { PanelLeft } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="h-12 bg-white border-b border-[#E5E7EB] flex items-center px-4 md:px-6">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
        title="Toggle Sidebar"
      >
        <PanelLeft className="w-4 h-4" />
      </button>
    </header>
  );
}
