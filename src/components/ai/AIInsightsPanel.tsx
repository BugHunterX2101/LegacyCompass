import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  LightBulbIcon, 
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  UserGroupIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { Lead } from '../../types';
import { aiService } from '../../services/aiService';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface AIInsightsPanelProps {
  lead: Lead;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ lead }) => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateInsights = async () => {
      try {
        setLoading(true);
        setError(null);
        const aiInsights = await aiService.analyzeLeadWithAI(lead);
        setInsights(aiInsights);
      } catch (err) {
        console.error('Failed to generate AI insights:', err);
        setError('Failed to generate insights. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    generateInsights();
  }, [lead]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <SparklesIcon className="h-5 w-5 text-emerald-400" />;
      case 'risk': return <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />;
      case 'prediction': return <BoltIcon className="h-5 w-5 text-violet-400" />;
      default: return <LightBulbIcon className="h-5 w-5 text-amber-400" />;
    }
  };

  const getInsightBgColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'border-emerald-500/20 bg-emerald-500/5';
      case 'risk': return 'border-red-500/20 bg-red-500/5';
      case 'prediction': return 'border-violet-500/20 bg-violet-500/5';
      default: return 'border-amber-500/20 bg-amber-500/5';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
        <div className="flex items-center justify-center py-14">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-slate-300">Analyzing {lead.companyName} with AI...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
        <div className="text-center py-10">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-white flex items-center">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-amber-500 to-yellow-500 mr-3" />
            AI Analysis: {lead.companyName}
          </h2>
          <span className="text-xs text-slate-500 bg-slate-800/60 px-3 py-1 rounded-full border border-slate-700/40">
            Powered by Groq AI
          </span>
        </div>
        <p className="text-sm text-slate-400 ml-5">
          {lead.industry} &bull; {lead.location} &bull; {lead.employeeCount.toLocaleString()} employees
          {lead.contactPerson && ` \u2022 ${lead.contactPerson}`}
          {lead.title && ` (${lead.title})`}
        </p>
      </div>

      {insights && (
        <>
          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-400 font-medium">Lead Score</p>
                <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/15">
                  <ChartBarIcon className="h-4 w-4 text-blue-400" />
                </div>
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(insights.leadScore)}`}>
                {insights.leadScore}
              </div>
              <div className="mt-3 w-full bg-slate-800/50 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
                  style={{ width: `${Math.min(insights.leadScore, 100)}%`, boxShadow: '0 0 8px rgba(59,130,246,0.3)' }}
                />
              </div>
            </div>

            <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-400 font-medium">Conversion Probability</p>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-emerald-400" />
                </div>
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(insights.predictedConversion)}`}>
                {insights.predictedConversion}%
              </div>
              <div className="mt-3 w-full bg-slate-800/50 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-700"
                  style={{ width: `${Math.min(insights.predictedConversion, 100)}%`, boxShadow: '0 0 8px rgba(16,185,129,0.3)' }}
                />
              </div>
            </div>

            <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-400 font-medium">Best Contact Time</p>
                <div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/15">
                  <BoltIcon className="h-4 w-4 text-violet-400" />
                </div>
              </div>
              <div className="text-lg font-semibold text-violet-300 mt-2">
                {insights.bestContactTime}
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-amber-500 to-yellow-500 mr-3" />
              AI Insights
            </h3>
            <div className="space-y-3">
              {insights.insights && insights.insights.length > 0 ? (
                insights.insights.map((insight: any, index: number) => (
                  <div key={index} className={`rounded-xl p-4 border ${getInsightBgColor(insight.type)}`}>
                    <div className="flex items-start space-x-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">{insight.title}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                            insight.type === 'opportunity' ? 'bg-emerald-500/15 text-emerald-300' :
                            insight.type === 'risk' ? 'bg-red-500/15 text-red-300' :
                            insight.type === 'prediction' ? 'bg-violet-500/15 text-violet-300' :
                            'bg-amber-500/15 text-amber-300'
                          }`}>
                            {insight.type || 'insight'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No specific insights available.</p>
              )}
            </div>
          </div>

          {/* Recommendations & Approach */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recommended Approach */}
            <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-emerald-500 to-green-500 mr-3" />
                Recommended Approach
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">{insights.recommendedApproach}</p>
            </div>

            {/* Action Items */}
            <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500 mr-3" />
                Key Recommendations
              </h3>
              <div className="space-y-2.5">
                {insights.recommendations && insights.recommendations.length > 0 ? (
                  insights.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2.5">
                      <span className="text-blue-400 text-sm font-bold mt-0.5 tabular-nums">{index + 1}.</span>
                      <p className="text-sm text-slate-300">{rec}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">No specific recommendations yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Competitor & Market */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insights.competitorAnalysis && insights.competitorAnalysis.length > 0 && (
              <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-2 text-orange-400" />
                  Competitive Landscape
                </h3>
                <div className="space-y-2">
                  {insights.competitorAnalysis.map((item: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {insights.marketTrends && insights.marketTrends.length > 0 && (
              <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-cyan-400" />
                  Market Trends
                </h3>
                <div className="space-y-2">
                  {insights.marketTrends.map((trend: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-slate-300">{trend}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
