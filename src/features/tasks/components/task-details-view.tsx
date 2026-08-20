'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Share2,
  ChevronDown,
  Send,
  Calendar,
  Trash2,
  Copy,
  Check,
  ArrowLeft,
  CheckSquare,
  MessageSquare,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { PriorityBadge } from './priority-badge';
import { DatePickerPopover } from './date-picker-popover';
import { StatusPickerPopover } from './status-picker-popover';
import { ShareTaskModal } from './share-task-modal';
import {
  useGetTaskByIdQuery,
  useGetSubtasksQuery,
  useCreateSubtaskMutation,
  useUpdateSubtaskMutation,
  useDeleteSubtaskMutation,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '../taskApi';
import { FeedbackToast, ToastMessage } from '@/components/ui/feedback-toast';

interface TaskDetailsViewProps {
  taskId?: string;
  task?: Task;
  onBack?: () => void;
}

export function TaskDetailsView({
  taskId: propTaskId,
  task: propTask,
  onBack,
}: TaskDetailsViewProps) {
  const effectiveTaskId = propTaskId || propTask?.id || '';

  // RTK Query API Hooks
  const { data: liveTask, isLoading: isTaskLoading } = useGetTaskByIdQuery(
    effectiveTaskId,
    { skip: !effectiveTaskId },
  );
  const { data: apiSubtasks = [] } = useGetSubtasksQuery(effectiveTaskId, {
    skip: !effectiveTaskId,
  });
  const { data: apiComments = [] } = useGetCommentsQuery(effectiveTaskId, {
    skip: !effectiveTaskId,
  });

  const [updateTaskMutation] = useUpdateTaskMutation();
  const [deleteTaskMutation] = useDeleteTaskMutation();
  const [createSubtaskMutation] = useCreateSubtaskMutation();
  const [updateSubtaskMutation] = useUpdateSubtaskMutation();
  const [deleteSubtaskMutation] = useDeleteSubtaskMutation();
  const [createCommentMutation] = useCreateCommentMutation();
  const [deleteCommentMutation] = useDeleteCommentMutation();

  const currentTask = liveTask || propTask;

  // Local Editable States
  const [title, setTitle] = useState(currentTask?.title || '');
  const [description, setDescription] = useState(currentTask?.description || '');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Modals & Popovers
  const [isLocked, setIsLocked] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPriorityMenuOpen, setIsPriorityMenuOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title || '');
      setDescription(currentTask.description || '');
    }
  }, [currentTask]);

  const showToast = (toastData: ToastMessage) => {
    setToast(toastData);
    setTimeout(() => {
      setToast((curr) => (curr?.message === toastData.message ? null : curr));
    }, 4000);
  };

  // Field Update Handlers
  const handleSaveTitle = async () => {
    if (!effectiveTaskId || title.trim() === currentTask?.title) return;
    try {
      await updateTaskMutation({
        id: effectiveTaskId,
        body: { title: title.trim() },
        projectId: currentTask?.projectId,
      }).unwrap();
    } catch {
      showToast({ type: 'error', title: 'Update Failed', message: 'Could not save title' });
    }
  };

  const handleSaveDescription = async () => {
    if (!effectiveTaskId || description === currentTask?.description) return;
    try {
      await updateTaskMutation({
        id: effectiveTaskId,
        body: { description: description.trim() },
        projectId: currentTask?.projectId,
      }).unwrap();
    } catch {
      showToast({ type: 'error', title: 'Update Failed', message: 'Could not save description' });
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!effectiveTaskId) return;
    try {
      await updateTaskMutation({
        id: effectiveTaskId,
        body: { status: newStatus },
        projectId: currentTask?.projectId,
      }).unwrap();
      setIsStatusMenuOpen(false);
    } catch {
      showToast({ type: 'error', title: 'Update Failed', message: 'Could not change status' });
    }
  };

  const handlePriorityChange = async (newPriority: TaskPriority) => {
    if (!effectiveTaskId) return;
    try {
      await updateTaskMutation({
        id: effectiveTaskId,
        body: { priority: newPriority },
        projectId: currentTask?.projectId,
      }).unwrap();
      setIsPriorityMenuOpen(false);
    } catch {
      showToast({ type: 'error', title: 'Update Failed', message: 'Could not change priority' });
    }
  };

  const handleSelectDate = async (date: Date) => {
    if (!effectiveTaskId) return;
    try {
      await updateTaskMutation({
        id: effectiveTaskId,
        body: { dueDate: date.toISOString() },
        projectId: currentTask?.projectId,
      }).unwrap();
      setIsDatePickerOpen(false);
    } catch {
      showToast({ type: 'error', title: 'Update Failed', message: 'Could not update date' });
    }
  };

  // Subtask Handlers
  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || !effectiveTaskId) return;
    try {
      await createSubtaskMutation({
        taskId: effectiveTaskId,
        body: { title: newSubtaskTitle.trim() },
      }).unwrap();
      setNewSubtaskTitle('');
    } catch {
      showToast({ type: 'error', title: 'Failed', message: 'Could not add subtask' });
    }
  };

  const handleToggleSubtask = async (subtaskId: string, isCompleted: boolean) => {
    try {
      await updateSubtaskMutation({
        id: subtaskId,
        taskId: effectiveTaskId,
        body: { isCompleted: !isCompleted },
      }).unwrap();
    } catch {
      showToast({ type: 'error', title: 'Failed', message: 'Could not update subtask' });
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    try {
      await deleteSubtaskMutation({
        id: subtaskId,
        taskId: effectiveTaskId,
      }).unwrap();
    } catch {
      showToast({ type: 'error', title: 'Failed', message: 'Could not delete subtask' });
    }
  };

  // Comment Handlers
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !effectiveTaskId) return;
    try {
      await createCommentMutation({
        taskId: effectiveTaskId,
        body: { taskId: effectiveTaskId, content: newCommentText.trim() },
      }).unwrap();
      setNewCommentText('');
    } catch {
      showToast({ type: 'error', title: 'Failed', message: 'Could not post comment' });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteCommentMutation({
        id: commentId,
        taskId: effectiveTaskId,
      }).unwrap();
    } catch {
      showToast({ type: 'error', title: 'Failed', message: 'Could not delete comment' });
    }
  };

  // Task Delete Handler
  const handleDeleteTask = async () => {
    if (!effectiveTaskId) return;
    try {
      await deleteTaskMutation({
        id: effectiveTaskId,
        projectId: currentTask?.projectId,
      }).unwrap();
      showToast({ type: 'success', title: 'Deleted', message: 'Task removed successfully' });
      if (onBack) onBack();
    } catch {
      showToast({ type: 'error', title: 'Failed', message: 'Could not delete task' });
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'No due date';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (isTaskLoading && !currentTask) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-sm text-[#6B7280]">
        Loading task details...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden font-sans select-none relative">
      {/* Top Navigation Bar */}
      <div className="h-14 px-6 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#374151] transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsLocked(!isLocked)}
            className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280] transition-colors"
            title={isLocked ? 'Unlock task' : 'Lock task'}
          >
            {isLocked ? (
              <Lock className="w-4 h-4 text-amber-600" />
            ) : (
              <Unlock className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="h-8 px-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-[#374151] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            className="h-8 px-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-[#374151] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Share</span>
          </button>

          <button
            type="button"
            onClick={handleDeleteTask}
            className="h-8 px-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Details, Subtasks, Activity */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 max-w-4xl">
          {/* Task Title */}
          <div>
            <input
              type="text"
              value={title}
              disabled={isLocked}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveTitle}
              placeholder="Task Title..."
              className="w-full text-2xl md:text-3xl font-bold text-[#111827] bg-transparent focus:outline-none placeholder:text-[#9CA3AF]"
            />
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              Description
            </h3>
            <textarea
              rows={3}
              value={description}
              disabled={isLocked}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSaveDescription}
              placeholder="Add a detailed description for this task..."
              className="w-full text-sm text-[#374151] bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3.5 focus:outline-none focus:bg-white focus:border-[#7C3AED] transition-all placeholder:text-[#9CA3AF]"
            />
          </div>

          {/* Subtasks Section */}
          <div className="space-y-4 pt-2 border-t border-[#F3F4F6]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#7C3AED]" />
                <h3 className="text-sm font-semibold text-[#111827]">
                  Subtasks ({apiSubtasks.filter((s) => s.isCompleted).length} / {apiSubtasks.length})
                </h3>
              </div>
            </div>

            {/* Subtask Input */}
            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add a new subtask..."
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="h-8 px-3 rounded-xl bg-[#18181B] hover:bg-black text-white text-xs font-medium disabled:opacity-50 transition-colors"
              >
                Add
              </button>
            </form>

            {/* Subtasks List */}
            <div className="space-y-2">
              {apiSubtasks.length === 0 ? (
                <p className="text-xs text-[#9CA3AF] py-2">No subtasks added yet.</p>
              ) : (
                apiSubtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[#E5E7EB] hover:bg-[#F9FAFB] group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={sub.isCompleted}
                        onChange={() => handleToggleSubtask(sub.id, sub.isCompleted)}
                        className="w-4 h-4 rounded text-[#7C3AED] focus:ring-[#7C3AED] cursor-pointer"
                      />
                      <span
                        className={`text-xs ${
                          sub.isCompleted
                            ? 'line-through text-[#9CA3AF]'
                            : 'text-[#111827] font-medium'
                        }`}
                      >
                        {sub.title}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteSubtask(sub.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#9CA3AF] hover:text-red-600 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity / Comments Section */}
          <div className="space-y-4 pt-2 border-t border-[#F3F4F6]">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#7C3AED]" />
              <h3 className="text-sm font-semibold text-[#111827]">
                Comments & Discussion ({apiComments.length})
              </h3>
            </div>

            {/* Post Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="h-9 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {apiComments.length === 0 ? (
                <p className="text-xs text-[#9CA3AF] py-2">No comments yet. Start the conversation!</p>
              ) : (
                apiComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3.5 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] space-y-1.5 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111827]">
                        {comment.user?.name || 'User'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#9CA3AF]">
                          {comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#9CA3AF] hover:text-red-600 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-[#374151] leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Attributes Card */}
        <div className="w-80 border-l border-[#E5E7EB] bg-[#FAFBFD] p-6 space-y-6 overflow-y-auto hidden md:block">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              Attributes
            </h4>

            {/* Status Attribute */}
            <div className="flex items-center justify-between relative">
              <span className="text-xs font-medium text-[#6B7280]">Status</span>
              <button
                type="button"
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                className="px-2.5 py-1 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-[#111827] flex items-center gap-1.5 shadow-2xs"
              >
                <span>{currentTask?.status || 'TODO'}</span>
                <ChevronDown className="w-3 h-3 text-[#9CA3AF]" />
              </button>

              <StatusPickerPopover
                isOpen={isStatusMenuOpen}
                onClose={() => setIsStatusMenuOpen(false)}
                selectedStatus={currentTask?.status || 'TODO'}
                onSelectStatus={handleStatusChange}
              />
            </div>

            {/* Priority Attribute */}
            <div className="flex items-center justify-between relative">
              <span className="text-xs font-medium text-[#6B7280]">Priority</span>
              <button
                type="button"
                onClick={() => setIsPriorityMenuOpen(!isPriorityMenuOpen)}
                className="cursor-pointer"
              >
                <PriorityBadge priority={currentTask?.priority || 'MEDIUM'} />
              </button>

              {isPriorityMenuOpen && (
                <div className="absolute right-0 top-8 z-50 w-36 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-1 space-y-1">
                  {(['HIGH', 'MEDIUM', 'LOW', 'URGENT'] as TaskPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePriorityChange(p)}
                      className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-[#F3F4F6] rounded-lg transition-colors font-medium text-[#374151]"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Due Date Attribute */}
            <div className="flex items-center justify-between relative">
              <span className="text-xs font-medium text-[#6B7280]">Due Date</span>
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className="px-2.5 py-1 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-[#111827] flex items-center gap-1.5 shadow-2xs"
              >
                <Calendar className="w-3 h-3 text-[#6B7280]" />
                <span>{formatDate(currentTask?.dueDate)}</span>
              </button>

              <DatePickerPopover
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                selectedDate={currentTask?.dueDate ? new Date(currentTask.dueDate) : null}
                onSelectDate={handleSelectDate}
              />
            </div>

            {/* Project Attribute */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B7280]">Project</span>
              <span className="text-xs font-semibold text-[#111827] bg-white px-2.5 py-1 rounded-lg border border-[#E5E7EB]">
                {currentTask?.project?.name || 'Workspace'}
              </span>
            </div>

            {/* Reporter / Creator Attribute */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B7280]">Creator</span>
              <span className="text-xs font-semibold text-[#111827]">
                {currentTask?.creator?.name || currentTask?.reporter?.name || 'System User'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareTaskModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        taskTitle={currentTask?.title || 'Task Details'}
      />

      {/* Feedback Toast */}
      <FeedbackToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
