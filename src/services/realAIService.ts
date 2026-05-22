import { Lead } from '../types';

async function callAIProxy(messages: { role: string; content: string }[], maxTokens = 500, temperature = 0.7) {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      temperature,
      max_tokens: maxTokens
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`AI proxy error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function parseJSON(content: string, fallback: Record<string, unknown>) {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return fallback;
  } catch {
    return fallback;
  }
}

export const analyzeLeadWithRealAI = async (lead: Lead) => {
  const content = await callAIProxy([
    {
      role: 'system',
      content: 'You are a lead analysis expert for a B2B sales platform. Always respond with valid JSON only, no markdown.'
    },
    {
      role: 'user',
      content: `Analyze this B2B lead and provide a detailed, actionable assessment.

Lead Data:
- Company: ${lead.companyName}
- Industry: ${lead.industry}
- Employees: ${lead.employeeCount}
- Revenue: ${lead.revenue ? '$' + lead.revenue.toLocaleString() : 'Unknown'}
- Location: ${lead.location}
- Current Score: ${lead.score}
- Status: ${lead.status}
- Contact: ${lead.contactPerson || 'Unknown'}
- Title: ${lead.title || 'Unknown'}
- Website: ${lead.website || 'Unknown'}
- Email: ${lead.email || 'Unknown'}
- Description: ${lead.description || 'Unknown'}

Return JSON with this EXACT structure:
{
  "leadScore": number (0-100, your assessment),
  "conversionProbability": number (0-100),
  "insights": [
    { "title": "string (short insight title)", "description": "string (detailed explanation)", "type": "opportunity|risk|recommendation|prediction" },
    { "title": "string", "description": "string", "type": "opportunity|risk|recommendation|prediction" },
    { "title": "string", "description": "string", "type": "opportunity|risk|recommendation|prediction" }
  ],
  "recommendations": ["string (actionable recommendation)", "string", "string"],
  "bestContactTime": "string (specific time recommendation with timezone reasoning)",
  "recommendedApproach": "string (detailed outreach strategy)",
  "competitorAnalysis": ["string (real competitor analysis)"],
  "marketTrends": ["string (current industry trend)"]
}

Provide at least 3 insights with varied types. Be specific to this company.`
    }
  ], 800);

  return parseJSON(content, { leadScore: lead.score, conversionProbability: 50, insights: [], recommendations: [], bestContactTime: 'Business hours (9-11 AM local time)', recommendedApproach: 'Professional outreach', competitorAnalysis: [], marketTrends: [] });
};

export const generateEmailWithRealAI = async (lead: Lead, purpose: string) => {
  const content = await callAIProxy([
    {
      role: 'system',
      content: 'You are an expert B2B sales copywriter who crafts highly personalized, effective outreach emails. Always respond with valid JSON only, no markdown.'
    },
    {
      role: 'user',
      content: `Generate a highly personalized ${purpose} email for a B2B outreach campaign.

Target:
- Company: ${lead.companyName}
- Industry: ${lead.industry}
- Contact: ${lead.contactPerson || 'Decision Maker'}
- Title: ${lead.title || 'Business Leader'}
- Location: ${lead.location}
- Company Size: ${lead.employeeCount} employees
- Revenue: ${lead.revenue ? '$' + lead.revenue.toLocaleString() : 'Unknown'}
- Website: ${lead.website || 'Unknown'}
- Description: ${lead.description || 'Unknown'}

Email purpose: ${purpose}

Return JSON:
{
  "subject": "string (compelling, personalized subject line)",
  "body": "string (full email body with greeting, value proposition, CTA, and signature placeholder)",
  "tone": "professional" | "casual" | "urgent" | "friendly",
  "personalization": ["string (specific personalization point used, e.g. 'Referenced company industry: Technology')", "string", "string"]
}

Rules:
- Use the contact's real name if available
- Reference specific details about their company
- Match tone to company size (enterprise=professional, startup=casual)
- Include a clear call-to-action
- Keep under 200 words
- Make the subject line specific to this company, not generic`
    }
  ], 600, 0.8);

  return parseJSON(content, { subject: `Partnership Opportunity - ${lead.companyName}`, body: content, tone: 'professional', personalization: [`Company: ${lead.companyName}`, `Industry: ${lead.industry}`] });
};

export const analyzeMarketWithRealAI = async (industry: string, location: string) => {
  const content = await callAIProxy([
    {
      role: 'system',
      content: 'You are an expert global market intelligence analyst specializing in B2B markets across all world regions. You have deep knowledge of local economies, regulations, key players, and market dynamics for every country. Provide highly location-specific, data-driven analysis. Always respond with valid JSON only, no markdown.'
    },
    {
      role: 'user',
      content: `Provide a comprehensive, LOCATION-SPECIFIC market analysis for the ${industry} industry in ${location}.

IMPORTANT: Your analysis MUST be specific to ${location}. Include:
- Local market size and growth specific to ${location} (not global figures)
- Key local and regional companies/players operating in ${location}
- Regulatory environment, government policies, and incentives in ${location}
- Local workforce availability, talent pools, and labor market conditions
- Cultural and economic factors unique to ${location} that affect the ${industry} sector
- Regional trade agreements, tariffs, or barriers relevant to ${location}
- Local investment climate, FDI trends, and venture capital activity in ${location}

Return JSON: {
  "marketOverview": {
    "marketSize": "string (estimated ${industry} market size specifically in ${location}, e.g. '$15B')",
    "growthRate": "string (annual growth rate in ${location}, e.g. '8.5% CAGR')",
    "sentiment": "string (one word: Bullish, Neutral, or Bearish - based on ${location}'s outlook)"
  },
  "industryTrends": ["string (5 detailed trends specific to ${industry} in ${location}, mentioning local developments, policies, and data)"],
  "competitorInsights": ["string (5 competitive insights about key ${industry} players in ${location}, naming real local and international companies operating there)"],
  "marketOpportunities": ["string (5 opportunities specific to ${location}'s ${industry} market, considering local demand, gaps, and growth areas)"],
  "riskFactors": ["string (5 risk factors for ${industry} in ${location}, including regulatory, economic, political, and market-specific risks)"],
  "recommendations": ["string (5 actionable recommendations for entering or growing in ${location}'s ${industry} market, with priority levels)"]
}

Be specific with real data, local company names, and market figures for ${location}. Do NOT give generic global analysis - everything must be tailored to ${location}.`
    }
  ], 1500);

  return parseJSON(content, {
    marketOverview: { marketSize: 'N/A', growthRate: 'N/A', sentiment: 'Neutral' },
    industryTrends: [`${industry} market is evolving rapidly`],
    competitorInsights: ['Competitive landscape shifting'],
    marketOpportunities: [`Growth potential in ${location}`],
    riskFactors: ['Market uncertainty'],
    recommendations: ['Focus on differentiation']
  });
};

export const analyzeConversationWithRealAI = async (messages: string[]) => {
  const content = await callAIProxy([
    {
      role: 'system',
      content: 'You are a sales conversation analyst. Always respond with valid JSON only, no markdown.'
    },
    {
      role: 'user',
      content: `Analyze this sales conversation and provide intelligence.

Messages:
${messages.map((m, i) => `${i + 1}. ${m}`).join('\n')}

Return JSON: {
  "sentiment": "positive" | "neutral" | "negative",
  "intent": "string (buyer's intent)",
  "nextBestAction": "string (recommended next step)",
  "urgency": "high" | "medium" | "low",
  "topics": ["string (key topics discussed)"]
}`
    }
  ], 400);

  return parseJSON(content, {
    sentiment: 'neutral',
    intent: 'Information Gathering',
    nextBestAction: 'Follow up with more details',
    urgency: 'medium',
    topics: ['General inquiry']
  });
};

export const enrichLeadWithRealAI = async (lead: Lead) => {
  const content = await callAIProxy([
    {
      role: 'system',
      content: 'You are a B2B data enrichment specialist. Provide ONLY factual, verified data based on your confirmed knowledge of real companies. Every piece of information must be accurate and verifiable. Competitors must be real companies. Technologies must be ones the company actually uses. Do NOT invent, hallucinate, or guess any information. If you are unsure about something, write "unknown" for that field. Always respond with valid JSON only, no markdown.'
    },
    {
      role: 'user',
      content: `Enrich this lead with VERIFIED, FACTUAL intelligence. Only provide information you are confident is true.

Lead:
- Company: ${lead.companyName}
- Industry: ${lead.industry}
- Location: ${lead.location}
- Employees: ${lead.employeeCount}
- Contact: ${lead.contactPerson || 'Unknown'}

RULES:
- Company description must be factually accurate
- Technologies must be ones the company is known to actually use
- Competitors must be real, currently operating companies in the same space
- Recent news must be real events you know occurred
- If unsure about any field, use "unknown" or empty array

Return JSON: {
  "companyDescription": "string (2-3 sentence verified company description)",
  "technologies": ["string (verified tech stack, 4-6 items)"],
  "competitors": ["string (3-5 real verified competitors)"],
  "fundingStage": "string (verified funding stage or 'unknown')",
  "recentNews": ["string (2-3 real verified developments)"],
  "predictedRole": "string (likely role of decision maker)",
  "experience": "string (estimated experience level)",
  "interests": ["string (3-4 professional interests)"]
}`
    }
  ], 500);

  return parseJSON(content, {
    companyDescription: `${lead.companyName} is a ${lead.industry} company.`,
    technologies: ['CRM', 'Cloud Services'],
    competitors: ['Industry competitors'],
    fundingStage: 'Unknown',
    recentNews: [`${lead.companyName} continues operations`],
    predictedRole: 'Business Leader',
    experience: 'Experienced professional',
    interests: ['Industry trends', 'Growth']
  });
};

export const predictLeadOutcomeWithRealAI = async (lead: Lead) => {
  const content = await callAIProxy([
    {
      role: 'system',
      content: 'You are a predictive sales analytics expert. Always respond with valid JSON only, no markdown.'
    },
    {
      role: 'user',
      content: `Predict the outcome for this sales lead.

Lead:
- Company: ${lead.companyName}
- Industry: ${lead.industry}
- Employees: ${lead.employeeCount}
- Revenue: ${lead.revenue ? '$' + lead.revenue.toLocaleString() : 'Unknown'}
- Score: ${lead.score}
- Status: ${lead.status}
- Location: ${lead.location}

Return JSON: {
  "conversionProbability": number (0-100),
  "timeToConversion": "string (estimated timeline)",
  "valueEstimate": number (estimated deal value in USD),
  "riskFactors": ["string (2-4 risks)"],
  "successFactors": ["string (2-4 positive factors)"]
}`
    }
  ], 400);

  return parseJSON(content, {
    conversionProbability: 50,
    timeToConversion: '2-4 months',
    valueEstimate: 10000,
    riskFactors: ['Uncertain market conditions'],
    successFactors: ['Engaged prospect']
  });
};

export const scrapeLeadsWithRealAI = async (source: string, query: string, maxResults: number): Promise<Array<Record<string, unknown>>> => {
  const content = await callAIProxy([
    {
      role: 'system',
      content: 'You are a B2B lead research specialist. You MUST only provide data about REAL, VERIFIED, currently operating companies. Every company name, website, executive name, and location must be factually accurate and verifiable. Do NOT invent or hallucinate any companies or details. If you cannot find enough real companies, return fewer rather than fabricating data. Always respond with valid JSON only, no markdown.'
    },
    {
      role: 'user',
      content: `Provide factual data about ${Math.min(maxResults, 5)} REAL, VERIFIED companies matching this search: "${query}" from source: ${source}.

STRICT RULES:
- Every company MUST be a real, currently operating business
- Use actual company names exactly as they are known publicly
- Website must be the company's real domain (e.g., salesforce.com)
- Contact person must be a real, publicly known executive (CEO, CTO, etc.)
- Email must use the company's actual domain (e.g., contact@company.com)
- Phone must be the company's real publicly listed number
- Location must be the real headquarters city
- Employee count and revenue must reflect real publicly available data

Return JSON: {
  "leads": [
    {
      "companyName": "string (real verified company name)",
      "contactPerson": "string (real executive full name)",
      "title": "string (their actual job title)",
      "email": "string (real company domain email)",
      "phone": "string (real company phone number)",
      "website": "string (actual company website)",
      "location": "string (real HQ city, state/country)",
      "industry": "string",
      "employeeCount": number (real approximate headcount),
      "revenue": number (real annual revenue USD),
      "description": "string (2-3 sentence factual company description)"
    }
  ]
}`
    }
  ], 1500, 0.3);

  const parsed = parseJSON(content, { leads: [] });
  return parsed.leads || [];
};

export const enrichLeadWithRealAIData = async (lead: Lead): Promise<Record<string, unknown>> => {
  const missingFields: string[] = [];
  if (!lead.email) missingFields.push('email');
  if (!lead.phone) missingFields.push('phone');
  if (!lead.contactPerson) missingFields.push('contactPerson');
  if (!lead.title) missingFields.push('title');
  if (!lead.website) missingFields.push('website');
  if (!lead.description) missingFields.push('description');
  if (!lead.revenue || lead.revenue === 0) missingFields.push('revenue');
  if (!lead.employeeCount || lead.employeeCount <= 1) missingFields.push('employeeCount');
  if (!lead.socialMedia?.linkedin) missingFields.push('linkedin');
  if (!lead.socialMedia?.twitter) missingFields.push('twitter');

  const content = await callAIProxy([
    {
      role: 'system',
      content: 'You are a B2B data enrichment specialist. Provide ONLY factual, verified enrichment data based on your knowledge of real companies. Every piece of data must be accurate and verifiable. Use real company email domains, real publicly listed phone numbers, and real LinkedIn/Twitter company URLs. Do NOT fabricate or guess any information. If you are unsure about any detail, set it to "unknown" or 0. Always respond with valid JSON only, no markdown.'
    },
    {
      role: 'user',
      content: `Enrich this lead with ALL missing VERIFIED, FACTUAL data. Fill in every field you can with real information about this company.

Lead:
- Company: ${lead.companyName}
- Industry: ${lead.industry}
- Location: ${lead.location}
- Contact: ${lead.contactPerson || 'Missing'}
- Title: ${lead.title || 'Missing'}
- Email: ${lead.email || 'Missing'}
- Phone: ${lead.phone || 'Missing'}
- Website: ${lead.website || 'Missing'}
- Employees: ${lead.employeeCount || 'Missing'}
- Revenue: ${lead.revenue ? '$' + lead.revenue.toLocaleString() : 'Missing'}
- LinkedIn: ${lead.socialMedia?.linkedin || lead.linkedinProfile || 'Missing'}

Missing fields that MUST be filled: ${missingFields.join(', ')}

RULES:
- contactPerson: provide the real CEO or a publicly known executive full name
- title: their actual job title (e.g., "Chief Executive Officer")
- email: must use the company's real domain (e.g., info@stripe.com)
- phone: must be the company's real publicly listed number
- website: the company's actual domain (e.g., stripe.com)
- linkedin: the company's real LinkedIn page URL
- twitter: the company's real Twitter/X handle
- revenue: real annual revenue in USD (number only)
- employeeCount: real approximate headcount (number only)
- description: 2-3 sentence factual company description
- If you cannot verify any field, set strings to "unknown" and numbers to 0

Return JSON: {
  "contactPerson": "string (real executive full name, or 'unknown')",
  "title": "string (their real job title, or 'unknown')",
  "email": "string (real company email using actual domain, or 'unknown')",
  "phone": "string (real company phone number, or 'unknown')",
  "website": "string (real company domain, or 'unknown')",
  "linkedinProfile": "string (real LinkedIn company URL, or 'unknown')",
  "twitterHandle": "string (real Twitter/X handle, or 'unknown')",
  "description": "string (2-3 sentence factual company description)",
  "revenue": number (annual revenue in USD, 0 if unknown),
  "employeeCount": number (approximate headcount, 0 if unknown),
  "tags": ["string (3-5 relevant industry tags)"]
}`
    }
  ], 600);

  return parseJSON(content, {});
};
