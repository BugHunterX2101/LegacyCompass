import React, { useState, useEffect, useCallback } from 'react';
import { aiService } from '../../services/aiService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { NewsFeed } from '../dashboard/NewsFeed';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface AIMarketAnalysis {
  industryTrends: string[];
  competitorInsights: string[];
  marketOpportunities: string[];
  riskFactors: string[];
  recommendations: string[];
  marketOverview?: {
    marketSize: string;
    growthRate: string;
    sentiment: string;
  };
}

interface AIMarketAnalysisProps {
  industry: string;
  location: string;
  industries?: string[];
  locations?: string[];
}

// GNews country codes for location-specific news
const countryCodeMap: Record<string, string> = {
  'United States': 'us', 'Canada': 'ca', 'Mexico': 'mx',
  'United Kingdom': 'gb', 'Germany': 'de', 'France': 'fr', 'Italy': 'it', 'Spain': 'es',
  'Netherlands': 'nl', 'Switzerland': 'ch', 'Sweden': 'se', 'Norway': 'no', 'Denmark': 'dk',
  'Finland': 'fi', 'Belgium': 'be', 'Austria': 'at', 'Ireland': 'ie', 'Portugal': 'pt',
  'Poland': 'pl', 'Czech Republic': 'cz', 'Romania': 'ro', 'Greece': 'gr', 'Hungary': 'hu',
  'Ukraine': 'ua', 'Slovakia': 'sk', 'Slovenia': 'si', 'Croatia': 'hr', 'Serbia': 'rs',
  'Bulgaria': 'bg', 'Latvia': 'lv', 'Lithuania': 'lt', 'Estonia': 'ee',
  'China': 'cn', 'Japan': 'jp', 'India': 'in', 'South Korea': 'kr',
  'Australia': 'au', 'New Zealand': 'nz', 'Singapore': 'sg', 'Hong Kong': 'hk',
  'Taiwan': 'tw', 'Indonesia': 'id', 'Malaysia': 'my', 'Thailand': 'th',
  'Vietnam': 'vn', 'Philippines': 'ph', 'Bangladesh': 'bd', 'Pakistan': 'pk',
  'United Arab Emirates': 'ae', 'Saudi Arabia': 'sa', 'Israel': 'il', 'Qatar': 'qa',
  'Kuwait': 'kw', 'Turkey': 'tr', 'Iran': 'ir', 'Iraq': 'iq',
  'South Africa': 'za', 'Nigeria': 'ng', 'Kenya': 'ke', 'Egypt': 'eg', 'Morocco': 'ma',
  'Ghana': 'gh', 'Ethiopia': 'et', 'Tanzania': 'tz', 'Uganda': 'ug', 'Tunisia': 'tn',
  'Brazil': 'br', 'Argentina': 'ar', 'Chile': 'cl', 'Colombia': 'co', 'Peru': 'pe',
  'Venezuela': 've', 'Ecuador': 'ec', 'Uruguay': 'uy',
  'Costa Rica': 'cr', 'Panama': 'pa', 'Guatemala': 'gt', 'Jamaica': 'jm',
  'Russia': 'ru', 'Kazakhstan': 'kz', 'Georgia': 'ge',
};

