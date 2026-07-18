/**
 * Formats a number into Indian Rupees (INR) currency format.
 * @param {number|string} amount - The amount to format
 * @param {boolean} [includeDecimals=true] - Whether to show decimal values
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (amount, includeDecimals = true) => {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) return '₹0.00';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(numericAmount);
};
