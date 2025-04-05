import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  footerActions?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'flat';
  noPadding?: boolean;
}

/**
 * Card component for containing content with optional header and footer
 */
export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerActions,
  footerActions,
  className = '',
  variant = 'default',
  noPadding = false,
  ...props
}) => {
  // Card variant classes
  const variantClasses = {
    default: 'bg-white shadow-md',
    outlined: 'bg-white border border-gray-200',
    flat: 'bg-gray-50',
  };

  // Card container classes
  const cardClasses = `
    rounded-lg overflow-hidden
    ${variantClasses[variant]}
    ${className}
  `;

  return (
    <div className={cardClasses} {...props}>
      {/* Card Header */}
      {(title || subtitle || headerActions) && (
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}

      {/* Card Content */}
      <div className={noPadding ? '' : 'p-6'}>{children}</div>

      {/* Card Footer */}
      {footerActions && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          {footerActions}
        </div>
      )}
    </div>
  );
};

export default Card; 