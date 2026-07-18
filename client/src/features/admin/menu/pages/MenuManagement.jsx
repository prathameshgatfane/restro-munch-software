import React, { useState, useEffect } from 'react';
import Card from '../../../../components/common/Card';
import Table from '../../../../components/common/Table';
import Button from '../../../../components/common/Button';
import Modal from '../../../../components/common/Modal';
import Input from '../../../../components/common/Input';
import apiClient from '../../../../services/api/apiClient';
import { useToast } from '../../../../services/notifications/useToast';

export const MenuManagement = () => {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    available: true,
    code: ''
  });

  // Fetch menu data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsRes = await apiClient.get('/menu/items');
        const catsRes = await apiClient.get('/menu/categories');
        setItems(itemsRes.data.data);
        setCategories(catsRes.data.data);
      } catch (err) {
        console.warn('API error, loading from mock data files directly:', err);
        const { MOCK_MENU_ITEMS, MOCK_CATEGORIES } = await import('../../../../mocks/data/menuItems');
        
        // Map the mock fields if they don't have available (e.g. they have available or we define it)
        const itemsWithAvailability = MOCK_MENU_ITEMS.map(item => ({
          ...item,
          available: item.available !== undefined ? item.available : true
        }));
        setItems(itemsWithAvailability);
        setCategories(MOCK_CATEGORIES);
      }
    };

    fetchData();
  }, []);

  const headers = [
    { label: 'Name' },
    { label: 'Category' },
    { label: 'Price' },
    { label: 'Status' },
    { label: 'Actions', className: 'text-right' }
  ];

  // Open modal for Adding
  const handleAddClick = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      price: '',
      available: true,
      code: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      categoryId: item.categoryId || '',
      price: item.price.toString(),
      available: item.available,
      code: item.code || ''
    });
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.show(`${name} deleted successfully!`, 'success');
    }
  };

  // Handle Status Toggle
  const handleToggleStatus = (id, name, currentStatus) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !currentStatus } : item
      )
    );
    toast.show(`${name} is now ${!currentStatus ? 'Active' : 'Sold Out'}!`, 'info');
  };

  // Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.show('Please fill in all required fields!', 'warning');
      return;
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.show('Please enter a valid price!', 'warning');
      return;
    }

    if (editingItem) {
      // Edit mode
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, ...formData, price: priceNum }
            : item
        )
      );
      toast.show(`${formData.name} updated successfully!`, 'success');
    } else {
      // Add mode
      const newItem = {
        id: `item_${Date.now()}`,
        name: formData.name,
        categoryId: formData.categoryId,
        price: priceNum,
        available: formData.available,
        code: formData.code || formData.name.substring(0, 3).toUpperCase(),
        isVeg: true
      };
      setItems((prev) => [...prev, newItem]);
      toast.show(`${formData.name} added successfully!`, 'success');
    }

    setIsModalOpen(false);
  };

  const getCategoryName = (catId) => {
    const category = categories.find((c) => c.id === catId);
    return category ? category.name : 'Unknown';
  };

  const renderRow = (item) => (
    <tr key={item.id} className="hover:bg-gray-50/50">
      <td className="px-6 py-4 font-semibold text-gray-900">
        <div>
          <span>{item.name}</span>
          {item.code && <span className="text-[10px] text-gray-400 font-mono block font-normal">{item.code}</span>}
        </div>
      </td>
      <td className="px-6 py-4 text-gray-500">{getCategoryName(item.categoryId)}</td>
      <td className="px-6 py-4 font-mono">₹{item.price.toFixed(2)}</td>
      <td className="px-6 py-4">
        <button
          onClick={() => handleToggleStatus(item.id, item.name, item.available)}
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold transition-colors ${
            item.available ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-700 hover:bg-red-100'
          }`}
          title="Click to toggle status"
        >
          {item.available ? 'Active' : 'Sold Out'}
        </button>
      </td>
      <td className="px-6 py-4 text-right">
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Menu Catalog</h1>
          <p className="text-xs text-gray-500 mt-1">Configure your categories, variations, addons and base prices</p>
        </div>
        <Button variant="primary" onClick={handleAddClick}>Add New Item</Button>
      </div>

      <Card>
        <Table
          headers={headers}
          data={items}
          renderRow={renderRow}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
        footerActions={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSubmit}>
              {editingItem ? 'Save Changes' : 'Add Item'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Item Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Paneer Tikka"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 tracking-wide">Category *</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">-- Choose Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Base Price (₹) *"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="e.g. 240"
            required
            min="0"
            step="0.01"
          />

          <Input
            label="Item Code (optional)"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="e.g. PT-1"
          />

          <label className="flex items-center gap-3 p-1 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm font-semibold text-gray-700">Available / Active</span>
          </label>
        </form>
      </Modal>
    </div>
  );
};

export default MenuManagement;
