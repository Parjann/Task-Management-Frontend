import { baseApi } from '@/store/api/baseApi';
import { ProjectRole } from '../projects/types';

export interface Invitation {
  id: string;
  email: string;
  projectId: string;
  role: ProjectRole;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface CreateInvitationDto {
  projectId: string;
  email: string;
  role: ProjectRole;
}

export const invitationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectInvitations: builder.query<Invitation[], string>({
      query: (projectId) => `/projects/${projectId}/invitations`,
      providesTags: (_result, _error, projectId) => [
        { type: 'Invitation', id: projectId },
      ],
    }),
    createInvitation: builder.mutation<Invitation, CreateInvitationDto>({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/invitations`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'Invitation', id: projectId },
      ],
    }),
    acceptInvitation: builder.mutation<{ message: string }, string>({
      query: (token) => ({
        url: `/invitations/${token}/accept`,
        method: 'POST',
      }),
      invalidatesTags: ['Project'],
    }),
  }),
});

export const {
  useGetProjectInvitationsQuery,
  useCreateInvitationMutation,
  useAcceptInvitationMutation,
} = invitationApi;
