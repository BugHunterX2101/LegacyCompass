import React from 'react';

interface ScoreCircleProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({ 
  score, 
  size = 'md', 
  showLabel = true 
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'stroke-green-500';
    if (score >= 60) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className={`${sizeClasses[size]} relative`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="22"
            cy="22"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-300 ${getScoreColor(score)}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${textSizeClasses[size]} ${getScoreTextColor(score)}`}>
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className="text-xs text-gray-600 mt-1">Score</span>
      )}
    </div>
  );
};