import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TrendingUp, Clock, Grid, List } from 'lucide-react';
import { toolsApi, searchApi } from '../api';
import { Tool } from '../types';
import ToolCard, { ToolListItem } from '../components/ToolCard';
import clsx from 'clsx';

type SortType = 'default' | 'popular' | 'latest';

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

  const loadTools = async () => {
    setLoading(true);
    try {
      let res;
      if (showFeatured) {
        res = await searchApi.getFeatured(50) as any;
      } else if (sortBy === 'popular') {
        res = await searchApi.getPopular(50) as any;
      } else if (sortBy === 'latest') {
        res = await searchApi.getLatest(50) as any;
      } else {
        res = await toolsApi.getAll({ limit: 50 }) as any;
      }
      
      if (res.success) {
        setTools(res.data);
      }
    } catch (error) {
      console.error('Failed to load tools:', error);
    } finally {
      setLoading(false);
    }
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
