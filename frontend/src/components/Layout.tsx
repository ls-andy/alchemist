import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { builtInTools } from '../tools';
import { Category as CategoryType } from '../types';

// 静态分类数据
const categoryIcons: Record<string, string> = {
  encoding: '🔢',
  crypto: '🔐',
  datetime: '⏰',
  generate: '🎲',
  text: '📝',
  math: '🔢',
  dev: '💻',
};

const categoryNames: Record<string, string> = {
  encoding: '编码解码',
  crypto: '加密哈希',
  datetime: '时间日期',
  generate: '生成工具',
  text: '文字处理',
  math: '数学工具',
  dev: '开发工具',
};

// 从工具列表生成分类
const staticCategories: CategoryType[] = Array.from(
  new Set(builtInTools.map(t => t.category))
).map((slug, index) => ({
  id: index + 1,
  name: categoryNames[slug] || slug,
  slug,
  icon: categoryIcons[slug] || '📦',
  description: null,
  sort_order: index,
  tool_count: builtInTools.filter(t => t.category === slug).length,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories] = useState<CategoryType[]>(staticCategories);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 侧边栏 */}
      <Sidebar 
        categories={categories} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* 移动端遮罩 - 必须在侧边栏之后渲染，z-index 低于侧边栏 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 主内容区 */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>

        <footer className="py-6 text-center text-sm text-slate-500 border-t border-slate-200 bg-white">
          <p>© 2024 Alchemist - 炼金术师. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
