import { User } from '../auth/types';

export type ProjectRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: ProjectRole;
  user: User;
  joinedAt: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description?: string | null;
  color?: string | null;
  ownerId: string;
  owner?: User;
  members?: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  key: string;
  description?: string;
  color?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  color?: string;
}

export interface ProjectsState {
  currentProject: Project | null;
  selectedProjectId: string | null;
}
