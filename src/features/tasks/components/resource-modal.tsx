'use client';

import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon } from 'lucide-react';

export interface ResourceItem {
  id: string;
  type: 'file' | 'link';
  title: string;
  url: string;
  size?: string;
}

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLink?: (resource: ResourceItem) => void;
  onUploadFile?: (file: File) => Promise<void> | void;
  isUploading?: boolean;
}

export function ResourceModal({
  isOpen,
  onClose,
  onAddLink,
  onUploadFile,
  isUploading = false,
}: ResourceModalProps) {
  const [tab, setTab] = useState<'link' | 'file'>('file');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim() || !onAddLink) return;

    onAddLink({
      id: `res-${Date.now()}`,
      type: 'link',
      title: linkTitle.trim() || linkUrl.trim(),
      url: linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`,
    });

    setLinkTitle('');
    setLinkUrl('');
    onClose();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadFile) return;
    setErrorMsg(null);
    try {
      await onUploadFile(file);
      onClose();
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string | string[] } }).data?.message
          : null;
      setErrorMsg(
        Array.isArray(msg) ? msg.join(', ') : msg || 'Upload failed',
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#E5E7EB] w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150 select-none">
        <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
          <h2 className="text-base font-bold text-[#111827]">Add Resource</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#F3F4F6] rounded-xl p-1 flex items-center mt-4 mb-4">
          <button
            type="button"
            onClick={() => setTab('file')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              tab === 'file'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
          {onAddLink && (
            <button
              type="button"
              onClick={() => setTab('link')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                tab === 'link'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Web Link</span>
            </button>
          )}
        </div>

        {errorMsg && (
          <p className="mb-3 text-[11px] text-red-600">{errorMsg}</p>
        )}

        {tab === 'link' && onAddLink ? (
          <form onSubmit={handleAddLink} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Link Title (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. API Docs"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                URL Address
              </label>
              <input
                type="text"
                required
                placeholder="https://..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-[#F3F4F6]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#4B5563] hover:bg-[#F3F4F6]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#18181B] hover:bg-black text-white text-xs font-medium"
              >
                Add Link
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <label className="border-2 border-dashed border-[#E5E7EB] hover:border-[#7C3AED] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group">
              <Upload className="w-8 h-8 text-[#9CA3AF] group-hover:text-[#7C3AED] mb-2 transition-colors" />
              <p className="text-xs font-semibold text-[#111827]">
                {isUploading ? 'Uploading...' : 'Click to upload file'}
              </p>
              <p className="text-[11px] text-[#9CA3AF] mt-1">
                PDF, PNG, JPG, DOCX, ZIP (Up to 25MB)
              </p>
              <input
                type="file"
                className="hidden"
                disabled={isUploading || !onUploadFile}
                onChange={handleFileUpload}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
