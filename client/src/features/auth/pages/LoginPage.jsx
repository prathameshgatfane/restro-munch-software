import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../slices/authSlice';
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    // Simulate mock login delay
    setTimeout(() => {
      setIsLoading(false);
      let role = 'admin';
      
      // Role matching based on email keyword for testing
      if (email.includes('cashier')) role = 'cashier';
      else if (email.includes('manager')) role = 'manager';
      else if (email.includes('kitchen')) role = 'kitchen';

      const mockPayload = {
        user: {
          id: 'u_1',
          name: email.split('@')[0].toUpperCase(),
          email,
          role,
          outletId: 'out_1',
        },
        tokens: {
          access: 'mock_access_token',
          refresh: 'mock_refresh_token',
        },
      };

      dispatch(loginSuccess(mockPayload));
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 to-guava-500 flex items-center justify-center font-bold text-white text-xl shadow mb-2">
            RM
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Restro Munch</h1>
          <p className="text-sm text-gray-500">Restaurant POS & Billing Suite</p>
        </div>

        <Card className="shadow-lg border-gray-100">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-2">
              Staff Authentication
            </h2>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 font-semibold">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. cashier@restromunch.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your security PIN"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500" />
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
        </Card>

        {/* Demo Credentials Tip */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p className="font-semibold mb-1">Demo Logins (Bypass password):</p>
          <p>Admin: <span className="font-mono text-gray-500">admin@restro.com</span></p>
          <p>Cashier: <span className="font-mono text-gray-500">cashier@restro.com</span></p>
          <p>Kitchen: <span className="font-mono text-gray-500">kitchen@restro.com</span></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
