import React, { useState } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { scrapeLeadsFromSource } from '../../services/realTimeLeadService';

interface ScrapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (leads: any[]) => void;
}

const scrapingSources = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Scrape company profiles and employee data from LinkedIn',
    icon: '💼',
    estimatedTime: '2-5 minutes',
    quality: 'High'
  },
  {
    id: 'crunchbase',
    name: 'Crunchbase',
    description: 'Get startup and company funding information',
    icon: '🚀',
    estimatedTime: '1-3 minutes',
    quality: 'High'
  },
  {
    id: 'yellowpages',
    name: 'Yellow Pages',
    description: 'Local business directory with contact information',
    icon: '📞',
    estimatedTime: '1-2 minutes',
    quality: 'Medium'
  },
  {
    id: 'google',
    name: 'Google Business',
    description: 'Google My Business listings and reviews',
    icon: '🌐',
    estimatedTime: '2-4 minutes',
    quality: 'Medium'
  }
];

export const ScrapeModal: React.FC<ScrapeModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxResults, setMaxResults] = useState(50);
  const [scraping, setScraping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  if (!isOpen) return null;

  const handleStartScraping = async () => {
    if (!selectedSource || !searchQuery.trim()) return;

    setScraping(true);
    setProgress(0);
    setCurrentStep('Initializing scraper...');

    try {
      // Simulate progress updates
      const steps = [
        'Connecting to data source...',
        'Searching for companies...',
        'Extracting company data...',
        'Enriching contact information...',
        'Finalizing results...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setProgress((i + 1) * 20);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Actually scrape the leads
      const leads = await scrapeLeadsFromSource(selectedSource, searchQuery, maxResults);
      
      setProgress(100);
      setCurrentStep('Scraping completed!');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onComplete(leads);
      onClose();
      resetModal();

    } catch (error) {
      console.error('Scraping failed:', error);
      setCurrentStep('Scraping failed. Please try again.');
      setTimeout(() => {
        setScraping(false);
        setProgress(0);
        setCurrentStep('');
      }, 2000);
    }
  };

  const resetModal = () => {
    setSelectedSource('');
    setSearchQuery('');
    setMaxResults(50);
    setScraping(false);
    setProgress(0);
    setCurrentStep('');
  };

  const handleClose = () => {
    if (!scraping) {
      onClose();
      resetModal();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E2328] rounded-lg border border-gray-700 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Scrape New Leads</h2>
          <button
            onClick={handleClose}
            disabled={scraping}
            className="text-gray-400 hover:text-white disabled:opacity-50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {scraping ? (
            <div className="text-center py-8">
              <LoadingSpinner size="lg" />
              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Scraping in Progress</h3>
              <p className="text-gray-400 mb-4">{currentStep}</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className={`bg-blue-600 h-2 rounded-full transition-all duration-300 w-[${progress}%]`}
                />
              </div>
              <p className="text-sm text-gray-500">{progress}% complete</p>
            </div>
          ) : (
            <>
              {/* Source Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-4">Select Data Source</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scrapingSources.map((source) => (
                    <div
                      key={source.id}
                      onClick={() => setSelectedSource(source.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedSource === source.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{source.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{source.name}</h4>
                          <p className="text-sm text-gray-400 mt-1">{source.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>⏱️ {source.estimatedTime}</span>
                            <span>⭐ {source.quality} Quality</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search Configuration */}
              {selectedSource && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-white mb-4">Search Configuration</h3>
                  <div className="space-y-4">
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
                          placeholder="e.g., technology companies in San Francisco"
                          className="w-full pl-10 pr-4 py-3 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Maximum Results
                        </label>
                        <select
                          value={maxResults}
                          onChange={(e) => setMaxResults(parseInt(e.target.value))}
                          className="w-full px-3 py-3 bg-[#0D1117] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={25}>25 leads</option>
                          <option value={50}>50 leads</option>
                          <option value={100}>100 leads</option>
                          <option value={200}>200 leads</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Estimated Time
                        </label>
                        <div className="px-3 py-3 bg-[#161B22] border border-gray-700 rounded-md text-gray-400">
                          {scrapingSources.find(s => s.id === selectedSource)?.estimatedTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Search Examples */}
              {selectedSource && (
                <div className="mb-6 p-4 bg-[#161B22] rounded-lg border border-gray-700">
                  <h4 className="text-sm font-medium text-white mb-2">Search Examples:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
                    <div>• "SaaS companies in New York"</div>
                    <div>• "Healthcare startups"</div>
                    <div>• "Manufacturing companies 100+ employees"</div>
                    <div>• "Fintech companies Series A"</div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartScraping}
                  disabled={!selectedSource || !searchQuery.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Scraping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};