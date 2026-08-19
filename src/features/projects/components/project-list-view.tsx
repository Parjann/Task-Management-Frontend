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
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
} from '../projectApi';
import { FeedbackToast, ToastMessage } from '@/components/ui/feedback-toast';

export interface ProjectItem {
  id: string;
  name: string;
  priority: TaskPriority;
  status: TaskStatus;
  leadName?: string | null;
  leadAvatar?: string | null;
  dueDate: string;
}

export function ProjectListView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(
    Boolean(searchQuery),
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (toastData: ToastMessage) => {
    setToast(toastData);
    setTimeout(() => {
      setToast((current) =>
        current?.message === toastData.message ? null : current,
      );
    }, 4000);
  };

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

  // Fields and View Mode state
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

  // Filter State (Cascading Filter)
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
      const letters = newProjectName.replace(/[^a-zA-Z]/g, '').toUpperCase();
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let base = letters.slice(0, 3);
      if (base.length < 2) base = 'PR';
      const suffix =
        alphabet[Math.floor(Math.random() * alphabet.length)] +
        alphabet[Math.floor(Math.random() * alphabet.length)];
      const generatedKey = (base + suffix).slice(0, 5);

      await createProjectMutation({
        name: newProjectName.trim(),
        key: generatedKey,
        description: 'New Project',
      }).unwrap();

      setNewProjectName('');
      setIsAddModalOpen(false);
      showToast({
        type: 'success',
        title: 'Project Created',
        message: `Project "${newProjectName.trim()}" created successfully!`,
      });
    } catch (err: any) {
      const errMsg =
        err?.data?.message ||
        err?.message ||
        'Failed to create project. Please try again.';
      showToast({
        type: 'error',
        title: 'Creation Failed',
        message: Array.isArray(errMsg) ? errMsg.join(', ') : errMsg,
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProjectMutation(id).unwrap();
      showToast({
        type: 'success',
        title: 'Project Deleted',
        message: 'Project removed successfully.',
      });
    } catch (err: any) {
      const errMsg =
        err?.data?.message || err?.message || 'Failed to delete project.';
      showToast({
        type: 'error',
        title: 'Delete Failed',
        message: Array.isArray(errMsg) ? errMsg.join(', ') : errMsg,
      });
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
    <div className="flex-1 flex flex-col min-w-0 p-6 md:p-8 bg-white overflow-hidden font-sans relative">
      {/* Top Header Row with Title and Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative">
        <h1 className="text-[26px] font-bold text-[#111827] tracking-tight">
          Projects
        </h1>

        <div className="flex items-center gap-2 flex-wrap relative">
          {/* 1. Animated Search Input */}
          <div className="relative flex items-center">
            {isSearchExpanded ? (
              <div className="relative flex items-center animate-in fade-in zoom-in-95 duration-150">
                <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-44 md:w-56 pl-8 pr-7 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#7C3AED] transition-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchExpanded(false);
                  }}
                  className="absolute right-2 text-[#9CA3AF] hover:text-[#111827] p-0.5 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsSearchExpanded(true);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className="h-8 px-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                title="Search projects (⌘F)"
              >
                <Search className="w-3.5 h-3.5 text-[#6B7280]" />
                <span className="hidden sm:inline">Search</span>
              </button>
            )}
          </div>

          {/* 2. Fields Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFieldsOpen(!isFieldsOpen)}
              className={`h-8 px-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                isFieldsOpen
                  ? 'bg-[#F3F4F6] border-[#D1D5DB] text-[#111827]'
                  : 'bg-white border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]'
              }`}
            >
              <Columns className="w-3.5 h-3.5 text-[#6B7280]" />
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

          {/* 3. Filter Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`h-8 px-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                hasActiveFilters || isFilterOpen
                  ? 'bg-[#F3F4F6] border-[#D1D5DB] text-[#111827]'
                  : 'bg-white border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]'
              }`}
            >
              <Filter
                className={`w-3.5 h-3.5 ${
                  hasActiveFilters ? 'text-[#7C3AED]' : 'text-[#6B7280]'
                }`}
              />
              <span>Filter</span>
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] ml-0.5" />
              )}
            </button>

            <CascadingFilterMenu
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>

          {/* 4. Add Project Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="h-8 px-3 rounded-xl bg-[#18181B] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ml-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
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
                onAddProject={() => setIsAddModalOpen(true)}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-6 pt-1">
          <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse select-none">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-[13px] font-medium text-[#6B7280]">
                    <th className="py-3.5 px-6 font-medium">Projects</th>
                    <th className="py-3.5 px-6 font-medium w-36">Priority</th>
                    <th className="py-3.5 px-6 font-medium w-36">Lead</th>
                    <th className="py-3.5 px-6 font-medium w-40">Due Date</th>
                    <th className="py-3.5 px-6 font-medium text-right w-20">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6] text-[14px]">
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-10 text-center text-xs text-[#9CA3AF]"
                      >
                        {isLoading
                          ? 'Loading projects...'
                          : searchQuery
                          ? 'No projects match your search.'
                          : 'No projects yet. Click "Add Project" to create your first project!'}
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((project) => (
                      <tr
                        key={project.id}
                        onClick={() => router.push(`/projects/${project.id}`)}
                        className="hover:bg-[#F9FAFB]/70 transition-colors group cursor-pointer"
                      >
                        {/* Project Name */}
                        <td className="py-4 px-6 font-semibold text-[#111827] group-hover:text-[#6366F1] transition-colors">
                          <Link
                            href={`/projects/${project.id}`}
                            className="hover:underline"
                          >
                            {project.name}
                          </Link>
                        </td>

                        {/* Priority */}
                        <td className="py-4 px-6">
                          <PriorityBadge priority={project.priority} />
                        </td>

                        {/* Lead / Owner */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {project.leadAvatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={project.leadAvatar}
                                alt={project.leadName || 'Lead'}
                                className="w-6 h-6 rounded-full object-cover ring-1 ring-[#E5E7EB]"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white text-[10px] font-bold">
                                {project.leadName
                                  ? project.leadName.slice(0, 1).toUpperCase()
                                  : 'D'}
                              </div>
                            )}
                            <span className="text-[13px] font-medium text-[#374151]">
                              {project.leadName || 'Dexter'}
                            </span>
                          </div>
                        </td>

                        {/* Due Date */}
                        <td className="py-4 px-6 text-[#374151] font-medium text-[13px]">
                          {project.dueDate}
                        </td>

                        {/* Actions Menu */}
                        <td className="py-4 px-6 text-right relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setActiveMenuId(
                                activeMenuId === project.id ? null : project.id,
                              );
                            }}
                            className="p-1 rounded-md text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4 inline-block" />
                          </button>

                          <div onClick={(e) => e.stopPropagation()}>
                            <TaskActionsMenu
                              isOpen={activeMenuId === project.id}
                              onClose={() => setActiveMenuId(null)}
                              onCopyLink={() => {
                                if (typeof window !== 'undefined') {
                                  navigator.clipboard?.writeText(
                                    `${window.location.origin}/projects/${project.id}`,
                                  );
                                }
                              }}
                              onDelete={() => handleDeleteProject(project.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Add Project Action */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="w-full py-3.5 px-6 text-xs font-semibold text-[#6B7280] hover:text-[#111827] flex items-center gap-1.5 hover:bg-[#F9FAFB] cursor-pointer transition-colors border-t border-[#F3F4F6]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150 select-none">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
              <h3 className="text-sm font-bold text-[#111827]">
                Create New Project
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#111827]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Homepage"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
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

      {/* Feedback Toast */}
      <FeedbackToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
