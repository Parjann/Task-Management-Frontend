'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Tag, MoreHorizontal } from 'lucide-react';
import { ProjectItem } from './project-list-view';
import { VisibleFields } from '@/features/tasks/components/fields-popover';
import { PriorityBadge } from '@/features/tasks/components/priority-badge';
import { TaskActionsMenu } from '@/features/tasks/components/task-actions-menu';

interface ProjectCardProps {
  project: ProjectItem;
  visibleFields?: VisibleFields;
  onDelete?: (id: string) => void;
}

export function ProjectCard({
  project,
  visibleFields = {
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: false,
    reporter: false,
  },
  onDelete,
}: ProjectCardProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const leadName = project.leadName || 'Unassigned';
  const leadAvatar = project.leadAvatar;

  return (
    <div
      onClick={() => router.push(`/projects/${project.id}`)}
      className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all cursor-pointer group select-none relative"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-[14px] font-semibold text-[#111827] group-hover:text-[#2563EB] transition-colors leading-snug line-clamp-2">
            {project.name}
          </h3>
          {project.key && (
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">{project.key}</p>
          )}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="text-[#9CA3AF] hover:text-[#4B5563] p-1 rounded-md hover:bg-[#F3F4F6] transition-colors -mr-1 -mt-1"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <TaskActionsMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onCopyLink={() =>
              navigator.clipboard.writeText(
                `${window.location.origin}/projects/${project.id}`,
              )
            }
            onDelete={() => onDelete?.(project.id)}
          />
        </div>
      </div>

      {visibleFields.priority && (
        <div className="mt-2.5 flex items-center gap-1.5">
          <PriorityBadge priority={project.priority} />
        </div>
      )}

      {(visibleFields.members || visibleFields.dueDate) && (
        <div className="flex items-center justify-between gap-2 mt-3.5">
          {visibleFields.members ? (
            <div className="flex items-center gap-2 min-w-0">
              {leadAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={leadAvatar}
                  alt={leadName}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-[#E5E7EB]"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white font-bold text-[10px]">
                  {leadName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-[13px] font-medium text-[#374151] truncate">
                {leadName}
              </span>
            </div>
          ) : (
            <div />
          )}

          {visibleFields.dueDate && project.dueDate && (
            <div className="flex items-center gap-1 bg-[#FEE2E2]/70 text-[#EF4444] text-xs font-semibold px-2 py-0.5 rounded-md flex-shrink-0">
              <Calendar className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>{project.dueDate}</span>
            </div>
          )}
        </div>
      )}

      {visibleFields.labels && typeof project.taskCount === 'number' && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-1">
          <div className="flex items-center gap-1 bg-[#F3F4F6] text-[#4B5563] text-xs font-medium px-2 py-0.5 rounded-md">
            <Tag className="w-3 h-3 text-[#6B7280]" />
            <span>
              {project.taskCount} task{project.taskCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
