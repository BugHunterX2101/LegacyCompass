import React, { useState } from 'react';
import { 
  XMarkIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { scrapeRealTimeLeads } from '../../services/realTimeLeadService';

interface ScrapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (scrapedLeads: any[]) => void;
}

export const ScrapeModal: React.FC<ScrapeModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [selectedSource, setSelectedSource] = useState('linkedin');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxResults, setMaxResults] = useState(50);
  const [scraping, setScraping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const sources = [
    {
      id: 'linkedin',
      name: 'LinkedIn Sales Navigator',
      icon: '💼',
      description: 'Professional network with detailed company and contact information',
      estimatedTime: '2-5 minutes'
    },
    {
      id: 'crunchbase',
      name: 'Crunchbase',
      icon: '🚀',
      description: 'Startup and company database with funding information',
      estimatedTime: '1-3 minutes'
    },
    {
      id: 'yellowpages',
      name: 'Yellow Pages',
      icon: '📞',
      description: 'Business directory with contact information',
      estimatedTime: '1-2 minutes'
    },
    {
      id: 'google',
      name: 'Google Business',
      icon: '🌐',
      description: 'Google My Business listings and company information',
      estimatedTime: '2-4 minutes'
    }
  ];

  const searchExamples = [
    'Technology companies in San Francisco',
    'Healthcare startups in Boston',
    'Manufacturing companies with 100+ employees',
    'SaaS companies in New York',
    'E-commerce businesses in Los Angeles'
  ];

  const handleScrape = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setScraping(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate scraping progress
      setCurrentStep('Initializing scraper...');
      setProgress(10);
      await new Promise(resolve => setTimeout(resolve, 500));

      setCurrentStep('Searching for leads...');
      setProgress(30);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCurrentStep('Extracting contact information...');
      setProgress(60);
      await new Promise(resolve => setTimeout(resolve, 1500));

      setCurrentStep('Validating and enriching data...');
      setProgress(80);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Perform actual scraping
      const scrapedLeads = await scrapeRealTimeLeads(selectedSource, searchQuery, maxResults);

      setCurrentStep('Finalizing results...');
      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));

      onComplete(scrapedLeads);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scraping failed');
    } finally {
      setScraping(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Lead Scraper</h3>
          <button
            onClick={onClose}
            disabled={scraping}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {!scraping ? (
          <div className="space-y-6">
            {/* Source Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Select Data Source
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sources.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => setSelectedSource(source.id)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedSource === source.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{source.icon}</span>
                      <div>
                        <h4 className="font-medium text-white">{source.name}</h4>
                        <p className="text-xs text-gray-400">{source.estimatedTime}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{source.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Configuration */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Query
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter your search criteria..."
                  className="w-full pl-10 pr-4 py-3 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-2">Examples:</p>
                <div className="flex flex-wrap gap-2">
                  {searchExamples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(example)}
                      className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Max Results */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Maximum Results
              </label>
              <select
                value={maxResults}
                onChange={(e) => setMaxResults(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={25}>25 leads</option>
                <option value={50}>50 leads</option>
                <option value={100}>100 leads</option>
                <option value={200}>200 leads</option>
              </select>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-700 rounded flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleScrape}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Start Scraping
              </button>
            </div>
          </div>
        ) : (
          /* Scraping Progress */
          <div className="text-center py-8">
            <div className="mb-6">
              <LoadingSpinner size="lg" />
            </div>
            
            <h4 className="text-lg font-medium text-white mb-2">Scraping in Progress</h4>
            <p className="text-gray-400 mb-6">{currentStep}</p>
            
            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <p className="text-sm text-gray-400">{progress}% complete</p>
            
            <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-blue-300">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="text-sm">Scraping {maxResults} leads from {sources.find(s => s.id === selectedSource)?.name}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};