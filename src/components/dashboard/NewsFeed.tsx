import React, { useState, useEffect } from 'react';
import { NewspaperIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { fetchNews, NewsArticle } from '../../services/newsService';

interface NewsFeedProps {
  query?: string;
  title?: string;
  maxResults?: number;
  country?: string;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({
  query = 'business technology',
  title = 'Industry News',
  maxResults = 5,
  country,
}) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        let data = await fetchNews(query, maxResults, country);
        // Fallback: if no results with country filter, try without
        if (data.length === 0 && country) {
          console.log(`[NewsFeed] No results for "${query}" in ${country}, retrying without country filter`);
          data = await fetchNews(query, maxResults);
        }
        // Fallback: if still no results, try simplified query
        if (data.length === 0 && query.includes(' ')) {
          const simplified = query.split(' ').slice(0, 2).join(' ');
          console.log(`[NewsFeed] No results for "${query}", retrying with "${simplified}"`);
          data = await fetchNews(simplified, maxResults);
        }
        if (!cancelled) setArticles(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [query, maxResults, country]);

  if (loading) {
    return (
      <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
        <h3 className="text-lg font-semibold text-white flex items-center mb-5">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-500 to-blue-500 mr-3" />
          {title}
        </h3>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-16 h-16 bg-slate-800 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2.5">
                <div className="h-4 bg-slate-800 rounded-lg w-3/4" />
                <div className="h-3 bg-slate-800 rounded-lg w-full" />
                <div className="h-3 bg-slate-800 rounded-lg w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || articles.length === 0) {
    return (
      <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
        <h3 className="text-lg font-semibold text-white flex items-center mb-4">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-500 to-blue-500 mr-3" />
          {title}
        </h3>
        <div className="text-center py-8">
          <NewspaperIcon className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No news articles available right now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#13171D] rounded-xl border border-slate-700/40 p-6">
      <h3 className="text-lg font-semibold text-white flex items-center mb-5">
        <div className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-500 to-blue-500 mr-3" />
        {title}
      </h3>
      <div className="space-y-3">
        {articles.map((article, i) => (
          <a
            key={i}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-4 p-3.5 rounded-xl hover:bg-[#0E1218] border border-transparent hover:border-slate-700/30 transition-all duration-200 animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
          >
            {article.image && (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800">
                <img
                  src={article.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
                {article.title}
              </div>
              {article.description && (
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{article.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/40">
                  {article.source.name}
                </span>
                <span className="text-[10px] text-slate-600">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
                <ArrowTopRightOnSquareIcon className="h-3 w-3 text-slate-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
