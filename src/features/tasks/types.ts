import { User } from '../auth/types';

export type TaskStatus =
  | 'BACKLOG'
  | 'TODO'
  | 'IN_PROGRESS'
  | 'IN_REVIEW'
  | 'DONE'
  | 'CANCELED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface TaskLabel {
  id: string;
  taskId: string;
  labelId: string;
  label: {
    id: string;
    name: string;
    color: string;
  };
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  orderIndex: number;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  taskNumber: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  orderIndex: number;
  dueDate?: string | null;
  startDate?: string | null;
  creatorId: string;
  creator?: User;
  assigneeId?: string | null;
  assignee?: User | null;
  labels?: TaskLabel[];
  subtasks?: Subtask[];
  _count?: {
    comments: number;
    attachments: number;
    subtasks: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  projectId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
  startDate?: string;
  labelIds?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDate?: string | null;
  startDate?: string | null;
  orderIndex?: number;
}

export interface MoveTaskDto {
  status: TaskStatus;
  orderIndex: number;
}

export interface TasksState {
  selectedTaskId: string | null;
  filterStatus: TaskStatus | 'ALL';
  filterPriority: TaskPriority | 'ALL';
  searchQuery: string;
}
