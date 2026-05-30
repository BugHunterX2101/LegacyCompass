import { useState, useEffect, useMemo, useCallback } from 'react';
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
import { ConversationIntelligence } from './components/ai/ConversationIntelligence';
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
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { subscribeToLeadUpdates } from './services/realTimeLeadService';
import { notificationService } from './services/notificationService';

type TabType = 'home' | 'dashboard' | 'leads' | 'enrichment' | 'ai-insights' | 'ai-email' | 'market-analysis' | 'conversation';

const SCORE_RANGES = [
  { range: '0-20', min: 0, max: 20 },
  { range: '21-40', min: 21, max: 40 },
  { range: '41-60', min: 41, max: 60 },
  { range: '61-80', min: 61, max: 80 },
  { range: '81-100', min: 81, max: 100 },
];

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

  // Derive selectedLead from leads array so it's never stale after enrichment
  const selectedLead = useMemo(
    () => (selectedLeadId ? leads.find(l => l.id === selectedLeadId) || null : null),
    [selectedLeadId, leads]
  );

  // Initialize with data from service (includes seed data for first-time users)
  useEffect(() => {
    const initialLeads = getInitialLeads();
    setLeads(initialLeads);

    // Subscribe to real-time updates (enrichment, scraping, etc.)
    const unsubscribe = subscribeToLeadUpdates((updatedLeads) => {
      setLeads(updatedLeads);
    });

    return unsubscribe;
  }, []);

  // Update virtualization threshold based on lead count
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
        (lead.contactPerson && lead.contactPerson.toLowerCase().includes(query))
      );
    }

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
          case 'between': {
            const [min, max] = String(filterValue).split(',').map(Number);
            return Number(fieldValue) >= min && Number(fieldValue) <= max;
          }
          default:
            return true;
        }
      });
    });

    return filtered;
  }, [leads, searchFilters, searchQuery]);

  // Stable callback reference to prevent AdvancedSearch re-render loop
  const handleSearch = useCallback((filters: SearchFilter[], query: string) => {
    setSearchFilters(filters);
    setSearchQuery(query);
  }, []);

  const handleImport = (importedLeads: any[]) => {
    const newLeads = importedLeads.map(lead => ({
      ...lead,
      id: lead.id || `imported-${Date.now()}-${Math.random()}`,
      tags: lead.tags || [],
      createdAt: lead.createdAt ? new Date(lead.createdAt) : new Date(),
      updatedAt: new Date(),
    }));

    newLeads.forEach((lead: Lead) => addRealTimeLead(lead));

    notificationService.success(
      'Import Successful',
      `Successfully imported ${newLeads.length} leads`
    );
    setShowImportModal(false);
  };

  const handleScrapeComplete = (scrapedLeads: any[]) => {
    const existingIds = new Set(leads.map(l => l.id));
    const uniqueNewLeads = scrapedLeads.filter((lead: any) => !existingIds.has(lead.id));
    uniqueNewLeads.forEach((lead: any) => addRealTimeLead(lead));

    notificationService.success(
      'Scraping Complete',
      `Successfully scraped ${uniqueNewLeads.length} new leads`
    );
    setShowScrapeModal(false);
  };

  const handleExport = async () => {
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
    // updateRealTimeLead triggers the subscription which updates leads state
    updateRealTimeLead(leadId, enrichedLead);

    notificationService.success(
      'Lead Enriched',
      `${enrichedLead.companyName} has been enriched with real-time data`
    );
  };

  const handleLeadSelection = useCallback((leadIds: string[]) => {
    setSelectedLeads(leadIds);
  }, []);

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
        avgScore: Math.round(stats.totalScore / stats.count),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [leads]);

  const scoreDistribution = useMemo(() =>
    SCORE_RANGES.map(range => ({
      range: range.range,
      count: leads.filter(lead => lead.score >= range.min && lead.score <= range.max).length,
    })),
    [leads]
  );

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

      case 'dashboard': {
        const statusCounts = leads.reduce((acc, l) => {
          acc[l.status] = (acc[l.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const statusData = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
        const recentLeads = [...leads]
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 5);

        return (
          <div className="space-y-6">
            <DashboardStats leads={leads} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopIndustriesChart data={topIndustries} />
              <ScoreDistributionChart data={scoreDistribution} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lead Status Breakdown */}
              <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Lead Status Breakdown</h3>
                <div className="space-y-3">
                  {statusData.map((item, index) => {
                    const total = leads.length || 1;
                    const pct = Math.round((item.count / total) * 100);
                    const statusColors: Record<string, string> = {
                      new: 'from-blue-500 to-blue-600',
                      contacted: 'from-yellow-500 to-yellow-600',
                      qualified: 'from-green-500 to-green-600',
                      converted: 'from-emerald-500 to-emerald-600',
                      rejected: 'from-red-500 to-red-600',
                    };
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-300 capitalize">{item.status}</span>
                          <span className="text-white font-medium">{item.count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${statusColors[item.status] || 'from-gray-500 to-gray-600'} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Leads */}
              <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recently Updated Leads</h3>
                <div className="space-y-3">
                  {recentLeads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-[#161B22] rounded-lg border border-gray-700">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">{lead.companyName}</div>
                        <div className="text-xs text-gray-400">
                          {lead.industry} &bull; {lead.contactPerson || 'No contact'}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-3">
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                          lead.status === 'qualified' ? 'bg-green-900/40 text-green-300' :
                          lead.status === 'converted' ? 'bg-emerald-900/40 text-emerald-300' :
                          lead.status === 'contacted' ? 'bg-yellow-900/40 text-yellow-300' :
                          lead.status === 'rejected' ? 'bg-red-900/40 text-red-300' :
                          'bg-blue-900/40 text-blue-300'
                        }`}>{lead.status}</span>
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
          <AIInsightsPanel lead={selectedLead} />
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

      case 'market-analysis': {
        const topIndustry = topIndustries[0]?.name || 'Technology';
        const allIndustries = [...new Set(leads.map(l => l.industry))].filter(Boolean).sort();
        const locationCounts = leads.reduce((acc, l) => {
          acc[l.location] = (acc[l.location] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const sortedLocations = Object.entries(locationCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([loc]) => loc);
        const topLocation = sortedLocations[0] || 'San Francisco, CA';
        return (
          <AIMarketAnalysisComponent
            industry={topIndustry}
            location={topLocation}
            industries={allIndustries.length > 0 ? allIndustries : [topIndustry]}
            locations={sortedLocations.length > 0 ? sortedLocations : [topLocation]}
          />
        );
      }

      case 'conversation':
        return selectedLead ? (
          <ConversationIntelligence lead={selectedLead} messages={[]} />
        ) : (
          <div className="text-center py-12 text-gray-400">
            Select a lead to analyze conversation intelligence
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0D1117]">
        <TopBar
          onImport={() => setShowImportModal(true)}
          onScrape={() => setShowScrapeModal(true)}
          onExport={handleExport}
        />

        {/* Navigation */}
        <nav className="bg-[#161B22] border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto">
              {[
                { id: 'home', label: 'Home', Icon: HomeIcon },
                { id: 'dashboard', label: 'Dashboard', Icon: ChartBarIcon },
                { id: 'leads', label: 'Leads', Icon: UserGroupIcon },
                { id: 'enrichment', label: 'Enrichment', Icon: SparklesIcon },
                { id: 'ai-insights', label: 'AI Insights', Icon: LightBulbIcon },
                { id: 'ai-email', label: 'AI Email', Icon: EnvelopeIcon },
                { id: 'conversation', label: 'Conversation AI', Icon: ChatBubbleLeftRightIcon },
                { id: 'market-analysis', label: 'Market AI', Icon: ArrowTrendingUpIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <tab.Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.id === 'leads' && filteredLeads.length > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {filteredLeads.length}
                    </span>
                  )}
                  {(tab.id === 'ai-insights' || tab.id === 'ai-email' || tab.id === 'conversation') && selectedLead && (
                    <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      1
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className={activeTab === 'home' ? '' : 'max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'}>
          <div key={activeTab} className="animate-fade-in-up">
            {/* Lead Selection for AI Features */}
            {(activeTab === 'ai-insights' || activeTab === 'ai-email' || activeTab === 'conversation') && !selectedLead && (
              <div className="mb-6 bg-[#1E2328] rounded-lg border border-gray-700 p-4">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Select a Lead for AI Analysis
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Choose a lead to generate {activeTab === 'ai-insights' ? 'AI-powered insights' : activeTab === 'conversation' ? 'conversation intelligence' : 'personalized emails'}
                </p>
                <input
                  type="text"
                  placeholder="Search leads by name, industry, or location..."
                  className="w-full px-3 py-2 mb-4 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                  {filteredLeads.slice(0, 18).map((lead, idx) => (
                    <button
                      key={lead.id}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className="p-3 bg-[#161B22] border border-gray-700 rounded-lg hover:border-blue-500 transition-all duration-200 text-left animate-fade-in-up"
                      style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'backwards' }}
                    >
                      <div className="font-medium text-white truncate">{lead.companyName}</div>
                      <div className="text-sm text-gray-400 truncate">
                        {lead.industry} &bull; {lead.location}
                      </div>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          lead.score >= 80 ? 'bg-green-900/40 text-green-300' :
                          lead.score >= 60 ? 'bg-yellow-900/40 text-yellow-300' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          Score: {lead.score}
                        </span>
                        {lead.contactPerson && (
                          <span className="text-xs text-gray-500 truncate">{lead.contactPerson}</span>
                        )}
                      </div>
                    </button>
                  ))}
                  {filteredLeads.length === 0 && (
                    <div className="col-span-3 text-center py-6 text-gray-400">
                      No leads found. Try a different search or scrape new leads.
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedLead && (activeTab === 'ai-insights' || activeTab === 'ai-email' || activeTab === 'conversation') && (
              <div className="mb-6 bg-[#1E2328] rounded-lg border border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedLead.companyName}</h3>
                    <p className="text-sm text-gray-400">
                      {selectedLead.industry} / {selectedLead.location}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedLeadId(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Change Lead
                  </button>
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
        <footer className="bg-[#161B22] border-t border-gray-700 mt-12">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Copyright {new Date().getFullYear()} LegacyCompass Lead Intelligence Platform. Built with React &amp; TypeScript.
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Total Leads: {leads.length}</span>
                <span>/</span>
                <span>Filtered: {filteredLeads.length}</span>
                {selectedLeads.length > 0 && (
                  <>
                    <span>/</span>
                    <span>Selected: {selectedLeads.length}</span>
                  </>
                )}
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
