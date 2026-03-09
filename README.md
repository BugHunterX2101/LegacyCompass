# LegacyCompass

**AI-powered B2B lead intelligence platform** — discover, enrich, score, and convert leads with real-time market insights across 110+ countries and 50+ industries.

![React](https://img.shields.io/badge/React_18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_5-646CFF?logo=vite&logoColor=white)

---

## What It Does

| Feature | Description |
|---------|-------------|
| **Smart Scraping** | AI-driven lead discovery — scrape up to 50 real companies per batch with verified contacts |
| **Data Enrichment** | Auto-fill missing fields: email, phone, LinkedIn, revenue, employee count |
| **AI Lead Scoring** | Multi-factor scoring algorithm with conversion probability and risk assessment |
| **Market AI** | Deep market analysis by industry × country — trends, competitors, regulations, opportunities |
| **AI Email Generator** | Context-aware outreach emails with tone control and personalization |
| **Real-Time News** | Location-specific industry news via GNews with country-level filtering |
| **Analytics Dashboard** | Score distributions, industry breakdowns, status tracking, and KPIs |
| **AI Insights** | Per-lead intelligence — competitor analysis, next-best-action, risk flags |

## Tech Stack

- **Frontend:** React 18 · TypeScript · Tailwind CSS 3 · Vite 5
- **AI Backend:** Groq API (LLaMA 3.3 70B) via Express proxy
- **News:** GNews API with country-level filtering
- **Performance:** Virtual scrolling · multi-layer caching · lazy loading
- **Deployment:** Vercel (serverless API routes) or Express (self-hosted)

## Quick Start

```bash
# Clone & install
git clone https://github.com/BugHunterX2101/LegacyCompass.git
cd LegacyCompass
npm install

# Configure environment
cp .env.example .env
# Add your GROQ_API_KEY and VITE_NEWS_API_KEY in .env

# Development
npm run dev          # Vite dev server (port 5173)
npm run dev:server   # Express API server (port 3000)

# Production
npm run build        # TypeScript check + Vite build
npm run serve        # Serve built app via Express
```

## Project Structure

```
src/
├── components/
│   ├── ai/            # AI Insights, Email Generator, Market Analysis, Conversation Intelligence
│   ├── dashboard/     # Stats, Charts, News Feed
│   ├── homepage/      # Landing page with About & Pricing sections
│   ├── leads/         # Table, Cards, Detail view, Filters
│   ├── enrichment/    # Data enrichment panel
│   ├── scraping/      # Lead scraping modal
│   ├── search/        # Advanced search
│   └── common/        # Error boundaries, Score circles, Notifications
├── services/          # AI, news, analytics, lead management, scraping services
├── hooks/             # Custom React hooks
├── types/             # TypeScript definitions
└── utils/             # Validation, performance utilities
server.js              # Express server — Groq AI & GNews API proxy
api/                   # Vercel serverless functions (ai.ts, news.ts)
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `GROQ_API_KEY` | Groq API key for AI features |
| `VITE_NEWS_API_KEY` | GNews API key for real-time news |
| `VITE_USE_REAL_AI` | Enable real AI calls (`true`/`false`) |

## Deployment

**Vercel** — Push to GitHub and connect to Vercel. Serverless functions in `api/` handle AI and news proxying automatically.

**Self-hosted** — Run `npm run build && node server.js`. Express serves the built SPA and proxies API calls on port 3000.

## License

MIT
