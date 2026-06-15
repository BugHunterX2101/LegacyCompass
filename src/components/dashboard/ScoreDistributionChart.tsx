import React from 'react';

interface ScoreDistributionChartProps {
  data: { range: string; count: number }[];
}

const SCORE_BAR_CLASSES = [
  'score-bar-0-20',
  'score-bar-21-40',
  'score-bar-41-60',
  'score-bar-61-80',
  'score-bar-81-100',
];

const SCORE_TEXT_COLORS = [
  'text-red-400',
  'text-orange-400',
  'text-amber-400',
  'text-emerald-400',
  'text-emerald-300',
];

export const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({ data }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
      <h3 className="text-lg font-semibold text-white mb-5 flex items-center">
        <div className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-500 to-purple-500 mr-3" />
        Score Distribution
      </h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
          >
            <div className={`w-14 text-sm font-semibold ${SCORE_TEXT_COLORS[index] || 'text-slate-400'} tabular-nums`}>
              {item.range}
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-slate-800/50 rounded-full h-3.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${SCORE_BAR_CLASSES[index] || 'bar-gradient-1'} transition-all duration-700`}
                  style={{ width: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="w-10 text-right">
              <span className="text-sm text-white font-bold tabular-nums">{item.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};