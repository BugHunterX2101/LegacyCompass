import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { filterSearchSuggestions } from '../../data/searchSuggestions';

interface SearchDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suggestions: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  className?: string;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  value,
  onChange,
  placeholder,
  suggestions,
  onSuggestionSelect,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      setIsLoading(true);
      
    if (value.length > 0) {
        // Use enhanced filtering for better performance and results
        const filtered = filterSearchSuggestions(value, 'companies', 8);
        setFilteredSuggestions(filtered);
        setIsOpen(filtered.length > 0);
    } else {
      // Show a sample of suggestions when no input
      const sampleSuggestions = suggestions.slice(0, 8);
      setFilteredSuggestions(sampleSuggestions);
      setIsOpen(false);
    }
      
      setIsLoading(false);
    }, 300); // 300ms delay for real-time feel

    return () => clearTimeout(searchTimeout);
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    onSuggestionSelect?.(suggestion);
  };

  const handleInputFocus = () => {
    if (value.length === 0) {
      setFilteredSuggestions(suggestions.slice(0, 8));
      setIsOpen(true);
    } else if (filteredSuggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const clearSearch = () => {
    onChange('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
              className="w-full pl-10 pr-10 py-2 bg-[#0F1419] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-colors"
        />
        {value && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#1E2328] border border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {isLoading && (
            <div className="px-4 py-2 text-sm text-gray-400 flex items-center">
              <div className="w-4 h-4 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin mr-2"></div>
              Searching...
            </div>
          )}
          {filteredSuggestions.length > 0 ? (
            <div className="py-1">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-[#3A3D41] hover:text-white transition-all duration-200 flex items-center"
                >
                  <Search className="w-3 h-3 mr-2 text-gray-500" />
                  {suggestion}
                </button>
              ))}
            </div>
          ) : !isLoading && (
            <div className="px-4 py-2 text-sm text-gray-400">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
};