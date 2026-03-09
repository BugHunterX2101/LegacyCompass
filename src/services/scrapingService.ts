import { Lead } from '../types';
import { fetchNews, NewsArticle } from './newsService';

// Call OpenAI via server proxy to keep API key server-side
async function callAI(messages: Array<{role: string; content: string}>, temperature = 0.3, maxTokens = 2000): Promise<string | null> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, temperature, max_tokens: maxTokens }),
    });
    if (!response.ok) {
      console.error('[Scraper] AI proxy error:', response.status);
      return null;
    }
    const data = await response.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('[Scraper] AI call failed:', error);
    return null;
  }
}

interface ScrapedCompany {
  companyName: string;
  contactPerson?: string;
  title?: string;
  email?: string;
  phone?: string;
  website: string;
  location: string;
  industry: string;
  employeeCount: number;
  revenue?: number;
  description: string;
  source: string;
  newsHeadline?: string;
  newsUrl?: string;
}

async function extractCompaniesFromArticles(
  articles: NewsArticle[],
  query: string,
  maxResults: number
): Promise<ScrapedCompany[]> {
  if (articles.length === 0) return [];

  const articleSummaries = articles
    .slice(0, 10)
    .map((a, i) => `[${i + 1}] "${a.title}" — ${a.description || 'No description'} (Source: ${a.source.name}, URL: ${a.url})`)
    .join('\n');

  const content = await callAI([
    {
      role: 'system',
      content: 'You are a B2B lead extraction specialist. Extract ONLY real, verified company information from news articles. Every company you return MUST be a real, currently operating company. Do NOT invent or hallucinate any company names, websites, or executive names. If unsure whether a company is real, omit it. Always respond with valid JSON only, no markdown.',
    },
    {
      role: 'user',
      content: `Extract up to ${Math.min(maxResults, 10)} distinct REAL, VERIFIED companies from these news articles that match the search "${query}".

Articles:
${articleSummaries}

RULES:
- ONLY include companies explicitly mentioned by name in the articles
- Every company MUST be a real, currently operating business
- Website must be the company's actual domain (e.g., apple.com, not made-up)
- Contact person must be a real, publicly known executive of that company
- Employee count and revenue must be based on publicly available data
- If you are not confident a company is real, DO NOT include it

Return JSON: {
  "companies": [
    {
      "companyName": "string (exact real company name)",
      "industry": "string",
      "location": "string (real HQ city, country)",
      "description": "string (factual description from article context)",
      "employeeCount": number (real approximate count, 0 if unknown),
      "revenue": number (real annual revenue in USD, 0 if unknown),
      "website": "string (actual company domain)",
      "contactPerson": "string (real executive name, or empty if unknown)",
      "title": "string (their actual title, or empty)",
      "foundedYear": number (year founded, 0 if unknown),
      "articleIndex": number (which article 1-indexed)
    }
  ]
}`,
    },
  ]);

  if (!content) return [];

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    const companies: ScrapedCompany[] = (parsed.companies || []).map((c: Record<string, unknown>) => {
      const articleIdx = ((c.articleIndex as number) || 1) - 1;
      const article = articles[articleIdx] || articles[0];
      return {
        companyName: (c.companyName as string) || 'Unknown',
        contactPerson: (c.contactPerson as string) || undefined,
        title: (c.title as string) || undefined,
        website: (c.website as string) || article?.source?.url || '',
        location: (c.location as string) || '',
        industry: (c.industry as string) || 'Technology',
        employeeCount: (c.employeeCount as number) || 50,
        revenue: (c.revenue as number) || undefined,
        description: (c.description as string) || article?.description || '',
        source: 'News Scraper',
        newsHeadline: article?.title,
        newsUrl: article?.url,
      };
    });

    const seen = new Set<string>();
    return companies.filter((c) => {
      const key = c.companyName.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch (error) {
    console.error('[Scraper] AI extraction parse failed:', error);
    return [];
  }
}

function buildNewsQuery(source: string, query: string): string {
  // GNews works best with simple keyword queries — strip filler words and location qualifiers
  const stopWords = ['companies', 'company', 'businesses', 'business', 'in', 'with', 'the', 'for', 'and', 'or', 'a', 'an', 'of', 'from', 'that', 'are', 'employees', 'employee', '100+', '500+', '1000+'];
  const words = query.trim().split(/\s+/).filter(w => !stopWords.includes(w.toLowerCase()));

  const sourceHints: Record<string, string> = {
    business: '',
    funding: 'startup funding',
    industry: 'industry',
    global: 'international',
  };

  const hint = sourceHints[source] || '';
  const core = words.length > 0 ? words.join(' ') : query;
  return `${core} ${hint}`.trim();
}

async function generateLeadsBatch(
  source: string,
  query: string,
  batchSize: number,
  existingNames: Set<string>,
  batchNumber: number
): Promise<ScrapedCompany[]> {
  const excludeClause = existingNames.size > 0
    ? `\n\nDo NOT include these companies (already found): ${[...existingNames].join(', ')}` : '';

  const content = await callAI([
    {
      role: 'system',
      content: 'You are a B2B lead research specialist. You MUST only provide REAL, VERIFIED, currently operating companies. Every company name, website, executive name, and location you provide must be factually accurate. Do NOT invent or hallucinate any data. If you cannot find enough real companies, return fewer rather than making up fake ones. Respond with valid JSON only, no markdown.',
    },
    {
      role: 'user',
      content: `Find exactly ${batchSize} REAL, VERIFIED companies matching this search: "${query}" (category: ${source}).${excludeClause}\n\nSTRICT RULES:\n- Every company MUST be a real, currently operating business that can be looked up online\n- Website must be the company's ACTUAL domain (e.g., stripe.com, not a placeholder)\n- Contact person must be the company's REAL, publicly known CEO or executive\n- Location must be the company's real headquarters\n- Employee count must reflect real approximate headcount\n- Revenue must be based on publicly reported or estimated figures\n- If you cannot verify a company is real, do NOT include it\n\nReturn JSON: {\n  "companies": [\n    {\n      "companyName": "string (real verified company name)",\n      "industry": "string",\n      "location": "string (real HQ city, country)",\n      "description": "string (factual description of what the company does)",\n      "employeeCount": number (real approximate count),\n      "revenue": number (annual revenue USD, 0 if unknown),\n      "website": "string (actual company domain)",\n      "contactPerson": "string (real CEO/executive name)",\n      "title": "string (their actual title)",\n      "foundedYear": number (year company was founded, 0 if unknown)\n    }\n  ]\n}`,
    },
  ], 0.3, 3000);

  if (!content) return [];

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    return (parsed.companies || []).map((c: Record<string, unknown>) => ({
      companyName: (c.companyName as string) || 'Unknown',
      contactPerson: (c.contactPerson as string) || undefined,
      title: (c.title as string) || undefined,
      website: (c.website as string) || '',
      location: (c.location as string) || '',
      industry: (c.industry as string) || 'Technology',
      employeeCount: (c.employeeCount as number) || 50,
      revenue: (c.revenue as number) || undefined,
      description: (c.description as string) || '',
      source: 'AI Research',
    }));
  } catch (error) {
    console.error(`[Scraper] AI generation batch ${batchNumber} parse failed:`, error);
    return [];
  }
}

async function generateLeadsWithAI(
  source: string,
  query: string,
  maxResults: number,
  onProgress?: (step: string, percent: number) => void
): Promise<ScrapedCompany[]> {
  const allCompanies: ScrapedCompany[] = [];
  const seenNames = new Set<string>();
  const BATCH_SIZE = 10;
  let batchNumber = 0;

  while (allCompanies.length < maxResults) {
    batchNumber++;
    const remaining = maxResults - allCompanies.length;
    const thisBatch = Math.min(remaining, BATCH_SIZE);

    onProgress?.(
      `Researching companies with AI (batch ${batchNumber}, ${allCompanies.length}/${maxResults} found)...`,
      30 + Math.round((allCompanies.length / maxResults) * 60)
    );

    const batch = await generateLeadsBatch(source, query, thisBatch, seenNames, batchNumber);

    if (batch.length === 0) break; // AI returned nothing, stop

    for (const company of batch) {
      const key = company.companyName.toLowerCase();
      if (!seenNames.has(key) && allCompanies.length < maxResults) {
        seenNames.add(key);
        allCompanies.push(company);
      }
    }

    // Safety: if AI keeps returning duplicates, stop after too many batches
    if (batchNumber >= Math.ceil(maxResults / BATCH_SIZE) + 2) break;
  }

  return allCompanies;
}

export async function scrapeLeadsFromNews(
  source: string,
  query: string,
  maxResults: number,
  onProgress?: (step: string, percent: number) => void
): Promise<Lead[]> {
  // Cap at 50
  const targetCount = Math.min(maxResults, 50);

  onProgress?.('Searching real-time news sources...', 5);

  // Fetch real news articles matching the query
  const newsQuery = buildNewsQuery(source, query);
  let articles = await fetchNews(newsQuery, 10);

  if (articles.length === 0) {
    onProgress?.('Broadening search...', 10);
    articles = await fetchNews(query, 10);
  }

  if (articles.length === 0) {
    const firstWord = query.split(/\s+/).find(w => w.length > 3) || query.split(/\s+/)[0];
    if (firstWord) {
      articles = await fetchNews(firstWord, 10);
    }
  }

  if (articles.length === 0) {
    const fallbackQueries: Record<string, string> = {
      business: 'business technology companies',
      funding: 'startup funding investment',
      industry: 'industry market growth',
      global: 'global business trade',
    };
    const fallback = fallbackQueries[source] || 'technology companies';
    onProgress?.('Trying broader news search...', 15);
    articles = await fetchNews(fallback, 10);
  }

  // Extract companies from articles first
  let companies: ScrapedCompany[] = [];

  if (articles.length > 0) {
    onProgress?.(`Analyzing ${articles.length} articles for company data...`, 20);
    companies = await extractCompaniesFromArticles(articles, query, targetCount);
  }

  // Use AI to fill up to the target count
  if (companies.length < targetCount) {
    const remaining = targetCount - companies.length;
    onProgress?.(
      companies.length > 0
        ? `Found ${companies.length} from news, generating ${remaining} more with AI...`
        : `Researching ${targetCount} companies with AI...`,
      25
    );
    const aiCompanies = await generateLeadsWithAI(source, query, remaining, onProgress);

    // Deduplicate against news-extracted companies
    const existingNames = new Set(companies.map(c => c.companyName.toLowerCase()));
    for (const c of aiCompanies) {
      const key = c.companyName.toLowerCase();
      if (!existingNames.has(key) && companies.length < targetCount) {
        existingNames.add(key);
        companies.push(c);
      }
    }
  }

  if (companies.length === 0) {
    throw new Error('Could not find companies for your query. Please try a different search.');
  }

  onProgress?.(`Building ${companies.length} lead profiles...`, 90);

  // Convert to Lead objects
  const leads: Lead[] = companies.slice(0, targetCount).map((company, i) => ({
    id: `scraped-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
    companyName: company.companyName,
    contactPerson: company.contactPerson || undefined,
    title: company.title || undefined,
    email: company.email || undefined,
    phone: company.phone || undefined,
    website: company.website,
    location: company.location,
    industry: company.industry,
    employeeCount: company.employeeCount || 50,
    revenue: company.revenue || undefined,
    score: 0,
    status: 'new' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: company.description,
    tags: ['scraped', source, ...(company.newsHeadline ? ['from-news'] : [])],
    source: company.newsHeadline ? `${source} (via News)` : `${source} (via AI Research)`,
    notes: company.newsHeadline
      ? `Found in news: "${company.newsHeadline}"`
      : `Researched via AI for: "${query}"`,
    linkedinUrl: undefined,
  }));

  onProgress?.(`Done! ${leads.length} leads ready.`, 100);

  return leads;
}
