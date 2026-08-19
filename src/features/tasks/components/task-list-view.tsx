'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Plus, MoreHorizontal } from 'lucide-react';
import { Task, TaskStatus } from '../types';
import { PriorityBadge } from './priority-badge';
import { TaskActionsMenu } from './task-actions-menu';

interface TaskListViewProps {
  tasks: Task[];
  onAddTask?: (status: TaskStatus) => void;
  onDeleteTask?: (id: string) => void;
}

export function TaskListView({
  tasks,
  onAddTask,
  onDeleteTask,
}: TaskListViewProps) {
  const router = useRouter();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Collapsed sections state
  const [collapsedSections, setCollapsedSections] = useState<
    Record<TaskStatus, boolean>
  >({
    TODO: false,
    IN_PROGRESS: false,
    DONE: false,
    BACKLOG: false,
    IN_REVIEW: false,
    CANCELED: false,
  });

  const toggleSection = (status: TaskStatus) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const sections: { id: TaskStatus; label: string }[] = [
    { id: 'TODO', label: 'To Do' },
    { id: 'IN_PROGRESS', label: 'Doing' },
    { id: 'DONE', label: 'Completed' },
  ];

  const formatDate = (dateStr?: string | null, fallback = '12 Sep 2026') => {
    if (!dateStr) return fallback;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return fallback;
    }
  };

  return (
    <div className="space-y-6 select-none font-sans">
      {sections.map((section) => {
        const sectionTasks = tasks.filter((t) => t.status === section.id);
        const isCollapsed = collapsedSections[section.id];

        return (
          <div key={section.id} className="space-y-2">
            {/* Section Header Accordion trigger */}
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="flex items-center gap-2 text-[15px] font-bold text-[#111827] hover:text-black transition-colors group cursor-pointer"
            >
              <ChevronDown
                className={`w-4 h-4 text-[#9CA3AF] group-hover:text-[#111827] transition-transform duration-200 ${
                  isCollapsed ? '-rotate-90' : 'rotate-0'
                }`}
              />
              <span>{section.label}</span>
              <span className="text-xs font-semibold text-[#9CA3AF] ml-1">
                ({sectionTasks.length})
              </span>
            </button>

            {/* Section Table Card */}
            {!isCollapsed && (
              <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-[13px] font-medium text-[#6B7280]">
                        <th className="py-3 px-6 font-medium">Tasks</th>
                        <th className="py-3 px-6 font-medium w-36">Priority</th>
                        <th className="py-3 px-6 font-medium w-32">Members</th>
                        <th className="py-3 px-6 font-medium w-40">Due Date</th>
                        <th className="py-3 px-6 font-medium text-right w-24">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3F4F6] text-[14px]">
                      {sectionTasks.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-6 text-center text-xs text-[#9CA3AF]"
                          >
                            No tasks in this section
                          </td>
                        </tr>
                      ) : (
                        sectionTasks.map((task, idx) => {
                          const assigneeName =
                            task.assignee?.name || task.creator?.name;
                          const assigneeAvatar =
                            task.assignee?.avatarUrl || task.creator?.avatarUrl;

                          const defaultDates = [
                            '12 Sep 2026',
                            '15 Sep 2026',
                            '18 Sep 2026',
                          ];
                          const displayDate = formatDate(
                            task.dueDate,
                            defaultDates[idx % defaultDates.length],
                          );

                          return (
                            <tr
                              key={task.id}
                              onClick={() => router.push(`/tasks/${task.id}`)}
                              className="hover:bg-[#F9FAFB]/70 transition-colors group select-none cursor-pointer relative"
                            >
                              {/* Task Name */}
                              <td className="py-3.5 px-6 font-semibold text-[#111827] group-hover:text-[#6366F1] transition-colors">
                                {task.title}
                              </td>

                              {/* Priority */}
                              <td className="py-3.5 px-6">
                                <PriorityBadge priority={task.priority} />
                              </td>

                              {/* Members / Assignee */}
                              <td className="py-3.5 px-6">
                                {assigneeAvatar ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={assigneeAvatar}
                                    alt={assigneeName || 'Member'}
                                    className="w-6 h-6 rounded-full object-cover ring-1 ring-[#E5E7EB]"
                                  />
                                ) : assigneeName ? (
                                  <div className="w-6 h-6 rounded-full bg-[#E5E7EB] text-[#4B5563] text-[10px] font-bold flex items-center justify-center">
                                    {assigneeName.slice(0, 2).toUpperCase()}
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                    className="w-6 h-6 rounded-full border border-dashed border-[#D1D5DB] text-[#9CA3AF] hover:border-[#9CA3AF] hover:text-[#4B5563] flex items-center justify-center text-xs transition-colors"
                                    title="Add Member"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </td>

                              {/* Due Date */}
                              <td className="py-3.5 px-6 text-[#374151] font-medium text-[13px]">
                                {displayDate}
                              </td>

                              {/* Actions */}
                              <td className="py-3.5 px-6 text-right relative">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setActiveMenuId(
                                      activeMenuId === task.id ? null : task.id,
                                    );
                                  }}
                                  className="p-1 rounded-md text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
                                >
                                  <MoreHorizontal className="w-4 h-4 inline-block" />
                                </button>
                                <div onClick={(e) => e.stopPropagation()}>
                                  <TaskActionsMenu
                                    isOpen={activeMenuId === task.id}
                                    onClose={() => setActiveMenuId(null)}
                                    onCopyLink={() =>
                                      navigator.clipboard.writeText(
                                        `${window.location.origin}/tasks/${task.id}`,
                                      )
                                    }
                                    onDelete={() => onDeleteTask?.(task.id)}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* + Add Task button at the bottom of the table card */}
                <button
                  type="button"
                  onClick={() => onAddTask?.(section.id)}
                  className="w-full py-3.5 px-6 text-xs font-semibold text-[#6B7280] hover:text-[#111827] flex items-center gap-1.5 hover:bg-[#F9FAFB] cursor-pointer transition-colors border-t border-[#F3F4F6]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
