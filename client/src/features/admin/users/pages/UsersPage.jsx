import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Card from '../../../../components/common/Card';
import Table from '../../../../components/common/Table';
import Button from '../../../../components/common/Button';
import Modal from '../../../../components/common/Modal';
import Input from '../../../../components/common/Input';
import { useToast } from '../../../../services/notifications/useToast';
import { ROLES, ROLE_LABELS } from '../../../../constants/roles';
import { staffService } from '../../../../services/mock/staffService';

export const UsersPage = () => {
  const toast = useToast();
  const { user: currentUser } = useSelector((state) => state.auth);
  const activeTenantId = useSelector((state) => state.restaurants.activeTenantId) || currentUser?.restaurantId || 'restro_1';

  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ROLES.CASHIER
  });

  // Fetch staff for active tenant
  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      // Super Admin sees all staff or active tenant staff; Restaurant Admin sees only their restaurant staff
      const tenantFilter = currentUser?.role === ROLES.SUPER_ADMIN ? activeTenantId : currentUser?.restaurantId || activeTenantId;
      const data = await staffService.getStaff(tenantFilter);
      setStaff(data);
    } catch (err) {
      console.error('Failed to load staff:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [activeTenantId, currentUser]);

  const headers = [
    { label: 'Staff Member' },
    { label: 'Role & Workspace' },
    { label: 'Contact' },
    { label: 'Status' },
    { label: 'Actions', className: 'text-right' }
  ];

  const handleAddClick = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: ROLES.CASHIER
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (userItem) => {
    setEditingStaff(userItem);
    setFormData({
      name: userItem.name,
      email: userItem.email,
      phone: userItem.phone || '',
      role: userItem.role
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (userItem) => {
    const newStatus = userItem.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await staffService.updateStaff(userItem.id, { status: newStatus });
      toast.show(`${userItem.name} marked as ${newStatus}!`, 'success');
      fetchStaff();
    } catch (err) {
      toast.show(err.message || 'Status update failed', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from staff?`)) {
      try {
        await staffService.deleteStaff(id);
        toast.show(`${name} removed from staff!`, 'success');
        fetchStaff();
      } catch (err) {
        toast.show(err.message || 'Deletion failed', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.show('Please fill in all required fields!', 'warning');
      return;
    }

    try {
      if (editingStaff) {
        await staffService.updateStaff(editingStaff.id, formData);
        toast.show(`Staff details for ${formData.name} updated!`, 'success');
        setIsModalOpen(false);
        fetchStaff();
      } else {
        const result = await staffService.createStaff(
          {
            ...formData,
            restaurantName: currentUser?.restaurantName || 'Royal Dhaba'
          },
          activeTenantId
        );
        setCreatedCredentials(result.credentials);
        setIsModalOpen(false);
        fetchStaff();
        toast.show(`${formData.name} added as new staff!`, 'success');
      }
    } catch (err) {
      toast.show(err.message || 'Operation failed', 'error');
    }
  };

  // Restrict selectable roles for Restaurant Admin
  const availableRoles = [
    { key: ROLES.CASHIER, label: 'Cashier' },
    { key: ROLES.KITCHEN, label: 'Kitchen Staff' },
    { key: ROLES.WAITER, label: 'Waiter' },
    { key: ROLES.MANAGER, label: 'Manager' },
  ];
  if (currentUser?.role === ROLES.SUPER_ADMIN) {
    availableRoles.unshift({ key: ROLES.ADMIN, label: 'Restaurant Admin' });
  }

  const renderRow = (item) => (
    <tr key={item.id} className="hover:bg-gray-50/50">
      <td className="px-6 py-4">
        <div className="font-bold text-gray-900">{item.name}</div>
        <div className="text-xs text-gray-500 font-mono">{item.email}</div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
          {ROLE_LABELS[item.role] || item.role}
        </span>
        <div className="text-[10px] text-gray-400 mt-1 font-mono">{item.restaurantName || 'Royal Dhaba'}</div>
      </td>
      <td className="px-6 py-4 font-mono text-xs text-gray-600">
        {item.phone || 'N/A'}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
          item.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {item.status || 'Active'}
        </span>
      </td>
      <td className="px-6 py-4 text-right space-x-2">
        <button
          onClick={() => handleToggleStatus(item)}
          className={`text-xs font-semibold px-2 py-1 border rounded ${
            item.status === 'Active' ? 'text-amber-700 border-amber-200 hover:bg-amber-50' : 'text-green-700 border-green-200 hover:bg-green-50'
          }`}
        >
          {item.status === 'Active' ? 'Deactivate' : 'Activate'}
        </button>
        <button
          onClick={() => handleEditClick(item)}
          className="text-xs font-semibold px-2 py-1 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(item.id, item.name)}
          className="text-xs font-semibold px-2 py-1 border border-red-200 text-red-600 hover:bg-red-50 rounded"
        >
          Delete
        </button>
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Staff Credentials Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Create cashier, kitchen & manager staff accounts with generated login credentials</p>
        </div>
        <Button variant="primary" onClick={handleAddClick} className="w-full sm:w-auto">
          + Add Staff Member
        </Button>
      </div>

      {/* Staff List Table */}
      <Card>
        {isLoading ? (
          <div className="text-center py-8 text-xs text-gray-400">Loading staff records...</div>
        ) : (
          <Table headers={headers} data={staff} renderRow={renderRow} />
        )}
      </Card>

      {/* Add / Edit Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStaff ? 'Edit Staff Details' : 'Add New Staff Member'}
        footerActions={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSubmit}>
              {editingStaff ? 'Save Changes' : 'Create & Generate Pass'}
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
            placeholder="e.g. ramesh@royaldhaba.com"
            required
          />

          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="e.g. 9876543210"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 tracking-wide">System Role *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              {availableRoles.map((roleObj) => (
                <option key={roleObj.key} value={roleObj.key}>
                  {roleObj.label}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      {/* Generated Staff Credentials Popup */}
      {createdCredentials && (
        <Modal
          isOpen={true}
          onClose={() => setCreatedCredentials(null)}
          title="🔑 Staff Credentials Generated"
          footerActions={
            <Button variant="primary" size="sm" onClick={() => setCreatedCredentials(null)}>
              Done
            </Button>
          }
        >
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-600">
              Give these login credentials to the staff member so they can access their assigned portal:
            </p>

            <div className="bg-gray-900 text-white p-4 rounded-xl font-mono text-xs space-y-2">
              <div className="flex justify-between border-b border-gray-800 pb-1.5">
                <span className="text-gray-400">Assigned Role:</span>
                <span className="text-orange-400 font-bold">{ROLE_LABELS[createdCredentials.role] || createdCredentials.role}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-1.5">
                <span className="text-gray-400">Login Email:</span>
                <span className="text-green-400 font-bold">{createdCredentials.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Temp Password:</span>
                <span className="text-yellow-400 font-bold select-all">{createdCredentials.tempPassword}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UsersPage;
