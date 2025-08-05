import { Lead } from '../types';
import { getRealTimeLeads, enrichLeadWithRealData, scrapeRealTimeLeads, exportRealTimeLeads } from './realTimeLeadService';

// Use real-time leads instead of mock data
export const generateMockLeads = (count: number): Lead[] => {
  const realLeads = getRealTimeLeads();
  return realLeads.slice(0, Math.min(count, realLeads.length));
};

// Enhanced scraping with real-time data
export const scrapeLeadsFromSource = async (source: string, maxResults: number, query: string = ''): Promise<Lead[]> => {
  return await scrapeRealTimeLeads(source, query, maxResults);
};

// Enhanced enrichment with real data
export const enrichLead = async (lead: Lead): Promise<Lead> => {
  return await enrichLeadWithRealData(lead);
};

// Enhanced export functions
export const exportLeadsToCSV = (leads: Lead[]): string => {
  return exportRealTimeLeads(leads, 'csv');
};

export const exportLeadsToJSON = (leads: Lead[]): string => {
  return exportRealTimeLeads(leads, 'json');
};

// Get real-time leads for initial load
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