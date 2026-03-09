import { useState, useMemo } from 'react';
import { Lead } from '../types';
import { getInitialLeads } from '../services/leadService';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>(() => getInitialLeads());
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