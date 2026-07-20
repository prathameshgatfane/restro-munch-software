import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import apiClient from '../../../services/api/apiClient';
import { useToast } from '../../../services/notifications/useToast';
import { TABLE_STATUS, TABLE_STATUS_COLORS } from '../../../constants/tableStatus';
import {
  setTables,
  addTable,
  setSelectedTableId,
  setMenuData,
  addToCart,
  removeFromCart,
  updateCartItemQty,
  clearCart,
  updateTable,
  moveCart,
  mergeCarts,
} from '../slices/posSlice';
import { createSession, addKOT, settleSession } from '../../kitchen/slices/ordersSlice';
import KOTModal from '../components/KOTModal';
import SplitPaymentModal from '../components/SplitPaymentModal';

export const POSPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const { tables, selectedTableId, categories, menuItems, cart } = useSelector((state) => state.pos);
  const activeTenantId = useSelector((state) => state.restaurants?.activeTenantId || 'restro_1');
  const sessions = useSelector((state) => state.orders?.sessions || []);

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeMobileTab, setActiveMobileTab] = useState('tables');

  // Modals state
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isQuickOrderModalOpen, setIsQuickOrderModalOpen] = useState(false);
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
  const [kotModalData, setKotModalData] = useState(null);
  const [isSplitPaymentOpen, setIsSplitPaymentOpen] = useState(false);

  // Add Table state
  const [newTableCapacity, setNewTableCapacity] = useState('4');

  // Move table state
  const [moveTargetId, setMoveTargetId] = useState('');

  // Merge table state
  const [mergeSourceIds, setMergeSourceIds] = useState([]);

  // Quick order local state
  const [quickOrderCart, setQuickOrderCart] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tablesRes = await apiClient.get('/tables');
        dispatch(setTables(tablesRes.data.data));

        const catsRes = await apiClient.get('/menu/categories');
        const itemsRes = await apiClient.get('/menu/items');
        dispatch(setMenuData({ categories: catsRes.data.data, items: itemsRes.data.data }));
      } catch (err) {
        console.warn('API error, loading from mock files directly:', err);
        const { MOCK_TABLES } = await import('../../../mocks/data/tables');
        const { MOCK_CATEGORIES, MOCK_MENU_ITEMS } = await import('../../../mocks/data/menuItems');
        dispatch(setTables(MOCK_TABLES));
        dispatch(setMenuData({ categories: MOCK_CATEGORIES, items: MOCK_MENU_ITEMS }));
      }
    };

    fetchData();
  }, [dispatch]);

  // Selected Table Data
  const selectedTable = useMemo(() => tables.find(t => t.id === selectedTableId), [tables, selectedTableId]);

  // Active Session for Selected Table
  const activeSession = useMemo(() => {
    return sessions.find(s => s.tableId === selectedTableId && s.billStatus === 'unpaid');
  }, [sessions, selectedTableId]);

  // Unsent Cart Items
  const currentCart = selectedTableId ? (cart[selectedTableId] || []) : [];

  // Sent KOT Items
  const sentItems = useMemo(() => {
    if (!activeSession) return [];
    return activeSession.kots.flatMap(kot => kot.items);
  }, [activeSession]);

  // Calculate pricing totals
  const subtotalUnsent = currentCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const subtotalSent = sentItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const subtotal = subtotalUnsent + subtotalSent;
  const gst = subtotal * 0.05;
  const grandTotal = subtotal + gst;

  // Filter menu items by active category
  const filteredMenuItems = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(item => {
        const cat = categories.find(c => c.id === item.categoryId);
        return cat && cat.name === activeCategory;
      });

  const handleAddTable = () => {
    const maxTableNum = tables.reduce((max, t) => {
      const num = parseInt(t.number, 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const nextTableNum = maxTableNum + 1;
    const nextTableId = `T${nextTableNum}`;

    const newTable = {
      id: nextTableId,
      number: nextTableNum.toString(),
      capacity: parseInt(newTableCapacity, 10) || 4,
      status: TABLE_STATUS.AVAILABLE,
      restaurantId: activeTenantId
    };

    dispatch(addTable(newTable));
    setIsAddTableModalOpen(false);
    toast.show(`Table ${nextTableNum} added successfully!`, 'success');
  };

  const handleAddItem = (item) => {
    if (!selectedTableId) {
      toast.show('Please select a table from the grid first!', 'warning');
      return;
    }
    dispatch(addToCart({ tableId: selectedTableId, item }));
    toast.show(`Added ${item.name} (₹${item.price}) to cart`, 'success');
    
    if (selectedTable && selectedTable.status === TABLE_STATUS.AVAILABLE) {
      dispatch(updateTable({ id: selectedTableId, status: TABLE_STATUS.OCCUPIED }));
    }
  };

  const handleUpdateQty = (itemId, qty) => {
    if (qty <= 0) {
      dispatch(removeFromCart({ tableId: selectedTableId, itemId }));
    } else {
      dispatch(updateCartItemQty({ tableId: selectedTableId, itemId, qty }));
    }
  };

  // Send to Kitchen
  const handleSendToKitchen = () => {
    if (currentCart.length === 0) return;

    let sessionId = activeSession?.tableSessionId;
    if (!sessionId) {
      sessionId = `sess_${Date.now()}`;
      dispatch(createSession({ restaurantId: activeTenantId, tableId: selectedTableId, tableSessionId: sessionId }));
    }

    const kotId = `KOT-${Date.now().toString().slice(-4)}`;
    const newKOT = {
      tableSessionId: sessionId,
      kotId,
      items: [...currentCart],
      timestamp: new Date().toISOString(),
      status: 'new'
    };

    dispatch(addKOT(newKOT));
    dispatch(clearCart(selectedTableId));
    toast.show('Order sent to kitchen!', 'success');
    
    setKotModalData({
      restaurantName: 'Restaurant',
      tableNumber: selectedTable?.number,
      kotId: newKOT.kotId,
      timestamp: newKOT.timestamp,
      items: newKOT.items,
      serverName: 'Cashier'
    });
  };

  const handleSettleBillClick = () => {
    if (subtotal === 0) {
      toast.show('No items to settle!', 'warning');
      return;
    }
    if (currentCart.length > 0) {
      toast.show('Please send unsent items to kitchen first, or remove them.', 'warning');
      return;
    }
    setIsSplitPaymentOpen(true);
  };

  const executeSettleBill = (payments, change) => {
    if (activeSession) {
      dispatch(settleSession(activeSession.tableSessionId));
    }
    dispatch(clearCart(selectedTableId));
    dispatch(updateTable({ id: selectedTableId, status: TABLE_STATUS.AVAILABLE }));
    setIsSplitPaymentOpen(false);
    toast.show(`Bill settled successfully! (Change: ₹${change.toFixed(2)})`, 'success');
  };

  // Execute Move Table
  const executeMoveTable = () => {
    if (!moveTargetId) {
      toast.show('Please select a destination table!', 'warning');
      return;
    }

    dispatch(moveCart({ sourceTableId: selectedTableId, targetTableId: moveTargetId }));
    
    dispatch(updateTable({ id: selectedTableId, status: TABLE_STATUS.AVAILABLE }));
    dispatch(updateTable({ id: moveTargetId, status: TABLE_STATUS.OCCUPIED }));
    dispatch(setSelectedTableId(moveTargetId));
    
    setIsMoveModalOpen(false);
    toast.show(`Moved order to Table ${moveTargetId.replace('T', '')}`, 'success');
  };

  const executeMergeTables = () => {
    if (mergeSourceIds.length === 0) {
      toast.show('Please select at least one table to merge!', 'warning');
      return;
    }
    dispatch(mergeCarts({ sourceTableIds: mergeSourceIds, targetTableId: selectedTableId }));
    mergeSourceIds.forEach(id => {
      dispatch(updateTable({ id, status: TABLE_STATUS.AVAILABLE }));
    });
    dispatch(updateTable({ id: selectedTableId, status: TABLE_STATUS.OCCUPIED }));
    setIsMergeModalOpen(false);
    toast.show(`Tables merged successfully`, 'success');
  };

  const addQuickOrderItem = (item) => {
    setQuickOrderCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQuickOrderQty = (itemId, qty) => {
    if (qty <= 0) {
      setQuickOrderCart(prev => prev.filter(i => i.id !== itemId));
    } else {
      setQuickOrderCart(prev => prev.map(i => i.id === itemId ? { ...i, qty } : i));
    }
  };

  const settleQuickOrder = () => {
    if (quickOrderCart.length === 0) {
      toast.show('Add items first!', 'warning');
      return;
    }
    setQuickOrderCart([]);
    setIsQuickOrderModalOpen(false);
    toast.show('Quick order settled & printed successfully!', 'success');
  };

  // Helper to determine table display status
  const getTableDisplayInfo = (tableId) => {
    const tableSession = sessions.find(s => s.tableId === tableId && s.billStatus === 'unpaid');
    if (!tableSession) return null;
    
    const allKots = tableSession.kots;
    if (allKots.length === 0) return null;
    
    const hasReady = allKots.some(k => k.status === 'ready');
    const hasCooking = allKots.some(k => k.status === 'cooking' || k.status === 'preparing');
    
    if (hasReady) return { text: 'Food Ready 🔔', color: 'bg-green-500 text-white animate-pulse' };
    if (hasCooking) return { text: 'Cooking', color: 'bg-yellow-500 text-white' };
    return { text: 'In Kitchen', color: 'bg-blue-500 text-white' };
  };

  return (
    <div className="h-[calc(100vh-5rem)] md:h-[calc(100vh-8rem)] flex flex-col gap-3 md:gap-4 overflow-hidden relative">
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-xs gap-3 flex-shrink-0">
        <h1 className="text-sm md:text-base font-bold text-gray-900 truncate">
          POS Terminal #1 {selectedTableId && <span className="text-orange-500 font-bold ml-2">(Table {selectedTableId.replace('T', '')})</span>}
        </h1>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Button className="flex-1 sm:flex-none whitespace-nowrap" variant="outline" size="sm" disabled={!selectedTableId} onClick={() => { setMoveTargetId(''); setIsMoveModalOpen(true); }}>
            Move Table
          </Button>
          <Button className="flex-1 sm:flex-none whitespace-nowrap" variant="outline" size="sm" disabled={!selectedTableId} onClick={() => { setMergeSourceIds([]); setIsMergeModalOpen(true); }}>
            Merge Tables
          </Button>
          <Button className="flex-1 sm:flex-none whitespace-nowrap" variant="primary" size="sm" onClick={() => { setQuickOrderCart([]); setIsQuickOrderModalOpen(true); }}>
            New Quick Order
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 overflow-hidden">
        {/* Floor Column */}
        <div className={`lg:col-span-3 bg-white rounded-xl border border-gray-100 p-4 overflow-y-auto flex flex-col gap-3 ${activeMobileTab === 'tables' ? 'flex h-full' : 'hidden lg:flex'}`}>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tables Grid</h2>
          <div className="grid grid-cols-3 gap-3 pb-16 lg:pb-0">
            {tables.map((table) => {
              const isSelected = selectedTableId === table.id;
              const colorClass = TABLE_STATUS_COLORS[table.status] || 'border-gray-200 bg-gray-50 text-gray-700';
              const displayInfo = getTableDisplayInfo(table.id);
              
              return (
                <button
                  key={table.id}
                  onClick={() => { dispatch(setSelectedTableId(table.id)); setActiveMobileTab('menu'); }}
                  className={`relative aspect-square rounded-lg border flex flex-col items-center justify-center p-2 transition-all ${colorClass} ${isSelected ? 'ring-2 ring-orange-500 border-orange-500 font-bold scale-[1.02] shadow-sm' : ''}`}
                >
                  <span className="text-sm">T{table.number}</span>
                  <span className="text-[9px] mt-0.5 opacity-80">{table.status === TABLE_STATUS.OCCUPIED ? 'Busy' : table.status === TABLE_STATUS.RESERVED ? 'Res' : 'Empty'}</span>
                  {displayInfo && (
                    <span className={`absolute -bottom-2 -right-2 text-[8px] font-bold px-1.5 py-0.5 rounded shadow ${displayInfo.color}`}>
                      {displayInfo.text}
                    </span>
                  )}
                </button>
              );
            })}
            <button onClick={() => setIsAddTableModalOpen(true)} className="aspect-square rounded-lg border border-dashed border-gray-300 bg-gray-50/50 flex flex-col items-center justify-center p-2 text-gray-500 hover:text-orange-500">
              <span className="text-xl font-bold">+</span>
            </button>
          </div>
        </div>

        {/* Menu Column */}
        <div className={`lg:col-span-5 bg-white rounded-xl border border-gray-100 p-4 overflow-y-auto flex flex-col gap-4 ${activeMobileTab === 'menu' ? 'flex h-full' : 'hidden lg:flex'}`}>
          <div className="sticky -top-4 z-10 bg-white pt-4 pb-3 -mt-4 -mx-4 px-4 border-b border-gray-100 flex flex-col gap-3">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Menu Items</h2>
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap">
              {['All', ...categories.map(c => c.name)].map((catName) => (
                <span key={catName} onClick={() => setActiveCategory(catName)} className={`px-3.5 py-1.5 rounded-full text-xs cursor-pointer transition-all ${activeCategory === catName ? 'bg-orange-100 text-orange-700 font-bold' : 'bg-gray-100 text-gray-600'}`}>{catName}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-24 lg:pb-0">
            {filteredMenuItems.map((item) => (
              <div key={item.id} onClick={() => handleAddItem(item)} className="border border-gray-100 rounded-lg p-2.5 flex gap-2.5 hover:border-orange-200 cursor-pointer bg-white">
                <img 
                  src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=60'} 
                  alt={item.name} 
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-gray-100" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=60';
                  }}
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between"><span className="text-xs font-bold truncate">{item.name}</span><span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} /></div>
                  </div>
                  <div className="flex justify-between items-center"><span className="text-xs font-bold font-mono">₹{item.price}</span><span className="text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded hover:bg-orange-500 hover:text-white transition-colors">+ Add</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Column */}
        <div className={`lg:col-span-4 bg-white rounded-xl border border-gray-100 p-4 flex flex-col justify-between overflow-hidden ${activeMobileTab === 'cart' ? 'flex h-full' : 'hidden lg:flex'}`}>
          <div className="flex-1 flex flex-col overflow-hidden">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-50 pb-2 flex justify-between items-center">
              <span>Active Bill Cart {selectedTableId ? `(Table ${selectedTableId.replace('T', '')})` : ''}</span>
              {activeSession && <span className="bg-blue-100 text-blue-800 text-[9px] px-2 py-0.5 rounded-full">KOTs: {activeSession.kots.length}</span>}
            </h2>
            
            {!selectedTableId ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-xs">Select a table</div>
            ) : currentCart.length === 0 && sentItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-xs">Cart is empty</div>
            ) : (
              <div className="flex-1 overflow-y-auto py-2 space-y-4">
                {/* Sent Items */}
                {sentItems.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Sent to Kitchen</h3>
                    {sentItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs mb-1 opacity-75">
                        <div className="flex-1 pr-2">
                          <span className="font-semibold text-gray-700">{item.qty}x {item.name}</span>
                          {item.notes && <span className="block text-[9px] italic ml-4">*{item.notes}</span>}
                        </div>
                        <span className="font-mono text-gray-900">₹{(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Unsent Items */}
                {currentCart.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-bold text-orange-500 uppercase mb-2">Unsent Items (Draft)</h3>
                    {currentCart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs mb-2">
                        <div className="flex-1 pr-2">
                          <span className="font-bold text-gray-800">{item.name}</span>
                          <span className="text-gray-500 block font-mono text-[10px]">₹{item.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex border rounded">
                            <button onClick={() => handleUpdateQty(item.id, item.qty - 1)} className="px-2 bg-gray-50 text-gray-600">-</button>
                            <span className="px-2 font-mono font-bold">{item.qty}</span>
                            <button onClick={() => handleUpdateQty(item.id, item.qty + 1)} className="px-2 bg-gray-50 text-gray-600">+</button>
                          </div>
                          <span className="font-mono w-12 text-right">₹{(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2 flex-shrink-0 pb-16 lg:pb-0">
            <div className="flex justify-between text-xs text-gray-500"><span>Subtotal</span><span className="font-mono">₹{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-xs text-gray-500"><span>GST (5%)</span><span className="font-mono">₹{gst.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm font-bold text-gray-900 pt-1"><span>Grand Total</span><span className="font-mono">₹{grandTotal.toFixed(2)}</span></div>
            
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                className="flex-1 border-orange-500 text-orange-600 hover:bg-orange-50"
                disabled={!selectedTableId || currentCart.length === 0}
                onClick={handleSendToKitchen}
              >
                Send to Kitchen
              </Button>
              <Button
                variant="accent"
                className="flex-1"
                disabled={!selectedTableId || grandTotal === 0}
                onClick={handleSettleBillClick}
              >
                Settle Bill
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Mobile Cart Summary Bar */}
      {(currentCart.length > 0 || sentItems.length > 0) && activeMobileTab !== 'cart' && (
        <div 
          onClick={() => setActiveMobileTab('cart')}
          className="lg:hidden sticky bottom-14 z-20 mx-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white p-3 rounded-xl shadow-xl flex justify-between items-center cursor-pointer transform active:scale-98 transition-all border border-orange-400/30"
        >
          <div className="flex items-center gap-2.5">
            <div className="bg-white/20 px-2.5 py-1 rounded-lg font-bold text-xs">
              {currentCart.reduce((sum, i) => sum + i.qty, 0) + sentItems.reduce((sum, i) => sum + i.qty, 0)} Items
            </div>
            <div>
              <div className="text-[10px] text-orange-100 uppercase tracking-wider font-semibold">Active Bill</div>
              <div className="font-black text-sm font-mono">₹{grandTotal.toFixed(2)}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 font-bold text-xs bg-white text-orange-600 px-3 py-1.5 rounded-lg shadow-sm">
            <span>View Cart & Settle</span>
            <span>→</span>
          </div>
        </div>
      )}

      {/* Mobile Sticky Tab Navigation */}
      <div className="lg:hidden sticky bottom-0 z-30 flex border-t border-gray-200 bg-white p-1.5 gap-1.5 shadow-lg flex-shrink-0">
        <button
          onClick={() => setActiveMobileTab('tables')}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
            activeMobileTab === 'tables' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          Tables {selectedTableId && `(T${selectedTableId.replace('T', '')})`}
        </button>
        <button
          onClick={() => setActiveMobileTab('menu')}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
            activeMobileTab === 'menu' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          Menu
        </button>
        <button
          onClick={() => setActiveMobileTab('cart')}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all relative ${
            activeMobileTab === 'cart' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          Cart
          {(currentCart.length > 0 || sentItems.length > 0) && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white w-4.5 h-4.5 rounded-full text-[10px] flex items-center justify-center font-extrabold border-2 border-white shadow-xs">
              {currentCart.reduce((sum, i) => sum + i.qty, 0) + sentItems.reduce((sum, i) => sum + i.qty, 0)}
            </span>
          )}
        </button>
      </div>

      <KOTModal isOpen={!!kotModalData} onClose={() => setKotModalData(null)} kotData={kotModalData} />
      
      <SplitPaymentModal 
        isOpen={isSplitPaymentOpen} 
        onClose={() => setIsSplitPaymentOpen(false)} 
        tableData={selectedTable} 
        totalAmount={grandTotal} 
        onSettle={executeSettleBill} 
      />

      {/* Move Table Modal */}
      <Modal isOpen={isMoveModalOpen} onClose={() => setIsMoveModalOpen(false)} title="Move Table Order" footerActions={<><Button variant="outline" size="sm" onClick={() => setIsMoveModalOpen(false)}>Cancel</Button><Button variant="primary" size="sm" onClick={executeMoveTable}>Confirm Move</Button></>}>
        <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold">Select Destination Table</label>
            <div className="grid grid-cols-4 gap-2">
              {tables.filter((t) => t.id !== selectedTableId && t.status === TABLE_STATUS.AVAILABLE).map((t) => (
                <button key={t.id} onClick={() => setMoveTargetId(t.id)} className={`border p-2 rounded ${moveTargetId === t.id ? 'ring-2 ring-orange-500' : ''}`}>T{t.number}</button>
              ))}
            </div>
        </div>
      </Modal>

      {/* Merge Modal */}
      <Modal isOpen={isMergeModalOpen} onClose={() => setIsMergeModalOpen(false)} title="Merge Tables" footerActions={<><Button variant="outline" size="sm" onClick={() => setIsMergeModalOpen(false)}>Cancel</Button><Button variant="primary" size="sm" onClick={executeMergeTables}>Merge Selected</Button></>}>
        <div className="flex flex-col gap-2">
            {tables.filter((t) => t.id !== selectedTableId).map((t) => (
              <label key={t.id} className="flex gap-2 items-center"><input type="checkbox" checked={mergeSourceIds.includes(t.id)} onChange={(e) => {
                if (e.target.checked) setMergeSourceIds(prev => [...prev, t.id]);
                else setMergeSourceIds(prev => prev.filter(id => id !== t.id));
              }}/> Table {t.number}</label>
            ))}
        </div>
      </Modal>

      {/* Quick Order Modal */}
      <Modal isOpen={isQuickOrderModalOpen} onClose={() => setIsQuickOrderModalOpen(false)} title="Quick Order" footerActions={<><Button variant="outline" size="sm" onClick={() => setIsQuickOrderModalOpen(false)}>Close</Button><Button variant="accent" size="sm" disabled={quickOrderCart.length === 0} onClick={settleQuickOrder}>Settle Order</Button></>}>
          <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">{menuItems.map(item => <div key={item.id} onClick={() => addQuickOrderItem(item)} className="border p-2 rounded cursor-pointer">{item.name}</div>)}</div>
              <div>{quickOrderCart.map(item => <div key={item.id} className="flex justify-between">{item.name} x{item.qty}</div>)}</div>
          </div>
      </Modal>

      {/* Add Table Modal */}
      <Modal isOpen={isAddTableModalOpen} onClose={() => setIsAddTableModalOpen(false)} title="Add Table" footerActions={<><Button variant="outline" size="sm" onClick={() => setIsAddTableModalOpen(false)}>Cancel</Button><Button variant="primary" size="sm" onClick={handleAddTable}>Add</Button></>}>
        <select value={newTableCapacity} onChange={(e) => setNewTableCapacity(e.target.value)} className="w-full border p-2 rounded"><option value="2">2 Seater</option><option value="4">4 Seater</option></select>
      </Modal>
    </div>
  );
};

export default POSPage;
