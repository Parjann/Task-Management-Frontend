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
  Pencil,
  FileText,
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
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from '../projectApi';
import { FeedbackToast, ToastMessage } from '@/components/ui/feedback-toast';

export interface ProjectItem {
  id: string;
  name: string;
  key?: string;
  description?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  leadName?: string | null;
  leadAvatar?: string | null;
  dueDate: string | null;
  rawDueDate?: string | null;
  taskCount?: number;
}

export function ProjectListView() {
  const router = useRouter();

  // Search State with animated inline expanding input (matching TaskHeader)
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
  const [updateProjectMutation] = useUpdateProjectMutation();
  const [deleteProjectMutation] = useDeleteProjectMutation();

  const formatDueDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return null;
    }
  };

  const projects: ProjectItem[] = useMemo(() => {
    if (!Array.isArray(apiProjects)) return [];
    return apiProjects.map((p) => ({
      id: p.id,
      name: p.name,
      key: p.key,
      description: p.description || null,
      priority: (p.priority || 'MEDIUM') as TaskPriority,
      status: 'TODO' as TaskStatus,
      leadName: p.owner?.name || 'Unassigned',
      leadAvatar: p.owner?.avatarUrl || null,
      dueDate: formatDueDate(p.dueDate),
      rawDueDate: p.dueDate || null,
      taskCount: p._count?.tasks ?? 0,
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
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('MEDIUM');
  const [newDueDate, setNewDueDate] = useState('');

  // Edit Project Form state
  const [editingProject, setEditingProject] = useState<{
    id: string;
    name: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
  } | null>(null);

  const handleOpenEditModal = (project: ProjectItem) => {
    let dateStr = '';
    if (project.rawDueDate) {
      try {
        dateStr = new Date(project.rawDueDate).toISOString().split('T')[0];
      } catch {
        dateStr = '';
      }
    }
    setEditingProject({
      id: project.id,
      name: project.name,
      description: project.description || '',
      priority: project.priority || 'MEDIUM',
      dueDate: dateStr,
    });
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        if (
          !p.name.toLowerCase().includes(q) &&
          !(p.leadName || '').toLowerCase().includes(q) &&
          !p.priority.toLowerCase().includes(q) &&
          !(p.description || '').toLowerCase().includes(q)
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
        description: newDescription.trim() || 'New Project',
      }).unwrap();

      setNewProjectName('');
      setNewDescription('');
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

  const handleSaveEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.name.trim()) return;

    try {
      await updateProjectMutation({
        id: editingProject.id,
        body: {
          name: editingProject.name.trim(),
          description: editingProject.description.trim() || undefined,
        },
      }).unwrap();

      setEditingProject(null);
      showToast({
        type: 'success',
        title: 'Project Updated',
        message: `Project "${editingProject.name.trim()}" updated successfully!`,
      });
    } catch (err: any) {
      const errMsg =
        err?.data?.message || err?.message || 'Failed to update project.';
      showToast({
        type: 'error',
        title: 'Update Failed',
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

  const projectMembersList = useMemo(() => {
    const leads = projects.map((p) => p.leadName).filter(Boolean) as string[];
    return Array.from(new Set(leads)).map((name) => ({ id: name, name }));
  }, [projects]);

  const hasActiveFilters =
    filters.priority !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.member !== 'ALL' ||
    filters.label !== 'ALL';

  const boardColumns: { id: TaskStatus; title: string }[] = [
    { id: 'TODO', title: 'To Do' },
    { id: 'IN_PROGRESS', title: 'Doing' },
    { id: 'DONE', title: 'Completed' },
    { id: 'BACKLOG', title: 'Backlog' },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8 bg-white overflow-hidden font-sans relative">
      {/* Top Header Row with Title and Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative">
        <h1 className="text-[26px] font-bold text-[#111827] tracking-tight">
          Projects
        </h1>

        {/* Top Right Actions Group matching TaskHeader */}
        <div className="flex items-center gap-2 flex-wrap relative">
          {/* Animated Inline Search Input */}
          {isSearchExpanded ? (
            <div className="flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-2.5 py-1.5 focus-within:border-[#7C3AED] focus-within:bg-white transition-all w-48 sm:w-64">
              <Search className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Projects..."
                className="w-full bg-transparent text-xs text-[#111827] placeholder:text-[#9CA3AF] px-2 focus:outline-none"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[#9CA3AF] hover:text-[#111827] p-0.5 rounded-sm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchExpanded(false)}
                  className="text-[#9CA3AF] hover:text-[#111827] p-0.5 rounded-sm"
                  title="Close Search (Esc)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsSearchExpanded(true);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              className="p-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#4B5563] hover:text-[#111827] transition-colors"
              title="Search Projects (⌘F)"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Fields Button with List/Board View Switcher */}
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
              availableMembers={projectMembersList}
            />
          </div>

          {/* Primary + Add Project Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-medium transition-all shadow-xs active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Main View Area: Board or List */}
      {viewMode === 'board' ? (
        <div className="flex-1 flex gap-5 overflow-x-auto pb-4 pt-1 items-start min-h-0">
          {boardColumns.map((col) => {
            const colProjects = filteredProjects.filter((p) => p.status === col.id);
            return (
              <ProjectColumn
                key={col.id}
                id={col.id}
                title={col.title}
                projects={colProjects}
                visibleFields={visibleFields}
                onAddProject={() => setIsAddModalOpen(true)}
                onEditProject={handleOpenEditModal}
                onDeleteProject={handleDeleteProject}
              />
            );
          })}
        </div>
      ) : (
        /* Projects Table Container */
        <div className="w-full">
          <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] text-[#6B7280] font-semibold bg-[#FAFAFA]/60">
                    <th className="py-3 px-6">Projects</th>
                    {visibleFields.priority && (
                      <th className="py-3 px-6">Priority</th>
                    )}
                    {visibleFields.members && (
                      <th className="py-3 px-6">Lead</th>
                    )}
                    {visibleFields.dueDate && (
                      <th className="py-3 px-6">Due Date</th>
                    )}
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6] text-xs">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-xs text-[#9CA3AF]"
                      >
                        Loading projects...
                      </td>
                    </tr>
                  ) : filteredProjects.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-xs text-[#9CA3AF]"
                      >
                        No projects found.{' '}
                        {searchQuery ? 'Try changing your search.' : ''}
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((project) => (
                      <tr
                        key={project.id}
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
                        {visibleFields.priority && (
                          <td className="py-4 px-6">
                            <PriorityBadge priority={project.priority} />
                          </td>
                        )}

                        {/* Lead / Owner */}
                        {visibleFields.members && (
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
                                {project.leadName || 'Unassigned'}
                              </span>
                            </div>
                          </td>
                        )}

                        {/* Due Date */}
                        {visibleFields.dueDate && (
                          <td className="py-4 px-6 text-[#374151] font-medium text-[13px]">
                            {project.dueDate || '—'}
                          </td>
                        )}

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
                              onEdit={() => handleOpenEditModal(project)}
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
                  Project Name *
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
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="What is this project about?"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-none"
                />
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

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150 select-none">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
              <h3 className="text-sm font-bold text-[#111827]">
                Edit Project
              </h3>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#111827]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProject} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.name}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="What is this project about?"
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F3F4F6]">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#4B5563] hover:bg-[#F3F4F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#18181B] hover:bg-black text-white text-xs font-medium"
                >
                  Save Changes
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
