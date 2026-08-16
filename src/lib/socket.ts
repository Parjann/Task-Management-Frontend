import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const SOCKET_URL =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      'https://task-management-backend-d5pm.onrender.com';
    const token = Cookies.get('accessToken');

    socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      autoConnect: true,
      transports: ['websocket'],
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
