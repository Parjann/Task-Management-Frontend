'use client';

import React, { useState } from 'react';
import { Search, Check } from 'lucide-react';

export interface MemberOption {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

interface MemberPickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMemberIds: string[];
  onToggleMember: (member: MemberOption) => void;
  members?: MemberOption[];
}

export function MemberPickerPopover({
  isOpen,
  onClose,
  selectedMemberIds,
  onToggleMember,
  members = [],
}: MemberPickerPopoverProps) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute right-0 top-8 z-50 w-60 bg-white border border-[#E5E7EB] rounded-2xl p-2.5 shadow-xl animate-in fade-in zoom-in-95 duration-100 select-none">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] mb-2 focus-within:border-[#7C3AED]">
          <Search className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs text-[#111827] placeholder:text-[#9CA3AF] bg-transparent focus:outline-none"
          />
        </div>

        <div className="space-y-0.5 max-h-48 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="px-2.5 py-3 text-[11px] text-[#9CA3AF]">
              No project members found.
            </p>
          )}
          {filtered.map((member) => {
            const isSelected = selectedMemberIds.includes(member.id);
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => onToggleMember(member)}
                className="w-full flex items-center justify-between p-2 rounded-xl text-xs hover:bg-[#F3F4F6] transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {member.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-[#E5E7EB]"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#E5E7EB] text-[#4B5563] text-[10px] font-bold flex items-center justify-center">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left truncate">
                    <p className="font-semibold text-[#111827] truncate">
                      {member.name}
                    </p>
                    <p className="text-[10px] text-[#9CA3AF] truncate">
                      {member.email}
                    </p>
                  </div>
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
