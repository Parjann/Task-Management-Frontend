'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Copy, CheckCircle, CopyPlus, Trash2, Check } from 'lucide-react';

interface TaskActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onCopyLink?: () => void;
  onDuplicate?: () => void;
  onToggleComplete?: () => void;
  onDelete?: () => void;
  align?: 'left' | 'right';
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  useFixedPosition?: boolean;
}

export function TaskActionsMenu({
  isOpen,
  onClose,
  onCopyLink,
  onDuplicate,
  onToggleComplete,
  onDelete,
  align = 'right',
  triggerRef,
  useFixedPosition = false,
}: TaskActionsMenuProps) {
  const [copied, setCopied] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (isOpen && useFixedPosition && triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 4,
        left: rect.right - 176, // 176px = w-44 (11rem)
      });
    }
  }, [isOpen, useFixedPosition, triggerRef]);

  if (!isOpen) return null;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onCopyLink?.();
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 600);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete?.();
    onClose();
  };

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
        className={`${
          useFixedPosition ? 'fixed' : 'absolute top-8'
        } z-50 w-44 bg-white border border-[#E5E7EB] rounded-2xl p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100 select-none font-sans ${
          !useFixedPosition ? (align === 'right' ? 'right-0' : 'left-0') : ''
        }`}
        style={
          useFixedPosition && pos
            ? { top: pos.top, left: pos.left }
            : undefined
        }
      >
        <button
          type="button"
          onClick={handleCopy}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
        >
          <div className="flex items-center gap-2">
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#9CA3AF]" />
            )}
            <span className={copied ? 'text-emerald-600 font-semibold' : ''}>
              {copied ? 'Link Copied!' : 'Copy Link'}
            </span>
          </div>
        </button>

        {onToggleComplete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
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
            onClick={(e) => {
              e.stopPropagation();
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
              onClick={handleDelete}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
