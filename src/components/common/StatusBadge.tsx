import React from 'react';

interface StatusBadgeProps {
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    new: {
      bg: 'bg-blue-600/20',
      text: 'text-blue-300',
      label: 'New'
    },
    contacted: {
      bg: 'bg-yellow-600/20',
      text: 'text-yellow-300',
      label: 'Contacted'
    },
    qualified: {
      bg: 'bg-green-600/20',
      text: 'text-green-300',
      label: 'Qualified'
    },
    converted: {
      bg: 'bg-purple-600/20',
      text: 'text-purple-300',
      label: 'Converted'
    },
    rejected: {
      bg: 'bg-red-600/20',
      text: 'text-red-300',
      label: 'Rejected'
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};