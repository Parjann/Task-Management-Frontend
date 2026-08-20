'use client';

import React, { useState } from 'react';
import { Tag, Check, Plus } from 'lucide-react';

export interface LabelOption {
  id: string;
  name: string;
  color: string;
}

interface LabelPickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  labels: LabelOption[];
  selectedLabelIds: string[];
  onToggleLabel: (label: LabelOption) => void;
  onCreateLabel?: (name: string) => Promise<void> | void;
  isCreating?: boolean;
}

export function LabelPickerPopover({
  isOpen,
  onClose,
  labels,
  selectedLabelIds,
  onToggleLabel,
  onCreateLabel,
  isCreating = false,
}: LabelPickerPopoverProps) {
  const [newTag, setNewTag] = useState('');

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim() || !onCreateLabel) return;
    await onCreateLabel(newTag.trim());
    setNewTag('');
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute right-0 top-8 z-50 w-56 bg-white border border-[#E5E7EB] rounded-2xl p-2.5 shadow-xl animate-in fade-in zoom-in-95 duration-100 select-none">
        <p className="text-[11px] font-semibold text-[#9CA3AF] px-2 py-1 mb-1">
          Labels
        </p>

        <div className="space-y-0.5 max-h-48 overflow-y-auto">
          {labels.length === 0 && (
            <p className="px-2 py-2 text-[11px] text-[#9CA3AF]">
              No labels yet. Create one below.
            </p>
          )}
          {labels.map((item) => {
            const isSelected = selectedLabelIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggleLabel(item)}
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

        {onCreateLabel && (
          <form
            onSubmit={handleCreate}
            className="mt-2 pt-2 border-t border-[#F3F4F6] flex items-center gap-1.5"
          >
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New label"
              className="flex-1 px-2 py-1.5 rounded-lg border border-[#E5E7EB] text-xs focus:outline-none focus:border-[#7C3AED]"
            />
            <button
              type="submit"
              disabled={isCreating || !newTag.trim()}
              className="p-1.5 rounded-lg bg-[#18181B] text-white disabled:opacity-50"
              title="Create label"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </>
  );
}
