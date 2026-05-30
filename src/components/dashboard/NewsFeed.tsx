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
      <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white flex items-center mb-4">
          <NewspaperIcon className="h-5 w-5 mr-2 text-blue-400" />
          {title}
        </h3>
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-16 h-16 bg-gray-700 rounded flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-700 rounded w-full" />
                <div className="h-3 bg-gray-700 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || articles.length === 0) {
    return (
      <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white flex items-center mb-4">
          <NewspaperIcon className="h-5 w-5 mr-2 text-blue-400" />
          {title}
        </h3>
        <p className="text-gray-400 text-sm">No news articles available right now.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1E2328] rounded-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white flex items-center mb-4">
        <NewspaperIcon className="h-5 w-5 mr-2 text-blue-400" />
        {title}
      </h3>
      <div className="space-y-4">
        {articles.map((article, i) => (
          <a
            key={i}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 p-3 rounded-lg hover:bg-[#161B22] transition-all duration-200 group animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
          >
            {article.image && (
              <img
                src={article.image}
                alt=""
                className="w-16 h-16 rounded object-cover flex-shrink-0 bg-gray-700"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => { const t = e.target as HTMLImageElement; t.style.display = 'none'; t.parentElement && (t.parentElement.style.display = 'none'); }}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                {article.title}
              </div>
              {article.description && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{article.description}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{article.source.name}</span>
                <span className="text-xs text-gray-600">/</span>
                <span className="text-xs text-gray-500">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
                <ArrowTopRightOnSquareIcon className="h-3 w-3 text-gray-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
