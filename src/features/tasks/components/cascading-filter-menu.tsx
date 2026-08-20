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
import { TaskPriority, TaskStatus } from '../types';
import { PriorityBadge } from './priority-badge';

export interface CascadingFilterState {
  priority: TaskPriority | 'NONE' | 'ALL';
  status: TaskStatus | 'ALL';
  member: string | 'ALL';
  label: string | 'ALL';
}

interface CascadingFilterMenuProps {
  isOpen: boolean;
  onClose: () => void;
  filters: CascadingFilterState;
  onFilterChange: (filters: CascadingFilterState) => void;
  availableMembers?: { id: string; name: string }[];
  availableLabels?: string[];
}

export function CascadingFilterMenu({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  availableMembers = [],
  availableLabels = [],
}: CascadingFilterMenuProps) {
  const [activeFlyout, setActiveFlyout] = useState<
    'status' | 'priority' | 'members' | 'dueDate' | 'teams' | 'labels' | 'reporter' | null
  >('priority'); // Defaults to priority as shown in Figma screenshot

  if (!isOpen) return null;

  const priorityOptions: { value: TaskPriority | 'NONE'; label: string }[] = [
    { value: 'NONE', label: 'No Priority' },
    { value: 'URGENT', label: 'Urgent' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
  ];

  const statusOptions: { value: TaskStatus | 'ALL'; label: string; dot: string }[] = [
    { value: 'ALL', label: 'All Statuses', dot: '#9CA3AF' },
    { value: 'TODO', label: 'To Do', dot: '#6B7280' },
    { value: 'IN_PROGRESS', label: 'Doing', dot: '#3B82F6' },
    { value: 'DONE', label: 'Completed', dot: '#10B981' },
    { value: 'BACKLOG', label: 'Backlog', dot: '#D97706' },
  ];

  const labelOptions = availableLabels;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Main Cascading Filter Container positioned under [ ⎚ ] Filter button */}
      <div className="absolute right-0 top-11 z-50 flex items-start select-none font-sans">
        {/* Left Sub-Flyout Menu matching Figma screenshot */}
        {activeFlyout === 'priority' && (
          <div className="mr-2 w-44 bg-white border border-[#E5E7EB] rounded-2xl p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
            <p className="text-[11px] font-semibold text-[#9CA3AF] px-2.5 py-1 mb-1">
              Priority
            </p>
            <div className="space-y-0.5">
              {priorityOptions.map((opt) => {
                const isSelected = filters.priority === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onFilterChange({
                        ...filters,
                        priority: isSelected ? 'ALL' : opt.value,
                      });
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

        {/* Sub-Flyout: Status */}
        {activeFlyout === 'status' && (
          <div className="mr-2 w-44 bg-white border border-[#E5E7EB] rounded-2xl p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
            <p className="text-[11px] font-semibold text-[#9CA3AF] px-2.5 py-1 mb-1">
              Status
            </p>
            <div className="space-y-0.5">
              {statusOptions.map((opt) => {
                const isSelected = filters.status === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onFilterChange({
                        ...filters,
                        status: isSelected ? 'ALL' : opt.value,
                      });
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-[#F9FAFB] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: opt.dot }}
                      />
                      <span className="text-[#111827]">{opt.label}</span>
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

        {/* Sub-Flyout: Members */}
        {activeFlyout === 'members' && (
          <div className="mr-2 w-44 bg-white border border-[#E5E7EB] rounded-2xl p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
            <p className="text-[11px] font-semibold text-[#9CA3AF] px-2.5 py-1 mb-1">
              Members
            </p>
            <div className="space-y-0.5">
              {availableMembers.length === 0 && (
                <p className="px-2.5 py-2 text-[11px] text-[#9CA3AF]">
                  No members on tasks yet.
                </p>
              )}
              {availableMembers.map((mem) => {
                const isSelected = filters.member === mem.name;
                return (
                  <button
                    key={mem.id}
                    type="button"
                    onClick={() => {
                      onFilterChange({
                        ...filters,
                        member: isSelected ? 'ALL' : mem.name,
                      });
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-[#F9FAFB] transition-colors"
                  >
                    <span className="text-[#111827] truncate">{mem.name}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#111827] stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sub-Flyout: Labels */}
        {activeFlyout === 'labels' && (
          <div className="mr-2 w-44 bg-white border border-[#E5E7EB] rounded-2xl p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
            <p className="text-[11px] font-semibold text-[#9CA3AF] px-2.5 py-1 mb-1">
              Labels
            </p>
            <div className="space-y-0.5">
              {labelOptions.length === 0 && (
                <p className="px-2.5 py-2 text-[11px] text-[#9CA3AF]">
                  No labels on tasks yet.
                </p>
              )}
              {labelOptions.map((lbl) => {
                const isSelected = filters.label === lbl;
                return (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => {
                      onFilterChange({
                        ...filters,
                        label: isSelected ? 'ALL' : lbl,
                      });
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-[#F9FAFB] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="w-3 h-3 text-[#6B7280]" />
                      <span className="text-[#111827]">{lbl}</span>
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

        {/* Primary Filter Menu matching Screenshot */}
        <div className="w-48 bg-white border border-[#E5E7EB] rounded-2xl p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100">
          <div className="space-y-0.5 text-xs">
            {/* 1. Status */}
            <button
              type="button"
              onMouseEnter={() => setActiveFlyout('status')}
              onClick={() => setActiveFlyout('status')}
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

            {/* 2. Priority */}
            <button
              type="button"
              onMouseEnter={() => setActiveFlyout('priority')}
              onClick={() => setActiveFlyout('priority')}
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

            {/* 3. Members */}
            <button
              type="button"
              onMouseEnter={() => setActiveFlyout('members')}
              onClick={() => setActiveFlyout('members')}
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

            {/* 4. Due Date */}
            <button
              type="button"
              onMouseEnter={() => setActiveFlyout('dueDate')}
              onClick={() => setActiveFlyout('dueDate')}
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

            {/* 5. Teams */}
            <button
              type="button"
              onMouseEnter={() => setActiveFlyout('teams')}
              onClick={() => setActiveFlyout('teams')}
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

            {/* 6. Labels */}
            <button
              type="button"
              onMouseEnter={() => setActiveFlyout('labels')}
              onClick={() => setActiveFlyout('labels')}
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

            {/* 7. Reporter */}
            <button
              type="button"
              onMouseEnter={() => setActiveFlyout('reporter')}
              onClick={() => setActiveFlyout('reporter')}
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
