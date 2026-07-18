import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import apiClient from '../../../services/api/apiClient';
import { useToast } from '../../../services/notifications/useToast';
import { TABLE_STATUS, TABLE_STATUS_COLORS } from '../../../constants/tableStatus';
import {
  setTables,
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

export const POSPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const { tables, selectedTableId, categories, menuItems, cart } = useSelector((state) => state.pos);

  const [activeCategory, setActiveCategory] = useState('All');

  // Modals state
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isQuickOrderModalOpen, setIsQuickOrderModalOpen] = useState(false);

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

  // Selected Table's Cart
  const currentCart = selectedTableId ? (cart[selectedTableId] || []) : [];

  // Filter menu items by active category
  const filteredMenuItems = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(item => {
        const cat = categories.find(c => c.id === item.categoryId);
        return cat && cat.name === activeCategory;
      });

  // Calculate pricing totals
  const subtotal = currentCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gst = subtotal * 0.05;
  const grandTotal = subtotal + gst;

  // Add Item to selected table's cart
  const handleAddItem = (item) => {
    if (!selectedTableId) {
      toast.show('Please select a table from the grid first!', 'warning');
      return;
    }
    dispatch(addToCart({ tableId: selectedTableId, item }));
    
    // Auto-occupy the table if it was available
    const table = tables.find(t => t.id === selectedTableId);
    if (table && table.status === TABLE_STATUS.AVAILABLE) {
      dispatch(updateTable({ id: selectedTableId, status: TABLE_STATUS.OCCUPIED }));
    }
  };

  // Modify item quantity
  const handleUpdateQty = (itemId, qty) => {
    if (qty <= 0) {
      dispatch(removeFromCart({ tableId: selectedTableId, itemId }));
      const updatedCart = currentCart.filter(i => i.id !== itemId);
      if (updatedCart.length === 0) {
        dispatch(updateTable({ id: selectedTableId, status: TABLE_STATUS.AVAILABLE }));
      }
    } else {
      dispatch(updateCartItemQty({ tableId: selectedTableId, itemId, qty }));
    }
  };

  // Settle Bill
  const handleSettleBill = () => {
    if (!selectedTableId) {
      toast.show('Please select a table first!', 'warning');
      return;
    }
    if (currentCart.length === 0) {
      toast.show('Cart is empty!', 'warning');
      return;
    }

    dispatch(clearCart(selectedTableId));
    dispatch(updateTable({ id: selectedTableId, status: TABLE_STATUS.AVAILABLE }));
    toast.show(`Bill for Table ${selectedTableId.replace('T', '')} settled & printed successfully!`, 'success');
  };

  // Execute Move Table
  const executeMoveTable = () => {
    if (!moveTargetId) {
      toast.show('Please select a destination table!', 'warning');
      return;
    }

    dispatch(moveCart({ sourceTableId: selectedTableId, targetTableId: moveTargetId }));
    
    // Update statuses
    dispatch(updateTable({ id: selectedTableId, status: TABLE_STATUS.AVAILABLE }));
    dispatch(updateTable({ id: moveTargetId, status: TABLE_STATUS.OCCUPIED }));
    dispatch(setSelectedTableId(moveTargetId));
    
    setIsMoveModalOpen(false);
    toast.show(`Moved order from Table ${selectedTableId.replace('T', '')} to Table ${moveTargetId.replace('T', '')}`, 'success');
  };

  // Execute Merge Tables
  const executeMergeTables = () => {
    if (mergeSourceIds.length === 0) {
      toast.show('Please select at least one table to merge!', 'warning');
      return;
    }

    dispatch(mergeCarts({ sourceTableIds: mergeSourceIds, targetTableId: selectedTableId }));
    
    // Mark merged tables as available
    mergeSourceIds.forEach(id => {
      dispatch(updateTable({ id, status: TABLE_STATUS.AVAILABLE }));
    });
    
    // Ensure target table is occupied
    dispatch(updateTable({ id: selectedTableId, status: TABLE_STATUS.OCCUPIED }));
    
    setIsMergeModalOpen(false);
    toast.show(`Successfully merged tables into Table ${selectedTableId.replace('T', '')}`, 'success');
  };

  // Quick Order handlers
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

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* POS Top Actions bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <h1 className="text-base font-bold text-gray-900">
          POS Terminal #1 {selectedTableId && <span className="text-orange-500 font-bold ml-2">(Table {selectedTableId.replace('T', '')})</span>}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!selectedTableId || currentCart.length === 0}
            onClick={() => {
              setMoveTargetId('');
              setIsMoveModalOpen(true);
            }}
          >
            Move Table
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!selectedTableId}
            onClick={() => {
              setMergeSourceIds([]);
              setIsMergeModalOpen(true);
            }}
          >
            Merge Tables
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setQuickOrderCart([]);
              setIsQuickOrderModalOpen(true);
            }}
          >
            New Quick Order
          </Button>
        </div>
      </div>

      {/* Main 3-column layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        {/* Column 1: Tables Floor (left) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-4 overflow-y-auto flex flex-col gap-3">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tables Grid</h2>
          <div className="grid grid-cols-3 gap-3">
            {tables.map((table) => {
              const isSelected = selectedTableId === table.id;
              const colorClass = TABLE_STATUS_COLORS[table.status] || 'border-gray-200 bg-gray-50 text-gray-700';
              return (
                <button
                  key={table.id}
                  onClick={() => dispatch(setSelectedTableId(table.id))}
                  className={`aspect-square rounded-lg border flex flex-col items-center justify-center p-2 transition-all ${colorClass} ${
                    isSelected ? 'ring-2 ring-orange-500 border-orange-500 font-bold scale-[1.02] shadow-sm' : ''
                  }`}
                >
                  <span className="text-sm">T{table.number}</span>
                  <span className="text-[9px] mt-0.5 opacity-80">
                    {table.status === TABLE_STATUS.OCCUPIED ? 'Busy' : table.status === TABLE_STATUS.RESERVED ? 'Res' : 'Empty'}
                  </span>
                  <span className="text-[8px] opacity-60">Cap: {table.capacity}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 2: Menu catalog (middle) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-100 p-4 overflow-y-auto flex flex-col gap-4">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Menu Items</h2>
          {/* Categories Tab */}
          <div className="flex gap-2 border-b border-gray-100 pb-2 overflow-x-auto whitespace-nowrap">
            {['All', ...categories.map(c => c.name)].map((catName) => (
              <span
                key={catName}
                onClick={() => setActiveCategory(catName)}
                className={`px-3 py-1 rounded-full text-xs cursor-pointer transition-all ${
                  activeCategory === catName
                    ? 'bg-orange-100 text-orange-700 font-bold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {catName}
              </span>
            ))}
          </div>
          
          {/* Menu items grid */}
          <div className="grid grid-cols-2 gap-3">
            {filteredMenuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleAddItem(item)}
                className="border border-gray-100 rounded-lg p-3 flex flex-col justify-between hover:border-orange-200 hover:shadow-xs transition-all cursor-pointer bg-white"
              >
                <div>
                  <div className="flex items-center gap-1.5 justify-between">
                    <span className="text-xs font-bold text-gray-800 line-clamp-1">{item.name}</span>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  <span className="text-[10px] text-gray-400 block font-mono mt-0.5">{item.code}</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs font-bold font-mono text-gray-900">₹{item.price}</span>
                  <span className="w-5 h-5 rounded bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white flex items-center justify-center font-bold text-xs transition-colors">+</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Cart / Bill cart (right) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-gray-100 p-4 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-50 pb-2">
              Active Bill Cart {selectedTableId ? `(Table ${selectedTableId.replace('T', '')})` : ''}
            </h2>
            
            {!selectedTableId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-gray-400 gap-2">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span className="text-xs font-medium">Select a table to begin taking order</span>
              </div>
            ) : currentCart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-gray-400 gap-2">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-xs font-medium">Cart is empty.<br/>Click menu items to add.</span>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto py-2 space-y-3 pr-1">
                {currentCart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs border-b border-gray-50 pb-2">
                    <div className="flex-1 pr-2">
                      <span className="font-bold text-gray-800">{item.name}</span>
                      <span className="text-gray-500 block font-mono">₹{item.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-200 rounded bg-gray-50">
                        <button
                          onClick={() => handleUpdateQty(item.id, item.qty - 1)}
                          className="px-1.5 py-0.5 hover:bg-gray-200 text-gray-600 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-gray-800">{item.qty}</span>
                        <button
                          onClick={() => handleUpdateQty(item.id, item.qty + 1)}
                          className="px-1.5 py-0.5 hover:bg-gray-200 text-gray-600 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-mono text-gray-900 w-16 text-right">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing calculations summary */}
          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span>
              <span className="font-mono">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>GST (5%)</span>
              <span className="font-mono">₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-gray-900 pt-1 border-t border-dashed border-gray-100">
              <span>Grand Total</span>
              <span className="font-mono">₹{grandTotal.toFixed(2)}</span>
            </div>
            <Button
              variant="accent"
              className="w-full mt-2"
              disabled={!selectedTableId || currentCart.length === 0}
              onClick={handleSettleBill}
            >
              Settle & Print Bill
            </Button>
          </div>
        </div>
      </div>

      {/* Move Table Modal */}
      <Modal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        title="Move Table Order"
        footerActions={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsMoveModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={executeMoveTable}>Confirm Move</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-gray-600">
            Move the active bill cart from <strong>Table {selectedTableId?.replace('T', '')}</strong> to another table.
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Select Destination Table</label>
            <select
              value={moveTargetId}
              onChange={(e) => setMoveTargetId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">-- Choose Table --</option>
              {tables
                .filter((t) => t.id !== selectedTableId)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    Table {t.number} ({t.status === TABLE_STATUS.AVAILABLE ? 'Available' : 'Busy'})
                  </option>
                ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* Merge Tables Modal */}
      <Modal
        isOpen={isMergeModalOpen}
        onClose={() => setIsMergeModalOpen(false)}
        title={`Merge Tables into Table ${selectedTableId?.replace('T', '')}`}
        footerActions={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsMergeModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={executeMergeTables}>Merge Selected</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-gray-600">
            Select one or more occupied tables to merge their active orders into **Table {selectedTableId?.replace('T', '')}**.
          </p>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {tables
              .filter((t) => t.id !== selectedTableId && t.status === TABLE_STATUS.OCCUPIED)
              .map((t) => {
                const isChecked = mergeSourceIds.includes(t.id);
                return (
                  <label key={t.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        if (isChecked) {
                          setMergeSourceIds(prev => prev.filter(id => id !== t.id));
                        } else {
                          setMergeSourceIds(prev => [...prev, t.id]);
                        }
                      }}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">Table {t.number}</span>
                    <span className="text-xs text-gray-400 font-mono ml-auto">
                      ({(cart[t.id] || []).length} items)
                    </span>
                  </label>
                );
              })}
            {tables.filter((t) => t.id !== selectedTableId && t.status === TABLE_STATUS.OCCUPIED).length === 0 && (
              <span className="text-xs text-gray-400 text-center py-4">No other tables are currently busy.</span>
            )}
          </div>
        </div>
      </Modal>

      {/* New Quick Order Modal */}
      <Modal
        isOpen={isQuickOrderModalOpen}
        onClose={() => setIsQuickOrderModalOpen(false)}
        title="New Quick Order"
        size="lg"
        footerActions={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsQuickOrderModalOpen(false)}>Close</Button>
            <Button
              variant="accent"
              size="sm"
              disabled={quickOrderCart.length === 0}
              onClick={settleQuickOrder}
            >
              Settle & Print Order
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-hidden">
          {/* Quick Menu Selection */}
          <div className="overflow-y-auto flex flex-col gap-3 pr-1">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Menu Items</h3>
            <div className="grid grid-cols-2 gap-2">
              {menuItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => addQuickOrderItem(item)}
                  className="border border-gray-100 rounded-lg p-2.5 flex flex-col justify-between hover:border-orange-200 transition-all cursor-pointer bg-white"
                >
                  <span className="text-xs font-bold text-gray-800 line-clamp-1">{item.name}</span>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] font-mono text-gray-900">₹{item.price}</span>
                    <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-1 rounded">+ Add</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Order Cart Summary */}
          <div className="border-l border-gray-100 pl-4 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-50 pb-2">Order Items</h3>
              {quickOrderCart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-xs">
                  <span>No items added yet</span>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto py-2 space-y-2.5">
                  {quickOrderCart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-gray-800 flex-1 pr-1 line-clamp-1">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-gray-200 rounded">
                          <button
                            onClick={() => updateQuickOrderQty(item.id, item.qty - 1)}
                            className="px-1 hover:bg-gray-100 text-gray-600"
                          >
                            -
                          </button>
                          <span className="px-1.5 font-mono text-gray-800">{item.qty}</span>
                          <button
                            onClick={() => updateQuickOrderQty(item.id, item.qty + 1)}
                            className="px-1 hover:bg-gray-100 text-gray-600"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-mono text-gray-900 w-12 text-right">₹{item.price * item.qty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-3 flex flex-col gap-1.5 mt-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Subtotal</span>
                <span className="font-mono">₹{quickOrderCart.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900">
                <span>Total (incl. tax)</span>
                <span className="font-mono">
                  ₹{(quickOrderCart.reduce((sum, i) => sum + i.price * i.qty, 0) * 1.05).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default POSPage;
