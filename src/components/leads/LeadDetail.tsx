import React, { useState } from 'react';
import { 
  XMarkIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  BuildingOfficeIcon,
  UserIcon,
  MapPinIcon,
  GlobeAltIcon,
  ChartBarIcon,
  CalendarIcon,
  TagIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { Lead } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ScoreCircle } from '../common/ScoreCircle';
import { AIInsightsPanel } from '../ai/AIInsightsPanel';
import { AIEmailGenerator } from '../ai/AIEmailGenerator';

interface LeadDetailProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: (updatedLead: Lead) => void;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onClose, onUpdate }) => {
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showEmailGenerator, setShowEmailGenerator] = useState(false);
  const [notes, setNotes] = useState(lead.notes || '');
  const [status, setStatus] = useState(lead.status);

  const handleStatusChange = (newStatus: Lead['status']) => {
    setStatus(newStatus);
    const updatedLead = { ...lead, status: newStatus };
    onUpdate(updatedLead);
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    const updatedLead = { ...lead, notes: newNotes };
    onUpdate(updatedLead);
  };

  const handleEmailClick = () => {
    if (lead.email) {
      window.open(`mailto:${lead.email}?subject=Partnership Opportunity with ${lead.company}`);
    }
  };

  const handlePhoneClick = () => {
    if (lead.phone) {
      window.open(`tel:${lead.phone}`);
    }
  };

  const handleWebsiteClick = () => {
    if (lead.website) {
      window.open(lead.website, '_blank');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-start p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <ScoreCircle score={lead.score} size="lg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.company}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">{lead.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">{lead.title}</p>
                <div className="mt-2">
                  <StatusBadge status={status} />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Contact Information
                </h3>
                
                <div className="space-y-3">
                  {lead.email && (
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <button
                        onClick={handleEmailClick}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {lead.email}
                      </button>
                    </div>
                  )}
                  
                  {lead.phone && (
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                      <button
                        onClick={handlePhoneClick}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {lead.phone}
                      </button>
                    </div>
                  )}
                  
                  {lead.location && (
                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{lead.location}</span>
                    </div>
                  )}
                  
                  {lead.website && (
                    <div className="flex items-center space-x-3">
                      <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                      <button
                        onClick={handleWebsiteClick}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {lead.website}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2 text-green-500" />
                  Company Details
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <TagIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{lead.industry}</span>
                  </div>
                  
                  {lead.revenue && (
                    <div className="flex items-center space-x-3">
                      <ChartBarIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        ${lead.revenue.toLocaleString()} revenue
                      </span>
                    </div>
                  )}
                  
                  {lead.employees && (
                    <div className="flex items-center space-x-3">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {lead.employees} employees
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Added {new Date(lead.dateAdded).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Update */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Status</h3>
              <div className="flex space-x-2">
                {(['new', 'contacted', 'qualified', 'proposal', 'closed'] as const).map((statusOption) => (
                  <button
                    key={statusOption}
                    onClick={() => handleStatusChange(statusOption)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      status === statusOption
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Add notes about this lead..."
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAIInsights(true)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
                AI Insights
              </button>
              
              <button
                onClick={() => setShowEmailGenerator(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                Generate Email
              </button>
              
              {lead.email && (
                <button
                  onClick={handleEmailClick}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  Send Email
                </button>
              )}
              
              {lead.phone && (
                <button
                  onClick={handlePhoneClick}
                  className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  Call
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Modal */}
      {showAIInsights && (
        <AIInsightsPanel
          lead={lead}
          onClose={() => setShowAIInsights(false)}
        />
      )}

      {/* Email Generator Modal */}
      {showEmailGenerator && (
        <AIEmailGenerator
          lead={lead}
          onClose={() => setShowEmailGenerator(false)}
        />
      )}
    </>
  );
};