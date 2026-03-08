import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { searchApi } from '../api';
import { Tool } from '../types';
import ToolCard from '../components/ToolCard';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTime, setSearchTime] = useState(0);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (q: string) => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const res = await searchApi.search(q, 50) as any;
      if (res.success) {
        setTools(res.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearchTime(Date.now() - startTime);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 搜索结果标题 */}
      <div>
        <div className="flex items-center gap-2">
          <SearchIcon className="w-6 h-6 text-slate-400" />
          <h1 className="text-2xl font-bold text-slate-800">
            搜索结果
          </h1>
        </div>
        <p className="mt-1 text-slate-500">
          {query && (
            <>
              找到 <strong className="text-slate-700">{tools.length}</strong> 个与 
              "<span className="text-primary-600">{query}</span>" 相关的工具
              {!loading && <span className="text-slate-400 ml-2">({searchTime}ms)</span>}
            </>
          )}
        </p>
      </div>

      {/* 搜索结果 */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : tools.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <SearchIcon className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500">未找到相关工具</p>
          <p className="text-sm text-slate-400 mt-1">请尝试其他关键词</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
