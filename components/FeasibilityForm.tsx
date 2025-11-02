import React, { useState } from 'react';
import { FeasibilityFormData } from '../types';
import { INSTALLATION_TYPES, ROOF_TYPES, MODULE_BRANDS, OPERATION_MODES, AMC_PREFERENCES, INSURANCE_OPTIONS } from '../constants';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';

interface FeasibilityFormProps {
  onSubmit: (data: FeasibilityFormData) => void;
}

export const FeasibilityForm: React.FC<FeasibilityFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FeasibilityFormData>({
    companyName: 'SRVS Industries',
    contactPerson: 'Mr. Ramesh',
    location: 'Balanagar, Telangana',
    plantCapacity: 60,
    installationType: 'Rooftop',
    roofType: 'RCC',
    moduleBrand: 'Any Tier-1',
    operationMode: 'CAPEX',
    powerTariff: 8,
    amcPreference: '3 Years',
    insurance: 'Yes',
    additionalNotes: 'Net metering and subsidy applicable.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'plantCapacity' || name === 'powerTariff' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-card dark:bg-solar-gray p-6 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-primary dark:text-solar-gold mb-6 font-display">Feasibility Report Generator</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input label="Company / Client Name" name="companyName" value={formData.companyName} onChange={handleChange} required />
            <Input label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required />
            <Input label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., City, State" required />
            <Input label="Plant Capacity (in kW)" name="plantCapacity" type="number" value={formData.plantCapacity.toString()} onChange={handleChange} required min="1" />
            <Select label="Type of Installation" name="installationType" value={formData.installationType} onChange={handleChange} options={INSTALLATION_TYPES} />
            <Select label="Roof Type" name="roofType" value={formData.roofType} onChange={handleChange} options={ROOF_TYPES} />
            <Select label="Module Brand Preference" name="moduleBrand" value={formData.moduleBrand} onChange={handleChange} options={MODULE_BRANDS} />
            <Select label="Mode of Operation" name="operationMode" value={formData.operationMode} onChange={handleChange} options={OPERATION_MODES} />
            <Input label="Average Power Tariff (₹/unit)" name="powerTariff" type="number" value={formData.powerTariff.toString()} onChange={handleChange} required step="0.01" min="0" />
            <Select label="AMC Preference" name="amcPreference" value={formData.amcPreference} onChange={handleChange} options={AMC_PREFERENCES} />
            <Select label="Insurance" name="insurance" value={formData.insurance} onChange={handleChange} options={INSURANCE_OPTIONS as any} />
        </div>
        <div>
            <label htmlFor="additionalNotes" className="block text-sm font-medium text-muted-foreground dark:text-gray-300 mb-1">Additional Notes</label>
            <textarea
            id="additionalNotes"
            name="additionalNotes"
            rows={3}
            value={formData.additionalNotes}
            onChange={handleChange}
            className="w-full bg-secondary dark:bg-solar-black border border-border dark:border-gray-600 rounded-lg p-2.5 focus:ring-ring focus:border-ring transition"
            placeholder="e.g., Net metering and subsidy applicable"
            ></textarea>
        </div>
        <div className="text-center pt-4">
            <Button type="submit">
            Generate Feasibility Report
            </Button>
        </div>
        </form>
    </div>
  );
};
