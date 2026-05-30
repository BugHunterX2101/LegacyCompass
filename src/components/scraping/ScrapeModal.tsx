import React, { useState } from 'react';
import { Lead } from '../../types';
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  BriefcaseIcon,
  RocketLaunchIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { scrapeLeadsFromNews } from '../../services/scrapingService';

interface ScrapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (scrapedLeads: Lead[]) => void;
}

export const ScrapeModal: React.FC<ScrapeModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [selectedSource, setSelectedSource] = useState('business');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxResults, setMaxResults] = useState(10);
  const [scraping, setScraping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const sources = [
    {
      id: 'business',
      name: 'Business News',
      Icon: BriefcaseIcon,
      description: 'Discover companies from real-time business news and press releases',
      estimatedTime: '10-30 seconds',
    },
    {
      id: 'funding',
      name: 'Startup & Funding',
      Icon: RocketLaunchIcon,
      description: 'Find startups from funding announcements and venture capital news',
      estimatedTime: '10-30 seconds',
    },
    {
      id: 'industry',
      name: 'Industry Reports',
      Icon: BuildingOfficeIcon,
      description: 'Extract companies from industry analysis and market reports',
      estimatedTime: '10-30 seconds',
    },
    {
      id: 'global',
      name: 'Global Markets',
      Icon: GlobeAltIcon,
      description: 'Find companies from international business and trade news',
      estimatedTime: '10-30 seconds',
    },
  ];

  const searchExamples = [
    'AI startups',
    'Healthcare technology',
    'Fintech funding',
    'SaaS companies',
    'Electric vehicle manufacturers',
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
      const scrapedLeads = await scrapeLeadsFromNews(
        selectedSource,
        searchQuery,
        maxResults,
        (step, percent) => {
          setCurrentStep(step);
          setProgress(percent);
        }
      );

      setCurrentStep('Done!');
      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 400));

      onComplete(scrapedLeads);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scraping failed. Try a different query.');
    } finally {
      setScraping(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Lead Scraper</h3>
          <button
            onClick={() => { if (!scraping) { setError(null); setProgress(0); setCurrentStep(''); } onClose(); }}
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
                      <source.Icon className={`h-6 w-6 flex-shrink-0 ${selectedSource === source.id ? 'text-blue-400' : 'text-gray-400'}`} />
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
                  onKeyDown={(e) => e.key === 'Enter' && !scraping && handleScrape()}
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
                <option value={5}>5 leads</option>
                <option value={10}>10 leads</option>
                <option value={15}>15 leads</option>
                <option value={20}>20 leads</option>
                <option value={25}>25 leads</option>
                <option value={30}>30 leads</option>
                <option value={40}>40 leads</option>
                <option value={50}>50 leads</option>
              </select>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-700 rounded flex items-start space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
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
                disabled={!searchQuery.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            <p className="text-gray-400 mb-6 min-h-[1.5rem]">{currentStep}</p>

            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-sm text-gray-400">{progress}% complete</p>

            <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-blue-300">
                <MagnifyingGlassIcon className="h-5 w-5 animate-pulse" />
                <span className="text-sm">
                  Searching for {maxResults} leads from {sources.find(s => s.id === selectedSource)?.name}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
