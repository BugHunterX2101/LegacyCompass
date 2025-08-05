import React, { useState } from 'react';
import { Lead } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ScoreCircle } from '../common/ScoreCircle';
import { enrichLeadWithRealData } from '../../services/realTimeLeadService';
import { 
  SparklesIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface EnrichmentPanelProps {
  leads: Lead[];
  onEnrich: (leadId: string) => void;
}

interface EnrichmentStatus {
  [leadId: string]: 'idle' | 'enriching' | 'success' | 'error';
}

export const EnrichmentPanel: React.FC<EnrichmentPanelProps> = ({ leads, onEnrich }) => {
  const [enrichmentStatus, setEnrichmentStatus] = useState<EnrichmentStatus>({});
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [bulkEnriching, setBulkEnriching] = useState(false);

  const getEnrichmentScore = (lead: Lead): number => {
    let score = 0;
    const maxScore = 100;
    
    if (lead.email) score += 20;
    if (lead.phone) score += 20;
    if (lead.contactPerson) score += 15;
    if (lead.title) score += 10;
    if (lead.socialMedia?.linkedin) score += 15;
    if (lead.socialMedia?.twitter) score += 5;
    if (lead.socialMedia?.facebook) score += 5;
    if (lead.description) score += 10;
    
    return Math.min(score, maxScore);
  };

  const getEnrichmentNeeds = (lead: Lead): string[] => {
    const needs: string[] = [];
    
    if (!lead.email) needs.push('Email address');
    if (!lead.phone) needs.push('Phone number');
    if (!lead.contactPerson) needs.push('Contact person');
    if (!lead.title) needs.push('Job title');
    if (!lead.socialMedia?.linkedin) needs.push('LinkedIn profile');
    if (!lead.description) needs.push('Company description');
    
    return needs;
  };

  const handleEnrichSingle = async (leadId: string) => {
    setEnrichmentStatus(prev => ({ ...prev, [leadId]: 'enriching' }));
    
    try {
      const lead = leads.find(l => l.id === leadId);
      if (!lead) throw new Error('Lead not found');
      
      await enrichLeadWithRealData(lead);
      setEnrichmentStatus(prev => ({ ...prev, [leadId]: 'success' }));
      onEnrich(leadId);
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setEnrichmentStatus(prev => ({ ...prev, [leadId]: 'idle' }));
      }, 3000);
      
    } catch (error) {
      setEnrichmentStatus(prev => ({ ...prev, [leadId]: 'error' }));
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setEnrichmentStatus(prev => ({ ...prev, [leadId]: 'idle' }));
      }, 3000);
    }
  };

  const handleBulkEnrich = async () => {
    if (selectedLeads.length === 0) return;
    
    setBulkEnriching(true);
    
    for (const leadId of selectedLeads) {
      await handleEnrichSingle(leadId);
      // Add delay between enrichments to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setBulkEnriching(false);
    setSelectedLeads([]);
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead.id));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'enriching':
        return <LoadingSpinner size="sm" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />;
      default:
        return <SparklesIcon className="h-5 w-5 text-blue-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'enriching':
        return 'Enriching...';
      case 'success':
        return 'Enriched!';
      case 'error':
        return 'Failed';
      default:
        return 'Enrich';
    }
  };

  const incompleteLeads = leads.filter(lead => getEnrichmentScore(lead) < 80);

  return (
    <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Lead Enrichment</h3>
          <p className="text-sm text-gray-400 mt-1">
            Enhance your leads with additional contact information and insights
          </p>
        </div>
        
        {selectedLeads.length > 0 && (
          <button
            onClick={handleBulkEnrich}
            disabled={bulkEnriching}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {bulkEnriching && <LoadingSpinner size="sm" />}
            <SparklesIcon className="h-4 w-4" />
            <span>Enrich Selected ({selectedLeads.length})</span>
          </button>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Leads</p>
              <p className="text-2xl font-semibold text-white">{leads.length}</p>
            </div>
            <InformationCircleIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Need Enrichment</p>
              <p className="text-2xl font-semibold text-yellow-400">{incompleteLeads.length}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Complete Profiles</p>
              <p className="text-2xl font-semibold text-green-400">{leads.length - incompleteLeads.length}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {incompleteLeads.length > 0 && (
        <div className="mb-6 p-4 bg-[#161B22] rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedLeads.length === leads.length && leads.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-600 bg-gray-700 text-blue-600"
              />
              <span className="text-sm text-gray-300">
                Select all leads for bulk enrichment
              </span>
            </div>
            <div className="text-sm text-gray-400">
              {selectedLeads.length} selected
            </div>
          </div>
        </div>
      )}

      {/* Leads List */}
      <div className="space-y-4">
        {incompleteLeads.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-white mb-2">All Leads Enriched!</h4>
            <p className="text-gray-400">All your leads have complete information.</p>
          </div>
        ) : (
          incompleteLeads.map((lead) => {
            const enrichmentScore = getEnrichmentScore(lead);
            const needs = getEnrichmentNeeds(lead);
            const status = enrichmentStatus[lead.id] || 'idle';
            
            return (
              <div key={lead.id} className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                      className="mt-1 rounded border-gray-600 bg-gray-700 text-blue-600"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-white">{lead.companyName}</h4>
                        <ScoreCircle score={enrichmentScore} size="sm" showLabel={false} />
                        <span className="text-xs text-gray-400">
                          {enrichmentScore}% complete
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        <span>{lead.industry}</span>
                        <span>•</span>
                        <span>{lead.location}</span>
                        {lead.contactPerson && (
                          <>
                            <span>•</span>
                            <span>{lead.contactPerson}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Missing information:</p>
                        <div className="flex flex-wrap gap-1">
                          {needs.map((need, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs bg-yellow-600/20 text-yellow-300 rounded"
                            >
                              {need}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${enrichmentScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleEnrichSingle(lead.id)}
                    disabled={status === 'enriching'}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 ml-4"
                  >
                    {getStatusIcon(status)}
                    <span className="text-sm">{getStatusText(status)}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Enrichment Info */}
      <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-300 mb-1">About Lead Enrichment</h4>
            <p className="text-sm text-blue-200/80">
              Enrichment adds missing contact information, social media profiles, and company insights 
              to help you better qualify and reach out to your leads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};