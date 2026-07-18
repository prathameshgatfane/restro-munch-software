import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api/apiClient';
import { db } from '../services/offline/db';
import parseError from '../services/error/errorHandlers';

/**
 * Custom hook to execute API requests with automated offline db caching and fallback support.
 * @param {string} url - API Endpoint
 * @param {object} options - Fetch options
 * @param {string} [options.localCacheTable] - Dexie table name to fallback to
 * @returns {{data: any, error: string, isLoading: boolean, refetch: Function}}
 */
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { localCacheTable } = options;

  const executeFetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(url);
      const payload = response.data.data;
      setData(payload);
      
      // If caching table provided, save locally
      if (localCacheTable && db[localCacheTable]) {
        await db.transaction('rw', db[localCacheTable], async () => {
          // Clear current table cache
          await db[localCacheTable].clear();
          // Store payload
          const items = Array.isArray(payload) ? payload : [payload];
          await db[localCacheTable].bulkPut(items);
        });
      }
    } catch (err) {
      console.warn('useFetch: Network request failed. Attempting offline fallback.', err);
      
      // Offline fallback: Query IndexedDB if available
      if (localCacheTable && db[localCacheTable]) {
        try {
          const cachedData = await db[localCacheTable].toArray();
          if (cachedData.length > 0) {
            setData(cachedData);
            setError('Running in offline mode. Viewing local cached data.');
            setIsLoading(false);
            return;
          }
        } catch (dbErr) {
          console.error('useFetch: Database read error:', dbErr);
        }
      }

      // Format network error
      const parsed = parseError(err);
      setError(parsed.message);
    } finally {
      setIsLoading(false);
    }
  }, [url, localCacheTable]);

  useEffect(() => {
    executeFetch();
  }, [executeFetch]);

  return {
    data,
    error,
    isLoading,
    refetch: executeFetch,
  };
};

export default useFetch;
