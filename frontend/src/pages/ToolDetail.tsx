import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toolsApi } from '../api';
import { Tool } from '../types';

export default function ToolDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      loadTool(slug);
    }
  }, [slug]);

  const loadTool = async (slug: string) => {
    setLoading(true);
    try {
      const res = await toolsApi.getBySlug(slug) as any;
      if (res.success) {
        setTool(res.data);
      }
    } catch (error) {
      console.error('Failed to load tool:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (tool?.url) {
      await navigator.clipboard.writeText(tool.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpen = () => {
    if (tool?.url) {
      window.open(tool.url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">🔧</div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">工具未找到</h2>
        <p className="text-slate-500 mb-4">该工具可能已被移除或不存在</p>
        <Link
          to="/"
          className="flex items-center gap-2 text-primary-500 hover:text-primary-600"
        >
          <ArrowLeft size={18} />
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={18} />
          返回工具列表
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-3xl">
            {tool.icon || '🔧'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">{tool.name}</h1>
            <p className="text-slate-500 mt-1">{tool.description}</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 mb-6">
          <label className="block text-xs font-medium text-slate-500 mb-2">网址</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm text-slate-700 truncate">{tool.url}</code>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
              title="复制链接"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tool.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={handleOpen}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors font-medium"
        >
          <ExternalLink size={18} />
          访问工具
        </button>
      </div>
    </div>
  );
}
