import React from 'react';
import { AnalyticsService } from '../../services/analyticsService';
import { Lead } from '../../types';
import { 
  UserGroupIcon,
  CheckCircleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

interface DashboardStatsProps {
  leads: Lead[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ leads }) => {
  const analytics = AnalyticsService.calculateAnalytics(leads);
  
  const statCards = [
    {
      title: 'Total Leads',
      value: analytics.totalLeads.toLocaleString(),
      icon: UserGroupIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Qualified Leads',
      value: analytics.qualifiedLeads.toLocaleString(),
      icon: CheckCircleIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'Average Score',
      value: `${analytics.averageScore}/100`,
      icon: ChartBarIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      change: '+5%',
      changeType: 'positive' as const
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.conversionRate}%`,
      icon: ArrowTrendingUpIcon,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
      change: '+3%',
      changeType: 'positive' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`bg-[#1E2328] rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-all duration-200 hover:transform hover:-translate-y-1`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 text-white`} />
            </div>
          </div>
          
          {/* Progress bar for visual representation */}
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-500 ${
                  stat.title === 'Average Score' 
                    ? `w-[${analytics.averageScore}%]` 
                    : stat.title === 'Conversion Rate'
                    ? `w-[${analytics.conversionRate}%]`
                    : `w-[${Math.min((parseInt(stat.value.replace(/,/g, '')) / 1000) * 100, 100)}%]`
                }`}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};