'use client';

import React, { useState } from 'react';
import { GripVertical, Plus, MoreHorizontal, ListPlus } from 'lucide-react';
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
  onEditProject?: (project: ProjectItem) => void;
  onDeleteProject?: (id: string) => void;
}

export function ProjectColumn({
  id,
  title,
  projects,
  visibleFields,
  onAddProject,
  onEditProject,
  onDeleteProject,
}: ProjectColumnProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-[#F9FAFB] border border-[#E5E7EB]/80 rounded-2xl p-3.5 w-[272px] min-w-[272px] sm:w-[310px] sm:min-w-[310px] flex flex-col max-h-full font-sans select-none">
      {/* Column Header matching KanbanColumn */}
      <div className="flex items-center justify-between px-1 py-1 mb-3">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-[#9CA3AF] cursor-grab active:cursor-grabbing" />
          <h2 className="text-[15px] font-semibold text-[#111827]">{title}</h2>
          <span className="text-xs text-[#9CA3AF] font-medium">({projects.length})</span>
        </div>

        <div className="flex items-center gap-1 relative">
          <button
            type="button"
            onClick={() => onAddProject?.(id)}
            className="p-1 rounded-md text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB]/70 transition-colors"
            title={`Add project to ${title}`}
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
                <div className="absolute right-0 top-full mt-1 z-50 w-44 bg-white border border-[#E5E7EB] rounded-2xl p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100 select-none font-sans">
                  <div className="px-2.5 py-1 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                    {title} Column
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onAddProject?.(id);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#374151] hover:bg-[#F9FAFB] hover:text-[#111827] transition-colors"
                  >
                    <ListPlus className="w-3.5 h-3.5 text-[#6B7280]" />
                    <span>Add Project</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Projects Cards List */}
      <div className="space-y-3 overflow-y-auto flex-1 pr-0.5 pb-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            visibleFields={visibleFields}
            onEdit={onEditProject}
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
