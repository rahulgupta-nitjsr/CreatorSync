import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        className={`w-4 h-4 text-primary-600 bg-surface-100 border-surface-300 rounded focus:ring-primary-500 focus:ring-2 ${className}`}
        {...props}
      />
      {label && <label className="text-sm text-surface-700">{label}</label>}
    </div>
  );
};