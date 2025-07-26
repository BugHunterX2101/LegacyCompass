import React, { useState, useEffect } from 'react';
import { SearchFilter } from '../../types';
import { SearchDropdown } from '../common/SearchDropdown';
import { MagnifyingGlassIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilter[], query: string) => void;
  onResultsCount: (count: number) => void;
}

const filterFields = [
  { value: 'companyName', label: 'Company Name' },
  { value: 'industry', label: 'Industry' },
  { value: 'location', label: 'Location' },
  { value: 'employeeCount', label: 'Employee Count' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'score', label: 'Score' },
  { value: 'status', label: 'Status' },
  { value: 'contactPerson', label: 'Contact Person' }
];

const operators = [
  { value: 'equals', label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater', label: 'Greater than' },
  { value: 'less', label: 'Less than' },
  { value: 'between', label: 'Between' }
];

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
  'Education', 'Real Estate', 'Consulting', 'Marketing', 'Legal',
  'Automotive', 'Energy', 'Telecommunications', 'Media', 'Transportation'
];

const locations = [
  'New York, NY', 'San Francisco, CA', 'Los Angeles, CA', 'Chicago, IL',
  'Boston, MA', 'Seattle, WA', 'Austin, TX', 'Denver, CO', 'Miami, FL',
  'Atlanta, GA', 'Dallas, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'Detroit, MI'
];

const statuses = ['new', 'contacted', 'qualified', 'converted', 'rejected'];

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch, onResultsCount }) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    onSearch(filters, query);
    onResultsCount(0); // Add default call to onResultsCount
  }, [filters, query, onSearch, onResultsCount]);

  const addFilter = () => {
    const newFilter: SearchFilter = {
      field: 'companyName',
      operator: 'contains',
      value: '',
      label: 'Company Name contains'
    };
    setFilters([...filters, newFilter]);
    setIsExpanded(true);
  };

  const updateFilter = (index: number, updates: Partial<SearchFilter>) => {
    const updatedFilters = filters.map((filter, i) => {
      if (i === index) {
        const updatedFilter = { ...filter, ...updates };
        // Update label when field or operator changes
        if (updates.field || updates.operator) {
          const fieldLabel = filterFields.find(f => f.value === updatedFilter.field)?.label || updatedFilter.field;
          const operatorLabel = operators.find(o => o.value === updatedFilter.operator)?.label || updatedFilter.operator;
          updatedFilter.label = `${fieldLabel} ${operatorLabel.toLowerCase()}`;
        }
        return updatedFilter;
      }
      return filter;
    });
    setFilters(updatedFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const getSuggestions = (field: string): string[] => {
    switch (field) {
      case 'industry': return industries;
      case 'location': return locations;
      case 'status': return statuses;
      default: return [];
    }
  };

  const getInputType = (field: string): string => {
    switch (field) {
      case 'employeeCount':
      case 'revenue':
      case 'score':
        return 'number';
      default:
        return 'text';
    }
  };

  const clearAllFilters = () => {
    setFilters([]);
    setQuery('');
  };

  return (
    <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Search & Filter</h3>
        <div className="flex items-center space-x-2">
          {(filters.length > 0 || query) && (
            <button
              onClick={clearAllFilters}
              className="text-gray-400 hover:text-white text-sm"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            {isExpanded ? 'Simple Search' : 'Advanced Search'}
          </button>
        </div>
      </div>

      {/* Basic Search */}
      <div className="relative mb-4">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search companies, industries, locations..."
          className="w-full pl-10 pr-4 py-3 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-300">Advanced Filters</h4>
            <button
              onClick={addFilter}
              className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Filter</span>
            </button>
          </div>

          {filters.map((filter, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-[#161B22] rounded-lg border border-gray-700">
              {/* Field Selection */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Field</label>
                <select
                  value={filter.field}
                  onChange={(e) => updateFilter(index, { field: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {filterFields.map(field => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Operator Selection */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Operator</label>
                <select
                  value={filter.operator}
                  onChange={(e) => updateFilter(index, { operator: e.target.value as SearchFilter['operator'] })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {operators.map(op => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Value Input */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Value</label>
                {getSuggestions(filter.field).length > 0 ? (
                  <SearchDropdown
                    value={String(filter.value)}
                    onChange={(value) => updateFilter(index, { value })}
                    placeholder="Enter value..."
                    suggestions={getSuggestions(filter.field)}
                    className="w-full"
                  />
                ) : (
                  <input
                    type={getInputType(filter.field)}
                    value={String(filter.value)}
                    onChange={(e) => updateFilter(index, { value: e.target.value })}
                    placeholder="Enter value..."
                    className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              {/* Remove Button */}
              <div className="flex items-end">
                <button
                  onClick={() => removeFilter(index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-md"
                  title="Remove filter"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {filters.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No filters added yet.</p>
              <p className="text-sm">Click "Add Filter" to create advanced search criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {filters.length > 0 && (
        <div className="mt-4">
          <h5 className="text-sm font-medium text-gray-300 mb-2">Active Filters:</h5>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-300 border border-blue-600/30"
              >
                {filter.label}: {String(filter.value)}
                <button
                  onClick={() => removeFilter(index)}
                  className="ml-2 text-blue-300 hover:text-white"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};