import React, { useState, useEffect } from 'react';
import { Lead } from '../../types';
import { aiService } from '../../services/aiService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { 
  ChatBubbleLeftRightIcon,
  FaceSmileIcon,
  ExclamationCircleIcon,
  LightBulbIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface ConversationAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  intent: string;
  nextBestAction: string;
  urgency: 'high' | 'medium' | 'low';
  topics: string[];
}

interface ConversationIntelligenceProps {
  lead: Lead;
  messages: string[];
}

export const ConversationIntelligence: React.FC<ConversationIntelligenceProps> = ({ lead, messages }) => {
  const [analysis, setAnalysis] = useState<ConversationAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeConversation();
  }, [messages]);

  const analyzeConversation = async () => {
    try {
      setLoading(true);
      const result = await aiService.analyzeConversation(messages);
      setAnalysis(result);
    } catch (error) {
      console.error('Conversation analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-white">Analyzing conversation...</span>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-600';
      default: return 'bg-blue-600';
    }
  };

  return (
    <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-blue-400" />
          Conversation Intelligence
        </h3>
        <div className="text-sm text-gray-400">{lead.companyName}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sentiment Analysis */}
        <div className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
          <h4 className="text-md font-medium text-white mb-3 flex items-center">
            <FaceSmileIcon className="h-4 w-4 mr-2 text-blue-400" />
            Sentiment
          </h4>
          <div className={`text-2xl font-bold ${getSentimentColor(analysis.sentiment)} capitalize`}>
            {analysis.sentiment}
          </div>
        </div>

        {/* Intent Recognition */}
        <div className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
          <h4 className="text-md font-medium text-white mb-3 flex items-center">
            <ExclamationCircleIcon className="h-4 w-4 mr-2 text-purple-400" />
            Intent
          </h4>
          <div className="text-lg text-gray-300">{analysis.intent}</div>
        </div>

        {/* Urgency Level */}
        <div className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
          <h4 className="text-md font-medium text-white mb-3 flex items-center">
            <ClockIcon className="h-4 w-4 mr-2 text-yellow-400" />
            Urgency
          </h4>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getUrgencyColor(analysis.urgency)}`}>
            {analysis.urgency.toUpperCase()}
          </span>
        </div>

        {/* Next Best Action */}
        <div className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
          <h4 className="text-md font-medium text-white mb-3 flex items-center">
            <LightBulbIcon className="h-4 w-4 mr-2 text-green-400" />
            Next Best Action
          </h4>
          <div className="text-sm text-gray-300">{analysis.nextBestAction}</div>
        </div>
      </div>

      {/* Topics */}
      <div className="mt-6 bg-[#161B22] rounded-lg p-4 border border-gray-700">
        <h4 className="text-md font-medium text-white mb-3">Conversation Topics</h4>
        <div className="flex flex-wrap gap-2">
          {analysis.topics.map((topic, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-600/20 border border-blue-600/30 rounded-full text-sm text-blue-300"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
