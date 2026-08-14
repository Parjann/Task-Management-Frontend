import { baseApi } from '@/store/api/baseApi';

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
  }),
});

export const { useGetLabelsQuery, useCreateLabelMutation } = labelApi;