export const AIMarketAnalysisComponent: React.FC<AIMarketAnalysisProps> = ({ 
  industry: defaultIndustry, 
  location: defaultLocation,
  industries = [],
}) => {
  // Master list of 50+ industries for comprehensive market analysis
  const masterIndustries = [
    'Aerospace & Defense',
    'Agriculture & Farming',
    'Artificial Intelligence',
    'Automotive',
    'Banking & Financial Services',
    'Biotechnology',
    'Blockchain & Cryptocurrency',
    'Chemical Manufacturing',
    'Clean Energy & Renewables',
    'Cloud Computing',
    'Construction & Engineering',
    'Consumer Electronics',
    'Consumer Goods & FMCG',
    'Cybersecurity',
    'Data Analytics & Big Data',
    'E-Commerce & Retail',
    'Education & EdTech',
    'Electric Vehicles',
    'Energy & Utilities',
    'Entertainment & Media',
    'Environmental Services',
    'Fashion & Apparel',
    'Financial Technology (FinTech)',
    'Food & Beverage',
    'Gaming & Esports',
    'Government & Public Sector',
    'Healthcare & Life Sciences',
    'Hospitality & Tourism',
    'Human Resources & Staffing',
    'Industrial Automation',
    'Information Technology',
    'Insurance & InsurTech',
    'Internet of Things (IoT)',
    'Legal & LegalTech',
    'Logistics & Supply Chain',
    'Manufacturing',
    'Marine & Shipping',
    'Marketing & Advertising',
    'Medical Devices',
    'Mining & Metals',
    'Nanotechnology',
    'Non-Profit & Social Impact',
    'Oil & Gas',
    'Pharmaceuticals',
    'PropTech & Real Estate',
    'Quantum Computing',
    'Robotics & Automation',
    'SaaS & Enterprise Software',
    'Semiconductors & Chips',
    'Space & Satellite Technology',
    'Sports & Fitness',
    'Telecommunications',
    'Transportation & Mobility',
    'Travel & Aviation',
    'Venture Capital & Private Equity',
    'Virtual Reality & AR',
    'Waste Management & Recycling',
    'Water & Sanitation',
    'Wearable Technology',
  ];

  // Master list of 100+ countries/regions for global market analysis
  const masterLocations = [
    // North America
    'United States', 'Canada', 'Mexico',
    // Europe
    'United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands',
    'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Belgium',
    'Austria', 'Ireland', 'Portugal', 'Poland', 'Czech Republic', 'Romania',
    'Greece', 'Hungary', 'Ukraine', 'Luxembourg', 'Iceland', 'Estonia',
    'Latvia', 'Lithuania', 'Slovakia', 'Slovenia', 'Croatia', 'Serbia',
    'Bulgaria',
    // Asia-Pacific
    'China', 'Japan', 'India', 'South Korea', 'Australia', 'New Zealand',
    'Singapore', 'Hong Kong', 'Taiwan', 'Indonesia', 'Malaysia', 'Thailand',
    'Vietnam', 'Philippines', 'Bangladesh', 'Pakistan', 'Sri Lanka',
    'Myanmar', 'Cambodia', 'Mongolia',
    // Middle East
    'United Arab Emirates', 'Saudi Arabia', 'Israel', 'Qatar', 'Kuwait',
    'Bahrain', 'Oman', 'Jordan', 'Lebanon', 'Turkey', 'Iran', 'Iraq',
    // Africa
    'South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Morocco', 'Ghana',
    'Ethiopia', 'Tanzania', 'Rwanda', 'Uganda', 'Senegal', 'Ivory Coast',
    'Tunisia', 'Algeria', 'Mozambique', 'Cameroon', 'Zimbabwe',
    // South America
    'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela',
    'Ecuador', 'Uruguay', 'Paraguay', 'Bolivia',
    // Central America & Caribbean
    'Costa Rica', 'Panama', 'Guatemala', 'Dominican Republic', 'Jamaica',
    'Trinidad and Tobago', 'Puerto Rico',
    // Other
    'Russia', 'Kazakhstan', 'Uzbekistan', 'Georgia', 'Armenia',
    'Azerbaijan',
  ];

  // Merge lead industries with master list, deduplicate and sort
  const allIndustries = [...new Set([...masterIndustries, ...industries])].sort();
  // Only use master countries list; no city-level lead locations.
  const allLocations = masterLocations.sort();

  // Resolve default location to a country from the master list
  const resolvedDefault = allLocations.find(c => defaultLocation.toLowerCase().includes(c.toLowerCase())) 
    || allLocations.find(c => c === 'United States') 
    || allLocations[0];

  const [analysis, setAnalysis] = useState<AIMarketAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState(defaultIndustry);
  const [selectedLocation, setSelectedLocation] = useState(resolvedDefault);

  const loadMarketAnalysis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await aiService.analyzeMarket(selectedIndustry, selectedLocation);
      setAnalysis(result);
    } catch (err) {
      console.error('Market analysis error:', err);
      setError('Failed to load market analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedIndustry, selectedLocation]);

  useEffect(() => {
    loadMarketAnalysis();
  }, [loadMarketAnalysis]);

  const handleRefresh = () => {
    // Clear cache for this query by forcing a new analysis
    aiService.clearMarketCache(selectedIndustry, selectedLocation);
    loadMarketAnalysis();
  };

  if (loading) {
    return (
      <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
        <div className="flex flex-col items-center justify-center py-14">
          <LoadingSpinner size="lg" />
          <span className="mt-4 text-white font-medium">Analyzing {selectedIndustry} market...</span>
          <span className="mt-1 text-sm text-slate-400">Gathering trends, competitors, and opportunities</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mb-4" />
          <p className="text-red-400 font-medium mb-2">Market Analysis Failed</p>
          <p className="text-sm text-slate-400 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
      {/* Header with selectors */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-blue-500 to-cyan-500 mr-3" />
          AI Market Analysis
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Industry Selector with search */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Industry:</label>
            <div className="relative">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="bg-[#0D1117] border border-slate-600/50 text-white text-sm rounded-lg px-3 py-1.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 max-w-[320px] transition-colors"
              >
                {allIndustries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
            <span className="text-[10px] text-slate-500">({allIndustries.length} industries)</span>
          </div>
          {/* Location Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Location:</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-[#0D1117] border border-slate-600/50 text-white text-sm rounded-lg px-3 py-1.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 max-w-[320px] transition-colors"
            >
              {allLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <span className="text-[10px] text-slate-500">({allLocations.length} locations)</span>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
            title="Refresh analysis"
          >
            <ArrowPathIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Market Overview Summary */}
      {analysis.marketOverview && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#0D1117] rounded-xl p-5 border border-slate-700/40 text-center group hover:border-blue-500/30 transition-colors duration-300">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/15 w-fit mx-auto mb-3">
              <GlobeAltIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-xs text-slate-400 mb-1">Market Size</div>
            <div className="text-lg font-bold text-white">{analysis.marketOverview.marketSize}</div>
          </div>
          <div className="bg-[#0D1117] rounded-xl p-5 border border-slate-700/40 text-center group hover:border-emerald-500/30 transition-colors duration-300">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/15 w-fit mx-auto mb-3">
              <ArrowTrendingUpIcon className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-xs text-slate-400 mb-1">Growth Rate</div>
            <div className="text-lg font-bold text-emerald-400">{analysis.marketOverview.growthRate}</div>
          </div>
          <div className="bg-[#0D1117] rounded-xl p-5 border border-slate-700/40 text-center group hover:border-amber-500/30 transition-colors duration-300">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/15 w-fit mx-auto mb-3">
              <ChartBarIcon className="h-5 w-5 text-amber-400" />
            </div>
            <div className="text-xs text-slate-400 mb-1">Market Sentiment</div>
            <div className={`text-lg font-bold ${
              analysis.marketOverview.sentiment.toLowerCase().includes('bullish') || analysis.marketOverview.sentiment.toLowerCase().includes('positive') ? 'text-emerald-400' :
              analysis.marketOverview.sentiment.toLowerCase().includes('bearish') || analysis.marketOverview.sentiment.toLowerCase().includes('negative') ? 'text-red-400' :
              'text-amber-400'
            }`}>{analysis.marketOverview.sentiment}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Trends */}
        <div className="bg-[#0D1117] rounded-xl p-5 border border-slate-700/40">
          <h4 className="text-md font-medium text-white mb-4 flex items-center">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-emerald-500 to-green-500 mr-2.5" />
            Industry Trends
          </h4>
          <div className="space-y-3">
            {analysis.industryTrends.map((trend, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-slate-300 leading-relaxed">{trend}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor Insights */}
        <div className="bg-[#0D1117] rounded-xl p-5 border border-slate-700/40">
          <h4 className="text-md font-medium text-white mb-4 flex items-center">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500 mr-2.5" />
            Competitor Insights
          </h4>
          <div className="space-y-3">
            {analysis.competitorInsights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-slate-300 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Market Opportunities */}
        <div className="bg-[#0D1117] rounded-xl p-5 border border-slate-700/40">
          <h4 className="text-md font-medium text-white mb-4 flex items-center">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-500 to-yellow-500 mr-2.5" />
            Market Opportunities
          </h4>
          <div className="space-y-3">
            {analysis.marketOpportunities.map((opportunity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-slate-300 leading-relaxed">{opportunity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="bg-[#0D1117] rounded-xl p-5 border border-slate-700/40">
          <h4 className="text-md font-medium text-white mb-4 flex items-center">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-red-500 to-rose-500 mr-2.5" />
            Risk Factors
          </h4>
          <div className="space-y-3">
            {analysis.riskFactors.map((risk, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-slate-300 leading-relaxed">{risk}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 bg-[#0D1117] rounded-xl p-5 border border-slate-700/40">
        <h4 className="text-md font-medium text-white mb-4 flex items-center">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-violet-500 to-purple-500 mr-2.5" />
          AI Recommendations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.recommendations.map((recommendation, index) => (
            <div key={index} className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl hover:border-violet-500/35 transition-colors duration-200">
              <div className="flex items-start space-x-2.5">
                <span className="text-violet-400 text-sm font-bold mt-0.5 tabular-nums">{index + 1}.</span>
                <p className="text-sm text-violet-200 leading-relaxed">{recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related News Articles */}
      <div className="mt-6">
        <NewsFeed 
          query={selectedIndustry} 
          title={`${selectedIndustry} News - ${selectedLocation}`} 
          maxResults={5}
          country={countryCodeMap[selectedLocation]}
        />
      </div>
    </div>
  );
};
