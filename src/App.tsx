import { useState, useEffect, useMemo } from 'react';
import { Lead, SearchFilter } from './types';
import { TopBar } from './components/layout/TopBar';
import { HomePage } from './components/homepage/HomePage';
import { DashboardStats } from './components/dashboard/DashboardStats';
import { TopIndustriesChart } from './components/dashboard/TopIndustriesChart';
import { ScoreDistributionChart } from './components/dashboard/ScoreDistributionChart';
import { LeadTable } from './components/leads/LeadTable';
import { AdvancedSearch } from './components/search/AdvancedSearch';
import { EnrichmentPanel } from './components/enrichment/EnrichmentPanel';
import { ImportModal } from './components/import/ImportModal';
import { ScrapeModal } from './components/scraping/ScrapeModal';
import { NotificationContainer } from './components/common/NotificationContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AIInsightsPanel } from './components/ai/AIInsightsPanel';
import { AIEmailGenerator } from './components/ai/AIEmailGenerator';
import { AIMarketAnalysisComponent } from './components/ai/AIMarketAnalysis';
import { VirtualizedLeadTable } from './components/performance/VirtualizedLeadTable';
import { PerformanceMonitor } from './components/performance/PerformanceMonitor';
import { NewsFeed } from './components/dashboard/NewsFeed';
import { getInitialLeads, exportLeadsToCSV, downloadFile } from './services/leadService';
import { addRealTimeLead, updateRealTimeLead } from './services/realTimeLeadService';
import {
  HomeIcon,
  ChartBarIcon,
  UserGroupIcon,
  SparklesIcon,
  LightBulbIcon,
  EnvelopeIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { subscribeToLeadUpdates } from './services/realTimeLeadService';
import { notificationService } from './services/notificationService';

type TabType = 'home' | 'dashboard' | 'leads' | 'enrichment' | 'ai-insights' | 'ai-email' | 'market-analysis';

const SCORE_RANGES = [
  { range: '0-20', min: 0, max: 20 },
  { range: '21-40', min: 21, max: 40 },
  { range: '41-60', min: 41, max: 60 },
  { range: '61-80', min: 61, max: 80 },
  { range: '81-100', min: 81, max: 100 }
];

const PAGE_ACCENTS: Record<TabType, string> = {
  'home': '',
  'dashboard': 'page-accent-dashboard',
  'leads': 'page-accent-leads',
  'enrichment': 'page-accent-enrichment',
  'ai-insights': 'page-accent-ai',
  'ai-email': 'page-accent-ai',
  'market-analysis': 'page-accent-market',
};

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showScrapeModal, setShowScrapeModal] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [useVirtualization, setUseVirtualization] = useState(leads.length > 100);

  // Initialize with mock data
  useEffect(() => {
    const initialLeads = getInitialLeads();
    setLeads(initialLeads);

    // Subscribe to real-time updates
    const unsubscribe = subscribeToLeadUpdates((updatedLeads) => {
      setLeads(updatedLeads);
    });

    return unsubscribe;
  }, []);

  // Update virtualization based on lead count
  useEffect(() => {
    setUseVirtualization(leads.length > 500); // Increase threshold for better performance
  }, [leads.length]);

  const filteredLeads = useMemo(() => {
    let filtered = leads;

    // Apply text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.companyName.toLowerCase().includes(query) ||
        lead.industry.toLowerCase().includes(query) ||
        lead.location.toLowerCase().includes(query) ||
        (lead.contactPerson && lead.contactPerson.toLowerCase().includes(query))
      );
    }

    // Apply advanced filters
    searchFilters.forEach(filter => {
      filtered = filtered.filter(lead => {
        const fieldValue = lead[filter.field as keyof Lead];
        const filterValue = filter.value;

        if (fieldValue === undefined || fieldValue === null) return false;

        switch (filter.operator) {
          case 'equals':
            return String(fieldValue).toLowerCase() === String(filterValue).toLowerCase();
          case 'contains':
            return String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'greater':
            return Number(fieldValue) > Number(filterValue);
          case 'less':
            return Number(fieldValue) < Number(filterValue);
          case 'between':
            // For between, filterValue should be "min,max"
            const [min, max] = String(filterValue).split(',').map(Number);
            return Number(fieldValue) >= min && Number(fieldValue) <= max;
          default:
            return true;
        }
      });
    });

    return filtered;
  }, [leads, searchFilters, searchQuery]);

  const handleSearch = (filters: SearchFilter[], query: string) => {
    setSearchFilters(filters);
    setSearchQuery(query);
  };

  const handleImport = (importedLeads: any[]) => {
    const newLeads = importedLeads.map(lead => ({
      ...lead,
      id: lead.id || `imported-${Date.now()}-${Math.random()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    setLeads(prevLeads => [...prevLeads, ...newLeads]);
    notificationService.success(
      'Import Successful',
      `Successfully imported ${newLeads.length} leads`
    );
    setShowImportModal(false);
  };

  const handleScrapeComplete = (scrapedLeads: any[]) => {
    const newLeads = scrapedLeads.map(lead => ({
      ...lead,
      id: lead.id || `scraped-${Date.now()}-${Math.random()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Persist each lead to localStorage via the service
    const existingIds = new Set(leads.map(l => l.id));
    const uniqueNewLeads = newLeads.filter((lead: any) => !existingIds.has(lead.id));
    uniqueNewLeads.forEach((lead: any) => addRealTimeLead(lead));
    
    notificationService.success(
      'Scraping Complete',
      `Successfully scraped ${uniqueNewLeads.length} real leads from news sources`
    );
    setShowScrapeModal(false);
  };

  const handleExport = async () => {
    const leadsToExport = selectedLeads.length > 0 
      ? filteredLeads.filter(lead => selectedLeads.includes(lead.id))
      : filteredLeads;

    if (leadsToExport.length === 0) {
      alert('No leads to export');
      return;
    }

    try {
      // Export as CSV by default, could add format selection
      const csvData = exportLeadsToCSV(leadsToExport);
      downloadFile(csvData, `leads-export-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
      notificationService.success(
        'Export Complete',
        `Successfully exported ${leadsToExport.length} leads`
      );
    } catch (error) {
      console.error('Export failed:', error);
      notificationService.error(
        'Export Failed',
        'There was an error exporting your leads. Please try again.'
      );
    }
  };

  const handleEnrichLead = (leadId: string, enrichedLead: Lead) => {
    console.log('[App] handleEnrichLead called for:', leadId);
    // Update the lead in React state with enriched data
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, ...enrichedLead, id: leadId } : lead
      )
    );
    // Note: enrichLeadWithRealData already persists via the singleton directly,
    // but we call updateRealTimeLead here as well for safety
    updateRealTimeLead(leadId, enrichedLead);

    // Show success notification with enriched company name
    notificationService.success(
      'Lead Enriched',
      `${enrichedLead.companyName} has been enriched with real-time data`
    );
  };

  const handleLeadSelection = (leadIds: string[]) => {
    setSelectedLeads(leadIds);
  };

  const topIndustries = useMemo(() => {
    const industryStats = leads.reduce((acc, lead) => {
      if (!acc[lead.industry]) {
        acc[lead.industry] = { count: 0, totalScore: 0 };
      }
      acc[lead.industry].count++;
      acc[lead.industry].totalScore += lead.score;
      return acc;
    }, {} as Record<string, { count: number; totalScore: number }>);

    return Object.entries(industryStats)
      .map(([name, stats]) => ({
        name,
        count: stats.count,
        avgScore: Math.round(stats.totalScore / stats.count)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [leads]);

  // Calculate score distribution
  const scoreDistribution = useMemo(() => SCORE_RANGES.map(range => ({
    range: range.range,
    count: leads.filter(lead => lead.score >= range.min && lead.score <= range.max).length
  })), [leads]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage 
            onNavigate={(tab: string) => setActiveTab(tab as TabType)}
            onStartScrape={() => setShowScrapeModal(true)}
            leadCount={leads.length}
            industryCount={new Set(leads.map(l => l.industry)).size}
          />
        );
      
      case 'dashboard':
        const statusCounts = leads.reduce((acc, l) => {
          acc[l.status] = (acc[l.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const statusData = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
        const recentLeads = [...leads].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

        return (
          <div className="space-y-6">
            <DashboardStats leads={leads} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopIndustriesChart data={topIndustries} />
              <ScoreDistributionChart data={scoreDistribution} />
            </div>

            {/* Status Breakdown & Recent Leads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lead Status Breakdown */}
              <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
                <h3 className="text-lg font-semibold text-white mb-5 flex items-center">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500 mr-3" />
                  Lead Status Breakdown
                </h3>
                <div className="space-y-4">
                  {statusData.map((item, index) => {
                    const total = leads.length || 1;
                    const pct = Math.round((item.count / total) * 100);
                    const statusColors: Record<string, string> = {
                      new: 'from-blue-500 to-blue-400',
                      contacted: 'from-amber-500 to-amber-400',
                      qualified: 'from-emerald-500 to-emerald-400',
                      converted: 'from-violet-500 to-violet-400',
                      rejected: 'from-red-500 to-red-400'
                    };
                    const statusGlows: Record<string, string> = {
                      new: 'rgba(59,130,246,0.3)',
                      contacted: 'rgba(245,158,11,0.3)',
                      qualified: 'rgba(16,185,129,0.3)',
                      converted: 'rgba(139,92,246,0.3)',
                      rejected: 'rgba(239,68,68,0.3)',
                    };
                    return (
                      <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'backwards' }}>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="text-slate-300 capitalize font-medium">{item.status}</span>
                          <span className="text-white font-semibold">{item.count} <span className="text-slate-500 font-normal">({pct}%)</span></span>
                        </div>
                        <div className="w-full bg-slate-800/60 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full bg-gradient-to-r ${statusColors[item.status] || 'from-gray-500 to-gray-400'} transition-all duration-700`}
                            style={{ width: `${pct}%`, boxShadow: `0 0 8px ${statusGlows[item.status] || 'transparent'}` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Leads */}
              <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
                <h3 className="text-lg font-semibold text-white mb-5 flex items-center">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500 mr-3" />
                  Recently Updated Leads
                </h3>
                <div className="space-y-3">
                  {recentLeads.map((lead, idx) => (
                    <div key={lead.id} className="flex items-center justify-between p-3.5 bg-[#0E1218] rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 animate-fade-in-up" style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'backwards' }}>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">{lead.companyName}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {lead.industry} &bull; {lead.contactPerson || 'No contact'}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2.5 ml-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full capitalize font-medium ${
                          lead.status === 'qualified' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' :
                          lead.status === 'converted' ? 'bg-violet-500/15 text-violet-300 border border-violet-500/25' :
                          lead.status === 'contacted' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25' :
                          lead.status === 'rejected' ? 'bg-red-500/15 text-red-300 border border-red-500/25' :
                          'bg-blue-500/15 text-blue-300 border border-blue-500/25'
                        }`}>{lead.status}</span>
                        <span className={`text-sm font-bold ${
                          lead.score >= 80 ? 'text-emerald-400' :
                          lead.score >= 60 ? 'text-amber-400' :
                          'text-red-400'
                        }`}>{lead.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <NewsFeed query="B2B sales lead generation" title="Latest Industry News" maxResults={5} />
          </div>
        );
      
      case 'leads':
        return (
          <div className="space-y-6">
            <AdvancedSearch 
              onSearch={handleSearch}
              onResultsCount={() => {}} 
            />
            {useVirtualization ? (
              <VirtualizedLeadTable 
                leads={filteredLeads}
                selectedLeads={selectedLeads}
                onLeadSelect={handleLeadSelection}
                containerHeight={600}
              />
            ) : (
              <LeadTable 
                leads={filteredLeads}
                selectedLeads={selectedLeads}
                onLeadSelect={handleLeadSelection}
              />
            )}
          </div>
        );
      
      case 'enrichment':
        return (
          <EnrichmentPanel 
            leads={filteredLeads}
            onEnrich={handleEnrichLead}
          />
        );
      
      case 'ai-insights':
        return selectedLead ? (
          <AIInsightsPanel 
            lead={selectedLead}
          />
        ) : (
          <div className="text-center py-12 text-gray-400">
            Select a lead to view AI insights
          </div>
        );
      
      case 'ai-email':
        return selectedLead ? (
          <AIEmailGenerator lead={selectedLead} />
        ) : (
          <div className="text-center py-12 text-gray-400">
            Select a lead to generate AI emails
          </div>
        );
      
      case 'market-analysis':
        const topIndustry = topIndustries[0]?.name || 'Technology';
        const allIndustries = [...new Set(leads.map(l => l.industry))].filter(Boolean).sort();
        const locationCounts = leads.reduce((acc, l) => { acc[l.location] = (acc[l.location] || 0) + 1; return acc; }, {} as Record<string, number>);
        const sortedLocations = Object.entries(locationCounts).sort((a, b) => b[1] - a[1]).map(([loc]) => loc);
        const topLocation = sortedLocations[0] || 'San Francisco, CA';
        return (
          <AIMarketAnalysisComponent 
            industry={topIndustry} 
            location={topLocation}
            industries={allIndustries.length > 0 ? allIndustries : [topIndustry]}
            locations={sortedLocations.length > 0 ? sortedLocations : [topLocation]}
          />
        );
      
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'home', label: 'Home', Icon: HomeIcon },
    { id: 'dashboard', label: 'Dashboard', Icon: ChartBarIcon },
    { id: 'leads', label: 'Leads', Icon: UserGroupIcon },
    { id: 'enrichment', label: 'Enrichment', Icon: SparklesIcon },
    { id: 'ai-insights', label: 'AI Insights', Icon: LightBulbIcon },
    { id: 'ai-email', label: 'AI Email', Icon: EnvelopeIcon },
    { id: 'market-analysis', label: 'Market AI', Icon: ArrowTrendingUpIcon }
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0B0F15]">
        <TopBar 
          onImport={() => setShowImportModal(true)}
          onScrape={() => setShowScrapeModal(true)}
          onExport={handleExport}
        />
        
        {/* Navigation */}
        <nav className="sticky top-16 z-40 border-b border-slate-700/20" style={{
          background: 'rgba(11, 15, 21, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-1 py-2 overflow-x-auto scrollbar-thin">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`nav-pill ${isActive ? 'nav-pill-active' : 'nav-pill-inactive'} whitespace-nowrap`}
                  >
                    <tab.Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-blue-400' : ''}`} />
                    <span>{tab.label}</span>
                    {tab.id === 'leads' && filteredLeads.length > 0 && (
                      <span className="ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 min-w-[20px] text-center">
                        {filteredLeads.length}
                      </span>
                    )}
                    {(tab.id === 'ai-insights' || tab.id === 'ai-email') && selectedLead && (
                      <span className="ml-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className={`${activeTab === 'home' ? '' : `max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${PAGE_ACCENTS[activeTab]}`} min-h-[60vh]`}>
          <div key={activeTab} className="animate-fade-in-up">
          {/* Lead Selection for AI Features */}
          {(activeTab === 'ai-insights' || activeTab === 'ai-email') && !selectedLead && (
            <div className="mb-8">
              <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
                <div className="flex items-center mb-2">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-500 to-purple-500 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Select a Lead for AI Analysis</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4 ml-4">Choose a lead to generate {activeTab === 'ai-insights' ? 'AI-powered insights' : 'personalized emails'}</p>
                <input
                  type="text"
                  placeholder="Search leads by name, industry, or location..."
                  className="w-full px-4 py-2.5 mb-5 bg-[#0B0F15] border border-slate-600/40 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                  onChange={(e) => {
                    const q = e.target.value.toLowerCase();
                    setSearchQuery(q);
                  }}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                  {filteredLeads.slice(0, 18).map((lead, idx) => (
                    <button
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="group p-4 bg-[#0E1218] border border-slate-700/30 rounded-xl hover:border-blue-500/40 transition-all duration-250 text-left animate-fade-in-up hover:-translate-y-0.5"
                      style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'backwards' }}
                    >
                      <div className="font-medium text-white truncate group-hover:text-blue-300 transition-colors">{lead.companyName}</div>
                      <div className="text-sm text-slate-500 truncate mt-0.5">{lead.industry} &bull; {lead.location}</div>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                          lead.score >= 80 ? 'bg-emerald-500/15 text-emerald-300' :
                          lead.score >= 60 ? 'bg-amber-500/15 text-amber-300' :
                          'bg-slate-700/50 text-slate-400'
                        }`}>Score: {lead.score}</span>
                        {lead.contactPerson && (
                          <span className="text-xs text-slate-500 truncate">{lead.contactPerson}</span>
                        )}
                      </div>
                    </button>
                  ))}
                  {filteredLeads.length === 0 && (
                    <div className="col-span-3 empty-state py-10">
                      <div className="empty-state-icon">
                        <UserGroupIcon className="h-8 w-8 text-blue-400" />
                      </div>
                      <p className="empty-state-title">No leads found</p>
                      <p className="empty-state-text">Try a different search or scrape new leads to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {selectedLead && (activeTab === 'ai-insights' || activeTab === 'ai-email') && (
            <div className="mb-6">
              <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-300">{selectedLead.companyName.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{selectedLead.companyName}</h3>
                      <p className="text-sm text-slate-400">{selectedLead.industry} / {selectedLead.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-700/30 transition-all text-sm font-medium"
                  >
                    Change Lead
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {renderContent()}
          </div>
        </main>

        {/* Modals */}
        <ImportModal 
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImport}
        />
        
        <ScrapeModal 
          isOpen={showScrapeModal}
          onClose={() => setShowScrapeModal(false)}
          onComplete={handleScrapeComplete}
        />

        {/* Footer */}
        <footer className="relative mt-16 border-t border-slate-700/30" style={{
          background: 'linear-gradient(180deg, rgba(19, 23, 29, 0.5) 0%, rgba(11, 15, 21, 1) 100%)',
        }}>
          {/* Gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{
            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.15), transparent)'
          }} />

          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Brand */}
              <div>
                <div className="flex items-center space-x-2.5 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">LC</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-200">LegacyCompass</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  AI-powered B2B lead intelligence platform for modern sales teams.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Platform</h4>
                <div className="grid grid-cols-2 gap-1">
                  {tabs.slice(1).map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className="text-xs text-slate-500 hover:text-slate-300 transition-colors text-left py-1"
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Current Session</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Total Leads</span>
                    <span className="text-slate-300 font-medium">{leads.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Filtered</span>
                    <span className="text-slate-300 font-medium">{filteredLeads.length}</span>
                  </div>
                  {selectedLeads.length > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Selected</span>
                      <span className="text-blue-400 font-medium">{selectedLeads.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-6 border-t border-slate-800/60 flex items-center justify-between">
              <div className="text-[11px] text-slate-600">
                © {new Date().getFullYear()} LegacyCompass. Built with React & TypeScript.
              </div>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                  Online
                </span>
              </div>
            </div>
          </div>
        </footer>
        
        {/* Notifications */}
        <NotificationContainer />
        
        {/* Performance Monitor (only in development) */}
        {import.meta.env.DEV && <PerformanceMonitor />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
