export interface Article {
  id: number;
  title: string;
  summary: string | null;
  content: string | null;
  source_url: string;
  fetched_at: string | null;
}

export interface Paginated<T> {
  data: T[];
  meta?: {
    current_page?: number;
    last_page?: number;
    total?: number;
  };
}
