import React, { useState, useEffect } from 'react';
import Card from '../../../../components/common/Card';
import Table from '../../../../components/common/Table';
import Button from '../../../../components/common/Button';
import Modal from '../../../../components/common/Modal';
import Input from '../../../../components/common/Input';
import apiClient from '../../../../services/api/apiClient';
import { useToast } from '../../../../services/notifications/useToast';

export const InventoryPage = () => {
  const toast = useToast();
  const [stocks, setStocks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    currentStock: '',
    unit: 'kg',
    reorderLevel: ''
  });

  // Fetch Inventory
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await apiClient.get('/inventory/materials');
        setStocks(res.data.data);
      } catch (err) {
        console.warn('API error, loading from mock inventory directly:', err);
        const { MOCK_INVENTORY } = await import('../../../../mocks/data/inventory');
        setStocks(MOCK_INVENTORY);
      }
    };

    fetchInventory();
  }, []);

  const headers = [
    { label: 'Ingredient' },
    { label: 'Stock Level' },
    { label: 'Min Level' },
    { label: 'Status' },
    { label: 'Actions', className: 'text-right' }
  ];

  const handleAddClick = () => {
    setEditingStock(null);
    setFormData({
      name: '',
      currentStock: '',
      unit: 'kg',
      reorderLevel: ''
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (item) => {
    setEditingStock(item);
    setFormData({
      name: item.name,
      currentStock: item.currentStock.toString(),
      unit: item.unit,
      reorderLevel: item.reorderLevel.toString()
    });
    setIsModalOpen(true);
  };

  const handleRestock = (item) => {
    const amount = window.prompt(`How many ${item.unit} of ${item.name} would you like to add?`, '10');
    if (amount === null) return;
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.show('Please enter a valid positive number!', 'warning');
      return;
    }

    setStocks((prev) =>
      prev.map((s) =>
        s.id === item.id ? { ...s, currentStock: s.currentStock + amountNum } : s
      )
    );
    toast.show(`Restocked ${amountNum} ${item.unit} of ${item.name}!`, 'success');
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name} from inventory?`)) {
      setStocks((prev) => prev.filter((item) => item.id !== id));
      toast.show(`${name} deleted from inventory!`, 'success');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || formData.currentStock === '' || formData.reorderLevel === '') {
      toast.show('Please fill in all required fields!', 'warning');
      return;
    }

    const currentStockNum = parseFloat(formData.currentStock);
    const reorderLevelNum = parseFloat(formData.reorderLevel);

    if (isNaN(currentStockNum) || currentStockNum < 0 || isNaN(reorderLevelNum) || reorderLevelNum < 0) {
      toast.show('Please enter valid non-negative numbers!', 'warning');
      return;
    }

    if (editingStock) {
      setStocks((prev) =>
        prev.map((s) =>
          s.id === editingStock.id
            ? { ...s, name: formData.name, currentStock: currentStockNum, unit: formData.unit, reorderLevel: reorderLevelNum }
            : s
        )
      );
      toast.show(`${formData.name} stock details updated!`, 'success');
    } else {
      const newStock = {
        id: `mat_${Date.now()}`,
        name: formData.name,
        currentStock: currentStockNum,
        unit: formData.unit,
        reorderLevel: reorderLevelNum
      };
      setStocks((prev) => [...prev, newStock]);
      toast.show(`${formData.name} added to inventory!`, 'success');
    }

    setIsModalOpen(false);
  };

  const renderRow = (item) => {
    const isAlert = item.currentStock < item.reorderLevel;
    return (
      <tr key={item.id} className="hover:bg-gray-50/50">
        <td className="px-6 py-4 font-semibold text-gray-900">{item.name}</td>
        <td className="px-6 py-4 font-mono text-gray-600">
          {item.currentStock} {item.unit}
        </td>
        <td className="px-6 py-4 font-mono text-gray-500">
          {item.reorderLevel} {item.unit}
        </td>
        <td className="px-6 py-4">
          {isAlert ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 animate-pulse">
              Reorder
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
              Sufficient
            </span>
          )}
        </td>
        <td className="px-6 py-4 text-right">
          <button
            onClick={() => handleRestock(item)}
            className="text-green-600 hover:text-green-950 font-semibold mr-3"
          >
            Restock
          </button>
          <button
            onClick={() => handleEditClick(item)}
            className="text-orange-600 hover:text-orange-950 font-semibold mr-3"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(item.id, item.name)}
            className="text-red-600 hover:text-red-950 font-semibold"
          >
            Delete
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Inventory Stock</h1>
          <p className="text-xs text-gray-500 mt-1">Real-time stock deduction, reorder logs and raw materials</p>
        </div>
        <Button variant="primary" onClick={handleAddClick} className="w-full sm:w-auto">Add Ingredient</Button>
      </div>

      <Card>
        <Table
          headers={headers}
          data={stocks}
          renderRow={renderRow}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStock ? 'Edit Stock Details' : 'Add New Ingredient'}
        footerActions={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSubmit}>
              {editingStock ? 'Save Changes' : 'Add Ingredient'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Ingredient Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Butter Amul"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Current Stock *"
              type="number"
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              placeholder="e.g. 15"
              required
              min="0"
              step="0.01"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 tracking-wide">Unit *</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="kg">kg (Kilogram)</option>
                <option value="litre">litre (Litre)</option>
                <option value="pcs">pcs (Pieces)</option>
                <option value="box">box (Boxes)</option>
              </select>
            </div>
          </div>

          <Input
            label="Min Reorder Level *"
            type="number"
            value={formData.reorderLevel}
            onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
            placeholder="e.g. 5"
            required
            min="0"
            step="0.01"
          />
        </form>
      </Modal>
    </div>
  );
};

export default InventoryPage;
