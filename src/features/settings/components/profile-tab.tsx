'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Check, AlertTriangle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useGetProfileQuery,
  useUploadAvatarMutation,
  useUpdateProfileMutation,
  useLeaveWorkspaceMutation,
} from '@/features/auth';

export function ProfileTab() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [uploadAvatarMutation] = useUploadAvatarMutation();
  const [updateProfileMutation] = useUpdateProfileMutation();
  const [leaveWorkspaceMutation, { isLoading: isLeaving }] =
    useLeaveWorkspaceMutation();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setAvatarUrl(profile.avatarUrl || null);
      setEmail(profile.email || '');
      setFullName(profile.name || '');
      setTitle(profile.title || '');
      setUsername(profile.username || '');
    }
  }, [profile]);

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [tempEmail, setTempEmail] = useState(email);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const triggerToast = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const saveField = async (
    body: {
      name?: string;
      email?: string;
      title?: string | null;
      username?: string | null;
    },
  ) => {
    setErrorMsg(null);
    try {
      await updateProfileMutation(body).unwrap();
      triggerToast();
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string | string[] } }).data?.message
          : null;
      setErrorMsg(
        Array.isArray(msg)
          ? msg.join(', ')
          : msg || 'Failed to update profile',
      );
    }
  };

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setAvatarUrl(preview);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const updated = await uploadAvatarMutation(formData).unwrap();
      setAvatarUrl(updated.avatarUrl || preview);
      triggerToast();
    } catch {
      setAvatarUrl(profile?.avatarUrl || null);
      setErrorMsg('Failed to upload avatar');
    }
  };

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempEmail.trim()) return;
    await saveField({ email: tempEmail.trim() });
    setEmail(tempEmail.trim());
    setIsEmailModalOpen(false);
  };

  const handleLeaveWorkspace = async () => {
    setErrorMsg(null);
    try {
      await leaveWorkspaceMutation().unwrap();
      setIsLeaveModalOpen(false);
      router.push('/login');
    } catch {
      setErrorMsg('Failed to leave workspace');
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="max-w-3xl">
        <p className="text-sm text-[#9CA3AF]">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8 font-sans">
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
        {errorMsg && (
          <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {errorMsg}
          </p>
        )}
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] divide-y divide-[#F3F4F6]">
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
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={fullName || 'Profile'}
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-[#E5E7EB] cursor-pointer hover:opacity-80 transition-opacity"
                title="Click to change profile picture"
              />
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#EC4899] text-white text-sm font-bold"
              >
                {(fullName || 'U').charAt(0).toUpperCase()}
              </button>
            )}
          </div>
        </div>

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
            <span>{email || '—'}</span>
            <Pencil className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#6366F1]" />
          </button>
        </div>

        <div className="flex items-center justify-between py-5">
          <span className="text-xs font-semibold text-[#374151]">Full name</span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={() => {
              if (fullName.trim() && fullName.trim() !== profile?.name) {
                void saveField({ name: fullName.trim() });
              }
            }}
            className="w-64 px-4 py-2 rounded-xl bg-[#F3F4F6] border border-transparent text-xs text-[#111827] font-medium focus:outline-none focus:bg-white focus:border-[#7C3AED] transition-colors"
          />
        </div>

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
            onBlur={() => {
              if ((title || '') !== (profile?.title || '')) {
                void saveField({ title: title.trim() || null });
              }
            }}
            className="w-64 px-4 py-2 rounded-xl bg-[#F3F4F6] border border-transparent text-xs text-[#111827] font-medium focus:outline-none focus:bg-white focus:border-[#7C3AED] transition-colors"
          />
        </div>

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
            onBlur={() => {
              if ((username || '') !== (profile?.username || '')) {
                void saveField({ username: username.trim() || null });
              }
            }}
            className="w-64 px-4 py-2 rounded-xl bg-[#F3F4F6] border border-transparent text-xs text-[#111827] font-medium focus:outline-none focus:bg-white focus:border-[#7C3AED] transition-colors"
          />
        </div>
      </div>

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
              This removes you from all projects you joined and deletes projects
              you own. You will be signed out.
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
                disabled={isLeaving}
                onClick={handleLeaveWorkspace}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium disabled:opacity-60"
              >
                {isLeaving ? 'Leaving...' : 'Confirm Leave'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
