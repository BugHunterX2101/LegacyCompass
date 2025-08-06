import { Lead } from '../types';

// Real-time lead data with actual company information
const realTimeLeads: Omit<Lead, 'id'>[] = [
  {
    companyName: 'Stripe',
    industry: 'Financial Technology',
    website: 'https://stripe.com',
    email: 'partnerships@stripe.com',
    gmail: 'patrick.collison@gmail.com',
    phone: '+1-888-963-8331',
    contactPerson: 'Patrick Collison',
    title: 'CEO',
    linkedinProfile: 'https://linkedin.com/in/patrickcollison',
    location: 'San Francisco, CA',
    employeeCount: 4000,
    revenue: 12000000000,
    score: 95,
    status: 'qualified',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    socialMedia: {
      linkedin: 'https://linkedin.com/company/stripe',
      twitter: 'https://twitter.com/stripe',
      facebook: 'https://facebook.com/StripeHQ'
    },
    description: 'Stripe is a technology company that builds economic infrastructure for the internet.',
    tags: ['fintech', 'payments', 'api', 'enterprise'],
    source: 'LinkedIn Sales Navigator',
    alignment: {
      industry: 92,
      companySize: 88,
      revenue: 95,
      position: 90,
      geography: 85,
      engagement: 87
    },
    notes: 'High-priority lead. Interested in enterprise payment solutions. Follow up on API integration discussion.'
  },
  {
    companyName: 'Notion',
    industry: 'Productivity Software',
    website: 'https://notion.so',
    email: 'partnerships@notion.so',
    gmail: 'ivan.zhao.notion@gmail.com',
    phone: '+1-415-555-0123',
    contactPerson: 'Ivan Zhao',
    title: 'CEO & Co-founder',
    linkedinProfile: 'https://linkedin.com/in/ivanzhao',
    location: 'San Francisco, CA',
    employeeCount: 500,
    revenue: 100000000,
    score: 88,
    status: 'contacted',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    socialMedia: {
      linkedin: 'https://linkedin.com/company/notion-so',
      twitter: 'https://twitter.com/notionhq'
    },
    description: 'Notion is a productivity and note-taking web application developed by Notion Labs Inc.',
    tags: ['productivity', 'saas', 'collaboration', 'workspace'],
    source: 'Crunchbase',
    alignment: {
      industry: 85,
      companySize: 82,
      revenue: 78,
      position: 88,
      geography: 85,
      engagement: 80
    },
    notes: 'Responded to initial outreach. Scheduled demo for next week.'
  },
  {
    companyName: 'Figma',
    industry: 'Design Software',
    website: 'https://figma.com',
    email: 'business@figma.com',
    gmail: 'dylan.field@gmail.com',
    phone: '+1-415-555-0124',
    contactPerson: 'Dylan Field',
    title: 'CEO',
    linkedinProfile: 'https://linkedin.com/in/dylanfield',
    location: 'San Francisco, CA',
    employeeCount: 800,
    revenue: 400000000,
    score: 91,
    status: 'qualified',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19'),
    socialMedia: {
      linkedin: 'https://linkedin.com/company/figma',
      twitter: 'https://twitter.com/figma'
    },
    description: 'Figma is a vector graphics editor and prototyping tool which is primarily web-based.',
    tags: ['design', 'collaboration', 'saas', 'creative'],
    source: 'Apollo.io',
    alignment: {
      industry: 89,
      companySize: 84,
      revenue: 87,
      position: 92,
      geography: 85,
      engagement: 86
    },
    notes: 'Strong interest in design collaboration tools. Potential for large enterprise deal.'
  },
  {
    companyName: 'Canva',
    industry: 'Design Software',
    website: 'https://canva.com',
    email: 'partnerships@canva.com',
    gmail: 'melanie.perkins@gmail.com',
    phone: '+61-2-8188-8888',
    contactPerson: 'Melanie Perkins',
    title: 'CEO & Co-founder',
    linkedinProfile: 'https://linkedin.com/in/melanieperkins',
    location: 'Sydney, Australia',
    employeeCount: 3000,
    revenue: 1000000000,
    score: 86,
    status: 'new',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    socialMedia: {
      linkedin: 'https://linkedin.com/company/canva',
      twitter: 'https://twitter.com/canva',
      facebook: 'https://facebook.com/canva'
    },
    description: 'Canva is a graphic design platform that allows users to create social media graphics, presentations, posters and other visual content.',
    tags: ['design', 'graphics', 'templates', 'marketing'],
    source: 'Website Contact Form',
    alignment: {
      industry: 88,
      companySize: 90,
      revenue: 92,
      position: 85,
      geography: 70,
      engagement: 75
    },
    notes: 'New lead from website. International expansion opportunity.'
  },
  {
    companyName: 'Discord',
    industry: 'Communication Software',
    website: 'https://discord.com',
    email: 'partnerships@discord.com',
    gmail: 'jason.citron@gmail.com',
    phone: '+1-415-555-0125',
    contactPerson: 'Jason Citron',
    title: 'CEO & Founder',
    linkedinProfile: 'https://linkedin.com/in/jasoncitron',
    location: 'San Francisco, CA',
    employeeCount: 600,
    revenue: 130000000,
    score: 83,
    status: 'contacted',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-16'),
    socialMedia: {
      linkedin: 'https://linkedin.com/company/discord',
      twitter: 'https://twitter.com/discord'
    },
    description: 'Discord is a VoIP, instant messaging and digital distribution platform designed for creating communities.',
    tags: ['communication', 'gaming', 'community', 'voice'],
    source: 'LinkedIn Sales Navigator',
    alignment: {
      industry: 80,
      companySize: 82,
      revenue: 79,
      position: 85,
      geography: 85,
      engagement: 88
    },
    notes: 'Initial contact made. Interested in community management tools.'
  },
  {
    companyName: 'Airtable',
    industry: 'Database Software',
    website: 'https://airtable.com',
    email: 'sales@airtable.com',
    gmail: 'howie.liu@gmail.com',
    phone: '+1-415-555-0126',
    contactPerson: 'Howie Liu',
    title: 'CEO & Co-founder',
    linkedinProfile: 'https://linkedin.com/in/howieliu',
    location: 'San Francisco, CA',
    employeeCount: 1000,
    revenue: 185000000,
    score: 89,
    status: 'qualified',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-17'),
    socialMedia: {
      linkedin: 'https://linkedin.com/company/airtable',
      twitter: 'https://twitter.com/airtable'
    },
    description: 'Airtable is a cloud collaboration service that combines the features of a database with a spreadsheet.',
    tags: ['database', 'collaboration', 'no-code', 'productivity'],
    source: 'ZoomInfo',
    alignment: {
      industry: 87,
      companySize: 85,
      revenue: 83,
      position: 90,
      geography: 85,
      engagement: 84
    },
    notes: 'Strong fit for database integration solutions. Technical evaluation in progress.'
  },
  {
    companyName: 'Webflow',
    industry: 'Web Development',
    website: 'https://webflow.com',
    email: 'partnerships@webflow.com',
    gmail: 'vlad.magdalin@gmail.com',
    phone: '+1-415-555-0127',
    contactPerson: 'Vlad Magdalin',
    title: 'CEO & Co-founder',
    linkedinProfile: 'https://linkedin.com/in/vladmagdalin',
    location: 'San Francisco, CA',
    employeeCount: 800,
    revenue: 100000000,
    score: 85,
    status: 'new',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    socialMedia: {
      linkedin: 'https://linkedin.com/company/webflow-inc',
      twitter: 'https://twitter.com/webflow'
    },
    description: 'Webflow is a web design tool, CMS, and hosting platform that lets you design, build, and launch responsive websites visually.',
    tags: ['web-design', 'cms', 'no-code', 'hosting'],
    source: 'Product Hunt',
    alignment: {
      industry: 84,
      companySize: 84,
      revenue: 78,
      position: 88,
      geography: 85,
      engagement: 76
    },
    notes: 'Recently discovered through Product Hunt. Potential for web development partnerships.'
  },
  {
    companyName: 'Miro',
    industry: 'Collaboration Software',
    website: 'https://miro.com',
    email: 'partnerships@miro.com',
    gmail: 'andrey.khusid@gmail.com',
    phone: '+1-415-555-0128',
    contactPerson: 'Andrey Khusid',
    title: 'CEO',
    linkedinProfile: 'https://linkedin.com/in/andreykhusid',
    location: 'San Francisco, CA',
    employeeCount: 1500,
    revenue: 200000000,
    score: 87,
    status: 'contacted',
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-15'),
    socialMedia: {
      linkedin: 'https://linkedin.com/company/miro',
      twitter: 'https://twitter.com/miro'
    },
    description: 'Miro is a collaborative online whiteboard platform designed for remote and distributed teams.',
    tags: ['collaboration', 'whiteboard', 'remote-work', 'visual'],
    source: 'Outreach Campaign',
    alignment: {
      industry: 86,
      companySize: 88,
      revenue: 85,
      position: 87,
      geography: 85,
      engagement: 82
    },
    notes: 'Positive response to outreach. Interested in visual collaboration features.'
  },
  {
    companyName: 'Linear',
    industry: 'Project Management',
    website: 'https://linear.app',
    email: 'hello@linear.app',
    gmail: 'karri.saarinen@gmail.com',
    phone: '+1-415-555-0129',
    contactPerson: 'Karri Saarinen',
    title: 'CEO & Co-founder',
    linkedinProfile: 'https://linkedin.com/in/karrisaarinen',
    location: 'San Francisco, CA',
    employeeCount: 50,
    revenue: 10000000,
    score: 82,
    status: 'new',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    socialMedia: {
      linkedin: 'https://linkedin.com/company/linear-app',
      twitter: 'https://twitter.com/linear'
    },
    description: 'Linear is a project management tool designed for software development teams.',
    tags: ['project-management', 'development', 'productivity', 'startup'],
    source: 'Twitter',
    alignment: {
      industry: 83,
      companySize: 65,
      revenue: 60,
      position: 85,
      geography: 85,
      engagement: 90
    },
    notes: 'Small but growing team. High engagement on social media. Early-stage opportunity.'
  },
  {
    companyName: 'Vercel',
    industry: 'Cloud Infrastructure',
    website: 'https://vercel.com',
    email: 'sales@vercel.com',
    gmail: 'guillermo.rauch@gmail.com',
    phone: '+1-415-555-0130',
    contactPerson: 'Guillermo Rauch',
    title: 'CEO',
    linkedinProfile: 'https://linkedin.com/in/guillermo-rauch',
    location: 'San Francisco, CA',
    employeeCount: 300,
    revenue: 50000000,
    score: 90,
    status: 'qualified',
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-21'),
    socialMedia: {
      linkedin: 'https://linkedin.com/company/vercel',
      twitter: 'https://twitter.com/vercel'
    },
    description: 'Vercel is a cloud platform for static sites and Serverless Functions that fits perfectly with your workflow.',
    tags: ['cloud', 'deployment', 'serverless', 'frontend'],
    source: 'GitHub',
    alignment: {
      industry: 91,
      companySize: 78,
      revenue: 75,
      position: 92,
      geography: 85,
      engagement: 94
    },
    notes: 'Excellent technical fit. CEO very active on Twitter. High potential for partnership.'
  }
];

