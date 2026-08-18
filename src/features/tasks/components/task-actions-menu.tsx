'use client';

import React from 'react';
import { Copy, CheckCircle, CopyPlus, Trash2 } from 'lucide-react';

interface TaskActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onCopyLink?: () => void;
  onDuplicate?: () => void;
  onToggleComplete?: () => void;
  onDelete?: () => void;
  align?: 'left' | 'right';
}

export function TaskActionsMenu({
  isOpen,
  onClose,
  onCopyLink,
  onDuplicate,
  onToggleComplete,
  onDelete,
  align = 'right',
}: TaskActionsMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-8 z-50 w-44 bg-white border border-[#E5E7EB] rounded-2xl p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100 select-none ${
          align === 'right' ? 'right-0' : 'left-0'
        }`}
      >
        <button
          type="button"
          onClick={() => {
            onCopyLink?.();
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
        >
          <Copy className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <span>Copy Link</span>
        </button>

        {onToggleComplete && (
          <button
            type="button"
            onClick={() => {
              onToggleComplete();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Mark Complete</span>
          </button>
        )}

        {onDuplicate && (
          <button
            type="button"
            onClick={() => {
              onDuplicate();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
          >
            <CopyPlus className="w-3.5 h-3.5 text-[#9CA3AF]" />
            <span>Duplicate</span>
          </button>
        )}

        {onDelete && (
          <>
            <div className="h-px bg-[#F3F4F6] my-1" />
            <button
              type="button"
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>Delete</span>
            </button>
          </>
        )}
      </div>
    </>
  );
}
