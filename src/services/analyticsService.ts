import { Lead } from '../types';

export interface AnalyticsData {
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  averageScore: number;
  leadsByStatus: { status: string; count: number }[];
  leadsByIndustry: { industry: string; count: number; avgScore: number }[];
  leadsBySource: { source: string; count: number }[];
  scoreDistribution: { range: string; count: number }[];
  recentActivity: { date: string; leads: number; conversions: number }[];
  topPerformingLeads: Lead[];
}

export class AnalyticsService {
  static calculateAnalytics(leads: Lead[]): AnalyticsData {
    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter(lead => lead.status === 'qualified' || lead.status === 'converted').length;
    const convertedLeads = leads.filter(lead => lead.status === 'converted').length;
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
    const averageScore = totalLeads > 0 ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / totalLeads) : 0;

    // Leads by status
    const statusCounts = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const leadsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count
    }));

    // Leads by industry
    const industryStats = leads.reduce((acc, lead) => {
      if (!acc[lead.industry]) {
        acc[lead.industry] = { count: 0, totalScore: 0 };
      }
      acc[lead.industry].count++;
      acc[lead.industry].totalScore += lead.score;
      return acc;
    }, {} as Record<string, { count: number; totalScore: number }>);

    const leadsByIndustry = Object.entries(industryStats)
      .map(([industry, stats]) => ({
        industry,
        count: stats.count,
        avgScore: Math.round(stats.totalScore / stats.count)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Leads by source
    const sourceCounts = leads.reduce((acc, lead) => {
      const source = lead.source || 'Unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const leadsBySource = Object.entries(sourceCounts).map(([source, count]) => ({
      source,
      count
    }));

    // Score distribution
    const scoreRanges = [
      { range: '0-20', min: 0, max: 20 },
      { range: '21-40', min: 21, max: 40 },
      { range: '41-60', min: 41, max: 60 },
      { range: '61-80', min: 61, max: 80 },
      { range: '81-100', min: 81, max: 100 }
    ];

    const scoreDistribution = scoreRanges.map(range => ({
      range: range.range,
      count: leads.filter(lead => lead.score >= range.min && lead.score <= range.max).length
    }));

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLeads = leads.filter(lead => 
        lead.createdAt.toISOString().split('T')[0] === dateStr
      ).length;
      
      const dayConversions = leads.filter(lead => 
        lead.status === 'converted' && 
        lead.updatedAt.toISOString().split('T')[0] === dateStr
      ).length;

      recentActivity.push({
        date: dateStr,
        leads: dayLeads,
        conversions: dayConversions
      });
    }

    // Top performing leads
    const topPerformingLeads = [...leads]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return {
      totalLeads,
      qualifiedLeads,
      conversionRate,
      averageScore,
      leadsByStatus,
      leadsByIndustry,
      leadsBySource,
      scoreDistribution,
      recentActivity,
      topPerformingLeads
    };
  }

  static exportAnalytics(analytics: AnalyticsData): string {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalLeads: analytics.totalLeads,
        qualifiedLeads: analytics.qualifiedLeads,
        conversionRate: `${analytics.conversionRate}%`,
        averageScore: analytics.averageScore
      },
      breakdown: {
        byStatus: analytics.leadsByStatus,
        byIndustry: analytics.leadsByIndustry,
        bySource: analytics.leadsBySource,
        scoreDistribution: analytics.scoreDistribution
      },
      topPerformers: analytics.topPerformingLeads.map(lead => ({
        company: lead.companyName,
        score: lead.score,
        status: lead.status,
        industry: lead.industry
      }))
    };

    return JSON.stringify(report, null, 2);
  }
}