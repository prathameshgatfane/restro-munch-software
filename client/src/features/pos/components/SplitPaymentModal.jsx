import React, { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { useToast } from '../../../services/notifications/useToast';

export const SplitPaymentModal = ({ isOpen, onClose, tableData, totalAmount, onSettle }) => {
  const toast = useToast();
  const [payments, setPayments] = useState({
    cash: 0,
    upi: 0,
    card: 0
  });

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setPayments({
        cash: totalAmount, // Default to cash for full amount
        upi: 0,
        card: 0
      });
    }
  }, [isOpen, totalAmount]);

  const handlePaymentChange = (method, value) => {
    const numValue = parseFloat(value) || 0;
    setPayments(prev => ({
      ...prev,
      [method]: numValue
    }));
  };

  const totalPaid = Object.values(payments).reduce((sum, val) => sum + val, 0);
  const remaining = totalAmount - totalPaid;
  const isSettled = remaining <= 0;
  const changeDue = remaining < 0 ? Math.abs(remaining) : 0;

  const handleConfirm = () => {
    if (totalPaid < totalAmount) {
      toast.show(`Cannot settle. Amount short by ₹${remaining.toFixed(2)}`, 'error');
      return;
    }

    // Filter out 0 payments
    const finalPayments = Object.entries(payments)
      .filter(([_, amount]) => amount > 0)
      .map(([method, amount]) => ({ method, amount }));

    onSettle(finalPayments, changeDue);
  };

  if (!tableData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Settle Bill - Table ${tableData.number}`}
      className="!max-w-md"
      footerActions={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleConfirm}
            disabled={!isSettled}
            className={!isSettled ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Confirm & Print Bill
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Bill Summary */}
        <div className="bg-orange-50 p-4 rounded-lg flex justify-between items-center border border-orange-100">
          <div className="font-bold text-orange-900 text-lg">Total Bill Amount</div>
          <div className="text-2xl font-black text-orange-600">₹{totalAmount.toFixed(2)}</div>
        </div>

        {/* Payment Split Inputs */}
        <div className="space-y-3 mt-2">
          <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2 border-b pb-2">
            Split Payment Options
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-24 text-sm font-semibold text-gray-700">Cash (₹)</div>
            <Input 
              type="number"
              min="0"
              step="0.01"
              value={payments.cash || ''}
              onChange={(e) => handlePaymentChange('cash', e.target.value)}
              placeholder="0.00"
              className="!py-2"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 text-sm font-semibold text-gray-700">UPI (₹)</div>
            <Input 
              type="number"
              min="0"
              step="0.01"
              value={payments.upi || ''}
              onChange={(e) => handlePaymentChange('upi', e.target.value)}
              placeholder="0.00"
              className="!py-2"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 text-sm font-semibold text-gray-700">Card (₹)</div>
            <Input 
              type="number"
              min="0"
              step="0.01"
              value={payments.card || ''}
              onChange={(e) => handlePaymentChange('card', e.target.value)}
              placeholder="0.00"
              className="!py-2"
            />
          </div>
        </div>

        {/* Summary Footer */}
        <div className="mt-4 pt-4 border-t flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">Total Paid:</span>
            <span className="font-bold text-gray-900">₹{totalPaid.toFixed(2)}</span>
          </div>
          
          {remaining > 0 ? (
            <div className="flex justify-between text-sm text-red-600 font-bold bg-red-50 p-2 rounded">
              <span>Remaining Amount:</span>
              <span>₹{remaining.toFixed(2)}</span>
            </div>
          ) : (
            <div className="flex justify-between text-sm text-green-600 font-bold bg-green-50 p-2 rounded">
              <span>Change Due:</span>
              <span>₹{changeDue.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SplitPaymentModal;
