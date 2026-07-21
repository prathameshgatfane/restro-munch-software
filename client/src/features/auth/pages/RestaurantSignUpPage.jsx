import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Card from '../../../components/common/Card';
import Modal from '../../../components/common/Modal';
import { tenantService } from '../../../services/mock/tenantService';
import { useToast } from '../../../services/notifications/useToast';

export const RestaurantSignUpPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdCredentials, setCreatedCredentials] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'Restaurant',
    address: '',
    ownerName: '',
    email: '',
    phone: '',
    tableCount: 10,
    plan: 'Basic'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'name' && !prev.slug) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]/g, '');
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await tenantService.registerRestaurant(formData);
      setCreatedCredentials(result.credentials);
      toast.show('Restaurant registered successfully!', 'success');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCredentials = () => {
    if (createdCredentials) {
      const text = `Restro Munch Credentials:\nEmail: ${createdCredentials.email}\nTemp Password: ${createdCredentials.tempPassword}\nLogin URL: ${window.location.origin}/auth/login`;
      navigator.clipboard.writeText(text);
      toast.show('Credentials copied to clipboard!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-bold text-white text-xl shadow mb-2">
            RM
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Register Your Restaurant</h1>
          <p className="text-xs text-gray-500 font-medium">Join 500+ restaurants powered by Restro Munch POS & Billing Suite</p>
        </div>

        <Card className="shadow-lg border-gray-100 p-6 md:p-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>1</span>
              <span>Restaurant Info</span>
            </div>
            <span className="text-gray-300">→</span>
            <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>2</span>
              <span>Owner & Contact</span>
            </div>
            <span className="text-gray-300">→</span>
            <div className={`flex items-center gap-2 text-xs font-bold ${step >= 3 ? 'text-orange-600' : 'text-gray-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>3</span>
              <span>Subscription Plan</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Step 1: Restaurant Info */}
            {step === 1 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <Input
                  label="Restaurant Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Royal Dhaba & Grill"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Subdomain Slug *"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="e.g. royaldhaba"
                    required
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700 tracking-wide">Restaurant Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Restaurant">Restaurant</option>
                      <option value="Dhaba">Dhaba</option>
                      <option value="Cafe">Cafe</option>
                      <option value="Bar">Bar & Pub</option>
                      <option value="Cloud Kitchen">Cloud Kitchen</option>
                      <option value="Food Court">Food Court</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Full Business Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Plot 45, GT Road, Highway Express, Delhi"
                />

                <Button
                  type="button"
                  variant="primary"
                  className="mt-2 w-full"
                  onClick={() => {
                    if (!formData.name || !formData.slug) {
                      setError('Please enter restaurant name and slug.');
                      return;
                    }
                    setError('');
                    setStep(2);
                  }}
                >
                  Continue to Owner Details →
                </Button>
              </div>
            )}

            {/* Step 2: Owner Info */}
            {step === 2 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <Input
                  label="Owner / Manager Name *"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="e.g. Rajesh Sharma"
                  required
                />

                <Input
                  label="Official Email Address *"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. owner@royaldhaba.com"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number *"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    required
                  />
                  <Input
                    label="Total Seating Tables"
                    type="number"
                    name="tableCount"
                    value={formData.tableCount}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex gap-2 mt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    ← Back
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      if (!formData.ownerName || !formData.email || !formData.phone) {
                        setError('Please fill in owner name, email, and phone.');
                        return;
                      }
                      setError('');
                      setStep(3);
                    }}
                  >
                    Select Subscription Plan →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Subscription Selection */}
            {step === 3 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Choose Subscription Plan</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setFormData({ ...formData, plan: 'Basic' })}
                    className={`border rounded-xl p-3 cursor-pointer transition-all ${formData.plan === 'Basic' ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <div className="font-bold text-sm text-gray-900">Basic</div>
                    <div className="text-lg font-black text-orange-600 font-mono mt-1">₹999<span className="text-xs text-gray-500 font-normal">/mo</span></div>
                    <ul className="text-[11px] text-gray-600 space-y-1 mt-2">
                      <li>✓ Up to 15 Tables</li>
                      <li>✓ POS & KDS</li>
                      <li>✓ 3 Staff Users</li>
                    </ul>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, plan: 'Premium' })}
                    className={`border rounded-xl p-3 cursor-pointer transition-all relative ${formData.plan === 'Premium' ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <span className="absolute -top-2 right-2 bg-orange-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">POPULAR</span>
                    <div className="font-bold text-sm text-gray-900">Premium</div>
                    <div className="text-lg font-black text-orange-600 font-mono mt-1">₹2,999<span className="text-xs text-gray-500 font-normal">/mo</span></div>
                    <ul className="text-[11px] text-gray-600 space-y-1 mt-2">
                      <li>✓ Unlimited Tables</li>
                      <li>✓ POS, KDS & Inventory</li>
                      <li>✓ Unlimited Staff</li>
                    </ul>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, plan: 'Enterprise' })}
                    className={`border rounded-xl p-3 cursor-pointer transition-all ${formData.plan === 'Enterprise' ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <div className="font-bold text-sm text-gray-900">Enterprise</div>
                    <div className="text-lg font-black text-orange-600 font-mono mt-1">₹4,999<span className="text-xs text-gray-500 font-normal">/mo</span></div>
                    <ul className="text-[11px] text-gray-600 space-y-1 mt-2">
                      <li>✓ Multi-Outlet Support</li>
                      <li>✓ Dedicated Support</li>
                      <li>✓ Custom Reports</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(2)}>
                    ← Back
                  </Button>
                  <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
                    Complete Registration 🎉
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Footer Back Link */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-600">
              Already registered?{' '}
              <Link to="/auth/login" className="text-orange-600 font-bold hover:underline">
                Sign In to Workspace
              </Link>
            </p>
          </div>
        </Card>
      </div>

      {/* Generated Credentials Popup Modal */}
      {createdCredentials && (
        <Modal
          isOpen={true}
          onClose={() => navigate('/auth/login')}
          title="🎉 Restaurant Registered Successfully!"
          footerActions={
            <>
              <Button variant="outline" size="sm" onClick={handleCopyCredentials}>
                📋 Copy Credentials
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/auth/login')}>
                Proceed to Login →
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-4">
            <p className="text-xs text-gray-600">
              Your restaurant account is active! Use the admin credentials below to sign in:
            </p>

            <div className="bg-gray-900 text-white p-4 rounded-xl font-mono text-xs space-y-2">
              <div className="flex justify-between border-b border-gray-800 pb-1.5">
                <span className="text-gray-400">Workspace:</span>
                <span className="text-orange-400 font-bold">{formData.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-1.5">
                <span className="text-gray-400">Admin Email:</span>
                <span className="text-green-400 font-bold">{createdCredentials.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Temp Password:</span>
                <span className="text-yellow-400 font-bold select-all">{createdCredentials.tempPassword}</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
              💡 <strong>Tip:</strong> Save these credentials safely. You can add cashiers, kitchen staff, and managers from your Restaurant Admin Dashboard after logging in.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RestaurantSignUpPage;
