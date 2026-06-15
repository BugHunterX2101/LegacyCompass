import React, { useState } from 'react';
import { 
  XMarkIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  RocketLaunchIcon,
  PhoneIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { scrapeLeadsFromNews } from '../../services/scrapingService';

interface ScrapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (scrapedLeads: any[]) => void;
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
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      id: 'funding',
      name: 'Startup & Funding',
      Icon: RocketLaunchIcon,
      description: 'Find startups from funding announcements and venture capital news',
      estimatedTime: '10-30 seconds',
      gradient: 'from-violet-500 to-violet-600',
      iconBg: 'bg-violet-500/10 border-violet-500/20'
    },
    {
      id: 'industry',
      name: 'Industry Reports',
      Icon: PhoneIcon,
      description: 'Extract companies from industry analysis and market reports',
      estimatedTime: '10-30 seconds',
      gradient: 'from-amber-500 to-amber-600',
      iconBg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      id: 'global',
      name: 'Global Markets',
      Icon: GlobeAltIcon,
      description: 'Find companies from international business and trade news',
      estimatedTime: '10-30 seconds',
      gradient: 'from-emerald-500 to-emerald-600',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  const searchExamples = [
    'AI startups',
    'Healthcare technology',
    'Fintech funding',
    'SaaS companies',
    'Electric vehicle manufacturers'
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 modal-overlay">
      <div className="bg-[#13171D] rounded-2xl border border-slate-700/40 p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto modal-content modal-scroll shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500 mr-3" />
            Lead Scraper
          </h3>
          <button
            onClick={onClose}
            disabled={scraping}
            className="text-slate-400 hover:text-white transition-colors disabled:opacity-50 p-1 rounded-lg hover:bg-slate-700/30"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {!scraping ? (
          <div className="space-y-6">
            {/* Source Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Select Data Source
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sources.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => setSelectedSource(source.id)}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                      selectedSource === source.id
                        ? 'border-blue-500/40 bg-blue-500/8 shadow-lg shadow-blue-900/10'
                        : 'border-slate-700/30 hover:border-slate-600/50 bg-[#0E1218]'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${source.iconBg} border`}>
                        <source.Icon className={`h-5 w-5 ${selectedSource === source.id ? 'text-blue-300' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-sm">{source.name}</h4>
                        <p className="text-[10px] text-slate-500">{source.estimatedTime}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{source.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Configuration */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Search Query
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter your search criteria..."
                  className="w-full pl-11 pr-4 py-3 bg-[#0B0F15] border border-slate-600/40 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                />
              </div>
              
              <div className="mt-2.5">
                <p className="text-[10px] text-slate-600 mb-1.5 uppercase tracking-wider font-medium">Examples</p>
                <div className="flex flex-wrap gap-1.5">
                  {searchExamples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(example)}
                      className="text-xs px-2.5 py-1 bg-slate-800/50 text-slate-400 rounded-lg hover:bg-slate-700/50 hover:text-slate-300 transition-all border border-slate-700/30"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Max Results */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Maximum Results
              </label>
              <select
                value={maxResults}
                onChange={(e) => setMaxResults(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-[#0B0F15] border border-slate-600/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
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
              <div className="p-3.5 bg-red-500/8 border border-red-500/20 rounded-xl flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2.5 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/30"
              >
                Cancel
              </button>
              <button
                onClick={handleScrape}
                className="px-6 py-2.5 text-white rounded-xl transition-all hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                  boxShadow: '0 2px 12px rgba(37, 99, 235, 0.3)',
                }}
              >
                Start Scraping
              </button>
            </div>
          </div>
        ) : (
          /* Scraping Progress */
          <div className="text-center py-10">
            <div className="mb-6">
              <LoadingSpinner size="lg" />
            </div>
            
            <h4 className="text-lg font-semibold text-white mb-2">Scraping in Progress</h4>
            <p className="text-slate-400 mb-6">{currentStep}</p>
            
            <div className="w-full bg-slate-800/50 rounded-full h-3 mb-4 overflow-hidden">
              <div 
                className="h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                  boxShadow: '0 0 12px rgba(59,130,246,0.4)'
                }}
              />
            </div>
            
            <p className="text-sm text-slate-500 tabular-nums">{progress}% complete</p>
            
            <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/15 rounded-xl">
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