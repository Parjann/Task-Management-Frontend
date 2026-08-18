'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutGrid,
  FolderKanban,
  ChevronDown,
  ChevronsUpDown,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useGetProfileQuery } from '@/features/auth';
import { UserDropdown } from './user-dropdown';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !!user,
  });

  const currentUser = user || profile;
  const displayName = currentUser?.name || 'Dexter';
  const displayAvatar = currentUser?.avatarUrl;

  const navItems = [
    {
      name: 'Tasks',
      href: '/dashboard',
      icon: LayoutGrid,
      isActive: pathname === '/dashboard' || pathname.startsWith('/tasks'),
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: FolderKanban,
      isActive: pathname.startsWith('/projects'),
    },
  ];

  return (
    <aside
      className={`fixed lg:static top-0 left-0 z-40 h-screen w-64 bg-white border-r border-[#E5E7EB] flex flex-col transition-transform duration-200 ease-in-out font-sans ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* User / Workspace Dropdown Header */}
      <div className="p-4 border-b border-transparent relative">
        <button
          type="button"
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#F3F4F6] transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            {displayAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#E5E7EB]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#EC4899] flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-[14px] font-semibold text-[#111827] truncate">
              {displayName}
            </span>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#4B5563] flex-shrink-0" />
        </button>

        {/* User Dropdown Menu with Theme and Color submenus */}
        <UserDropdown
          isOpen={isUserMenuOpen}
          onClose={() => setIsUserMenuOpen(false)}
          user={{
            name: displayName,
            email: currentUser?.email || 'Dexter@gmail.com',
            avatarUrl: displayAvatar,
          }}
        />
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-2 space-y-4 overflow-y-auto">
        <div>
          {/* Workspace Section Header */}
          <button
            type="button"
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <span>Workspace</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#9CA3AF] transition-transform duration-200 ${
                isWorkspaceOpen ? 'rotate-0' : '-rotate-90'
              }`}
            />
          </button>

          {/* Navigation Items */}
          {isWorkspaceOpen && (
            <div className="mt-1 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] transition-colors ${
                      item.isActive
                        ? 'bg-[#F3F4F6] text-[#111827] font-semibold'
                        : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827] font-medium'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        item.isActive ? 'text-[#111827]' : 'text-[#6B7280]'
                      }`}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
