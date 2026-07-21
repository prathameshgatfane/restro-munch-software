import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../../components/common/Card';
import Button from '../../../../components/common/Button';
import Table from '../../../../components/common/Table';
import { tenantService } from '../../../../services/mock/tenantService';

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await tenantService.getTenants();
        setTenants(data);
      } catch (err) {
        console.error('Failed to load tenants:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const totalRestaurants = tenants.length;
  const activeSubscriptions = tenants.filter((t) => t.subscription.status === 'Active').length;
  const suspendedTenants = tenants.filter((t) => t.subscription.status === 'Suspended').length;
  const monthlyRevenue = tenants
    .filter((t) => t.subscription.status === 'Active')
    .reduce((sum, t) => sum + (t.subscription.monthlyPrice || 999), 0);

  const headers = [
    { label: 'Restaurant' },
    { label: 'Owner Contact' },
    { label: 'Plan & Price' },
    { label: 'Status' },
    { label: 'Registered Date' }
  ];

  const renderRow = (item) => (
    <tr key={item.id} className="hover:bg-gray-50/50">
      <td className="px-6 py-4">
        <div className="font-bold text-gray-900">{item.name}</div>
        <div className="text-xs text-gray-500 font-mono">{item.slug}.restromunch.com</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-xs font-semibold text-gray-800">{item.ownerName}</div>
        <div className="text-xs font-mono text-gray-500">{item.email}</div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700">
          {item.subscription.plan} (₹{item.subscription.monthlyPrice || 999}/mo)
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
          item.subscription.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {item.subscription.status}
        </span>
      </td>
      <td className="px-6 py-4 text-xs font-mono text-gray-500">
        {new Date(item.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Platform Super Admin Dashboard</h1>
          <p className="text-xs text-gray-500 mt-0.5">Overview of onboarded restaurant tenants, MRR revenue, and platform status</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/super-admin/restaurants')}>
            Manage All Tenants
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/super-admin/restaurants')}>
            + Register Restaurant
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 shadow-sm border-l-4 border-l-orange-500">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Restaurants</div>
          <div className="text-3xl font-black text-gray-900 mt-1">{totalRestaurants}</div>
          <div className="text-[11px] text-gray-400 mt-1">Multi-tenant accounts</div>
        </Card>

        <Card className="p-4 shadow-sm border-l-4 border-l-green-500">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Active Subscriptions</div>
          <div className="text-3xl font-black text-green-600 mt-1">{activeSubscriptions}</div>
          <div className="text-[11px] text-green-700 font-medium mt-1">paying customers</div>
        </Card>

        <Card className="p-4 shadow-sm border-l-4 border-l-blue-500">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Estimated MRR</div>
          <div className="text-3xl font-black text-blue-600 font-mono mt-1">₹{monthlyRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-blue-700 font-medium mt-1">Monthly Recurring Revenue</div>
        </Card>

        <Card className="p-4 shadow-sm border-l-4 border-l-red-500">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Suspended</div>
          <div className="text-3xl font-black text-red-600 mt-1">{suspendedTenants}</div>
          <div className="text-[11px] text-gray-400 mt-1">Payment due / inactive</div>
        </Card>
      </div>

      {/* Recent Onboarded Restaurants */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Recently Onboarded Restaurants</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/super-admin/restaurants')}>
            View All →
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-xs text-gray-400">Loading platform analytics...</div>
        ) : (
          <Table headers={headers} data={tenants.slice(0, 5)} renderRow={renderRow} />
        )}
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;
