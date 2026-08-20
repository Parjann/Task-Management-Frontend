'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, Calendar, Signal, X } from 'lucide-react';
import { KanbanBoard } from '@/features/tasks/components/kanban-board';
import { PriorityBadge } from '@/features/tasks/components/priority-badge';
import {
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
} from '@/features/projects';
import { TaskPriority } from '@/features/tasks/types';
import { FeedbackToast, ToastMessage } from '@/components/ui/feedback-toast';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params?.id as string | undefined;
  const { data: project } = useGetProjectByIdQuery(projectId || '', {
    skip: !projectId,
  });
  const [updateProject] = useUpdateProjectMutation();
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const projectName = project?.name || 'Project Tasks';

  const showToast = (toastData: ToastMessage) => {
    setToast(toastData);
    setTimeout(() => {
      setToast((current) =>
        current?.message === toastData.message ? null : current,
      );
    }, 4000);
  };

  const handleUpdateDueDate = async (dateValue: string) => {
    if (!projectId) return;
    try {
      await updateProject({
        id: projectId,
        body: {
          dueDate: dateValue ? new Date(dateValue).toISOString() : null,
        },
      }).unwrap();
      showToast({
        type: 'success',
        title: 'Due Date Updated',
        message: dateValue
          ? `Due date set to ${new Date(dateValue).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`
          : 'Due date removed',
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update due date. Please try again.',
      });
    }
  };

  const handleUpdatePriority = async (priority: TaskPriority) => {
    if (!projectId) return;
    try {
      await updateProject({
        id: projectId,
        body: { priority },
      }).unwrap();
      setIsPriorityOpen(false);
      showToast({
        type: 'success',
        title: 'Priority Updated',
        message: `Priority set to ${priority.charAt(0) + priority.slice(1).toLowerCase()}`,
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update priority. Please try again.',
      });
    }
  };

  const formatDisplayDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return null;
    }
  };

  const toInputDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const priorities: { value: TaskPriority; label: string }[] = [
    { value: 'URGENT', label: 'Urgent' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
  ];

  const displayDate = formatDisplayDate(project?.dueDate);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
      {/* Project Breadcrumb Navigation */}
      <div className="px-4 sm:px-8 pt-5 pb-1 flex items-center gap-2 text-xs font-medium text-[#6B7280]">
        <Link
          href="/projects"
          className="hover:text-[#111827] transition-colors"
        >
          Projects
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
        <span className="text-[#111827] font-semibold">
          {projectName}
        </span>
      </div>

      {/* Project Info Bar */}
      <div className="px-4 sm:px-8 py-3 flex items-center gap-3 flex-wrap border-b border-[#F3F4F6]">
        {/* Priority */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsPriorityOpen(!isPriorityOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] transition-colors text-xs font-medium text-[#374151]"
          >
            <Signal className="w-3.5 h-3.5 text-[#6B7280]" />
            <PriorityBadge
              priority={(project?.priority as TaskPriority) || 'MEDIUM'}
            />
          </button>

          {isPriorityOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsPriorityOpen(false)}
              />
              <div className="absolute top-full left-0 mt-1 z-50 w-40 bg-white border border-[#E5E7EB] rounded-2xl p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                <p className="text-[11px] font-semibold text-[#9CA3AF] px-2.5 py-1 mb-0.5">
                  Priority
                </p>
                {priorities.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => handleUpdatePriority(p.value)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-[#F9FAFB] transition-colors ${
                      project?.priority === p.value
                        ? 'bg-[#F3F4F6] text-[#111827]'
                        : 'text-[#374151]'
                    }`}
                  >
                    <PriorityBadge priority={p.value} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Due Date */}
        <div className="relative flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => dateInputRef.current?.showPicker()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] transition-colors text-xs font-medium text-[#374151]"
          >
            <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
            <span className={displayDate ? 'text-[#111827]' : 'text-[#9CA3AF]'}>
              {displayDate || 'Set Due Date'}
            </span>
          </button>
          {displayDate && (
            <button
              type="button"
              onClick={() => handleUpdateDueDate('')}
              className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#EF4444] hover:bg-red-50 transition-colors"
              title="Remove due date"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <input
            ref={dateInputRef}
            type="date"
            value={toInputDate(project?.dueDate)}
            onChange={(e) => handleUpdateDueDate(e.target.value)}
            className="absolute opacity-0 pointer-events-none w-0 h-0"
            tabIndex={-1}
          />
        </div>
      </div>

      {/* Embedded Kanban & Grouped List Board for this project */}
      <KanbanBoard projectId={projectId} />

      {/* Feedback Toast */}
      <FeedbackToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
