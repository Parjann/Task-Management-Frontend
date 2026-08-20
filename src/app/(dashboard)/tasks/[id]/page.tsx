'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TaskDetailsView } from '@/features/tasks/components/task-details-view';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params?.id as string | undefined;

  return (
    <TaskDetailsView
      taskId={taskId}
      onBack={() => router.push('/tasks')}
    />
  );
}
