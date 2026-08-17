'use client';

import React from 'react';
import { GripVertical, Plus, MoreHorizontal } from 'lucide-react';
import { Task, TaskStatus } from '../types';
import { TaskCard } from './task-card';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onAddTask?: (status: TaskStatus) => void;
}

export function KanbanColumn({
  id,
  title,
  tasks,
  onAddTask,
}: KanbanColumnProps) {
  return (
    <div className="bg-[#F9FAFB] border border-[#E5E7EB]/80 rounded-2xl p-3.5 w-[310px] min-w-[310px] flex flex-col max-h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between px-1 py-1 mb-3">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-[#9CA3AF] cursor-grab active:cursor-grabbing" />
          <h2 className="text-[15px] font-semibold text-[#111827]">{title}</h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onAddTask?.(id)}
            className="p-1 rounded-md text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB]/70 transition-colors"
            title={`Add task to ${title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1 rounded-md text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB]/70 transition-colors"
            title="Column options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-3 overflow-y-auto flex-1 pr-0.5 pb-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Add Task Button at bottom */}
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
