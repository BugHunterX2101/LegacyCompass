const NEWS_API_KEY = (import.meta.env.VITE_NEWS_API_KEY || '').trim();

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
  cache.set(key, { data, timestamp: Date.now() });
}

export async function fetchNews(query: string, maxResults = 10, country?: string): Promise<NewsArticle[]> {
  if (!NEWS_API_KEY) {
    console.warn('News API key not configured. Set VITE_NEWS_API_KEY.');
    return [];
  }

  const cacheKey = `${query}:${maxResults}:${country || ''}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    // Always use the server proxy to avoid CORS issues
    const params = new URLSearchParams({
      q: query,
      lang: 'en',
      max: String(Math.min(maxResults, 10)),
    });
    if (country) {
      params.set('country', country);
    }
    const url = `/api/news?${params}`;

    console.log('[NewsService] Fetching:', url);

    const response = await fetch(url);

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.error(`[NewsService] API error ${response.status}:`, body);
      throw new Error(`News API error: ${response.status}`);
    }

    const data: NewsResponse = await response.json();
    const articles = data.articles || [];
    console.log(`[NewsService] Got ${articles.length} articles for "${query}"`);
    setCache(cacheKey, articles);
    return articles;
  } catch (error) {
    console.error('[NewsService] Failed to fetch news:', error);
    return [];
  }
}

export async function fetchIndustryNews(industry: string): Promise<NewsArticle[]> {
  return fetchNews(`${industry} industry business`, 5);
}

export async function fetchCompanyNews(companyName: string): Promise<NewsArticle[]> {
  return fetchNews(companyName, 5);
}
