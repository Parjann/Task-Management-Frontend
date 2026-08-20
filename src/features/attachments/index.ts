import { User } from '../auth/types';
import { baseApi } from '@/store/api/baseApi';
import { asArray } from '@/lib/api';

export interface Attachment {
  id: string;
  taskId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType?: string;
  fileType?: string;
  publicId?: string | null;
  uploadedBy?: string | User;
  uploadedById?: string;
  user?: User;
  createdAt: string;
}

export const attachmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttachments: builder.query<Attachment[], string>({
      query: (taskId) => `/tasks/${taskId}/attachments`,
      transformResponse: (response: unknown) => asArray<Attachment>(response),
      providesTags: (_result, _error, taskId) => [
        { type: 'Attachment', id: taskId },
      ],
    }),
    uploadAttachment: builder.mutation<
      Attachment,
      { taskId: string; file: File }
    >({
      query: ({ taskId, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/tasks/${taskId}/attachments`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: 'Attachment', id: taskId },
        { type: 'Task', id: taskId },
      ],
    }),
    deleteAttachment: builder.mutation<
      { message: string },
      { id: string; taskId?: string }
    >({
      query: ({ id }) => ({
        url: `/attachments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        'Attachment',
        ...(taskId ? [{ type: 'Attachment' as const, id: taskId }] : []),
      ],
    }),
  }),
});

export const {
  useGetAttachmentsQuery,
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
} = attachmentApi;
