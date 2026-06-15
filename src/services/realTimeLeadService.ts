import { Lead } from '../types';
import { scrapeLeadsWithRealAI, enrichLeadWithRealAIData } from './realAIService';


const USE_REAL_AI = true;
const STORAGE_KEY = 'legacycompass_leads';
const SEED_VERSION_KEY = 'legacycompass_seed_version';
const CURRENT_SEED_VERSION = '1.0';

// Real-time lead service with localStorage persistence
class RealTimeLeadService {
  private leads: Lead[] = [];
  private listeners: ((leads: Lead[]) => void)[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const seedVersion = localStorage.getItem(SEED_VERSION_KEY);

      if (stored && seedVersion === CURRENT_SEED_VERSION) {
        const parsed = JSON.parse(stored);
        this.leads = parsed.map((lead: Lead) => ({
          ...lead,
          createdAt: new Date(lead.createdAt),
          updatedAt: new Date(lead.updatedAt),
        }));
      } else {
        this.leads = [];
        this.saveToLocalStorage();
        localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION);
      }
    } catch (e) {
      console.error('Failed to load leads from localStorage:', e);
      this.leads = [];
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.leads));
    } catch (e) {
      console.error('Failed to save leads to localStorage:', e);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.leads]));
  }

  getLeads(): Lead[] {
    return [...this.leads];
  }

  subscribe(listener: (leads: Lead[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  addLead(lead: Lead): void {
    if (!this.leads.find(l => l.id === lead.id)) {
      this.leads.unshift(lead);
      this.saveToLocalStorage();
      this.notifyListeners();
    }
  }

  updateLead(id: string, updates: Partial<Lead>): void {
    const index = this.leads.findIndex(lead => lead.id === id);
    if (index !== -1) {
      this.leads[index] = { ...this.leads[index], ...updates, updatedAt: new Date() };
      this.saveToLocalStorage();
      this.notifyListeners();
    }
  }

  deleteLead(id: string): void {
    this.leads = this.leads.filter(lead => lead.id !== id);
    this.saveToLocalStorage();
    this.notifyListeners();
  }

  destroy(): void {
    this.listeners = [];
  }
}

const realTimeLeadService = new RealTimeLeadService();

export const getRealTimeLeads = (): Lead[] => realTimeLeadService.getLeads();

export const subscribeToLeadUpdates = (listener: (leads: Lead[]) => void): (() => void) =>
  realTimeLeadService.subscribe(listener);

export const addRealTimeLead = (lead: Lead): void => realTimeLeadService.addLead(lead);

export const updateRealTimeLead = (id: string, updates: Partial<Lead>): void =>
  realTimeLeadService.updateLead(id, updates);

export const deleteRealTimeLead = (id: string): void => realTimeLeadService.deleteLead(id);

export const scrapeRealTimeLeads = async (
  source: string,
  query: string,
  maxResults: number = 50
): Promise<Lead[]> => {
  if (USE_REAL_AI) {
    try {
      const aiLeads = await scrapeLeadsWithRealAI(source, query, maxResults);
      return aiLeads.map((data: Record<string, unknown>, i: number) => {
        const lead: Lead = {
          id: `scraped-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          companyName: (data.companyName as string) || 'Unknown Company',
          contactPerson: (data.contactPerson as string) || undefined,
          title: (data.title as string) || undefined,
          email: (data.email as string) || undefined,
          phone: (data.phone as string) || undefined,
          website: (data.website as string) || '',
          location: (data.location as string) || '',
          industry: (data.industry as string) || 'Technology',
          employeeCount: (data.employeeCount as number) || 50,
          revenue: (data.revenue as number) || undefined,
          score: 0,
          status: 'new' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
          description: (data.description as string) || undefined,
          tags: ['scraped', source],
          source,
        };
        lead.score = calculateLeadScore(lead);
        return lead;
      });
    } catch (error) {
      console.error('Real AI scraping failed:', error);
      throw new Error(
        'AI service is unavailable. Please ensure the /api/ai proxy is running and try again.'
      );
    }
  }
  throw new Error('AI service is unavailable. Please ensure the /api/ai proxy is running and try again.');
};

// Validate enrichment field values - reject placeholders and unknowns
const INVALID_VALUES = ['unknown', 'n/a', 'na', 'none', 'missing', 'not available', 'not found', 'null', 'undefined', ''];
const isValidField = (val: unknown): val is string => {
  if (typeof val !== 'string') return false;
  const trimmed = val.trim();
  if (!trimmed) return false;
  return !INVALID_VALUES.includes(trimmed.toLowerCase());
};
const isValidNum = (val: unknown): val is number => typeof val === 'number' && val > 0;

export const calculateLeadScore = (lead: Lead): number => {
  let score = 0;

  if (lead.employeeCount > 1000) score += 20;
  else if (lead.employeeCount > 500) score += 18;
  else if (lead.employeeCount > 100) score += 15;
  else if (lead.employeeCount > 10) score += 10;
  else score += 5;

  if (lead.revenue && lead.revenue > 100000000) score += 20;
  else if (lead.revenue && lead.revenue > 10000000) score += 18;
  else if (lead.revenue && lead.revenue > 1000000) score += 14;
  else if (lead.revenue && lead.revenue > 100000) score += 10;
  else score += 5;

  const highValueIndustries = ['Technology', 'Financial Services', 'Healthcare', 'Software', 'Fintech', 'SaaS'];
  const mediumValueIndustries = ['Manufacturing', 'Retail', 'Real Estate', 'Energy', 'Telecommunications'];
  if (highValueIndustries.some(ind => lead.industry.toLowerCase().includes(ind.toLowerCase()))) score += 15;
  else if (mediumValueIndustries.some(ind => lead.industry.toLowerCase().includes(ind.toLowerCase()))) score += 10;
  else score += 7;

  if (lead.email) score += 5;
  if (lead.phone) score += 5;
  if (lead.contactPerson) score += 5;
  if (lead.title) score += 3;
  if (lead.website) score += 3;
  if (lead.linkedinProfile || lead.socialMedia?.linkedin) score += 3;
  if (lead.description) score += 3;
  if (lead.socialMedia?.twitter) score += 1;
  if (lead.revenue && lead.revenue > 0) score += 2;

  const tierOneCities = ['San Francisco', 'New York', 'London', 'Singapore', 'Tokyo', 'Berlin', 'Los Angeles', 'Seattle', 'Boston', 'Chicago'];
  if (tierOneCities.some(city => lead.location.includes(city))) score += 10;
  else score += 5;

  if (lead.status === 'qualified') score += 5;
  else if (lead.status === 'contacted') score += 3;
  else if (lead.status === 'converted') score += 5;

  return Math.min(Math.max(score, 1), 100);
};

export const enrichLeadWithRealData = async (lead: Lead): Promise<Lead> => {
  if (USE_REAL_AI) {
    try {
      console.log('[Enrichment] Starting AI enrichment for:', lead.companyName, '(ID:', lead.id, ')');
      const aiData = await enrichLeadWithRealAIData(lead);
      console.log('[Enrichment] AI returned data:', JSON.stringify(aiData));

      if (!aiData || Object.keys(aiData).length === 0) {
        console.warn('[Enrichment] AI returned empty data, returning original lead');
        const unchanged = { ...lead, updatedAt: new Date() };
        realTimeLeadService.updateLead(lead.id, unchanged);
        return unchanged;
      }

      const enrichedLead: Lead = {
        ...lead,
        contactPerson: isValidField(aiData.contactPerson) ? (aiData.contactPerson as string) : lead.contactPerson,
        title: isValidField(aiData.title) ? (aiData.title as string) : lead.title,
        email: isValidField(aiData.email) ? (aiData.email as string) : lead.email,
        phone: isValidField(aiData.phone) ? (aiData.phone as string) : lead.phone,
        website: isValidField(aiData.website) ? (aiData.website as string) : lead.website,
        linkedinProfile: isValidField(aiData.linkedinProfile) ? (aiData.linkedinProfile as string) : lead.linkedinProfile,
        description: isValidField(aiData.description) ? (aiData.description as string) : lead.description,
        revenue: isValidNum(aiData.revenue) ? (aiData.revenue as number) : lead.revenue,
        employeeCount: isValidNum(aiData.employeeCount) ? (aiData.employeeCount as number) : lead.employeeCount,
        socialMedia: {
          linkedin: isValidField(aiData.linkedinProfile) ? (aiData.linkedinProfile as string) : lead.socialMedia?.linkedin,
          twitter: isValidField(aiData.twitterHandle) ? (aiData.twitterHandle as string) : lead.socialMedia?.twitter,
          facebook: lead.socialMedia?.facebook,
        },
        tags: Array.isArray(aiData.tags) && (aiData.tags as string[]).length > 0 ? (aiData.tags as string[]) : lead.tags,
        updatedAt: new Date(),
      };

      enrichedLead.score = calculateLeadScore(enrichedLead);
      realTimeLeadService.updateLead(lead.id, enrichedLead);
      console.log('[Enrichment] Persisted enriched data for:', lead.companyName);
      return enrichedLead;
    } catch (error) {
      console.error('[Enrichment] Real AI enrichment failed, returning original lead:', error);
      // FIXED: Return original lead instead of throwing - prevents UI from breaking
      const unchanged = { ...lead, updatedAt: new Date() };
      realTimeLeadService.updateLead(lead.id, unchanged);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'AI enrichment service is unavailable. Please ensure the /api/ai proxy is running.'
      );
    }
  }

  // No AI configured - return unchanged
  const unchanged = { ...lead, updatedAt: new Date() };
  realTimeLeadService.updateLead(lead.id, unchanged);
  return unchanged;
};

export const exportRealTimeLeads = (leads: Lead[], format: 'csv' | 'json'): string => {
  if (format === 'json') {
    return JSON.stringify(leads, null, 2);
  }

  const headers = [
    'Company Name', 'Contact Person', 'Title', 'Email', 'Phone', 'LinkedIn Profile',
    'Website', 'Location', 'Industry', 'Employee Count', 'Revenue', 'Score', 'Status',
  ];

  const csvContent = [
    headers.join(','),
    ...leads.map(lead => [
      `"${(lead.companyName || '').replace(/"/g, '""')}"`,
      `"${(lead.contactPerson || '').replace(/"/g, '""')}"`,
      `"${(lead.title || '').replace(/"/g, '""')}"`,
      `"${(lead.email || '').replace(/"/g, '""')}"`,
      `"${(lead.phone || '').replace(/"/g, '""')}"`,
      `"${(lead.linkedinProfile || '').replace(/"/g, '""')}"`,
      `"${(lead.website || '').replace(/"/g, '""')}"`,
      `"${(lead.location || '').replace(/"/g, '""')}"`,
      `"${(lead.industry || '').replace(/"/g, '""')}"`,
      lead.employeeCount || 0,
      lead.revenue || 0,
      lead.score || 0,
      `"${lead.status || ''}"`,
    ].join(',')),
  ].join('\n');

  return csvContent;
};
