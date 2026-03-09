import { Lead } from '../types';
import { scrapeLeadsWithRealAI, enrichLeadWithRealAIData } from './realAIService';

const USE_REAL_AI = true;
const STORAGE_KEY = 'legacycompass_leads';

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
      if (stored) {
        const parsed = JSON.parse(stored);
        this.leads = parsed.map((lead: Lead) => ({
          ...lead,
          createdAt: new Date(lead.createdAt),
          updatedAt: new Date(lead.updatedAt),
        }));
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

  // Public methods
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
    this.leads.unshift(lead);
    this.saveToLocalStorage();
    this.notifyListeners();
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

// Create singleton instance
const realTimeLeadService = new RealTimeLeadService();

// Export functions
export const getRealTimeLeads = (): Lead[] => {
  return realTimeLeadService.getLeads();
};

export const subscribeToLeadUpdates = (listener: (leads: Lead[]) => void): (() => void) => {
  return realTimeLeadService.subscribe(listener);
};

export const addRealTimeLead = (lead: Lead): void => {
  realTimeLeadService.addLead(lead);
};

export const updateRealTimeLead = (id: string, updates: Partial<Lead>): void => {
  realTimeLeadService.updateLead(id, updates);
};

export const deleteRealTimeLead = (id: string): void => {
  realTimeLeadService.deleteLead(id);
};

// Enhanced scraping function
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
      console.error('Real AI scraping failed, using fallback:', error);
    }
  }

  // Fallback: filter existing leads
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const allLeads = getRealTimeLeads();
  const queryLower = query.toLowerCase();
  
  // Filter leads based on query
  let filteredLeads = allLeads.filter(lead => 
    lead.companyName.toLowerCase().includes(queryLower) ||
    lead.industry.toLowerCase().includes(queryLower) ||
    lead.location.toLowerCase().includes(queryLower)
  );
  
  // If no matches, return random leads
  if (filteredLeads.length === 0) {
    filteredLeads = allLeads.sort(() => 0.5 - Math.random());
  }
  
  // Limit results
  const results = filteredLeads.slice(0, maxResults);
  
  // Add source tag and mark as scraped
  return results.map(lead => ({
    ...lead,
    id: `scraped-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    source: source,
    tags: [...lead.tags, 'scraped', source],
    createdAt: new Date(),
    updatedAt: new Date()
  }));
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

// Calculate lead score based on data completeness and company attributes
export const calculateLeadScore = (lead: Lead): number => {
  let score = 0;

  // Company size factor (0-20)
  if (lead.employeeCount > 1000) score += 20;
  else if (lead.employeeCount > 500) score += 18;
  else if (lead.employeeCount > 100) score += 15;
  else if (lead.employeeCount > 10) score += 10;
  else score += 5;

  // Revenue factor (0-20)
  if (lead.revenue && lead.revenue > 100000000) score += 20;
  else if (lead.revenue && lead.revenue > 10000000) score += 18;
  else if (lead.revenue && lead.revenue > 1000000) score += 14;
  else if (lead.revenue && lead.revenue > 100000) score += 10;
  else score += 5;

  // Industry factor (0-15)
  const highValueIndustries = ['Technology', 'Financial Services', 'Healthcare', 'Software', 'Fintech', 'SaaS'];
  const mediumValueIndustries = ['Manufacturing', 'Retail', 'Real Estate', 'Energy', 'Telecommunications'];
  if (highValueIndustries.some(ind => lead.industry.toLowerCase().includes(ind.toLowerCase()))) score += 15;
  else if (mediumValueIndustries.some(ind => lead.industry.toLowerCase().includes(ind.toLowerCase()))) score += 10;
  else score += 7;

  // Data completeness factor (0-30)
  if (lead.email) score += 5;
  if (lead.phone) score += 5;
  if (lead.contactPerson) score += 5;
  if (lead.title) score += 3;
  if (lead.website) score += 3;
  if (lead.linkedinProfile || lead.socialMedia?.linkedin) score += 3;
  if (lead.description) score += 3;
  if (lead.socialMedia?.twitter) score += 1;
  if (lead.revenue && lead.revenue > 0) score += 2;

  // Geographic factor (0-10)
  const tierOneCities = ['San Francisco', 'New York', 'London', 'Singapore', 'Tokyo', 'Berlin', 'Los Angeles', 'Seattle', 'Boston', 'Chicago'];
  if (tierOneCities.some(city => lead.location.includes(city))) score += 10;
  else score += 5;

  // Status factor (0-5)
  if (lead.status === 'qualified') score += 5;
  else if (lead.status === 'contacted') score += 3;
  else if (lead.status === 'converted') score += 5;

  return Math.min(Math.max(score, 1), 100);
};

// Enhanced enrichment function
export const enrichLeadWithRealData = async (lead: Lead): Promise<Lead> => {
  if (USE_REAL_AI) {
    try {
      console.log('[Enrichment] Starting AI enrichment for:', lead.companyName, '(ID:', lead.id, ')');
      const aiData = await enrichLeadWithRealAIData(lead);
      console.log('[Enrichment] AI returned data:', JSON.stringify(aiData));

      if (!aiData || Object.keys(aiData).length === 0) {
        console.warn('[Enrichment] AI returned empty data, using fallback');
        throw new Error('AI returned empty enrichment data');
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
        tags: Array.isArray(aiData.tags) && aiData.tags.length > 0 ? (aiData.tags as string[]) : lead.tags,
        updatedAt: new Date(),
      };

      // Recalculate score based on newly enriched data
      enrichedLead.score = calculateLeadScore(enrichedLead);

      // Directly persist to the singleton + localStorage
      realTimeLeadService.updateLead(lead.id, enrichedLead);
      console.log('[Enrichment] Persisted enriched data for:', lead.companyName);

      return enrichedLead;
    } catch (error) {
      console.error('[Enrichment] Real AI enrichment failed, using fallback:', error);
    }
  }

  // Fallback: template-based enrichment
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const enrichedLead = { ...lead };
  
  // Add missing email if not present
  if (!enrichedLead.email && enrichedLead.contactPerson) {
    const [firstName, lastName] = enrichedLead.contactPerson.split(' ');
    const domain = enrichedLead.companyName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15);
    enrichedLead.email = `${firstName?.toLowerCase()}.${lastName?.toLowerCase()}@${domain}.com`;
  }
  
  // Add phone if missing
  if (!enrichedLead.phone) {
    enrichedLead.phone = 'Contact via website';
  }
  
  // Add LinkedIn profile if missing
  if (!enrichedLead.linkedinProfile && enrichedLead.contactPerson) {
    const [firstName, lastName] = enrichedLead.contactPerson.split(' ');
    enrichedLead.linkedinProfile = `https://linkedin.com/in/${firstName?.toLowerCase()}-${lastName?.toLowerCase()}`;
  }
  
  // Add company description if missing
  if (!enrichedLead.description) {
    enrichedLead.description = `${enrichedLead.companyName} is a company in the ${enrichedLead.industry} industry.`;
  }
  
  // Update timestamp
  enrichedLead.updatedAt = new Date();
  
  // Recalculate score based on fallback enrichment
  enrichedLead.score = calculateLeadScore(enrichedLead);
  
  // Persist fallback enrichment too
  realTimeLeadService.updateLead(lead.id, enrichedLead);
  
  return enrichedLead;
};

// Export functions
export const exportRealTimeLeads = (leads: Lead[], format: 'csv' | 'json'): string => {
  if (format === 'json') {
    return JSON.stringify(leads, null, 2);
  }
  
  // CSV export
  const headers = [
    'Company Name', 'Contact Person', 'Title', 'Email', 'Phone', 'LinkedIn Profile',
    'Website', 'Location', 'Industry', 'Employee Count', 'Revenue', 'Score', 'Status'
  ];
  
  const csvContent = [
    headers.join(','),
    ...leads.map(lead => [
      `"${lead.companyName}"`,
      `"${lead.contactPerson || ''}"`,
      `"${lead.title || ''}"`,
      `"${lead.email || ''}"`,
      `"${lead.phone || ''}"`,
      `"${lead.linkedinProfile || ''}"`,
      `"${lead.website || ''}"`,
      `"${lead.location}"`,
      `"${lead.industry}"`,
      lead.employeeCount,
      lead.revenue || 0,
      lead.score,
      `"${lead.status}"`
    ].join(','))
  ].join('\n');
  
  return csvContent;
};