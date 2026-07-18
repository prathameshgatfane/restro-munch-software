import { SyncQueue } from './syncQueue';

let syncInterval = null;
let isSyncing = false;

export const startSyncEngine = () => {
  if (syncInterval) return;

  // Listen for online events to trigger sync immediately
  window.addEventListener('online', triggerSync);

  // Periodic fallback check every 30 seconds
  syncInterval = setInterval(() => {
    if (navigator.onLine) {
      triggerSync();
    }
  }, 30000);
  
  // Initial sync attempt
  if (navigator.onLine) {
    triggerSync();
  }
};

export const stopSyncEngine = () => {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
  window.removeEventListener('online', triggerSync);
};

export const triggerSync = async () => {
  if (isSyncing) return;
  isSyncing = true;
  
  try {
    await SyncQueue.processQueue();
  } catch (error) {
    console.error('SyncEngine: Error during sync queue processing', error);
  } finally {
    isSyncing = false;
  }
};
