import { Lead } from '../types';
import { analyzeLeadWithRealAI, generateEmailWithRealAI, analyzeMarketWithRealAI, analyzeConversationWithRealAI, enrichLeadWithRealAI, predictLeadOutcomeWithRealAI } from './realAIService';

// Always try real AI first (calls go through /api/ai proxy), fall back to mock on error
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
}

interface AIEnrichmentResult {
  contactInfo: {
    email?: string;
    phone?: string;
    linkedin?: string;
    twitter?: string;
  };
  companyInfo: {
    description?: string;
    technologies?: string[];
    competitors?: string[];
    fundingStage?: string;
    recentNews?: string[];
  };
  personInfo: {
    role?: string;
    experience?: string;
    education?: string;
    interests?: string[];
  };
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
  marketOverview?: {
    marketSize: string;
    growthRate: string;
    sentiment: string;
  };
}

class AIService {
  private cache = new Map<string, any>();
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;

  // AI Lead Scoring with real or mock AI
  async analyzeLeadWithAI(lead: Lead): Promise<AIAnalysis> {
    const cacheKey = `analysis_${lead.id}_${lead.updatedAt.getTime()}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let analysis: AIAnalysis;

    if (USE_REAL_AI) {
      try {
        const realAnalysis = await analyzeLeadWithRealAI(lead);
        
        // Handle structured insights from AI (objects with title+description) or plain strings
        const structuredInsights = Array.isArray(realAnalysis.insights) 
          ? realAnalysis.insights.map((item: any) => {
              if (typeof item === 'object' && item.title && item.description) {
                return {
                  type: item.type || 'recommendation',
                  title: item.title,
                  description: item.description,
                  confidence: 85,
                  priority: 'medium' as const,
                  actionable: true
                };
              }
              // Fallback for plain string insights
              return {
                type: 'recommendation' as const,
                title: 'AI Insight',
                description: typeof item === 'string' ? item : JSON.stringify(item),
                confidence: 85,
                priority: 'medium' as const,
                actionable: true
              };
            })
          : this.generateAIInsights(lead);

        analysis = {
          leadScore: realAnalysis.leadScore || this.calculateAdvancedLeadScore(lead),
          insights: structuredInsights.length > 0 ? structuredInsights : this.generateAIInsights(lead),
          predictedConversion: realAnalysis.conversionProbability || this.predictConversionProbability(lead),
          bestContactTime: realAnalysis.bestContactTime || this.predictBestContactTime(lead),
          recommendedApproach: realAnalysis.recommendedApproach || this.recommendContactApproach(lead),
          competitorAnalysis: realAnalysis.competitorAnalysis || this.analyzeCompetitors(lead),
          marketTrends: realAnalysis.marketTrends || this.analyzeMarketTrends(lead)
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
      marketTrends: this.analyzeMarketTrends(lead)
    };
  }

  // AI-powered lead enrichment
  async enrichLeadWithAI(lead: Lead): Promise<AIEnrichmentResult> {
    const cacheKey = `enrichment_${lead.companyName}_${lead.industry}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let enrichment: AIEnrichmentResult;

    if (USE_REAL_AI) {
      try {
        const realData = await enrichLeadWithRealAI(lead);
        enrichment = {
          contactInfo: {
            email: lead.email || this.generateProfessionalEmail(lead.companyName, lead.contactPerson),
            phone: lead.phone || this.generatePhoneNumber(lead.location),
            linkedin: lead.linkedinProfile || this.generateLinkedInProfile(lead.contactPerson),
            twitter: this.generateTwitterHandle(lead.companyName)
          },
          companyInfo: {
            description: realData.companyDescription || this.generateCompanyDescription(lead),
            technologies: realData.technologies || this.predictTechnologies(lead),
            competitors: realData.competitors || this.identifyCompetitors(lead),
            fundingStage: realData.fundingStage || this.predictFundingStage(lead),
            recentNews: realData.recentNews || this.generateRecentNews(lead)
          },
          personInfo: {
            role: lead.title || realData.predictedRole || this.predictRole(lead),
            experience: realData.experience || this.predictExperience(lead),
            education: this.predictEducation(lead),
            interests: realData.interests || this.predictInterests(lead)
          },
          confidence: 85
        };
      } catch (error) {
        console.error('Real AI enrichment failed, using mock:', error);
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
        phone: lead.phone || this.generatePhoneNumber(lead.location),
        linkedin: lead.linkedinProfile || this.generateLinkedInProfile(lead.contactPerson),
        twitter: this.generateTwitterHandle(lead.companyName)
      },
      companyInfo: {
        description: this.generateCompanyDescription(lead),
        technologies: this.predictTechnologies(lead),
        competitors: this.identifyCompetitors(lead),
        fundingStage: this.predictFundingStage(lead),
        recentNews: this.generateRecentNews(lead)
      },
      personInfo: {
        role: lead.title || this.predictRole(lead),
        experience: this.predictExperience(lead),
        education: this.predictEducation(lead),
        interests: this.predictInterests(lead)
      },
      confidence: Math.random() * 30 + 70
    };
  }

