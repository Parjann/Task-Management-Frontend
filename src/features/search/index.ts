import { baseApi } from '@/store/api/baseApi';
import { Project } from '../projects/types';
import { Task } from '../tasks/types';

export interface SearchResults {
  projects: Project[];
  tasks: Task[];
}

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    globalSearch: builder.query<SearchResults, string>({
      query: (q) => ({
        url: '/search',
        params: { q },
      }),
    }),
  }),
});

export const { useGlobalSearchQuery } = searchApi;
