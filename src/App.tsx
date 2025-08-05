import { useState, useEffect } from 'react';
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
import { getInitialLeads, exportLeadsToCSV, downloadFile } from './services/leadService';
import { subscribeToLeadUpdates } from './services/realTimeLeadService';
import { notificationService } from './services/notificationService';

export interface LeadTableProps {
  leads: Lead[];
  selectedLeads: string[];
  onSelection: (leadIds: string[]) => void;
  // ...other props
}

type TabType = 'home' | 'dashboard' | 'leads' | 'enrichment';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showScrapeModal, setShowScrapeModal] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize with mock data
  useEffect(() => {
    const initialLeads = getInitialLeads();
    setLeads(initialLeads);
    setFilteredLeads(initialLeads);

    // Subscribe to real-time updates
    const unsubscribe = subscribeToLeadUpdates((updatedLeads) => {
      setLeads(updatedLeads);
    });

    return unsubscribe;
  }, []);

  // Apply search filters
  useEffect(() => {
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

    setFilteredLeads(filtered);
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
    
    setLeads(prevLeads => [...prevLeads, ...newLeads]);
    notificationService.success(
      'Scraping Complete',
      `Successfully scraped ${newLeads.length} new leads`
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

  const handleEnrichLead = (_leadId: string) => {
    // This would typically update the lead with enriched data
    // For now, we'll just trigger a re-render
    setLeads(prevLeads => [...prevLeads]);
  };

  const handleLeadSelection = (leadIds: string[]) => {
    setSelectedLeads(leadIds);
  };

  // Calculate dashboard stats
  const dashboardStats = {
    totalLeads: leads.length,
    qualifiedLeads: leads.filter(lead => lead.score >= 70).length,
    averageScore: leads.length > 0 ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length) : 0,
    conversionRate: leads.length > 0 ? Math.round((leads.filter(lead => lead.status === 'converted').length / leads.length) * 100) : 0
  };

  // Calculate top industries
  const industryStats = leads.reduce((acc, lead) => {
    if (!acc[lead.industry]) {
      acc[lead.industry] = { count: 0, totalScore: 0 };
    }
    acc[lead.industry].count++;
    acc[lead.industry].totalScore += lead.score;
    return acc;
  }, {} as Record<string, { count: number; totalScore: number }>);

  const topIndustries = Object.entries(industryStats)
    .map(([name, stats]) => ({
      name,
      count: stats.count,
      avgScore: Math.round(stats.totalScore / stats.count)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate score distribution
  const scoreRanges = [
    { range: '0-20', min: 0, max: 20 },
    { range: '21-40', min: 21, max: 40 },
    { range: '41-60', min: 41, max: 60 },
    { range: '61-80', min: 61, max: 80 },
    { range: '81-100', min: 81, max: 100 }
  ];

  const scoreDistribution = scoreRanges.map(range => ({
    range: range.range,
    count: leads.filter(lead => lead.score >= range.min && lead.score <= range.max).length
  }));

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage 
            onNavigate={(tab: string) => setActiveTab(tab as TabType)}
            onStartScrape={() => setShowScrapeModal(true)}
          />
        );
      
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats leads={leads} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopIndustriesChart data={topIndustries} />
              <ScoreDistributionChart data={scoreDistribution} />
            </div>
          </div>
        );
      
      case 'leads':
        return (
          <div className="space-y-6">
            <AdvancedSearch 
              onSearch={handleSearch}
              onResultsCount={() => {}} 
            />
            <LeadTable 
              leads={filteredLeads}
              selectedLeads={selectedLeads}
              onLeadSelect={handleLeadSelection}
            />
          </div>
        );
      
      case 'enrichment':
        return (
          <EnrichmentPanel 
            leads={filteredLeads}
            onEnrich={handleEnrichLead}
          />
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
            <div className="flex space-x-8">
              {[
                { id: 'home', label: 'Home', icon: '🏠' },
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'leads', label: 'Leads', icon: '👥' },
                { id: 'enrichment', label: 'Enrichment', icon: '✨' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.id === 'leads' && filteredLeads.length > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {filteredLeads.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {renderContent()}
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
                © 2024 LegacyCompass Lead Intelligence Platform. Built with React & TypeScript.
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Total Leads: {leads.length}</span>
                <span>•</span>
                <span>Filtered: {filteredLeads.length}</span>
                {selectedLeads.length > 0 && (
                  <>
                    <span>•</span>
                    <span>Selected: {selectedLeads.length}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </footer>
        
        {/* Notifications */}
        <NotificationContainer />
      </div>
    </ErrorBoundary>
  );
}

export default App;