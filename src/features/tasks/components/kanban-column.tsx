'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { GripVertical, Plus, MoreHorizontal } from 'lucide-react';
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

      <div
        ref={setNodeRef}
        className="space-y-3 overflow-y-auto flex-1 pr-0.5 pb-2 min-h-[80px]"
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
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
