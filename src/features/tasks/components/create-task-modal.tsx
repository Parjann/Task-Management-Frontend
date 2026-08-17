'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TaskStatus, TaskPriority } from '../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeName: string;
    dueDate: string;
    label: string;
  }) => void;
  defaultStatus?: TaskStatus;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  defaultStatus = 'TODO',
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [assigneeName, setAssigneeName] = useState('Admin');
  const [dueDate, setDueDate] = useState('');
  const [label, setLabel] = useState('Deployment');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      status,
      priority,
      assigneeName,
      dueDate: dueDate || new Date().toISOString(),
      label,
    });

    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#E5E7EB] w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-[#F3F4F6]">
          <h2 className="text-lg font-bold text-[#111827]">Create New Task</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implement Search Function"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Column Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">Doing</option>
                <option value="DONE">Completed</option>
                <option value="BACKLOG">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Assignee
              </label>
              <input
                type="text"
                placeholder="e.g. Admin / Designer"
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#111827]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Label / Tag
              </label>
              <input
                type="text"
                placeholder="e.g. Deployment / UI"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#111827]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#F3F4F6]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#4B5563] hover:bg-[#F3F4F6] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#18181B] hover:bg-black text-white text-xs font-medium transition-all"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
