import React from 'react';
import { ScoreCircle } from '../common/ScoreCircle';

interface TopIndustriesChartProps {
  data: { name: string; count: number; avgScore: number }[];
}

export const TopIndustriesChart: React.FC<TopIndustriesChartProps> = ({ data }) => {
  return (
    <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Top Industries</h3>
      <div className="space-y-4">
        {data.map((industry, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-[#1A1C1E] rounded-lg border border-gray-700">
            <div className="flex-1">
              <h4 className="font-medium text-white">{industry.name}</h4>
              <p className="text-sm text-gray-400">{industry.count} leads</p>
            </div>
            <ScoreCircle score={industry.avgScore} size="sm" showLabel={false} />
          </div>
        ))}
      </div>
    </div>
  );
};