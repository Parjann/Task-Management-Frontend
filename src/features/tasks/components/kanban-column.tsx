'use client';

import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  GripVertical,
  Plus,
  MoreHorizontal,
  ArrowUpDown,
  Trash2,
  ListPlus,
} from 'lucide-react';
import { Task, TaskStatus } from '../types';
import { TaskCard } from './task-card';
import { VisibleFields } from './fields-popover';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  visibleFields?: VisibleFields;
  onAddTask?: (status: TaskStatus) => void;
  onDeleteTask?: (id: string) => void;
}

export function KanbanColumn({
  id,
  title,
  tasks,
  visibleFields,
  onAddTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'priority' | 'date' | 'title'>('default');

  const sortedTasks = React.useMemo(() => {
    if (sortBy === 'default') return tasks;
    const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    const copy = [...tasks];
    if (sortBy === 'priority') {
      return copy.sort((a, b) => {
        const pA = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4;
        const pB = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4;
        return pA - pB;
      });
    }
    if (sortBy === 'date') {
      return copy.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }
    if (sortBy === 'title') {
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    }
    return copy;
  }, [tasks, sortBy]);

  return (
    <div
      className={`bg-[#F9FAFB] border rounded-2xl p-3.5 w-[272px] min-w-[272px] sm:w-[310px] sm:min-w-[310px] flex flex-col max-h-full transition-colors ${
        isOver ? 'border-[#7C3AED] bg-[#F5F3FF]' : 'border-[#E5E7EB]/80'
      }`}
    >
      <div className="flex items-center justify-between px-1 py-1 mb-3">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-[#9CA3AF]" />
          <h2 className="text-[15px] font-semibold text-[#111827]">{title}</h2>
          <span className="text-xs text-[#9CA3AF] font-medium">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-1 relative">
          <button
            type="button"
            onClick={() => onAddTask?.(id)}
            className="p-1 rounded-md text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB]/70 transition-colors"
            title={`Add task to ${title}`}
          >
            <Plus className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-1 rounded-md transition-colors ${
                isMenuOpen
                  ? 'bg-[#E5E7EB] text-[#111827]'
                  : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB]/70'
              }`}
              title="Column options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-50 w-48 bg-white border border-[#E5E7EB] rounded-2xl p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100 select-none font-sans">
                  <div className="px-2.5 py-1 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                    {title} Column
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onAddTask?.(id);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#374151] hover:bg-[#F9FAFB] hover:text-[#111827] transition-colors"
                  >
                    <ListPlus className="w-3.5 h-3.5 text-[#6B7280]" />
                    <span>Add Task</span>
                  </button>

                  <div className="my-1 border-t border-[#F3F4F6]" />

                  <div className="px-2.5 py-1 text-[10px] font-semibold text-[#9CA3AF]">
                    Sort By
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSortBy('default');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      sortBy === 'default'
                        ? 'bg-[#F3F4F6] text-[#111827] font-semibold'
                        : 'text-[#374151] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    <span>Default Order</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSortBy('priority');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      sortBy === 'priority'
                        ? 'bg-[#F3F4F6] text-[#111827] font-semibold'
                        : 'text-[#374151] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    <span>Priority (Highest first)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSortBy('date');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      sortBy === 'date'
                        ? 'bg-[#F3F4F6] text-[#111827] font-semibold'
                        : 'text-[#374151] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    <span>Due Date (Earliest first)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSortBy('title');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      sortBy === 'title'
                        ? 'bg-[#F3F4F6] text-[#111827] font-semibold'
                        : 'text-[#374151] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    <span>Name (A - Z)</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="space-y-3 overflow-y-auto flex-1 pr-0.5 pb-2 min-h-[80px]"
      >
        <SortableContext
          items={sortedTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              visibleFields={visibleFields}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>
      </div>

      <button
        type="button"
        onClick={() => onAddTask?.(id)}
        className="mt-2 flex items-center gap-1.5 p-2 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB]/60 text-[13px] font-medium transition-colors w-full"
      >
        <Plus className="w-4 h-4" />
        <span>Add Task</span>
      </button>
    </div>
  );
}
