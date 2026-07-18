import { useState, useEffect } from 'react';

/**
 * React hook to sync values reactively to localStorage.
 * @param {string} key - localStorage key
 * @param {any} initialValue - default fallback value
 * @returns {[any, Function]}
 */
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`LocalStorage Hook: Error reading key "${key}"`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`LocalStorage Hook: Error setting key "${key}"`, error);
    }
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
