import { Lead } from '../types';
import { getRandomGlobalCompanies } from '../data/globalCompanies';

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
  'Education', 'Real Estate', 'Consulting', 'Marketing', 'Legal',
  'Automotive', 'Energy', 'Telecommunications', 'Media', 'Transportation'
];

const locations = [
  'New York, NY', 'San Francisco, CA', 'Los Angeles, CA', 'Chicago, IL',
  'Boston, MA', 'Seattle, WA', 'Austin, TX', 'Denver, CO', 'Miami, FL',
  'Atlanta, GA', 'Dallas, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'Detroit, MI'
];

const statuses: Lead['status'][] = ['new', 'contacted', 'qualified', 'converted', 'rejected'];

const generateWebsiteUrl = (companyName: string): string => {
  const cleanName = companyName.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .replace(/inc|corp|llc|ltd|company|co/g, '');
  return `https://www.${cleanName}.com`;
};

const generateEmail = (companyName: string, contactName?: string): string => {
  const domain = companyName.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .replace(/inc|corp|llc|ltd|company|co/g, '');
  
  if (contactName) {
    const name = contactName.toLowerCase().replace(/\s+/g, '.');
    return `${name}@${domain}.com`;
  }
  
  const emails = ['info', 'contact', 'sales', 'hello'];
  const randomEmail = emails[Math.floor(Math.random() * emails.length)];
  return `${randomEmail}@${domain}.com`;
};

const generatePhone = (): string => {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const exchange = Math.floor(Math.random() * 900) + 100;
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `(${areaCode}) ${exchange}-${number}`;
};

const generateContactName = (): string => {
  const firstNames = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa',
    'James', 'Jennifer', 'William', 'Jessica', 'Richard', 'Ashley', 'Thomas'
  ];
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
    'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez'
  ];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

const generateSocialMedia = (companyName: string) => {
  const cleanName = companyName.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .replace(/inc|corp|llc|ltd|company|co/g, '');
  
  return {
    linkedin: `https://linkedin.com/company/${cleanName}`,
    twitter: `https://twitter.com/${cleanName}`,
    facebook: `https://facebook.com/${cleanName}`
  };
};

export const generateMockLead = (companyName?: string): Lead => {
  const company = companyName || getRandomGlobalCompanies(1)[0];
  const contactName = Math.random() > 0.3 ? generateContactName() : undefined;
  const hasEmail = Math.random() > 0.2;
  const hasPhone = Math.random() > 0.4;
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    companyName: company,
    industry: industries[Math.floor(Math.random() * industries.length)],
    website: generateWebsiteUrl(company),
    email: hasEmail ? generateEmail(company, contactName) : undefined,
    phone: hasPhone ? generatePhone() : undefined,
    contactPerson: contactName,
    title: contactName ? ['CEO', 'CTO', 'VP Sales', 'Marketing Director', 'Operations Manager'][Math.floor(Math.random() * 5)] : undefined,
    location: locations[Math.floor(Math.random() * locations.length)],
    employeeCount: Math.floor(Math.random() * 10000) + 10,
    revenue: Math.floor(Math.random() * 100000000) + 100000,
    score: Math.floor(Math.random() * 100) + 1,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    socialMedia: Math.random() > 0.3 ? generateSocialMedia(company) : undefined,
    description: `${company} is a leading company in the ${industries[Math.floor(Math.random() * industries.length)].toLowerCase()} industry.`,
    tags: Math.random() > 0.5 ? ['high-priority', 'enterprise', 'warm-lead'].slice(0, Math.floor(Math.random() * 3) + 1) : []
  };
};

export const generateMockLeads = (count: number): Lead[] => {
  const companies = getRandomGlobalCompanies(count);
  return companies.map(company => generateMockLead(company));
};

export const scrapeLeadsFromSource = async (source: string, count: number): Promise<Lead[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
  
  const leads = generateMockLeads(count);
  
  // Add source-specific modifications
  switch (source) {
    case 'linkedin':
      leads.forEach(lead => {
        lead.score = Math.max(lead.score, 60); // LinkedIn leads tend to be higher quality
        if (!lead.socialMedia) lead.socialMedia = {};
        lead.socialMedia.linkedin = `https://linkedin.com/company/${lead.companyName.toLowerCase().replace(/\s+/g, '')}`;
      });
      break;
    case 'crunchbase':
      leads.forEach(lead => {
        lead.industry = ['Technology', 'Software', 'SaaS', 'Fintech', 'Biotech'][Math.floor(Math.random() * 5)];
        lead.revenue = Math.floor(Math.random() * 50000000) + 1000000; // Startups tend to have lower revenue
      });
      break;
    case 'yellowpages':
      leads.forEach(lead => {
        lead.phone = generatePhone(); // Yellow Pages always has phone numbers
        lead.industry = ['Retail', 'Services', 'Healthcare', 'Legal', 'Real Estate'][Math.floor(Math.random() * 5)];
      });
      break;
  }
  
  return leads;
};

export const enrichLead = async (lead: Lead): Promise<Lead> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const enrichedLead: Lead = {
    ...lead,
    email: lead.email || generateEmail(lead.companyName, lead.contactPerson),
    phone: lead.phone || generatePhone(),
    contactPerson: lead.contactPerson || generateContactName(),
    socialMedia: {
      ...lead.socialMedia,
      ...generateSocialMedia(lead.companyName)
    },
    score: Math.min(lead.score + Math.floor(Math.random() * 20), 100),
    updatedAt: new Date()
  };
  
  return enrichedLead;
};

export const exportLeadsToCSV = (leads: Lead[]): string => {
  const headers = [
    'Company Name', 'Industry', 'Location', 'Website', 'Email', 'Phone',
    'Contact Person', 'Title', 'Employee Count', 'Revenue', 'Score', 'Status',
    'LinkedIn', 'Twitter', 'Facebook', 'Created At', 'Updated At'
  ];
  
  const csvContent = [
    headers.join(','),
    ...leads.map(lead => [
      `"${lead.companyName}"`,
      `"${lead.industry}"`,
      `"${lead.location}"`,
      `"${lead.website}"`,
      `"${lead.email || ''}"`,
      `"${lead.phone || ''}"`,
      `"${lead.contactPerson || ''}"`,
      `"${lead.title || ''}"`,
      lead.employeeCount,
      lead.revenue,
      lead.score,
      `"${lead.status}"`,
      `"${lead.socialMedia?.linkedin || ''}"`,
      `"${lead.socialMedia?.twitter || ''}"`,
      `"${lead.socialMedia?.facebook || ''}"`,
      `"${lead.createdAt.toISOString()}"`,
      `"${lead.updatedAt.toISOString()}"`
    ].join(','))
  ].join('\n');
  
  return csvContent;
};

export const exportLeadsToJSON = (leads: Lead[]): string => {
  return JSON.stringify(leads, null, 2);
};

export const downloadFile = (content: string, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};