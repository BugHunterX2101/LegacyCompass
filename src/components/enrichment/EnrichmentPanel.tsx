import React, { useState, useCallback, memo } from 'react';
import { Lead } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ScoreCircle } from '../common/ScoreCircle';
import { enrichLeadWithRealData } from '../../services/realTimeLeadService';
import {
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface EnrichmentPanelProps {
  leads: Lead[];
  onEnrich: (leadId: string, enrichedLead: Lead) => void;
}

type EnrichmentStatusValue = 'idle' | 'enriching' | 'success' | 'error';

interface EnrichmentStatus {
  [leadId: string]: EnrichmentStatusValue;
}

interface EnrichmentResult {
  leadId: string;
  companyName: string;
  fieldsEnriched: string[];
  error?: string;
}

const getEnrichmentScore = (lead: Lead): number => {
  let score = 0;
  if (lead.email) score += 20;
  if (lead.phone) score += 20;
  if (lead.contactPerson) score += 15;
  if (lead.title) score += 10;
  if (lead.socialMedia?.linkedin) score += 15;
  if (lead.socialMedia?.twitter) score += 5;
  if (lead.socialMedia?.facebook) score += 5;
  if (lead.description) score += 10;
  return Math.min(score, 100);
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

export const EnrichmentPanel: React.FC<EnrichmentPanelProps> = memo(({ leads, onEnrich }) => {
  const [enrichmentStatus, setEnrichmentStatus] = useState<EnrichmentStatus>({});
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [bulkEnriching, setBulkEnriching] = useState(false);
  const [enrichmentResults, setEnrichmentResults] = useState<EnrichmentResult[]>([]);

  const handleEnrichSingle = useCallback(async (leadId: string) => {
    setEnrichmentStatus(prev => ({ ...prev, [leadId]: 'enriching' }));

    try {
      const lead = leads.find(l => l.id === leadId);
      if (!lead) throw new Error('Lead not found');

      const enrichedLead = await enrichLeadWithRealData(lead);

      const fieldsEnriched: string[] = [];
      if (!lead.contactPerson && enrichedLead.contactPerson) fieldsEnriched.push(`Contact: ${enrichedLead.contactPerson}`);
      if (!lead.title && enrichedLead.title) fieldsEnriched.push(`Title: ${enrichedLead.title}`);
      if (!lead.email && enrichedLead.email) fieldsEnriched.push(`Email: ${enrichedLead.email}`);
      if (!lead.phone && enrichedLead.phone) fieldsEnriched.push(`Phone: ${enrichedLead.phone}`);
      if (!lead.website && enrichedLead.website) fieldsEnriched.push(`Website: ${enrichedLead.website}`);
      if (!lead.socialMedia?.linkedin && enrichedLead.socialMedia?.linkedin) fieldsEnriched.push(`LinkedIn added`);
      if (!lead.socialMedia?.twitter && enrichedLead.socialMedia?.twitter) fieldsEnriched.push(`Twitter added`);
      if (!lead.description && enrichedLead.description) fieldsEnriched.push('Description added');
      if ((!lead.revenue || lead.revenue === 0) && enrichedLead.revenue && enrichedLead.revenue > 0) fieldsEnriched.push(`Revenue: $${enrichedLead.revenue.toLocaleString()}`);
      if ((!lead.employeeCount || lead.employeeCount <= 1) && enrichedLead.employeeCount > 1) fieldsEnriched.push(`Employees: ${enrichedLead.employeeCount.toLocaleString()}`);

      setEnrichmentResults(prev => [
        { leadId, companyName: lead.companyName, fieldsEnriched },
        ...prev.filter(r => r.leadId !== leadId),
      ]);

      setEnrichmentStatus(prev => ({ ...prev, [leadId]: 'success' }));
      onEnrich(leadId, enrichedLead);
    } catch (error) {
      console.error('[Enrichment] Error enriching lead:', error);
      const msg = error instanceof Error ? error.message : 'Enrichment failed';
      const lead = leads.find(l => l.id === leadId);

      setEnrichmentResults(prev => [
        { leadId, companyName: lead?.companyName || leadId, fieldsEnriched: [], error: msg },
        ...prev.filter(r => r.leadId !== leadId),
      ]);

      setEnrichmentStatus(prev => ({ ...prev, [leadId]: 'error' }));
      // Auto-reset error status after 6s
      setTimeout(() => {
        setEnrichmentStatus(prev => ({ ...prev, [leadId]: 'idle' }));
      }, 6000);
    }
  }, [leads, onEnrich]);

  const handleBulkEnrich = useCallback(async () => {
    if (selectedLeads.length === 0) return;
    setBulkEnriching(true);

    for (const leadId of selectedLeads) {
      await handleEnrichSingle(leadId);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setBulkEnriching(false);
    setSelectedLeads([]);
  }, [selectedLeads, handleEnrichSingle]);

  const handleSelectLead = useCallback((leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    const incompleteIds = leads.filter(l => getEnrichmentScore(l) < 80).map(l => l.id);
    const allSelected = incompleteIds.length > 0 && incompleteIds.every(id => selectedLeads.includes(id));
    setSelectedLeads(allSelected ? [] : incompleteIds);
  }, [leads, selectedLeads]);

  const getStatusIcon = (status: EnrichmentStatusValue) => {
    switch (status) {
      case 'enriching': return <LoadingSpinner size="sm" />;
      case 'success': return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'error': return <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />;
      default: return <SparklesIcon className="h-5 w-5 text-blue-400" />;
    }
  };

  const getStatusText = (status: EnrichmentStatusValue) => {
    switch (status) {
      case 'enriching': return 'Enriching...';
      case 'success': return 'Enriched!';
      case 'error': return 'Failed';
      default: return 'Enrich';
    }
  };

  const incompleteLeads = leads.filter(lead => getEnrichmentScore(lead) < 80);

  return (
    <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
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
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
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

      {/* Enrichment Results */}
      {enrichmentResults.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-green-400 mb-3 flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4" />
            <span>Recently Enriched ({enrichmentResults.length})</span>
          </h4>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {enrichmentResults.map((result) => (
              <div
                key={result.leadId}
                className={`rounded-lg p-4 border ${result.error ? 'bg-red-900/10 border-red-700/30' : 'bg-green-900/20 border-green-700/30'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-white">{result.companyName}</h5>
                  {!result.error && (
                    <span className="text-xs text-green-400 bg-green-900/40 px-2 py-1 rounded">
                      {result.fieldsEnriched.length} fields enriched
                    </span>
                  )}
                </div>
                {result.error ? (
                  <p className="text-xs text-red-400">{result.error}</p>
                ) : result.fieldsEnriched.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.fieldsEnriched.map((field, idx) => (
                      <span key={idx} className="text-xs bg-green-800/30 text-green-300 px-2 py-1 rounded">
                        {field}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-yellow-400">
                    No new data found — all fields may already be filled or AI could not verify new data.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Select */}
      {incompleteLeads.length > 0 && (
        <div className="mb-6 p-4 bg-[#161B22] rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="select-all-enrichment"
                checked={(() => {
                  const ids = leads.filter(l => getEnrichmentScore(l) < 80).map(l => l.id);
                  return ids.length > 0 && ids.every(id => selectedLeads.includes(id));
                })()}
                onChange={handleSelectAll}
                className="rounded border-gray-600 bg-gray-700 text-blue-600"
              />
              <label htmlFor="select-all-enrichment" className="text-sm text-gray-300 cursor-pointer">
                Select all incomplete leads for bulk enrichment
              </label>
            </div>
            <div className="text-sm text-gray-400">{selectedLeads.length} selected</div>
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
            const status: EnrichmentStatusValue = enrichmentStatus[lead.id] || 'idle';

            return (
              <div key={lead.id} className="bg-[#161B22] rounded-lg p-4 border border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                      className="mt-1 rounded border-gray-600 bg-gray-700 text-blue-600"
                      aria-label={`Select ${lead.companyName}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-white truncate">{lead.companyName}</h4>
                        <ScoreCircle score={enrichmentScore} size="sm" showLabel={false} />
                        <span className="text-xs text-gray-400 whitespace-nowrap">{enrichmentScore}% complete</span>
                      </div>
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400 mb-3">
                        <span>{lead.industry}</span>
                        <span>/</span>
                        <span>{lead.location}</span>
                        {lead.contactPerson && <><span>/</span><span>{lead.contactPerson}</span></>}
                      </div>
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Missing information:</p>
                        <div className="flex flex-wrap gap-1">
                          {needs.map((need, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-yellow-600/20 text-yellow-300 rounded">
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
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 ml-4 transition-colors whitespace-nowrap"
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

      <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-300 mb-1">About Lead Enrichment</h4>
            <p className="text-sm text-blue-200/80">
              Enrichment uses AI to find missing contact information, social media profiles, and company
              insights. Requires the backend server to be running with a valid Groq API key.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

EnrichmentPanel.displayName = 'EnrichmentPanel';
