import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../../../components/common/Card';
import Table from '../../../../components/common/Table';
import Button from '../../../../components/common/Button';
import Modal from '../../../../components/common/Modal';
import Input from '../../../../components/common/Input';
import { useToast } from '../../../../services/notifications/useToast';
import { setTenants, addTenant, updateTenantStatus, setActiveTenantId } from '../slices/restaurantsSlice';

export const RestaurantManagementPage = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const tenants = useSelector((state) => state.restaurants.tenants);
  const activeTenantId = useSelector((state) => state.restaurants.activeTenantId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'Restaurant',
    ownerName: '',
    email: '',
    phone: '',
    tableCount: 10,
    plan: 'Basic',
  });

  // Mock initial fetch
  useEffect(() => {
    if (tenants.length === 0) {
      // Mock data for initial view
      const mockTenants = [
        {
          id: 'restro_1',
          name: 'Royal Dhaba',
          slug: 'royaldhaba',
          type: 'Dhaba',
          ownerName: 'Rahul Sharma',
          email: 'rahul@royaldhaba.com',
          phone: '9876543210',
          tableCount: 15,
          subscription: { status: 'Active', plan: 'Premium', renewDate: '2027-01-01' },
          createdAt: new Date().toISOString()
        }
      ];
      dispatch(setTenants(mockTenants));
    }
  }, [dispatch, tenants.length]);

  const headers = [
    { label: 'Restaurant' },
    { label: 'Owner Contact' },
    { label: 'Subscription' },
    { label: 'Status' },
    { label: 'Actions', className: 'text-right' }
  ];

  const handleAddClick = () => {
    setFormData({
      name: '',
      slug: '',
      type: 'Restaurant',
      ownerName: '',
      email: '',
      phone: '',
      tableCount: 10,
      plan: 'Basic',
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    dispatch(updateTenantStatus({ id, status: newStatus }));
    toast.show(`Tenant status changed to ${newStatus}`, 'success');
  };

  const handleSwitchTenant = (id, name) => {
    dispatch(setActiveTenantId(id));
    toast.show(`Switched to tenant context: ${name}`, 'success');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.slug) {
      toast.show('Please fill in all required fields!', 'warning');
      return;
    }

    const newTenant = {
      id: `restro_${Date.now()}`,
      name: formData.name,
      slug: formData.slug,
      type: formData.type,
      ownerName: formData.ownerName,
      email: formData.email,
      phone: formData.phone,
      tableCount: formData.tableCount,
      subscription: {
        status: 'Active',
        plan: formData.plan,
        renewDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      },
      createdAt: new Date().toISOString()
    };

    dispatch(addTenant(newTenant));
    toast.show(`${formData.name} added as new tenant!`, 'success');
    setIsModalOpen(false);
  };

  const renderRow = (item) => (
    <tr key={item.id} className={`hover:bg-gray-50/50 ${activeTenantId === item.id ? 'bg-orange-50/30' : ''}`}>
      <td className="px-6 py-4">
        <div className="font-semibold text-gray-900">{item.name}</div>
        <div className="text-xs text-gray-500">{item.slug}.restromunch.com</div>
        <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800">
          {item.type}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{item.ownerName}</div>
        <div className="text-xs font-mono text-gray-500">{item.email}</div>
        <div className="text-xs font-mono text-gray-500">{item.phone}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-semibold text-gray-900">{item.subscription.plan}</div>
        <div className="text-xs text-gray-500">Renews: {item.subscription.renewDate}</div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          item.subscription.status === 'Active' ? 'bg-green-50 text-green-700' : 
          item.subscription.status === 'Suspended' ? 'bg-red-50 text-red-700' : 
          'bg-yellow-50 text-yellow-700'
        }`}>
          {item.subscription.status}
        </span>
      </td>
      <td className="px-6 py-4 text-right space-x-2">
        <button
          onClick={() => handleSwitchTenant(item.id, item.name)}
          className={`text-xs font-semibold px-2 py-1 border rounded ${activeTenantId === item.id ? 'bg-orange-100 text-orange-800 border-orange-200' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
        >
          {activeTenantId === item.id ? 'Active Context' : 'Switch Context'}
        </button>
        <button
          onClick={() => handleToggleStatus(item.id, item.subscription.status)}
          className={`text-xs font-semibold px-2 py-1 border rounded ${
            item.subscription.status === 'Active' ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'
          }`}
        >
          {item.subscription.status === 'Active' ? 'Suspend' : 'Activate'}
        </button>
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">SaaS Tenant Management</h1>
          <p className="text-xs text-gray-500 mt-1">Manage onboarded restaurants, subscriptions, and access</p>
        </div>
        <Button variant="primary" onClick={handleAddClick} className="w-full sm:w-auto">Register New Tenant</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 shadow-sm">
          <div className="text-gray-500 text-xs font-bold uppercase">Total Tenants</div>
          <div className="text-2xl font-black text-gray-900 mt-1">{tenants.length}</div>
        </Card>
        <Card className="p-4 shadow-sm">
          <div className="text-gray-500 text-xs font-bold uppercase">Active Subscriptions</div>
          <div className="text-2xl font-black text-green-600 mt-1">{tenants.filter(t => t.subscription.status === 'Active').length}</div>
        </Card>
      </div>

      <Card>
        <Table
          headers={headers}
          data={tenants}
          renderRow={renderRow}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Tenant"
        footerActions={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSubmit}>Register Tenant</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Restaurant Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Pizza Hub"
              required
            />
            <Input
              label="Subdomain Slug *"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. pizzahub"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Owner Name"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              placeholder="e.g. Ramesh Kumar"
            />
            <Input
              label="Email Address *"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. owner@pizzahub.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. 9876543210"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 tracking-wide">Restaurant Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 md:px-3.5 md:py-2.5 bg-white border border-gray-200 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Restaurant">Restaurant</option>
                <option value="Dhaba">Dhaba</option>
                <option value="Cafe">Cafe</option>
                <option value="Bar">Bar</option>
                <option value="Cloud Kitchen">Cloud Kitchen</option>
                <option value="Food Court">Food Court</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <Input
              label="Initial Table Count"
              type="number"
              value={formData.tableCount}
              onChange={(e) => setFormData({ ...formData, tableCount: parseInt(e.target.value) || 0 })}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 tracking-wide">Subscription Plan</label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="w-full px-4 py-3 md:px-3.5 md:py-2.5 bg-white border border-gray-200 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Basic">Basic (Monthly)</option>
                <option value="Premium">Premium (Yearly)</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
          </div>

        </form>
      </Modal>
    </div>
  );
};

export default RestaurantManagementPage;
