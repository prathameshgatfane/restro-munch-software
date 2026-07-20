import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Card from '../../../components/common/Card';
import { useAuth } from '../../../hooks/useAuth';
import { setSelectedTableId } from '../../pos/slices/posSlice';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOrderClick = (tableNum) => {
    dispatch(setSelectedTableId(`T${tableNum}`));
    navigate('/pos');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-orange-500 to-guava-500 p-5 md:p-6 rounded-2xl text-white shadow-md">
        <h1 className="text-xl font-bold">Welcome Back, {user?.name || 'Staff'}!</h1>
        <p className="text-sm opacity-90 mt-1">
          Restro Munch POS is connected and synchronized. Have a great service today!
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Today's Sales" subtitle="Gross billing volume" hoverEffect>
          <div className="my-2">
            <span className="text-3xl font-bold font-mono text-gray-900">₹24,850.00</span>
            <span className="text-xs text-green-600 font-semibold block mt-1">↑ 12% vs yesterday</span>
          </div>
        </Card>
        
        <Card title="Orders Settled" subtitle="Paid table tickets today" hoverEffect>
          <div className="my-2">
            <span className="text-3xl font-bold font-mono text-gray-900">42</span>
            <span className="text-xs text-gray-500 font-semibold block mt-1">Average ticket: ₹590</span>
          </div>
        </Card>

        <Card title="Active Tables" subtitle="Currently occupied tables" hoverEffect>
          <div className="my-2">
            <span className="text-3xl font-bold font-mono text-orange-500">8 / 20</span>
            <span className="text-xs text-blue-600 font-semibold block mt-1">2 tables reserved for tonight</span>
          </div>
        </Card>
      </div>

      {/* Quick shortcuts block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Orders" subtitle="Latest order updates from terminals (Click to open in POS)">
          <div className="flex flex-col divide-y divide-gray-100 text-sm">
            <div
              onClick={() => handleOrderClick(4)}
              className="py-3 flex justify-between hover:bg-gray-50/80 px-2 rounded-lg cursor-pointer transition-colors"
            >
              <div>
                <span className="font-semibold text-gray-800">Order #1024</span>
                <span className="text-xs text-orange-600 font-bold ml-2">Table 4</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">NEW</span>
            </div>
            <div
              onClick={() => handleOrderClick(8)}
              className="py-3 flex justify-between hover:bg-gray-50/80 px-2 rounded-lg cursor-pointer transition-colors"
            >
              <div>
                <span className="font-semibold text-gray-800">Order #1023</span>
                <span className="text-xs text-orange-600 font-bold ml-2">Table 8</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700">COOKING</span>
            </div>
            <div
              onClick={() => handleOrderClick(2)}
              className="py-3 flex justify-between hover:bg-gray-50/80 px-2 rounded-lg cursor-pointer transition-colors"
            >
              <div>
                <span className="font-semibold text-gray-800">Order #1022</span>
                <span className="text-xs text-orange-600 font-bold ml-2">Table 2</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">READY</span>
            </div>
          </div>
        </Card>

        <Card title="System Announcements" subtitle="Messages from restaurant management">
          <div className="text-sm text-gray-600 space-y-3">
            <p>
              📢 <strong>GST settings updated:</strong> CGST (2.5%) and SGST (2.5%) tax breaks have been activated on all billing categories.
            </p>
            <p>
              ⚠️ <strong>Low stock warning:</strong> Paneer Butter Masala prep stock is low. Refills requested from central store.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
