export interface NewsArticleBase {
  post_id: string;
  title: string;
  content: string;
  author: string | null;
  url: string;
  image_url: string | null;
  published_at: string | null;
  collected_at: string;
}
