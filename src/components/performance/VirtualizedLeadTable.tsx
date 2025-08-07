import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Lead } from '../../types';
import { performanceService } from '../../services/performanceService';
import { ScoreCircle } from '../common/ScoreCircle';
import { 
  EnvelopeIcon, 
  PhoneIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface VirtualizedLeadTableProps {
  leads: Lead[];
  onLeadSelect: (leadIds: string[]) => void;
  selectedLeads: string[];
  containerHeight?: number;
}

type SortField = keyof Lead;
type SortDirection = 'asc' | 'desc';

const ITEM_HEIGHT = 80; // Height of each row in pixels

export const VirtualizedLeadTable: React.FC<VirtualizedLeadTableProps> = ({ 
  leads, 
  onLeadSelect, 
  selectedLeads,
  containerHeight = 600
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [sortField, setSortField] = useState<SortField>('companyName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Memoized sorted leads for performance
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

  // Calculate visible items using performance service
  const { startIndex, endIndex } = useMemo(() => {
    return performanceService.calculateVisibleItems(
      scrollTop,
      containerHeight,
      ITEM_HEIGHT,
      sortedLeads.length
    );
  }, [scrollTop, containerHeight, sortedLeads.length]);

  // Get visible leads
  const visibleLeads = useMemo(() => {
    return sortedLeads.slice(startIndex, endIndex + 1);
  }, [sortedLeads, startIndex, endIndex]);

  // Debounced scroll handler
  const debouncedScrollHandler = useCallback(
    performanceService.debounce('table-scroll', (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }, 16), // 60fps
    []
  );

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  const handleSelectAll = useCallback(() => {
    if (selectedLeads.length === leads.length) {
      onLeadSelect([]);
    } else {
      onLeadSelect(leads.map(lead => lead.id));
    }
  }, [selectedLeads.length, leads.length, leads, onLeadSelect]);

  const handleSelectLead = useCallback((leadId: string) => {
    if (selectedLeads.includes(leadId)) {
      onLeadSelect(selectedLeads.filter(id => id !== leadId));
    } else {
      onLeadSelect([...selectedLeads, leadId]);
    }
  }, [selectedLeads, onLeadSelect]);

  const handleEmailClick = useCallback((email: string, leadName: string) => {
    const subject = encodeURIComponent(`Partnership Opportunity - ${leadName}`);
    const body = encodeURIComponent(`Hi,\n\nI hope this email finds you well. I'd love to discuss a potential partnership opportunity.\n\nBest regards`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  }, []);

  const getStatusColor = useCallback((status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-600/20 text-blue-300';
      case 'contacted': return 'bg-yellow-600/20 text-yellow-300';
      case 'qualified': return 'bg-green-600/20 text-green-300';
      case 'converted': return 'bg-purple-600/20 text-purple-300';
      case 'rejected': return 'bg-red-600/20 text-red-300';
      default: return 'bg-gray-600/20 text-gray-300';
    }
  }, []);

  const SortIcon: React.FC<{ field: SortField }> = React.memo(({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUpIcon className="h-4 w-4" /> : 
      <ChevronDownIcon className="h-4 w-4" />;
  });

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

      {/* Table Header */}
      <div className="bg-[#161B22] border-b border-gray-700">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
          <div className="col-span-1">
            <input
              type="checkbox"
              checked={selectedLeads.length === leads.length && leads.length > 0}
              onChange={handleSelectAll}
              className="rounded border-gray-600 bg-gray-700 text-blue-600"
            />
          </div>
          <div 
            className="col-span-3 cursor-pointer hover:text-white transition-colors flex items-center"
            onClick={() => handleSort('companyName')}
          >
            Company <SortIcon field="companyName" />
          </div>
          <div 
            className="col-span-2 cursor-pointer hover:text-white transition-colors flex items-center"
            onClick={() => handleSort('industry')}
          >
            Industry <SortIcon field="industry" />
          </div>
          <div className="col-span-2">Contact</div>
          <div 
            className="col-span-2 cursor-pointer hover:text-white transition-colors flex items-center"
            onClick={() => handleSort('location')}
          >
            Location <SortIcon field="location" />
          </div>
          <div 
            className="col-span-1 cursor-pointer hover:text-white transition-colors flex items-center"
            onClick={() => handleSort('score')}
          >
            Score <SortIcon field="score" />
          </div>
          <div 
            className="col-span-1 cursor-pointer hover:text-white transition-colors flex items-center"
            onClick={() => handleSort('status')}
          >
            Status <SortIcon field="status" />
          </div>
        </div>
      </div>

      {/* Virtualized Table Body */}
      <div 
        className="overflow-auto"
        style={{ height: containerHeight }}
        onScroll={debouncedScrollHandler}
      >
        {/* Spacer for items before visible area */}
        <div style={{ height: startIndex * ITEM_HEIGHT }} />
        
        {/* Visible items */}
        <div>
          {visibleLeads.map((lead, index) => (
            <div 
              key={lead.id}
              className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-700 hover:bg-[#262C36] transition-colors"
              style={{ height: ITEM_HEIGHT }}
            >
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={selectedLeads.includes(lead.id)}
                  onChange={() => handleSelectLead(lead.id)}
                  className="rounded border-gray-600 bg-gray-700 text-blue-600"
                />
              </div>
              
              <div className="col-span-3 flex flex-col justify-center">
                <div className="text-sm font-medium text-white truncate">{lead.companyName}</div>
                {lead.contactPerson && (
                  <div className="text-xs text-gray-400 truncate">{lead.contactPerson}</div>
                )}
              </div>
              
              <div className="col-span-2 flex items-center">
                <div className="text-sm text-white truncate">{lead.industry}</div>
              </div>
              
              <div className="col-span-2 flex flex-col justify-center">
                {lead.email && (
                  <button
                    onClick={() => handleEmailClick(lead.email!, lead.companyName)}
                    className="flex items-center text-xs text-blue-400 hover:text-blue-300 mb-1"
                  >
                    <EnvelopeIcon className="h-3 w-3 mr-1" />
                    <span className="truncate">{lead.email}</span>
                  </button>
                )}
                {lead.phone && (
                  <a 
                    href={`tel:${lead.phone}`}
                    className="flex items-center text-xs text-blue-400 hover:text-blue-300"
                  >
                    <PhoneIcon className="h-3 w-3 mr-1" />
                    <span className="truncate">{lead.phone}</span>
                  </a>
                )}
              </div>
              
              <div className="col-span-2 flex items-center">
                <div className="text-sm text-white truncate">{lead.location}</div>
              </div>
              
              <div className="col-span-1 flex items-center justify-center">
                <ScoreCircle score={lead.score} size="sm" showLabel={false} />
              </div>
              
              <div className="col-span-1 flex items-center">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Spacer for items after visible area */}
        <div style={{ height: (sortedLeads.length - endIndex - 1) * ITEM_HEIGHT }} />
      </div>
      
      {leads.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No leads found</div>
        </div>
      )}
    </div>
  );
};