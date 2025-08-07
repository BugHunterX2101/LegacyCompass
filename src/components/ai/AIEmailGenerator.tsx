import React, { useState } from 'react';
import { Lead } from '../../types';
import { aiService } from '../../services/aiService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { 
  EnvelopeIcon, 
  SparklesIcon, 
  ClipboardDocumentIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

interface AIEmailTemplate {
  subject: string;
  body: string;
  tone: 'professional' | 'casual' | 'urgent' | 'friendly';
  personalization: string[];
}

interface AIEmailGeneratorProps {
  lead: Lead;
  onEmailGenerated?: (email: AIEmailTemplate) => void;
}

export const AIEmailGenerator: React.FC<AIEmailGeneratorProps> = ({ lead, onEmailGenerated }) => {
  const [emailTemplate, setEmailTemplate] = useState<AIEmailTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [purpose, setPurpose] = useState('introduction');
  const [copied, setCopied] = useState(false);

  const purposes = [
    { value: 'introduction', label: 'Introduction Email' },
    { value: 'followup', label: 'Follow-up Email' },
    { value: 'demo', label: 'Demo Request' },
    { value: 'proposal', label: 'Proposal Email' },
    { value: 'nurture', label: 'Nurture Email' }
  ];

  const generateEmail = async () => {
    try {
      setLoading(true);
      const template = await aiService.generatePersonalizedEmail(lead, purpose);
      setEmailTemplate(template);
      onEmailGenerated?.(template);
    } catch (error) {
      console.error('Email generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!emailTemplate) return;
    
    const emailContent = `Subject: ${emailTemplate.subject}\n\n${emailTemplate.body}`;
    
    try {
      await navigator.clipboard.writeText(emailContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const openEmailClient = () => {
    if (!emailTemplate) return;
    
    const subject = encodeURIComponent(emailTemplate.subject);
    const body = encodeURIComponent(emailTemplate.body);
    const email = lead.email || lead.gmail || '';
    
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  return (
    <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2 text-blue-400" />
          AI Email Generator
        </h3>
      </div>

      {/* Email Purpose Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Purpose
        </label>
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {purposes.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Generate Button */}
      <div className="mb-6">
        <button
          onClick={generateEmail}
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Generating AI Email...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="h-4 w-4 mr-2" />
              Generate Personalized Email
            </>
          )}
        </button>
      </div>

      {/* Generated Email */}
      {emailTemplate && (
        <div className="space-y-4">
          <div className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-white">Generated Email</h4>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  emailTemplate.tone === 'professional' ? 'bg-blue-600 text-white' :
                  emailTemplate.tone === 'casual' ? 'bg-green-600 text-white' :
                  emailTemplate.tone === 'urgent' ? 'bg-red-600 text-white' :
                  'bg-purple-600 text-white'
                }`}>
                  {emailTemplate.tone}
                </span>
              </div>
            </div>

            {/* Subject Line */}
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">Subject:</label>
              <div className="bg-[#0D1117] rounded p-3 border border-gray-600">
                <p className="text-white text-sm font-medium">{emailTemplate.subject}</p>
              </div>
            </div>

            {/* Email Body */}
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">Body:</label>
              <div className="bg-[#0D1117] rounded p-3 border border-gray-600">
                <pre className="text-white text-sm whitespace-pre-wrap font-sans">
                  {emailTemplate.body}
                </pre>
              </div>
            </div>

            {/* Personalization Points */}
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-2">Personalization Used:</label>
              <div className="flex flex-wrap gap-2">
                {emailTemplate.personalization.map((point, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={copyToClipboard}
                className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <ClipboardDocumentIcon className="h-4 w-4 mr-2" />
                {copied ? 'Copied!' : 'Copy Email'}
              </button>

              {(lead.email || lead.gmail) && (
                <button
                  onClick={openEmailClient}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Send Email
                </button>
              )}

              <button
                onClick={generateEmail}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                Regenerate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
        <h4 className="text-sm font-medium text-blue-300 mb-2">AI Email Tips:</h4>
        <ul className="text-sm text-blue-200/80 space-y-1">
          <li>• AI analyzes lead data to create personalized content</li>
          <li>• Email tone adapts to company size and industry</li>
          <li>• Personalization includes company-specific details</li>
          <li>• Multiple variations available for A/B testing</li>
        </ul>
      </div>
    </div>
  );
};