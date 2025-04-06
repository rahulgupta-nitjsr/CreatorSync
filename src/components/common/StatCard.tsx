import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType; 
}

/**
 * StatCard component displays a single statistic with an icon.
 * Memoized to prevent unnecessary re-renders if props remain the same.
 */
const StatCardComponent: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => (
  <div className="p-4 border rounded-lg shadow-sm bg-white">
    <div className="flex flex-row items-center justify-between pb-2">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <Icon className="h-4 w-4 text-gray-400" />
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

export const StatCard = React.memo(StatCardComponent); 