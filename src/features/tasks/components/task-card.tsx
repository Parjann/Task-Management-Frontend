'use client';

import React from 'react';
import { Calendar, Tag, MoreHorizontal } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

export function TaskCard({ task }: TaskCardProps) {
  const assigneeName = task.assignee?.name || task.creator?.name || 'Admin';
  const assigneeAvatar = task.assignee?.avatarUrl || task.creator?.avatarUrl;

  // Format date (e.g. "29 Jul")
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '29 Jul';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      });
    } catch {
      return '29 Jul';
    }
  };

  const labels = task.labels && task.labels.length > 0
    ? task.labels
    : [
        { id: '1', label: { id: 'l1', name: 'Deployment', color: '#6B7280' }, taskId: task.id, labelId: 'l1' },
        { id: '2', label: { id: 'l2', name: 'Deployment', color: '#6B7280' }, taskId: task.id, labelId: 'l2' },
      ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group select-none">
      {/* Title Row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[14px] font-semibold text-[#111827] leading-snug line-clamp-2">
          {task.title}
        </h3>
        <button
          type="button"
          className="text-[#9CA3AF] hover:text-[#4B5563] p-1 rounded-md hover:bg-[#F3F4F6] transition-colors -mr-1 -mt-1"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Assignee & Due Date Row */}
      <div className="flex items-center justify-between gap-2 mt-3.5">
        {/* Assignee */}
        <div className="flex items-center gap-2 min-w-0">
          {assigneeAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={assigneeAvatar}
              alt={assigneeName}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-[#E5E7EB]"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white font-bold text-[10px]">
              {assigneeName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-[13px] font-medium text-[#374151] truncate">
            {assigneeName}
          </span>
        </div>

        {/* Due Date Red Badge */}
        <div className="flex items-center gap-1 bg-[#FEE2E2]/70 text-[#EF4444] text-xs font-semibold px-2 py-0.5 rounded-md flex-shrink-0">
          <Calendar className="w-3.5 h-3.5 text-[#EF4444]" />
          <span>{formatDate(task.dueDate)}</span>
        </div>
      </div>

      {/* Tags / Labels Row */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-1">
        {labels.map((item, idx) => (
          <div
            key={item.id || idx}
            className="flex items-center gap-1 bg-[#F3F4F6] text-[#4B5563] text-xs font-medium px-2 py-0.5 rounded-md"
          >
            <Tag className="w-3 h-3 text-[#6B7280]" />
            <span>{item.label?.name || 'Deployment'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
