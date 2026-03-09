import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
const envPath = join(__dirname, '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

const GNEWS_API_KEY = process.env.GNEWS_API_KEY || process.env.VITE_NEWS_API_KEY || '15ddd4cff5a66f63ae5ffe9110380f4a';
const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || '';

app.use(express.json());

// --- API Routes ---

// GNews proxy
app.get('/api/news', async (req, res) => {
  const { q, max = '10', lang = 'en', country } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Missing query parameter "q"' });
  }

  const params = new URLSearchParams({
    q,
    token: GNEWS_API_KEY,
    lang: String(lang),
    max: String(Math.min(Number(max) || 10, 10)),
  });
  if (country && typeof country === 'string') {
    params.set('country', country);
  }

  try {
    const response = await fetch(`https://gnews.io/api/v4/search?${params}`);

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
    res.setHeader('Cache-Control', 'public, max-age=600');
    return res.json(data);
  } catch (error) {
    console.error('GNews proxy error:', error);
    return res.status(500).json({ totalArticles: 0, articles: [], error: 'Failed to fetch news' });
  }
});

// Groq AI proxy with retry logic and request queue
const AI_MAX_RETRIES = 3;
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// Queue to serialize AI requests
let aiQueue = Promise.resolve();
function enqueueAI(fn) {
  const p = aiQueue.then(fn, fn);
  aiQueue = p.catch(() => {});
  return p;
}

async function callGroqWithRetry(body, retriesLeft = AI_MAX_RETRIES) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (response.status === 429 && retriesLeft > 0) {
    const retryAfter = response.headers.get('retry-after');
    const waitMs = retryAfter ? Number(retryAfter) * 1000 : (AI_MAX_RETRIES - retriesLeft + 1) * 3000;
    console.log(`[AI] Rate limited, retrying in ${Math.round(waitMs / 1000)}s (${retriesLeft} retries left)`);
    await new Promise(resolve => setTimeout(resolve, waitMs));
    return callGroqWithRetry(body, retriesLeft - 1);
  }

  return response;
}

app.post('/api/ai', async (req, res) => {
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'Groq API key not configured. Add VITE_GROQ_API_KEY to .env' });
  }

  const { messages, temperature = 0.3, max_tokens = 2000 } = req.body || {};

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing "messages" array in request body' });
  }

  try {
    const response = await enqueueAI(() => callGroqWithRetry({
      model: GROQ_MODEL,
      messages,
      temperature,
      max_tokens,
    }));

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      console.error(`Groq error ${response.status}:`, errorBody);
      return res.status(response.status).json({ error: `Groq API error: ${response.status}` });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error('Groq proxy error:', error);
    return res.status(500).json({ error: 'Failed to call Groq' });
  }
});

// --- Static file serving ---
const distPath = join(__dirname, 'dist');

if (existsSync(distPath)) {
  app.use(express.static(distPath));
  // SPA fallback - serve index.html for all non-API, non-asset routes
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Run "npm run build" first, then restart the server.');
  });
}

app.listen(PORT, () => {
  console.log(`\n  LegacyCompass running at http://localhost:${PORT}\n`);
  console.log(`  API keys loaded:`);
  console.log(`    GNews:  ${GNEWS_API_KEY ? 'Yes' : 'Missing'}`);
  console.log(`    Groq:   ${GROQ_API_KEY ? 'Yes' : 'Missing - add VITE_GROQ_API_KEY to .env'}\n`);
});
