import { baseApi } from '@/store/api/baseApi';
import { asArray } from '@/lib/api';
import { TaskPriority, TaskStatus } from '../tasks/types';

export interface DashboardSummary {
  projects: number;
  tasks: number;
  completed: number;
  todo: number;
  inProgress: number;
  inReview: number;
  overdue: number;
  dueToday: number;
  myTasks: number;
}

export interface StatusCount {
  status: TaskStatus;
  count: number;
}

export interface PriorityCount {
  priority: TaskPriority;
  count: number;
}

export interface UpcomingTask {
  id: string;
  title: string;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  project?: { id: string; name: string; key: string; color?: string };
}

export interface DashboardActivity {
  id: string;
  action: string;
  message: string;
  createdAt: string;
  user?: { id: string; name: string; avatarUrl?: string | null };
  task?: { id: string; title: string; projectId: string };
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardSummary, void>({
      query: () => '/dashboard',
      providesTags: ['Dashboard'],
    }),
    getDashboardStatus: builder.query<StatusCount[], void>({
      query: () => '/dashboard/status',
      transformResponse: (response: unknown) => asArray<StatusCount>(response),
      providesTags: ['Dashboard'],
    }),
    getDashboardPriority: builder.query<PriorityCount[], void>({
      query: () => '/dashboard/priority',
      transformResponse: (response: unknown) => asArray<PriorityCount>(response),
      providesTags: ['Dashboard'],
    }),
    getDashboardUpcoming: builder.query<UpcomingTask[], void>({
      query: () => '/dashboard/upcoming',
      transformResponse: (response: unknown) => asArray<UpcomingTask>(response),
      providesTags: ['Dashboard'],
    }),
    getDashboardActivity: builder.query<DashboardActivity[], void>({
      query: () => '/dashboard/activity',
      transformResponse: (response: unknown) =>
        asArray<DashboardActivity>(response),
      providesTags: [{ type: 'Activity', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetDashboardStatusQuery,
  useGetDashboardPriorityQuery,
  useGetDashboardUpcomingQuery,
  useGetDashboardActivityQuery,
} = dashboardApi;
