import { baseApi } from '@/store/api/baseApi';
import { User } from '../auth/types';

export interface UserPreferences {
  theme: 'SYSTEM' | 'LIGHT' | 'DARK';
  accentColor: string;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updatePreferences: builder.mutation<User, UserPreferences>({
      query: (body) => ({
        url: '/preferences',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useUpdatePreferencesMutation } = settingsApi;
