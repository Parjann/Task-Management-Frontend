'use client';

import React from 'react';

interface EmojiPickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
}

const COMMON_EMOJIS = ['👍', '❤️', '🔥', '🎉', '🚀', '👀', '💡', '👏', '✅', '🙌'];

export function EmojiPickerPopover({
  isOpen,
  onClose,
  onSelectEmoji,
}: EmojiPickerPopoverProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-8 z-50 bg-white border border-[#E5E7EB] rounded-2xl p-2 shadow-xl flex items-center gap-1 animate-in fade-in zoom-in-95 duration-100 select-none">
        {COMMON_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => {
              onSelectEmoji(emoji);
              onClose();
            }}
            className="w-8 h-8 rounded-xl hover:bg-[#F3F4F6] flex items-center justify-center text-lg transition-transform hover:scale-110 active:scale-95"
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
}
