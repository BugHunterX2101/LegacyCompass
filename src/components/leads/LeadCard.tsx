import React from 'react';
import { Lead } from '../../types';
import { ScoreCircle } from '../common/ScoreCircle';
import { StatusBadge } from '../common/StatusBadge';
import { Building, MapPin, Calendar, Mail, Phone, Zap, ExternalLink } from 'lucide-react';
import { 
  ArrowTopRightOnSquareIcon as LinkedinIcon
} from '@heroicons/react/24/outline';

interface LeadCardProps {
  lead: Lead;
  onSelect: (lead: Lead) => void;
  onEnrich: (leadId: string) => void;
  isSelected: boolean;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onSelect, onEnrich, isSelected }) => {
  const getScoreLabel = (score: number) => {
    if (score >= 90) return { label: 'Hot Lead', color: 'text-red-600' };
    if (score >= 80) return { label: 'Qualified', color: 'text-green-600' };
    if (score >= 70) return { label: 'Warm', color: 'text-yellow-600' };
    return { label: 'Cold', color: 'text-gray-600' };
  };

  const scoreLabel = getScoreLabel(lead.score);

  return (
    <div 
      className={`bg-[#1E2328] rounded-lg border transition-all duration-200 hover:border-gray-600 cursor-pointer ${
        isSelected ? 'border-[#2563EB] ring-2 ring-blue-500/20' : 'border-gray-700'
      }`}
      onClick={() => onSelect(lead)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{lead.companyName}</h3>
            <p className="text-sm text-gray-400">{lead.contactPerson} {lead.title && `• ${lead.title}`}</p>
            <div className="flex items-center mt-1">
              <span className={`text-xs font-medium ${scoreLabel.color}`}>
                {scoreLabel.label}
              </span>
              {lead.tags.includes('scraped') && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                  Fresh
                </span>
              )}
            </div>
          </div>
          <ScoreCircle score={lead.score} size="sm" />
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-300">
            <Building className="w-4 h-4 mr-2 text-gray-400" />
            {lead.industry} • {lead.employeeCount.toLocaleString()} employees
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            {lead.location}
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            Added {lead.createdAt.toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={lead.status} size="sm" />
          <div className="flex items-center space-x-2">
            {lead.email && (
              <a 
                href={`mailto:${lead.email}`}
                className="text-gray-500 hover:text-[#2563EB] transition-colors"
                onClick={(e) => e.stopPropagation()}
                title={`Email ${lead.contactPerson || lead.companyName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
            {lead.gmail && (
              <a 
                href={`mailto:${lead.gmail}`}
                className="text-gray-500 hover:text-red-500 transition-colors"
                onClick={(e) => e.stopPropagation()}
                title={`Gmail ${lead.contactPerson || lead.companyName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
            {lead.phone && (
              <a 
                href={`tel:${lead.phone}`}
                className="text-gray-500 hover:text-[#2563EB] transition-colors"
                onClick={(e) => e.stopPropagation()}
                title={`Call ${lead.contactPerson || lead.companyName}`}
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
            {lead.linkedinProfile && (
              <a 
                href={lead.linkedinProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#2563EB] transition-colors"
                onClick={(e) => e.stopPropagation()}
                title={`View ${lead.contactPerson || lead.companyName}'s LinkedIn`}
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
            {lead.website && (
              <a 
                href={lead.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#2563EB] transition-colors"
                onClick={(e) => e.stopPropagation()}
                title={`Visit ${lead.companyName} website`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-3 mb-4 border border-blue-500/20">
          <h4 className="text-xs font-semibold text-gray-300 mb-1">AI Insights</h4>
          <p className="text-xs text-gray-400">
            {lead.score >= 90 && "Perfect fit! High decision-making authority in target industry."}
            {lead.score >= 80 && lead.score < 90 && "Strong match with good company size and role alignment."}
            {lead.score >= 70 && lead.score < 80 && "Decent prospect, consider personalized outreach."}
            {lead.score < 70 && "Lower priority, may need nurturing approach."}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {lead.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full"
              >
                {tag}
              </span>
            ))}
            {lead.tags.length > 2 && (
              <span className="px-2 py-1 text-xs bg-gray-500/20 text-gray-400 rounded-full">
                +{lead.tags.length - 2}
              </span>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnrich(lead.id);
            }}
            className="flex items-center px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
            title="Enrich lead data"
          >
            <Zap className="w-3 h-3 mr-1" />
            Enrich
          </button>
        </div>
      </div>
    </div>
  );
};