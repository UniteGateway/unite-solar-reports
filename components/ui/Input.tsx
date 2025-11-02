import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, name, ...props }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-muted-foreground dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="w-full bg-secondary dark:bg-solar-black border border-border dark:border-gray-600 rounded-lg p-2.5 text-foreground dark:text-white focus:ring-ring focus:border-ring transition"
        {...props}
      />
    </div>
  );
};
