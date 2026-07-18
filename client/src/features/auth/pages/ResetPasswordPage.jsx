import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Card from '../../../components/common/Card';

export const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 to-guava-500 flex items-center justify-center font-bold text-white text-xl shadow mb-2">
            RM
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Restro Munch</h1>
          <p className="text-sm text-gray-500">Security Recovery</p>
        </div>

        <Card className="shadow-lg border-gray-100">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Instructions Sent!</h2>
              <p className="text-sm text-gray-500 mb-6">
                We've sent a recovery link to <strong>{email}</strong>. Please check your inbox.
              </p>
              <Button onClick={() => navigate('/auth/login')} variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-2">
                Reset Password
              </h2>
              <p className="text-xs text-gray-500">
                Enter your registered email address and we'll send you instructions to recover your PIN.
              </p>
              
              <Input
                label="Registered Email"
                type="email"
                placeholder="e.g. manager@restromunch.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="flex flex-col gap-2 mt-2">
                <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
                  Send Recovery Link
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/auth/login')}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
