'use client';

import React, { useState } from 'react';
import { Tag, Check, Plus } from 'lucide-react';

interface LabelPickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLabels: string[];
  onToggleLabel: (label: string) => void;
}

const ALL_LABELS = [
  { name: 'Research', color: '#6B7280' },
  { name: 'Design', color: '#8B5CF6' },
  { name: 'Development', color: '#3B82F6' },
  { name: 'Testing', color: '#10B981' },
  { name: 'Deployment', color: '#EF4444' },
  { name: 'Bug', color: '#DC2626' },
  { name: 'UI', color: '#EC4899' },
];

export function LabelPickerPopover({
  isOpen,
  onClose,
  selectedLabels,
  onToggleLabel,
}: LabelPickerPopoverProps) {
  const [newTag, setNewTag] = useState('');

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute right-0 top-8 z-50 w-52 bg-white border border-[#E5E7EB] rounded-2xl p-2.5 shadow-xl animate-in fade-in zoom-in-95 duration-100 select-none">
        <p className="text-[11px] font-semibold text-[#9CA3AF] px-2 py-1 mb-1">
          Labels
        </p>

        <div className="space-y-0.5 max-h-48 overflow-y-auto">
          {ALL_LABELS.map((item) => {
            const isSelected = selectedLabels.includes(item.name);
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => onToggleLabel(item.name)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-[#F9FAFB] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Tag
                    className="w-3.5 h-3.5"
                    style={{ color: item.color }}
                  />
                  <span className="text-[#111827]">{item.name}</span>
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
