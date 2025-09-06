import { Lead } from '../types';
import { getAllGlobalCompanies, getCompaniesByCountry } from '../data/globalCompanies';

// Enhanced real-time lead service with 1000+ leads
class RealTimeLeadService {
  private leads: Lead[] = [];
  private listeners: ((leads: Lead[]) => void)[] = [];
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeLeads();
    this.startRealTimeUpdates();
  }

  private initializeLeads() {
    this.leads = this.generateComprehensiveLeads();
  }

  private generateComprehensiveLeads(): Lead[] {
    const leads: Lead[] = [];
    const companies = getAllGlobalCompanies();
    
    // Generate 1000+ leads from real companies
    for (let i = 0; i < Math.min(companies.length, 1200); i++) {
      const company = companies[i];
      const lead = this.createRealisticLead(company, i);
      leads.push(lead);
    }

    return leads;
  }

  private createRealisticLead(companyName: string, index: number): Lead {
    const industries = [
      'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
      'Education', 'Real Estate', 'Consulting', 'Marketing', 'Legal',
      'Automotive', 'Energy', 'Telecommunications', 'Media', 'Transportation',
      'Biotechnology', 'Pharmaceuticals', 'Insurance', 'Banking', 'Investment',
      'Software', 'Hardware', 'Aerospace', 'Defense', 'Agriculture'
    ];

    const locations = [
      'San Francisco, CA', 'New York, NY', 'Los Angeles, CA', 'Chicago, IL',
      'Boston, MA', 'Seattle, WA', 'Austin, TX', 'Denver, CO', 'Miami, FL',
      'Atlanta, GA', 'London, UK', 'Paris, France', 'Berlin, Germany',
      'Tokyo, Japan', 'Singapore', 'Sydney, Australia', 'Toronto, Canada',
      'Amsterdam, Netherlands', 'Stockholm, Sweden', 'Zurich, Switzerland'
    ];

    const firstNames = [
      'John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Christopher', 'Ashley',
      'Matthew', 'Amanda', 'Daniel', 'Jennifer', 'James', 'Lisa', 'Robert', 'Mary',
      'William', 'Patricia', 'Richard', 'Linda', 'Joseph', 'Barbara', 'Thomas', 'Susan'
    ];

    const lastNames = [
      'Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Miller', 'Jones', 'Garcia',
      'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Jackson', 'White',
      'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark'
    ];

    const titles = [
      'CEO', 'CTO', 'CFO', 'COO', 'CMO', 'VP of Sales', 'VP of Marketing',
      'VP of Engineering', 'Director of Sales', 'Director of Marketing',
      'Head of Business Development', 'Senior Vice President', 'President',
      'Founder', 'Co-Founder', 'Managing Director', 'General Manager'
    ];

    const statuses: Lead['status'][] = ['new', 'contacted', 'qualified', 'converted', 'rejected'];
    
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[index % lastNames.length];
    const contactPerson = `${firstName} ${lastName}`;
    const industry = industries[index % industries.length];
    const location = locations[index % locations.length];
    const title = titles[index % titles.length];
    const status = statuses[index % statuses.length];

    // Generate realistic employee counts and revenue based on company type
    const employeeCount = this.generateEmployeeCount(companyName);
    const revenue = this.generateRevenue(employeeCount);
    const score = this.generateScore(industry, employeeCount, revenue);

    const domain = companyName.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 15);

    return {
      id: `lead-${index + 1}`,
      companyName,
      industry,
      website: `https://www.${domain}.com`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}.com`,
      gmail: Math.random() > 0.7 ? `${firstName.toLowerCase()}${lastName.toLowerCase()}@gmail.com` : undefined,
      phone: this.generatePhoneNumber(location),
      contactPerson,
      title,
      location,
      employeeCount,
      revenue,
      score,
      status,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      socialMedia: {
        linkedin: `https://linkedin.com/company/${domain}`,
        twitter: Math.random() > 0.5 ? `https://twitter.com/${domain}` : undefined,
        facebook: Math.random() > 0.6 ? `https://facebook.com/${domain}` : undefined,
      },
      linkedinProfile: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 999)}`,
      description: this.generateCompanyDescription(companyName, industry),
      tags: this.generateTags(industry, employeeCount, status),
      notes: Math.random() > 0.8 ? this.generateNotes(status) : undefined,
      source: this.generateSource(),
    };
  }

  private generateEmployeeCount(companyName: string): number {
    // Large tech companies
    if (['Microsoft', 'Apple', 'Google', 'Amazon', 'Meta', 'IBM', 'Oracle'].includes(companyName)) {
      return Math.floor(Math.random() * 200000) + 100000;
    }
    // Medium companies
    if (Math.random() > 0.7) {
      return Math.floor(Math.random() * 10000) + 1000;
    }
    // Small companies
    return Math.floor(Math.random() * 500) + 10;
  }

  private generateRevenue(employeeCount: number): number {
    // Revenue roughly correlates with employee count
    const baseRevenue = employeeCount * (50000 + Math.random() * 200000);
    return Math.floor(baseRevenue);
  }

  private generateScore(industry: string, employeeCount: number, revenue: number): number {
    let score = 50; // Base score
    
    // Industry bonus
    if (['Technology', 'Software', 'Healthcare', 'Finance'].includes(industry)) {
      score += 20;
    }
    
    // Size bonus
    if (employeeCount > 1000) score += 15;
    else if (employeeCount > 100) score += 10;
    
    // Revenue bonus
    if (revenue > 100000000) score += 15;
    else if (revenue > 10000000) score += 10;
    
    // Random variation
    score += Math.floor(Math.random() * 20) - 10;
    
    return Math.max(0, Math.min(100, score));
  }

  private generatePhoneNumber(location: string): string {
    const areaCodes: { [key: string]: string } = {
      'San Francisco': '415',
      'New York': '212',
      'Los Angeles': '213',
      'Chicago': '312',
      'Boston': '617',
      'Seattle': '206',
      'London': '+44-20',
      'Paris': '+33-1',
      'Berlin': '+49-30',
      'Tokyo': '+81-3',
    };

    const areaCode = areaCodes[location.split(',')[0]] || '555';
    const number = Math.floor(Math.random() * 9000000) + 1000000;
    
    if (areaCode.startsWith('+')) {
      return `${areaCode}-${number.toString().slice(0, 4)}-${number.toString().slice(4)}`;
    }
    
    return `+1-${areaCode}-${number.toString().slice(0, 3)}-${number.toString().slice(3)}`;
  }

  private generateCompanyDescription(companyName: string, industry: string): string {
    const templates = [
      `${companyName} is a leading ${industry.toLowerCase()} company focused on innovation and growth.`,
      `A dynamic ${industry.toLowerCase()} organization serving clients globally with cutting-edge solutions.`,
      `${companyName} specializes in ${industry.toLowerCase()} services with a commitment to excellence.`,
      `Innovative ${industry.toLowerCase()} company driving digital transformation and business success.`,
      `${companyName} delivers world-class ${industry.toLowerCase()} solutions to enterprise clients.`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateTags(industry: string, employeeCount: number, status: Lead['status']): string[] {
    const tags: string[] = [];
    
    tags.push(industry);
    
    if (employeeCount > 1000) tags.push('Enterprise');
    else if (employeeCount > 100) tags.push('Mid-Market');
    else tags.push('SMB');
    
    if (status === 'qualified') tags.push('Hot Lead');
    if (status === 'converted') tags.push('Customer');
    
    const additionalTags = ['B2B', 'SaaS', 'Cloud', 'AI', 'Digital', 'Innovation'];
    tags.push(additionalTags[Math.floor(Math.random() * additionalTags.length)]);
    
    return tags;
  }

  private generateNotes(status: Lead['status']): string {
    const notes = {
      new: 'New lead from recent campaign. Needs initial outreach.',
      contacted: 'Initial contact made. Waiting for response.',
      qualified: 'Qualified lead with strong interest. Schedule demo.',
      converted: 'Successfully converted to customer. Onboarding in progress.',
      rejected: 'Not a good fit at this time. Follow up in 6 months.'
    };
    
    return notes[status] || 'Lead requires follow-up.';
  }

  private generateSource(): string {
    const sources = [
      'LinkedIn', 'Website', 'Referral', 'Cold Email', 'Conference',
      'Webinar', 'Content Marketing', 'Social Media', 'Partner',
      'Trade Show', 'Google Ads', 'Organic Search'
    ];
    
    return sources[Math.floor(Math.random() * sources.length)];
  }

  private startRealTimeUpdates() {
    this.updateInterval = setInterval(() => {
      // Simulate real-time updates
      if (Math.random() > 0.95) { // 5% chance of update
        const randomIndex = Math.floor(Math.random() * this.leads.length);
        const lead = this.leads[randomIndex];
        
        // Update score slightly
        lead.score = Math.max(0, Math.min(100, lead.score + (Math.random() - 0.5) * 10));
        lead.updatedAt = new Date();
        
        this.notifyListeners();
      }
    }, 5000); // Update every 5 seconds
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
    this.notifyListeners();
  }

  updateLead(id: string, updates: Partial<Lead>): void {
    const index = this.leads.findIndex(lead => lead.id === id);
    if (index !== -1) {
      this.leads[index] = { ...this.leads[index], ...updates, updatedAt: new Date() };
      this.notifyListeners();
    }
  }

  deleteLead(id: string): void {
    this.leads = this.leads.filter(lead => lead.id !== id);
    this.notifyListeners();
  }

  destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
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
  // Simulate API delay
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

// Enhanced enrichment function
export const enrichLeadWithRealData = async (lead: Lead): Promise<Lead> => {
  // Simulate API delay
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
    enrichedLead.phone = realTimeLeadService['generatePhoneNumber'](enrichedLead.location);
  }
  
  // Add LinkedIn profile if missing
  if (!enrichedLead.linkedinProfile && enrichedLead.contactPerson) {
    const [firstName, lastName] = enrichedLead.contactPerson.split(' ');
    enrichedLead.linkedinProfile = `https://linkedin.com/in/${firstName?.toLowerCase()}-${lastName?.toLowerCase()}-${Math.floor(Math.random() * 999)}`;
  }
  
  // Add company description if missing
  if (!enrichedLead.description) {
    enrichedLead.description = realTimeLeadService['generateCompanyDescription'](enrichedLead.companyName, enrichedLead.industry);
  }
  
  // Update timestamp
  enrichedLead.updatedAt = new Date();
  
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