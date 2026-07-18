export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const PHONE_REGEX = /^[6-9]\d{9}$/; // Standard Indian mobile phone validation

/**
 * Validates if a string is a valid email address.
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => EMAIL_REGEX.test(email);

/**
 * Validates if a string is a valid Indian mobile number.
 * @param {string} phone 
 * @returns {boolean}
 */
export const isValidPhone = (phone) => PHONE_REGEX.test(phone);
