import React, { useState, useMemo, useCallback, memo } from 'react';
import { Lead } from '../../types';
import { performanceService } from '../../services/performanceService';
import { ScoreCircle } from '../common/ScoreCircle';
import { StatusBadge } from '../common/StatusBadge';
import {
  EnvelopeIcon,
  PhoneIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface VirtualizedLeadTableProps {
  leads: Lead[];
  onLeadSelect: (leadIds: string[]) => void;
  selectedLeads: string[];
  onSelectLeadForAI?: (leadId: string) => void;
  containerHeight?: number;
}

type SortField = keyof Lead;
type SortDirection = 'asc' | 'desc';

const ITEM_HEIGHT = 72;

const SortIcon = memo(({ field, sortField, sortDirection }: {
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
}) => {
  if (sortField !== field) return null;
  return sortDirection === 'asc'
    ? <ChevronUpIcon className="h-4 w-4 ml-1" />
    : <ChevronDownIcon className="h-4 w-4 ml-1" />;
});
SortIcon.displayName = 'SortIcon';

export const VirtualizedLeadTable: React.FC<VirtualizedLeadTableProps> = memo(({
  leads,
  onLeadSelect,
  selectedLeads,
  onSelectLeadForAI,
  containerHeight = 800
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [sortField, setSortField] = useState<SortField>('companyName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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

  // Fixed: proper bounds calculation
  const { startIndex, endIndex } = useMemo(() => {
    const result = performanceService.calculateVisibleItems(
      scrollTop,
      containerHeight,
      ITEM_HEIGHT,
      sortedLeads.length
    );
    return {
      startIndex: Math.max(0, result.startIndex),
      endIndex: Math.min(sortedLeads.length - 1, result.endIndex)
    };
  }, [scrollTop, containerHeight, sortedLeads.length]);

  const visibleLeads = useMemo(() => {
    if (sortedLeads.length === 0) return [];
    return sortedLeads.slice(startIndex, endIndex + 1);
  }, [sortedLeads, startIndex, endIndex]);

  // Fixed spacer heights - no negative values
  const topSpacerHeight = startIndex * ITEM_HEIGHT;
  const bottomSpacerHeight = Math.max(0, (sortedLeads.length - endIndex - 1) * ITEM_HEIGHT);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const handleSort = useCallback((field: SortField) => {
    setSortField(prev => {
      if (prev === field) {
        setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
        return prev;
      }
      setSortDirection('asc');
      return field;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedLeads.length === leads.length && leads.length > 0) {
      onLeadSelect([]);
    } else {
      onLeadSelect(leads.map(lead => lead.id));
    }
  }, [selectedLeads.length, leads, onLeadSelect]);

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
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`, '_blank');
  }, []);

  const gridCols = onSelectLeadForAI
    ? 'grid-cols-[32px_1fr_1fr_1fr_1fr_52px_88px_80px]'
    : 'grid-cols-[32px_1fr_1fr_1fr_1fr_52px_88px]';

  if (leads.length === 0) {
    return (
      <div className="bg-[#1E2328] rounded-lg border border-gray-700 overflow-hidden">
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No leads found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1E2328] rounded-lg border border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Leads ({leads.length.toLocaleString()})</h3>
        {selectedLeads.length > 0 && (
          <span className="text-sm text-gray-400">{selectedLeads.length} selected</span>
        )}
      </div>

      {/* Table Header */}
      <div className="bg-[#161B22] border-b border-gray-700">
        <div className={`grid gap-4 px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider ${gridCols}`}>
          <div>
            <input
              type="checkbox"
              checked={selectedLeads.length === leads.length && leads.length > 0}
              onChange={handleSelectAll}
              className="rounded border-gray-600 bg-gray-700 text-blue-600"
              aria-label="Select all leads"
            />
          </div>
          {['companyName', 'industry', 'location'].map(field => (
            <div
              key={field}
              className="cursor-pointer hover:text-white transition-colors flex items-center"
              onClick={() => handleSort(field as SortField)}
            >
              {field === 'companyName' ? 'Company' : field.charAt(0).toUpperCase() + field.slice(1)}
              <SortIcon field={field as SortField} sortField={sortField} sortDirection={sortDirection} />
            </div>
          ))}
          <div>Contact</div>
          <div
            className="cursor-pointer hover:text-white transition-colors flex items-center"
            onClick={() => handleSort('score')}
          >
            Score <SortIcon field="score" sortField={sortField} sortDirection={sortDirection} />
          </div>
          <div
            className="cursor-pointer hover:text-white transition-colors flex items-center"
            onClick={() => handleSort('status')}
          >
            Status <SortIcon field="status" sortField={sortField} sortDirection={sortDirection} />
          </div>
          {onSelectLeadForAI && <div>AI</div>}
        </div>
      </div>

      {/* Virtualized Body */}
      <div
        className="overflow-auto"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        {/* Top spacer */}
        {topSpacerHeight > 0 && <div style={{ height: topSpacerHeight }} aria-hidden="true" />}

        {visibleLeads.map((lead) => (
          <div
            key={lead.id}
            className={`grid gap-4 px-6 py-4 border-b border-gray-700 hover:bg-[#262C36] transition-colors ${gridCols}`}
            style={{ height: ITEM_HEIGHT }}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedLeads.includes(lead.id)}
                onChange={() => handleSelectLead(lead.id)}
                className="rounded border-gray-600 bg-gray-700 text-blue-600"
                aria-label={`Select ${lead.companyName}`}
              />
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <div className="text-sm font-medium text-white truncate">{lead.companyName}</div>
              {lead.contactPerson && (
                <div className="text-xs text-gray-400 truncate">{lead.contactPerson}</div>
              )}
            </div>

            <div className="flex items-center min-w-0">
              <div className="text-sm text-white truncate">{lead.industry}</div>
            </div>

            <div className="flex items-center min-w-0">
              <div className="text-sm text-white truncate">{lead.location}</div>
            </div>

            <div className="flex flex-col justify-center min-w-0">
              {lead.email ? (
                <button
                  onClick={() => handleEmailClick(lead.email!, lead.companyName)}
                  className="flex items-center text-xs text-blue-400 hover:text-blue-300 mb-1 text-left"
                >
                  <EnvelopeIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{lead.email}</span>
                </button>
              ) : null}
              {lead.phone ? (
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center text-xs text-blue-400 hover:text-blue-300"
                >
                  <PhoneIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{lead.phone}</span>
                </a>
              ) : null}
              {!lead.email && !lead.phone && (
                <span className="text-xs text-gray-500">No contact</span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <ScoreCircle score={lead.score} size="sm" showLabel={false} />
              <span className="text-xs text-gray-300 font-medium">{lead.score}</span>
            </div>

            <div className="flex items-center">
              <StatusBadge status={lead.status} size="sm" />
            </div>

            {onSelectLeadForAI && (
              <div className="flex items-center">
                <button
                  onClick={() => onSelectLeadForAI(lead.id)}
                  title="Analyze with AI"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-300 bg-purple-900/20 border border-purple-700/30 rounded-md hover:bg-purple-900/40 hover:border-purple-600/50 transition-all duration-200"
                >
                  <SparklesIcon className="h-3 w-3" />
                  <span className="hidden xl:inline">Analyze</span>
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Bottom spacer */}
        {bottomSpacerHeight > 0 && <div style={{ height: bottomSpacerHeight }} aria-hidden="true" />}
      </div>
    </div>
  );
});

VirtualizedLeadTable.displayName = 'VirtualizedLeadTable';
