import axios from 'axios';
import { NewsItem, NewsSource } from '../types';
import { parseWebsite } from './parsers';
import { NewsError } from './errors';

const PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

const FETCH_TIMEOUT = 20000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

async function fetchWithRetry(url: string, retries = 0): Promise<string> {
  const proxyUrl = `${PROXIES[retries % PROXIES.length]}${encodeURIComponent(url)}`;
  
  try {
    const response = await axios.get(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      timeout: FETCH_TIMEOUT,
      validateStatus: status => status === 200
    });
    
    if (typeof response.data !== 'string' || response.data.length < 1000) {
      throw new Error('Invalid response data');
    }
    
    return response.data;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retries)));
      return fetchWithRetry(url, retries + 1);
    }
    throw error;
  }
}

export async function fetchAllNews(sources: NewsSource[]): Promise<NewsItem[]> {
  if (!sources || sources.length === 0) return [];

  const activeSources = sources.filter(source => source.active);
  const newsPromises = activeSources.map(source => 
    fetchNewsFromSource(source).catch(error => {
      console.error(`Error fetching from ${source.name}:`, error instanceof NewsError ? error : new NewsError(
        `Failed to fetch news from ${source.name}`,
        error instanceof Error ? error.message : 'Unknown error'
      ));
      return [];
    })
  );
  
  const results = await Promise.all(newsPromises);
  return results
    .flat()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

async function fetchNewsFromSource(source: NewsSource): Promise<NewsItem[]> {
  try {
    const data = await fetchWithRetry(source.url);
    if (!data) {
      throw new Error('Empty response');
    }
    
    const items = parseWebsite(data, source);
    if (items.length === 0) {
      throw new Error('No items parsed');
    }

    return items.map(item => ({
      ...item,
      source: source.name,
      category: source.category
    }));
  } catch (error) {
    throw new NewsError(
      `Failed to fetch news from ${source.name}`,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}