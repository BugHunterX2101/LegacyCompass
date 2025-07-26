import React from 'react';
import { 
  ChartBarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onStartScrape: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onStartScrape }) => {
  const features = [
    {
      icon: ChartBarIcon,
      title: 'Legacy Alignment Dashboard',
      description: 'Real-time analytics and scoring metrics for legacy system alignment assessment.',
      action: () => onNavigate('dashboard'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: UserGroupIcon,
      title: 'Lead Management',
      description: 'Comprehensive lead tracking with advanced scoring and qualification systems.',
      action: () => onNavigate('leads'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: MagnifyingGlassIcon,
      title: 'Smart Lead Scraping',
      description: 'Automated lead discovery with legacy alignment scoring capabilities.',
      action: onStartScrape,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: SparklesIcon,
      title: 'Data Enrichment',
      description: 'AI-powered lead enrichment with legacy system compatibility analysis.',
      action: () => onNavigate('enrichment'),
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-2xl">LA</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Legacy Alignment
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Scorecard Tool
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Advanced lead management system with intelligent legacy alignment scoring. 
              Identify, qualify, and track leads based on their compatibility with legacy systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                View Dashboard
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={onStartScrape}
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Scraping
                <MagnifyingGlassIcon className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to manage leads and assess legacy system alignment in one comprehensive platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-[#1E2328] rounded-xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
              
              <div className="relative">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-6`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
                
                <button
                  onClick={feature.action}
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors group"
                >
                  Get Started
                  <ArrowRightIcon className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#161B22] border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">100+</div>
              <div className="text-gray-400">Sample Leads</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">15+</div>
              <div className="text-gray-400">Industries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">Real-time</div>
              <div className="text-gray-400">Scoring</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">AI-Powered</div>
              <div className="text-gray-400">Enrichment</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};