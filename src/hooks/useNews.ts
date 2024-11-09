import { useState, useEffect, useCallback } from 'react';
import { NewsItem, NewsSource } from '../types';
import { fetchAllNews } from '../utils/newsFetcher';
import { mockNews } from '../data/mockNews';
import { defaultSources } from '../data/defaultSources';

const FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const INITIAL_RETRY_DELAY = 5000; // 5 seconds

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<NewsSource[]>(defaultSources);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchNews = useCallback(async () => {
    if (sources.length === 0) return;

    try {
      setLoading(true);
      setError(null);
      const items = await fetchAllNews(sources);
      
      if (items.length > 0) {
        setNews(prev => {
          const combined = [...items, ...prev];
          const unique = Array.from(
            new Map(combined.map(item => [item.id, item])).values()
          );
          return unique.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        });
        setLastUpdate(new Date());
      }
    } catch (err) {
      setError('Unable to fetch news. Please try again later.');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  }, [sources]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const initFetch = async () => {
      await fetchNews();
      if (mounted) {
        const interval = setInterval(fetchNews, FETCH_INTERVAL);
        return () => clearInterval(interval);
      }
    };

    initFetch();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [fetchNews]);

  const updateSources = useCallback((newSources: NewsSource[]) => {
    setSources(newSources);
  }, []);

  return { 
    news, 
    loading, 
    error, 
    sources, 
    setSources: updateSources,
    lastUpdate 
  };
}