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
} from '../taskApi';

// Initial sample data replicating Figma designs with full fidelity
const INITIAL_TASKS: Task[] = [
  // --- TO DO COLUMN ---
  {
    id: 't-1',
    projectId: 'p-1',
    taskNumber: 1,
    title: 'Design Homepage',
    status: 'TODO',
    priority: 'HIGH',
    orderIndex: 0,
    dueDate: '2026-09-12T12:00:00Z',
    creatorId: 'u-admin',
    creator: {
      id: 'u-admin',
      name: 'Dexter',
      email: 'dexter@taskflow.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      isGuest: false,
      createdAt: '',
      updatedAt: '',
    },
    labels: [
      { id: 'l1', taskId: 't-1', labelId: 'lbl-1', label: { id: 'lbl-1', name: 'Design', color: '#6B7280' } },
      { id: 'l2', taskId: 't-1', labelId: 'lbl-2', label: { id: 'lbl-2', name: 'UI', color: '#6B7280' } },
    ],
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 't-2',
    projectId: 'p-1',
    taskNumber: 2,
    title: 'Develop Login Feature',
    status: 'TODO',
    priority: 'LOW',
    orderIndex: 1,
    dueDate: '2026-09-15T12:00:00Z',
    creatorId: 'u-cn',
    creator: {
      id: 'u-cn',
      name: 'Carl Nuñez',
      email: 'carl@taskflow.com',
      isGuest: false,
      createdAt: '',
      updatedAt: '',
    },
    labels: [
      { id: 'l3', taskId: 't-2', labelId: 'lbl-3', label: { id: 'lbl-3', name: 'Auth', color: '#6B7280' } },
      { id: 'l4', taskId: 't-2', labelId: 'lbl-4', label: { id: 'lbl-4', name: 'Frontend', color: '#6B7280' } },
    ],
    createdAt: '2026-07-21T10:00:00Z',
    updatedAt: '2026-07-21T10:00:00Z',
  },
  {
    id: 't-3',
    projectId: 'p-1',
    taskNumber: 3,
    title: 'Test Payment Gateway',
    status: 'TODO',
    priority: 'MEDIUM',
    orderIndex: 2,
    dueDate: '2026-09-18T12:00:00Z',
    creatorId: 'u-admin',
    creator: { id: 'u-admin', name: 'Admin', email: 'admin@taskflow.com', isGuest: false, createdAt: '', updatedAt: '' },
    labels: [
      { id: 'l5', taskId: 't-3', labelId: 'lbl-5', label: { id: 'lbl-5', name: 'Payment', color: '#6B7280' } },
      { id: 'l6', taskId: 't-3', labelId: 'lbl-6', label: { id: 'lbl-6', name: 'Testing', color: '#6B7280' } },
    ],
    createdAt: '2026-07-22T10:00:00Z',
    updatedAt: '2026-07-22T10:00:00Z',
  },

  // --- DOING COLUMN ---
  {
    id: 't-4',
    projectId: 'p-1',
    taskNumber: 4,
    title: 'Design Homepage',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    orderIndex: 0,
    dueDate: '2026-09-12T12:00:00Z',
    creatorId: 'u-admin',
    creator: {
      id: 'u-admin',
      name: 'Dexter',
      email: 'dexter@taskflow.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      isGuest: false,
      createdAt: '',
      updatedAt: '',
    },
    labels: [
      { id: 'l7', taskId: 't-4', labelId: 'lbl-1', label: { id: 'lbl-1', name: 'Design', color: '#6B7280' } },
    ],
    createdAt: '2026-07-22T11:00:00Z',
    updatedAt: '2026-07-22T11:00:00Z',
  },
  {
    id: 't-5',
    projectId: 'p-1',
    taskNumber: 5,
    title: 'Develop Login Feature',
    status: 'IN_PROGRESS',
    priority: 'LOW',
    orderIndex: 1,
    dueDate: '2026-09-15T12:00:00Z',
    creatorId: 'u-cn',
    creator: {
      id: 'u-cn',
      name: 'Carl Nuñez',
      email: 'carl@taskflow.com',
      isGuest: false,
      createdAt: '',
      updatedAt: '',
    },
    labels: [
      { id: 'l8', taskId: 't-5', labelId: 'lbl-3', label: { id: 'lbl-3', name: 'Auth', color: '#6B7280' } },
    ],
    createdAt: '2026-07-23T11:00:00Z',
    updatedAt: '2026-07-23T11:00:00Z',
  },
  {
    id: 't-6',
    projectId: 'p-1',
    taskNumber: 6,
    title: 'Test Payment Gateway',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    orderIndex: 2,
    dueDate: '2026-09-18T12:00:00Z',
    creatorId: 'u-admin',
    creator: { id: 'u-admin', name: 'Admin', email: 'admin@taskflow.com', isGuest: false, createdAt: '', updatedAt: '' },
    labels: [
      { id: 'l9', taskId: 't-6', labelId: 'lbl-5', label: { id: 'lbl-5', name: 'Payment', color: '#6B7280' } },
    ],
    createdAt: '2026-07-23T12:00:00Z',
    updatedAt: '2026-07-23T12:00:00Z',
  },

  // --- COMPLETED COLUMN ---
  {
    id: 't-7',
    projectId: 'p-1',
    taskNumber: 7,
    title: 'Design Homepage',
    status: 'DONE',
    priority: 'HIGH',
    orderIndex: 0,
    dueDate: '2026-09-12T12:00:00Z',
    creatorId: 'u-admin',
    creator: {
      id: 'u-admin',
      name: 'Dexter',
      email: 'dexter@taskflow.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      isGuest: false,
      createdAt: '',
      updatedAt: '',
    },
    labels: [
      { id: 'l10', taskId: 't-7', labelId: 'lbl-1', label: { id: 'lbl-1', name: 'Design', color: '#6B7280' } },
    ],
    createdAt: '2026-07-24T12:00:00Z',
    updatedAt: '2026-07-24T12:00:00Z',
  },
  {
    id: 't-8',
    projectId: 'p-1',
    taskNumber: 8,
    title: 'Develop Login Feature',
    status: 'DONE',
    priority: 'LOW',
    orderIndex: 1,
    dueDate: '2026-09-15T12:00:00Z',
    creatorId: 'u-cn',
    creator: {
      id: 'u-cn',
      name: 'Carl Nuñez',
      email: 'carl@taskflow.com',
      isGuest: false,
      createdAt: '',
      updatedAt: '',
    },
    labels: [
      { id: 'l11', taskId: 't-8', labelId: 'lbl-3', label: { id: 'lbl-3', name: 'Auth', color: '#6B7280' } },
    ],
    createdAt: '2026-07-25T12:00:00Z',
    updatedAt: '2026-07-25T12:00:00Z',
  },
  {
    id: 't-9',
    projectId: 'p-1',
    taskNumber: 9,
    title: 'Test Payment Gateway',
    status: 'DONE',
    priority: 'MEDIUM',
    orderIndex: 2,
    dueDate: '2026-09-18T12:00:00Z',
    creatorId: 'u-admin',
    creator: { id: 'u-admin', name: 'Admin', email: 'admin@taskflow.com', isGuest: false, createdAt: '', updatedAt: '' },
    labels: [
      { id: 'l12', taskId: 't-9', labelId: 'lbl-5', label: { id: 'lbl-5', name: 'Payment', color: '#6B7280' } },
    ],
    createdAt: '2026-07-26T12:00:00Z',
    updatedAt: '2026-07-26T12:00:00Z',
  },
];

