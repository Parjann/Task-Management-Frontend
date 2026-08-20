'use client';

import React, { useState } from 'react';
import {
  Circle,
  Signal,
  Users,
  Calendar,
  Building,
  Tag,
  User,
  ChevronRight,
  Check,
} from 'lucide-react';
import { TaskPriority } from '@/features/tasks/types';
import { PriorityBadge } from '@/features/tasks/components/priority-badge';

interface ProjectFieldsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPriorityFilter?: TaskPriority | 'NONE' | 'ALL';
  onSelectPriorityFilter?: (p: TaskPriority | 'NONE' | 'ALL') => void;
}

export function ProjectFieldsMenu({
  isOpen,
  onClose,
  selectedPriorityFilter = 'URGENT',
  onSelectPriorityFilter,
}: ProjectFieldsMenuProps) {
  const [activeFlyout, setActiveFlyout] = useState<
    'status' | 'priority' | 'members' | 'dueDate' | 'teams' | 'labels' | 'reporter' | null
  >('priority'); // Defaults open as shown in screenshot 4

  if (!isOpen) return null;

  const priorityOptions: { value: TaskPriority | 'NONE'; label: string }[] = [
    { value: 'NONE', label: 'No Priority' },
    { value: 'URGENT', label: 'Urgent' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Main Container positioned under [ Fields ] button */}
      <div className="absolute left-0 top-11 z-50 flex items-start select-none font-sans">
        {/* Sub-Flyout (Shown on the left of the main menu as in Screenshot 4) */}
        {activeFlyout === 'priority' && (
          <div className="mr-2 w-44 bg-white border border-[#E5E7EB] rounded-2xl p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
            <p className="text-[11px] font-semibold text-[#9CA3AF] px-2.5 py-1 mb-1">
              Priority
            </p>
            <div className="space-y-0.5">
              {priorityOptions.map((opt) => {
                const isSelected = selectedPriorityFilter === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSelectPriorityFilter?.(opt.value);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-[#F9FAFB] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {opt.value === 'NONE' ? (
                        <span className="w-3.5 h-3.5 text-[#9CA3AF] text-center font-bold">
                          •
                        </span>
                      ) : (
                        <PriorityBadge priority={opt.value as TaskPriority} />
                      )}
                      {opt.value === 'NONE' && (
                        <span className="text-[#374151]">{opt.label}</span>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#111827] stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Primary Flyout Menu */}
        <div className="w-48 bg-white border border-[#E5E7EB] rounded-2xl p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100">
          <div className="space-y-0.5 text-xs">
            {/* Status */}
            <button
              type="button"
              onMouseEnter={() => setActiveFlyout('status')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                activeFlyout === 'status'
                  ? 'bg-[#F3F4F6] text-[#111827] font-semibold'
                  : 'text-[#374151] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Circle className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>Status</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>

            {/* Priority (Active) */}
            <button
              type="button"
              onMouseEnter={() => setActiveFlyout('priority')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                activeFlyout === 'priority'
                  ? 'bg-[#F3F4F6] text-[#111827] font-semibold'
                  : 'text-[#374151] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Signal className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>Priority</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>

            {/* Members */}
            <button
              type="button"
              onMouseEnter={() => setActiveFlyout('members')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                activeFlyout === 'members'
                  ? 'bg-[#F3F4F6] text-[#111827] font-semibold'
                  : 'text-[#374151] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>Members</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>

            {/* Due Date */}
            <button
              type="button"
              onMouseEnter={() => setActiveFlyout('dueDate')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                activeFlyout === 'dueDate'
                  ? 'bg-[#F3F4F6] text-[#111827] font-semibold'
                  : 'text-[#374151] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>Due Date</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>

            {/* Teams */}
            <button
              type="button"
              onMouseEnter={() => setActiveFlyout('teams')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                activeFlyout === 'teams'
                  ? 'bg-[#F3F4F6] text-[#111827] font-semibold'
                  : 'text-[#374151] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>Teams</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>

            {/* Labels */}
            <button
              type="button"
              onMouseEnter={() => setActiveFlyout('labels')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                activeFlyout === 'labels'
                  ? 'bg-[#F3F4F6] text-[#111827] font-semibold'
                  : 'text-[#374151] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>Labels</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>

            {/* Reporter */}
            <button
              type="button"
              onMouseEnter={() => setActiveFlyout('reporter')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                activeFlyout === 'reporter'
                  ? 'bg-[#F3F4F6] text-[#111827] font-semibold'
                  : 'text-[#374151] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>Reporter</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
