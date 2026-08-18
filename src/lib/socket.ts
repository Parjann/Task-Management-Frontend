import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const rawUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'https://task-management-backend-d5pm.onrender.com';
    const baseUrl = rawUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
    const token = Cookies.get('accessToken');

    socket = io(`${baseUrl}/ws`, {
      auth: {
        token,
      },
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
