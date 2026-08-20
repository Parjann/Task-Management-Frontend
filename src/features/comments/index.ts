import { User } from '../auth/types';

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentDto {
  content: string;
}
