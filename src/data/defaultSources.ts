import { NewsSource } from '../types';

export const defaultSources: NewsSource[] = [
  {
    id: 'venturebeat-ai',
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/',
    type: 'website',
    category: 'Industry',
    active: true,
    selectors: {
      title: 'h2.article-title',
      description: '.article-content p:first-of-type',
      date: '.article-date',
      image: '.article-image img'
    }
  },
  {
    id: 'zdnet-ai',
    name: 'ZDNet AI',
    url: 'https://www.zdnet.com/topic/artificial-intelligence/',
    type: 'website',
    category: 'Industry',
    active: true,
    selectors: {
      title: '.c-contentCard__headline',
      description: '.c-contentCard__description',
      date: '.c-contentCard__date',
      image: '.c-contentCard__image img'
    }
  },
  {
    id: 'sciencedaily-ai',
    name: 'ScienceDaily AI',
    url: 'https://www.sciencedaily.com/news/computers_math/artificial_intelligence/',
    type: 'website',
    category: 'Research',
    active: true,
    selectors: {
      title: '.latest-head',
      description: '.latest-summary',
      date: '.posted',
      image: '.latest-image img'
    }
  }
];