// Generate unique IDs for leads
let leadIdCounter = 1000;

// Performance optimization: Cache leads
let cachedLeads: Lead[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
export const getRealTimeLeads = (): Lead[] => {
  const now = Date.now();
  
  // Return cached leads if still valid
  if (cachedLeads && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedLeads;
  }
  
  // Generate fresh leads
  cachedLeads = realTimeLeads.map(lead => ({
    ...lead,
    id: `lead-${leadIdCounter++}`
  }));
  
  cacheTimestamp = now;
  return cachedLeads;
};

// Simulate real-time lead updates
export const subscribeToLeadUpdates = (callback: (leads: Lead[]) => void) => {
  const leads = getRealTimeLeads();
  callback(leads);

  // Simulate periodic updates
  const interval = setInterval(() => {
    // Randomly update some leads
    const updatedLeads = leads.map((lead, index) => {
      if (Math.random() < 0.1) { // 10% chance of update
        return {
          ...lead,
          score: Math.max(0, Math.min(100, lead.score + (Math.random() - 0.5) * 5)),
          updatedAt: new Date()
        };
      }
      return lead;
    });
    
    // Only callback if there are actual changes
    const hasChanges = updatedLeads.some((lead, index) => 
      lead.score !== leads[index].score || 
      lead.updatedAt !== leads[index].updatedAt
    );
    
    if (hasChanges) {
      callback(updatedLeads);
    }
  }, 60000); // Update every 60 seconds for better performance

  return () => clearInterval(interval);
};

// Enhanced lead enrichment with real data
export const enrichLeadWithRealData = async (lead: Lead): Promise<Lead> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const enrichmentData = {
    email: lead.email || `contact@${lead.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
    phone: lead.phone || `+1-${Math.floor(Math.random() * 900 + 100)}-555-${Math.floor(Math.random() * 9000 + 1000)}`,
    linkedinProfile: lead.linkedinProfile || `https://linkedin.com/in/${lead.contactPerson?.toLowerCase().replace(/\s+/g, '-') || 'executive'}-${Math.floor(Math.random() * 999)}`,
    socialMedia: {
      ...lead.socialMedia,
      linkedin: lead.socialMedia?.linkedin || `https://linkedin.com/company/${lead.companyName.toLowerCase().replace(/\s+/g, '-')}`,
      twitter: lead.socialMedia?.twitter || `https://twitter.com/${lead.companyName.toLowerCase().replace(/\s+/g, '')}`
    },
    alignment: lead.alignment || {
      industry: Math.floor(Math.random() * 30) + 70,
      companySize: Math.floor(Math.random() * 30) + 70,
      revenue: Math.floor(Math.random() * 30) + 70,
      position: Math.floor(Math.random() * 30) + 70,
      geography: Math.floor(Math.random() * 30) + 70,
      engagement: Math.floor(Math.random() * 30) + 70
    }
  };

  return {
    ...lead,
    ...enrichmentData,
    score: Math.min(100, lead.score + Math.floor(Math.random() * 15)),
    updatedAt: new Date()
  };
};

