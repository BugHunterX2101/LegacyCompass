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

  const getScoreGradient = (score: number): [string, string] => {
    if (score >= 80) return ['#10b981', '#34d399'];
    if (score >= 60) return ['#f59e0b', '#fbbf24'];
    return ['#ef4444', '#f87171'];
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Hot';
    if (score >= 80) return 'Warm';
    if (score >= 60) return 'Cool';
    return 'Cold';
  };

  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const [gradColor1, gradColor2] = getScoreGradient(score);
  const gradId = `score-grad-${score}-${Math.random().toString(36).substr(2, 5)}`;

  return (
    <div className="flex flex-col items-center score-circle">
      <div className={`${sizeClasses[size]} relative`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradColor1} />
              <stop offset="100%" stopColor={gradColor2} />
            </linearGradient>
          </defs>
          <circle
            cx="22"
            cy="22"
            r="20"
            stroke="#1e293b"
            strokeWidth="3.5"
            fill="none"
          />
          <circle
            cx="22"
            cy="22"
            r="20"
            stroke={`url(#${gradId})`}
            strokeWidth="3.5"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700"
            style={{
              filter: `drop-shadow(0 0 4px ${gradColor1}40)`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${textSizeClasses[size]} ${getScoreTextColor(score)}`}>
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={`text-xs mt-1.5 font-medium ${getScoreTextColor(score)}`}>
          {getScoreLabel(score)}
        </span>
      )}
    </div>
  );
};