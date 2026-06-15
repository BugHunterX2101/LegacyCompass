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
    <header className="sticky top-0 z-50 border-b border-slate-700/30" style={{
      background: 'linear-gradient(180deg, rgba(19, 23, 29, 0.97) 0%, rgba(19, 23, 29, 0.92) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      {/* Subtle gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.2), transparent)'
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="relative group">
              {/* Glow behind logo */}
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                <span className="text-white font-bold text-sm tracking-tight">LC</span>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 tracking-tight">LegacyCompass</h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Lead Intelligence</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={onImport}
              className="group flex items-center space-x-2 px-3.5 py-2 text-sm font-medium text-slate-400 hover:text-slate-100 rounded-lg transition-all duration-200 hover:bg-slate-700/30"
              title="Import Leads"
            >
              <DocumentArrowUpIcon className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              <span className="hidden sm:inline">Import</span>
            </button>

            <button
              onClick={onScrape}
              className="group flex items-center space-x-2 px-3.5 py-2 text-sm font-medium text-slate-400 hover:text-slate-100 rounded-lg transition-all duration-200 hover:bg-slate-700/30"
              title="Scrape Leads"
            >
              <MagnifyingGlassIcon className="h-4 w-4 transition-transform group-hover:rotate-12" />
              <span className="hidden sm:inline">Scrape</span>
            </button>

            <button
              onClick={onExport}
              className="group flex items-center space-x-2 px-3.5 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
              }}
              title="Export Leads"
            >
              <DocumentArrowDownIcon className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <div className="h-6 w-px bg-slate-700/40 mx-1" />

            <button
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/30 rounded-lg transition-all duration-200"
              title="Settings"
            >
              <Cog6ToothIcon className="h-5 w-5 hover:rotate-45 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};