import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../slices/authSlice';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';

export const SubscriptionExpiredPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
          ⚠️
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Subscription Suspended</h1>
        <p className="text-xs text-gray-500 mt-1 mb-6">
          Your restaurant's Restro Munch subscription plan has expired or has been suspended.
        </p>

        <Card className="p-6 border-red-100 shadow-lg text-left space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 leading-relaxed">
            Access to POS Terminal, Kitchen KDS, and Menu Management is currently restricted for this workspace.
          </div>

          <div className="space-y-2 text-xs text-gray-600">
            <p className="font-semibold text-gray-800">What to do next?</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>If you are the restaurant owner, contact support to renew your plan.</li>
              <li>If you are a staff member, notify your restaurant admin or owner.</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href="mailto:support@restromunch.com?subject=Subscription Renewal Request"
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg text-center shadow-xs transition-colors"
            >
              📧 Contact Support to Renew
            </a>
            <Button variant="outline" onClick={handleLogout} className="w-full text-xs">
              Sign Out & Switch Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionExpiredPage;
