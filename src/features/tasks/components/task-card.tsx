'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Tag, MoreHorizontal } from 'lucide-react';
import { Task } from '../types';
import { VisibleFields } from './fields-popover';
import { TaskActionsMenu } from './task-actions-menu';

interface TaskCardProps {
  task: Task;
  visibleFields?: VisibleFields;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  isDragging?: boolean;
  sortable?: boolean;
}

function TaskCardContent({
  task,
  visibleFields = {
    priority: false,
    members: true,
    dueDate: true,
    labels: true,
    status: false,
    reporter: false,
  },
  onDelete,
  style,
  listeners,
  attributes,
  setNodeRef,
  className,
}: TaskCardProps & {
  style?: React.CSSProperties;
  listeners?: Record<string, any>;
  attributes?: Record<string, any>;
  setNodeRef?: (node: HTMLElement | null) => void;
  className?: string;
}) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const assigneeName = task.assignee?.name || task.creator?.name || 'Unassigned';
  const assigneeAvatar = task.assignee?.avatarUrl || task.creator?.avatarUrl;
  const labels = task.labels || [];

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      });
    } catch {
      return null;
    }
  };

  const dueLabel = formatDate(task.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => router.push(`/tasks/${task.id}`)}
      className={
        className ||
        'bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all cursor-grab active:cursor-grabbing group select-none relative'
      }
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[14px] font-semibold text-[#111827] group-hover:text-[#6366F1] transition-colors leading-snug line-clamp-2">
          {task.title}
        </h3>
        <div className="relative">
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="text-[#9CA3AF] hover:text-[#4B5563] p-1 rounded-md hover:bg-[#F3F4F6] transition-colors -mr-1 -mt-1"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            <TaskActionsMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onCopyLink={() =>
                navigator.clipboard.writeText(
                  `${window.location.origin}/tasks/${task.id}`,
                )
              }
              onDelete={() => onDelete?.(task.id)}
            />
          </div>
        </div>
      </div>

      {visibleFields.priority && (
        <div className="mt-2 text-xs font-semibold text-[#6B7280]">
          Priority: <span className="text-[#111827]">{task.priority}</span>
        </div>
      )}

      {(visibleFields.members || visibleFields.dueDate) && (
        <div className="flex items-center justify-between gap-2 mt-3.5">
          {visibleFields.members ? (
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
          ) : (
            <div />
          )}

          {visibleFields.dueDate && dueLabel && (
            <div className="flex items-center gap-1 bg-[#FEE2E2]/70 text-[#EF4444] text-xs font-semibold px-2 py-0.5 rounded-md flex-shrink-0">
              <Calendar className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>{dueLabel}</span>
            </div>
          )}
        </div>
      )}

      {visibleFields.labels && labels.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-1">
          {labels.map((item, idx) => (
            <div
              key={item.labelId || item.label?.id || idx}
              className="flex items-center gap-1 bg-[#F3F4F6] text-[#4B5563] text-xs font-medium px-2 py-0.5 rounded-md"
            >
              <Tag
                className="w-3 h-3"
                style={{ color: item.label?.color || '#6B7280' }}
              />
              <span>{item.label?.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TaskCard({
  task,
  visibleFields,
  onDelete,
  isDragging = false,
  sortable = true,
}: TaskCardProps) {
  if (!sortable) {
    return (
      <TaskCardContent
        task={task}
        visibleFields={visibleFields}
        onDelete={onDelete}
        className={`bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-lg select-none relative ${
          isDragging ? 'opacity-90 rotate-1' : ''
        }`}
      />
    );
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  return (
    <TaskCardContent
      task={task}
      visibleFields={visibleFields}
      onDelete={onDelete}
      setNodeRef={setNodeRef}
      attributes={attributes}
      listeners={listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isSortableDragging || isDragging ? 0.4 : 1,
      }}
    />
  );
}
