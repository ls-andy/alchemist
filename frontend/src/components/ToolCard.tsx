import { Link } from 'react-router-dom';
import { ExternalLink, Eye, Star, Wrench } from 'lucide-react';
import { Tool } from '../types';
import clsx from 'clsx';

interface ToolCardProps {
  tool: Tool;
  showCategory?: boolean;
}

export default function ToolCard({ tool, showCategory = true }: ToolCardProps) {
  const isBuiltin = tool.tool_type === 'builtin';

  const handleClick = () => {
    if (!isBuiltin && tool.url) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  const CardContent = () => (
    <div className="p-4">
      {/* 头部：图标和名称 */}
      <div className="flex items-start gap-3">
        <div className={clsx(
          "w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform",
          isBuiltin 
            ? "bg-gradient-to-br from-primary-100 to-primary-50" 
            : "bg-gradient-to-br from-slate-100 to-slate-50"
        )}>
          {tool.icon || '🔧'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-800 truncate group-hover:text-primary-600 transition-colors">
              {tool.name}
            </h3>
            {tool.is_featured && (
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            )}
            {isBuiltin && (
              <Wrench className="w-3.5 h-3.5 text-primary-500" />
            )}
          </div>
          {showCategory && tool.category_name && (
            <Link 
              to={`/category/${tool.category_slug}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-slate-400 hover:text-primary-500 transition-colors"
            >
              {tool.category_name}
            </Link>
          )}
        </div>
        {!isBuiltin && (
          <ExternalLink className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      {/* 描述 */}
      <p className="mt-3 text-sm text-slate-500 line-clamp-2">
        {tool.description || '暂无描述'}
      </p>

      {/* 标签 */}
      {tool.tags && tool.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tool.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="tag"
              onClick={(e) => e.stopPropagation()}
            >
              {tag}
            </span>
          ))}
          {tool.tags.length > 3 && (
            <span className="text-xs text-slate-400">+{tool.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* 底部统计 */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          <span>{tool.view_count || 0} 次浏览</span>
        </div>
        <span className={clsx(
          "font-medium opacity-0 group-hover:opacity-100 transition-opacity",
          isBuiltin ? "text-primary-500" : "text-primary-500"
        )}>
          {isBuiltin ? '打开工具 →' : '点击访问 →'}
        </span>
      </div>
    </div>
  );

  if (isBuiltin) {
    return (
      <Link 
        to={`/tool/${tool.slug}`}
        className="tool-card bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer group block"
      >
        <CardContent />
      </Link>
    );
  }

  return (
    <div 
      className="tool-card bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer group"
      onClick={handleClick}
    >
      <CardContent />
    </div>
  );
}

// 列表样式卡片
export function ToolListItem({ tool }: { tool: Tool }) {
  const isBuiltin = tool.tool_type === 'builtin';

  const handleClick = () => {
    if (!isBuiltin && tool.url) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  const Content = () => (
    <>
      <div className={clsx(
        "w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0",
        isBuiltin ? "bg-primary-50" : "bg-slate-100"
      )}>
        {tool.icon || '🔧'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-slate-800 truncate group-hover:text-primary-600 transition-colors">
            {tool.name}
          </h4>
          {tool.is_featured && (
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          )}
          {isBuiltin && (
            <Wrench className="w-3 h-3 text-primary-500" />
          )}
        </div>
        <p className="text-sm text-slate-500 truncate">{tool.description || '暂无描述'}</p>
      </div>
      {!isBuiltin && (
        <ExternalLink className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </>
  );

  if (isBuiltin) {
    return (
      <Link 
        to={`/tool/${tool.slug}`}
        className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
      >
        <Content />
      </Link>
    );
  }

  return (
    <div 
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
      onClick={handleClick}
    >
      <Content />
    </div>
  );
}

// 紧凑样式卡片
export function ToolCompactCard({ tool }: { tool: Tool }) {
  const isBuiltin = tool.tool_type === 'builtin';

  const handleClick = () => {
    if (!isBuiltin && tool.url) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  const Content = () => (
    <>
      <div className={clsx(
        "w-8 h-8 rounded-md flex items-center justify-center text-lg shrink-0",
        isBuiltin ? "bg-primary-50" : "bg-slate-100"
      )}>
        {tool.icon || '🔧'}
      </div>
      <span className="text-sm text-slate-700 group-hover:text-primary-600 transition-colors truncate">
        {tool.name}
      </span>
      {isBuiltin && (
        <Wrench className="w-3 h-3 text-primary-400" />
      )}
    </>
  );

  if (isBuiltin) {
    return (
      <Link 
        to={`/tool/${tool.slug}`}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
      >
        <Content />
      </Link>
    );
  }

  return (
    <div 
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
      onClick={handleClick}
    >
      <Content />
    </div>
  );
}
