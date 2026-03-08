import { Link, useLocation } from 'react-router-dom';
import { X, Home, Settings, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { Category } from '../types';
import clsx from 'clsx';

interface SidebarProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ categories, isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: '首页', path: '/' },
    { icon: Sparkles, label: '精选推荐', path: '/?featured=true' },
    { icon: TrendingUp, label: '热门工具', path: '/?sort=popular' },
    { icon: Clock, label: '最新上线', path: '/?sort=latest' },
  ];

  return (
    <>
      {/* 移动端侧边栏 */}
      <aside className={clsx(
        'sidebar fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 md:translate-x-0 md:shadow-none',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
            <Link to="/" className="flex items-center gap-2" onClick={onClose}>
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <span className="font-bold text-xl text-slate-800">Illuminati</span>
            </Link>
            <button 
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>

          {/* 快捷菜单 */}
          <div className="p-4">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === item.path || (item.path !== '/' && location.search.includes(item.path.split('?')[1]))
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-slate-600 hover:bg-slate-100'
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* 分类列表 */}
          <div className="flex-1 overflow-y-auto px-4">
            <h3 className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              工具分类
            </h3>
            <nav className="space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  onClick={onClose}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    location.pathname === `/category/${category.slug}`
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-slate-600 hover:bg-slate-100'
                  )}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="flex-1">{category.name}</span>
                  {category.tool_count !== undefined && (
                    <span className="text-xs text-slate-400">{category.tool_count}</span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* 底部管理入口 */}
          <div className="p-4 border-t border-slate-200">
            <Link
              to="/admin"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Settings size={18} />
              管理后台
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
