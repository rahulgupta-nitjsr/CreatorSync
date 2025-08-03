import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: number; // Optional trend percentage
    subtitle?: string; // Optional subtitle/description
    color?: 'primary' | 'accent' | 'success' | 'warning' | 'info';
    className?: string;
}

/**
 * StatCard component displays a single statistic with liquid glass design.
 * Features glass morphism effects, hover animations, and optional trend indicators.
 * Memoized to prevent unnecessary re-renders if props remain the same.
 */
const StatCardComponent: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon,
  trend,
  subtitle,
  color = 'primary',
  className = ''
}) => {
  const getColorClasses = (colorScheme: string) => {
    switch (colorScheme) {
      case 'accent':
        return {
          iconBg: 'bg-gradient-to-br from-accent-100 to-accent-200',
          iconColor: 'text-accent-600',
          trendColor: trend && trend > 0 ? 'text-emerald-600' : trend && trend < 0 ? 'text-red-500' : 'text-surface-500'
        };
      case 'success':
        return {
          iconBg: 'bg-gradient-to-br from-emerald-100 to-emerald-200',
          iconColor: 'text-emerald-600',
          trendColor: trend && trend > 0 ? 'text-emerald-600' : trend && trend < 0 ? 'text-red-500' : 'text-surface-500'
        };
      case 'warning':
        return {
          iconBg: 'bg-gradient-to-br from-amber-100 to-amber-200',
          iconColor: 'text-amber-600',
          trendColor: trend && trend > 0 ? 'text-emerald-600' : trend && trend < 0 ? 'text-red-500' : 'text-surface-500'
        };
      case 'info':
        return {
          iconBg: 'bg-gradient-to-br from-sky-100 to-sky-200',
          iconColor: 'text-sky-600',
          trendColor: trend && trend > 0 ? 'text-emerald-600' : trend && trend < 0 ? 'text-red-500' : 'text-surface-500'
        };
      default: // primary
        return {
          iconBg: 'bg-gradient-to-br from-primary-100 to-primary-200',
          iconColor: 'text-primary-600',
          trendColor: trend && trend > 0 ? 'text-emerald-600' : trend && trend < 0 ? 'text-red-500' : 'text-surface-500'
        };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className={`glass-card group relative overflow-hidden hover:shadow-warm-lg ${className}`}>
      {/* Gradient overlay that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Card content */}
      <div className="relative p-6 space-y-4">
        {/* Header with title and icon */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-surface-600 uppercase tracking-wider">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-surface-500">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Icon with glass morphism background */}
          <div className={`
            p-3 rounded-2xl backdrop-blur-sm border border-white/20
            ${colorClasses.iconBg}
            transform group-hover:scale-110 group-hover:rotate-3 
            transition-all duration-300 ease-out
            shadow-lg group-hover:shadow-xl
          `}>
            <Icon className={`h-6 w-6 ${colorClasses.iconColor}`} />
          </div>
        </div>

        {/* Main value */}
        <div className="space-y-1">
          <div className="text-3xl font-bold text-surface-900 group-hover:text-primary-700 transition-colors duration-300">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          
          {/* Trend indicator */}
          {trend !== undefined && (
            <div className="flex items-center space-x-1">
              <div className={`flex items-center space-x-1 ${colorClasses.trendColor}`}>
                {trend > 0 ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : trend < 0 ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-sm font-medium">
                  {Math.abs(trend)}%
                </span>
              </div>
              <span className="text-xs text-surface-500">vs last period</span>
            </div>
          )}
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    </div>
  );
};

export const StatCard = React.memo(StatCardComponent); 