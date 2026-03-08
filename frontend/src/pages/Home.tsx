import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TrendingUp, Clock, Grid, List } from 'lucide-react';
import { builtInTools } from '../tools';
import { Tool } from '../types';
import ToolCard, { ToolListItem } from '../components/ToolCard';
import clsx from 'clsx';

type SortType = 'default' | 'popular' | 'latest';

const categoryNames: Record<string, string> = {
  encoding: '编码解码',
  crypto: '加密哈希',
  datetime: '时间日期',
  generate: '生成工具',
  text: '文字处理',
  math: '数学工具',
  dev: '开发工具',
};

// 转换为 Tool 格式
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
  created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
}));

export default function Home() {
  const [searchParams] = useSearchParams();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortType>('default');
  const [showFeatured, setShowFeatured] = useState(false);

  useEffect(() => {
    const featured = searchParams.get('featured') === 'true';
    const sort = searchParams.get('sort') as SortType;
    setShowFeatured(featured);
    setSortBy(sort || 'default');
  }, [searchParams]);

  useEffect(() => {
    loadTools();
  }, [sortBy, showFeatured]);

  const loadTools = () => {
    setLoading(true);
    
    // 模拟加载延迟
    setTimeout(() => {
      let result = [...staticTools];
      
      if (showFeatured) {
        // 精选：取前 10 个
        result = result.slice(0, 10);
      } else if (sortBy === 'popular') {
        // 热门：按浏览量排序
        result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
      } else if (sortBy === 'latest') {
        // 最新：按创建时间排序
        result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      }
      
      setTools(result);
      setLoading(false);
    }, 100);
  };

  const sortOptions = [
    { type: 'default' as SortType, label: '默认', icon: Grid },
    { type: 'popular' as SortType, label: '热门', icon: TrendingUp },
    { type: 'latest' as SortType, label: '最新', icon: Clock },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {showFeatured ? '✨ 精选推荐' : sortBy === 'popular' ? '🔥 热门工具' : sortBy === 'latest' ? '🆕 最新上线' : '🛠️ 全部工具'}
          </h1>
          <p className="mt-1 text-slate-500">
            {showFeatured ? '编辑精选的优质工具' : '发现并使用各类优质在线工具'}
          </p>
        </div>

        {/* 排序和视图切换 */}
        <div className="flex items-center gap-3">
          {/* 排序选项 */}
          <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {sortOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => {
                  setSortBy(option.type);
                  setShowFeatured(false);
                }}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                  sortBy === option.type && !showFeatured
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                <option.icon size={14} />
                {option.label}
              </button>
            ))}
          </div>

          {/* 视图切换 */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                'p-1.5 rounded-md transition-all',
                viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'p-1.5 rounded-md transition-all',
                viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 工具列表 */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : tools.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p>暂无工具</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {tools.map((tool) => (
            <ToolListItem key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
