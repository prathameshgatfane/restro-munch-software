import { useOnlineStatus } from '../services/offline/networkStatus';

/**
 * Custom React hook that returns if network is online.
 * @returns {boolean}
 */
export const useOnline = () => {
  return useOnlineStatus();
};

export default useOnline;
