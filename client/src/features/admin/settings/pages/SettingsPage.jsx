import React, { useState } from 'react';
import Card from '../../../../components/common/Card';
import Input from '../../../../components/common/Input';
import Button from '../../../../components/common/Button';
import { useToast } from '../../../../services/notifications/useToast';

export const SettingsPage = () => {
  const toast = useToast();

  // Controlled Info state
  const [name, setName] = useState('Restro Munch Dhaba');
  const [address, setAddress] = useState('123 Dhaba Road, NH-8, Haryana');
  const [contact, setContact] = useState('9999999999');
  const [isSavingInfo, setIsSavingInfo] = useState(false);

  // Controlled Taxes state
  const [gstRate, setGstRate] = useState('5');
  const [serviceCharge, setServiceCharge] = useState('0');
  const [gstin, setGstin] = useState('27XXXXX0000X0Z0');
  const [isSavingTaxes, setIsSavingTaxes] = useState(false);

  const handleSaveInfo = () => {
    if (!name || !address || !contact) {
      toast.show('Please fill in all required profile fields!', 'warning');
      return;
    }
    setIsSavingInfo(true);
    setTimeout(() => {
      setIsSavingInfo(false);
      toast.show('General Restaurant Profile saved successfully!', 'success');
    }, 1000);
  };

  const handleSaveTaxes = () => {
    if (!gstRate || !serviceCharge || !gstin) {
      toast.show('Please fill in all required tax fields!', 'warning');
      return;
    }
    setIsSavingTaxes(true);
    setTimeout(() => {
      setIsSavingTaxes(false);
      toast.show('Tax & Service Charges configuration updated!', 'success');
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-xs text-gray-500 mt-1">Configure general shop metadata, taxes structures and integrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="General Restaurant Info">
          <div className="flex flex-col gap-4">
            <Input
              label="Restaurant Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Address Location"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <Input
              label="Contact Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
            <Button
              variant="primary"
              className="mt-2"
              isLoading={isSavingInfo}
              onClick={handleSaveInfo}
            >
              Save Profile
            </Button>
          </div>
        </Card>

        <Card title="Tax & Service Charges">
          <div className="flex flex-col gap-4">
            <Input
              label="GST Rate (%)"
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
              helperText="Calculated as CGST (2.5%) + SGST (2.5%)"
              required
            />
            <Input
              label="Service Charge (%)"
              value={serviceCharge}
              onChange={(e) => setServiceCharge(e.target.value)}
              required
            />
            <Input
              label="GSTIN Number"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              required
            />
            <Button
              variant="primary"
              className="mt-2"
              isLoading={isSavingTaxes}
              onClick={handleSaveTaxes}
            >
              Update Taxes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
