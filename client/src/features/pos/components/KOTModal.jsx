import React from 'react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';

export const KOTModal = ({ isOpen, onClose, kotData }) => {
  if (!kotData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kitchen Order Ticket"
      className="!max-w-md print:!shadow-none print:!border-none"
      footerActions={
        <div className="flex w-full justify-between print:hidden">
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          <Button variant="primary" size="sm" onClick={handlePrint}>Print KOT Ticket</Button>
        </div>
      }
    >
      <div className="p-4 bg-white font-mono text-sm border-2 border-dashed border-gray-300 print:border-none print:p-0">
        <div className="text-center mb-4">
          <h2 className="font-bold text-lg">{kotData.restaurantName || 'Restaurant'}</h2>
          <div className="font-semibold text-gray-700">KITCHEN ORDER TICKET</div>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(kotData.timestamp).toLocaleString()}
          </div>
        </div>

        <div className="flex justify-between border-y border-dashed border-gray-300 py-2 mb-4 font-bold text-base">
          <div>Table: {kotData.tableNumber}</div>
          <div>Token: #{kotData.kotId?.split('-')[1]}</div>
        </div>

        <div className="mb-4">
          <div className="text-xs text-gray-600 mb-1 flex justify-between border-b border-gray-200 pb-1">
            <span className="w-8">Qty</span>
            <span className="flex-1">Item</span>
          </div>
          {kotData.items?.map((item, idx) => (
            <div key={idx} className="py-2 border-b border-gray-100 last:border-0">
              <div className="flex justify-between font-semibold">
                <span className="w-8">{item.qty}</span>
                <span className="flex-1">{item.name}</span>
              </div>
              {item.notes && (
                <div className="text-[11px] text-gray-600 mt-0.5 ml-8 italic">
                  * Note: {item.notes}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-gray-500 mt-6 pt-2 border-t border-dashed border-gray-300">
          <div>Server: {kotData.serverName || 'Staff'}</div>
          <div>- End of Ticket -</div>
        </div>
      </div>
    </Modal>
  );
};

export default KOTModal;
