/**
 * Initializes error logging client (e.g. Sentry)
 */
export const initErrorLogging = () => {
  console.log('errorLogger: Error monitoring initialized');
  // In production, configure Sentry:
  // Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN })
};

/**
 * Capture and log application exceptions.
 * @param {Error} error - Error object
 * @param {object} [context] - Key-value metadata context
 */
export const logError = (error, context = {}) => {
  console.error('[RestroMunch Error Log]:', error, '\nContext:', context);
  // Sentry.captureException(error, { extra: context })
};
