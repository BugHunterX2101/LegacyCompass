import React, { useState } from 'react';
import { Lead } from '../../types';
import { ScoreCircle } from '../common/ScoreCircle';
import { StatusBadge } from '../common/StatusBadge';
import { Building, MapPin, Calendar, Mail, Phone, Linkedin, Target, TrendingUp, Edit3, Save, X, ExternalLink, Copy, CheckCircle } from 'lucide-react';

interface LeadDetailProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: (updates: Partial<Lead>) => void;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onClose, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [editedLead, setEditedLead] = useState(lead);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const alignmentFactors = lead.alignment ? [
    { key: 'industry', label: 'Industry Fit', value: lead.alignment.industry, weight: '25%' },
    { key: 'companySize', label: 'Company Size', value: lead.alignment.companySize, weight: '20%' },
    { key: 'revenue', label: 'Revenue Range', value: lead.alignment.revenue, weight: '20%' },
    { key: 'position', label: 'Position Level', value: lead.alignment.position, weight: '15%' },
    { key: 'geography', label: 'Geography', value: lead.alignment.geography, weight: '10%' },
    { key: 'engagement', label: 'Engagement', value: lead.alignment.engagement, weight: '10%' }
  ] : [];

  const getRecommendations = (score: number) => {
    if (score >= 90) {
      return [
        {
          type: 'urgent',
          title: 'Immediate Action Required',
          description: 'Schedule a demo call within 24 hours - this is a hot lead!',
          icon: Target,
          color: 'red'
        },
        {
          type: 'high',
          title: 'Personalized Outreach',
          description: 'Send a highly personalized message referencing their recent company news',
          icon: Mail,
          color: 'orange'
        }
      ];
    } else if (score >= 80) {
      return [
        {
          type: 'high',
          title: 'Priority Follow-up',
          description: 'Reach out within 48 hours with relevant case study',
          icon: Target,
          color: 'yellow'
        },
        {
          type: 'medium',
          title: 'Social Engagement',
          description: 'Engage with their LinkedIn posts before reaching out',
          icon: Linkedin,
          color: 'blue'
        }
      ];
    } else {
      return [
        {
          type: 'medium',
          title: 'Nurture Campaign',
          description: 'Add to educational email sequence',
          icon: Mail,
          color: 'green'
        },
        {
          type: 'low',
          title: 'Monitor Activity',
          description: 'Track their engagement and revisit in 30 days',
          icon: TrendingUp,
          color: 'gray'
        }
      ];
    }
  };

  const recommendations = getRecommendations(lead.score);

  const handleSave = () => {
    onUpdate(editedLead);
    setEditing(false);
  };

  const handleStatusChange = (newStatus: Lead['status']) => {
    const updates = { status: newStatus };
    setEditedLead({ ...editedLead, ...updates });
    onUpdate(updates);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const openEmailClient = (email: string, name: string, company: string) => {
    const subject = encodeURIComponent(`Partnership Opportunity - ${company}`);
    const body = encodeURIComponent(`Hi ${name.split(' ')[0]},\n\nI hope this email finds you well. I came across your profile and was impressed by your work at ${company}.\n\nI'd love to discuss a potential partnership opportunity that could benefit ${company}.\n\nWould you be available for a brief call this week?\n\nBest regards,\n[Your Name]`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {editing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editedLead.companyName}
                    onChange={(e) => setEditedLead({ ...editedLead, companyName: e.target.value })}
                    className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:border-blue-500 outline-none"
                    placeholder="Company name"
                    title="Edit company name"
                  />
                  <input
                    type="text"
                    value={editedLead.contactPerson || ''}
                    onChange={(e) => setEditedLead({ ...editedLead, contactPerson: e.target.value })}
                    className="text-lg text-gray-600 border-b border-gray-300 focus:border-blue-500 outline-none"
                    placeholder="Contact person name"
                    title="Edit contact person name"
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{lead.companyName}</h2>
                  <p className="text-lg text-gray-600">{lead.contactPerson} {lead.title && `• ${lead.title}`}</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <ScoreCircle score={lead.score} size="lg" />
              
              <div className="flex items-center space-x-2">
                {editing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Save changes"
                      aria-label="Save changes"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Cancel editing"
                      aria-label="Cancel editing"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Edit lead"
                    aria-label="Edit lead"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Close lead detail"
                  aria-label="Close lead detail"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <div className="flex items-center space-x-2">
              {(['new', 'qualified', 'contacted', 'converted'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    lead.status === status
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-3">
                {lead.email && (
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    <div className="flex items-center flex-1">
                      <button
                        onClick={() => openEmailClient(lead.email!, lead.contactPerson || 'there', lead.companyName)}
                        className="text-blue-600 hover:text-blue-700 mr-2"
                      >
                        {lead.email}
                      </button>
                      <button
                        onClick={() => copyToClipboard(lead.email!, 'email')}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy email address"
                        aria-label="Copy email address"
                      >
                        {copiedField === 'email' ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                )}
                {lead.gmail && (
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-3 text-red-400" />
                    <div className="flex items-center flex-1">
                      <button
                        onClick={() => openEmailClient(lead.gmail!, lead.contactPerson || 'there', lead.companyName)}
                        className="text-red-600 hover:text-red-700 mr-2"
                      >
                        {lead.gmail}
                      </button>
                      <button
                        onClick={() => copyToClipboard(lead.gmail!, 'gmail')}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy Gmail address"
                        aria-label="Copy Gmail address"
                      >
                        {copiedField === 'gmail' ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                )}
                {lead.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                    <div className="flex items-center flex-1">
                      <a href={`tel:${lead.phone}`} className="text-blue-600 hover:text-blue-700 mr-2">
                        {lead.phone}
                      </a>
                      <button
                        onClick={() => copyToClipboard(lead.phone!, 'phone')}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy phone number"
                        aria-label="Copy phone number"
                      >
                        {copiedField === 'phone' ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                )}
                {lead.linkedinProfile && (
                  <div className="flex items-center text-sm">
                    <Linkedin className="w-4 h-4 mr-3 text-blue-600" />
                    <a href={lead.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 flex items-center">
                      LinkedIn Profile
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
                {lead.website && (
                  <div className="flex items-center text-sm">
                    <ExternalLink className="w-4 h-4 mr-3 text-gray-400" />
                    <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 flex items-center">
                      Company Website
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {lead.email && (
                  <button
                    onClick={() => openEmailClient(lead.email!, lead.contactPerson || 'there', lead.companyName)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </button>
                )}
                {lead.gmail && (
                  <button
                    onClick={() => openEmailClient(lead.gmail!, lead.contactPerson || 'there', lead.companyName)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Gmail
                  </button>
                )}
                {lead.phone && (
                  <a
                    href={`tel:${lead.phone}`}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </a>
                )}
                {lead.linkedinProfile && (
                  <a
                    href={lead.linkedinProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    View LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Details</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="w-4 h-4 mr-3 text-gray-400" />
                  <div className="flex items-center">
                    {lead.companyName}
                    {lead.website && (
                      <a
                        href={lead.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:text-blue-700"
                        title="Visit company website"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  {lead.industry} • {lead.employeeCount.toLocaleString()} employees
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                  {lead.location}
                </div>
                {lead.revenue && (
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-3 text-gray-400" />
                    ${lead.revenue.toLocaleString()} revenue
                  </div>
                )}
                {lead.source && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                    Source: {lead.source}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Engagement History</h3>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Last Activity</span>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <p className="text-xs text-gray-600">Viewed company website</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Email Opened</span>
                    <span className="text-xs text-gray-500">1 week ago</span>
                  </div>
                  <p className="text-xs text-gray-600">Opened welcome email sequence</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Alignment Scorecard */}
          {lead.alignment && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Alignment Scorecard</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alignmentFactors.map((factor) => (
                  <div key={factor.key} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{factor.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{factor.weight}</span>
                        <span className={`text-sm font-bold ${
                          factor.value >= 80 ? 'text-green-600' : 
                          factor.value >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {factor.value}%
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          factor.value >= 80 ? 'bg-green-500' : 
                          factor.value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${factor.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Recommendations</h3>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className={`flex items-start p-4 bg-${rec.color}-50 rounded-lg border border-${rec.color}-200`}>
                  <div className={`p-2 bg-${rec.color}-100 rounded-lg mr-3`}>
                    <rec.icon className={`w-5 h-5 text-${rec.color}-600`} />
                  </div>
                  <div>
                    <h4 className={`font-medium text-${rec.color}-900`}>{rec.title}</h4>
                    <p className={`text-sm text-${rec.color}-700`}>{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {lead.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{lead.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};