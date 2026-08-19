import { baseApi } from '@/store/api/baseApi';
import { CreateProjectDto, Project, ProjectMember, UpdateProjectDto } from './types';

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => '/projects',
      transformResponse: (response: any): Project[] => {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.projects)) return response.projects;
        if (Array.isArray(response?.data)) return response.data;
        if (response?.project) return [response.project];
        return [];
      },
      providesTags: (result) => [
        { type: 'Project', id: 'LIST' },
        ...(result ?? []).map((project) => ({
          type: 'Project' as const,
          id: project.id,
        })),
      ],
    }),

    getProjectById: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
      transformResponse: (response: any): Project => {
        return response?.project || response?.data || response;
      },
      providesTags: (_result, _error, id) => [{ type: 'Project', id }],
    }),

    createProject: builder.mutation<Project, CreateProjectDto>({
      query: (body) => ({
        url: '/projects',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any): Project => {
        return response?.project || response?.data || response;
      },
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),

    updateProject: builder.mutation<
      Project,
      { id: string; body: UpdateProjectDto }
    >({
      query: ({ id, body }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: any): Project => {
        return response?.project || response?.data || response;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' },
      ],
    }),

    deleteProject: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' },
        { type: 'Task', id: `PROJECT-${id}` },
        { type: 'Task', id: 'LIST' },
      ],
    }),

    getProjectMembers: builder.query<ProjectMember[], string>({
      query: (projectId) => `/projects/${projectId}/members`,
      transformResponse: (response: any): ProjectMember[] => {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.members)) return response.members;
        if (Array.isArray(response?.data)) return response.data;
        return [];
      },
      providesTags: (_result, _error, projectId) => [
        { type: 'ProjectMember', id: projectId },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectMembersQuery,
} = projectApi;
