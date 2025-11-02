import React, { useState } from 'react';
import { User, Role } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { UniteSolarLogo } from './UniteSolarLogo';

interface LoginProps {
  onLogin: (user: User) => void;
}

const ROLES: Role[] = ['Admin', 'Franchise', 'Client', 'Guest', 'Investor', 'Partner', 'Advisor'];

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('Admin');
  const [role, setRole] = useState<Role>('Admin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin({ name, role });
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-solar-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card dark:bg-solar-gray p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-center mb-6">
            <UniteSolarLogo className="h-16 w-auto" />
        </div>
        <h1 className="text-2xl font-bold text-center text-primary dark:text-solar-gold mb-2 font-display">
          Admin Dashboard
        </h1>
        <p className="text-center text-muted-foreground dark:text-gray-400 mb-8">Sign in to continue</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Full Name" 
            name="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            placeholder="Enter your name"
          />
          <Select 
            label="Select Role" 
            name="role" 
            value={role} 
            onChange={(e) => setRole(e.target.value as Role)} 
            options={ROLES}
          />
          <div className="pt-4">
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
