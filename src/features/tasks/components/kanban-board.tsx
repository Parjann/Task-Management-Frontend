'use client';

import React, { useState, useMemo } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types';
import { KanbanColumn } from './kanban-column';
import { TaskHeader } from './task-header';
import { CreateTaskModal } from './create-task-modal';
import { TaskListView } from './task-list-view';
import { ViewMode, VisibleFields } from './fields-popover';
import { CascadingFilterState } from './cascading-filter-menu';
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useMoveTaskMutation,
  useDeleteTaskMutation,
} from '../taskApi';
import { useGetProjectsQuery, useCreateProjectMutation } from '@/features/projects';

export function KanbanBoard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [targetColumnStatus, setTargetColumnStatus] =
    useState<TaskStatus>('TODO');

  // RTK Query API Hooks (Live Database Data Only)
  const { data: apiTasks = [], isLoading: isTasksLoading } = useGetTasksQuery(
    { search: searchQuery || undefined },
    { refetchOnMountOrArgChange: true },
  );
  const { data: apiProjects = [] } = useGetProjectsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [createTaskMutation] = useCreateTaskMutation();
  const [createProjectMutation] = useCreateProjectMutation();
  const [deleteTaskMutation] = useDeleteTaskMutation();
  const [moveTaskMutation] = useMoveTaskMutation();

  const tasks = Array.isArray(apiTasks) ? apiTasks : [];

  // Fields and View Mode State
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

  // Filter State (Cascading Filter)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<CascadingFilterState>({
    priority: 'ALL',
    status: 'ALL',
    member: 'ALL',
    label: 'ALL',
  });

  const handleToggleField = (fieldKey: keyof VisibleFields) => {
    setVisibleFields((prev) => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }));
  };

  const handleOpenAddModal = (status: TaskStatus = 'TODO') => {
    setTargetColumnStatus(status);
    setIsCreateModalOpen(true);
  };

  const handleCreateTask = async (newTaskData: {
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeName: string;
    dueDate: string;
    label: string;
  }) => {
    try {
      let projectId = apiProjects[0]?.id;
      if (!projectId) {
        const newProj = await createProjectMutation({
          name: 'Main Workspace',
          key: 'MAIN',
          description: 'Default project workspace',
        }).unwrap();
        projectId = newProj.id;
      }

      await createTaskMutation({
        projectId,
        title: newTaskData.title,
        status: newTaskData.status,
        priority: newTaskData.priority,
        dueDate: newTaskData.dueDate
          ? new Date(newTaskData.dueDate).toISOString()
          : undefined,
      }).unwrap();

      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTaskMutation(id).unwrap();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  // Real-time task filtering based on Search Query and Cascading Filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesCreator = (task.creator?.name || '')
          .toLowerCase()
          .includes(q);
        const matchesAssignee = (task.assignee?.name || '')
          .toLowerCase()
          .includes(q);
        const matchesPriority = task.priority.toLowerCase().includes(q);
        if (
          !matchesTitle &&
          !matchesCreator &&
          !matchesAssignee &&
          !matchesPriority
        ) {
          return false;
        }
      }

      // 2. Cascading Priority Filter
      if (filters.priority !== 'ALL') {
        if (filters.priority === 'NONE' && task.priority) return false;
        if (filters.priority !== 'NONE' && task.priority !== filters.priority) {
          return false;
        }
      }

      // 3. Cascading Status Filter
      if (filters.status !== 'ALL' && task.status !== filters.status) {
        return false;
      }

      // 4. Cascading Member Filter
      if (filters.member !== 'ALL') {
        const memberName = task.assignee?.name || task.creator?.name || '';
        if (memberName !== filters.member) {
          return false;
        }
      }

      // 5. Cascading Label Filter
      if (filters.label !== 'ALL') {
        const hasLabel = task.labels?.some(
          (l) => l.label?.name.toLowerCase() === filters.label.toLowerCase(),
        );
        if (!hasLabel) return false;
      }

      return true;
    });
  }, [tasks, searchQuery, filters]);

  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'TODO', title: 'To Do' },
    { id: 'IN_PROGRESS', title: 'Doing' },
    { id: 'DONE', title: 'Completed' },
    { id: 'BACKLOG', title: 'On Hold' },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 p-6 md:p-8 bg-white overflow-hidden font-sans">
      {/* Top Header Row with Title, Action buttons, Search and Filter */}
      <TaskHeader
        onAddTask={() => handleOpenAddModal('TODO')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isFieldsOpen={isFieldsOpen}
        onToggleFields={() => setIsFieldsOpen(!isFieldsOpen)}
        onCloseFields={() => setIsFieldsOpen(false)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        visibleFields={visibleFields}
        onToggleField={handleToggleField}
        isFilterOpen={isFilterOpen}
        onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
        onCloseFilter={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* Main View: Either Grouped List View or Kanban Board */}
      {viewMode === 'board' ? (
        <div className="flex-1 flex items-start gap-5 overflow-x-auto pb-6 pt-1 select-none scrollbar-thin">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                tasks={colTasks}
                visibleFields={visibleFields}
                onAddTask={handleOpenAddModal}
                onDeleteTask={handleDeleteTask}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-6 pt-1">
          <TaskListView
            tasks={filteredTasks}
            onAddTask={handleOpenAddModal}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        defaultStatus={targetColumnStatus}
      />
    </div>
  );
}
