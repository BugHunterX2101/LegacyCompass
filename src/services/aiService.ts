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
          : this.generateAIInsights(lead);

        analysis = {
          leadScore: (realAnalysis.leadScore as number) || this.calculateAdvancedLeadScore(lead),
          insights: structuredInsights.length > 0 ? structuredInsights : this.generateAIInsights(lead),
          predictedConversion: (realAnalysis.conversionProbability as number) || this.predictConversionProbability(lead),
          bestContactTime: (realAnalysis.bestContactTime as string) || this.predictBestContactTime(lead),
          recommendedApproach: (realAnalysis.recommendedApproach as string) || this.recommendContactApproach(lead),
          competitorAnalysis: (realAnalysis.competitorAnalysis as string[]) || this.analyzeCompetitors(lead),
          marketTrends: (realAnalysis.marketTrends as string[]) || this.analyzeMarketTrends(lead),
          recommendations: (realAnalysis.recommendations as string[]) || [],
        };
      } catch (error) {
        console.error('Real AI failed, using mock:', error);
        analysis = this.getMockAnalysis(lead);
      }
    } else {
      analysis = this.getMockAnalysis(lead);
    }

    this.cache.set(cacheKey, analysis);
    return analysis;
  }

  private getMockAnalysis(lead: Lead): AIAnalysis {
    return {
      leadScore: this.calculateAdvancedLeadScore(lead),
      insights: this.generateAIInsights(lead),
      predictedConversion: this.predictConversionProbability(lead),
      bestContactTime: this.predictBestContactTime(lead),
      recommendedApproach: this.recommendContactApproach(lead),
      competitorAnalysis: this.analyzeCompetitors(lead),
      marketTrends: this.analyzeMarketTrends(lead),
      recommendations: [],
    };
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
            email: lead.email || this.generateProfessionalEmail(lead.companyName, lead.contactPerson),
            phone: lead.phone || '',
            linkedin: lead.linkedinProfile || this.generateLinkedInProfile(lead.contactPerson),
            twitter: this.generateTwitterHandle(lead.companyName),
          },
          companyInfo: {
            description: (realData.companyDescription as string) || this.generateCompanyDescription(lead),
            technologies: (realData.technologies as string[]) || this.predictTechnologies(lead),
            competitors: (realData.competitors as string[]) || this.identifyCompetitors(lead),
            fundingStage: (realData.fundingStage as string) || this.predictFundingStage(lead),
            recentNews: (realData.recentNews as string[]) || this.generateRecentNews(lead),
          },
          personInfo: {
            role: lead.title || (realData.predictedRole as string) || this.predictRole(lead),
            experience: (realData.experience as string) || '10+ years',
            education: 'University educated',
            interests: (realData.interests as string[]) || this.predictInterests(lead),
          },
          confidence: 85,
        };
      } catch {
        enrichment = this.getMockEnrichment(lead);
      }
    } else {
      enrichment = this.getMockEnrichment(lead);
    }

    this.cache.set(cacheKey, enrichment);
    return enrichment;
  }

  private getMockEnrichment(lead: Lead): AIEnrichmentResult {
    return {
      contactInfo: {
        email: lead.email || this.generateProfessionalEmail(lead.companyName, lead.contactPerson),
        phone: lead.phone || '',
        linkedin: lead.linkedinProfile || this.generateLinkedInProfile(lead.contactPerson),
        twitter: this.generateTwitterHandle(lead.companyName),
      },
      companyInfo: {
        description: this.generateCompanyDescription(lead),
        technologies: this.predictTechnologies(lead),
        competitors: this.identifyCompetitors(lead),
        fundingStage: this.predictFundingStage(lead),
        recentNews: this.generateRecentNews(lead),
      },
      personInfo: {
        role: lead.title || 'Business Leader',
        experience: '10+ years in industry',
        education: 'University educated',
        interests: this.predictInterests(lead),
      },
      confidence: 70,
    };
  }

  async generatePersonalizedEmail(lead: Lead, purpose: string): Promise<AIEmailTemplate> {
    if (USE_REAL_AI) {
      try {
        const realEmail = await generateEmailWithRealAI(lead, purpose);
        return {
          subject: realEmail.subject as string,
          body: realEmail.body as string,
          tone: (realEmail.tone as AIEmailTemplate['tone']) || 'professional',
          personalization: (realEmail.personalization as string[]) || this.getPersonalizationPoints(lead),
        };
      } catch (error) {
        console.error('Real AI email failed, using mock:', error);
      }
    }

    await this.delay(600);
    const templates = this.getEmailTemplates(purpose);
    const t = templates[0];
    return {
      subject: this.personalizeSubject(t.subject, lead),
      body: this.personalizeBody(t.body, lead),
      tone: t.tone,
      personalization: this.getPersonalizationPoints(lead),
    };
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
          industryTrends: (realAnalysis.industryTrends as string[]) || this.generateIndustryTrends(industry),
          competitorInsights: (realAnalysis.competitorInsights as string[]) || this.generateCompetitorInsights(industry),
          marketOpportunities: (realAnalysis.marketOpportunities as string[]) || this.identifyMarketOpportunities(industry, location),
          riskFactors: (realAnalysis.riskFactors as string[]) || this.identifyRiskFactors(industry),
          recommendations: (realAnalysis.recommendations as string[]) || this.generateMarketRecommendations(industry, location),
        };
      } catch (error) {
        console.error('Real AI market analysis failed:', error);
        analysis = {
          industryTrends: this.generateIndustryTrends(industry),
          competitorInsights: this.generateCompetitorInsights(industry),
          marketOpportunities: this.identifyMarketOpportunities(industry, location),
          riskFactors: this.identifyRiskFactors(industry),
          recommendations: this.generateMarketRecommendations(industry, location),
        };
      }
    } else {
      analysis = {
        industryTrends: this.generateIndustryTrends(industry),
        competitorInsights: this.generateCompetitorInsights(industry),
        marketOpportunities: this.identifyMarketOpportunities(industry, location),
        riskFactors: this.identifyRiskFactors(industry),
        recommendations: this.generateMarketRecommendations(industry, location),
      };
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
          intent: (r.intent as string) || this.analyzeIntent(messages),
          nextBestAction: (r.nextBestAction as string) || this.recommendNextAction(messages),
          urgency: (r.urgency as 'high' | 'medium' | 'low') || 'medium',
          topics: (r.topics as string[]) || this.extractTopics(messages),
        };
      } catch (error) {
        console.error('Real AI conversation analysis failed:', error);
      }
    }
    await this.delay(400);
    return {
      sentiment: 'neutral',
      intent: this.analyzeIntent(messages),
      nextBestAction: this.recommendNextAction(messages),
      urgency: 'medium',
      topics: this.extractTopics(messages),
    };
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
          timeToConversion: (r.timeToConversion as string) || this.predictTimeToConversion(lead),
          valueEstimate: (r.valueEstimate as number) || this.estimateLeadValue(lead),
          riskFactors: (r.riskFactors as string[]) || this.identifyLeadRisks(lead),
          successFactors: (r.successFactors as string[]) || this.identifySuccessFactors(lead),
        };
      } catch (error) {
        console.error('Real AI prediction failed:', error);
      }
    }
    await this.delay(500);
    return {
      conversionProbability: 50,
      timeToConversion: this.predictTimeToConversion(lead),
      valueEstimate: this.estimateLeadValue(lead),
      riskFactors: this.identifyLeadRisks(lead),
      successFactors: this.identifySuccessFactors(lead),
    };
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private calculateAdvancedLeadScore(lead: Lead): number {
    let score = 0;
    if (lead.employeeCount > 1000) score += 25;
    else if (lead.employeeCount > 100) score += 20;
    else if (lead.employeeCount > 10) score += 15;
    else score += 10;
    if (lead.revenue && lead.revenue > 100000000) score += 25;
    else if (lead.revenue && lead.revenue > 10000000) score += 20;
    else if (lead.revenue && lead.revenue > 1000000) score += 15;
    else score += 10;
    const highValue = ['Technology', 'Financial Services', 'Healthcare'];
    if (highValue.includes(lead.industry)) score += 20; else score += 10;
    if (lead.email) score += 10;
    if (lead.phone) score += 10;
    if (lead.linkedinProfile) score += 5;
    const tier1 = ['San Francisco', 'New York', 'London', 'Singapore'];
    if (tier1.some(c => lead.location.includes(c))) score += 15; else score += 5;
    return Math.min(score, 100);
  }

  private generateAIInsights(lead: Lead): AIInsight[] {
    const insights: AIInsight[] = [];
    if (lead.employeeCount > 500 && lead.revenue && lead.revenue > 50000000) {
      insights.push({ type: 'opportunity', title: 'High-Value Enterprise Opportunity', description: 'This lead represents a significant enterprise opportunity with strong revenue potential.', confidence: 92, priority: 'high', actionable: true, suggestedActions: ['Schedule executive demo', 'Prepare enterprise proposal'] });
    }
    if (lead.industry === 'Technology') {
      insights.push({ type: 'recommendation', title: 'Technology Industry Alignment', description: 'Strong product-market fit detected. Emphasize technical capabilities and integration options.', confidence: 88, priority: 'medium', actionable: true, suggestedActions: ['Highlight API capabilities', 'Offer technical demo'] });
    }
    if (lead.employeeCount < 50 && (!lead.revenue || lead.revenue < 1000000)) {
      insights.push({ type: 'risk', title: 'Early-Stage Company Risk', description: 'Small company size may indicate budget constraints and longer decision cycles.', confidence: 78, priority: 'medium', actionable: true, suggestedActions: ['Offer startup-friendly pricing', 'Focus on ROI'] });
    }
    if (insights.length === 0) {
      insights.push({ type: 'recommendation', title: 'Engage With Personalized Outreach', description: `${lead.companyName} shows moderate potential. Personalized outreach tailored to ${lead.industry} challenges is recommended.`, confidence: 75, priority: 'medium', actionable: true });
    }
    return insights;
  }

  private predictConversionProbability(lead: Lead): number {
    let p = 50;
    if (lead.score > 80) p += 30;
    else if (lead.score > 60) p += 20;
    else if (lead.score > 40) p += 10;
    if (lead.status === 'qualified') p += 25;
    else if (lead.status === 'contacted') p += 15;
    if (lead.employeeCount > 100) p += 10;
    if (lead.revenue && lead.revenue > 10000000) p += 15;
    return Math.min(p, 95);
  }

  private predictBestContactTime(lead: Lead): string {
    const tz: Record<string, string> = { 'San Francisco': 'PST - 10:00 AM–12:00 PM', 'New York': 'EST - 9:00 AM–11:00 AM', 'London': 'GMT - 2:00 PM–4:00 PM', 'Singapore': 'SGT - 9:00 AM–11:00 AM' };
    for (const [city, time] of Object.entries(tz)) {
      if (lead.location.includes(city)) return time;
    }
    return 'Local business hours - 10:00 AM–12:00 PM';
  }

  private recommendContactApproach(lead: Lead): string {
    if (lead.score > 85) return 'Direct executive outreach with personalized value proposition';
    if (lead.score > 70) return 'Professional email with relevant case study and demo offer';
    if (lead.score > 50) return 'Educational content approach with industry insights';
    return 'Nurture campaign with valuable resources and thought leadership';
  }

  private analyzeCompetitors(lead: Lead): string[] {
    const map: Record<string, string[]> = {
      Technology: ['Salesforce', 'HubSpot', 'Microsoft', 'Oracle', 'SAP'],
      Healthcare: ['Epic Systems', 'Cerner', 'Allscripts', 'athenahealth'],
      'Financial Services': ['Temenos', 'FIS', 'Jack Henry', 'Fiserv'],
    };
    return map[lead.industry] || ['Industry-specific competitors', 'Generic enterprise solutions'];
  }

  private analyzeMarketTrends(lead: Lead): string[] {
    const map: Record<string, string[]> = {
      Technology: ['AI/ML adoption increasing', 'Cloud-first strategies', 'Remote work tools demand'],
      Healthcare: ['Digital health transformation', 'Telemedicine growth', 'Data privacy focus'],
      'Financial Services': ['Fintech disruption', 'Digital banking', 'Regulatory compliance'],
    };
    return map[lead.industry] || ['Digital transformation', 'Automation trends', 'Data-driven decisions'];
  }

  private generateProfessionalEmail(companyName: string, contactPerson?: string): string {
    if (!contactPerson) return `info@${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
    const [first, last = ''] = contactPerson.toLowerCase().split(' ');
    const domain = companyName.toLowerCase().replace(/\s+/g, '');
    return `${first}.${last}@${domain}.com`;
  }

  private generateLinkedInProfile(contactPerson?: string): string {
    if (!contactPerson) return '';
    return `https://linkedin.com/in/${contactPerson.toLowerCase().replace(/\s+/g, '-')}`;
  }

  private generateTwitterHandle(companyName: string): string {
    return `https://twitter.com/${companyName.toLowerCase().replace(/\s+/g, '')}`;
  }

  private generateCompanyDescription(lead: Lead): string {
    return `${lead.companyName} is a leading ${lead.industry.toLowerCase()} company focused on innovation and growth.`;
  }

  private predictTechnologies(lead: Lead): string[] {
    const map: Record<string, string[]> = { Technology: ['React', 'Node.js', 'AWS', 'Docker', 'PostgreSQL'], Healthcare: ['FHIR', 'HL7', 'Epic', 'HIPAA Compliance'], 'Financial Services': ['Blockchain', 'API Security', 'Compliance Tools'] };
    return map[lead.industry] || ['CRM', 'Analytics', 'Cloud Services'];
  }

  private identifyCompetitors(lead: Lead): string[] { return this.analyzeCompetitors(lead).slice(0, 3); }
  private predictFundingStage(lead: Lead): string {
    if (!lead.revenue) return 'Unknown';
    if (lead.revenue > 100000000) return 'Growth/Late Stage';
    if (lead.revenue > 10000000) return 'Series B/C';
    if (lead.revenue > 1000000) return 'Series A';
    return 'Seed/Early Stage';
  }
  private generateRecentNews(lead: Lead): string[] { return [`${lead.companyName} announces expansion into new markets`, `${lead.companyName} invests in digital transformation initiatives`]; }
  private predictRole(_lead: Lead): string { return 'Business Leader'; }
  private predictInterests(_lead: Lead): string[] { return ['Innovation', 'Digital Transformation', 'Team Leadership']; }

  private getEmailTemplates(purpose: string) {
    const templates: Record<string, Array<{ subject: string; body: string; tone: AIEmailTemplate['tone'] }>> = {
      introduction: [{ subject: 'Partnership opportunity with {companyName}', body: 'Hi {firstName},\n\nI hope this email finds you well. I came across {companyName} and was impressed by your work in {industry}.\n\nI believe there\'s a great opportunity for us to collaborate. Would you be open to a brief 15-minute call?\n\nBest regards', tone: 'professional' }],
      followup: [{ subject: 'Following up on our conversation', body: 'Hi {firstName},\n\nI wanted to follow up on our previous conversation about {companyName}\'s growth initiatives.\n\nAre you available for a quick call this week?\n\nBest regards', tone: 'friendly' }],
    };
    return templates[purpose] || templates.introduction;
  }

  private personalizeSubject(subject: string, lead: Lead): string { return subject.replace('{companyName}', lead.companyName).replace('{industry}', lead.industry); }
  private personalizeBody(body: string, lead: Lead): string {
    const firstName = lead.contactPerson?.split(' ')[0] || 'there';
    return body.replace('{firstName}', firstName).replace('{companyName}', lead.companyName).replace('{industry}', lead.industry);
  }
  private getPersonalizationPoints(lead: Lead): string[] { return [`Company: ${lead.companyName}`, `Industry: ${lead.industry}`, `Location: ${lead.location}`, `Size: ${lead.employeeCount} employees`]; }

  private generateIndustryTrends(industry: string): string[] { return this.analyzeMarketTrends({ industry } as Lead); }
  private generateCompetitorInsights(_industry: string): string[] { return ['Market consolidation creating opportunities', 'New entrants disrupting traditional models', 'Technology adoption accelerating competition']; }
  private identifyMarketOpportunities(industry: string, location: string): string[] { return [`Growing demand in ${industry} sector`, `${location} market expansion potential`, 'Digital transformation driving new opportunities']; }
  private identifyRiskFactors(_industry: string): string[] { return ['Economic uncertainty affecting budgets', 'Regulatory changes impacting industry', 'Competitive pressure on pricing']; }
  private generateMarketRecommendations(industry: string, location: string): string[] { return [`Focus on ${industry} digital transformation needs`, `Leverage ${location} market connections`, 'Emphasize ROI and competitive advantages']; }

  private analyzeIntent(_messages: string[]): string { return ['Purchase Intent', 'Information Gathering', 'Comparison Shopping', 'Support Request'][Math.floor(Math.random() * 4)]; }
  private recommendNextAction(_messages: string[]): string { return ['Schedule product demo', 'Send detailed proposal', 'Provide case study', 'Arrange technical consultation'][Math.floor(Math.random() * 4)]; }
  private extractTopics(_messages: string[]): string[] { return ['Pricing', 'Features', 'Implementation', 'Support']; }
  private calculateSimilarity(lead1: Lead, lead2: Lead): number {
    let s = 0;
    if (lead1.industry === lead2.industry) s += 30;
    if (Math.abs(lead1.employeeCount - lead2.employeeCount) < 100) s += 20;
    if (lead1.location === lead2.location) s += 25;
    if (Math.abs(lead1.score - lead2.score) < 10) s += 25;
    return s;
  }
  private predictTimeToConversion(lead: Lead): string { return lead.score > 80 ? '2-4 weeks' : lead.score > 60 ? '1-2 months' : lead.score > 40 ? '2-4 months' : '4-6 months'; }
  private estimateLeadValue(lead: Lead): number {
    let v = 10000;
    if (lead.employeeCount > 1000) v *= 5; else if (lead.employeeCount > 100) v *= 3; else if (lead.employeeCount > 10) v *= 2;
    if (lead.revenue && lead.revenue > 100000000) v *= 3; else if (lead.revenue && lead.revenue > 10000000) v *= 2;
    return Math.floor(v);
  }
  private identifyLeadRisks(lead: Lead): string[] {
    const r = [];
    if (lead.employeeCount < 50) r.push('Small company - budget constraints');
    if (!lead.email && !lead.phone) r.push('Limited contact information');
    if (lead.score < 50) r.push('Low engagement score');
    return r.length > 0 ? r : ['Market uncertainty'];
  }
  private identifySuccessFactors(lead: Lead): string[] {
    const f = [];
    if (lead.score > 80) f.push('High engagement score');
    if (lead.employeeCount > 100) f.push('Established company size');
    if (lead.revenue && lead.revenue > 10000000) f.push('Strong revenue base');
    return f.length > 0 ? f : ['Engaged prospect'];
  }
  private delay(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)); }

  clearCache(): void { this.cache.clear(); }
  getCacheSize(): number { return this.cache.size; }
}

export const aiService = new AIService();
