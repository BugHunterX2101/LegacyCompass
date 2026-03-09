import type { VercelRequest, VercelResponse } from '@vercel/node';

const GNEWS_API_KEY = process.env.GNEWS_API_KEY || '15ddd4cff5a66f63ae5ffe9110380f4a';
const GNEWS_BASE = 'https://gnews.io/api/v4/search';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const q = req.query.q;
  const max = req.query.max || '10';
  const lang = req.query.lang || 'en';

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Missing query parameter "q"' });
  }

  const params = new URLSearchParams({
    q,
    token: GNEWS_API_KEY,
    lang: String(lang),
    max: String(Math.min(Number(max) || 10, 10)),
  });

  try {
    const response = await fetch(`${GNEWS_BASE}?${params}`);

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.error(`GNews API error ${response.status}:`, body);
      return res.status(response.status).json({
        totalArticles: 0,
        articles: [],
        error: `GNews returned ${response.status}`,
      });
    }

    const data = await response.json();

    // Cache for 10 minutes
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300');
    return res.status(200).json(data);
  } catch (error) {
    console.error('GNews proxy error:', error);
    return res.status(500).json({ totalArticles: 0, articles: [], error: 'Failed to fetch news' });
  }
}
