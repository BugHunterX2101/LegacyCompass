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
  onEnrich: (leadId: string, enrichedLead: Lead) => void;
}

interface EnrichmentStatus {
  [leadId: string]: 'idle' | 'enriching' | 'success' | 'error';
}

interface EnrichmentResult {
  leadId: string;
  companyName: string;
  fieldsEnriched: string[];
  enrichedLead: Lead;
}

export const EnrichmentPanel: React.FC<EnrichmentPanelProps> = ({ leads, onEnrich }) => {
  const [enrichmentStatus, setEnrichmentStatus] = useState<EnrichmentStatus>({});
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [bulkEnriching, setBulkEnriching] = useState(false);
  const [enrichmentResults, setEnrichmentResults] = useState<EnrichmentResult[]>([]);

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

  const handleEnrichSingle = async (leadId: string) => {
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
      if (!lead.socialMedia?.linkedin && enrichedLead.socialMedia?.linkedin) fieldsEnriched.push(`LinkedIn: ${enrichedLead.socialMedia.linkedin}`);
      if (!lead.socialMedia?.twitter && enrichedLead.socialMedia?.twitter) fieldsEnriched.push(`Twitter: ${enrichedLead.socialMedia.twitter}`);
      if (!lead.description && enrichedLead.description) fieldsEnriched.push('Description added');
      if ((!lead.revenue || lead.revenue === 0) && enrichedLead.revenue && enrichedLead.revenue > 0) fieldsEnriched.push(`Revenue: $${enrichedLead.revenue.toLocaleString()}`);
      if ((!lead.employeeCount || lead.employeeCount <= 1) && enrichedLead.employeeCount && enrichedLead.employeeCount > 1) fieldsEnriched.push(`Employees: ${enrichedLead.employeeCount.toLocaleString()}`);
      setEnrichmentResults(prev => [
        { leadId, companyName: lead.companyName, fieldsEnriched, enrichedLead },
        ...prev.filter(r => r.leadId !== leadId)
      ]);
      setEnrichmentStatus(prev => ({ ...prev, [leadId]: 'success' }));
      onEnrich(leadId, enrichedLead);
    } catch (error) {
      console.error('[Enrichment] Error enriching lead:', error);
      setEnrichmentStatus(prev => ({ ...prev, [leadId]: 'error' }));
      setTimeout(() => {
        setEnrichmentStatus(prev => ({ ...prev, [leadId]: 'idle' }));
      }, 5000);
    }
  };

  const handleBulkEnrich = async () => {
    if (selectedLeads.length === 0) return;
    setBulkEnriching(true);
    for (const leadId of selectedLeads) {
      await handleEnrichSingle(leadId);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setBulkEnriching(false);
    setSelectedLeads([]);
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
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
      case 'enriching': return <LoadingSpinner size="sm" />;
      case 'success': return <CheckCircleIcon className="h-5 w-5 text-emerald-400" />;
      case 'error': return <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />;
      default: return <SparklesIcon className="h-5 w-5 text-blue-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'enriching': return 'Enriching...';
      case 'success': return 'Enriched!';
      case 'error': return 'Failed';
      default: return 'Enrich';
    }
  };

  const incompleteLeads = leads.filter(lead => getEnrichmentScore(lead) < 80);

  return (
    <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-amber-500 to-orange-500 mr-3" />
            Lead Enrichment
          </h3>
          <p className="text-sm text-slate-400 mt-1 ml-4">
            Enhance your leads with additional contact information and insights
          </p>
        </div>
        
        {selectedLeads.length > 0 && (
          <button
            onClick={handleBulkEnrich}
            disabled={bulkEnriching}
            className="flex items-center space-x-2 px-4 py-2.5 text-white rounded-xl disabled:opacity-50 transition-all hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
              boxShadow: '0 2px 10px rgba(37, 99, 235, 0.25)',
            }}
          >
            {bulkEnriching && <LoadingSpinner size="sm" />}
            <SparklesIcon className="h-4 w-4" />
            <span>Enrich Selected ({selectedLeads.length})</span>
          </button>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0E1218] rounded-xl p-5 border border-blue-500/15">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 font-medium">Total Leads</p>
              <p className="text-2xl font-bold text-white mt-1">{leads.length}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/15">
              <InformationCircleIcon className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-[#0E1218] rounded-xl p-5 border border-amber-500/15">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 font-medium">Need Enrichment</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{incompleteLeads.length}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/15">
              <ExclamationTriangleIcon className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-[#0E1218] rounded-xl p-5 border border-emerald-500/15">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 font-medium">Complete Profiles</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{leads.length - incompleteLeads.length}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/15">
              <CheckCircleIcon className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Enrichment Results */}
      {enrichmentResults.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-emerald-400 mb-3 flex items-center space-x-2">
            <CheckCircleIcon className="h-4 w-4" />
            <span>Recently Enriched ({enrichmentResults.length})</span>
          </h4>
          <div className="space-y-3">
            {enrichmentResults.map((result) => (
              <div key={result.leadId} className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-white">{result.companyName}</h5>
                  <span className="text-xs text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {result.fieldsEnriched.length} fields enriched
                  </span>
                </div>
                {result.fieldsEnriched.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.fieldsEnriched.map((field, idx) => (
                      <span key={idx} className="text-xs bg-emerald-500/10 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/15">
                        {field}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-amber-400">No new data found; all fields may already be filled or unverifiable</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {incompleteLeads.length > 0 && (
        <div className="mb-6 p-4 bg-[#0E1218] rounded-xl border border-slate-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedLeads.length === leads.length && leads.length > 0}
                onChange={handleSelectAll}
                className="rounded border-slate-600 bg-slate-700 text-blue-600"
              />
              <span className="text-sm text-slate-300">
                Select all leads for bulk enrichment
              </span>
            </div>
            <div className="text-sm text-slate-500">
              {selectedLeads.length} selected
            </div>
          </div>
        </div>
      )}

      {/* Leads List */}
      <div className="space-y-4">
        {incompleteLeads.length === 0 ? (
          <div className="text-center py-10">
            <div className="p-4 rounded-xl bg-emerald-500/8 inline-block mb-4 border border-emerald-500/15">
              <CheckCircleIcon className="h-10 w-10 text-emerald-400" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">All Leads Enriched!</h4>
            <p className="text-slate-400 text-sm">All your leads have complete information.</p>
          </div>
        ) : (
          incompleteLeads.map((lead) => {
            const enrichmentScore = getEnrichmentScore(lead);
            const needs = getEnrichmentNeeds(lead);
            const status = enrichmentStatus[lead.id] || 'idle';
            
            return (
              <div key={lead.id} className="bg-[#0E1218] rounded-xl p-4 border border-slate-700/30 hover:border-slate-600/40 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                      className="mt-1 rounded border-slate-600 bg-slate-700 text-blue-600"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-white">{lead.companyName}</h4>
                        <ScoreCircle score={enrichmentScore} size="sm" showLabel={false} />
                        <span className="text-xs text-slate-400">
                          {enrichmentScore}% complete
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                        <span>{lead.industry}</span>
                        <span className="text-slate-600">/</span>
                        <span>{lead.location}</span>
                        {lead.contactPerson && (
                          <>
                            <span className="text-slate-600">/</span>
                            <span>{lead.contactPerson}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-xs text-slate-600 mb-1.5">Missing information:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {needs.map((need, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs bg-amber-500/10 text-amber-300 rounded-md border border-amber-500/15"
                            >
                              {need}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="w-full bg-slate-800/50 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${enrichmentScore}%`, boxShadow: '0 0 6px rgba(245,158,11,0.3)' }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleEnrichSingle(lead.id)}
                    disabled={status === 'enriching'}
                    className="flex items-center space-x-2 px-3.5 py-2 text-white rounded-lg disabled:opacity-50 ml-4 transition-all hover:brightness-110"
                    style={{
                      background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                      boxShadow: '0 1px 6px rgba(37, 99, 235, 0.2)',
                    }}
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
      <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/15 rounded-xl">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-300 mb-1">About Lead Enrichment</h4>
            <p className="text-sm text-blue-200/70 leading-relaxed">
              Enrichment adds missing contact information, social media profiles, and company insights 
              to help you better qualify and reach out to your leads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
