'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { useLogoutUserMutation, useGetProfileQuery } from '@/features/auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !!user,
  });
  const [logoutUser] = useLogoutUserMutation();
  const router = useRouter();

  const currentUser = user || profile;

  const handleLogout = async () => {
    await logoutUser().unwrap();
    router.push('/login');
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Welcome back, {currentUser?.name || 'User'} 👋
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {currentUser?.isGuest
              ? 'You are currently logged in as a Guest.'
              : `Logged in as ${currentUser?.email}`}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="self-start md:self-auto px-4 py-2 text-sm font-medium rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Dashboard Grid Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="p-6 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
          <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Active Projects
          </div>
          <div className="text-3xl font-bold text-neutral-900 dark:text-white mt-2">
            0
          </div>
          <p className="text-xs text-neutral-400 mt-2">
            Ready to design according to Figma
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
          <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Tasks in Progress
          </div>
          <div className="text-3xl font-bold text-neutral-900 dark:text-white mt-2">
            0
          </div>
          <p className="text-xs text-neutral-400 mt-2">Kanban board ready</p>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
          <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Completed Tasks
          </div>
          <div className="text-3xl font-bold text-neutral-900 dark:text-white mt-2">
            0
          </div>
          <p className="text-xs text-neutral-400 mt-2">Activity timeline ready</p>
        </div>
      </div>
    </div>
  );
}
