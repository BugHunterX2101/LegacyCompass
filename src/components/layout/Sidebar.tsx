import React from 'react';
import { BarChart3, Users, Zap, TrendingUp, Brain, Target, Home, Search, Settings, HelpCircle } from 'lucide-react';

interface SidebarProps {
  activeTab: 'home' | 'dashboard' | 'leads' | 'scraper' | 'enrichment' | 'analytics' | 'search';
  onTabChange: (tab: 'home' | 'dashboard' | 'leads' | 'scraper' | 'enrichment' | 'analytics' | 'search') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'scraper', label: 'Scraper', icon: Zap },
    { id: 'enrichment', label: 'Enrichment', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#161B22] border-r border-slate-700/50 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-br from-slate-600 to-blue-600 rounded-lg mr-3">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">
              LegacyCompass
            </h1>
            <p className="text-xs text-slate-500">Lead Intelligence</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-900/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
      
      {/* Bottom section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
        <div className="space-y-2 mb-4">
          <button className="w-full flex items-center px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 rounded-lg transition-colors">
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </button>
          <button className="w-full flex items-center px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 rounded-lg transition-colors">
            <HelpCircle className="w-4 h-4 mr-3" />
            Help & Support
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-lg p-4 border border-blue-500/15">
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Upgrade to Pro</h3>
          <p className="text-xs text-slate-500 mb-3">Unlock unlimited leads and advanced features</p>
          <button className="w-full px-3 py-2 bg-gradient-to-r from-slate-600 to-blue-600 text-white text-xs font-medium rounded-lg hover:from-slate-500 hover:to-blue-500 transition-all">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};