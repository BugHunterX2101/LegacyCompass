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
    <header className="bg-[#161B22]/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-100">LegacyCompass</h1>
                <p className="text-xs text-slate-500">Lead Intelligence Platform</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onImport}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 rounded-md transition-colors"
              title="Import Leads"
            >
              <DocumentArrowUpIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </button>

            <button
              onClick={onScrape}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 rounded-md transition-colors"
              title="Scrape Leads"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Scrape</span>
            </button>

            <button
              onClick={onExport}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-blue-600/90 hover:bg-blue-600 rounded-md transition-colors"
              title="Export Leads"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <div className="h-6 w-px bg-slate-700/60"></div>

            <button
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 rounded-md transition-colors"
              title="Settings — coming soon"
              aria-label="Settings (coming soon)"
              onClick={() => {
                const el = document.getElementById('settings-tooltip');
                if (el) {
                  el.classList.remove('hidden');
                  setTimeout(() => el.classList.add('hidden'), 2000);
                }
              }}
            >
              <Cog6ToothIcon className="h-5 w-5" />
            </button>
            <span
              id="settings-tooltip"
              className="hidden absolute right-4 top-14 text-xs bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1.5 rounded shadow-lg z-50"
            >
              Settings coming soon
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};