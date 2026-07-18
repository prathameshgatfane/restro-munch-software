/**
 * Calculates tax breakups, service charges, discounts, and roundoff for an order.
 * @param {number} subtotal - The subtotal amount before taxes and discounts
 * @param {object} config - Configuration parameters
 * @param {number} [config.gstRate=5] - Total GST rate (e.g. 5% = 2.5% CGST + 2.5% SGST)
 * @param {number} [config.serviceChargeRate=0] - Service charge percentage rate (e.g. 5%)
 * @param {number} [config.discountPercent=0] - Discount percentage (e.g. 10%)
 * @param {number} [config.discountAmount=0] - Flat discount amount (e.g. ₹50)
 * @returns {object} Calculated billing figures
 */
export const calculateBill = (subtotal, config = {}) => {
  const gstRate = config.gstRate ?? 5;
  const serviceChargeRate = config.serviceChargeRate ?? 0;
  const discountPercent = config.discountPercent ?? 0;
  const discountAmount = config.discountAmount ?? 0;

  // 1. Calculate discount
  let totalDiscount = 0;
  if (discountPercent > 0) {
    totalDiscount = (subtotal * discountPercent) / 100;
  } else if (discountAmount > 0) {
    totalDiscount = discountAmount;
  }
  totalDiscount = Math.min(totalDiscount, subtotal); // Discount cannot exceed subtotal

  const discountedSubtotal = subtotal - totalDiscount;

  // 2. Calculate service charge (on discounted subtotal)
  const serviceCharge = (discountedSubtotal * serviceChargeRate) / 100;

  // 3. Calculate GST (split into CGST and SGST)
  const gstAmount = (discountedSubtotal * gstRate) / 100;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  // 4. Grand Total before round off
  const rawGrandTotal = discountedSubtotal + serviceCharge + gstAmount;

  // 5. Round off to nearest integer
  const grandTotal = Math.round(rawGrandTotal);
  const roundOff = Number((grandTotal - rawGrandTotal).toFixed(2));

  return {
    subtotal,
    discount: totalDiscount,
    discountedSubtotal,
    serviceCharge,
    cgst,
    sgst,
    totalTax: gstAmount,
    roundOff,
    grandTotal,
  };
};
