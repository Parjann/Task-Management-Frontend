import { User } from '../auth/types';
import { baseApi } from '@/store/api/baseApi';

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
  taskId: string;
  content: string;
}

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query<Comment[], string>({
      query: (taskId) => `/tasks/${taskId}/comments`,
      providesTags: (_result, _error, taskId) => [
        { type: 'Comment', id: taskId },
      ],
    }),
    createComment: builder.mutation<Comment, CreateCommentDto>({
      query: ({ taskId, content }) => ({
        url: `/tasks/${taskId}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: 'Comment', id: taskId },
        { type: 'Task', id: taskId },
      ],
    }),
  }),
});

export const { useGetCommentsQuery, useCreateCommentMutation } = commentApi;
