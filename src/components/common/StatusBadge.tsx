import React from 'react';

interface StatusBadgeProps {
  status: 'new' | 'qualified' | 'unqualified' | 'contacted' | 'converted' | 'rejected' | 'hot' | 'warm' | 'cold';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  const statusConfig = {
    new: {
      bg: 'bg-blue-600/20',
      text: 'text-blue-300',
      label: 'New'
    },
    qualified: {
      bg: 'bg-green-600/20',
      text: 'text-green-300',
      label: 'Qualified'
    },
    unqualified: {
      bg: 'bg-red-600/20',
      text: 'text-red-300',
      label: 'Unqualified'
    },
    contacted: {
      bg: 'bg-yellow-600/20',
      text: 'text-yellow-300',
      label: 'Contacted'
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
    hot: {
      bg: 'bg-red-600/20',
      text: 'text-red-300',
      label: 'Hot'
    },
    warm: {
      bg: 'bg-orange-600/20',
      text: 'text-orange-300',
      label: 'Warm'
    },
    cold: {
      bg: 'bg-gray-600/20',
      text: 'text-gray-300',
      label: 'Cold'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};