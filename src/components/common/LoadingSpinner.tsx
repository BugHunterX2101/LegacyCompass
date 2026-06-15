import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const gradients: Record<string, [string, string]> = {
    primary: ['#3b82f6', '#8b5cf6'],
    secondary: ['#06b6d4', '#14b8a6'],
    white: ['#ffffff', '#e2e8f0'],
  };

  const [c1, c2] = gradients[color] || gradients.primary;
  const gradId = `spinner-grad-${color}`;

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <svg className="w-full h-full" viewBox="0 0 24 24">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={c1} />
              <stop offset="100%" stopColor={c2} />
            </linearGradient>
          </defs>
          <circle 
            className="opacity-15" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke={c1}
            strokeWidth="3.5" 
            fill="none"
          />
          <path 
            fill={`url(#${gradId})`}
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    </div>
  );
};