import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

const rawUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://task-management-backend-d5pm.onrender.com';
const API_BASE_URL = rawUrl.endsWith('/api')
  ? rawUrl
  : `${rawUrl.replace(/\/$/, '')}/api`;

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = Cookies.get('accessToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
  ],
  endpoints: () => ({}),
});
