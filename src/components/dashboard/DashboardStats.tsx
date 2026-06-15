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
      gradient: 'from-blue-500 to-blue-600',
      glowColor: 'rgba(59,130,246,0.15)',
      iconBg: 'bg-blue-500/15 border-blue-500/20',
      iconColor: 'text-blue-400',
      progress: Math.min((analytics.totalLeads / Math.max(analytics.totalLeads, 1)) * 100, 100),
      subtitle: `${analytics.leadsByIndustry.length} industries`
    },
    {
      title: 'Qualified Leads',
      value: analytics.qualifiedLeads.toLocaleString(),
      icon: CheckCircleIcon,
      gradient: 'from-emerald-500 to-emerald-600',
      glowColor: 'rgba(16,185,129,0.15)',
      iconBg: 'bg-emerald-500/15 border-emerald-500/20',
      iconColor: 'text-emerald-400',
      progress: analytics.totalLeads > 0 ? (analytics.qualifiedLeads / analytics.totalLeads) * 100 : 0,
      subtitle: `${analytics.totalLeads > 0 ? Math.round((analytics.qualifiedLeads / analytics.totalLeads) * 100) : 0}% of total`
    },
    {
      title: 'Average Score',
      value: `${analytics.averageScore}/100`,
      icon: ChartBarIcon,
      gradient: 'from-violet-500 to-violet-600',
      glowColor: 'rgba(139,92,246,0.15)',
      iconBg: 'bg-violet-500/15 border-violet-500/20',
      iconColor: 'text-violet-400',
      progress: analytics.averageScore,
      subtitle: analytics.averageScore >= 70 ? 'Strong pipeline' : analytics.averageScore >= 50 ? 'Good pipeline' : 'Needs attention'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.conversionRate}%`,
      icon: ArrowTrendingUpIcon,
      gradient: 'from-amber-500 to-amber-600',
      glowColor: 'rgba(245,158,11,0.15)',
      iconBg: 'bg-amber-500/15 border-amber-500/20',
      iconColor: 'text-amber-400',
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
      color: 'text-amber-400',
      bg: 'bg-amber-500/8',
      borderColor: 'border-amber-500/15'
    },
    {
      title: 'With Email',
      value: leadsWithEmail.toString(),
      Icon: EnvelopeIcon,
      detail: `${leads.length > 0 ? Math.round((leadsWithEmail / leads.length) * 100) : 0}%`,
      color: 'text-blue-400',
      bg: 'bg-blue-500/8',
      borderColor: 'border-blue-500/15'
    },
    {
      title: 'With Phone',
      value: leadsWithPhone.toString(),
      Icon: PhoneIcon,
      detail: `${leads.length > 0 ? Math.round((leadsWithPhone / leads.length) * 100) : 0}%`,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/8',
      borderColor: 'border-emerald-500/15'
    },
    {
      title: 'With Website',
      value: leadsWithWebsite.toString(),
      Icon: GlobeAltIcon,
      detail: `${leads.length > 0 ? Math.round((leadsWithWebsite / leads.length) * 100) : 0}%`,
      color: 'text-violet-400',
      bg: 'bg-violet-500/8',
      borderColor: 'border-violet-500/15'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="group bg-[#13171D] rounded-xl border border-slate-700/40 p-6 hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
            style={{ 
              animationDelay: `${index * 80}ms`, 
              animationFillMode: 'backwards',
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1.5">{stat.subtitle}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.iconBg} border transition-transform group-hover:scale-110`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="w-full bg-slate-800/50 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000`}
                  style={{ 
                    width: `${Math.min(stat.progress, 100)}%`,
                    boxShadow: `0 0 8px ${stat.glowColor}`
                  }}
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
            className={`${card.bg} rounded-xl border ${card.borderColor} p-4 animate-fade-in-up transition-all duration-200 hover:border-slate-600/40`}
            style={{ animationDelay: `${(index + 4) * 80}ms`, animationFillMode: 'backwards' }}
          >
            <div className="flex items-center space-x-2 mb-2.5">
              <card.Icon className={`h-4 w-4 ${card.color}`} />
              <span className="text-xs text-slate-400 font-medium">{card.title}</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-white">{card.value}</span>
              <span className="text-xs text-slate-500">{card.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};