import React, { useState, useRef, useCallback } from 'react';
import { AssessmentFormData } from '../types';
import { INDIAN_STATES, FINANCING_OPTIONS } from '../constants';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { DocumentIcon } from './icons/DocumentIcon';
import { BoltIcon } from './icons/BoltIcon'; // Using BoltIcon for camera

interface AssessmentFormProps {
  onSubmit: (data: AssessmentFormData) => void;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<AssessmentFormData>({
    clientName: '',
    state: 'Telangana',
    pincode: '',
    contractDemand: 100,
    netUnitsConsumed: 12000,
    powerTariff: 8.5,
    availableSpace: 10000,
    transformerCapacity: 125,
    financingOption: 'Bank Loan',
    cmdEnhancementCost: 500,
    powerBillFile: undefined,
  });
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['pincode', 'contractDemand', 'netUnitsConsumed', 'powerTariff', 'availableSpace', 'transformerCapacity', 'cmdEnhancementCost'];
    setFormData(prev => ({ ...prev, [name]: numericFields.includes(name) ? Number(value) : value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, powerBillFile: e.target.files![0] }));
    }
  };

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsCameraOpen(true);
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("Could not access the camera. Please ensure permissions are granted.");
      }
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setFormData(prev => ({ ...prev, powerBillFile: dataUrl }));
      stopCamera();
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-card dark:bg-solar-gray p-6 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold text-primary dark:text-solar-gold mb-6 font-display">On-Site Assessment Report</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input label="Client Name" name="clientName" value={formData.clientName} onChange={handleChange} required />
          <Select label="State" name="state" value={formData.state} onChange={handleChange} options={INDIAN_STATES} />
          <Input label="Pincode" name="pincode" type="number" value={formData.pincode} onChange={handleChange} required />
          <Input label="Contract Demand (CMD in kVA)" name="contractDemand" type="number" value={String(formData.contractDemand)} onChange={handleChange} required />
          <Input label="Transformer Capacity (in kVA)" name="transformerCapacity" type="number" value={String(formData.transformerCapacity)} onChange={handleChange} required />
          <Input label="Net Monthly Units (from Bill)" name="netUnitsConsumed" type="number" value={String(formData.netUnitsConsumed)} onChange={handleChange} required />
          <Input label="Average Power Tariff (₹/unit)" name="powerTariff" type="number" value={String(formData.powerTariff)} onChange={handleChange} required step="0.01" />
          <Input label="Available Space (sq. ft.)" name="availableSpace" type="number" value={String(formData.availableSpace)} onChange={handleChange} required />
          <Select label="Financing Option" name="financingOption" value={formData.financingOption} onChange={handleChange} options={FINANCING_OPTIONS} />
          <Input label="CMD Enhancement Cost (₹/kVA)" name="cmdEnhancementCost" type="number" value={String(formData.cmdEnhancementCost)} onChange={handleChange} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground dark:text-gray-300 mb-2">Attach Power Bill (Optional)</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-secondary dark:bg-charcoal-gray hover:bg-gray-200 dark:hover:bg-solar-black text-secondary-foreground dark:text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition">
              <DocumentIcon className="w-5 h-5 mr-2"/>
              <span>Upload File</span>
              <input type='file' className="hidden" onChange={handleFileChange} accept="image/*,.pdf"/>
            </label>
            <Button type="button" onClick={startCamera} variant="secondary" className="inline-flex items-center">
              <BoltIcon className="w-5 h-5 mr-2"/>
              Use Camera
            </Button>
          </div>
          {formData.powerBillFile && <p className="text-sm text-green-600 dark:text-green-400 mt-2">Power bill {typeof formData.powerBillFile === 'string' ? 'image captured!' : 'file selected!'} </p>}
        </div>
        
        {isCameraOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 p-4">
            <video ref={videoRef} className="max-w-full max-h-[70vh] rounded-lg mb-4" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-4">
              <Button type="button" onClick={captureImage}>Capture</Button>
              <Button type="button" onClick={stopCamera} variant="secondary">Cancel</Button>
            </div>
          </div>
        )}

        <div className="text-center pt-4">
          <Button type="submit">Generate Assessment Report</Button>
        </div>
      </form>
    </div>
  );
};
