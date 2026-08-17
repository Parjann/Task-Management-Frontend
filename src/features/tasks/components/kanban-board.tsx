'use client';

import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types';
import { KanbanColumn } from './kanban-column';
import { TaskHeader } from './task-header';
import { CreateTaskModal } from './create-task-modal';

// Initial sample data replicating Figma designs with full fidelity
const INITIAL_TASKS: Task[] = [
  // --- TO DO COLUMN ---
  {
    id: 't-1',
    projectId: 'p-1',
    taskNumber: 1,
    title: 'Write API Documentation',
    status: 'TODO',
    priority: 'HIGH',
    orderIndex: 0,
    dueDate: '2026-07-29T12:00:00Z',
    creatorId: 'u-admin',
    creator: { id: 'u-admin', name: 'Admin', email: 'admin@taskflow.com', isGuest: false, createdAt: '', updatedAt: '' },
    labels: [
      { id: 'l1', taskId: 't-1', labelId: 'lbl-1', label: { id: 'lbl-1', name: 'Deployment', color: '#6B7280' } },
      { id: 'l2', taskId: 't-1', labelId: 'lbl-2', label: { id: 'lbl-2', name: 'Deployment', color: '#6B7280' } },
    ],
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 't-2',
    projectId: 'p-1',
    taskNumber: 2,
    title: 'Implement Search Function',
    status: 'TODO',
    priority: 'MEDIUM',
    orderIndex: 1,
    dueDate: '2026-07-29T12:00:00Z',
    creatorId: 'u-admin',
    creator: { id: 'u-admin', name: 'Admin', email: 'admin@taskflow.com', isGuest: false, createdAt: '', updatedAt: '' },
    labels: [
      { id: 'l3', taskId: 't-2', labelId: 'lbl-1', label: { id: 'lbl-1', name: 'Deployment', color: '#6B7280' } },
      { id: 'l4', taskId: 't-2', labelId: 'lbl-2', label: { id: 'lbl-2', name: 'Deployment', color: '#6B7280' } },
    ],
    createdAt: '2026-07-21T10:00:00Z',
    updatedAt: '2026-07-21T10:00:00Z',
  },
  {
    id: 't-3',
    projectId: 'p-1',
    taskNumber: 3,
    title: 'Deploy to Production',
    status: 'TODO',
    priority: 'URGENT',
    orderIndex: 2,
    dueDate: '2026-07-29T12:00:00Z',
    creatorId: 'u-admin',
    creator: { id: 'u-admin', name: 'Admin', email: 'admin@taskflow.com', isGuest: false, createdAt: '', updatedAt: '' },
    labels: [
      { id: 'l5', taskId: 't-3', labelId: 'lbl-1', label: { id: 'lbl-1', name: 'Deployment', color: '#6B7280' } },
      { id: 'l6', taskId: 't-3', labelId: 'lbl-2', label: { id: 'lbl-2', name: 'Deployment', color: '#6B7280' } },
    ],
    createdAt: '2026-07-22T10:00:00Z',
    updatedAt: '2026-07-22T10:00:00Z',
  },

  // --- DOING COLUMN ---
  {
    id: 't-4',
    projectId: 'p-1',
    taskNumber: 4,
    title: 'Code Review Completed',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    orderIndex: 0,
    dueDate: '2026-07-29T12:00:00Z',
    creatorId: 'u-admin',
    creator: { id: 'u-admin', name: 'Admin', email: 'admin@taskflow.com', isGuest: false, createdAt: '', updatedAt: '' },
    labels: [
      { id: 'l7', taskId: 't-4', labelId: 'lbl-1', label: { id: 'lbl-1', name: 'Deployment', color: '#6B7280' } },
      { id: 'l8', taskId: 't-4', labelId: 'lbl-2', label: { id: 'lbl-2', name: 'Deployment', color: '#6B7280' } },
    ],
    createdAt: '2026-07-22T11:00:00Z',
    updatedAt: '2026-07-22T11:00:00Z',
  },
  {
    id: 't-5',
    projectId: 'p-1',
    taskNumber: 5,
    title: 'Design Mockups Finalized',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    orderIndex: 1,
    dueDate: '2026-07-29T12:00:00Z',
    creatorId: 'u-admin',
    creator: { id: 'u-admin', name: 'Admin', email: 'admin@taskflow.com', isGuest: false, createdAt: '', updatedAt: '' },
    labels: [
      { id: 'l9', taskId: 't-5', labelId: 'lbl-1', label: { id: 'lbl-1', name: 'Deployment', color: '#6B7280' } },
      { id: 'l10', taskId: 't-5', labelId: 'lbl-2', label: { id: 'lbl-2', name: 'Deployment', color: '#6B7280' } },
    ],
    createdAt: '2026-07-23T11:00:00Z',
    updatedAt: '2026-07-23T11:00:00Z',
  },

  // --- COMPLETED COLUMN ---
  {
    id: 't-6',
    projectId: 'p-1',
    taskNumber: 6,
    title: 'Feature Testing Passed',
    status: 'DONE',
    priority: 'LOW',
    orderIndex: 0,
    dueDate: '2026-07-30T12:00:00Z',
    creatorId: 'u-qa',
    creator: { id: 'u-qa', name: 'QA Team', email: 'qa@taskflow.com', isGuest: false, createdAt: '', updatedAt: '' },
    labels: [
      { id: 'l11', taskId: 't-6', labelId: 'lbl-3', label: { id: 'lbl-3', name: 'Testing', color: '#6B7280' } },
      { id: 'l12', taskId: 't-6', labelId: 'lbl-4', label: { id: 'lbl-4', name: 'Passed', color: '#6B7280' } },
    ],
    createdAt: '2026-07-24T12:00:00Z',
    updatedAt: '2026-07-24T12:00:00Z',
  },
  {
    id: 't-7',
    projectId: 'p-1',
    taskNumber: 7,
    title: 'UI Design Updated',
    status: 'DONE',
    priority: 'MEDIUM',
    orderIndex: 1,
    dueDate: '2026-07-31T12:00:00Z',
    creatorId: 'u-designer',
    creator: { id: 'u-designer', name: 'Designer', email: 'designer@taskflow.com', isGuest: false, createdAt: '', updatedAt: '' },
    labels: [
      { id: 'l13', taskId: 't-7', labelId: 'lbl-5', label: { id: 'lbl-5', name: 'Design', color: '#6B7280' } },
      { id: 'l14', taskId: 't-7', labelId: 'lbl-6', label: { id: 'lbl-6', name: 'Updated', color: '#6B7280' } },
    ],
    createdAt: '2026-07-25T12:00:00Z',
    updatedAt: '2026-07-25T12:00:00Z',
  },
  {
    id: 't-8',
    projectId: 'p-1',
    taskNumber: 8,
    title: 'Security Audit Scheduled',
    status: 'DONE',
    priority: 'HIGH',
    orderIndex: 2,
    dueDate: '2026-08-01T12:00:00Z',
    creatorId: 'u-sec',
    creator: { id: 'u-sec', name: 'Security', email: 'security@taskflow.com', isGuest: false, createdAt: '', updatedAt: '' },
    labels: [
      { id: 'l15', taskId: 't-8', labelId: 'lbl-7', label: { id: 'lbl-7', name: 'Audit', color: '#6B7280' } },
      { id: 'l16', taskId: 't-8', labelId: 'lbl-8', label: { id: 'lbl-8', name: 'Scheduled', color: '#6B7280' } },
    ],
    createdAt: '2026-07-26T12:00:00Z',
    updatedAt: '2026-07-26T12:00:00Z',
  },

  // --- ON HOLD COLUMN ---
  {
    id: 't-9',
    projectId: 'p-1',
    taskNumber: 9,
    title: 'UI Review',
    status: 'BACKLOG',
    priority: 'LOW',
    orderIndex: 0,
    dueDate: '2026-07-29T12:00:00Z',
    creatorId: 'u-designer',
    creator: { id: 'u-designer', name: 'Designer', email: 'designer@taskflow.com', isGuest: false, createdAt: '', updatedAt: '' },
    labels: [
      { id: 'l17', taskId: 't-9', labelId: 'lbl-9', label: { id: 'lbl-9', name: 'Review', color: '#6B7280' } },
      { id: 'l18', taskId: 't-9', labelId: 'lbl-5', label: { id: 'lbl-5', name: 'Design', color: '#6B7280' } },
    ],
    createdAt: '2026-07-27T12:00:00Z',
    updatedAt: '2026-07-27T12:00:00Z',
  },
  {
    id: 't-10',
    projectId: 'p-1',
    taskNumber: 10,
    title: 'Backend Optimization',
    status: 'BACKLOG',
    priority: 'HIGH',
    orderIndex: 1,
    dueDate: '2026-08-02T12:00:00Z',
    creatorId: 'u-dev',
    creator: { id: 'u-dev', name: 'Dev Team', email: 'dev@taskflow.com', isGuest: false, createdAt: '', updatedAt: '' },
    labels: [
      { id: 'l19', taskId: 't-10', labelId: 'lbl-10', label: { id: 'lbl-10', name: 'Development', color: '#6B7280' } },
      { id: 'l20', taskId: 't-10', labelId: 'lbl-11', label: { id: 'lbl-11', name: 'Optimization', color: '#6B7280' } },
    ],
    createdAt: '2026-07-28T12:00:00Z',
    updatedAt: '2026-07-28T12:00:00Z',
  },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [targetColumnStatus, setTargetColumnStatus] = useState<TaskStatus>('TODO');

  const handleOpenAddModal = (status: TaskStatus = 'TODO') => {
    setTargetColumnStatus(status);
    setIsCreateModalOpen(true);
  };

  const handleCreateTask = (newTaskData: {
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
        name: newTaskData.assigneeName || 'Admin',
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

    setTasks((prev) => [...prev, newTask]);
  };

  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'TODO', title: 'To Do' },
    { id: 'IN_PROGRESS', title: 'Doing' },
    { id: 'DONE', title: 'Completed' },
    { id: 'BACKLOG', title: 'On Hold' },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 p-6 md:p-8 bg-white overflow-hidden">
      {/* Top Header Row with Title and Action buttons */}
      <TaskHeader onAddTask={() => handleOpenAddModal('TODO')} />

      {/* Kanban Columns Horizontal Container */}
      <div className="flex-1 flex items-start gap-5 overflow-x-auto pb-6 pt-1 select-none scrollbar-thin">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={colTasks}
              onAddTask={handleOpenAddModal}
            />
          );
        })}
      </div>

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
