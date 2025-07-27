export interface Lead {
  id: string;
  companyName: string;
  industry: string;
  website: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
  title?: string;
  location: string;
  employeeCount: number;
  revenue?: number;
  score: number;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  description?: string;
  tags: string[];
  // Additional contact properties
  gmail?: string;
  linkedinProfile?: string;
  notes?: string;
  source?: string;
  // Alignment scoring properties
  alignment?: {
    industry: number;
    companySize: number;
    revenue: number;
    position: number;
    geography: number;
    engagement: number;
  };
}

export interface SearchFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
  value: string | number;
  label: string;
}

export interface DashboardStats {
  totalLeads: number;
  qualifiedLeads: number;
  averageScore: number;
  conversionRate: number;
}

export interface ScoreDistributionData {
  range: string;
  count: number;
}

export interface TopIndustryData {
  name: string;
  count: number;
  avgScore: number;
}

export interface EnrichmentData {
  website: string;
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  additionalInfo: {
    foundedYear?: number;
    headquarters?: string;
    specialties?: string[];
  };
}