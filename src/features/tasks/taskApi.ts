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
      } | void
    >({
      query: (params) => ({
        url: '/tasks',
        params: params || undefined,
      }),
      transformResponse: (response: any): Task[] => {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.tasks)) return response.tasks;
        if (response?.task) return [response.task];
        return [];
      },
      providesTags: (result, _error, arg) => [
        {
          type: 'Task',
          id: arg?.projectId ? `PROJECT-${arg.projectId}` : 'LIST',
        },
        ...(result ?? []).map((task) => ({
          type: 'Task' as const,
          id: task.id,
        })),
      ],
    }),

    getTaskById: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      transformResponse: (response: any): Task => {
        return response?.task || response?.data || response;
      },
      providesTags: (_result, _error, id) => [{ type: 'Task', id }],
    }),

    createTask: builder.mutation<Task, CreateTaskDto>({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any): Task => {
        return response?.task || response?.data || response;
      },
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'Task', id: `PROJECT-${projectId}` },
        { type: 'Task', id: 'LIST' },
        { type: 'Project', id: projectId },
      ],
    }),

    updateTask: builder.mutation<
      Task,
      { id: string; body: UpdateTaskDto; projectId?: string }
    >({
      query: ({ id, body }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: any): Task => {
        return response?.task || response?.data || response;
      },
      invalidatesTags: (_result, _error, { id, projectId }) => [
        { type: 'Task', id },
        ...(projectId ? [{ type: 'Task' as const, id: `PROJECT-${projectId}` }] : []),
        { type: 'Task', id: 'LIST' },
      ],
    }),

    moveTask: builder.mutation<
      Task,
      { id: string; body: MoveTaskDto; projectId?: string }
    >({
      query: ({ id, body }) => ({
        url: `/tasks/${id}/move`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: any): Task => {
        return response?.task || response?.data || response;
      },
      invalidatesTags: (_result, _error, { id, projectId }) => [
        { type: 'Task', id },
        ...(projectId ? [{ type: 'Task' as const, id: `PROJECT-${projectId}` }] : []),
        { type: 'Task', id: 'LIST' },
      ],
    }),

    deleteTask: builder.mutation<
      { message: string },
      { id: string; projectId?: string } | string
    >({
      query: (arg) => ({
        url: `/tasks/${typeof arg === 'string' ? arg : arg.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, arg) => {
        const id = typeof arg === 'string' ? arg : arg.id;
        const projectId = typeof arg === 'string' ? undefined : arg.projectId;
        return [
          { type: 'Task', id },
          ...(projectId ? [{ type: 'Task' as const, id: `PROJECT-${projectId}` }] : []),
          { type: 'Task', id: 'LIST' },
        ];
      },
    }),

    // Subtasks
    getSubtasks: builder.query<Subtask[], string>({
      query: (taskId) => `/tasks/${taskId}/subtasks`,
      transformResponse: (response: any): Subtask[] => {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.subtasks)) return response.subtasks;
        if (Array.isArray(response?.data)) return response.data;
        return [];
      },
      providesTags: (_result, _error, taskId) => [
        { type: 'Subtask', id: taskId },
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
      transformResponse: (response: any): Subtask => {
        return response?.subtask || response?.data || response;
      },
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: 'Subtask', id: taskId },
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
      transformResponse: (response: any): Subtask => {
        return response?.subtask || response?.data || response;
      },
      invalidatesTags: (_result, _error, { id, taskId }) => [
        { type: 'Subtask', id },
        ...(taskId ? [{ type: 'Subtask' as const, id: taskId }] : []),
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
        ...(taskId ? [{ type: 'Subtask' as const, id: taskId }] : []),
      ],
    }),

    // Comments
    getComments: builder.query<Comment[], string>({
      query: (taskId) => `/tasks/${taskId}/comments`,
      transformResponse: (response: any): Comment[] => {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.comments)) return response.comments;
        if (Array.isArray(response?.data)) return response.data;
        return [];
      },
      providesTags: (_result, _error, taskId) => [
        { type: 'Comment', id: taskId },
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
      transformResponse: (response: any): Comment => {
        return response?.comment || response?.data || response;
      },
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: 'Comment', id: taskId },
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
        ...(taskId ? [{ type: 'Comment' as const, id: taskId }] : []),
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
