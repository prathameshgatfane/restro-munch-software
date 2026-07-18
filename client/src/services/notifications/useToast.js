import { useContext } from 'react';
import { ToastContext } from './toastContextObject';



/**
 * Hook to trigger toast notifications.
 * @returns {{show: (message: string, type?: 'info'|'success'|'warning'|'error', duration?: number) => string, removeToast: (id: string) => void, toasts: Array}}
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default useToast;
