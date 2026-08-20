'use client';

import React from 'react';
import { Check, X, Filter, RotateCcw } from 'lucide-react';
import { TaskPriority, TaskStatus } from '../types';
import { PriorityBadge } from './priority-badge';

export interface FilterState {
  priorities: TaskPriority[];
  statuses: TaskStatus[];
  assignees: string[];
  quickPreset: 'all' | 'my_tasks' | 'high_priority' | 'due_soon' | null;
}

interface FilterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableAssignees?: { id: string; name: string; avatarUrl?: string | null }[];
}

export function FilterPopover({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  availableAssignees = [],
}: FilterPopoverProps) {
  if (!isOpen) return null;

  const hasActiveFilters =
    filters.priorities.length > 0 ||
    filters.statuses.length > 0 ||
    filters.assignees.length > 0 ||
    (filters.quickPreset && filters.quickPreset !== 'all');

  const handleReset = () => {
    onFilterChange({
      priorities: [],
      statuses: [],
      assignees: [],
      quickPreset: 'all',
    });
  };

  const handleTogglePriority = (p: TaskPriority) => {
    const exists = filters.priorities.includes(p);
    const updated = exists
      ? filters.priorities.filter((item) => item !== p)
      : [...filters.priorities, p];
    onFilterChange({ ...filters, priorities: updated, quickPreset: null });
  };

  const handleToggleStatus = (s: TaskStatus) => {
    const exists = filters.statuses.includes(s);
    const updated = exists
      ? filters.statuses.filter((item) => item !== s)
      : [...filters.statuses, s];
    onFilterChange({ ...filters, statuses: updated, quickPreset: null });
  };

  const handleToggleAssignee = (name: string) => {
    const exists = filters.assignees.includes(name);
    const updated = exists
      ? filters.assignees.filter((item) => item !== name)
      : [...filters.assignees, name];
    onFilterChange({ ...filters, assignees: updated, quickPreset: null });
  };

  const handleSetPreset = (preset: FilterState['quickPreset']) => {
    if (preset === 'my_tasks') {
      onFilterChange({
        priorities: [],
        statuses: [],
        assignees: [],
        quickPreset: 'my_tasks',
      });
    } else if (preset === 'high_priority') {
      onFilterChange({
        priorities: ['HIGH', 'URGENT'],
        statuses: [],
        assignees: [],
        quickPreset: 'high_priority',
      });
    } else {
      handleReset();
    }
  };

  const priorityOptions: TaskPriority[] = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];
  const statusOptions: { id: TaskStatus; label: string; dot: string }[] = [
    { id: 'TODO', label: 'To Do', dot: '#6B7280' },
    { id: 'IN_PROGRESS', label: 'Doing', dot: '#3B82F6' },
    { id: 'DONE', label: 'Completed', dot: '#10B981' },
    { id: 'BACKLOG', label: 'Backlog', dot: '#D97706' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute right-0 top-11 z-50 w-72 bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xl animate-in fade-in zoom-in-95 duration-100 select-none font-sans text-[#111827]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#111827]" />
            <span className="text-xs font-bold text-[#111827]">Filter</span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] font-semibold text-[#6B7280] hover:text-[#111827] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Quick Presets */}
        <div className="py-3 border-b border-[#F3F4F6]">
          <p className="text-[11px] font-semibold text-[#9CA3AF] mb-2">
            Quick Filters
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleSetPreset('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                !hasActiveFilters || filters.quickPreset === 'all'
                  ? 'bg-[#18181B] text-white'
                  : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => handleSetPreset('my_tasks')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                filters.quickPreset === 'my_tasks'
                  ? 'bg-[#18181B] text-white'
                  : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]'
              }`}
            >
              Assigned to me
            </button>
            <button
              type="button"
              onClick={() => handleSetPreset('high_priority')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                filters.quickPreset === 'high_priority'
                  ? 'bg-[#18181B] text-white'
                  : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]'
              }`}
            >
              High Priority
            </button>
          </div>
        </div>

        {/* Priority Filter */}
        <div className="py-3 border-b border-[#F3F4F6]">
          <p className="text-[11px] font-semibold text-[#9CA3AF] mb-2">
            Priority
          </p>
          <div className="grid grid-cols-2 gap-1">
            {priorityOptions.map((p) => {
              const isChecked = filters.priorities.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleTogglePriority(p)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    isChecked
                      ? 'bg-purple-50 text-[#111827] font-semibold'
                      : 'hover:bg-[#F9FAFB] text-[#4B5563]'
                  }`}
                >
                  <PriorityBadge priority={p} />
                  {isChecked && (
                    <Check className="w-3.5 h-3.5 text-[#111827] stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Filter */}
        <div className="py-3 border-b border-[#F3F4F6]">
          <p className="text-[11px] font-semibold text-[#9CA3AF] mb-2">
            Status
          </p>
          <div className="grid grid-cols-2 gap-1">
            {statusOptions.map((s) => {
              const isChecked = filters.statuses.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleToggleStatus(s.id)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    isChecked
                      ? 'bg-purple-50 text-[#111827] font-semibold'
                      : 'hover:bg-[#F9FAFB] text-[#4B5563]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: s.dot }}
                    />
                    <span>{s.label}</span>
                  </div>
                  {isChecked && (
                    <Check className="w-3.5 h-3.5 text-[#111827] stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Assignee / Lead Filter */}
        <div className="pt-3">
          <p className="text-[11px] font-semibold text-[#9CA3AF] mb-2">
            Assignee
          </p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {availableAssignees.map((mem) => {
              const isChecked = filters.assignees.includes(mem.name);
              return (
                <button
                  key={mem.id}
                  type="button"
                  onClick={() => handleToggleAssignee(mem.name)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    isChecked
                      ? 'bg-purple-50 text-[#111827] font-semibold'
                      : 'hover:bg-[#F9FAFB] text-[#4B5563]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {mem.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mem.avatarUrl}
                        alt={mem.name}
                        className="w-4 h-4 rounded-full object-cover ring-1 ring-[#E5E7EB]"
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-[#E5E7EB] text-[#4B5563] text-[9px] font-bold flex items-center justify-center">
                        {mem.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="truncate">{mem.name}</span>
                  </div>
                  {isChecked && (
                    <Check className="w-3.5 h-3.5 text-[#111827] stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
