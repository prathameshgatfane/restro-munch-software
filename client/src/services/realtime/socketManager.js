import { io } from 'socket.io-client';

let socket = null;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const getSocket = () => {
  return socket;
};

export const initSocket = (outletId) => {
  if (socket) return socket;

  const token = localStorage.getItem('accessToken');
  socket = io(SOCKET_URL, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('realtime: Connected to WebSocket server');
    socket.emit('join-outlet', { outletId });
  });

  socket.on('disconnect', (reason) => {
    console.log(`realtime: Disconnected from WebSocket server (${reason})`);
  });

  socket.on('connect_error', (error) => {
    console.error('realtime: Connection error:', error.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
