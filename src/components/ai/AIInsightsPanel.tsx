import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  LightBulbIcon, 
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Lead } from '../../types';
import { aiService } from '../../services/aiService';

interface AIInsightsPanelProps {
  lead: Lead;
  onClose: () => void;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ lead, onClose }) => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateInsights = async () => {
      try {
        setLoading(true);
        const aiInsights = await aiService.generateLeadInsights(lead);
        setInsights(aiInsights);
      } catch (error) {
        console.error('Failed to generate AI insights:', error);
      } finally {
        setLoading(false);
      }
    };

    generateInsights();
  }, [lead]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <LightBulbIcon className="h-6 w-6 mr-2 text-yellow-500" />
            AI Insights for {lead.company}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {insights && (
          <div className="space-y-6">
            {/* Lead Score Analysis */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
                Lead Score Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {insights.leadScore}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {insights.conversionProbability}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Probability</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {insights.timeToClose} days
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Est. Time to Close</div>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <LightBulbIcon className="h-5 w-5 mr-2 text-yellow-500" />
                Key Insights
              </h3>
              <div className="space-y-3">
                {insights.keyInsights.map((insight: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-green-500" />
                Recommendations
              </h3>
              <div className="space-y-3">
                {insights.recommendations.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Factors */}
            {insights.riskFactors && insights.riskFactors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-red-500" />
                  Risk Factors
                </h3>
                <div className="space-y-3">
                  {insights.riskFactors.map((risk: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-blue-500" />
                Suggested Next Steps
              </h3>
              <div className="space-y-3">
                {insights.nextSteps.map((step: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};