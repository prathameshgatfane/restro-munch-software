import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginStart, loginFailure } from '../slices/authSlice';
import { authService } from '../../../services/mock/authService';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Card from '../../../components/common/Card';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    dispatch(loginStart());

    try {
      const response = await authService.login(email, password);
      dispatch(loginSuccess(response));

      // Redirect based on role and subscription status
      const user = response.user;
      if (user.subscriptionStatus === 'Suspended') {
        navigate('/subscription-expired');
      } else if (user.role === 'super_admin') {
        navigate('/super-admin/restaurants');
      } else if (user.role === 'kitchen') {
        navigate('/kitchen');
      } else if (user.role === 'cashier' || user.role === 'waiter') {
        navigate('/pos');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials or login failed.');
      dispatch(loginFailure(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('DemoPass123!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-bold text-white text-xl shadow mb-2">
            RM
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Restro Munch</h1>
          <p className="text-xs text-gray-500 font-medium">Multi-Tenant Restaurant SaaS Suite</p>
        </div>

        <Card className="shadow-lg border-gray-100 p-6">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-800">
                Sign In to Your Workspace
              </h2>
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                SaaS Multi-Tenant
              </span>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 font-semibold">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. owner@royaldhaba.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs text-gray-500">
              <label className="flex items-center gap-2 cursor-pointer py-1">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer" />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/auth/reset-password')}
                className="text-orange-600 hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Self Registration link */}
          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-600">
              Want to use Restro Munch for your restaurant?{' '}
              <Link to="/auth/register" className="text-orange-600 font-bold hover:underline">
                Register Restaurant →
              </Link>
            </p>
          </div>
        </Card>

        {/* Demo Credentials Picker */}
        <div className="mt-6 p-3 bg-white rounded-xl border border-gray-200 shadow-xs text-xs text-gray-600 space-y-1.5">
          <p className="font-bold text-gray-800 border-b pb-1">Quick Demo Accounts (Click to test):</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button onClick={() => setDemoLogin('super@restromunch.com')} className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded border border-purple-200">
              Super Admin
            </button>
            <button onClick={() => setDemoLogin('owner@royaldhaba.com')} className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded border border-blue-200">
              Restaurant Owner
            </button>
            <button onClick={() => setDemoLogin('cashier@restro.com')} className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded border border-green-200">
              Cashier Staff
            </button>
            <button onClick={() => setDemoLogin('kitchen@restro.com')} className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded border border-amber-200">
              Kitchen KDS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
