import React from 'react';
import { ScoreCircle } from '../common/ScoreCircle';

interface TopIndustriesChartProps {
  data: { name: string; count: number; avgScore: number }[];
}

const INDUSTRY_GRADIENTS = [
  'bar-gradient-1',
  'bar-gradient-2',
  'bar-gradient-3',
  'bar-gradient-4',
  'bar-gradient-5',
];

const RANK_COLORS = [
  'from-amber-400 to-amber-500',
  'from-slate-300 to-slate-400',
  'from-amber-600 to-amber-700',
  'from-slate-500 to-slate-600',
  'from-slate-500 to-slate-600',
];

export const TopIndustriesChart: React.FC<TopIndustriesChartProps> = ({ data }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
      <h3 className="text-lg font-semibold text-white mb-5 flex items-center">
        <div className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500 mr-3" />
        Top Industries
      </h3>
      <div className="space-y-3.5">
        {data.map((industry, index) => (
          <div 
            key={index} 
            className="group flex items-center p-3.5 bg-[#0E1218] rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
          >
            {/* Rank Badge */}
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${RANK_COLORS[index] || RANK_COLORS[4]} flex items-center justify-center mr-3.5 flex-shrink-0 shadow-sm`}>
              <span className="text-xs font-bold text-white">{index + 1}</span>
            </div>

            <div className="flex-1 min-w-0 mr-4">
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="font-medium text-white text-sm truncate">{industry.name}</h4>
                <span className="text-xs text-slate-400 ml-2 flex-shrink-0">{industry.count} leads</span>
              </div>
              <div className="w-full bg-slate-800/50 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${INDUSTRY_GRADIENTS[index] || INDUSTRY_GRADIENTS[0]} transition-all duration-700`}
                  style={{ width: `${(industry.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
            
            <ScoreCircle score={industry.avgScore} size="sm" showLabel={false} />
          </div>
        ))}
      </div>
    </div>
  );
};