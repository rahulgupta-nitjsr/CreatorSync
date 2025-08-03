import React, { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'glass' | 'outline' | 'danger' | 'success' | 'text' | 'ghost';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  glow?: boolean; // Adds glow effect
  floating?: boolean; // Adds floating animation
}

/**
 * Liquid Glass Button Component
 * Features sophisticated glass morphism effects, multiple variants, and beautiful animations.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  leftIcon,
  rightIcon,
  disabled,
  glow = false,
  floating = false,
  ...props
}, ref) => {
  // Variant class mappings with liquid glass aesthetics
  const variantClasses = {
    primary: `
      bg-gradient-primary text-white border-primary-500 shadow-warm
      hover:shadow-warm-lg hover:scale-105 hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600
      focus:ring-primary-300 focus:ring-opacity-50
      active:scale-95
    `,
    secondary: `
      bg-gradient-glass-light backdrop-blur-md border-glass-border text-surface-700
      hover:bg-gradient-glass-dark hover:shadow-glass-hover hover:scale-105
      focus:ring-surface-300 focus:ring-opacity-50
      active:scale-95
    `,
    glass: `
      bg-gradient-glass-light backdrop-blur-lg border-glass-border text-surface-800
      hover:bg-gradient-glass-dark hover:shadow-warm hover:scale-105
      focus:ring-primary-300 focus:ring-opacity-30
      active:scale-95
    `,
    outline: `
      bg-transparent border-2 border-primary-400 text-primary-600
      hover:bg-primary-50 hover:border-primary-500 hover:scale-105 hover:shadow-warm
      focus:ring-primary-300 focus:ring-opacity-50
      active:scale-95
    `,
    danger: `
      bg-gradient-to-br from-red-500 to-red-600 text-white border-red-500 shadow-lg
      hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:scale-105
      focus:ring-red-300 focus:ring-opacity-50
      active:scale-95
    `,
    success: `
      bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-500 shadow-lg
      hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl hover:scale-105
      focus:ring-emerald-300 focus:ring-opacity-50
      active:scale-95
    `,
    text: `
      bg-transparent text-primary-600 border-0
      hover:bg-primary-50 hover:scale-105
      focus:ring-primary-300 focus:ring-opacity-50
      active:scale-95
    `,
    ghost: `
      bg-surface-100/50 backdrop-blur-sm text-surface-700 border-surface-200
      hover:bg-surface-200/50 hover:text-surface-900 hover:scale-105
      focus:ring-surface-300 focus:ring-opacity-50
      active:scale-95
    `,
  };

  // Size class mappings
  const sizeClasses = {
    xs: 'py-1.5 px-3 text-xs rounded-lg min-h-[32px]',
    sm: 'py-2 px-4 text-sm rounded-xl min-h-[36px]',
    md: 'py-2.5 px-5 text-base rounded-xl min-h-[40px]',
    lg: 'py-3 px-6 text-lg rounded-2xl min-h-[44px]',
    xl: 'py-4 px-8 text-xl rounded-2xl min-h-[52px]',
  };

  // Icon size mappings
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };
  
  // Combined classes
  const buttonClasses = `
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
    ${glow ? 'animate-glow' : ''}
    ${floating ? 'animate-float' : ''}
    inline-flex items-center justify-center font-medium
    border transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transform-gpu
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const LoadingIcon = () => (
    <svg
      className={`animate-spin -ml-1 mr-2 ${iconSizes[size]} text-current`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Loading state */}
      {isLoading && <LoadingIcon />}
      
      {/* Left icon */}
      {!isLoading && leftIcon && (
        <span className={`mr-2 ${iconSizes[size]} flex items-center justify-center`}>
          {leftIcon}
        </span>
      )}
      
      {/* Button content */}
      <span className="flex items-center justify-center">
        {children}
      </span>
      
      {/* Right icon */}
      {!isLoading && rightIcon && (
        <span className={`ml-2 ${iconSizes[size]} flex items-center justify-center`}>
          {rightIcon}
        </span>
      )}
      
      {/* Ripple effect overlay */}
      <span className="absolute inset-0 rounded-inherit bg-white opacity-0 transition-opacity duration-200 pointer-events-none group-active:opacity-20" />
    </button>
  );
});

Button.displayName = 'Button';

export default Button; 