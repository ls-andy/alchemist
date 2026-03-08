export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Tool {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  url: string | null;
  icon: string | null;
  category_id: number | null;
  tool_type: 'builtin' | 'external';
  tags: string | null;
  is_featured: number;
  is_active: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string | null;
  password_hash: string | null;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}
