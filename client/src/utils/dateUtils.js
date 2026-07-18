/**
 * Formats a date into a local date string (e.g. "17 Jul 2026").
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

/**
 * Formats a date into a 12-hour clock time (e.g. "06:30 PM").
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted time
 */
export const formatTime = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
};

/**
 * Calculates and formats elapsed minutes/hours (e.g., "15m" or "1h 5m").
 * @param {Date|string|number} startTime - Start time of order
 * @returns {string} Formatted duration string
 */
export const getElapsedTime = (startTime) => {
  if (!startTime) return '0m';
  const start = new Date(startTime).getTime();
  const now = Date.now();
  const diffMs = now - start;
  
  if (diffMs < 0) return '0m';
  
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }
  
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  return `${hours}h ${mins}m`;
};
