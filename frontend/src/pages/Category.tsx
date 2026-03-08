import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { builtInTools } from '../tools';
import { Tool } from '../types';
import ToolCard from '../components/ToolCard';

const categoryNames: Record<string, string> = {
  encoding: '编码解码',
  crypto: '加密哈希',
  datetime: '时间日期',
  generate: '生成工具',
  text: '文字处理',
  math: '数学工具',
  dev: '开发工具',
};

const staticTools: Tool[] = builtInTools.map((tool, index) => ({
  id: index + 1,
  slug: tool.slug,
  name: tool.name,
  category_id: null,
  category_name: categoryNames[tool.category] || tool.category,
  category_slug: tool.category,
  icon: tool.icon,
  description: tool.description,
  url: null,
  tool_type: 'builtin' as const,
  tags: [],
  is_featured: false,
  is_active: true,
  view_count: Math.floor(Math.random() * 1000) + 100,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadTools(slug);
    }
  }, [slug]);

  const loadTools = (categorySlug: string) => {
    setLoading(true);
    
    setTimeout(() => {
      const filtered = staticTools.filter(tool => tool.category_slug === categorySlug);
      setTools(filtered);
      setLoading(false);
    }, 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {categoryNames[slug || ''] || slug || '分类工具'}
        </h1>
        <p className="mt-1 text-slate-500">
          共 {tools.length} 个工具
        </p>
      </div>

      {/* 工具列表 */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : tools.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p>该分类下暂无工具</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} showCategory={false} />
          ))}
        </div>
      )}
    </div>
  );
}
