import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Input component for forms with label, helper text, and error states
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base input classes
    const inputClasses = `
      block border rounded-md px-3 py-2 
      ${fullWidth ? 'w-full' : 'w-auto'}
      ${leftIcon ? 'pl-10' : ''} 
      ${rightIcon ? 'pr-10' : ''}
      ${
        error
          ? 'border-red-500 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
      }
      ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-75' : 'bg-white'}
      focus:outline-none focus:ring-2 focus:ring-opacity-50
      ${className}
    `;

    return (
      <div className={fullWidth ? 'w-full' : 'w-auto'}>
        {label && (
          <label
            htmlFor={props.id}
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={inputClasses}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
            }
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${props.id}-error`}>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p
            className="mt-1 text-sm text-gray-500"
            id={`${props.id}-helper`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

// Add display name for React DevTools
Input.displayName = 'Input';

export default Input; 