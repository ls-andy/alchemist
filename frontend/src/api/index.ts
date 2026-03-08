import api from './client';
import { Tool, Category } from '../types';

export const toolsApi = {
  // 获取所有工具
  getAll: (params?: { category?: string; featured?: boolean; limit?: number; offset?: number }) =>
    api.get<{ success: boolean; data: Tool[]; total: number }>('/tools', { params }),

  // 获取工具总数
  getCount: () => api.get<{ success: boolean; count: number }>('/tools/count'),

  // 获取单个工具
  getBySlug: (slug: string) =>
    api.get<{ success: boolean; data: Tool }>(`/tools/${slug}`),

  // 创建工具
  create: (data: Partial<Tool>) =>
    api.post<{ success: boolean; id: number }>('/tools', data),

  // 更新工具
  update: (id: number, data: Partial<Tool>) =>
    api.put<{ success: boolean }>(`/tools/${id}`, data),

  // 删除工具
  delete: (id: number) =>
    api.delete<{ success: boolean }>(`/tools/${id}`),
};

export const categoriesApi = {
  // 获取所有分类
  getAll: () => api.get<{ success: boolean; data: Category[] }>('/categories'),

  // 获取单个分类
  getBySlug: (slug: string) =>
    api.get<{ success: boolean; data: Category }>(`/categories/${slug}`),

  // 创建分类
  create: (data: Partial<Category>) =>
    api.post<{ success: boolean; id: number }>('/categories', data),

  // 更新分类
  update: (id: number, data: Partial<Category>) =>
    api.put<{ success: boolean }>(`/categories/${id}`, data),

  // 删除分类
  delete: (id: number) =>
    api.delete<{ success: boolean }>(`/categories/${id}`),
};

export const searchApi = {
  // 搜索工具
  search: (query: string, limit?: number) =>
    api.get<{ success: boolean; data: Tool[]; query: string; total: number }>('/search', {
      params: { q: query, limit },
    }),

  // 获取推荐工具
  getFeatured: (limit?: number) =>
    api.get<{ success: boolean; data: Tool[] }>('/search/featured', { params: { limit } }),

  // 获取最新工具
  getLatest: (limit?: number) =>
    api.get<{ success: boolean; data: Tool[] }>('/search/latest', { params: { limit } }),

  // 获取热门工具
  getPopular: (limit?: number) =>
    api.get<{ success: boolean; data: Tool[] }>('/search/popular', { params: { limit } }),
};
