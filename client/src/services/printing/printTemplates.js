import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate, formatTime } from '../../utils/dateUtils';

/**
 * Generates HTML content for KOT receipt.
 * @param {object} order - The order details
 * @param {string} order.id - Order number
 * @param {string} order.table - Table identifier
 * @param {Array} order.items - List of ordered items (name, qty, notes)
 * @returns {string} HTML string
 */
export const generateKOTHTML = (order) => {
  const itemsHTML = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px dashed #ccc;">
        <td style="padding: 6px 0; font-size: 14px;"><strong>${item.qty}x</strong></td>
        <td style="padding: 6px 0; font-size: 14px;">
          ${item.name}
          ${item.notes ? `<br/><span style="font-size: 12px; color: #555; font-style: italic;">* ${item.notes}</span>` : ''}
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <div style="font-family: monospace; font-size: 12px; width: 80mm; padding: 5px; color: #000; background: #fff;">
      <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 5px;">
        <h2 style="margin: 0; font-size: 18px;">KITCHEN ORDER TICKET</h2>
        <div style="margin-top: 5px;"><strong>Order ID:</strong> ${order.id}</div>
        <div><strong>Date:</strong> ${formatDate(new Date())} | <strong>Time:</strong> ${formatTime(new Date())}</div>
      </div>
      
      <div style="font-size: 16px; margin: 10px 0; border-bottom: 2px solid #000; padding-bottom: 5px; text-align: center;">
        <strong>TABLE: ${order.table}</strong>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid #000;">
            <th style="width: 15%; padding-bottom: 5px;">Qty</th>
            <th style="width: 85%; padding-bottom: 5px;">Item</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>
      
      <div style="text-align: center; margin-top: 20px; border-top: 1px solid #000; padding-top: 5px; font-size: 10px;">
        *** Restro Munch POS ***
      </div>
    </div>
  `;
};

/**
 * Generates HTML content for customer final Bill.
 * @param {object} order - The order details
 * @param {object} billDetails - Calculated tax figures from calculateBill
 * @param {object} restaurantDetails - Restaurant general config
 * @returns {string} HTML string
 */
export const generateBillHTML = (order, billDetails, restaurantDetails = {}) => {
  const name = restaurantDetails.name || 'RESTRO MUNCH';
  const address = restaurantDetails.address || '123 Dhaba Road, NH-8';
  const phone = restaurantDetails.phone || '9999999999';
  const gstIn = restaurantDetails.gstin || '27XXXXX0000X0Z0';

  const itemsHTML = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px dashed #eee;">
        <td style="padding: 4px 0;">${item.name}</td>
        <td style="padding: 4px 0; text-align: center;">${item.qty}</td>
        <td style="padding: 4px 0; text-align: right;">${formatCurrency(item.price, false)}</td>
        <td style="padding: 4px 0; text-align: right;">${formatCurrency(item.price * item.qty, false)}</td>
      </tr>
    `
    )
    .join('');

  return `
    <div style="font-family: monospace; font-size: 12px; width: 80mm; padding: 5px; color: #000; background: #fff;">
      <div style="text-align: center; border-bottom: 1px solid #000; padding-bottom: 8px;">
        <h2 style="margin: 0; font-size: 16px; text-transform: uppercase;">${name}</h2>
        <div style="font-size: 10px; margin-top: 2px;">${address}</div>
        <div style="font-size: 10px;">Tel: ${phone}</div>
        <div style="font-size: 10px;">GSTIN: ${gstIn}</div>
      </div>
      
      <div style="margin: 8px 0; font-size: 11px;">
        <div><strong>Bill No:</strong> ${order.id}</div>
        <div><strong>Table:</strong> ${order.table}</div>
        <div><strong>Date:</strong> ${formatDate(order.created_at || new Date())} | <strong>Time:</strong> ${formatTime(order.created_at || new Date())}</div>
      </div>

      <table style="width: 100%; border-collapse: collapse; text-align: left; border-top: 1px solid #000; border-bottom: 1px solid #000; font-size: 11px;">
        <thead>
          <tr style="border-bottom: 1px solid #000;">
            <th style="width: 45%; padding: 4px 0;">Item</th>
            <th style="width: 10%; padding: 4px 0; text-align: center;">Qty</th>
            <th style="width: 20%; padding: 4px 0; text-align: right;">Rate</th>
            <th style="width: 25%; padding: 4px 0; text-align: right;">Amt</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <div style="margin-top: 8px; border-bottom: 1px solid #000; padding-bottom: 8px; font-size: 11px;">
        <div style="display: flex; justify-content: space-between;">
          <span>Sub Total:</span>
          <span>${formatCurrency(billDetails.subtotal)}</span>
        </div>
        ${billDetails.discount > 0 ? `
        <div style="display: flex; justify-content: space-between; font-weight: bold;">
          <span>Discount:</span>
          <span>-${formatCurrency(billDetails.discount)}</span>
        </div>` : ''}
        ${billDetails.serviceCharge > 0 ? `
        <div style="display: flex; justify-content: space-between;">
          <span>Service Charge (${restaurantDetails.serviceChargeRate || 0}%):</span>
          <span>${formatCurrency(billDetails.serviceCharge)}</span>
        </div>` : ''}
        <div style="display: flex; justify-content: space-between;">
          <span>CGST (${(restaurantDetails.gstRate || 5) / 2}%):</span>
          <span>${formatCurrency(billDetails.cgst)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>SGST (${(restaurantDetails.gstRate || 5) / 2}%):</span>
          <span>${formatCurrency(billDetails.sgst)}</span>
        </div>
        ${billDetails.roundOff !== 0 ? `
        <div style="display: flex; justify-content: space-between; font-size: 10px; color: #555;">
          <span>Round Off:</span>
          <span>${billDetails.roundOff > 0 ? '+' : ''}${formatCurrency(billDetails.roundOff)}</span>
        </div>` : ''}
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; margin: 8px 0;">
        <span>GRAND TOTAL:</span>
        <span>${formatCurrency(billDetails.grandTotal)}</span>
      </div>

      <div style="text-align: center; margin-top: 15px; border-top: 1px dashed #000; padding-top: 10px; font-size: 10px;">
        <strong>Thank You! Visit Again.</strong>
        <div style="margin-top: 5px;">Powered by Restro Munch</div>
      </div>
    </div>
  `;
};
