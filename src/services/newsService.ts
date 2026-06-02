export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

interface NewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
  error?: string;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const cache = new Map<string, { data: NewsArticle[]; timestamp: number }>();

function getCached(key: string): NewsArticle[] | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: NewsArticle[]) {
  // Limit cache size to prevent memory bloat
  if (cache.size > 50) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
  cache.set(key, { data, timestamp: Date.now() });
}

export async function fetchNews(query: string, maxResults = 10, country?: string): Promise<NewsArticle[]> {
  const cacheKey = `${query}:${maxResults}:${country || ''}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const params = new URLSearchParams({
      q: query,
      lang: 'en',
      max: String(Math.min(maxResults, 10)),
    });
    if (country) {
      params.set('country', country);
    }
    const url = `/api/news?${params}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.error(`[NewsService] API error ${response.status}:`, body);
      return [];
    }

    const data: NewsResponse = await response.json();

    if (data.error) {
      console.warn('[NewsService] API returned error:', data.error);
      return [];
    }

    const articles = (data.articles || []).filter(
      a => a && a.title && a.url
    );

    console.log(`[NewsService] Got ${articles.length} articles for "${query}"`);
    setCache(cacheKey, articles);
    return articles;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('[NewsService] Request timed out for query:', query);
    } else {
      console.error('[NewsService] Failed to fetch news:', error);
    }
    return [];
  }
}

export async function fetchIndustryNews(industry: string): Promise<NewsArticle[]> {
  return fetchNews(`${industry} industry business`, 5);
}

export async function fetchCompanyNews(companyName: string): Promise<NewsArticle[]> {
  return fetchNews(companyName, 5);
}

export function clearNewsCache(): void {
  cache.clear();
}
