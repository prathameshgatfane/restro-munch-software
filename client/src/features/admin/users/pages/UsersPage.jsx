import React, { useState, useEffect } from 'react';
import Card from '../../../../components/common/Card';
import Table from '../../../../components/common/Table';
import Button from '../../../../components/common/Button';
import Modal from '../../../../components/common/Modal';
import Input from '../../../../components/common/Input';
import apiClient from '../../../../services/api/apiClient';
import { useToast } from '../../../../services/notifications/useToast';
import { ROLES, ROLE_LABELS } from '../../../../constants/roles';

export const UsersPage = () => {
  const toast = useToast();
  const [staff, setStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ROLES.CASHIER
  });

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiClient.get('/users');
        setStaff(res.data.data);
      } catch (err) {
        console.warn('API error, loading from mock users directly:', err);
        const { MOCK_USERS } = await import('../../../../mocks/data/users');
        setStaff(MOCK_USERS);
      }
    };

    fetchUsers();
  }, []);

  const headers = [
    { label: 'Staff Name' },
    { label: 'System Role' },
    { label: 'Email' },
    { label: 'Actions', className: 'text-right' }
  ];

  const handleAddClick = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      role: ROLES.CASHIER
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (user) => {
    setEditingStaff(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from staff?`)) {
      setStaff((prev) => prev.filter((item) => item.id !== id));
      toast.show(`${name} removed from staff!`, 'success');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.show('Please fill in all required fields!', 'warning');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.show('Please enter a valid email address!', 'warning');
      return;
    }

    if (editingStaff) {
      setStaff((prev) =>
        prev.map((s) =>
          s.id === editingStaff.id ? { ...s, ...formData } : s
        )
      );
      toast.show(`Staff details for ${formData.name} updated!`, 'success');
    } else {
      const newUser = {
        id: `u_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        outletId: 'out_1'
      };
      setStaff((prev) => [...prev, newUser]);
      toast.show(`${formData.name} added as new staff!`, 'success');
    }

    setIsModalOpen(false);
  };

  const renderRow = (item) => (
    <tr key={item.id} className="hover:bg-gray-50/50">
      <td className="px-6 py-4 font-semibold text-gray-900">{item.name}</td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700">
          {ROLE_LABELS[item.role] || item.role}
        </span>
      </td>
      <td className="px-6 py-4 font-mono text-gray-500">{item.email}</td>
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
          <h1 className="text-xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-xs text-gray-500 mt-1">Manage credentials, assign roles and review audits logs</p>
        </div>
        <Button variant="primary" onClick={handleAddClick}>Add Staff Member</Button>
      </div>

      <Card>
        <Table
          headers={headers}
          data={staff}
          renderRow={renderRow}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStaff ? 'Edit Staff Credentials' : 'Add New Staff Member'}
        footerActions={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSubmit}>
              {editingStaff ? 'Save Changes' : 'Add Staff'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Ramesh Kumar"
            required
          />

          <Input
            label="Email Address *"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. ramesh@restromunch.com"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 tracking-wide">System Role *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              {Object.entries(ROLE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
