'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { baseApi } from '@/store/api/baseApi';
import { getSocket, disconnectSocket } from '@/lib/socket';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      return;
    }

    const socket = getSocket();

    // Listen for Real-time Task Events
    const handleTaskUpdated = () => {
      dispatch(baseApi.util.invalidateTags(['Task', 'Activity']));
    };

    // Listen for Real-time Project Events
    const handleProjectUpdated = () => {
      dispatch(baseApi.util.invalidateTags(['Project']));
    };

    // Listen for Real-time Comment Events
    const handleCommentCreated = () => {
      dispatch(baseApi.util.invalidateTags(['Comment', 'Task', 'Activity']));
    };

    // Listen for Real-time Notifications
    const handleNotificationCreated = () => {
      dispatch(baseApi.util.invalidateTags(['Notification']));
    };

    socket.on('task.created', handleTaskUpdated);
    socket.on('task.updated', handleTaskUpdated);
    socket.on('task.moved', handleTaskUpdated);
    socket.on('task.deleted', handleTaskUpdated);
    socket.on('task:updated', handleTaskUpdated);

    socket.on('project.created', handleProjectUpdated);
    socket.on('project.updated', handleProjectUpdated);
    socket.on('project.deleted', handleProjectUpdated);

    socket.on('comment.created', handleCommentCreated);
    socket.on('comment.deleted', handleCommentCreated);
    socket.on('subtask.created', handleTaskUpdated);
    socket.on('subtask.updated', handleTaskUpdated);
    socket.on('subtask.deleted', handleTaskUpdated);

    socket.on('notification.created', handleNotificationCreated);
    socket.on('notification:new', handleNotificationCreated);

    return () => {
      socket.off('task.created', handleTaskUpdated);
      socket.off('task.updated', handleTaskUpdated);
      socket.off('task.moved', handleTaskUpdated);
      socket.off('task.deleted', handleTaskUpdated);
      socket.off('task:updated', handleTaskUpdated);

      socket.off('project.created', handleProjectUpdated);
      socket.off('project.updated', handleProjectUpdated);
      socket.off('project.deleted', handleProjectUpdated);

      socket.off('comment.created', handleCommentCreated);
      socket.off('comment.deleted', handleCommentCreated);
      socket.off('subtask.created', handleTaskUpdated);
      socket.off('subtask.updated', handleTaskUpdated);
      socket.off('subtask.deleted', handleTaskUpdated);

      socket.off('notification.created', handleNotificationCreated);
      socket.off('notification:new', handleNotificationCreated);
    };
  }, [isAuthenticated, user?.id, dispatch]);

  return <>{children}</>;
}
