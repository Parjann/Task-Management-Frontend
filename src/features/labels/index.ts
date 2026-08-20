import { baseApi } from '@/store/api/baseApi';
import { asArray } from '@/lib/api';

export interface Label {
  id: string;
  projectId: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface CreateLabelDto {
  projectId: string;
  name: string;
  color: string;
}

export const labelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLabels: builder.query<Label[], string>({
      query: (projectId) => `/projects/${projectId}/labels`,
      transformResponse: (response: unknown) => asArray<Label>(response),
      providesTags: (_result, _error, projectId) => [
        { type: 'Label', id: projectId },
      ],
    }),
    createLabel: builder.mutation<Label, CreateLabelDto>({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/labels`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'Label', id: projectId },
      ],
    }),
    assignLabel: builder.mutation<
      unknown,
      { taskId: string; labelId: string; projectId?: string }
    >({
      query: ({ taskId, labelId }) => ({
        url: `/tasks/${taskId}/labels`,
        method: 'POST',
        body: { labelId },
      }),
      invalidatesTags: (_result, _error, { taskId, projectId }) => [
        { type: 'Task', id: taskId },
        { type: 'Task', id: 'LIST' },
        ...(projectId
          ? [{ type: 'Task' as const, id: `PROJECT-${projectId}` }]
          : []),
      ],
    }),
    removeTaskLabel: builder.mutation<
      unknown,
      { taskId: string; labelId: string; projectId?: string }
    >({
      query: ({ taskId, labelId }) => ({
        url: `/tasks/${taskId}/labels/${labelId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { taskId, projectId }) => [
        { type: 'Task', id: taskId },
        { type: 'Task', id: 'LIST' },
        ...(projectId
          ? [{ type: 'Task' as const, id: `PROJECT-${projectId}` }]
          : []),
      ],
    }),
  }),
});

export const {
  useGetLabelsQuery,
  useCreateLabelMutation,
  useAssignLabelMutation,
  useRemoveTaskLabelMutation,
} = labelApi;
