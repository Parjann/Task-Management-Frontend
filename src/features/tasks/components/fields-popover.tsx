'use client';

import React from 'react';
import { List, LayoutGrid, Check } from 'lucide-react';

export type ViewMode = 'list' | 'board';

export interface VisibleFields {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}

interface FieldsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  visibleFields: VisibleFields;
  onToggleField: (fieldKey: keyof VisibleFields) => void;
}

export function FieldsPopover({
  isOpen,
  onClose,
  viewMode,
  onViewModeChange,
  visibleFields,
  onToggleField,
}: FieldsPopoverProps) {
  if (!isOpen) return null;

  const fieldsList: { key: keyof VisibleFields; label: string }[] = [
    { key: 'priority', label: 'Priority' },
    { key: 'members', label: 'Members' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'labels', label: 'Labels' },
    { key: 'status', label: 'Status' },
    { key: 'reporter', label: 'Reporter' },
  ];

  return (
    <>
      {/* Invisible backdrop to dismiss on click outside */}
      <div className="fixed inset-0 z-30" onClick={onClose} />

      {/* Popover Container anchored under Fields button */}
      <div className="absolute right-0 top-11 z-40 w-56 bg-white border border-[#E5E7EB] rounded-2xl p-3 shadow-xl animate-in fade-in zoom-in-95 duration-100 select-none">
        {/* Top View Mode Switcher (List vs Board) */}
        <div className="bg-[#F3F4F6] rounded-xl p-1 flex items-center mb-3">
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('board')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'board'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Board</span>
          </button>
        </div>

        {/* Fields Toggle List */}
        <div className="space-y-1">
          {fieldsList.map(({ key, label }) => {
            const isChecked = visibleFields[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => onToggleField(key)}
                className="w-full flex items-center justify-between py-1.5 px-2 text-xs font-medium text-[#374151] hover:bg-[#F9FAFB] rounded-lg transition-colors text-left"
              >
                <span>{label}</span>

                {/* Custom Checkbox Pill */}
                <div
                  className={`w-4 h-4 rounded-sm flex items-center justify-center transition-all ${
                    isChecked
                      ? 'bg-[#18181B] text-white'
                      : 'bg-[#E5E7EB] border border-transparent'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
