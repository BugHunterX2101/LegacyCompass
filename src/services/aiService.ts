import { Lead } from '../types';
import {
  analyzeLeadWithRealAI,
  generateEmailWithRealAI,
  analyzeMarketWithRealAI,
  analyzeConversationWithRealAI,
  enrichLeadWithRealAI,
  predictLeadOutcomeWithRealAI,
} from './realAIService';

const USE_REAL_AI = true;

interface AIInsight {
  type: 'opportunity' | 'risk' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  suggestedActions?: string[];
}

interface AIAnalysis {
  leadScore: number;
  insights: AIInsight[];
  predictedConversion: number;
  bestContactTime: string;
  recommendedApproach: string;
  competitorAnalysis: string[];
  marketTrends: string[];
  recommendations?: string[];
}

interface AIEnrichmentResult {
  contactInfo: { email?: string; phone?: string; linkedin?: string; twitter?: string };
  companyInfo: { description?: string; technologies?: string[]; competitors?: string[]; fundingStage?: string; recentNews?: string[] };
  personInfo: { role?: string; experience?: string; education?: string; interests?: string[] };
  confidence: number;
}

interface AIEmailTemplate {
  subject: string;
  body: string;
  tone: 'professional' | 'casual' | 'urgent' | 'friendly';
  personalization: string[];
}

interface AIMarketAnalysis {
  industryTrends: string[];
  competitorInsights: string[];
  marketOpportunities: string[];
  riskFactors: string[];
  recommendations: string[];
  marketOverview?: { marketSize: string; growthRate: string; sentiment: string };
}

class AIService {
  private cache = new Map<string, unknown>();

  async analyzeLeadWithAI(lead: Lead): Promise<AIAnalysis> {
    const cacheKey = `analysis_${lead.id}_${new Date(lead.updatedAt).getTime()}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey) as AIAnalysis;

    let analysis: AIAnalysis;

    if (USE_REAL_AI) {
      try {
        const realAnalysis = await analyzeLeadWithRealAI(lead);
        const structuredInsights: AIInsight[] = Array.isArray(realAnalysis.insights)
          ? realAnalysis.insights.map((item: unknown) => {
              if (typeof item === 'object' && item !== null && 'title' in item && 'description' in item) {
                const ins = item as Record<string, unknown>;
                return {
                  type: (ins.type as AIInsight['type']) || 'recommendation',
                  title: String(ins.title),
                  description: String(ins.description),
                  confidence: 85,
                  priority: 'medium' as const,
                  actionable: true,
                };
              }
              return {
                type: 'recommendation' as const,
                title: 'AI Insight',
                description: typeof item === 'string' ? item : JSON.stringify(item),
                confidence: 85,
                priority: 'medium' as const,
                actionable: true,
              };
            })
          : [];

        analysis = {
          leadScore: (realAnalysis.leadScore as number) || 0,
          insights: structuredInsights,
          predictedConversion: (realAnalysis.conversionProbability as number) || 0,
          bestContactTime: (realAnalysis.bestContactTime as string) || 'unknown',
          recommendedApproach: (realAnalysis.recommendedApproach as string) || 'unknown',
          competitorAnalysis: (realAnalysis.competitorAnalysis as string[]) || [],
          marketTrends: (realAnalysis.marketTrends as string[]) || [],
          recommendations: (realAnalysis.recommendations as string[]) || [],
        };
      } catch (error) {
        console.error('Real AI failed:', error);
        throw new Error('Real-time AI analysis is currently unavailable. Please check your Groq API key configuration.');
      }
    } else {
      throw new Error('AI service is in mock-only mode, which is disabled.');
    }

    this.cache.set(cacheKey, analysis);
    return analysis;
  }



  async enrichLeadWithAI(lead: Lead): Promise<AIEnrichmentResult> {
    const cacheKey = `enrichment_${lead.companyName}_${lead.industry}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey) as AIEnrichmentResult;

    let enrichment: AIEnrichmentResult;
    if (USE_REAL_AI) {
      try {
        const realData = await enrichLeadWithRealAI(lead);
        enrichment = {
          contactInfo: {
            email: lead.email || (realData.email as string) || '',
            phone: lead.phone || (realData.phone as string) || '',
            linkedin: lead.linkedinProfile || (realData.linkedinProfile as string) || '',
            twitter: (realData.twitterHandle as string) || '',
          },
          companyInfo: {
            description: (realData.companyDescription as string) || '',
            technologies: (realData.technologies as string[]) || [],
            competitors: (realData.competitors as string[]) || [],
            fundingStage: (realData.fundingStage as string) || 'unknown',
            recentNews: (realData.recentNews as string[]) || [],
          },
          personInfo: {
            role: lead.title || (realData.predictedRole as string) || 'Business Leader',
            experience: (realData.experience as string) || 'unknown',
            education: 'unknown',
            interests: (realData.interests as string[]) || [],
          },
          confidence: 85,
        };
      } catch (error) {
        console.error('Real AI enrichment failed:', error);
        throw new Error('Real-time AI enrichment is currently unavailable. Please check your Groq API key configuration.');
      }
    } else {
      throw new Error('AI service is in mock-only mode, which is disabled.');
    }

