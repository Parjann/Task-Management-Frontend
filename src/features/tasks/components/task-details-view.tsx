'use client';

import React, { useState, useRef } from 'react';
import {
  Lock,
  Unlock,
  Eye,
  Share2,
  MoreHorizontal,
  PanelRight,
  ChevronDown,
  Plus,
  Tag,
  Paperclip,
  Send,
  Check,
  Settings,
  Smile,
  Flame,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle2,
  FileText,
  Link as LinkIcon,
  X,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { PriorityBadge } from './priority-badge';
import { DatePickerPopover } from './date-picker-popover';
import { StatusPickerPopover } from './status-picker-popover';
import {
  MemberPickerPopover,
  MemberOption,
} from './member-picker-popover';
import { LabelPickerPopover } from './label-picker-popover';
import { ResourceModal } from './resource-modal';
import { ShareTaskModal } from './share-task-modal';
import { TaskSettingsModal } from './task-settings-modal';
import { EmojiPickerPopover } from './emoji-picker-popover';
import { TaskActionsMenu } from './task-actions-menu';
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
import { useGetProjectMembersQuery } from '@/features/projects';
import {
  useGetLabelsQuery,
  useCreateLabelMutation,
  useAssignLabelMutation,
  useRemoveTaskLabelMutation,
} from '@/features/labels';
import {
  useGetAttachmentsQuery,
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
} from '@/features/attachments';
import { FeedbackToast, ToastMessage } from '@/components/ui/feedback-toast';
import type { LabelOption } from './label-picker-popover';

interface TaskDetailsViewProps {
  taskId?: string;
  task?: Task;
  onBack?: () => void;
}

interface UpdateItem {
  id: string;
  type: string;
  author: string;
  text: string;
  icon?: string | null;
  avatar?: string | null;
  time: string;
}

export function TaskDetailsView({
  taskId: propTaskId,
  task: propTask,
  onBack,
}: TaskDetailsViewProps) {
  const effectiveTaskId = propTaskId || propTask?.id || '';

  // RTK Query Live Data
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
  const projectId = (liveTask || propTask)?.projectId;
  const { data: projectMembers = [] } = useGetProjectMembersQuery(
    projectId || '',
    { skip: !projectId },
  );
  const { data: projectLabels = [] } = useGetLabelsQuery(projectId || '', {
    skip: !projectId,
  });
  const { data: apiAttachments = [] } = useGetAttachmentsQuery(
    effectiveTaskId,
    { skip: !effectiveTaskId },
  );

  const [updateTaskMutation] = useUpdateTaskMutation();
  const [deleteTaskMutation] = useDeleteTaskMutation();
  const [createSubtaskMutation] = useCreateSubtaskMutation();
  const [updateSubtaskMutation] = useUpdateSubtaskMutation();
  const [deleteSubtaskMutation] = useDeleteSubtaskMutation();
  const [createCommentMutation] = useCreateCommentMutation();
  const [deleteCommentMutation] = useDeleteCommentMutation();
  const [createLabelMutation, { isLoading: isCreatingLabel }] =
    useCreateLabelMutation();
  const [assignLabelMutation] = useAssignLabelMutation();
  const [removeTaskLabelMutation] = useRemoveTaskLabelMutation();
  const [uploadAttachmentMutation, { isLoading: isUploading }] =
    useUploadAttachmentMutation();
  const [deleteAttachmentMutation] = useDeleteAttachmentMutation();

  const task = liveTask || propTask;
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (toastData: ToastMessage) => {
    setToast(toastData);
    setTimeout(() => {
      setToast((curr) => (curr?.message === toastData.message ? null : curr));
    }, 4000);
  };

  const memberOptions: MemberOption[] = projectMembers.map((m) => ({
    id: m.userId || m.user?.id,
    name: m.user?.name || 'Member',
    email: m.user?.email || '',
    avatarUrl: m.user?.avatarUrl,
  }));

  const labelOptions: LabelOption[] = projectLabels.map((l) => ({
    id: l.id,
    name: l.name,
    color: l.color,
  }));

  // Lock state
  const [isLocked, setIsLocked] = useState(false);

  // Modals state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

  // Priority & Status dropdown state
  const [isPriorityMenuOpen, setIsPriorityMenuOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority>(
    task?.priority || 'MEDIUM',
  );
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(
    task?.status || 'TODO',
  );

  // Members Picker state
  const [isMemberMenuOpen, setIsMemberMenuOpen] = useState(false);
  const [subtaskAssignIndex, setSubtaskAssignIndex] = useState<number | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<MemberOption[]>([]);

  // Date Picker state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateType, setDateType] = useState<'start' | 'end'>('end');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Labels Picker state
  const [isLabelMenuOpen, setIsLabelMenuOpen] = useState(false);
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);

  // Sync local state from live task data
  React.useEffect(() => {
    if (task) {
      if (task.priority) setSelectedPriority(task.priority);
      if (task.status) setSelectedStatus(task.status);
      if (task.assignee) {
        setSelectedMembers([
          {
            id: task.assignee.id,
            name: task.assignee.name,
            email: task.assignee.email,
            avatarUrl: task.assignee.avatarUrl,
          },
        ]);
      } else {
        setSelectedMembers([]);
      }
      setSelectedLabelIds(
        (task.labels || [])
          .map((l) => l.labelId || l.label?.id)
          .filter(Boolean) as string[],
      );
      setEndDate(task.dueDate ? new Date(task.dueDate) : null);
      setStartDate(null);
    }
  }, [task]);

  // Live subtask data from RTK Query
  const subtasks = apiSubtasks.map((s) => ({
    id: s.id,
    title: s.title,
    priority: 'MEDIUM' as TaskPriority,
    assigneeName: null as string | null,
    avatar: null as string | null,
    dueDate: '',
    isCompleted: s.isCompleted,
  }));
  const [activeSubtaskMenuId, setActiveSubtaskMenuId] = useState<string | null>(null);

  // Live comment data from RTK Query
  const comments = apiComments.map((c) => ({
    id: c.id,
    author: c.user?.name || 'User',
    avatar: c.user?.avatarUrl || null,
    time: c.createdAt
      ? new Date(c.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'just now',
    content: c.content,
    reactions: [] as { emoji: string; count: number; userReacted: boolean }[],
    attachments: [] as string[],
    replies: [] as {
      id: string;
      author: string;
      avatar: string;
      content: string;
      time: string;
    }[],
  }));
  const [newCommentText, setNewCommentText] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [commentAttachmentName, setCommentAttachmentName] = useState<
    string | null
  >(null);
  const [activeEmojiCommentId, setActiveEmojiCommentId] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timeline updates from task activities when available
  const updates: UpdateItem[] = ((task as any)?.activities || []).map(
    (a: any) => ({
      id: a.id,
      type: a.action || 'post',
      author: a.user?.name || 'Someone',
      text: a.message || a.action,
      icon: a.action?.includes('STATUS')
        ? 'status'
        : a.action?.includes('PRIORITY')
          ? 'flame'
          : null,
      avatar: a.user?.avatarUrl || null,
      time: a.createdAt
        ? new Date(a.createdAt).toLocaleDateString('en-GB', {
            month: 'short',
            year: 'numeric',
          })
        : '',
    }),
  );

  const selectedLabels = labelOptions.filter((l) =>
    selectedLabelIds.includes(l.id),
  );

  // Handlers
  const handlePriorityChange = async (newP: TaskPriority) => {
    setSelectedPriority(newP);
    if (effectiveTaskId) {
      try {
        await updateTaskMutation({
          id: effectiveTaskId,
          body: { priority: newP },
          projectId: task?.projectId,
        }).unwrap();
      } catch {
        showToast({
          type: 'error',
          title: 'Update Failed',
          message: 'Could not update priority',
        });
      }
    }
  };

  const handleStatusChange = async (newS: TaskStatus) => {
    setSelectedStatus(newS);
    if (effectiveTaskId) {
      try {
        await updateTaskMutation({
          id: effectiveTaskId,
          body: { status: newS },
          projectId: task?.projectId,
        }).unwrap();
      } catch {
        showToast({
          type: 'error',
          title: 'Update Failed',
          message: 'Could not update status',
        });
      }
    }
  };

  const handleToggleMember = async (member: MemberOption) => {
    if (subtaskAssignIndex !== null) {
      setSubtaskAssignIndex(null);
      return;
    }
    if (!effectiveTaskId) return;

    const isSame = selectedMembers.some((m) => m.id === member.id);
    try {
      await updateTaskMutation({
        id: effectiveTaskId,
        body: { assigneeId: isSame ? null : member.id },
        projectId: task?.projectId,
      }).unwrap();
      setSelectedMembers(isSame ? [] : [member]);
      setIsMemberMenuOpen(false);
    } catch {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update assignee',
      });
    }
  };

  const handleToggleLabel = async (label: LabelOption) => {
    if (!effectiveTaskId) return;
    const exists = selectedLabelIds.includes(label.id);
    try {
      if (exists) {
        await removeTaskLabelMutation({
          taskId: effectiveTaskId,
          labelId: label.id,
          projectId: task?.projectId,
        }).unwrap();
        setSelectedLabelIds((prev) => prev.filter((id) => id !== label.id));
      } else {
        await assignLabelMutation({
          taskId: effectiveTaskId,
          labelId: label.id,
          projectId: task?.projectId,
        }).unwrap();
        setSelectedLabelIds((prev) => [...prev, label.id]);
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update labels',
      });
    }
  };

  const handleCreateLabel = async (name: string) => {
    if (!projectId) {
      showToast({
        type: 'error',
        title: 'Failed',
        message: 'Project is required to create labels',
      });
      return;
    }
    const colors = [
      '#6B7280',
      '#8B5CF6',
      '#3B82F6',
      '#10B981',
      '#EF4444',
      '#EC4899',
    ];
    try {
      const created = await createLabelMutation({
        projectId,
        name,
        color: colors[Math.floor(Math.random() * colors.length)],
      }).unwrap();
      await assignLabelMutation({
        taskId: effectiveTaskId,
        labelId: created.id,
        projectId,
      }).unwrap();
      setSelectedLabelIds((prev) => [...prev, created.id]);
    } catch {
      showToast({
        type: 'error',
        title: 'Failed',
        message: 'Could not create label',
      });
    }
  };

  const handleSelectDate = async (date: Date) => {
    if (dateType === 'start') {
      setStartDate(date);
      return;
    }
    setEndDate(date);
    if (!effectiveTaskId) return;
    try {
      await updateTaskMutation({
        id: effectiveTaskId,
        body: { dueDate: date.toISOString() },
        projectId: task?.projectId,
      }).unwrap();
    } catch {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update due date',
      });
    }
  };

  const handleUploadAttachment = async (file: File) => {
    if (!effectiveTaskId) return;
    await uploadAttachmentMutation({
      taskId: effectiveTaskId,
      file,
    }).unwrap();
  };

  const handleRemoveAttachment = async (id: string) => {
    try {
      await deleteAttachmentMutation({
        id,
        taskId: effectiveTaskId,
      }).unwrap();
    } catch {
      showToast({
        type: 'error',
        title: 'Failed',
        message: 'Could not delete attachment',
      });
    }
  };

  const handleAddSubtask = async () => {
    if (!effectiveTaskId) return;
    const num = subtasks.length + 1;
    try {
      await createSubtaskMutation({
        taskId: effectiveTaskId,
        body: { title: `Subtask ${num}` },
      }).unwrap();
    } catch {
      showToast({
        type: 'error',
        title: 'Failed',
        message: 'Could not add subtask',
      });
    }
  };

  const handleDeleteSubtask = async (id: string) => {
    try {
      await deleteSubtaskMutation({
        id,
        taskId: effectiveTaskId,
      }).unwrap();
    } catch {
      showToast({
        type: 'error',
        title: 'Failed',
        message: 'Could not delete subtask',
      });
    }
  };

  const handleToggleCompleteSubtask = async (id: string) => {
    const sub = apiSubtasks.find((s) => s.id === id);
    if (!sub) return;
    try {
      await updateSubtaskMutation({
        id,
        taskId: effectiveTaskId,
        body: { isCompleted: !sub.isCompleted },
      }).unwrap();
    } catch {
      showToast({
        type: 'error',
        title: 'Failed',
        message: 'Could not update subtask',
      });
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !effectiveTaskId) return;
    try {
      await createCommentMutation({
        taskId: effectiveTaskId,
        body: { content: newCommentText.trim() },
      }).unwrap();
      setNewCommentText('');
      setCommentAttachmentName(null);
    } catch {
      showToast({
        type: 'error',
        title: 'Failed',
        message: 'Could not post comment',
      });
    }
  };

  const handleAddReply = (commentId: string) => {
    const text = replyText[commentId];
    if (!text || !text.trim() || !effectiveTaskId) return;
    void createCommentMutation({
      taskId: effectiveTaskId,
      body: { content: `↩ ${text.trim()}` },
    });
    setReplyText((prev) => ({ ...prev, [commentId]: '' }));
  };

  const handleToggleEmoji = (_commentId: string, _emoji: string) => {
    // Emoji reactions are UI-only for now
  };

  const formatPillDate = (d: Date | null, fallback: string) => {
    if (!d) return fallback;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusDisplay = (s: TaskStatus) => {
    switch (s) {
      case 'BACKLOG':
        return { label: 'Backlog', dot: '#D97706', text: 'text-[#D97706]' };
      case 'TODO':
        return { label: 'To Do', dot: '#6B7280', text: 'text-[#6B7280]' };
      case 'IN_PROGRESS':
        return { label: 'Doing', dot: '#3B82F6', text: 'text-[#3B82F6]' };
      case 'DONE':
        return { label: 'Completed', dot: '#10B981', text: 'text-[#10B981]' };
      case 'CANCELED':
        return { label: 'Canceled', dot: '#EF4444', text: 'text-[#EF4444]' };
      default:
        return { label: 'Backlog', dot: '#D97706', text: 'text-[#D97706]' };
    }
  };

  const currentStatusInfo = getStatusDisplay(selectedStatus);

  if (isTaskLoading && !task) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-sm text-[#6B7280]">
        Loading task details...
      </div>
    );
  }

  const priorityOptions: { value: TaskPriority | 'NONE'; label: string }[] = [
    { value: 'NONE', label: 'No Priority' },
    { value: 'URGENT', label: 'Urgent' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 p-6 md:p-8 bg-white font-sans text-[#111827]">
      {/* Locked Banner Notification */}
      {isLocked && (
        <div className="mb-6 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>This task is currently locked. Click the lock icon to enable editing.</span>
          </div>
          <button
            type="button"
            onClick={() => setIsLocked(false)}
            className="text-amber-900 underline font-bold hover:text-black"
          >
            Unlock Now
          </button>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================= */}
        {/* LEFT / MAIN COLUMN                                        */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Title & Top Actions Bar */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[26px] md:text-[28px] font-bold text-[#111827] tracking-tight leading-tight">
                {task?.title || 'Write API Documentation'}
              </h1>
              <p className="text-[14px] text-[#4B5563] mt-2 leading-relaxed">
                {task?.description ||
                  'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.'}
              </p>
            </div>

            {/* Action Buttons Top Right */}
            <div className="flex items-center gap-1.5 flex-shrink-0 relative">
              {/* Lock / Unlock Button */}
              <button
                type="button"
                onClick={() => setIsLocked(!isLocked)}
                className={`p-2 rounded-xl border transition-all ${
                  isLocked
                    ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-2xs'
                    : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#4B5563] hover:text-[#111827]'
                }`}
                title={isLocked ? 'Task is Locked (Click to unlock)' : 'Lock Task'}
              >
                {isLocked ? (
                  <Lock className="w-4 h-4 text-amber-600" />
                ) : (
                  <Unlock className="w-4 h-4 text-[#6B7280]" />
                )}
              </button>

              {/* View Count Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#4B5563]">
                <Eye className="w-3.5 h-3.5 text-[#6366F1]" />
                <span>1</span>
              </div>

              {/* Share Button */}
              <button
                type="button"
                onClick={() => setIsShareOpen(true)}
                className="p-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#4B5563] hover:text-[#111827] transition-colors"
                title="Share Task"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* More Options Button with TaskActionsMenu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
                  className="p-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#4B5563] hover:text-[#111827] transition-colors"
                  title="More Options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <TaskActionsMenu
                  isOpen={isHeaderMenuOpen}
                  onClose={() => setIsHeaderMenuOpen(false)}
                  onCopyLink={() => navigator.clipboard.writeText(window.location.href)}
                  onDuplicate={() => {
                    showToast({
                      type: 'success',
                      title: 'Copied',
                      message: 'Use create task to make a new copy.',
                    });
                  }}
                  onToggleComplete={() => handleStatusChange('DONE')}
                  onDelete={async () => {
                    if (effectiveTaskId) {
                      try {
                        await deleteTaskMutation({ id: effectiveTaskId, projectId: task?.projectId }).unwrap();
                      } catch { /* ignore */ }
                    }
                    if (onBack) onBack();
                  }}
                />
              </div>

              {/* Panel Toggle / Back Button */}
              <button
                type="button"
                onClick={onBack}
                className="p-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#4B5563] hover:text-[#111827] transition-colors"
                title="Back to Board"
              >
                <PanelRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Properties Meta Section */}
          <div className="space-y-3 pt-2 text-[13px]">
            {/* Properties Row */}
            <div className="flex items-center gap-4">
              <span className="w-24 text-[#374151] font-semibold flex-shrink-0">
                Properties
              </span>
              <div className="flex items-center gap-2.5">
                {task?.assignee?.avatarUrl || task?.creator?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={
                      (task?.assignee?.avatarUrl ||
                        task?.creator?.avatarUrl) as string
                    }
                    alt=""
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#E5E7EB] text-[#4B5563] font-bold text-[10px] flex items-center justify-center">
                    {(
                      task?.assignee?.name ||
                      task?.creator?.name ||
                      '?'
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
                <span className="font-medium text-[#111827]">
                  {task?.assignee?.name || task?.creator?.name || 'Unassigned'}
                </span>
                {task?.dueDate && (
                  <span className="inline-flex items-center gap-1 bg-[#FEE2E2]/70 text-[#EF4444] text-xs font-semibold px-2 py-0.5 rounded-md">
                    📅{' '}
                    {new Date(task.dueDate).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                )}
              </div>
            </div>

            {/* Labels Row */}
            <div className="flex items-start gap-4">
              <span className="w-24 text-[#374151] font-semibold flex-shrink-0 mt-1">
                Labels
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {selectedLabels.length === 0 && (
                  <span className="text-xs text-[#9CA3AF]">No labels</span>
                )}
                {selectedLabels.map((lbl) => (
                  <span
                    key={lbl.id}
                    className="inline-flex items-center gap-1.5 bg-[#F3F4F6] text-[#4B5563] text-xs font-medium px-2.5 py-1 rounded-md"
                  >
                    <Tag
                      className="w-3 h-3"
                      style={{ color: lbl.color }}
                    />
                    <span>{lbl.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Resources Row */}
            <div className="flex items-start gap-4">
              <span className="w-24 text-[#374151] font-semibold flex-shrink-0 mt-1">
                Resources
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {apiAttachments.map((res) => (
                  <span
                    key={res.id}
                    className="inline-flex items-center gap-1.5 bg-[#F3F4F6] text-[#111827] text-xs font-medium px-2.5 py-1 rounded-md border border-[#E5E7EB]"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#6366F1]" />
                    <a
                      href={res.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      <span>{res.fileName}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(res.id)}
                      className="text-[#9CA3AF] hover:text-red-500 ml-1 p-0.5 rounded-sm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <button
                  type="button"
                  onClick={() => setIsResourceModalOpen(true)}
                  className="text-xs text-[#9CA3AF] hover:text-[#4B5563] flex items-center gap-1.5 transition-colors px-2 py-1 rounded-md hover:bg-[#F9FAFB]"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Add document...</span>
                </button>
              </div>
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="pt-4">
            <div className="flex items-center gap-2 text-[15px] font-semibold text-[#111827] mb-2 select-none">
              <ChevronDown className="w-4 h-4 text-[#6B7280]" />
              <span>Subtasks</span>
            </div>

            <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-[13px] font-medium text-[#6B7280]">
                      <th className="py-3 px-6 font-medium">Task</th>
                      <th className="py-3 px-6 font-medium w-36">Priority</th>
                      <th className="py-3 px-6 font-medium w-32">Members</th>
                      <th className="py-3 px-6 font-medium w-40">Due Date</th>
                      <th className="py-3 px-6 font-medium text-right w-24">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6] text-[14px]">
                    {subtasks.map((sub, sIdx) => (
                      <tr
                        key={sub.id}
                        className="hover:bg-[#F9FAFB]/70 transition-colors group select-none relative"
                      >
                        <td className="py-3.5 px-6 font-semibold text-[#111827]">
                          <span
                            className={
                              sub.isCompleted
                                ? 'line-through text-[#9CA3AF]'
                                : 'text-[#111827]'
                            }
                          >
                            {sub.title}
                          </span>
                        </td>
                        <td className="py-3.5 px-6">
                          <PriorityBadge priority={sub.priority} />
                        </td>
                        <td className="py-3.5 px-6">
                          {sub.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={sub.avatar}
                              alt={sub.assigneeName || 'User'}
                              className="w-6 h-6 rounded-full object-cover ring-1 ring-[#E5E7EB]"
                            />
                          ) : sub.assigneeName ? (
                            <div className="w-6 h-6 rounded-full bg-[#E5E7EB] text-[#4B5563] text-[10px] font-bold flex items-center justify-center">
                              {sub.assigneeName.slice(0, 2).toUpperCase()}
                            </div>
                          ) : (
                            <div className="relative inline-block">
                              <button
                                type="button"
                                onClick={() => {
                                  setSubtaskAssignIndex(sIdx);
                                  setIsMemberMenuOpen(true);
                                }}
                                className="w-6 h-6 rounded-full border border-dashed border-[#D1D5DB] text-[#9CA3AF] hover:border-[#9CA3AF] hover:text-[#4B5563] flex items-center justify-center text-xs transition-colors"
                                title="Assign Member"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-6 text-[#374151] font-medium text-[13px]">
                          {sub.dueDate}
                        </td>
                        <td className="py-3.5 px-6 text-right relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveSubtaskMenuId(
                                activeSubtaskMenuId === sub.id ? null : sub.id,
                              )
                            }
                            className="p-1 rounded-md text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4 inline-block" />
                          </button>
                          <TaskActionsMenu
                            isOpen={activeSubtaskMenuId === sub.id}
                            onClose={() => setActiveSubtaskMenuId(null)}
                            onToggleComplete={() =>
                              handleToggleCompleteSubtask(sub.id)
                            }
                            onDelete={() => handleDeleteSubtask(sub.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Subtasks button */}
              <button
                type="button"
                onClick={handleAddSubtask}
                className="w-full py-3.5 px-6 text-xs font-semibold text-[#6B7280] hover:text-[#111827] flex items-center gap-1.5 hover:bg-[#F9FAFB] cursor-pointer transition-colors border-t border-[#F3F4F6]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Subtasks</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="pt-6 space-y-4">
            <h3 className="text-[15px] font-semibold text-[#111827]">
              Comments
            </h3>

            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={comment.avatar || undefined}
                      alt={comment.author}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-[#E5E7EB]"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#111827]">
                        {comment.author}
                      </span>
                      <span className="text-xs text-[#9CA3AF]">
                        {comment.time}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[#9CA3AF] relative">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveEmojiCommentId(
                          activeEmojiCommentId === comment.id
                            ? null
                            : comment.id,
                        )
                      }
                      className="p-1 rounded-md hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
                      title="React with Emoji"
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                    <EmojiPickerPopover
                      isOpen={activeEmojiCommentId === comment.id}
                      onClose={() => setActiveEmojiCommentId(null)}
                      onSelectEmoji={(em) => handleToggleEmoji(comment.id, em)}
                    />

                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await deleteCommentMutation({
                            id: comment.id,
                            taskId: effectiveTaskId,
                          }).unwrap();
                        } catch {
                          showToast({ type: 'error', title: 'Failed', message: 'Could not delete comment' });
                        }
                      }}
                      className="p-1 rounded-md hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
                      title="Delete Comment"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-[#374151] pl-9.5 font-normal">
                  {comment.content}
                </p>

                {/* Reactions list */}
                {comment.reactions && comment.reactions.length > 0 && (
                  <div className="flex items-center gap-1.5 pl-9.5">
                    {comment.reactions.map((r, rIdx) => (
                      <button
                        key={rIdx}
                        type="button"
                        onClick={() => handleToggleEmoji(comment.id, r.emoji)}
                        className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 border transition-all ${
                          r.userReacted
                            ? 'bg-purple-50 border-purple-200 text-purple-800 font-semibold'
                            : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#4B5563]'
                        }`}
                      >
                        <span>{r.emoji}</span>
                        <span>{r.count}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Subtask replies list */}
                {comment.replies.map((rep) => (
                  <div
                    key={rep.id}
                    className="flex items-start gap-2.5 pl-9.5 pt-2 border-t border-[#F3F4F6]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rep.avatar}
                      alt={rep.author}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-[#E5E7EB]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#111827]">
                        {rep.author}
                      </span>
                      <p className="text-xs text-[#374151] mt-0.5">
                        {rep.content}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Leave a reply input */}
                <div className="flex items-center gap-2.5 pt-2 pl-9.5 border-t border-[#F3F4F6]">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#EC4899] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    D
                  </div>
                  <input
                    type="text"
                    placeholder="Leave a reply..."
                    value={replyText[comment.id] || ''}
                    onChange={(e) =>
                      setReplyText({ ...replyText, [comment.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddReply(comment.id);
                    }}
                    className="flex-1 text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#9CA3AF] hover:text-[#4B5563] p-1 rounded-md"
                    title="Attach File"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddReply(comment.id)}
                    className="text-[#9CA3AF] hover:text-[#111827] p-1 rounded-md"
                    title="Send Reply"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Bottom Add Comment Bar */}
            <form
              onSubmit={handleAddComment}
              className="bg-white border border-[#E5E7EB] rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] focus-within:ring-2 focus-within:ring-[#7C3AED]/20 focus-within:border-[#7C3AED] transition-all relative"
            >
              {commentAttachmentName && (
                <div className="flex items-center gap-1 bg-[#F3F4F6] text-xs font-semibold px-2 py-1 rounded-md text-[#111827]">
                  <FileText className="w-3 h-3 text-[#6366F1]" />
                  <span>{commentAttachmentName}</span>
                  <button
                    type="button"
                    onClick={() => setCommentAttachmentName(null)}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <input
                type="text"
                placeholder="Add a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 text-sm text-[#111827] placeholder:text-[#9CA3AF] bg-transparent focus:outline-none"
              />
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setCommentAttachmentName(e.target.files[0].name);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#9CA3AF] hover:text-[#4B5563] p-1 rounded-md transition-colors"
                title="Attach Document"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="submit"
                className="text-[#9CA3AF] hover:text-[#111827] p-1 rounded-md transition-colors"
                title="Post Comment"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT SIDEBAR COLUMN                                      */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Details Panel */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 relative">
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-[#111827]">
                <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                <span>Details</span>
              </div>
              <div className="flex items-center gap-1 text-[#9CA3AF]">
                <button
                  type="button"
                  onClick={() => setIsResourceModalOpen(true)}
                  className="p-1 rounded-md hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
                  title="Add Property / Resource"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-1 rounded-md hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
                  title="Task Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Properties List */}
            <div className="space-y-4 text-xs">
              {/* 1. Status Row */}
              <div className="flex items-center justify-between relative">
                <span className="text-[#6B7280] font-medium">Status</span>

                <button
                  type="button"
                  onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold hover:bg-[#F9FAFB] px-2 py-1 rounded-lg border border-transparent hover:border-[#E5E7EB] transition-all"
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: currentStatusInfo.dot }}
                  />
                  <span className={currentStatusInfo.text}>
                    {currentStatusInfo.label}
                  </span>
                </button>

                <StatusPickerPopover
                  isOpen={isStatusMenuOpen}
                  onClose={() => setIsStatusMenuOpen(false)}
                  selectedStatus={selectedStatus}
                  onSelectStatus={handleStatusChange}
                />
              </div>

              {/* 2. Priority Row */}
              <div className="flex items-center justify-between relative">
                <span className="text-[#6B7280] font-medium">Priority</span>

                <button
                  type="button"
                  onClick={() => setIsPriorityMenuOpen(!isPriorityMenuOpen)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#EF4444] hover:bg-[#F9FAFB] px-2 py-1 rounded-lg border border-transparent hover:border-[#E5E7EB] transition-all"
                >
                  <PriorityBadge priority={selectedPriority} />
                  <ChevronDown className="w-3 h-3 text-[#9CA3AF]" />
                </button>

                {isPriorityMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsPriorityMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-8 z-40 w-48 bg-white border border-[#E5E7EB] rounded-2xl p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100 select-none">
                      <p className="text-[11px] font-semibold text-[#9CA3AF] px-2.5 py-1 mb-1">
                        Priority
                      </p>
                      <div className="space-y-0.5">
                        {priorityOptions.map((opt) => {
                          const isSelected =
                            opt.value === selectedPriority ||
                            (opt.value === 'NONE' && !selectedPriority);
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                if (opt.value !== 'NONE') {
                                  handlePriorityChange(opt.value);
                                }
                                setIsPriorityMenuOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-[#F9FAFB] transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                {opt.value === 'NONE' ? (
                                  <span className="w-3.5 h-3.5 text-[#9CA3AF] text-center font-bold">
                                    •
                                  </span>
                                ) : (
                                  <PriorityBadge
                                    priority={opt.value as TaskPriority}
                                  />
                                )}
                                {opt.value === 'NONE' && (
                                  <span className="text-[#374151]">
                                    {opt.label}
                                  </span>
                                )}
                              </div>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#111827] stroke-[2.5]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 3. Members Row */}
              <div className="flex items-center justify-between relative">
                <span className="text-[#6B7280] font-medium">Members</span>

                <button
                  type="button"
                  onClick={() => {
                    setSubtaskAssignIndex(null);
                    setIsMemberMenuOpen(!isMemberMenuOpen);
                  }}
                  className="flex items-center gap-1.5 text-xs text-[#111827] hover:bg-[#F9FAFB] px-2 py-1 rounded-lg border border-transparent hover:border-[#E5E7EB] transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span className="font-semibold">
                    {selectedMembers.length > 0
                      ? selectedMembers.map((m) => m.name).join(', ')
                      : 'Add members'}
                  </span>
                </button>

                <MemberPickerPopover
                  isOpen={isMemberMenuOpen}
                  onClose={() => setIsMemberMenuOpen(false)}
                  selectedMemberIds={selectedMembers.map((m) => m.id)}
                  onToggleMember={handleToggleMember}
                  members={memberOptions}
                />
              </div>

              {/* 4. Dates Row */}
              <div className="flex items-center justify-between relative">
                <span className="text-[#6B7280] font-medium">Due date</span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setDateType('end');
                      setIsDatePickerOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-[#111827] shadow-2xs transition-colors"
                  >
                    <Calendar className="w-3 h-3 text-[#6B7280]" />
                    <span>{formatPillDate(endDate, 'Set due date')}</span>
                  </button>
                </div>

                <DatePickerPopover
                  isOpen={isDatePickerOpen}
                  onClose={() => setIsDatePickerOpen(false)}
                  selectedDate={endDate}
                  onSelectDate={handleSelectDate}
                />
              </div>

              {/* 5. Labels Row */}
              <div className="flex items-center justify-between relative">
                <span className="text-[#6B7280] font-medium">Labels</span>

                <button
                  type="button"
                  onClick={() => setIsLabelMenuOpen(!isLabelMenuOpen)}
                  className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] px-2 py-1 rounded-lg border border-transparent hover:border-[#E5E7EB] transition-colors"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>
                    {selectedLabels.length > 0
                      ? `${selectedLabels.length} labels`
                      : 'Add labels'}
                  </span>
                </button>

                <LabelPickerPopover
                  isOpen={isLabelMenuOpen}
                  onClose={() => setIsLabelMenuOpen(false)}
                  labels={labelOptions}
                  selectedLabelIds={selectedLabelIds}
                  onToggleLabel={handleToggleLabel}
                  onCreateLabel={handleCreateLabel}
                  isCreating={isCreatingLabel}
                />
              </div>

              {/* 6. Reporter Row */}
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280] font-medium">Reporter</span>
                <span className="text-xs font-semibold text-[#111827] px-2 py-1">
                  {task?.reporter?.name ||
                    task?.creator?.name ||
                    'Unassigned'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Updates Feed */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center gap-2 text-[15px] font-semibold text-[#111827]">
              <ChevronDown className="w-4 h-4 text-[#6B7280]" />
              <span>Updates</span>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              {updates.length === 0 && (
                <p className="text-[#9CA3AF]">No activity yet.</p>
              )}
              {updates.map((up) => (
                <div key={up.id} className="flex items-start gap-2.5">
                  {up.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={up.avatar}
                      alt={up.author}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-[#E5E7EB] flex-shrink-0 mt-0.5"
                    />
                  ) : up.icon === 'status' ? (
                    <div className="w-6 h-6 rounded-full bg-blue-50 text-[#3B82F6] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-red-50 text-[#EF4444] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Flame className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div>
                    <p className="text-[#111827] font-semibold">{up.author}</p>
                    <p className="text-[#6B7280] text-[11px] line-clamp-1">
                      {up.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resource Modal */}
      <ResourceModal
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        onUploadFile={handleUploadAttachment}
        isUploading={isUploading}
      />

      {/* Share Task Modal */}
      <ShareTaskModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        taskTitle={task?.title || 'Task'}
        projectId={task?.projectId}
      />

      {/* Feedback Toast */}
      <FeedbackToast toast={toast} onClose={() => setToast(null)} />

      {/* Task Settings Modal */}
      <TaskSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDeleteTask={async () => {
          setIsSettingsOpen(false);
          if (effectiveTaskId) {
            try {
              await deleteTaskMutation({ id: effectiveTaskId, projectId: task?.projectId }).unwrap();
              showToast({ type: 'success', title: 'Deleted', message: 'Task removed successfully' });
            } catch { /* ignore */ }
          }
          if (onBack) onBack();
        }}
      />
    </div>
  );
}
