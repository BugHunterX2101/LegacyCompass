import React from 'react';
import { 
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface TopBarProps {
  onImport: () => void;
  onScrape: () => void;
  onExport: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onImport, onScrape, onExport }) => {
  return (
    <header className="bg-[#161B22] border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">LegacyCompass</h1>
                <p className="text-xs text-gray-400">Lead Intelligence Platform</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onImport}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              title="Import Leads"
            >
              <DocumentArrowUpIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </button>

            <button
              onClick={onScrape}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              title="Scrape Leads"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Scrape</span>
            </button>

            <button
              onClick={onExport}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              title="Export Leads"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <div className="h-6 w-px bg-gray-600"></div>

            <button
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              title="Settings"
            >
              <Cog6ToothIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};