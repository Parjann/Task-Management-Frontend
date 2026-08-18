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
import { ResourceModal, ResourceItem } from './resource-modal';
import { ShareTaskModal } from './share-task-modal';
import { TaskSettingsModal } from './task-settings-modal';
import { EmojiPickerPopover } from './emoji-picker-popover';
import { TaskActionsMenu } from './task-actions-menu';

interface TaskDetailsViewProps {
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

export function TaskDetailsView({ task, onBack }: TaskDetailsViewProps) {
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
    task?.priority || 'HIGH',
  );
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(
    task?.status || 'BACKLOG',
  );

  // Members Picker state
  const [isMemberMenuOpen, setIsMemberMenuOpen] = useState(false);
  const [subtaskAssignIndex, setSubtaskAssignIndex] = useState<number | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<MemberOption[]>([
    {
      id: 'u-1',
      name: 'Dexter',
      email: 'dexter@taskflow.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    },
  ]);

  // Date Picker state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateType, setDateType] = useState<'start' | 'end'>('start');
  const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 0, 10));
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Labels Picker state
  const [isLabelMenuOpen, setIsLabelMenuOpen] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([
    'Research',
    'Design',
    'Development',
    'Testing',
    'Deployment',
  ]);

  // Attached Resources
  const [resources, setResources] = useState<ResourceItem[]>([
    {
      id: 'res-init-1',
      type: 'link',
      title: 'API Spec Documentation',
      url: 'https://docs.taskflow.com',
    },
  ]);

  // Subtasks list with active actions
  const [subtasks, setSubtasks] = useState([
    {
      id: 'sub-1',
      title: 'Subtask 1',
      priority: 'HIGH' as TaskPriority,
      assigneeName: 'Dexter',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      dueDate: '12 Sep 2026',
      isCompleted: false,
    },
    {
      id: 'sub-2',
      title: 'Subtask 2',
      priority: 'LOW' as TaskPriority,
      assigneeName: 'Carl Nuñez',
      avatar: null,
      dueDate: '15 Sep 2026',
      isCompleted: false,
    },
    {
      id: 'sub-3',
      title: 'Subtask 3',
      priority: 'MEDIUM' as TaskPriority,
      assigneeName: null,
      avatar: null,
      dueDate: '18 Sep 2026',
      isCompleted: false,
    },
  ]);
  const [activeSubtaskMenuId, setActiveSubtaskMenuId] = useState<string | null>(null);

  // Comments state with Emoji reactions & attachments
  const [comments, setComments] = useState([
    {
      id: 'c-1',
      author: 'Ankit Dutta',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      time: 'just now',
      content: 'dsds',
      reactions: [{ emoji: '🔥', count: 1, userReacted: true }],
      attachments: [] as string[],
      replies: [] as {
        id: string;
        author: string;
        avatar: string;
        content: string;
        time: string;
      }[],
    },
  ]);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [commentAttachmentName, setCommentAttachmentName] = useState<string | null>(null);
  const [activeEmojiCommentId, setActiveEmojiCommentId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timeline updates
  const [updates, setUpdates] = useState<UpdateItem[]>([
    {
      id: 'u-1',
      type: 'priority',
      author: 'You',
      text: 'changed priority from No priority to Ur...',
      icon: 'flame',
      avatar: null,
      time: 'Aug 2026',
    },
    {
      id: 'u-2',
      type: 'post',
      author: 'You',
      text: 'posted an update · Aug 2026',
      icon: null,
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      time: 'Aug 2026',
    },
  ]);

  // Handlers
  const handlePriorityChange = (newP: TaskPriority) => {
    setSelectedPriority(newP);
    setUpdates((prev) => [
      {
        id: `up-${Date.now()}`,
        type: 'priority',
        author: 'You',
        text: `changed priority to ${newP.toLowerCase()}`,
        icon: 'flame',
        avatar: null,
        time: 'Just now',
      },
      ...prev,
    ]);
  };

  const handleStatusChange = (newS: TaskStatus) => {
    setSelectedStatus(newS);
    setUpdates((prev) => [
      {
        id: `up-${Date.now()}`,
        type: 'status',
        author: 'You',
        text: `changed status to ${newS.toLowerCase()}`,
        icon: 'status',
        avatar: null,
        time: 'Just now',
      },
      ...prev,
    ]);
  };

  const handleToggleMember = (member: MemberOption) => {
    if (subtaskAssignIndex !== null) {
      setSubtasks((prev) =>
        prev.map((sub, idx) =>
          idx === subtaskAssignIndex
            ? {
                ...sub,
                assigneeName: member.name,
                avatar: member.avatarUrl || null,
              }
            : sub,
        ),
      );
      setSubtaskAssignIndex(null);
      return;
    }

    setSelectedMembers((prev) => {
      const exists = prev.some((m) => m.id === member.id);
      if (exists) return prev.filter((m) => m.id !== member.id);
      return [...prev, member];
    });
  };

  const handleToggleLabel = (labelName: string) => {
    setSelectedLabels((prev) => {
      const exists = prev.includes(labelName);
      if (exists) return prev.filter((l) => l !== labelName);
      return [...prev, labelName];
    });
  };

  const handleSelectDate = (date: Date) => {
    if (dateType === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const handleAddResource = (res: ResourceItem) => {
    setResources((prev) => [...prev, res]);
  };

  const handleRemoveResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddSubtask = () => {
    const num = subtasks.length + 1;
    setSubtasks((prev) => [
      ...prev,
      {
        id: `sub-${Date.now()}`,
        title: `Subtask ${num}`,
        priority: 'MEDIUM' as TaskPriority,
        assigneeName: null,
        avatar: null,
        dueDate: '20 Sep 2026',
        isCompleted: false,
      },
    ]);
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleCompleteSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isCompleted: !s.isCompleted } : s)),
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() && !commentAttachmentName) return;

    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        author: 'Dexter',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
        time: 'just now',
        content: newCommentText.trim(),
        reactions: [],
        attachments: commentAttachmentName ? [commentAttachmentName] : [],
        replies: [],
      },
    ]);
    setNewCommentText('');
    setCommentAttachmentName(null);
  };

  const handleAddReply = (commentId: string) => {
    const text = replyText[commentId];
    if (!text || !text.trim()) return;

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: `rep-${Date.now()}`,
                  author: 'Dexter',
                  avatar:
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
                  content: text.trim(),
                  time: 'just now',
                },
              ],
            }
          : c,
      ),
    );
    setReplyText((prev) => ({ ...prev, [commentId]: '' }));
  };

  const handleToggleEmoji = (commentId: string, emoji: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        const exists = c.reactions.find((r) => r.emoji === emoji);
        if (exists) {
          return {
            ...c,
            reactions: c.reactions
              .map((r) =>
                r.emoji === emoji
                  ? {
                      ...r,
                      count: r.userReacted ? r.count - 1 : r.count + 1,
                      userReacted: !r.userReacted,
                    }
                  : r,
              )
              .filter((r) => r.count > 0),
          };
        } else {
          return {
            ...c,
            reactions: [...c.reactions, { emoji, count: 1, userReacted: true }],
          };
        }
      }),
    );
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
                    setUpdates((prev) => [
                      {
                        id: `up-${Date.now()}`,
                        type: 'post',
                        author: 'You',
                        text: 'duplicated this task',
                        icon: null,
                        avatar: null,
                        time: 'Just now',
                      },
                      ...prev,
                    ]);
                  }}
                  onToggleComplete={() => handleStatusChange('DONE')}
                  onDelete={() => {
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
                <div className="w-5 h-5 rounded-full bg-[#E5E7EB] text-[#4B5563] font-bold text-[10px] flex items-center justify-center">
                  A
                </div>
                <span className="font-medium text-[#111827]">Designer</span>
                <span className="inline-flex items-center gap-1 bg-[#FEE2E2]/70 text-[#EF4444] text-xs font-semibold px-2 py-0.5 rounded-md">
                  📅 31 Jul
                </span>
              </div>
            </div>

            {/* Labels Row */}
            <div className="flex items-start gap-4">
              <span className="w-24 text-[#374151] font-semibold flex-shrink-0 mt-1">
                Labels
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {selectedLabels.map((lbl) => (
                  <span
                    key={lbl}
                    className="inline-flex items-center gap-1.5 bg-[#F3F4F6] text-[#4B5563] text-xs font-medium px-2.5 py-1 rounded-md"
                  >
                    <Tag className="w-3 h-3 text-[#6B7280]" />
                    <span>{lbl}</span>
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
                {resources.map((res) => (
                  <span
                    key={res.id}
                    className="inline-flex items-center gap-1.5 bg-[#F3F4F6] text-[#111827] text-xs font-medium px-2.5 py-1 rounded-md border border-[#E5E7EB]"
                  >
                    {res.type === 'file' ? (
                      <FileText className="w-3.5 h-3.5 text-[#6366F1]" />
                    ) : (
                      <LinkIcon className="w-3.5 h-3.5 text-[#3B82F6]" />
                    )}
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      <span>{res.title}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveResource(res.id)}
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
                  <span>Add document or link...</span>
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
              Subtasks
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
                      src={comment.avatar}
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
                      onClick={() => {
                        setComments((prev) =>
                          prev.filter((c) => c.id !== comment.id),
                        );
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
                />
              </div>

              {/* 4. Dates Row */}
              <div className="flex items-center justify-between relative">
                <span className="text-[#6B7280] font-medium">Dates</span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setDateType('start');
                      setIsDatePickerOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-[#111827] shadow-2xs transition-colors"
                  >
                    <Calendar className="w-3 h-3 text-[#6B7280]" />
                    <span>{formatPillDate(startDate, 'Jan 10')}</span>
                  </button>

                  <ArrowRight className="w-3 h-3 text-[#9CA3AF]" />

                  <button
                    type="button"
                    onClick={() => {
                      setDateType('end');
                      setIsDatePickerOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-[#6B7280] shadow-2xs transition-colors"
                  >
                    <Calendar className="w-3 h-3 text-[#6B7280]" />
                    <span>{formatPillDate(endDate, 'End')}</span>
                  </button>
                </div>

                <DatePickerPopover
                  isOpen={isDatePickerOpen}
                  onClose={() => setIsDatePickerOpen(false)}
                  selectedDate={dateType === 'start' ? startDate : endDate}
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
                  selectedLabels={selectedLabels}
                  onToggleLabel={handleToggleLabel}
                />
              </div>

              {/* 6. Teams Row */}
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280] font-medium">Teams</span>
                <button
                  type="button"
                  className="text-xs text-[#9CA3AF] hover:text-[#111827] px-2 py-1 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  Engineering
                </button>
              </div>

              {/* 7. Reporter Row */}
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280] font-medium">Reporter</span>
                <span className="text-xs font-semibold text-[#111827] px-2 py-1">
                  Dexter
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
        onAddResource={handleAddResource}
      />

      {/* Share Task Modal */}
      <ShareTaskModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        taskTitle={task?.title || 'Write API Documentation'}
      />

      {/* Task Settings Modal */}
      <TaskSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDeleteTask={() => {
          setIsSettingsOpen(false);
          if (onBack) onBack();
        }}
      />
    </div>
  );
}
