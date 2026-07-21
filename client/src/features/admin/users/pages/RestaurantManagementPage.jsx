import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../../../components/common/Card';
import Table from '../../../../components/common/Table';
import Button from '../../../../components/common/Button';
import Modal from '../../../../components/common/Modal';
import Input from '../../../../components/common/Input';
import { useToast } from '../../../../services/notifications/useToast';
import {
  setTenants,
  addTenant,
  updateTenantStatus,
  updateTenantSubscription,
  setActiveTenantId
} from '../slices/restaurantsSlice';
import { tenantService } from '../../../../services/mock/tenantService';
import { setTenantContext } from '../../../auth/slices/authSlice';

export const RestaurantManagementPage = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const tenants = useSelector((state) => state.restaurants.tenants);
  const activeTenantId = useSelector((state) => state.restaurants.activeTenantId);
  const { user } = useSelector((state) => state.auth);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscriptionModalTenant, setSubscriptionModalTenant] = useState(null);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Registration Form State
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

  // Subscription Edit Form State
  const [subForm, setSubForm] = useState({
    plan: 'Basic',
    durationMonths: 12
  });

  // Initial fetch from service
  useEffect(() => {
    const loadTenants = async () => {
      try {
        const data = await tenantService.getTenants();
        dispatch(setTenants(data));
      } catch (err) {
        console.error('Error loading tenants:', err);
      }
    };
    loadTenants();
  }, [dispatch]);

  // Filtered tenants list
  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.subscription.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const handleNameChange = (e) => {
    const nameVal = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: nameVal,
      slug: nameVal.toLowerCase().replace(/[^a-z0-9]/g, '')
    }));
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    await tenantService.updateStatus(id, newStatus);
    dispatch(updateTenantStatus({ id, status: newStatus }));
    toast.show(`Tenant status changed to ${newStatus}`, 'success');
  };

  const handleSwitchTenant = (tenant) => {
    dispatch(setActiveTenantId(tenant.id));
    dispatch(setTenantContext({ tenantId: tenant.id, tenantName: tenant.name }));
    toast.show(`Switched to tenant context: ${tenant.name}`, 'success');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.slug) {
      toast.show('Please fill in all required fields!', 'warning');
      return;
    }

    try {
      const result = await tenantService.registerRestaurant(formData);
      dispatch(addTenant(result.tenant));
      setCreatedCredentials(result.credentials);
      setIsModalOpen(false);
      toast.show(`${formData.name} onboarded as new tenant!`, 'success');
    } catch (err) {
      toast.show(err.message || 'Registration failed', 'error');
    }
  };

  const handleSubscriptionSave = async () => {
    if (!subscriptionModalTenant) return;
    try {
      const updated = await tenantService.updateSubscription(
        subscriptionModalTenant.id,
        subForm.plan,
        subForm.durationMonths
      );
      dispatch(updateTenantSubscription({
        id: subscriptionModalTenant.id,
        plan: updated.subscription.plan,
        renewDate: updated.subscription.renewDate,
        monthlyPrice: updated.subscription.monthlyPrice
      }));
      toast.show(`Updated subscription for ${subscriptionModalTenant.name} to ${subForm.plan}!`, 'success');
      setSubscriptionModalTenant(null);
    } catch (err) {
      toast.show(err.message || 'Subscription update failed', 'error');
    }
  };

  // --- Desktop table setup ---
  const headers = [
    { label: 'Restaurant Tenant' },
    { label: 'Owner Contact' },
    { label: 'Subscription Plan' },
    { label: 'Status' },
    { label: 'Actions', className: 'text-right' }
  ];

  const renderRow = (item) => (
    <tr key={item.id} className={`hover:bg-gray-50/50 ${activeTenantId === item.id ? 'bg-orange-50/30' : ''}`}>
      <td className="px-6 py-4">
        <div className="font-bold text-gray-900">{item.name}</div>
        <div className="text-xs text-gray-500 font-mono">{item.slug}.restromunch.com</div>
        <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
          {item.type} • {item.tableCount || 10} Tables
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-semibold text-gray-900">{item.ownerName}</div>
        <div className="text-xs font-mono text-gray-500">{item.email}</div>
        <div className="text-xs font-mono text-gray-500">{item.phone}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-xs font-extrabold text-orange-600 bg-orange-50 px-2 py-1 rounded w-fit border border-orange-200">
          {item.subscription.plan} (₹{item.subscription.monthlyPrice || 999}/mo)
        </div>
        <div className="text-[11px] text-gray-500 mt-1">Renews: {item.subscription.renewDate}</div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
          item.subscription.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {item.subscription.status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1.5 flex-wrap">
          <button
            onClick={() => handleSwitchTenant(item)}
            className={`text-xs font-bold px-2 py-1 border rounded transition-colors whitespace-nowrap ${
              activeTenantId === item.id ? 'bg-orange-500 text-white border-orange-500 shadow-xs' : 'text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {activeTenantId === item.id ? '✓ Active' : 'Switch'}
          </button>
          <button
            onClick={() => {
              setSubscriptionModalTenant(item);
              setSubForm({ plan: item.subscription.plan, durationMonths: 12 });
            }}
            className="text-xs font-bold px-2 py-1 border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded whitespace-nowrap"
          >
            Plan
          </button>
          <button
            onClick={() => handleToggleStatus(item.id, item.subscription.status)}
            className={`text-xs font-bold px-2 py-1 border rounded whitespace-nowrap ${
              item.subscription.status === 'Active' ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'
            }`}
          >
            {item.subscription.status === 'Active' ? 'Suspend' : 'Activate'}
          </button>
        </div>
      </td>
    </tr>
  );

  // --- Mobile card for a single tenant ---
  const renderMobileCard = (item) => (
    <div
      key={item.id}
      className={`p-4 rounded-xl border transition-all ${
        activeTenantId === item.id
          ? 'border-orange-300 bg-orange-50/40 shadow-sm'
          : 'border-gray-200 bg-white'
      }`}
    >
      {/* Top: Name + Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="font-bold text-gray-900 text-sm truncate">{item.name}</h3>
          <p className="text-[11px] text-gray-500 font-mono truncate">{item.slug}.restromunch.com</p>
          <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">
            {item.type} • {item.tableCount || 10} Tables
          </span>
        </div>
        <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
          item.subscription.status === 'Active'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {item.subscription.status}
        </span>
      </div>

      {/* Info rows */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-3 pb-3 border-b border-gray-100">
        <div>
          <span className="text-gray-400 uppercase text-[10px] font-bold tracking-wide block">Owner</span>
          <span className="font-semibold text-gray-800">{item.ownerName}</span>
        </div>
        <div>
          <span className="text-gray-400 uppercase text-[10px] font-bold tracking-wide block">Plan</span>
          <span className="font-bold text-orange-600">{item.subscription.plan} (₹{item.subscription.monthlyPrice || 999}/mo)</span>
        </div>
        <div>
          <span className="text-gray-400 uppercase text-[10px] font-bold tracking-wide block">Email</span>
          <span className="font-mono text-gray-600 text-[11px] break-all">{item.email}</span>
        </div>
        <div>
          <span className="text-gray-400 uppercase text-[10px] font-bold tracking-wide block">Renews</span>
          <span className="font-mono text-gray-600 text-[11px]">{item.subscription.renewDate}</span>
        </div>
      </div>

      {/* Action buttons row */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => handleSwitchTenant(item)}
          className={`flex-1 min-w-[80px] text-[11px] font-bold px-3 py-2 border rounded-lg transition-colors text-center ${
            activeTenantId === item.id
              ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
              : 'text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          {activeTenantId === item.id ? '✓ Active Context' : 'Switch Context'}
        </button>
        <button
          onClick={() => {
            setSubscriptionModalTenant(item);
            setSubForm({ plan: item.subscription.plan, durationMonths: 12 });
          }}
          className="flex-1 min-w-[60px] text-[11px] font-bold px-3 py-2 border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg text-center"
        >
          Plan
        </button>
        <button
          onClick={() => handleToggleStatus(item.id, item.subscription.status)}
          className={`flex-1 min-w-[60px] text-[11px] font-bold px-3 py-2 border rounded-lg text-center ${
            item.subscription.status === 'Active'
              ? 'text-red-600 border-red-200 hover:bg-red-50'
              : 'text-green-600 border-green-200 hover:bg-green-50'
          }`}
        >
          {item.subscription.status === 'Active' ? 'Suspend' : 'Activate'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">SaaS Tenant Management</h1>
          <p className="text-[11px] md:text-xs text-gray-500 mt-0.5">Register restaurants, manage plans & switch context</p>
        </div>
        <Button variant="primary" onClick={handleAddClick} className="w-full sm:w-auto text-xs md:text-sm">
          + Register Restaurant
        </Button>
      </div>

      {/* Stat Bar */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <Card className="p-3 md:p-4 shadow-xs">
          <div className="text-gray-500 text-[10px] md:text-xs font-bold uppercase leading-tight">Total Tenants</div>
          <div className="text-xl md:text-2xl font-black text-gray-900 mt-0.5 md:mt-1">{tenants.length}</div>
        </Card>
        <Card className="p-3 md:p-4 shadow-xs">
          <div className="text-gray-500 text-[10px] md:text-xs font-bold uppercase leading-tight">Active</div>
          <div className="text-xl md:text-2xl font-black text-green-600 mt-0.5 md:mt-1">
            {tenants.filter((t) => t.subscription.status === 'Active').length}
          </div>
        </Card>
        <Card className="p-3 md:p-4 shadow-xs">
          <div className="text-gray-500 text-[10px] md:text-xs font-bold uppercase leading-tight">Suspended</div>
          <div className="text-xl md:text-2xl font-black text-red-600 mt-0.5 md:mt-1">
            {tenants.filter((t) => t.subscription.status === 'Suspended').length}
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-3 md:p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search restaurant, owner, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-gray-500 font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </Card>

      {/* Mobile Card List (visible < md) */}
      <div className="flex flex-col gap-3 md:hidden">
        {filteredTenants.length === 0 ? (
          <Card className="p-8 text-center text-xs text-gray-400">No tenants found</Card>
        ) : (
          filteredTenants.map((item) => renderMobileCard(item))
        )}
      </div>

      {/* Desktop Table (visible >= md) */}
      <div className="hidden md:block">
        <Card>
          <Table headers={headers} data={filteredTenants} renderRow={renderRow} />
        </Card>
      </div>

      {/* Register Tenant Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Restaurant Tenant"
        footerActions={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleRegisterSubmit}>Register & Create Admin</Button>
          </>
        }
      >
        <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Restaurant Name *"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. Royal Dhaba"
              required
            />
            <Input
              label="Subdomain Slug *"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. royaldhaba"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Owner Full Name *"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              required
            />
            <Input
              label="Owner Email Address *"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. owner@royaldhaba.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Owner Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. 9876543210"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 tracking-wide">Restaurant Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Restaurant">Restaurant</option>
                <option value="Dhaba">Dhaba</option>
                <option value="Cafe">Cafe</option>
                <option value="Bar">Bar</option>
                <option value="Cloud Kitchen">Cloud Kitchen</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Seating Tables Count"
              type="number"
              value={formData.tableCount}
              onChange={(e) => setFormData({ ...formData, tableCount: parseInt(e.target.value, 10) || 0 })}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 tracking-wide">Subscription Plan</label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Basic">Basic (₹999/mo)</option>
                <option value="Premium">Premium (₹2,999/mo)</option>
                <option value="Enterprise">Enterprise (₹4,999/mo)</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Manage Subscription Modal */}
      {subscriptionModalTenant && (
        <Modal
          isOpen={true}
          onClose={() => setSubscriptionModalTenant(null)}
          title={`Update Subscription: ${subscriptionModalTenant.name}`}
          footerActions={
            <>
              <Button variant="outline" size="sm" onClick={() => setSubscriptionModalTenant(null)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSubscriptionSave}>Save Subscription</Button>
            </>
          }
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Select New Plan</label>
              <select
                value={subForm.plan}
                onChange={(e) => setSubForm({ ...subForm, plan: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Basic">Basic Plan (₹999/mo)</option>
                <option value="Premium">Premium Plan (₹2,999/mo)</option>
                <option value="Enterprise">Enterprise Plan (₹4,999/mo)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Extend Duration</label>
              <select
                value={subForm.durationMonths}
                onChange={(e) => setSubForm({ ...subForm, durationMonths: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="1">1 Month</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months (1 Year)</option>
                <option value="24">24 Months (2 Years)</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {/* Generated Admin Credentials Modal */}
      {createdCredentials && (
        <Modal
          isOpen={true}
          onClose={() => setCreatedCredentials(null)}
          title="🎉 Admin Credentials Generated"
          footerActions={
            <Button variant="primary" size="sm" onClick={() => setCreatedCredentials(null)}>
              Done
            </Button>
          }
        >
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-600">
              Give these admin credentials to the restaurant owner so they can log in:
            </p>
            <div className="bg-gray-900 text-white p-4 rounded-xl font-mono text-xs space-y-2">
              <div className="flex justify-between border-b border-gray-800 pb-1.5">
                <span className="text-gray-400">Admin Email:</span>
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

export default RestaurantManagementPage;