  // AI Email Generation with real or mock AI
  async generatePersonalizedEmail(lead: Lead, purpose: string): Promise<AIEmailTemplate> {
    if (USE_REAL_AI) {
      try {
        const realEmail = await generateEmailWithRealAI(lead, purpose);
        return {
          subject: realEmail.subject,
          body: realEmail.body,
          tone: realEmail.tone || 'professional',
          personalization: realEmail.personalization || this.getPersonalizationPoints(lead)
        };
      } catch (error) {
        console.error('Real AI failed, using mock:', error);
      }
    }

    await this.delay(600);
    const templates = this.getEmailTemplates(purpose);
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];

    return {
      subject: this.personalizeSubject(selectedTemplate.subject, lead),
      body: this.personalizeBody(selectedTemplate.body, lead),
      tone: selectedTemplate.tone,
      personalization: this.getPersonalizationPoints(lead)
    };
  }

  // AI Market Analysis
  async analyzeMarket(industry: string, location: string): Promise<AIMarketAnalysis> {
    const cacheKey = `market_${industry}_${location}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let analysis: AIMarketAnalysis;

    if (USE_REAL_AI) {
      try {
        const realAnalysis = await analyzeMarketWithRealAI(industry, location);
        analysis = {
          marketOverview: realAnalysis.marketOverview || undefined,
          industryTrends: realAnalysis.industryTrends || this.generateIndustryTrends(industry),
          competitorInsights: realAnalysis.competitorInsights || this.generateCompetitorInsights(industry),
          marketOpportunities: realAnalysis.marketOpportunities || this.identifyMarketOpportunities(industry, location),
          riskFactors: realAnalysis.riskFactors || this.identifyRiskFactors(industry),
          recommendations: realAnalysis.recommendations || this.generateMarketRecommendations(industry, location)
        };
      } catch (error) {
        console.error('Real AI market analysis failed, using mock:', error);
        analysis = {
          industryTrends: this.generateIndustryTrends(industry),
          competitorInsights: this.generateCompetitorInsights(industry),
          marketOpportunities: this.identifyMarketOpportunities(industry, location),
          riskFactors: this.identifyRiskFactors(industry),
          recommendations: this.generateMarketRecommendations(industry, location)
        };
      }
    } else {
      analysis = {
        industryTrends: this.generateIndustryTrends(industry),
        competitorInsights: this.generateCompetitorInsights(industry),
        marketOpportunities: this.identifyMarketOpportunities(industry, location),
        riskFactors: this.identifyRiskFactors(industry),
        recommendations: this.generateMarketRecommendations(industry, location)
      };
    }

    this.cache.set(cacheKey, analysis);
    return analysis;
  }

  clearMarketCache(industry: string, location: string) {
    this.cache.delete(`market_${industry}_${location}`);
  }

  // AI Conversation Intelligence
  async analyzeConversation(messages: string[]): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    intent: string;
    nextBestAction: string;
    urgency: 'high' | 'medium' | 'low';
    topics: string[];
  }> {
    if (USE_REAL_AI) {
      try {
        const realResult = await analyzeConversationWithRealAI(messages);
        return {
          sentiment: realResult.sentiment || 'neutral',
          intent: realResult.intent || this.analyzeIntent(messages),
          nextBestAction: realResult.nextBestAction || this.recommendNextAction(messages),
          urgency: realResult.urgency || 'medium',
          topics: realResult.topics || this.extractTopics(messages)
        };
      } catch (error) {
        console.error('Real AI conversation analysis failed, using mock:', error);
      }
    }

    await this.delay(400);
    return {
      sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
      intent: this.analyzeIntent(messages),
      nextBestAction: this.recommendNextAction(messages),
      urgency: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
      topics: this.extractTopics(messages)
    };
  }

  // AI Lead Matching
  async findSimilarLeads(lead: Lead, allLeads: Lead[]): Promise<Lead[]> {
    await this.delay(300);

    return allLeads
      .filter(l => l.id !== lead.id)
      .map(l => ({
        ...l,
        similarity: this.calculateSimilarity(lead, l)
      }))
      .sort((a, b) => (b as any).similarity - (a as any).similarity)
      .slice(0, 5);
  }

  // AI Predictive Analytics
  async predictLeadOutcome(lead: Lead): Promise<{
    conversionProbability: number;
    timeToConversion: string;
    valueEstimate: number;
    riskFactors: string[];
    successFactors: string[];
  }> {
    if (USE_REAL_AI) {
      try {
        const realPrediction = await predictLeadOutcomeWithRealAI(lead);
        return {
          conversionProbability: realPrediction.conversionProbability ?? (Math.random() * 40 + 60),
          timeToConversion: realPrediction.timeToConversion || this.predictTimeToConversion(lead),
          valueEstimate: realPrediction.valueEstimate || this.estimateLeadValue(lead),
          riskFactors: realPrediction.riskFactors || this.identifyLeadRisks(lead),
          successFactors: realPrediction.successFactors || this.identifySuccessFactors(lead)
        };
      } catch (error) {
        console.error('Real AI prediction failed, using mock:', error);
      }
    }

    await this.delay(500);
    return {
      conversionProbability: Math.random() * 40 + 60,
      timeToConversion: this.predictTimeToConversion(lead),
      valueEstimate: this.estimateLeadValue(lead),
      riskFactors: this.identifyLeadRisks(lead),
      successFactors: this.identifySuccessFactors(lead)
    };
  }

  // Private helper methods
  private calculateAdvancedLeadScore(lead: Lead): number {
    let score = 0;
    
    // Company size factor
    if (lead.employeeCount > 1000) score += 25;
    else if (lead.employeeCount > 100) score += 20;
    else if (lead.employeeCount > 10) score += 15;
    else score += 10;

    // Revenue factor
    if (lead.revenue && lead.revenue > 100000000) score += 25;
    else if (lead.revenue && lead.revenue > 10000000) score += 20;
    else if (lead.revenue && lead.revenue > 1000000) score += 15;
    else score += 10;

    // Industry factor
    const highValueIndustries = ['Technology', 'Financial Services', 'Healthcare'];
    if (highValueIndustries.includes(lead.industry)) score += 20;
    else score += 10;

    // Contact completeness
    if (lead.email) score += 10;
    if (lead.phone) score += 10;
    if (lead.linkedinProfile) score += 5;

    // Geographic factor
    const tierOneCities = ['San Francisco', 'New York', 'London', 'Singapore'];
    if (tierOneCities.some(city => lead.location.includes(city))) score += 15;
    else score += 5;

    return Math.min(score, 100);
  }

  private generateAIInsights(lead: Lead): AIInsight[] {
    const insights: AIInsight[] = [];

    // High-value opportunity
    if (lead.employeeCount > 500 && lead.revenue && lead.revenue > 50000000) {
      insights.push({
        type: 'opportunity',
        title: 'High-Value Enterprise Opportunity',
        description: 'This lead represents a significant enterprise opportunity with strong revenue potential.',
        confidence: 92,
        priority: 'high',
        actionable: true,
        suggestedActions: ['Schedule executive demo', 'Prepare enterprise proposal', 'Involve senior stakeholders']
      });
    }

    // Technology fit
    if (lead.industry === 'Technology') {
      insights.push({
        type: 'recommendation',
        title: 'Technology Industry Alignment',
        description: 'Strong product-market fit detected. Emphasize technical capabilities and integration options.',
        confidence: 88,
        priority: 'medium',
        actionable: true,
        suggestedActions: ['Highlight API capabilities', 'Provide technical documentation', 'Offer technical demo']
      });
    }

    // Geographic advantage
    if (lead.location.includes('San Francisco') || lead.location.includes('Silicon Valley')) {
      insights.push({
        type: 'opportunity',
        title: 'Silicon Valley Advantage',
        description: 'Located in a high-innovation area with strong network effects and funding availability.',
        confidence: 85,
        priority: 'medium',
        actionable: true,
        suggestedActions: ['Leverage local connections', 'Mention other Silicon Valley clients', 'Offer in-person meeting']
      });
    }

    // Risk assessment
    if (lead.employeeCount < 50 && (!lead.revenue || lead.revenue < 1000000)) {
      insights.push({
        type: 'risk',
        title: 'Early-Stage Company Risk',
        description: 'Small company size may indicate budget constraints and longer decision cycles.',
        confidence: 78,
        priority: 'medium',
        actionable: true,
        suggestedActions: ['Offer startup-friendly pricing', 'Focus on ROI and growth potential', 'Provide flexible terms']
      });
    }

    return insights;
  }

  private predictConversionProbability(lead: Lead): number {
    let probability = 50; // Base probability

    if (lead.score > 80) probability += 30;
    else if (lead.score > 60) probability += 20;
    else if (lead.score > 40) probability += 10;

    if (lead.status === 'qualified') probability += 25;
    else if (lead.status === 'contacted') probability += 15;

    if (lead.employeeCount > 100) probability += 10;
    if (lead.revenue && lead.revenue > 10000000) probability += 15;

    return Math.min(probability, 95);
  }

  private predictBestContactTime(lead: Lead): string {
    const timeZones = {
      'San Francisco': 'PST - 10:00 AM - 12:00 PM',
      'New York': 'EST - 9:00 AM - 11:00 AM',
      'London': 'GMT - 2:00 PM - 4:00 PM',
      'Singapore': 'SGT - 9:00 AM - 11:00 AM'
    };

    for (const [city, time] of Object.entries(timeZones)) {
      if (lead.location.includes(city)) {
        return time;
      }
    }

    return 'Local business hours - 10:00 AM - 12:00 PM';
  }

  private recommendContactApproach(lead: Lead): string {
    if (lead.score > 85) {
      return 'Direct executive outreach with personalized value proposition';
    } else if (lead.score > 70) {
      return 'Professional email with relevant case study and demo offer';
    } else if (lead.score > 50) {
      return 'Educational content approach with industry insights';
    } else {
      return 'Nurture campaign with valuable resources and thought leadership';
    }
  }

  private analyzeCompetitors(lead: Lead): string[] {
    const competitorMap: { [key: string]: string[] } = {
      'Technology': ['Salesforce', 'HubSpot', 'Microsoft', 'Oracle', 'SAP'],
      'Healthcare': ['Epic Systems', 'Cerner', 'Allscripts', 'athenahealth', 'NextGen'],
      'Financial Services': ['Temenos', 'FIS', 'Jack Henry', 'Fiserv', 'NCR'],
      'Manufacturing': ['SAP', 'Oracle', 'Infor', 'Epicor', 'QAD'],
      'Retail': ['Shopify', 'Magento', 'WooCommerce', 'BigCommerce', 'Salesforce Commerce']
    };

    return competitorMap[lead.industry] || ['Industry-specific competitors', 'Generic enterprise solutions'];
  }

  private analyzeMarketTrends(lead: Lead): string[] {
    const trendMap: { [key: string]: string[] } = {
      'Technology': ['AI/ML adoption increasing', 'Cloud-first strategies', 'Remote work tools demand'],
      'Healthcare': ['Digital health transformation', 'Telemedicine growth', 'Data privacy focus'],
      'Financial Services': ['Fintech disruption', 'Digital banking', 'Regulatory compliance'],
      'Manufacturing': ['Industry 4.0 adoption', 'Supply chain digitization', 'Sustainability focus'],
      'Retail': ['E-commerce growth', 'Omnichannel experiences', 'Personalization demand']
    };

    return trendMap[lead.industry] || ['Digital transformation', 'Automation trends', 'Data-driven decisions'];
  }

  private generateProfessionalEmail(companyName: string, contactPerson?: string): string {
    if (!contactPerson) return `info@${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
    
    const firstName = contactPerson.split(' ')[0].toLowerCase();
    const lastName = contactPerson.split(' ')[1]?.toLowerCase() || '';
    const domain = companyName.toLowerCase().replace(/\s+/g, '');
    
    return `${firstName}.${lastName}@${domain}.com`;
  }

  private generatePhoneNumber(location: string): string {
    const areaCodes: { [key: string]: string } = {
      'San Francisco': '415',
      'New York': '212',
      'Los Angeles': '213',
      'Chicago': '312',
      'Boston': '617',
      'Seattle': '206'
    };

    let areaCode = '555';
    for (const [city, code] of Object.entries(areaCodes)) {
      if (location.includes(city)) {
        areaCode = code;
        break;
      }
    }

    const number = Math.floor(Math.random() * 9000000) + 1000000;
    return `+1-${areaCode}-${number.toString().slice(0, 3)}-${number.toString().slice(3)}`;
  }

  private generateLinkedInProfile(contactPerson?: string): string {
    if (!contactPerson) return '';
    
    const name = contactPerson.toLowerCase().replace(/\s+/g, '-');
    return `https://linkedin.com/in/${name}-${Math.floor(Math.random() * 999)}`;
  }

  private generateTwitterHandle(companyName: string): string {
    return `https://twitter.com/${companyName.toLowerCase().replace(/\s+/g, '')}`;
  }

  private generateCompanyDescription(lead: Lead): string {
    const templates = [
      `${lead.companyName} is a leading ${lead.industry.toLowerCase()} company focused on innovation and growth.`,
      `A dynamic ${lead.industry.toLowerCase()} organization serving clients globally with cutting-edge solutions.`,
      `${lead.companyName} specializes in ${lead.industry.toLowerCase()} services with a commitment to excellence.`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private predictTechnologies(lead: Lead): string[] {
    const techMap: { [key: string]: string[] } = {
      'Technology': ['React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL'],
      'Healthcare': ['FHIR', 'HL7', 'Epic', 'Cerner', 'HIPAA Compliance', 'Telemedicine'],
      'Financial Services': ['Blockchain', 'API Security', 'Compliance Tools', 'Risk Management'],
      'Manufacturing': ['IoT', 'ERP Systems', 'Supply Chain Management', 'Quality Control'],
      'Retail': ['E-commerce Platforms', 'POS Systems', 'Inventory Management', 'CRM']
    };

    return techMap[lead.industry] || ['CRM', 'Analytics', 'Cloud Services'];
  }

  private identifyCompetitors(lead: Lead): string[] {
    return this.analyzeCompetitors(lead).slice(0, 3);
  }

  private predictFundingStage(lead: Lead): string {
    if (!lead.revenue) return 'Unknown';
    
    if (lead.revenue > 100000000) return 'Growth/Late Stage';
    if (lead.revenue > 10000000) return 'Series B/C';
    if (lead.revenue > 1000000) return 'Series A';
    return 'Seed/Early Stage';
  }

  private generateRecentNews(lead: Lead): string[] {
    return [
      `${lead.companyName} announces expansion into new markets`,
      `Leadership changes drive growth strategy at ${lead.companyName}`,
      `${lead.companyName} invests in digital transformation initiatives`
    ];
  }

  private predictRole(_lead: Lead): string {
    const roles = ['VP of Technology', 'Director of Operations', 'Chief Innovation Officer', 'Head of Digital'];
    return roles[Math.floor(Math.random() * roles.length)];
  }

  private predictExperience(_lead: Lead): string {
    const experience = ['10+ years in technology leadership', '15+ years in industry', '8+ years in current role'];
    return experience[Math.floor(Math.random() * experience.length)];
  }

  private predictEducation(_lead: Lead): string {
    const education = ['MBA from top-tier university', 'Engineering degree', 'Business Administration'];
    return education[Math.floor(Math.random() * education.length)];
  }

  private predictInterests(_lead: Lead): string[] {
    return ['Innovation', 'Digital Transformation', 'Team Leadership', 'Industry Trends'];
  }

  private getEmailTemplates(purpose: string): any[] {
    const templates = {
      introduction: [
        {
          subject: 'Partnership opportunity with {companyName}',
          body: 'Hi {firstName},\n\nI hope this email finds you well. I came across {companyName} and was impressed by your work in {industry}.\n\nI believe there\'s a great opportunity for us to collaborate...',
          tone: 'professional' as const
        }
      ],
      followup: [
        {
          subject: 'Following up on our conversation',
          body: 'Hi {firstName},\n\nI wanted to follow up on our previous conversation about {companyName}\'s growth initiatives...',
          tone: 'friendly' as const
        }
      ]
    };

    return templates[purpose as keyof typeof templates] || templates.introduction;
  }

  private personalizeSubject(subject: string, lead: Lead): string {
    return subject
      .replace('{companyName}', lead.companyName)
      .replace('{industry}', lead.industry);
  }

  private personalizeBody(body: string, lead: Lead): string {
    const firstName = lead.contactPerson?.split(' ')[0] || 'there';
    
    return body
      .replace('{firstName}', firstName)
      .replace('{companyName}', lead.companyName)
      .replace('{industry}', lead.industry);
  }

  private getPersonalizationPoints(lead: Lead): string[] {
    return [
      `Company: ${lead.companyName}`,
      `Industry: ${lead.industry}`,
      `Location: ${lead.location}`,
      `Size: ${lead.employeeCount} employees`
    ];
  }

  private generateIndustryTrends(industry: string): string[] {
    return this.analyzeMarketTrends({ industry } as Lead);
  }

  private generateCompetitorInsights(_industry: string): string[] {
    return [
      'Market consolidation creating opportunities',
      'New entrants disrupting traditional models',
      'Technology adoption accelerating competition'
    ];
  }

  private identifyMarketOpportunities(industry: string, location: string): string[] {
    return [
      `Growing demand in ${industry} sector`,
      `${location} market expansion potential`,
      'Digital transformation driving new opportunities'
    ];
  }

  private identifyRiskFactors(_industry: string): string[] {
    return [
      'Economic uncertainty affecting budgets',
      'Regulatory changes impacting industry',
      'Competitive pressure on pricing'
    ];
  }

  private generateMarketRecommendations(industry: string, location: string): string[] {
    return [
      `Focus on ${industry} digital transformation needs`,
      `Leverage ${location} market connections`,
      'Emphasize ROI and competitive advantages'
    ];
  }

  private analyzeIntent(_messages: string[]): string {
    const intents = ['Purchase Intent', 'Information Gathering', 'Comparison Shopping', 'Support Request'];
    return intents[Math.floor(Math.random() * intents.length)];
  }

  private recommendNextAction(_messages: string[]): string {
    const actions = [
      'Schedule product demo',
      'Send detailed proposal',
      'Provide case study',
      'Arrange technical consultation'
    ];
    return actions[Math.floor(Math.random() * actions.length)];
  }

  private extractTopics(_messages: string[]): string[] {
    return ['Pricing', 'Features', 'Implementation', 'Support'];
  }

  private calculateSimilarity(lead1: Lead, lead2: Lead): number {
    let similarity = 0;
    
    if (lead1.industry === lead2.industry) similarity += 30;
    if (Math.abs(lead1.employeeCount - lead2.employeeCount) < 100) similarity += 20;
    if (lead1.location === lead2.location) similarity += 25;
    if (Math.abs(lead1.score - lead2.score) < 10) similarity += 25;
    
    return similarity;
  }

  private predictTimeToConversion(lead: Lead): string {
    if (lead.score > 80) return '2-4 weeks';
    if (lead.score > 60) return '1-2 months';
    if (lead.score > 40) return '2-4 months';
    return '4-6 months';
  }

  private estimateLeadValue(lead: Lead): number {
    let value = 10000; // Base value
    
    if (lead.employeeCount > 1000) value *= 5;
    else if (lead.employeeCount > 100) value *= 3;
    else if (lead.employeeCount > 10) value *= 2;
    
    if (lead.revenue && lead.revenue > 100000000) value *= 3;
    else if (lead.revenue && lead.revenue > 10000000) value *= 2;
    
    return Math.floor(value);
  }

  private identifyLeadRisks(lead: Lead): string[] {
    const risks = [];
    
    if (lead.employeeCount < 50) risks.push('Small company - budget constraints');
    if (!lead.email && !lead.phone) risks.push('Limited contact information');
    if (lead.score < 50) risks.push('Low engagement score');
    
    return risks;
  }

  private identifySuccessFactors(lead: Lead): string[] {
    const factors = [];
    
    if (lead.score > 80) factors.push('High engagement score');
    if (lead.employeeCount > 100) factors.push('Established company size');
    if (lead.revenue && lead.revenue > 10000000) factors.push('Strong revenue base');
    
    return factors;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Queue management for high traffic
  async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Queue processing error:', error);
        }
      }
    }
    
    this.isProcessing = false;
  }

  // Cache management
  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

export const aiService = new AIService();