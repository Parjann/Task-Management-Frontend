import { User } from '../auth/types';
import { baseApi } from '@/store/api/baseApi';

export interface Attachment {
  id: string;
  taskId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  publicId?: string | null;
  uploadedById: string;
  uploadedBy?: User;
  createdAt: string;
}

export const attachmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttachments: builder.query<Attachment[], string>({
      query: (taskId) => `/tasks/${taskId}/attachments`,
      providesTags: (_result, _error, taskId) => [
        { type: 'Attachment', id: taskId },
      ],
    }),
    deleteAttachment: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/attachments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Attachment'],
    }),
  }),
});

export const { useGetAttachmentsQuery, useDeleteAttachmentMutation } =
  attachmentApi;