export function KanbanBoard() {
  const [localTasks, setLocalTasks] = useState<Task[]>(INITIAL_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [targetColumnStatus, setTargetColumnStatus] =
    useState<TaskStatus>('TODO');

  // RTK Query API Hooks
  const { data: apiTasks, isLoading: isApiLoading } = useGetTasksQuery(
    { search: searchQuery || undefined },
    { refetchOnMountOrArgChange: true },
  );
  const [createTaskMutation] = useCreateTaskMutation();

  // Combine API tasks with fallback
  const tasks = useMemo(() => {
    if (apiTasks && apiTasks.length > 0) {
      return apiTasks;
    }
    return localTasks;
  }, [apiTasks, localTasks]);

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
    const newTask: Task = {
      id: `task-${Date.now()}`,
      projectId: 'p-1',
      taskNumber: tasks.length + 1,
      title: newTaskData.title,
      status: newTaskData.status,
      priority: newTaskData.priority,
      orderIndex: tasks.length,
      dueDate: newTaskData.dueDate,
      creatorId: 'u-current',
      creator: {
        id: 'u-current',
        name: newTaskData.assigneeName || 'Dexter',
        email: 'user@taskflow.com',
        isGuest: false,
        createdAt: '',
        updatedAt: '',
      },
      labels: [
        {
          id: `lbl-${Date.now()}-1`,
          taskId: `task-${Date.now()}`,
          labelId: 'lbl-custom',
          label: {
            id: 'lbl-custom',
            name: newTaskData.label || 'Deployment',
            color: '#6B7280',
          },
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLocalTasks((prev) => [...prev, newTask]);

    try {
      await createTaskMutation({
        projectId: 'p-1',
        title: newTaskData.title,
        status: newTaskData.status,
        priority: newTaskData.priority,
        dueDate: newTaskData.dueDate,
      }).unwrap();
    } catch {
      // Optimistic state remains in local fallback
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
              />
            );
          })}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-6 pt-1">
          <TaskListView
            tasks={filteredTasks}
            onAddTask={handleOpenAddModal}
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
