export type ContentBlock =
  | { type: 'text'; value: string }
  | { type: 'heading'; value: string }
  | { type: 'stats'; items: { value: string; label: string; color?: string }[] }
  | { type: 'bars'; title?: string; items: { label: string; pct: number }[] }
  | { type: 'callout'; tone: 'insight' | 'method' | 'caveat'; title: string; value: string }
  | { type: 'foods'; calories?: string; items: { name: string; servings: string; detail: string }[] }
  | { type: 'divider' }
  | { type: 'progress'; items: { k: number; rmse: number; label: string }[] };

export interface ResearchArticle {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  content: ContentBlock[];
}

import optimalDiet from './research/optimal-diet';

const articles: ResearchArticle[] = [
  optimalDiet,
];

export default articles;
