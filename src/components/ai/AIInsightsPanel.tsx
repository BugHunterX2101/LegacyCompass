import React, { useState, useEffect } from 'react';
import { Lead } from '../../types';
import { aiService } from '../../services/aiService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { 
  SparklesIcon, 
  LightBulbIcon, 
  ExclamationTriangleIcon,
  TrendingUpIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface AIInsight {
  type: 'opportunity' | 'risk' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  suggestedActions?: string[];
}

interface AIAnalysis {
  leadScore: number;
  insights: AIInsight[];
  predictedConversion: number;
  bestContactTime: string;
  recommendedApproach: string;
  competitorAnalysis: string[];
  marketTrends: string[];
}

interface AIInsightsPanelProps {
  lead: Lead;
  onActionTaken?: (action: string) => void;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ lead, onActionTaken }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAIAnalysis();
  }, [lead.id]);

  const loadAIAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await aiService.analyzeLeadWithAI(lead);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to load AI analysis');
      console.error('AI analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUpIcon className="h-5 w-5 text-green-400" />;
      case 'risk':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />;
      case 'recommendation':
        return <LightBulbIcon className="h-5 w-5 text-blue-400" />;
      case 'prediction':
        return <ChartBarIcon className="h-5 w-5 text-purple-400" />;
      default:
        return <SparklesIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: AIInsight['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-500/10';
      case 'medium':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'low':
        return 'border-green-500 bg-green-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  const handleActionClick = (action: string) => {
    onActionTaken?.(action);
  };

  if (loading) {
    return (
      <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-white">Analyzing lead with AI...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-400">{error}</p>
          <button
            onClick={loadAIAnalysis}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2 text-blue-400" />
          AI Insights
        </h3>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center">
            <ChartBarIcon className="h-4 w-4 mr-1" />
            Score: {analysis.leadScore}/100
          </div>
          <div className="flex items-center">
            <TrendingUpIcon className="h-4 w-4 mr-1" />
            {analysis.predictedConversion}% conversion
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">AI Lead Score</p>
              <p className="text-2xl font-bold text-white">{analysis.leadScore}</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Conversion Probability</p>
              <p className="text-2xl font-bold text-green-400">{analysis.predictedConversion}%</p>
            </div>
            <TrendingUpIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Best Contact Time</p>
              <p className="text-sm font-medium text-white">{analysis.bestContactTime}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="space-y-4 mb-6">
        <h4 className="text-md font-medium text-white">Key Insights</h4>
        {analysis.insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)}`}
          >
            <div className="flex items-start space-x-3">
              {getInsightIcon(insight.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-white">{insight.title}</h5>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">
                      {insight.confidence}% confidence
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      insight.priority === 'high' ? 'bg-red-600 text-white' :
                      insight.priority === 'medium' ? 'bg-yellow-600 text-white' :
                      'bg-green-600 text-white'
                    }`}>
                      {insight.priority}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-3">{insight.description}</p>
                
                {insight.suggestedActions && insight.suggestedActions.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Suggested Actions:</p>
                    <div className="flex flex-wrap gap-2">
                      {insight.suggestedActions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={() => handleActionClick(action)}
                          className="text-xs px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Approach */}
      <div className="bg-[#161B22] rounded-lg p-4 border border-gray-700 mb-6">
        <h4 className="text-md font-medium text-white mb-2 flex items-center">
          <LightBulbIcon className="h-4 w-4 mr-2 text-yellow-400" />
          Recommended Approach
        </h4>
        <p className="text-sm text-gray-300">{analysis.recommendedApproach}</p>
      </div>

      {/* Market Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
          <h4 className="text-sm font-medium text-white mb-3 flex items-center">
            <UserGroupIcon className="h-4 w-4 mr-2 text-blue-400" />
            Competitor Analysis
          </h4>
          <div className="space-y-2">
            {analysis.competitorAnalysis.map((competitor, index) => (
              <div key={index} className="text-xs text-gray-400 flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                {competitor}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
          <h4 className="text-sm font-medium text-white mb-3 flex items-center">
            <TrendingUpIcon className="h-4 w-4 mr-2 text-green-400" />
            Market Trends
          </h4>
          <div className="space-y-2">
            {analysis.marketTrends.map((trend, index) => (
              <div key={index} className="text-xs text-gray-400 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                {trend}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};