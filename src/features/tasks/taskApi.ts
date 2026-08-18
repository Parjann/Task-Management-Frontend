import { baseApi } from '@/store/api/baseApi';
import {
  CreateTaskDto,
  MoveTaskDto,
  Task,
  UpdateTaskDto,
  Subtask,
  CreateSubtaskDto,
  UpdateSubtaskDto,
  Comment,
  CreateCommentDto,
} from './types';

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<
      Task[],
      {
        projectId?: string;
        status?: string;
        priority?: string;
        assigneeId?: string;
        search?: string;
      }
    >({
      query: (params) => ({
        url: '/tasks',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
    }),

    getTaskById: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Task', id }],
    }),

    createTask: builder.mutation<Task, CreateTaskDto>({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),

    updateTask: builder.mutation<Task, { id: string; body: UpdateTaskDto }>({
      query: ({ id, body }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ],
    }),

    moveTask: builder.mutation<Task, { id: string; body: MoveTaskDto }>({
      query: ({ id, body }) => ({
        url: `/tasks/${id}/move`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ],
    }),

    deleteTask: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),

    // Subtasks
    getSubtasks: builder.query<Subtask[], string>({
      query: (taskId) => `/tasks/${taskId}/subtasks`,
      providesTags: (_result, _error, taskId) => [
        { type: 'Subtask', id: `LIST_${taskId}` },
      ],
    }),

    createSubtask: builder.mutation<
      Subtask,
      { taskId: string; body: CreateSubtaskDto }
    >({
      query: ({ taskId, body }) => ({
        url: `/tasks/${taskId}/subtasks`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: 'Subtask', id: `LIST_${taskId}` },
        { type: 'Task', id: taskId },
      ],
    }),

    updateSubtask: builder.mutation<
      Subtask,
      { id: string; taskId?: string; body: UpdateSubtaskDto }
    >({
      query: ({ id, body }) => ({
        url: `/subtasks/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id, taskId }) => [
        { type: 'Subtask', id },
        ...(taskId ? [{ type: 'Subtask' as const, id: `LIST_${taskId}` }] : []),
      ],
    }),

    deleteSubtask: builder.mutation<
      { message: string },
      { id: string; taskId?: string }
    >({
      query: ({ id }) => ({
        url: `/subtasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id, taskId }) => [
        { type: 'Subtask', id },
        ...(taskId ? [{ type: 'Subtask' as const, id: `LIST_${taskId}` }] : []),
      ],
    }),

    // Comments
    getComments: builder.query<Comment[], string>({
      query: (taskId) => `/tasks/${taskId}/comments`,
      providesTags: (_result, _error, taskId) => [
        { type: 'Comment', id: `LIST_${taskId}` },
      ],
    }),

    createComment: builder.mutation<
      Comment,
      { taskId: string; body: CreateCommentDto }
    >({
      query: ({ taskId, body }) => ({
        url: `/tasks/${taskId}/comments`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: 'Comment', id: `LIST_${taskId}` },
        { type: 'Activity', id: 'LIST' },
      ],
    }),

    deleteComment: builder.mutation<
      { message: string },
      { id: string; taskId?: string }
    >({
      query: ({ id }) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id, taskId }) => [
        { type: 'Comment', id },
        ...(taskId ? [{ type: 'Comment' as const, id: `LIST_${taskId}` }] : []),
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useMoveTaskMutation,
  useDeleteTaskMutation,
  useGetSubtasksQuery,
  useCreateSubtaskMutation,
  useUpdateSubtaskMutation,
  useDeleteSubtaskMutation,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = taskApi;
