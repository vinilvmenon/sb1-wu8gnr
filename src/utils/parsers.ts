import * as cheerio from 'cheerio';
import { NewsItem, NewsSource } from '../types';

export function parseWebsite(html: string, source: NewsSource): NewsItem[] {
  const $ = cheerio.load(html);
  const news: NewsItem[] = [];
  const seen = new Set<string>();

  try {
    $(source.selectors.title).each((i, element) => {
      const title = $(element).text().trim();
      if (!title || seen.has(title)) return;
      seen.add(title);

      const $container = $(element).closest('article, .post-block, .archive-item-component, .article');
      if (!$container.length) return;

      const description = $container.find(source.selectors.description).text().trim();
      const dateText = $container.find(source.selectors.date).text().trim();
      const url = $(element).is('a') ? $(element).attr('href') : 
                 $(element).closest('a').attr('href') ||
                 $container.find('a').first().attr('href') ||
                 '';
      
      const imageUrl = findImage($container, source.selectors.image, source.url);

      if (title && description && url) {
        news.push({
          id: `${source.id}-${i}`,
          title: cleanText(title),
          description: cleanText(description).substring(0, 300) + '...',
          source: source.name,
          date: parseDate(dateText),
          imageUrl: formatUrl(imageUrl, source.url),
          url: formatUrl(url, source.url),
          category: source.category
        });
      }
    });
  } catch (error) {
    console.error('Parsing error:', error);
    return [];
  }

  return news;
}

function cleanText(text: string): string {
  return text
    .replace(/[\n\r\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findImage($container: cheerio.Cheerio, selector: string, baseUrl: string): string {
  const defaultImage = getDefaultImage(baseUrl);
  
  const imgElement = $container.find(selector).first();
  const src = imgElement.attr('src') ||
             imgElement.attr('data-src') ||
             imgElement.attr('data-lazy-src') ||
             '';
             
  return src ? formatUrl(src, baseUrl) : defaultImage;
}

function parseDate(dateText: string): string {
  const date = new Date(dateText);
  return !isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();
}

function formatUrl(url: string, baseUrl: string): string {
  if (!url) return baseUrl;
  try {
    return url.startsWith('http') ? url : new URL(url, baseUrl).toString();
  } catch {
    return baseUrl;
  }
}

function getDefaultImage(sourceUrl: string): string {
  const defaultImages = [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
    'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144',
    'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74'
  ];
  
  const index = Math.abs(sourceUrl.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % defaultImages.length;
  return defaultImages[index];
}