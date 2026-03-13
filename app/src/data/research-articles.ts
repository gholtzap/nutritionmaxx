export interface ResearchArticle {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  content: string[];
}

const articles: ResearchArticle[] = [];

export default articles;
