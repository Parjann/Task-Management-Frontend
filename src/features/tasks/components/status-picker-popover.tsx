'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { TaskStatus } from '../types';

interface StatusPickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStatus: TaskStatus;
  onSelectStatus: (status: TaskStatus) => void;
}

export function StatusPickerPopover({
  isOpen,
  onClose,
  selectedStatus,
  onSelectStatus,
}: StatusPickerPopoverProps) {
  if (!isOpen) return null;

  const statusOptions: {
    value: TaskStatus;
    label: string;
    dotColor: string;
  }[] = [
    { value: 'BACKLOG', label: 'Backlog', dotColor: '#D97706' },
    { value: 'TODO', label: 'To Do', dotColor: '#6B7280' },
    { value: 'IN_PROGRESS', label: 'Doing', dotColor: '#3B82F6' },
    { value: 'IN_REVIEW', label: 'In Review', dotColor: '#8B5CF6' },
    { value: 'DONE', label: 'Completed', dotColor: '#10B981' },
    { value: 'CANCELED', label: 'Canceled', dotColor: '#EF4444' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute right-0 top-8 z-50 w-44 bg-white border border-[#E5E7EB] rounded-2xl p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100 select-none">
        <p className="text-[11px] font-semibold text-[#9CA3AF] px-2.5 py-1 mb-1">
          Status
        </p>
        <div className="space-y-0.5">
          {statusOptions.map((opt) => {
            const isSelected = opt.value === selectedStatus;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onSelectStatus(opt.value);
                  onClose();
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-[#F9FAFB] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: opt.dotColor }}
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
    </>
  );
}
