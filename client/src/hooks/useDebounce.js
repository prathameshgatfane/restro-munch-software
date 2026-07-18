import { useState, useEffect } from 'react';

/**
 * Debounce hook to delay updates to values (e.g. for search inputs).
 * @param {any} value - Value to debounce
 * @param {number} [delay=300] - Delay in milliseconds
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
