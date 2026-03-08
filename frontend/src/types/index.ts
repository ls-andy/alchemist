export interface Tool {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  url: string | null;
  icon: string | null;
  category_id: number | null;
  category_name?: string;
  category_slug?: string;
  tool_type: 'builtin' | 'external';
  tags: string[];
  is_featured: boolean;
  is_active: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  sort_order: number;
  tool_count?: number;
  created_at: string;
  updated_at: string;
}

export interface SearchResult {
  tools: Tool[];
  query: string;
  total: number;
}
