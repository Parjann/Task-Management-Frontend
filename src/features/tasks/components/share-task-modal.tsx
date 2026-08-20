'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Mail } from 'lucide-react';
import { useCreateInvitationMutation } from '@/features/invitations';

interface ShareTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  projectId?: string | null;
}

export function ShareTaskModal({
  isOpen,
  onClose,
  taskTitle,
  projectId,
}: ShareTaskModalProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createInvitation, { isLoading }] = useCreateInvitationMutation();

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (!projectId) {
      setErrorMsg('This task has no project to invite into.');
      return;
    }

    setErrorMsg(null);
    try {
      await createInvitation({
        projectId,
        email: email.trim().toLowerCase(),
        role: 'MEMBER',
      }).unwrap();
      setEmail('');
      onClose();
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string | string[] } }).data?.message
          : null;
      setErrorMsg(
        Array.isArray(msg)
          ? msg.join(', ')
          : msg || 'Failed to send invitation',
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#E5E7EB] w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150 select-none">
        <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
          <div>
            <h2 className="text-base font-bold text-[#111827]">Share Task</h2>
            <p className="text-xs text-[#6B7280] truncate max-w-[280px]">
              {taskTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Shareable Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 px-3 py-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-xs text-[#6B7280] truncate focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-[#18181B] hover:bg-black text-white text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={handleInvite} className="mt-4 pt-4 border-t border-[#F3F4F6]">
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Invite Collaborator
          </label>
          {errorMsg && (
            <p className="mb-2 text-[11px] text-red-600">{errorMsg}</p>
          )}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Mail className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
              <input
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !projectId}
              className="px-3.5 py-2 rounded-xl bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Invite'}
            </button>
          </div>
          {!projectId && (
            <p className="mt-2 text-[11px] text-[#9CA3AF]">
              Project context is required to send invitations.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
