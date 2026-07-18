import { ERROR_CODES, ERROR_MESSAGES } from '../../constants/errorCodes';

/**
 * Parses any exception and returns a standard error code and message.
 * @param {Error|object} error - The caught exception object
 * @returns {{code: string, message: string}} Standardized error properties
 */
export const parseError = (error) => {
  if (!error) {
    return { code: ERROR_CODES.SERVER_ERROR, message: ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR] };
  }

  // Check custom offline flag set in Axios interceptor
  if (error.isNetworkError) {
    return {
      code: ERROR_CODES.NETWORK_ERROR,
      message: ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
    };
  }

  // Check HTTP response code
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 401:
        return {
          code: ERROR_CODES.UNAUTHORIZED,
          message: ERROR_MESSAGES[ERROR_CODES.UNAUTHORIZED],
        };
      case 403:
        return {
          code: ERROR_CODES.FORBIDDEN,
          message: ERROR_MESSAGES[ERROR_CODES.FORBIDDEN],
        };
      case 404:
        return {
          code: ERROR_CODES.NOT_FOUND,
          message: ERROR_MESSAGES[ERROR_CODES.NOT_FOUND],
        };
      case 422:
        return {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: error.response.data?.message || ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR],
        };
      default:
        if (status >= 500) {
          return {
            code: ERROR_CODES.SERVER_ERROR,
            message: ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR],
          };
        }
    }
  }

  // Fallback for general javascript error objects
  return {
    code: 'CLIENT_ERROR',
    message: error.message || 'An unexpected client error occurred.',
  };
};
export default parseError;
