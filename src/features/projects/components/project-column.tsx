'use client';

import React from 'react';
import { GripVertical, Plus, MoreHorizontal } from 'lucide-react';
import { TaskStatus } from '@/features/tasks/types';
import { ProjectItem } from './project-list-view';
import { ProjectCard } from './project-card';
import { VisibleFields } from '@/features/tasks/components/fields-popover';

interface ProjectColumnProps {
  id: TaskStatus;
  title: string;
  projects: ProjectItem[];
  visibleFields?: VisibleFields;
  onAddProject?: (status: TaskStatus) => void;
  onDeleteProject?: (id: string) => void;
}

export function ProjectColumn({
  id,
  title,
  projects,
  visibleFields,
  onAddProject,
  onDeleteProject,
}: ProjectColumnProps) {
  return (
    <div className="bg-[#F9FAFB] border border-[#E5E7EB]/80 rounded-2xl p-3.5 w-[272px] min-w-[272px] sm:w-[310px] sm:min-w-[310px] flex flex-col max-h-full font-sans select-none">
      {/* Column Header matching KanbanColumn */}
      <div className="flex items-center justify-between px-1 py-1 mb-3">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-[#9CA3AF] cursor-grab active:cursor-grabbing" />
          <h2 className="text-[15px] font-semibold text-[#111827]">{title}</h2>
          <span className="text-xs text-[#9CA3AF] font-medium">({projects.length})</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onAddProject?.(id)}
            className="p-1 rounded-md text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB]/70 transition-colors"
            title={`Add project to ${title}`}
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

      {/* Projects Cards List */}
      <div className="space-y-3 overflow-y-auto flex-1 pr-0.5 pb-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            visibleFields={visibleFields}
            onDelete={onDeleteProject}
          />
        ))}
      </div>

      {/* Add Project Button at bottom */}
      <button
        type="button"
        onClick={() => onAddProject?.(id)}
        className="mt-2 flex items-center gap-1.5 p-2 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB]/60 text-[13px] font-medium transition-colors w-full"
      >
        <Plus className="w-4 h-4" />
        <span>Add Project</span>
      </button>
    </div>
  );
}
