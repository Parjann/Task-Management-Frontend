import { baseApi } from '@/store/api/baseApi';
import {
  GuestLoginDto,
  LoginDto,
  LoginResponse,
  RegisterDto,
  UpdateUserDto,
  User,
} from './types';
import { setCredentials, setUser, logout } from './authSlice';

function asLoginResponse(data: unknown): LoginResponse {
  const payload = data as LoginResponse & { data?: LoginResponse };
  if (payload?.user && payload?.accessToken) return payload;
  if (payload?.data?.user && payload?.data?.accessToken) return payload.data;
  return payload;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<LoginResponse, RegisterDto>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(asLoginResponse(data)));
        } catch {
          // Handled by component
        }
      },
      invalidatesTags: ['Auth'],
    }),

    login: builder.mutation<LoginResponse, LoginDto>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(asLoginResponse(data)));
        } catch {
          // Handled by component
        }
      },
      invalidatesTags: ['Auth'],
    }),

    googleLogin: builder.mutation<LoginResponse, { idToken: string }>({
      query: (body) => ({
        url: '/auth/google',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(asLoginResponse(data)));
        } catch {
          // Handled by component
        }
      },
      invalidatesTags: ['Auth'],
    }),

    guestLogin: builder.mutation<LoginResponse, GuestLoginDto | void>({
      query: (body) => ({
        url: '/auth/guest',
        method: 'POST',
        body: body || {},
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(asLoginResponse(data)));
        } catch {
          // Handled by component
        }
      },
      invalidatesTags: ['Auth'],
    }),

    getProfile: builder.query<User, void>({
      query: () => '/users/me',
      transformResponse: (response: unknown) =>
        (response as { user?: User }).user || (response as User),
      providesTags: ['User'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          // ignore
        }
      },
    }),

    updateProfile: builder.mutation<User, UpdateUserDto>({
      query: (body) => ({
        url: '/users/me',
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: unknown) =>
        (response as { user?: User }).user || (response as User),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          // Handled by component
        }
      },
      invalidatesTags: ['User'],
    }),

    uploadAvatar: builder.mutation<User, FormData>({
      query: (formData) => ({
        url: '/users/avatar',
        method: 'PATCH',
        body: formData,
      }),
      transformResponse: (response: unknown) =>
        (response as { user?: User }).user || (response as User),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          // Handled by component
        }
      },
      invalidatesTags: ['User'],
    }),

    leaveWorkspace: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/users/me/leave-workspace',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch {
          // Handled by component
        }
      },
      invalidatesTags: ['Auth', 'User', 'Project', 'Task'],
    }),

    logoutUser: builder.mutation<{ message: string }, void>({
      queryFn: (_arg, { dispatch }) => {
        dispatch(logout());
        return { data: { message: 'Logged out successfully' } };
      },
      invalidatesTags: ['Auth', 'User'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGoogleLoginMutation,
  useGuestLoginMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useLeaveWorkspaceMutation,
  useLogoutUserMutation,
} = authApi;
