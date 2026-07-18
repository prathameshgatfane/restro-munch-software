import { useEffect } from 'react';
import { getSocket } from './socketManager';

/**
 * Hook to subscribe to real-time events.
 * @param {string} event - The socket event name to listen to
 * @param {Function} handler - The function called when the event is received
 */
export const useRealtime = (event, handler) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [event, handler]);
};
export default useRealtime;
