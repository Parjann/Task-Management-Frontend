'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Columns,
  Filter,
  Plus,
  MoreHorizontal,
  X,
  Calendar,
} from 'lucide-react';
import { PriorityBadge } from '@/features/tasks/components/priority-badge';
import { TaskPriority, TaskStatus } from '@/features/tasks/types';
import { TaskActionsMenu } from '@/features/tasks/components/task-actions-menu';
import {
  FieldsPopover,
  ViewMode,
  VisibleFields,
} from '@/features/tasks/components/fields-popover';
import {
  CascadingFilterMenu,
  CascadingFilterState,
} from '@/features/tasks/components/cascading-filter-menu';
import { ProjectColumn } from './project-column';

export interface ProjectItem {
  id: string;
  name: string;
  priority: TaskPriority;
  status: TaskStatus;
  leadName?: string | null;
  leadAvatar?: string | null;
  dueDate: string;
}

import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
} from '../projectApi';

export function ProjectListView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(
    Boolean(searchQuery),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // RTK Query API Hooks (Live Database Data Only)
  const { data: apiProjects = [], isLoading } = useGetProjectsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createProjectMutation] = useCreateProjectMutation();
  const [deleteProjectMutation] = useDeleteProjectMutation();

  const projects: ProjectItem[] = useMemo(() => {
    if (!Array.isArray(apiProjects)) return [];
    return apiProjects.map((p) => ({
      id: p.id,
      name: p.name,
      priority: 'HIGH' as TaskPriority,
      status: 'TODO' as TaskStatus,
      leadName: p.owner?.name || 'Dexter',
      leadAvatar: p.owner?.avatarUrl || null,
      dueDate: '12 Sep 2026',
    }));
  }, [apiProjects]);

  // Keyboard shortcut listener (Cmd+F / Ctrl+F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setIsSearchExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape' && isSearchExpanded) {
        if (!searchQuery) {
          setIsSearchExpanded(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchExpanded, searchQuery]);

  const handleOpenSearch = () => {
    setIsSearchExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  // Fields and View Mode State (List vs Board) matching Tasks view
  const [isFieldsOpen, setIsFieldsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [visibleFields, setVisibleFields] = useState<VisibleFields>({
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: false,
    reporter: false,
  });

  const handleToggleField = (fieldKey: keyof VisibleFields) => {
    setVisibleFields((prev) => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }));
  };

  // Cascading Filter State matching Tasks view
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<CascadingFilterState>({
    priority: 'ALL',
    status: 'ALL',
    member: 'ALL',
    label: 'ALL',
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // New Project Form state
  const [newProjectName, setNewProjectName] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('HIGH');
  const [newStatus, setNewStatus] = useState<TaskStatus>('TODO');
  const [newDueDate, setNewDueDate] = useState('2026-09-25');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        if (
          !p.name.toLowerCase().includes(q) &&
          !(p.leadName || '').toLowerCase().includes(q) &&
          !p.priority.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      // 2. Cascading Priority Filter
      if (filters.priority !== 'ALL') {
        if (filters.priority === 'NONE' && p.priority) return false;
        if (filters.priority !== 'NONE' && p.priority !== filters.priority) {
          return false;
        }
      }

      // 3. Cascading Status Filter
      if (filters.status !== 'ALL' && p.status !== filters.status) {
        return false;
      }

      // 4. Cascading Member Filter
      if (filters.member !== 'ALL') {
        const lead = p.leadName || '';
        if (lead !== filters.member) {
          return false;
        }
      }

      return true;
    });
  }, [projects, searchQuery, filters]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const generatedKey =
        newProjectName
          .trim()
          .replace(/[^a-zA-Z]/g, '')
          .slice(0, 4)
          .toUpperCase() || 'PROJ';

      await createProjectMutation({
        name: newProjectName.trim(),
        key: generatedKey,
        description: 'New Project',
      }).unwrap();

      setNewProjectName('');
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProjectMutation(id).unwrap();
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const hasActiveFilters =
    filters.priority !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.member !== 'ALL' ||
    filters.label !== 'ALL';

  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'TODO', title: 'To Do' },
    { id: 'IN_PROGRESS', title: 'Doing' },
    { id: 'DONE', title: 'Completed' },
    { id: 'BACKLOG', title: 'On Hold' },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 p-6 md:p-8 bg-white overflow-hidden font-sans">
      {/* Top Header Row with Title and Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative">
        <h1 className="text-[26px] font-bold text-[#111827] tracking-tight">
          Projects
        </h1>

        <div className="flex items-center gap-2 flex-wrap relative">
          {/* Search Input Bar / Icon */}
          {isSearchExpanded ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white w-60 sm:w-72 md:w-80 shadow-2xs focus-within:ring-2 focus-within:ring-[#7C3AED]/20 focus-within:border-[#7C3AED] transition-all">
              <Search className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm text-[#111827] placeholder:text-[#9CA3AF] bg-transparent focus:outline-none"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-[#9CA3AF] hover:text-[#111827] p-0.5 rounded-md transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[11px] font-semibold text-[#9CA3AF] bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
                  ⌘F
                </kbd>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpenSearch}
              className="p-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#4B5563] hover:text-[#111827] transition-colors shadow-none"
              title="Search Projects (⌘F)"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Fields Button with List / Board Toggle & Checkboxes matching Tasks */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFieldsOpen(!isFieldsOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors shadow-none ${
                isFieldsOpen
                  ? 'border-[#18181B] bg-[#F9FAFB] text-[#111827]'
                  : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#374151] hover:text-[#111827]'
              }`}
            >
              <Columns className="w-4 h-4 text-[#6B7280]" />
              <span>Fields</span>
            </button>

            <FieldsPopover
              isOpen={isFieldsOpen}
              onClose={() => setIsFieldsOpen(false)}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              visibleFields={visibleFields}
              onToggleField={handleToggleField}
            />
          </div>

          {/* Filter Button with Cascading Flyout Menu */}
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

            <CascadingFilterMenu
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
      {/* Main View: Either Table List View or Kanban Board View */}
      {viewMode === 'board' ? (
        <div className="flex-1 flex items-start gap-5 overflow-x-auto pb-6 pt-1 select-none scrollbar-thin">
          {columns.map((col) => {
            const colProjects = filteredProjects.filter(
              (p) => p.status === col.id,
            );
            return (
              <ProjectColumn
                key={col.id}
                id={col.id}
                title={col.title}
                projects={colProjects}
                visibleFields={visibleFields}
                onAddProject={(status) => {
                  setNewStatus(status);
                  setIsAddModalOpen(true);
                }}
                onDeleteProject={handleDeleteProject}
              />
            );
          })}
        </div>
      ) : (
        /* Projects Table Card */
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
      )}

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
                  onChange={(e) =>
                    setNewPriority(e.target.value as TaskPriority)
                  }
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
