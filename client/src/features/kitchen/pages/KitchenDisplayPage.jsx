import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { useToast } from '../../../services/notifications/useToast';
import { ORDER_STATUS } from '../../../constants/orderStatus';
import { updateKOTStatus } from '../slices/ordersSlice';

const getElapsedTime = (timestamp) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const getUrgencyColor = (timestamp) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes >= 20) return 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
  if (minutes >= 10) return 'border-orange-500';
  return 'border-green-500';
};

const KOTCard = ({ kot, tableNumber, onUpdateStatus }) => {
  const [elapsed, setElapsed] = useState(getElapsedTime(kot.timestamp));

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(getElapsedTime(kot.timestamp));
    }, 1000);
    return () => clearInterval(interval);
  }, [kot.timestamp]);

  const urgencyClass = getUrgencyColor(kot.timestamp);

  const getNextAction = () => {
    switch (kot.status) {
      case ORDER_STATUS.NEW: return { label: 'Accept Ticket', nextStatus: ORDER_STATUS.ACCEPTED, color: 'primary' };
      case ORDER_STATUS.ACCEPTED: return { label: 'Start Preparing', nextStatus: ORDER_STATUS.PREPARING, color: 'accent' };
      case ORDER_STATUS.PREPARING: return { label: 'Mark Cooking', nextStatus: ORDER_STATUS.COOKING, color: 'accent' };
      case ORDER_STATUS.COOKING: return { label: 'Ready for Pickup', nextStatus: ORDER_STATUS.READY, color: 'primary' };
      case ORDER_STATUS.READY: return { label: 'Picked / Served', nextStatus: ORDER_STATUS.SERVED, color: 'primary' };
      default: return null;
    }
  };

  const action = getNextAction();

  return (
    <Card className={`border-2 ${urgencyClass} shadow-sm relative overflow-hidden`}>
      {urgencyClass.includes('border-red') && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl">
          DELAYED
        </div>
      )}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">{kot.kotId}</h3>
          <p className="text-xs text-gray-600 font-semibold">Table {tableNumber}</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono font-bold text-gray-800">{elapsed}</div>
          <div className="text-[9px] text-gray-500">{new Date(kot.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
      
      <div className="text-xs text-gray-700 space-y-1.5 my-3 bg-gray-50 p-2 rounded">
        {kot.items.map((item, idx) => (
          <div key={idx} className="flex justify-between">
            <span className="font-bold">{item.qty}x {item.name}</span>
            {item.notes && <span className="text-red-600 italic block text-[10px] w-full mt-0.5">* {item.notes}</span>}
          </div>
        ))}
      </div>

      {action && (
        <Button 
          variant={action.color} 
          size="sm" 
          className="w-full text-xs py-1.5"
          onClick={() => onUpdateStatus(kot.kotId, action.nextStatus)}
        >
          {action.label}
        </Button>
      )}
    </Card>
  );
};

