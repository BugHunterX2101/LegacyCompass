import React, { useState } from 'react';
import { Lead } from '../../types';
import { aiService } from '../../services/aiService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { 
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
    
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500 mr-3" />
          AI Email Generator
        </h3>
      </div>

      {/* Email Purpose Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Email Purpose
        </label>
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full px-3 py-2.5 bg-[#0B0F15] border border-slate-600/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
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
          className="w-full flex items-center justify-center px-4 py-3 text-white rounded-xl transition-all duration-200 disabled:opacity-50 hover:brightness-110"
          style={{
            background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
            boxShadow: '0 2px 12px rgba(37, 99, 235, 0.3)',
          }}
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
          <div className="bg-[#0E1218] rounded-xl p-5 border border-slate-700/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-white">Generated Email</h4>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  emailTemplate.tone === 'professional' ? 'bg-blue-500/15 text-blue-300 border border-blue-500/25' :
                  emailTemplate.tone === 'casual' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' :
                  emailTemplate.tone === 'urgent' ? 'bg-red-500/15 text-red-300 border border-red-500/25' :
                  'bg-violet-500/15 text-violet-300 border border-violet-500/25'
                }`}>
                  {emailTemplate.tone}
                </span>
              </div>
            </div>

            {/* Subject Line */}
            <div className="mb-4">
              <label className="block text-xs text-slate-500 mb-1.5">Subject:</label>
              <div className="bg-[#0B0F15] rounded-xl p-3.5 border border-slate-700/30">
                <p className="text-white text-sm font-medium">{emailTemplate.subject}</p>
              </div>
            </div>

            {/* Email Body */}
            <div className="mb-4">
              <label className="block text-xs text-slate-500 mb-1.5">Body:</label>
              <div className="bg-[#0B0F15] rounded-xl p-4 border border-slate-700/30">
                <pre className="text-white text-sm whitespace-pre-wrap font-sans leading-relaxed">
                  {emailTemplate.body}
                </pre>
              </div>
            </div>

            {/* Personalization Points */}
            <div className="mb-4">
              <label className="block text-xs text-slate-500 mb-2">Personalization Used:</label>
              <div className="flex flex-wrap gap-2">
                {emailTemplate.personalization.map((point, index) => (
                  <span
                    key={index}
                    className="text-xs px-2.5 py-1 bg-violet-500/10 text-violet-300 rounded-lg border border-violet-500/20"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center px-3.5 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-600/50 transition-all border border-slate-600/30"
              >
                <ClipboardDocumentIcon className="h-4 w-4 mr-2" />
                {copied ? 'Copied!' : 'Copy Email'}
              </button>

              {(lead.email || lead.gmail) && (
                <button
                  onClick={openEmailClient}
                  className="flex items-center px-3.5 py-2 text-white rounded-lg transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #059669, #10b981)',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                  }}
                >
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Send Email
                </button>
              )}

              <button
                onClick={generateEmail}
                className="flex items-center px-3.5 py-2 text-white rounded-lg transition-all"
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                }}
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                Regenerate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/15 rounded-xl">
        <h4 className="text-sm font-medium text-blue-300 mb-2">AI Email Tips:</h4>
        <ul className="text-sm text-blue-200/70 space-y-1">
          <li>• AI analyzes lead data to create personalized content</li>
          <li>• Email tone adapts to company size and industry</li>
          <li>• Personalization includes company-specific details</li>
          <li>• Multiple variations available for A/B testing</li>
        </ul>
      </div>
    </div>
  );
};