    this.cache.set(cacheKey, enrichment);
    return enrichment;
  }



  async generatePersonalizedEmail(lead: Lead, purpose: string): Promise<AIEmailTemplate> {
    if (USE_REAL_AI) {
      try {
        const realEmail = await generateEmailWithRealAI(lead, purpose);
        return {
          subject: realEmail.subject as string,
          body: realEmail.body as string,
          tone: (realEmail.tone as AIEmailTemplate['tone']) || 'professional',
          personalization: (realEmail.personalization as string[]) || [],
        };
      } catch (error) {
        console.error('Real AI email failed:', error);
        throw new Error('Real-time AI email generation is currently unavailable. Please check your Groq API key configuration.');
      }
    }
    throw new Error('AI service is in mock-only mode, which is disabled.');
  }

  async analyzeMarket(industry: string, location: string): Promise<AIMarketAnalysis> {
    const cacheKey = `market_${industry}_${location}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey) as AIMarketAnalysis;

    let analysis: AIMarketAnalysis;
    if (USE_REAL_AI) {
      try {
        const realAnalysis = await analyzeMarketWithRealAI(industry, location);
        analysis = {
          marketOverview: realAnalysis.marketOverview as AIMarketAnalysis['marketOverview'] || undefined,
          industryTrends: (realAnalysis.industryTrends as string[]) || [],
          competitorInsights: (realAnalysis.competitorInsights as string[]) || [],
          marketOpportunities: (realAnalysis.marketOpportunities as string[]) || [],
          riskFactors: (realAnalysis.riskFactors as string[]) || [],
          recommendations: (realAnalysis.recommendations as string[]) || [],
        };
      } catch (error) {
        console.error('Real AI market analysis failed:', error);
        throw new Error(`Real-time market analysis for ${industry} in ${location} is currently unavailable. Please check your Groq API key configuration.`);
      }
    } else {
      throw new Error('AI service is in mock-only mode, which is disabled.');
    }

    this.cache.set(cacheKey, analysis);
    return analysis;
  }

  clearMarketCache(industry: string, location: string) {
    this.cache.delete(`market_${industry}_${location}`);
  }

  async analyzeConversation(messages: string[]): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    intent: string;
    nextBestAction: string;
    urgency: 'high' | 'medium' | 'low';
    topics: string[];
  }> {
    if (USE_REAL_AI) {
      try {
        const r = await analyzeConversationWithRealAI(messages);
        return {
          sentiment: (r.sentiment as 'positive' | 'neutral' | 'negative') || 'neutral',
          intent: (r.intent as string) || 'unknown',
          nextBestAction: (r.nextBestAction as string) || 'unknown',
          urgency: (r.urgency as 'high' | 'medium' | 'low') || 'medium',
          topics: (r.topics as string[]) || [],
        };
      } catch (error) {
        console.error('Real AI conversation analysis failed:', error);
        throw new Error('Real-time AI conversation analysis is currently unavailable. Please check your Groq API key configuration.');
      }
    }
    throw new Error('AI service is in mock-only mode, which is disabled.');
  }

  async findSimilarLeads(lead: Lead, allLeads: Lead[]): Promise<Lead[]> {
    await this.delay(300);
    return allLeads
      .filter(l => l.id !== lead.id)
      .map(l => ({ ...l, _similarity: this.calculateSimilarity(lead, l) }))
      .sort((a, b) => (b as Lead & { _similarity: number })._similarity - (a as Lead & { _similarity: number })._similarity)
      .slice(0, 5);
  }

  async predictLeadOutcome(lead: Lead) {
    if (USE_REAL_AI) {
      try {
        const r = await predictLeadOutcomeWithRealAI(lead);
        return {
          conversionProbability: (r.conversionProbability as number) ?? 50,
          timeToConversion: (r.timeToConversion as string) || 'unknown',
          valueEstimate: (r.valueEstimate as number) || 0,
          riskFactors: (r.riskFactors as string[]) || [],
          successFactors: (r.successFactors as string[]) || [],
        };
      } catch (error) {
        console.error('Real AI prediction failed:', error);
        throw new Error('Real-time AI prediction is currently unavailable. Please check your Groq API key configuration.');
      }
    }
    throw new Error('AI service is in mock-only mode, which is disabled.');
  }

  private calculateSimilarity(lead1: Lead, lead2: Lead): number {
    let s = 0;
    if (lead1.industry === lead2.industry) s += 30;
    if (Math.abs(lead1.employeeCount - lead2.employeeCount) < 100) s += 20;
    if (lead1.location === lead2.location) s += 25;
    if (Math.abs(lead1.score - lead2.score) < 10) s += 25;
    return s;
  }
  private delay(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)); }

  clearCache(): void { this.cache.clear(); }
  getCacheSize(): number { return this.cache.size; }
}

export const aiService = new AIService();
