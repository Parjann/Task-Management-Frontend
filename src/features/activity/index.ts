import { User } from '../auth/types';
import { baseApi } from '@/store/api/baseApi';

export interface Activity {
  id: string;
  projectId?: string | null;
  taskId?: string | null;
  userId: string;
  user: User;
  action: string;
  details?: Record<string, unknown> | null;
  createdAt: string;
}

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectActivities: builder.query<Activity[], string>({
      query: (projectId) => `/projects/${projectId}/activities`,
      providesTags: (_result, _error, projectId) => [
        { type: 'Activity', id: projectId },
      ],
    }),
  }),
});

export const { useGetProjectActivitiesQuery } = activityApi;
