'use client';

import React, { useState } from 'react';
import { X, Bell, Shield, Sliders, Trash2 } from 'lucide-react';

interface TaskSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteTask?: () => void;
}

export function TaskSettingsModal({
  isOpen,
  onClose,
  onDeleteTask,
}: TaskSettingsModalProps) {
  const [notifyOnStatusChange, setNotifyOnStatusChange] = useState(true);
  const [notifyOnDueDate, setNotifyOnDueDate] = useState(true);
  const [allowGuestComments, setAllowGuestComments] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#E5E7EB] w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150 select-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
          <h2 className="text-base font-bold text-[#111827]">
            Task Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggles */}
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-[#6B7280]" />
              <div>
                <p className="text-xs font-semibold text-[#111827]">
                  Status Notifications
                </p>
                <p className="text-[11px] text-[#9CA3AF]">
                  Alert assignees when status changes
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotifyOnStatusChange(!notifyOnStatusChange)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                notifyOnStatusChange ? 'bg-[#18181B]' : 'bg-[#E5E7EB]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  notifyOnStatusChange ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#6B7280]" />
              <div>
                <p className="text-xs font-semibold text-[#111827]">
                  Due Date Reminders
                </p>
                <p className="text-[11px] text-[#9CA3AF]">
                  Send email 24h prior to due date
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotifyOnDueDate(!notifyOnDueDate)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                notifyOnDueDate ? 'bg-[#18181B]' : 'bg-[#E5E7EB]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  notifyOnDueDate ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-[#6B7280]" />
              <div>
                <p className="text-xs font-semibold text-[#111827]">
                  Guest Collaboration
                </p>
                <p className="text-[11px] text-[#9CA3AF]">
                  Allow anonymous guests to comment
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAllowGuestComments(!allowGuestComments)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                allowGuestComments ? 'bg-[#18181B]' : 'bg-[#E5E7EB]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  allowGuestComments ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-6 pt-4 border-t border-[#F3F4F6] flex items-center justify-between">
          <button
            type="button"
            onClick={onDeleteTask}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Task</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#18181B] hover:bg-black text-white text-xs font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