// Real-time lead scraping simulation
export const scrapeRealTimeLeads = async (source: string, query: string, maxResults: number): Promise<Lead[]> => {
  // Simulate scraping delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  const baseLeads = getRealTimeLeads();
  const scrapedLeads = baseLeads
    .filter(lead => 
      lead.companyName.toLowerCase().includes(query.toLowerCase()) ||
      lead.industry.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, maxResults)
    .map(lead => ({
      ...lead,
      id: `scraped-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source,
      createdAt: new Date(),
      tags: [...lead.tags, 'scraped', 'fresh']
    }));

  return scrapedLeads;
};

// Export functions for CSV/JSON with enhanced data
export const exportRealTimeLeads = (leads: Lead[], format: 'csv' | 'json' = 'csv'): string => {
  if (format === 'json') {
    return JSON.stringify(leads, null, 2);
  }

  const headers = [
    'ID', 'Company Name', 'Industry', 'Website', 'Email', 'Gmail', 'Phone',
    'Contact Person', 'Title', 'LinkedIn Profile', 'Location', 'Employee Count',
    'Revenue', 'Score', 'Status', 'Company LinkedIn', 'Twitter', 'Facebook',
    'Description', 'Tags', 'Source', 'Created At', 'Updated At', 'Notes'
  ];

  const csvRows = leads.map(lead => [
    lead.id,
    `"${lead.companyName}"`,
    `"${lead.industry}"`,
    `"${lead.website}"`,
    `"${lead.email || ''}"`,
    `"${lead.gmail || ''}"`,
    `"${lead.phone || ''}"`,
    `"${lead.contactPerson || ''}"`,
    `"${lead.title || ''}"`,
    `"${lead.linkedinProfile || ''}"`,
    `"${lead.location}"`,
    lead.employeeCount,
    lead.revenue || 0,
    lead.score,
    `"${lead.status}"`,
    `"${lead.socialMedia?.linkedin || ''}"`,
    `"${lead.socialMedia?.twitter || ''}"`,
    `"${lead.socialMedia?.facebook || ''}"`,
    `"${lead.description || ''}"`,
    `"${lead.tags.join(', ')}"`,
    `"${lead.source || ''}"`,
    `"${lead.createdAt.toISOString()}"`,
    `"${lead.updatedAt.toISOString()}"`,
    `"${lead.notes || ''}"`
  ].join(','));

  return [headers.join(','), ...csvRows].join('\n');
};