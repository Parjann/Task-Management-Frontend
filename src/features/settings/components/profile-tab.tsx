'use client';

import React, { useState, useRef } from 'react';
import { Pencil, Check, AlertTriangle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ProfileTab() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State matching screenshot
  const [avatarUrl, setAvatarUrl] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  );
  const [email, setEmail] = useState('dexter@gmail.com');
  const [fullName, setFullName] = useState('Dexter');
  const [title, setTitle] = useState('Designer');
  const [username, setUsername] = useState('Dexuser');

  // Modals & Feedback
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [tempEmail, setTempEmail] = useState(email);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
      triggerToast();
    }
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempEmail.trim()) return;
    setEmail(tempEmail.trim());
    setIsEmailModalOpen(false);
    triggerToast();
  };

  const triggerToast = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-8 font-sans">
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#18181B] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      <div>
        <h1 className="text-[26px] md:text-[28px] font-bold text-[#111827] tracking-tight">
          Profile
        </h1>
      </div>

      {/* Main Profile Card matching Figma */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] divide-y divide-[#F3F4F6]">
        {/* 1. Profile Picture Row */}
        <div className="flex items-center justify-between pb-5">
          <span className="text-xs font-semibold text-[#374151]">
            Profile picture
          </span>
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt={fullName}
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-[#E5E7EB] cursor-pointer hover:opacity-80 transition-opacity"
              title="Click to change profile picture"
            />
          </div>
        </div>

        {/* 2. Email Row */}
        <div className="flex items-center justify-between py-5">
          <span className="text-xs font-semibold text-[#374151]">Email</span>
          <button
            type="button"
            onClick={() => {
              setTempEmail(email);
              setIsEmailModalOpen(true);
            }}
            className="flex items-center gap-2 text-xs text-[#111827] font-medium hover:text-[#6366F1] transition-colors group"
          >
            <span>{email}</span>
            <Pencil className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#6366F1]" />
          </button>
        </div>

        {/* 3. Full Name Row */}
        <div className="flex items-center justify-between py-5">
          <span className="text-xs font-semibold text-[#374151]">Full name</span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={triggerToast}
            className="w-64 px-4 py-2 rounded-xl bg-[#F3F4F6] border border-transparent text-xs text-[#111827] font-medium focus:outline-none focus:bg-white focus:border-[#7C3AED] transition-colors"
          />
        </div>

        {/* 4. Title Row */}
        <div className="flex items-center justify-between py-5">
          <div>
            <p className="text-xs font-semibold text-[#374151]">Title</p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">
              Your job title or role
            </p>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={triggerToast}
            className="w-64 px-4 py-2 rounded-xl bg-[#F3F4F6] border border-transparent text-xs text-[#111827] font-medium focus:outline-none focus:bg-white focus:border-[#7C3AED] transition-colors"
          />
        </div>

        {/* 5. Username Row */}
        <div className="flex items-center justify-between pt-5">
          <div>
            <p className="text-xs font-semibold text-[#374151]">Username</p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">
              One word, like a nickname or first name
            </p>
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={triggerToast}
            className="w-64 px-4 py-2 rounded-xl bg-[#F3F4F6] border border-transparent text-xs text-[#111827] font-medium focus:outline-none focus:bg-white focus:border-[#7C3AED] transition-colors"
          />
        </div>
      </div>

      {/* Workspace Access Section */}
      <div className="pt-2">
        <h2 className="text-[15px] font-semibold text-[#111827] mb-3">
          Workspace access
        </h2>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <span className="text-xs text-[#6B7280]">
            Remove yourself from the workspace
          </span>
          <button
            type="button"
            onClick={() => setIsLeaveModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#FEE2E2]/60 hover:bg-[#FEE2E2] text-[#EF4444] text-xs font-semibold transition-colors"
          >
            Leave Workspace
          </button>
        </div>
      </div>

      {/* Edit Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] w-full max-w-sm p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150 select-none">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
              <h3 className="text-sm font-bold text-[#111827]">Change Email</h3>
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#111827]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEmail} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#F3F4F6]">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#4B5563] hover:bg-[#F3F4F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#18181B] hover:bg-black text-white text-xs font-medium"
                >
                  Save Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Workspace Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] w-full max-w-sm p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150 select-none">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#111827]">
              Leave Workspace?
            </h3>
            <p className="text-xs text-[#6B7280] mt-1 mb-4 leading-relaxed">
              Are you sure you want to leave this workspace? You will lose access to all tasks and projects.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#F3F4F6]">
              <button
                type="button"
                onClick={() => setIsLeaveModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#4B5563] hover:bg-[#F3F4F6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLeaveModalOpen(false);
                  router.push('/login');
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium"
              >
                Confirm Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
