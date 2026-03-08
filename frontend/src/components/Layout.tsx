import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { categoriesApi } from '../api';
import { Category as CategoryType } from '../types';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await categoriesApi.getAll() as any;
      if (res.success) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div 
          className="overlay md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <Sidebar 
        categories={categories} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* 主内容区 */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>

        <footer className="py-6 text-center text-sm text-slate-500 border-t border-slate-200 bg-white">
          <p>© 2024 Illuminati Tools Hub. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
