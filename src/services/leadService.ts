import { Lead } from '../types';
import { getRealTimeLeads, enrichLeadWithRealData, exportRealTimeLeads } from './realTimeLeadService';

// Enhanced enrichment with real data
export const enrichLead = async (lead: Lead): Promise<Lead> => {
  return await enrichLeadWithRealData(lead);
};

// Enhanced export functions
export const exportLeadsToCSV = (leads: Lead[]): string => {
  return exportRealTimeLeads(leads, 'csv');
};

// Get real-time leads for initial load (includes seed data for first-time users)
export const getInitialLeads = (): Lead[] => {
  return getRealTimeLeads();
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
