'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Columns,
  Filter,
  Plus,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { PriorityBadge } from '@/features/tasks/components/priority-badge';
import { TaskPriority } from '@/features/tasks/types';
import { ProjectFieldsMenu } from './project-fields-menu';
import { TaskActionsMenu } from '@/features/tasks/components/task-actions-menu';
import {
  FilterPopover,
  FilterState,
} from '@/features/tasks/components/filter-popover';

export interface ProjectItem {
  id: string;
  name: string;
  priority: TaskPriority;
  leadName?: string | null;
  leadAvatar?: string | null;
  dueDate: string;
}

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'p-1',
    name: 'Design Homepage',
    priority: 'HIGH',
    leadName: 'Dexter',
    leadAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    dueDate: '12 Sep 2026',
  },
  {
    id: 'p-2',
    name: 'Develop Login Feature',
    priority: 'LOW',
    leadName: 'Carl Nuñez',
    leadAvatar: null,
    dueDate: '15 Sep 2026',
  },
  {
    id: 'p-3',
    name: 'Test Payment Gateway',
    priority: 'MEDIUM',
    leadName: null,
    leadAvatar: null,
    dueDate: '18 Sep 2026',
  },
];

export function ProjectListView() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isFieldsOpen, setIsFieldsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priorities: [],
    statuses: [],
    assignees: [],
    quickPreset: 'all',
  });
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<
    TaskPriority | 'NONE' | 'ALL'
  >('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // New Project Form state
  const [newProjectName, setNewProjectName] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('HIGH');
  const [newDueDate, setNewDueDate] = useState('2026-09-25');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        if (
          !p.name.toLowerCase().includes(q) &&
          !(p.leadName || '').toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      // Fields Menu Priority Filter
      if (
        selectedPriorityFilter !== 'ALL' &&
        p.priority !== selectedPriorityFilter
      ) {
        return false;
      }

      // Filter Popover Priority Filter
      if (
        filters.priorities.length > 0 &&
        !filters.priorities.includes(p.priority)
      ) {
        return false;
      }

      // Filter Popover Lead / Assignee Filter
      if (filters.assignees.length > 0) {
        const lead = p.leadName || '';
        if (!filters.assignees.includes(lead)) {
          return false;
        }
      }

      return true;
    });
  }, [projects, searchQuery, selectedPriorityFilter, filters]);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newProj: ProjectItem = {
      id: `p-${Date.now()}`,
      name: newProjectName.trim(),
      priority: newPriority,
      leadName: 'Dexter',
      leadAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      dueDate: newDueDate,
    };

    setProjects((prev) => [...prev, newProj]);
    setNewProjectName('');
    setIsAddModalOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const hasActiveFilters =
    filters.priorities.length > 0 ||
    filters.assignees.length > 0 ||
    (filters.quickPreset && filters.quickPreset !== 'all');

  return (
    <div className="flex-1 flex flex-col min-w-0 p-6 md:p-8 bg-white overflow-hidden font-sans">
      {/* Top Header Row with Title and Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative">
        <h1 className="text-[26px] font-bold text-[#111827] tracking-tight">
          Projects
        </h1>

        <div className="flex items-center gap-2 flex-wrap relative">
          {/* Expandable Search Input */}
          {isSearchExpanded ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white w-60 sm:w-72 shadow-2xs focus-within:border-[#7C3AED] transition-all">
              <Search className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full text-sm text-[#111827] placeholder:text-[#9CA3AF] bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchExpanded(false);
                }}
                className="text-[#9CA3AF] hover:text-[#111827]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsSearchExpanded(true)}
              className="p-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#4B5563] hover:text-[#111827] transition-colors"
              title="Search Projects"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Fields Filter Menu Trigger Button (Screenshot 4) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFieldsOpen(!isFieldsOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors ${
                isFieldsOpen
                  ? 'border-[#18181B] bg-[#F9FAFB] text-[#111827]'
                  : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#374151]'
              }`}
            >
              <Columns className="w-4 h-4 text-[#6B7280]" />
              <span>Fields</span>
            </button>

            <ProjectFieldsMenu
              isOpen={isFieldsOpen}
              onClose={() => setIsFieldsOpen(false)}
              selectedPriorityFilter={selectedPriorityFilter}
              onSelectPriorityFilter={(p) => setSelectedPriorityFilter(p)}
            />
          </div>

          {/* Filter Button with Active Indicator and Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2 rounded-xl border transition-colors shadow-none relative ${
                isFilterOpen || hasActiveFilters
                  ? 'border-[#18181B] bg-[#F9FAFB] text-[#111827]'
                  : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#4B5563] hover:text-[#111827]'
              }`}
              title="Filter Projects"
            >
              <Filter className="w-4 h-4" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#7C3AED] ring-2 ring-white" />
              )}
            </button>

            <FilterPopover
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>

          {/* Primary + Add Project Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#18181B] hover:bg-black text-white text-sm font-medium transition-all shadow-sm active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Projects Table Card - Perfectly matching Screenshot 1 & Screenshot 3 */}
      <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-[13px] font-medium text-[#6B7280]">
                <th className="py-3 px-6 font-medium">Projects</th>
                <th className="py-3 px-6 font-medium w-36">Priority</th>
                <th className="py-3 px-6 font-medium w-32">Lead</th>
                <th className="py-3 px-6 font-medium w-40">Due Date</th>
                <th className="py-3 px-6 font-medium text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] text-[14px]">
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  onClick={() => router.push(`/projects/${project.id}`)}
                  className="hover:bg-[#F9FAFB]/70 transition-colors group select-none cursor-pointer relative"
                >
                  {/* Project Name Link */}
                  <td className="py-3.5 px-6 font-semibold text-[#2563EB] hover:underline">
                    {project.name}
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-6">
                    <PriorityBadge priority={project.priority} />
                  </td>

                  {/* Lead */}
                  <td className="py-3.5 px-6">
                    {project.leadAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.leadAvatar}
                        alt={project.leadName || 'Lead'}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-[#E5E7EB]"
                      />
                    ) : project.leadName ? (
                      <div className="w-6 h-6 rounded-full bg-[#E5E7EB] text-[#4B5563] text-[10px] font-bold flex items-center justify-center">
                        {project.leadName.slice(0, 2).toUpperCase()}
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-dashed border-[#D1D5DB] text-[#9CA3AF] flex items-center justify-center text-xs">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-6 text-[#374151] font-medium text-[13px]">
                    {project.dueDate}
                  </td>

                  {/* Actions 3-dot Menu */}
                  <td className="py-3.5 px-6 text-right relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(
                          activeMenuId === project.id ? null : project.id,
                        );
                      }}
                      className="p-1 rounded-md text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4 inline-block" />
                    </button>
                    <TaskActionsMenu
                      isOpen={activeMenuId === project.id}
                      onClose={() => setActiveMenuId(null)}
                      onCopyLink={() =>
                        navigator.clipboard.writeText(
                          `${window.location.origin}/projects/${project.id}`,
                        )
                      }
                      onDelete={() => handleDeleteProject(project.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* + Add Projects bottom row */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="w-full py-3.5 px-6 text-xs font-semibold text-[#6B7280] hover:text-[#111827] flex items-center gap-1.5 hover:bg-[#F9FAFB] cursor-pointer transition-colors border-t border-[#F3F4F6]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Projects</span>
        </button>
      </div>

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150 select-none">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
              <h2 className="text-base font-bold text-[#111827]">
                Create New Project
              </h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#111827]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Homepage"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F3F4F6]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#4B5563] hover:bg-[#F3F4F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#18181B] hover:bg-black text-white text-xs font-medium"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
