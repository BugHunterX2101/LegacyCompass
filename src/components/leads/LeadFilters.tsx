import React from 'react';
import { FilterOptions } from '../../types';
import { Filter, X } from 'lucide-react';
import { getSearchSuggestions } from '../../data/searchSuggestions';

interface LeadFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onToggle 
}) => {
  const industries = getSearchSuggestions('industries');
  const companySizes = getSearchSuggestions('companySizes');
  const sources = getSearchSuggestions('sources');

  const statuses = [
    'new', 'qualified', 'unqualified', 'contacted', 'converted'
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filters
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Score Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Score Range
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="0"
              max="100"
              value={filters.scoreRange[0]}
              onChange={(e) => handleFilterChange('scoreRange', [
                parseInt(e.target.value) || 0,
                filters.scoreRange[1]
              ])}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              min="0"
              max="100"
              value={filters.scoreRange[1]}
              onChange={(e) => handleFilterChange('scoreRange', [
                filters.scoreRange[0],
                parseInt(e.target.value) || 100
              ])}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>

        {/* Industries */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industries
          </label>
          <select
            multiple
            value={filters.industries}
            onChange={(e) => handleFilterChange('industries', 
              Array.from(e.target.selectedOptions, option => option.value)
            )}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            size={4}
          >
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        {/* Company Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Size
          </label>
          <select
            multiple
            value={filters.companySizes}
            onChange={(e) => handleFilterChange('companySizes', 
              Array.from(e.target.selectedOptions, option => option.value)
            )}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            size={4}
          >
            {companySizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* Statuses */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            multiple
            value={filters.statuses}
            onChange={(e) => handleFilterChange('statuses', 
              Array.from(e.target.selectedOptions, option => option.value)
            )}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            size={4}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Source
          </label>
          <select
            multiple
            value={filters.sources}
            onChange={(e) => handleFilterChange('sources', 
              Array.from(e.target.selectedOptions, option => option.value)
            )}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            size={4}
          >
            {sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.dateRange[0]}
              onChange={(e) => handleFilterChange('dateRange', [
                e.target.value,
                filters.dateRange[1]
              ])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="date"
              value={filters.dateRange[1]}
              onChange={(e) => handleFilterChange('dateRange', [
                filters.dateRange[0],
                e.target.value
              ])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};