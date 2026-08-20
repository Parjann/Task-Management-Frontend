import { TaskPriority } from '../tasks/types';
import { User } from '../auth/types';

export type ProjectRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: ProjectRole;
  user: User;
  joinedAt?: string;
  createdAt?: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description?: string | null;
  color?: string | null;
  priority?: TaskPriority;
  dueDate?: string | null;
  ownerId: string;
  owner?: User;
  members?: ProjectMember[];
  _count?: { tasks: number };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  key: string;
  description?: string;
  color?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  color?: string;
  priority?: TaskPriority;
  dueDate?: string | null;
}

export interface ProjectsState {
  currentProject: Project | null;
  selectedProjectId: string | null;
}
