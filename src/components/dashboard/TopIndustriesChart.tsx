import React from 'react';
import { ScoreCircle } from '../common/ScoreCircle';

interface TopIndustriesChartProps {
  data: { name: string; count: number; avgScore: number }[];
}

export const TopIndustriesChart: React.FC<TopIndustriesChartProps> = ({ data }) => {
  const maxCount = data.length > 0 ? Math.max(...data.map(d => d.count), 1) : 1;

  return (
    <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Top Industries</h3>
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">No industry data available</div>
      ) : (
        <div className="space-y-3">
          {data.map((industry, index) => (
            <div key={index} className="p-3 bg-[#161B22] rounded-lg border border-gray-700/60">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-gray-500 w-4 flex-shrink-0">{index + 1}</span>
                  <h4 className="font-medium text-white text-sm truncate">{industry.name}</h4>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                  <span className="text-xs text-gray-400">{industry.count} leads</span>
                  <ScoreCircle score={industry.avgScore} size="sm" showLabel={false} />
                </div>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${(industry.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};