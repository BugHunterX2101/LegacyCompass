import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { Lead, SearchFilter } from './types';
import { TopBar } from './components/layout/TopBar';
import { DashboardStats } from './components/dashboard/DashboardStats';
import { TopIndustriesChart } from './components/dashboard/TopIndustriesChart';
import { ScoreDistributionChart } from './components/dashboard/ScoreDistributionChart';
import { LeadTable } from './components/leads/LeadTable';
import { AdvancedSearch } from './components/search/AdvancedSearch';
import { EnrichmentPanel } from './components/enrichment/EnrichmentPanel';
import { ImportModal } from './components/import/ImportModal';
import { ScrapeModal } from './components/scraping/ScrapeModal';
import { StatusBadge } from './components/common/StatusBadge';
import { NotificationContainer } from './components/common/NotificationContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AIInsightsPanel } from './components/ai/AIInsightsPanel';
import { AIEmailGenerator } from './components/ai/AIEmailGenerator';
import { AIMarketAnalysisComponent } from './components/ai/AIMarketAnalysis';
import { ConversationIntelligence } from './components/ai/ConversationIntelligence';
import { VirtualizedLeadTable } from './components/performance/VirtualizedLeadTable';
import { PerformanceMonitor } from './components/performance/PerformanceMonitor';
import { NewsFeed } from './components/dashboard/NewsFeed';
import { getInitialLeads, exportLeadsToCSV, downloadFile } from './services/leadService';
import { addRealTimeLead, updateRealTimeLead, subscribeToLeadUpdates } from './services/realTimeLeadService';
import {
  HomeIcon,
  ChartBarIcon,
  UserGroupIcon,
  SparklesIcon,
  LightBulbIcon,
  EnvelopeIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { notificationService } from './services/notificationService';

const HomePage = lazy(() =>
  import('./components/homepage/HomePage').then(m => ({ default: m.HomePage }))
);

type TabType = 'home' | 'dashboard' | 'leads' | 'enrichment' | 'ai-insights' | 'ai-email' | 'market-analysis' | 'conversation';

const SCORE_RANGES = [
  { range: '0-20', min: 0, max: 20 },
  { range: '21-40', min: 21, max: 40 },
  { range: '41-60', min: 41, max: 60 },
  { range: '61-80', min: 61, max: 80 },
  { range: '81-100', min: 81, max: 100 },
];

const AI_TABS: TabType[] = ['ai-insights', 'ai-email', 'conversation'];

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showScrapeModal, setShowScrapeModal] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [useVirtualization, setUseVirtualization] = useState(false);
  const [aiLeadSearch, setAiLeadSearch] = useState('');

  const selectedLead = useMemo(
    () => (selectedLeadId ? leads.find(l => l.id === selectedLeadId) ?? null : null),
    [selectedLeadId, leads]
  );

  useEffect(() => {
    if (selectedLeadId && leads.length > 0 && !leads.find(l => l.id === selectedLeadId)) {
      setSelectedLeadId(null);
    }
  }, [leads, selectedLeadId]);

  useEffect(() => {
    const initialLeads = getInitialLeads();
    setLeads(initialLeads);
    const unsubscribe = subscribeToLeadUpdates((updatedLeads) => {
      setLeads(updatedLeads);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    setUseVirtualization(leads.length > 500);
  }, [leads.length]);

  const filteredLeads = useMemo(() => {
    let filtered = leads;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.companyName.toLowerCase().includes(query) ||
        lead.industry.toLowerCase().includes(query) ||
        lead.location.toLowerCase().includes(query) ||
        (lead.contactPerson?.toLowerCase().includes(query))
      );
    }
    for (const filter of searchFilters) {
      filtered = filtered.filter(lead => {
        const fieldValue = lead[filter.field as keyof Lead];
        if (fieldValue === undefined || fieldValue === null) return false;
        switch (filter.operator) {
          case 'equals': return String(fieldValue).toLowerCase() === String(filter.value).toLowerCase();
          case 'contains': return String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'greater': return Number(fieldValue) > Number(filter.value);
          case 'less': return Number(fieldValue) < Number(filter.value);
          case 'between': {
            const [mn, mx] = String(filter.value).split(',').map(Number);
            return Number(fieldValue) >= mn && Number(fieldValue) <= mx;
          }
          default: return true;
        }
      });
    }
    return filtered;
  }, [leads, searchFilters, searchQuery]);

  const handleSearch = useCallback((filters: SearchFilter[], query: string) => {
    setSearchFilters(filters);
    setSearchQuery(query);
  }, []);

  const handleImport = useCallback((importedLeads: Record<string, unknown>[]) => {
    const newLeads: Lead[] = importedLeads.map(raw => ({
      ...(raw as unknown as Lead),
      id: (raw.id as string) || `imported-${Date.now()}-${Math.random()}`,
      tags: (raw.tags as string[]) || [],
      createdAt: raw.createdAt ? new Date(raw.createdAt as string | number) : new Date(),
      updatedAt: new Date(),
    }));
    newLeads.forEach(lead => addRealTimeLead(lead));
    notificationService.success('Import Successful', `Successfully imported ${newLeads.length} leads`);
    setShowImportModal(false);
  }, []);

  const handleScrapeComplete = useCallback((scrapedLeads: Lead[]) => {
    const existingIds = new Set(leads.map(l => l.id));
    const uniqueNewLeads = scrapedLeads.filter(lead => !existingIds.has(lead.id));
    uniqueNewLeads.forEach(lead => addRealTimeLead(lead));
    notificationService.success('Scraping Complete', `Successfully scraped ${uniqueNewLeads.length} new leads`);
    setShowScrapeModal(false);
  }, [leads]);

  const handleExport = useCallback(async () => {
    const leadsToExport = selectedLeads.length > 0
      ? filteredLeads.filter(lead => selectedLeads.includes(lead.id))
      : filteredLeads;
    if (leadsToExport.length === 0) {
      notificationService.warning('No Leads', 'No leads available to export');
      return;
    }
    try {
      const csvData = exportLeadsToCSV(leadsToExport);
      downloadFile(csvData, `leads-export-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
      notificationService.success('Export Complete', `Successfully exported ${leadsToExport.length} leads`);
    } catch {
      notificationService.error('Export Failed', 'There was an error exporting your leads.');
    }
  }, [selectedLeads, filteredLeads]);

  const handleEnrichLead = useCallback((leadId: string, enrichedLead: Lead) => {
    updateRealTimeLead(leadId, enrichedLead);
    notificationService.success('Lead Enriched', `${enrichedLead.companyName} has been enriched`);
  }, []);

  const handleLeadSelection = useCallback((leadIds: string[]) => setSelectedLeads(leadIds), []);

  const handleSelectLeadForAI = useCallback((leadId: string) => {
    setSelectedLeadId(leadId);
    setActiveTab('ai-insights');
  }, []);

  const handleNavigate = useCallback((tab: string) => setActiveTab(tab as TabType), []);

  const topIndustries = useMemo(() => {
    const industryStats = leads.reduce((acc, lead) => {
      if (!acc[lead.industry]) acc[lead.industry] = { count: 0, totalScore: 0 };
      acc[lead.industry].count++;
      acc[lead.industry].totalScore += lead.score;
      return acc;
    }, {} as Record<string, { count: number; totalScore: number }>);
    return Object.entries(industryStats)
      .map(([name, stats]) => ({ name, count: stats.count, avgScore: Math.round(stats.totalScore / stats.count) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [leads]);

  const scoreDistribution = useMemo(() =>
    SCORE_RANGES.map(range => ({
      range: range.range,
      count: leads.filter(lead => lead.score >= range.min && lead.score <= range.max).length,
    })), [leads]);

  const renderAILeadSelector = () => {
    if (!AI_TABS.includes(activeTab) || selectedLead) return null;
    const aiQuery = aiLeadSearch.toLowerCase();
    const aiLeads = aiQuery
      ? leads.filter(l =>
          l.companyName.toLowerCase().includes(aiQuery) ||
          l.industry.toLowerCase().includes(aiQuery) ||
          l.location.toLowerCase().includes(aiQuery) ||
          l.contactPerson?.toLowerCase().includes(aiQuery))
      : leads;
    const tabLabel = activeTab === 'ai-insights' ? 'AI Insights' : activeTab === 'conversation' ? 'Conversation AI' : 'AI Email Generator';
    return (
      <div className="mb-6 bg-[#1E2328] rounded-lg border border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-1">Select a Lead for {tabLabel}</h3>
        <p className="text-sm text-gray-400 mb-3">Choose a lead to get started.</p>
        <input
          type="text"
          value={aiLeadSearch}
          placeholder="Search leads by name, industry, or location..."
          className="w-full px-3 py-2 mb-4 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setAiLeadSearch(e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1 modal-scroll">
          {aiLeads.slice(0, 18).map((lead, idx) => (
            <button
              key={lead.id}
              onClick={() => { setSelectedLeadId(lead.id); setAiLeadSearch(''); }}
              className="p-3 bg-[#161B22] border border-gray-700 rounded-lg hover:border-blue-500 transition-all duration-200 text-left animate-fade-in-up"
              style={{ animationDelay: `${idx * 30}ms`, animationFillMode: 'backwards' }}
            >
              <div className="font-medium text-white truncate text-sm">{lead.companyName}</div>
              <div className="text-sm text-gray-400 truncate">{lead.industry} &bull; {lead.location}</div>
              <div className="flex items-center mt-1 space-x-2">
                <span className={`text-xs px-1.5 py-0.5 rounded ${lead.score >= 80 ? 'bg-green-900/40 text-green-300' : lead.score >= 60 ? 'bg-yellow-900/40 text-yellow-300' : 'bg-gray-700 text-gray-300'}`}>
                  Score: {lead.score}
                </span>
                {lead.contactPerson && <span className="text-xs text-gray-500 truncate">{lead.contactPerson}</span>}
              </div>
            </button>
          ))}
          {aiLeads.length === 0 && (
            <div className="col-span-3 text-center py-6 text-gray-400">
              No leads match your search.{' '}
              <button className="text-blue-400 underline" onClick={() => setAiLeadSearch('')}>Clear filter</button>
            </div>
          )}
        </div>
        {leads.length === 0 && (
          <p className="text-center text-gray-500 text-sm mt-2">
            No leads yet.{' '}
            <button className="text-blue-400 underline" onClick={() => setActiveTab('leads')}>Go to Leads</button>{' '}
            or use Scrape to add some.
          </p>
        )}
      </div>
    );
  };

  const renderSelectedLeadHeader = () => {
    if (!AI_TABS.includes(activeTab) || !selectedLead) return null;
    return (
      <div className="mb-6 bg-[#1E2328] rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">{selectedLead.companyName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">{selectedLead.companyName}</h3>
              <p className="text-sm text-gray-400">
                {selectedLead.industry} &bull; {selectedLead.location}
                {selectedLead.contactPerson && <> &bull; {selectedLead.contactPerson}</>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2 py-1 rounded-full ${selectedLead.score >= 80 ? 'bg-green-900/40 text-green-300 border border-green-700/30' : selectedLead.score >= 60 ? 'bg-yellow-900/40 text-yellow-300 border border-yellow-700/30' : 'bg-gray-700 text-gray-300 border border-gray-600/30'}`}>
              Score: {selectedLead.score}
            </span>
            <button
              onClick={() => { setSelectedLeadId(null); setAiLeadSearch(''); }}
              className="text-gray-400 hover:text-white text-sm transition-colors px-3 py-1.5 rounded-md hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600"
            >
              Change Lead
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Suspense fallback={<div className="flex items-center justify-center py-24"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}>
            <HomePage onNavigate={handleNavigate} onStartScrape={() => setShowScrapeModal(true)} leadCount={leads.length} industryCount={new Set(leads.map(l => l.industry)).size} />
          </Suspense>
        );

      case 'dashboard': {
        const statusCounts = leads.reduce((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {} as Record<string, number>);
        const statusData = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
        const recentLeads = [...leads].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);
        return (
          <div className="space-y-6">
            <DashboardStats leads={leads} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopIndustriesChart data={topIndustries} />
              <ScoreDistributionChart data={scoreDistribution} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Lead Status Breakdown</h3>
                <div className="space-y-3">
                  {statusData.map((item, index) => {
                    const pct = Math.round((item.count / (leads.length || 1)) * 100);
                    const statusColors: Record<string, string> = { new: 'from-blue-500 to-blue-600', contacted: 'from-yellow-500 to-yellow-600', qualified: 'from-green-500 to-green-600', converted: 'from-emerald-500 to-emerald-600', rejected: 'from-red-500 to-red-600' };
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-300 capitalize">{item.status}</span>
                          <span className="text-white font-medium">{item.count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className={`h-2 rounded-full bg-gradient-to-r ${statusColors[item.status] || 'from-gray-500 to-gray-600'} transition-all duration-500`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recently Updated Leads</h3>
                <div className="space-y-3">
                  {recentLeads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-[#161B22] rounded-lg border border-gray-700">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate text-sm">{lead.companyName}</div>
                        <div className="text-xs text-gray-400">{lead.industry} &bull; {lead.contactPerson || 'No contact'}</div>
                      </div>
                      <div className="flex items-center space-x-2 ml-3">
                        <StatusBadge status={lead.status} size="sm" />
                        <span className="text-sm font-semibold text-white">{lead.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <NewsFeed query="B2B sales lead generation" title="Latest Industry News" maxResults={5} />
          </div>
        );
      }

      case 'leads':
        return (
          <div className="space-y-6">
            <AdvancedSearch onSearch={handleSearch} onResultsCount={(c) => console.debug('results:', c)} />
            {useVirtualization ? (
              <VirtualizedLeadTable leads={filteredLeads} selectedLeads={selectedLeads} onLeadSelect={handleLeadSelection} onSelectLeadForAI={handleSelectLeadForAI} containerHeight={600} />
            ) : (
              <LeadTable leads={filteredLeads} selectedLeads={selectedLeads} onLeadSelect={handleLeadSelection} onSelectLeadForAI={handleSelectLeadForAI} />
            )}
          </div>
        );

      case 'enrichment':
        return <EnrichmentPanel leads={leads} onEnrich={handleEnrichLead} />;

      case 'ai-insights':
        return selectedLead ? <AIInsightsPanel lead={selectedLead} /> : null;

      case 'ai-email':
        return selectedLead ? <AIEmailGenerator lead={selectedLead} /> : null;

      case 'market-analysis': {
        const topIndustry = topIndustries[0]?.name || 'Technology';
        const allIndustries = [...new Set(leads.map(l => l.industry))].filter(Boolean).sort();
        const locationCounts = leads.reduce((acc, l) => { acc[l.location] = (acc[l.location] || 0) + 1; return acc; }, {} as Record<string, number>);
        const sortedLocations = Object.entries(locationCounts).sort((a, b) => b[1] - a[1]).map(([loc]) => loc);
        return (
          <AIMarketAnalysisComponent
            industry={topIndustry}
            location={sortedLocations[0] || 'San Francisco, CA'}
            industries={allIndustries.length > 0 ? allIndustries : [topIndustry]}
            locations={sortedLocations.length > 0 ? sortedLocations : ['San Francisco, CA']}
          />
        );
      }

      case 'conversation':
        return selectedLead ? <ConversationIntelligence lead={selectedLead} messages={[]} /> : null;

      default:
        return null;
    }
  };

  const navTabs = [
    { id: 'home' as TabType,            label: 'Home',            Icon: HomeIcon },
    { id: 'dashboard' as TabType,       label: 'Dashboard',       Icon: ChartBarIcon },
    { id: 'leads' as TabType,           label: 'Leads',           Icon: UserGroupIcon },
    { id: 'enrichment' as TabType,      label: 'Enrichment',      Icon: SparklesIcon },
    { id: 'ai-insights' as TabType,     label: 'AI Insights',     Icon: LightBulbIcon },
    { id: 'ai-email' as TabType,        label: 'AI Email',        Icon: EnvelopeIcon },
    { id: 'conversation' as TabType,    label: 'Conversation AI', Icon: ChatBubbleLeftRightIcon },
    { id: 'market-analysis' as TabType, label: 'Market AI',       Icon: ArrowTrendingUpIcon },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0D1117]">
        <TopBar onImport={() => setShowImportModal(true)} onScrape={() => setShowScrapeModal(true)} onExport={handleExport} />

        <nav className="bg-[#161B22] border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto nav-scrollbar">
              {navTabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 whitespace-nowrap ${activeTab === id ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                  {id === 'leads' && filteredLeads.length > 0 && (
                    <span className="bg-blue-600/20 text-blue-300 text-xs rounded-full px-2 py-0.5 border border-blue-600/30">{filteredLeads.length}</span>
                  )}
                  {AI_TABS.includes(id) && selectedLead && (
                    <span className="bg-green-600/20 text-green-300 text-xs rounded-full px-2 py-0.5 border border-green-600/30 max-w-[80px] truncate hidden md:inline">{selectedLead.companyName}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <main className={activeTab === 'home' ? '' : 'max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'}>
          <div key={activeTab} className="animate-fade-in-up">
            {renderAILeadSelector()}
            {renderSelectedLeadHeader()}
            {renderContent()}
          </div>
        </main>

        <footer className="bg-[#161B22] border-t border-gray-700/50 mt-12">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs text-gray-500">&copy; {new Date().getFullYear()} LegacyCompass &mdash; Lead Intelligence Platform</div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {selectedLeads.length > 0 && <span className="text-blue-400">{selectedLeads.length} selected</span>}
                <span>{leads.length.toLocaleString()} total leads</span>
                <span className="text-gray-600">&bull;</span>
                <span>React &amp; TypeScript</span>
              </div>
            </div>
          </div>
        </footer>

        <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} onImport={handleImport} />
        <ScrapeModal isOpen={showScrapeModal} onClose={() => setShowScrapeModal(false)} onComplete={handleScrapeComplete} />
        <NotificationContainer />
        {import.meta.env.DEV && <PerformanceMonitor />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
