import { baseApi } from '@/store/api/baseApi';
import {
  GuestLoginDto,
  LoginDto,
  LoginResponse,
  RegisterDto,
  User,
} from './types';
import { setCredentials, logout } from './authSlice';

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
          dispatch(setCredentials(data));
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
          dispatch(setCredentials(data));
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
          dispatch(setCredentials(data));
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
          dispatch(setCredentials(data));
        } catch {
          // Handled by component
        }
      },
      invalidatesTags: ['Auth'],
    }),

    getProfile: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['User'],
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
  useLogoutUserMutation,
} = authApi;
