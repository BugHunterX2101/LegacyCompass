import React from 'react';

interface ScoreDistributionChartProps {
  data: { range: string; count: number }[];
}

export const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({ data }) => {
  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Score Distribution</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-16 text-sm text-gray-300 font-medium">{item.range}</div>
            <div className="flex-1 mx-4">
              <div className="bg-[#1A1C1E] rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#2563EB] to-[#6366F1] rounded-full transition-all duration-300"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-8 text-sm text-white font-medium text-right">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};