export const KitchenDisplayPage = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  
  const sessions = useSelector((state) => state.orders.sessions || []);
  const activeTenantId = useSelector((state) => state.restaurants?.activeTenantId || 'restro_1');

  // Flatten all KOTs from active sessions for the current tenant
  const allKots = useMemo(() => {
    return sessions
      .filter(s => s.restaurantId === activeTenantId && s.billStatus === 'unpaid')
      .flatMap(session => 
        session.kots.map(kot => ({
          ...kot,
          tableId: session.tableId,
        }))
      );
  }, [sessions, activeTenantId]);

  // Alert on new KOT (simple notification logic)
  const [prevKotCount, setPrevKotCount] = useState(allKots.length);
  useEffect(() => {
    if (allKots.length > prevKotCount) {
      toast.show('New Order Received!', 'success');
      // In a real app, play a Web Audio chime here
      try {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.log('Audio play failed', e));
      } catch (e) {}
    }
    setPrevKotCount(allKots.length);
  }, [allKots.length, prevKotCount, toast]);

  const handleUpdateStatus = (kotId, newStatus) => {
    dispatch(updateKOTStatus({ kotId, status: newStatus }));
    toast.show(`KOT ${kotId} updated to ${newStatus.toUpperCase()}`, 'success');
  };

  const getKotsByStatus = (statuses) => {
    return allKots.filter(k => statuses.includes(k.status)).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const newAndAccepted = getKotsByStatus([ORDER_STATUS.NEW, ORDER_STATUS.ACCEPTED]);
  const prepAndCooking = getKotsByStatus([ORDER_STATUS.PREPARING, ORDER_STATUS.COOKING]);
  const readyTickets = getKotsByStatus([ORDER_STATUS.READY]);
  const servedTickets = getKotsByStatus([ORDER_STATUS.PICKED, ORDER_STATUS.SERVED]);

  return (
    <div className="h-[calc(100vh-5rem)] md:h-[calc(100vh-8rem)] flex flex-col gap-3 overflow-hidden bg-gray-50 p-2 md:p-4 rounded-xl">
      <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
        <h1 className="text-lg font-black text-gray-900 tracking-tight">KDS <span className="font-medium text-gray-500 text-sm ml-2">Kitchen Display System</span></h1>
        <div className="flex gap-4 text-xs font-bold">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> <span className="text-green-700">Good</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> <span className="text-orange-700">Warning</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> <span className="text-red-700">Delayed</span></div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden">
        {/* Column 1: New */}
        <div className="bg-white rounded-lg shadow-sm flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-blue-50 border-b border-blue-100 p-2.5 flex justify-between items-center font-bold text-blue-800 text-sm">
            NEW / ACCEPTED <span className="bg-blue-200 px-2 rounded-full text-xs">{newAndAccepted.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/50">
            {newAndAccepted.map(kot => (
              <KOTCard key={kot.kotId} kot={kot} tableNumber={kot.tableId?.replace('T', '')} onUpdateStatus={handleUpdateStatus} />
            ))}
          </div>
        </div>

        {/* Column 2: Cooking */}
        <div className="bg-white rounded-lg shadow-sm flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-yellow-50 border-b border-yellow-100 p-2.5 flex justify-between items-center font-bold text-yellow-800 text-sm">
            PREP / COOKING <span className="bg-yellow-200 px-2 rounded-full text-xs">{prepAndCooking.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/50">
            {prepAndCooking.map(kot => (
              <KOTCard key={kot.kotId} kot={kot} tableNumber={kot.tableId?.replace('T', '')} onUpdateStatus={handleUpdateStatus} />
            ))}
          </div>
        </div>

        {/* Column 3: Ready */}
        <div className="bg-white rounded-lg shadow-sm flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-green-50 border-b border-green-100 p-2.5 flex justify-between items-center font-bold text-green-800 text-sm">
            READY TO SERVE <span className="bg-green-200 px-2 rounded-full text-xs">{readyTickets.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/50">
            {readyTickets.map(kot => (
              <KOTCard key={kot.kotId} kot={kot} tableNumber={kot.tableId?.replace('T', '')} onUpdateStatus={handleUpdateStatus} />
            ))}
          </div>
        </div>

        {/* Column 4: History/Served */}
        <div className="bg-white rounded-lg shadow-sm flex flex-col overflow-hidden border border-gray-200 opacity-75">
          <div className="bg-gray-100 border-b border-gray-200 p-2.5 flex justify-between items-center font-bold text-gray-600 text-sm">
            RECENTLY SERVED <span className="bg-gray-200 px-2 rounded-full text-xs">{servedTickets.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/50">
            {servedTickets.map(kot => (
              <Card key={kot.kotId} className="border-gray-200 bg-gray-50">
                <div className="flex justify-between text-xs text-gray-500 font-bold">
                  <span>{kot.kotId}</span>
                  <span>T{kot.tableId?.replace('T', '')}</span>
                </div>
                <div className="text-[10px] mt-1 text-gray-400">Marked as Served</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenDisplayPage;
