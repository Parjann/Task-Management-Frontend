'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id?: string;
  type: 'success' | 'error';
  title?: string;
  message: string;
}

interface FeedbackToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export function FeedbackToast({ toast, onClose }: FeedbackToastProps) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-200 select-none">
      <div
        className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${isSuccess
            ? 'bg-[#18181B] text-white border-zinc-800'
            : 'bg-red-950/95 text-white border-red-800/80 shadow-red-950/20'
          }`}
      >
        <div className="mt-0.5 flex-shrink-0">
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {toast.title && (
            <h5 className="text-xs font-bold text-white mb-0.5">{toast.title}</h5>
          )}
          <p className="text-xs text-zinc-300 leading-relaxed break-words">
            {toast.message}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-400 hover:text-white transition-colors p-0.5 rounded-lg -mr-1 -mt-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
