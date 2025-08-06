import React, { useState, useEffect } from 'react';
import { aiService, AIMarketAnalysis } from '../../services/aiService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { 
  ChartBarIcon, 
  TrendingUpIcon, 
  ExclamationTriangleIcon,
  LightBulbIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface AIMarketAnalysisProps {
  industry: string;
  location: string;
}

export const AIMarketAnalysisComponent: React.FC<AIMarketAnalysisProps> = ({ industry, location }) => {
  const [analysis, setAnalysis] = useState<AIMarketAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarketAnalysis();
  }, [industry, location]);

  const loadMarketAnalysis = async () => {
    try {
      setLoading(true);
      const result = await aiService.analyzeMarket(industry, location);
      setAnalysis(result);
    } catch (error) {
      console.error('Market analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-white">Analyzing market trends...</span>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <ChartBarIcon className="h-5 w-5 mr-2 text-blue-400" />
          AI Market Analysis
        </h3>
        <div className="text-sm text-gray-400">
          {industry} • {location}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Trends */}
        <div className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
          <h4 className="text-md font-medium text-white mb-4 flex items-center">
            <TrendingUpIcon className="h-4 w-4 mr-2 text-green-400" />
            Industry Trends
          </h4>
          <div className="space-y-3">
            {analysis.industryTrends.map((trend, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-300">{trend}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor Insights */}
        <div className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
          <h4 className="text-md font-medium text-white mb-4 flex items-center">
            <UserGroupIcon className="h-4 w-4 mr-2 text-blue-400" />
            Competitor Insights
          </h4>
          <div className="space-y-3">
            {analysis.competitorInsights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-300">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Market Opportunities */}
        <div className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
          <h4 className="text-md font-medium text-white mb-4 flex items-center">
            <LightBulbIcon className="h-4 w-4 mr-2 text-yellow-400" />
            Market Opportunities
          </h4>
          <div className="space-y-3">
            {analysis.marketOpportunities.map((opportunity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-300">{opportunity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
          <h4 className="text-md font-medium text-white mb-4 flex items-center">
            <ExclamationTriangleIcon className="h-4 w-4 mr-2 text-red-400" />
            Risk Factors
          </h4>
          <div className="space-y-3">
            {analysis.riskFactors.map((risk, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-300">{risk}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 bg-[#161B22] rounded-lg p-4 border border-gray-700">
        <h4 className="text-md font-medium text-white mb-4 flex items-center">
          <LightBulbIcon className="h-4 w-4 mr-2 text-purple-400" />
          AI Recommendations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.recommendations.map((recommendation, index) => (
            <div key={index} className="p-3 bg-purple-600/10 border border-purple-600/30 rounded-lg">
              <p className="text-sm text-purple-200">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};