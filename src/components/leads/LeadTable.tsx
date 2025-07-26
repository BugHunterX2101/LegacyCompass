import React, { useState, useMemo } from 'react';
import { Lead } from '../../types';
import { ScoreCircle } from '../common/ScoreCircle';
import { 
  ArrowTopRightOnSquareIcon as ExternalLinkIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface LeadTableProps {
  leads: Lead[];
  onLeadSelect: (leadIds: string[]) => void;
  selectedLeads: string[];
}

type SortField = keyof Lead;
type SortDirection = 'asc' | 'desc';

export const LeadTable: React.FC<LeadTableProps> = ({ 
  leads, 
  onLeadSelect, 
  selectedLeads 
}) => {
  const [sortField, setSortField] = useState<SortField>('companyName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedLeads = useMemo(() => {
    return [...leads].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;
      
      let comparison = 0;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [leads, sortField, sortDirection]);

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      onLeadSelect([]);
    } else {
      onLeadSelect(leads.map(lead => lead.id));
    }
  };

  const handleSelectLead = (leadId: string) => {
    if (selectedLeads.includes(leadId)) {
      onLeadSelect(selectedLeads.filter(id => id !== leadId));
    } else {
      onLeadSelect([...selectedLeads, leadId]);
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const SortIcon: React.FC<{ field: SortField }> = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUpIcon className="h-4 w-4" /> : 
      <ChevronDownIcon className="h-4 w-4" />;
  };

  if (!leads) {
    return (
      <div className="bg-[#1E2328] rounded-lg border border-gray-700 overflow-hidden">
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">Loading leads...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1E2328] rounded-lg border border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Leads ({leads.length})
          </h3>
          <div className="flex items-center space-x-2">
            {selectedLeads.length > 0 && (
              <span className="text-sm text-gray-400">
                {selectedLeads.length} selected
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto table-container">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-[#161B22]">
            <tr>
              <th className="px-6 py-3 text-left">
                <label className="sr-only" htmlFor="select-all">Select all leads</label>
                <input
                  id="select-all"
                  type="checkbox"
                  checked={selectedLeads.length === leads.length && leads.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-600 bg-gray-700 text-blue-600 focus-ring"
                  title="Select all leads"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('companyName')}
              >
                <div className="flex items-center space-x-1">
                  <span>Company</span>
                  <SortIcon field="companyName" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('industry')}
              >
                <div className="flex items-center space-x-1">
                  <span>Industry</span>
                  <SortIcon field="industry" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Contact
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('location')}
              >
                <div className="flex items-center space-x-1">
                  <span>Location</span>
                  <SortIcon field="location" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('employeeCount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Employees</span>
                  <SortIcon field="employeeCount" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('score')}
              >
                <div className="flex items-center space-x-1">
                  <span>Score</span>
                  <SortIcon field="score" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <SortIcon field="status" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Links
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#1E2328] divide-y divide-gray-700">
            {sortedLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-[#262C36] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <label className="sr-only" htmlFor={`select-lead-${lead.id}`}>
                    Select {lead.companyName}
                  </label>
                  <input
                    id={`select-lead-${lead.id}`}
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => handleSelectLead(lead.id)}
                    className="rounded border-gray-600 bg-gray-700 text-blue-600 focus-ring"
                    title={`Select ${lead.companyName}`}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">{lead.companyName}</div>
                    {lead.contactPerson && (
                      <div className="text-sm text-gray-400">{lead.contactPerson}</div>
                    )}
                    {lead.title && (
                      <div className="text-xs text-gray-500">{lead.title}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">{lead.industry || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    {lead.email && (
                      <div className="flex items-center text-sm">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <a 
                          href={`mailto:${lead.email}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors truncate"
                          title={lead.email}
                        >
                          {lead.email}
                        </a>
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center text-sm">
                        <PhoneIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <a 
                          href={`tel:${lead.phone}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title={lead.phone}
                        >
                          {lead.phone}
                        </a>
                      </div>
                    )}
                    {!lead.email && !lead.phone && (
                      <div className="text-sm text-gray-500">No contact info</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">{lead.location || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">
                    {lead.employeeCount ? lead.employeeCount.toLocaleString() : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ScoreCircle score={lead.score} size="sm" showLabel={false} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {lead.website && (
                      <a
                        href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Visit website"
                      >
                        <ExternalLinkIcon className="h-4 w-4" />
                      </a>
                    )}
                    {lead.socialMedia?.linkedin && (
                      <a
                        href={lead.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500 transition-colors"
                        title="View LinkedIn profile"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                    {lead.socialMedia?.twitter && (
                      <a
                        href={lead.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                        title="Twitter"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {leads.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No leads found</div>
        </div>
      )}
    </div>
  )
}