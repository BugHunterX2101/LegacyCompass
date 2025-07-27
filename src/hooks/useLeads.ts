import { useState, useMemo } from 'react';
import { Lead } from '../types';

// Sample lead data with correct Lead interface
const sampleLeads: Lead[] = [
  {
    id: '1',
    companyName: 'Microsoft',
    contactPerson: 'Satya Nadella',
    title: 'CEO',
    email: 'satya.nadella@microsoft.com',
    phone: '+1-425-882-8080',
    linkedinProfile: 'https://www.linkedin.com/in/satyanadella/',
    website: 'https://www.microsoft.com',
    location: 'Redmond, WA',
    industry: 'Technology',
    employeeCount: 220000,
    revenue: 200000000000,
    score: 95,
    status: 'qualified',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    notes: 'Interested in enterprise AI solutions',
    tags: ['Enterprise', 'AI', 'Cloud'],
    source: 'LinkedIn',
  },
  {
    id: '2',
    companyName: 'Google',
    contactPerson: 'Sundar Pichai',
    title: 'CEO',
    email: 'sundar@google.com',
    phone: '+1-650-253-0000',
    linkedinProfile: 'https://www.linkedin.com/in/sundarpichai/',
    website: 'https://www.google.com',
    location: 'Mountain View, CA',
    industry: 'Technology',
    employeeCount: 180000,
    revenue: 280000000000,
    score: 92,
    status: 'qualified',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10'),
    notes: 'Exploring cloud infrastructure partnerships',
    tags: ['Cloud', 'Search', 'AI'],
    source: 'Apollo',
  },
  {
    id: '3',
    companyName: 'Apple',
    contactPerson: 'Tim Cook',
    title: 'CEO',
    email: 'tcook@apple.com',
    phone: '+1-408-996-1010',
    linkedinProfile: 'https://www.linkedin.com/in/tim-cook-0b5b3b/',
    website: 'https://www.apple.com',
    location: 'Cupertino, CA',
    industry: 'Technology',
    employeeCount: 164000,
    revenue: 394000000000,
    score: 88,
    status: 'contacted',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-05'),
    notes: 'Potential hardware integration opportunities',
    tags: ['Hardware', 'Consumer', 'Innovation'],
    source: 'Website',
  },
  {
    id: '4',
    companyName: 'Amazon',
    contactPerson: 'Andy Jassy',
    title: 'CEO',
    email: 'ajassy@amazon.com',
    phone: '+1-206-266-1000',
    linkedinProfile: 'https://www.linkedin.com/in/andy-jassy-8b5b3b/',
    website: 'https://www.amazon.com',
    location: 'Seattle, WA',
    industry: 'E-commerce',
    employeeCount: 1500000,
    revenue: 514000000000,
    score: 90,
    status: 'qualified',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-12'),
    notes: 'AWS partnership discussions ongoing',
    tags: ['Cloud', 'E-commerce', 'Logistics'],
    source: 'LinkedIn',
  },
  {
    id: '5',
    companyName: 'NVIDIA',
    contactPerson: 'Jensen Huang',
    title: 'CEO',
    email: 'jhuang@nvidia.com',
    phone: '+1-408-486-2000',
    linkedinProfile: 'https://www.linkedin.com/in/jenhsunhuang/',
    website: 'https://www.nvidia.com',
    location: 'Santa Clara, CA',
    industry: 'Technology',
    employeeCount: 29600,
    revenue: 60000000000,
    score: 94,
    status: 'qualified',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-08'),
    notes: 'AI chip requirements for data centers',
    tags: ['AI', 'Hardware', 'Gaming'],
    source: 'Apollo',
  }
];

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>(sampleLeads);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    industry: '',
    location: '',
    scoreRange: [0, 100] as [number, number]
  });

  // Filter leads based on search query and filters
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = !searchQuery || 
        lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.contactPerson && lead.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lead.title && lead.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lead.industry.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !filters.status || lead.status === filters.status;
      const matchesIndustry = !filters.industry || lead.industry === filters.industry;
      const matchesLocation = !filters.location || lead.location.includes(filters.location);
      const matchesScore = lead.score >= filters.scoreRange[0] && lead.score <= filters.scoreRange[1];

      return matchesSearch && matchesStatus && matchesIndustry && matchesLocation && matchesScore;
    });
  }, [leads, searchQuery, filters]);

  // Add new lead
  const addLead = (newLead: Omit<Lead, 'id'>) => {
    const lead: Lead = {
      ...newLead,
      id: Date.now().toString()
    };
    setLeads(prev => [lead, ...prev]);
  };

  // Update lead
  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, ...updates } : lead
    ));
  };

  // Delete lead
  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  // Bulk import leads
  const importLeads = async (newLeads: Omit<Lead, 'id'>[]) => {
    setLoading(true);
    try {
      const leadsWithIds = newLeads.map(lead => ({
        ...lead,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      }));
      setLeads(prev => [...leadsWithIds, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  // Export leads to CSV
  const exportLeads = () => {
    const headers = [
      'Company Name', 'Contact Person', 'Title', 'Email', 'Phone', 'LinkedIn Profile', 'Website',
      'Location', 'Industry', 'Employee Count', 'Revenue', 'Score', 'Status'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        lead.companyName,
        lead.contactPerson || '',
        lead.title || '',
        lead.email || '',
        lead.phone || '',
        lead.linkedinProfile || '',
        lead.website || '',
        lead.location,
        lead.industry,
        lead.employeeCount,
        lead.revenue,
        lead.score,
        lead.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get lead statistics
  const getStats = () => {
    const total = leads.length;
    const qualified = leads.filter(lead => lead.status === 'qualified').length;
    const contacted = leads.filter(lead => lead.status === 'contacted').length;
    const converted = leads.filter(lead => lead.status === 'converted').length;
    const rejected = leads.filter(lead => lead.status === 'rejected').length;
    const avgScore = leads.reduce((sum, lead) => sum + lead.score, 0) / total || 0;

    return {
      total,
      qualified,
      contacted,
      converted,
      rejected,
      avgScore: Math.round(avgScore)
    };
  };

  return {
    leads: filteredLeads,
    allLeads: leads,
    loading,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    addLead,
    updateLead,
    deleteLead,
    importLeads,
    exportLeads,
    getStats
  };
};