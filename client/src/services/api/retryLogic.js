/**
 * Retries a function with exponential backoff on failure.
 * @param {Function} fn - The asynchronous function to retry
 * @param {number} [retries=3] - Maximum number of retries
 * @param {number} [delay=1000] - Initial delay in milliseconds
 * @param {number} [backoffFactor=2] - Multiplier for each subsequent retry delay
 * @returns {Promise<any>} Resolves to the return value of fn
 */
export const retryWithBackoff = async (fn, retries = 3, delay = 1000, backoffFactor = 2) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    // Only retry on network errors or 5xx server errors
    const shouldRetry = error.isNetworkError || (error.response?.status >= 500);
    if (!shouldRetry) {
      throw error;
    }

    console.warn(`Operation failed, retrying in ${delay}ms... (${retries} retries left)`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * backoffFactor, backoffFactor);
  }
};
