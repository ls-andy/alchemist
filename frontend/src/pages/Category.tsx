import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toolsApi } from '../api';
import { Tool } from '../types';
import ToolCard from '../components/ToolCard';

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const [tools, setTools] = useState<Tool[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadTools(slug);
    }
  }, [slug]);

  const loadTools = async (categorySlug: string) => {
    setLoading(true);
    try {
      const res = await toolsApi.getAll({ category: categorySlug, limit: 50 }) as any;
      if (res.success) {
        setTools(res.data);
        if (res.data.length > 0) {
          setCategoryName(res.data[0].category_name || categorySlug);
        }
      }
    } catch (error) {
      console.error('Failed to load tools:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {categoryName || '分类工具'}
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
