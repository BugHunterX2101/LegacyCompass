import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getSearchSuggestions } from '../../data/searchSuggestions';

// Define a type for filters
interface LeadFiltersType {
  scoreRange: [number, number];
  industries: string[];
  companySizes: string[];
  statuses: string[];
  sources: string[];
  dateRange: [string, string];
}

interface LeadFiltersProps {
  filters: LeadFiltersType;
  onFiltersChange: (filters: LeadFiltersType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onToggle 
}) => {
  const industries = getSearchSuggestions('industries') || [];
  const companySizes = getSearchSuggestions('companySizes') || [];
  const sources = getSearchSuggestions('sources') || [];

  // Only use statuses supported by Lead type
  const statuses = [
    'new', 'qualified', 'contacted', 'converted', 'rejected'
  ];

  const handleFilterChange = (key: keyof LeadFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  if (!isOpen) return null;

  return (
    <div className="bg-[#1E2328] border border-gray-700 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white" id="filters-title">Filters</h3>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors"
          title="Close filters"
          aria-label="Close filters"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Score Range */}
        <div>
          <label htmlFor="score-min" className="block text-sm font-medium text-gray-300 mb-2">
            Score Range
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="score-min"
              type="number"
              min="0"
              max="100"
              value={filters.scoreRange[0]}
              onChange={(e) => handleFilterChange('scoreRange', [
                parseInt(e.target.value) || 0,
                filters.scoreRange[1]
              ])}
              className="w-16 px-2 py-1 bg-[#0D1117] border border-gray-600 rounded text-white text-sm"
              placeholder="Min"
              title="Minimum score"
              aria-label="Minimum score"
            />
            <span className="text-gray-400">-</span>
            <input
              id="score-max"
              type="number"
              min="0"
              max="100"
              value={filters.scoreRange[1]}
              onChange={(e) => handleFilterChange('scoreRange', [
                filters.scoreRange[0],
                parseInt(e.target.value) || 100
              ])}
              className="w-16 px-2 py-1 bg-[#0D1117] border border-gray-600 rounded text-white text-sm"
              placeholder="Max"
              title="Maximum score"
              aria-label="Maximum score"
            />
          </div>
        </div>

        {/* Industries */}
        <div>
          <label htmlFor="industries-select" className="block text-sm font-medium text-gray-300 mb-2">
            Industries
          </label>
          <select
            id="industries-select"
            multiple
            value={filters.industries}
            onChange={(e) => handleFilterChange('industries', 
              Array.from(e.target.selectedOptions, option => option.value)
            )}
            className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white text-sm"
            size={4}
            aria-label="Industries"
          >
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        {/* Company Sizes */}
        <div>
          <label htmlFor="company-sizes-select" className="block text-sm font-medium text-gray-300 mb-2">
            Company Size
          </label>
          <select
            id="company-sizes-select"
            multiple
            value={filters.companySizes}
            onChange={(e) => handleFilterChange('companySizes', 
              Array.from(e.target.selectedOptions, option => option.value)
            )}
            className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white text-sm"
            size={4}
            aria-label="Company sizes"
          >
            {companySizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* Statuses */}
        <div>
          <label htmlFor="statuses-select" className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select
            id="statuses-select"
            multiple
            value={filters.statuses}
            onChange={(e) => handleFilterChange('statuses', 
              Array.from(e.target.selectedOptions, option => option.value)
            )}
            className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white text-sm"
            size={4}
            aria-label="Statuses"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Sources */}
        <div>
          <label htmlFor="sources-select" className="block text-sm font-medium text-gray-300 mb-2">
            Source
          </label>
          <select
            id="sources-select"
            multiple
            value={filters.sources}
            onChange={(e) => handleFilterChange('sources', 
              Array.from(e.target.selectedOptions, option => option.value)
            )}
            className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white text-sm"
            size={4}
            aria-label="Sources"
          >
            {sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label htmlFor="date-range-start" className="block text-sm font-medium text-gray-300 mb-2">
            Date Range
          </label>
          <div className="space-y-2">
            <input
              id="date-range-start"
              type="date"
              value={filters.dateRange[0]}
              onChange={(e) => handleFilterChange('dateRange', [
                e.target.value,
                filters.dateRange[1]
              ])}
              className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white text-sm"
              title="Start date"
              aria-label="Start date"
            />
            <input
              id="date-range-end"
              type="date"
              value={filters.dateRange[1]}
              onChange={(e) => handleFilterChange('dateRange', [
                filters.dateRange[0],
                e.target.value
              ])}
              className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white text-sm"
              title="End date"
              aria-label="End date"
            />
          </div>
        </div>
      </div>
    </div>
  );
};