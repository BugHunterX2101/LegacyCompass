import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  LightBulbIcon, 
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  UserGroupIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { Lead } from '../../types';
import { aiService } from '../../services/aiService';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface AIInsight {
  type: 'opportunity' | 'risk' | 'recommendation' | 'prediction' | 'general';
  title: string;
  description: string;
}

interface AIAnalysis {
  leadScore: number;
  predictedConversion: number;
  bestContactTime: string;
  insights: AIInsight[];
  recommendedApproach: string;
  recommendations?: string[];
  competitorAnalysis?: string[];
  marketTrends?: string[];
}

interface AIInsightsPanelProps {
  lead: Lead;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ lead }) => {
  const [insights, setInsights] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateInsights = async () => {
      try {
        setLoading(true);
        setError(null);
        setInsights(null);
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
  // Only re-fetch when lead identity or its last-updated timestamp changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead.id, lead.updatedAt]);

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'opportunity': return <SparklesIcon className="h-5 w-5 text-green-400" />;
      case 'risk': return <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />;
      case 'prediction': return <BoltIcon className="h-5 w-5 text-purple-400" />;
      case 'recommendation': return <CheckCircleIcon className="h-5 w-5 text-blue-400" />;
      default: return <LightBulbIcon className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getInsightBgColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'opportunity': return 'border-green-700/30 bg-green-900/10';
      case 'risk': return 'border-red-700/30 bg-red-900/10';
      case 'prediction': return 'border-purple-700/30 bg-purple-900/10';
      case 'recommendation': return 'border-blue-700/30 bg-blue-900/10';
      default: return 'border-yellow-700/30 bg-yellow-900/10';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-white">Analyzing {lead.companyName} with AI...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => { setError(null); setLoading(true); aiService.analyzeLeadWithAI(lead).then(setInsights).catch(e => setError(e.message || 'Failed')).finally(() => setLoading(false)); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-white flex items-center">
            <LightBulbIcon className="h-6 w-6 mr-2 text-yellow-500" />
            AI Analysis: {lead.companyName}
          </h2>
          <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
            Powered by Groq AI
          </span>
        </div>
        <p className="text-sm text-gray-400">
          {lead.industry} &bull; {lead.location} &bull; {lead.employeeCount.toLocaleString()} employees
          {lead.contactPerson && ` \u2022 ${lead.contactPerson}`}
          {lead.title && ` (${lead.title})`}
        </p>
      </div>

      {insights && (
        <>
          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-400">Lead Score</p>
                <ChartBarIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(insights.leadScore)}`}>
                {insights.leadScore}
              </div>
              <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-500 transition-all duration-700"
                  style={{ width: `${Math.min(insights.leadScore, 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-400">Conversion Probability</p>
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-400" />
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(insights.predictedConversion)}`}>
                {insights.predictedConversion}%
              </div>
              <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-green-500 transition-all duration-700"
                  style={{ width: `${Math.min(insights.predictedConversion, 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-400">Best Contact Time</p>
                <BoltIcon className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-lg font-semibold text-purple-300 mt-1">
                {insights.bestContactTime}
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <SparklesIcon className="h-5 w-5 mr-2 text-yellow-500" />
              AI Insights
            </h3>
            <div className="space-y-3">
              {insights.insights && insights.insights.length > 0 ? (
                insights.insights.map((insight: AIInsight, index: number) => (
                  <div key={index} className={`rounded-lg p-4 border ${getInsightBgColor(insight.type)}`}>
                    <div className="flex items-start space-x-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">{insight.title}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                            insight.type === 'opportunity' ? 'bg-green-900/40 text-green-300' :
                            insight.type === 'risk' ? 'bg-red-900/40 text-red-300' :
                            insight.type === 'prediction' ? 'bg-purple-900/40 text-purple-300' :
                            'bg-yellow-900/40 text-yellow-300'
                          }`}>
                            {insight.type || 'insight'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No specific insights available.</p>
              )}
            </div>
          </div>

          {/* Recommendations & Approach */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recommended Approach */}
            <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-green-500" />
                Recommended Approach
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">{insights.recommendedApproach}</p>
            </div>

            {/* Action Items */}
            <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-500" />
                Key Recommendations
              </h3>
              <div className="space-y-2">
                {insights.recommendations && insights.recommendations.length > 0 ? (
                  insights.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-blue-400 text-sm font-bold mt-0.5">{index + 1}.</span>
                      <p className="text-sm text-gray-300">{rec}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No specific recommendations yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Competitor & Market */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insights.competitorAnalysis && insights.competitorAnalysis.length > 0 && (
              <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-2 text-orange-400" />
                  Competitive Landscape
                </h3>
                <div className="space-y-2">
                  {insights.competitorAnalysis!.map((item: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {insights.marketTrends && insights.marketTrends.length > 0 && (
              <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-cyan-400" />
                  Market Trends
                </h3>
                <div className="space-y-2">
                  {insights.marketTrends!.map((trend: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-300">{trend}</p>
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
