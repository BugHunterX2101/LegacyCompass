import React, { useState, useCallback } from 'react';
import { Lead } from '../../types';
import { aiService } from '../../services/aiService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { 
  ChatBubbleLeftRightIcon,
  FaceSmileIcon,
  ExclamationCircleIcon,
  LightBulbIcon,
  ClockIcon,
  PlusIcon,
  XMarkIcon,
  SparklesIcon,
  ExclamationTriangleIcon
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
  messages?: string[];
}

const STARTER_TEMPLATES = [
  "Hi, I saw your product online and I'm interested in learning more about pricing.",
  "We're currently evaluating several vendors and comparing features.",
  "I need this implemented before end of quarter. Can you do that?",
  "Your competitor is offering a 30% discount. Can you match that?",
  "We had a bad experience with our current vendor and are looking to switch.",
];

export const ConversationIntelligence: React.FC<ConversationIntelligenceProps> = ({ lead }) => {
  const [analysis, setAnalysis] = useState<ConversationAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const addMessage = () => {
    const trimmed = currentMessage.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, trimmed]);
    setCurrentMessage('');
    setAnalysis(null);
  };

  const removeMessage = (index: number) => {
    setMessages(prev => prev.filter((_, i) => i !== index));
    setAnalysis(null);
  };

  const addTemplate = (template: string) => {
    setMessages(prev => [...prev, template]);
    setAnalysis(null);
  };

  const analyzeConversation = useCallback(async () => {
    if (messages.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      const result = await aiService.analyzeConversation(messages);
      setAnalysis(result);
    } catch (err) {
      console.error('Conversation analysis error:', err);
      setError('Failed to analyze conversation. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [messages]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-900/20 border-green-700/30';
      case 'negative': return 'bg-red-900/20 border-red-700/30';
      default: return 'bg-yellow-900/20 border-yellow-700/30';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-900/30 border border-red-700/40 text-red-300';
      case 'medium': return 'bg-yellow-900/30 border border-yellow-700/40 text-yellow-300';
      default: return 'bg-blue-900/30 border border-blue-700/40 text-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-white flex items-center">
            <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2 text-blue-400" />
            Conversation Intelligence
          </h2>
          <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
            Powered by Groq AI
          </span>
        </div>
        <p className="text-sm text-gray-400">
          {lead.companyName} &bull; {lead.industry} &bull; {lead.location}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Input Panel */}
        <div className="space-y-4">
          <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
            <h3 className="text-base font-semibold text-white mb-4">Conversation Messages</h3>

            {/* Existing messages */}
            {messages.length > 0 && (
              <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div key={index} className="flex items-start space-x-2 p-3 bg-[#161B22] rounded-lg border border-gray-700">
                    <span className="text-xs text-gray-500 mt-0.5 flex-shrink-0">#{index + 1}</span>
                    <p className="text-sm text-gray-300 flex-1">{msg}</p>
                    <button
                      onClick={() => removeMessage(index)}
                      className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new message */}
            <div className="space-y-2">
              <textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addMessage();
                  }
                }}
                placeholder="Type a message from the prospect or conversation..."
                className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                rows={3}
              />
              <button
                onClick={addMessage}
                disabled={!currentMessage.trim()}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-40 transition-colors text-sm"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Message
              </button>
            </div>
          </div>

          {/* Templates */}
          <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Quick Add Examples</h4>
            <div className="space-y-2">
              {STARTER_TEMPLATES.map((template, i) => (
                <button
                  key={i}
                  onClick={() => addTemplate(template)}
                  className="w-full text-left p-2 text-xs text-gray-400 hover:text-white hover:bg-[#161B22] rounded border border-transparent hover:border-gray-700 transition-all"
                >
                  "{template.slice(0, 70)}{template.length > 70 ? '…' : ''}"
                </button>
              ))}
            </div>
          </div>

          {/* Analyze button */}
          <button
            onClick={analyzeConversation}
            disabled={messages.length === 0 || loading}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Analyzing conversation...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4 mr-2" />
                Analyze Conversation ({messages.length} message{messages.length !== 1 ? 's' : ''})
              </>
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-4 w-4 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        <div className="space-y-4">
          {!analysis && !loading && (
            <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6 flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Add conversation messages and click Analyze to get AI intelligence</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6 flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="text-white mt-3 text-sm">Analyzing {messages.length} message{messages.length !== 1 ? 's' : ''}...</p>
              </div>
            </div>
          )}

          {analysis && !loading && (
            <>
              {/* Sentiment */}
              <div className={`bg-[#1E2328] rounded-lg border p-5 ${getSentimentBg(analysis.sentiment)}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <FaceSmileIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-400 font-medium">Sentiment</span>
                </div>
                <div className={`text-2xl font-bold capitalize ${getSentimentColor(analysis.sentiment)}`}>
                  {analysis.sentiment}
                </div>
              </div>

              {/* Intent & Urgency */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ExclamationCircleIcon className="h-4 w-4 text-purple-400" />
                    <span className="text-xs text-gray-400 font-medium">Intent</span>
                  </div>
                  <div className="text-sm text-white font-medium">{analysis.intent}</div>
                </div>
                <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ClockIcon className="h-4 w-4 text-yellow-400" />
                    <span className="text-xs text-gray-400 font-medium">Urgency</span>
                  </div>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(analysis.urgency)}`}>
                    {analysis.urgency.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Next Best Action */}
              <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-5">
                <div className="flex items-center space-x-2 mb-2">
                  <LightBulbIcon className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-gray-400 font-medium">Next Best Action</span>
                </div>
                <p className="text-white text-sm">{analysis.nextBestAction}</p>
              </div>

              {/* Topics */}
              <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-5">
                <h4 className="text-sm text-gray-400 font-medium mb-3">Key Topics</h4>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};
