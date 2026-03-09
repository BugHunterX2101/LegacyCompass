import React from 'react';
import { AnalyticsService } from '../../services/analyticsService';
import { Lead } from '../../types';
import { 
  UserGroupIcon,
  CheckCircleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface DashboardStatsProps {
  leads: Lead[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ leads }) => {
  const analytics = AnalyticsService.calculateAnalytics(leads);
  
  // Calculate enrichment stats
  const enrichedLeads = leads.filter(l => l.email && l.phone && l.contactPerson).length;
  const enrichmentRate = leads.length > 0 ? Math.round((enrichedLeads / leads.length) * 100) : 0;
  const leadsWithEmail = leads.filter(l => l.email).length;
  const leadsWithPhone = leads.filter(l => l.phone).length;
  const leadsWithWebsite = leads.filter(l => l.website).length;

  const statCards = [
    {
      title: 'Total Leads',
      value: analytics.totalLeads.toLocaleString(),
      icon: UserGroupIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      progress: Math.min((analytics.totalLeads / Math.max(analytics.totalLeads, 1)) * 100, 100),
      subtitle: `${analytics.leadsByIndustry.length} industries`
    },
    {
      title: 'Qualified Leads',
      value: analytics.qualifiedLeads.toLocaleString(),
      icon: CheckCircleIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      progress: analytics.totalLeads > 0 ? (analytics.qualifiedLeads / analytics.totalLeads) * 100 : 0,
      subtitle: `${analytics.totalLeads > 0 ? Math.round((analytics.qualifiedLeads / analytics.totalLeads) * 100) : 0}% of total`
    },
    {
      title: 'Average Score',
      value: `${analytics.averageScore}/100`,
      icon: ChartBarIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      progress: analytics.averageScore,
      subtitle: analytics.averageScore >= 70 ? 'Strong pipeline' : analytics.averageScore >= 50 ? 'Good pipeline' : 'Needs attention'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.conversionRate}%`,
      icon: ArrowTrendingUpIcon,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
      progress: analytics.conversionRate,
      subtitle: `${leads.filter(l => l.status === 'converted').length} converted`
    }
  ];

  const enrichmentCards = [
    {
      title: 'Enriched Profiles',
      value: `${enrichmentRate}%`,
      Icon: SparklesIcon,
      detail: `${enrichedLeads} / ${leads.length}`,
      color: 'text-yellow-400'
    },
    {
      title: 'With Email',
      value: leadsWithEmail.toString(),
      Icon: EnvelopeIcon,
      detail: `${leads.length > 0 ? Math.round((leadsWithEmail / leads.length) * 100) : 0}%`,
      color: 'text-blue-400'
    },
    {
      title: 'With Phone',
      value: leadsWithPhone.toString(),
      Icon: PhoneIcon,
      detail: `${leads.length > 0 ? Math.round((leadsWithPhone / leads.length) * 100) : 0}%`,
      color: 'text-green-400'
    },
    {
      title: 'With Website',
      value: leadsWithWebsite.toString(),
      Icon: GlobeAltIcon,
      detail: `${leads.length > 0 ? Math.round((leadsWithWebsite / leads.length) * 100) : 0}%`,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-[#1E2328] rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300 hover:transform hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-700`}
                  style={{ width: `${Math.min(stat.progress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enrichment Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {enrichmentCards.map((card, index) => (
          <div
            key={index}
            className="bg-[#1E2328] rounded-lg border border-gray-700 p-4 animate-fade-in-up"
            style={{ animationDelay: `${(index + 4) * 80}ms`, animationFillMode: 'backwards' }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <card.Icon className={`h-4 w-4 ${card.color}`} />
              <span className="text-xs text-gray-400">{card.title}</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-white">{card.value}</span>
              <span className="text-xs text-gray-500">{card.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};