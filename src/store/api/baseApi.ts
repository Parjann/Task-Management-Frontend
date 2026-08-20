import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import Cookies from 'js-cookie';
import { unwrapApiData } from '@/lib/api';

const rawUrl =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_BASE_URL = rawUrl.endsWith('/api')
  ? rawUrl
  : `${rawUrl.replace(/\/$/, '')}/api`;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { arg }) => {
    const token = Cookies.get('accessToken');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    const body =
      typeof arg === 'object' && arg && 'body' in arg ? arg.body : undefined;
    if (body instanceof FormData) {
      headers.delete('content-type');
    }
    return headers;
  },
});

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.data !== undefined) {
    return { ...result, data: unwrapApiData(result.data) };
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'Auth',
    'User',
    'Project',
    'ProjectMember',
    'Task',
    'Subtask',
    'Comment',
    'Label',
    'Notification',
    'Activity',
    'Attachment',
    'Invitation',
    'Dashboard',
  ],
  endpoints: () => ({}),
});
