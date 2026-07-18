import React, { useState, useEffect } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import apiClient from '../../../services/api/apiClient';
import { useToast } from '../../../services/notifications/useToast';
import { ORDER_STATUS } from '../../../constants/orderStatus';

export const KitchenDisplayPage = () => {
  const toast = useToast();
  const [orders, setOrders] = useState([]);

  // Fetch initial orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiClient.get('/orders');
        setOrders(res.data.data);
      } catch (err) {
        console.warn('API error, loading from mock orders directly:', err);
        const { MOCK_ORDERS } = await import('../../../mocks/data/orders');
        setOrders(MOCK_ORDERS);
      }
    };

    fetchOrders();
  }, []);

  // Update order status
  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    let statusLabel = 'started preparing';
    if (newStatus === ORDER_STATUS.READY) statusLabel = 'marked as ready';
    if (newStatus === ORDER_STATUS.SERVED) statusLabel = 'served';
    
    toast.show(`Order ${orderId.replace('ord_', '#')} ${statusLabel}!`, 'success');
  };

  // Group orders by status
  const newTickets = orders.filter((o) => o.status === ORDER_STATUS.NEW);
  const cookingTickets = orders.filter((o) => o.status === ORDER_STATUS.COOKING);
  const readyTickets = orders.filter((o) => o.status === ORDER_STATUS.READY);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <h1 className="text-base font-bold text-gray-900">Kitchen Display System (KDS)</h1>
        <div className="text-xs font-semibold text-gray-500">
          Sync status: <span className="text-green-600">CONNECTED</span>
        </div>
      </div>

      {/* Kanban lanes */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {/* Column 1: New orders */}
        <div className="bg-gray-100/50 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wide border-l-4 border-blue-500 pl-2">
            New Tickets ({newTickets.length})
          </h2>
          {newTickets.map((order) => (
            <Card
              key={order.id}
              title={`Order ${order.id.replace('ord_', '#')}`}
              subtitle={`Table ${order.table}`}
              className="border-blue-100 shadow-xs"
            >
              <div className="text-xs text-gray-700 my-2 space-y-1.5 flex-1">
                {order.items.map((item, idx) => (
                  <div key={idx}>
                    <span className="font-semibold">{item.qty}x {item.name}</span>
                    {item.notes && <span className="text-red-500 font-medium block text-[10px]">* {item.notes}</span>}
                  </div>
                ))}
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full mt-2"
                onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.COOKING)}
              >
                Start Preparing
              </Button>
            </Card>
          ))}
          {newTickets.length === 0 && (
            <div className="text-xs text-gray-400 text-center py-8">No new tickets</div>
          )}
        </div>

        {/* Column 2: Preparation */}
        <div className="bg-gray-100/50 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-xs font-bold text-yellow-700 uppercase tracking-wide border-l-4 border-yellow-500 pl-2">
            Cooking ({cookingTickets.length})
          </h2>
          {cookingTickets.map((order) => (
            <Card
              key={order.id}
              title={`Order ${order.id.replace('ord_', '#')}`}
              subtitle={`Table ${order.table}`}
              className="border-yellow-100 shadow-xs"
            >
              <div className="text-xs text-gray-700 my-2 space-y-1.5 flex-1">
                {order.items.map((item, idx) => (
                  <div key={idx}>
                    <span className="font-semibold">{item.qty}x {item.name}</span>
                    {item.notes && <span className="text-red-500 font-medium block text-[10px]">* {item.notes}</span>}
                  </div>
                ))}
              </div>
              <Button
                variant="accent"
                size="sm"
                className="w-full mt-2"
                onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.READY)}
              >
                Mark as Ready
              </Button>
            </Card>
          ))}
          {cookingTickets.length === 0 && (
            <div className="text-xs text-gray-400 text-center py-8">No tickets in prep</div>
          )}
        </div>

        {/* Column 3: Completed prep */}
        <div className="bg-gray-100/50 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-xs font-bold text-green-700 uppercase tracking-wide border-l-4 border-green-500 pl-2">
            Ready to Serve ({readyTickets.length})
          </h2>
          {readyTickets.map((order) => (
            <Card
              key={order.id}
              title={`Order ${order.id.replace('ord_', '#')}`}
              subtitle={`Table ${order.table}`}
              className="border-green-100 shadow-xs"
            >
              <div className="text-xs text-gray-700 my-2 space-y-1.5 flex-1">
                {order.items.map((item, idx) => (
                  <div key={idx}>
                    <span className="font-semibold">{item.qty}x {item.name}</span>
                    {item.notes && <span className="text-red-500 font-medium block text-[10px]">* {item.notes}</span>}
                  </div>
                ))}
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full mt-2 !bg-green-600 hover:!bg-green-700"
                onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.SERVED)}
              >
                Served
              </Button>
            </Card>
          ))}
          {readyTickets.length === 0 && (
            <div className="text-xs text-gray-400 text-center py-8">No tickets ready</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenDisplayPage;
