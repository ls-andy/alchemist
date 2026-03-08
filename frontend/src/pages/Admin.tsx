import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, ChevronRight } from 'lucide-react';
import { toolsApi, categoriesApi } from '../api';
import { Tool, Category } from '../types';
import clsx from 'clsx';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'tools' | 'categories'>('tools');
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTool, setEditingTool] = useState<Partial<Tool> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [showToolForm, setShowToolForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [toolsRes, categoriesRes] = await Promise.all([
        toolsApi.getAll({ limit: 100 }) as any,
        categoriesApi.getAll() as any,
      ]);
      if (toolsRes.success) setTools(toolsRes.data);
      if (categoriesRes.success) setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTool = async () => {
    if (!editingTool) return;
    try {
      if ('id' in editingTool && editingTool.id) {
        await toolsApi.update(editingTool.id, editingTool);
      } else {
        await toolsApi.create(editingTool as any);
      }
      setShowToolForm(false);
      setEditingTool(null);
      loadData();
    } catch (error) {
      console.error('Failed to save tool:', error);
    }
  };

  const handleDeleteTool = async (id: number) => {
    if (!confirm('确定要删除这个工具吗？')) return;
    try {
      await toolsApi.delete(id);
      loadData();
    } catch (error) {
      console.error('Failed to delete tool:', error);
    }
  };

  const handleSaveCategory = async () => {
    if (!editingCategory) return;
    try {
      if ('id' in editingCategory && editingCategory.id) {
        await categoriesApi.update(editingCategory.id, editingCategory);
      } else {
        await categoriesApi.create(editingCategory as any);
      }
      setShowCategoryForm(false);
      setEditingCategory(null);
      loadData();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('确定要删除这个分类吗？')) return;
    try {
      await categoriesApi.delete(id);
      loadData();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">管理后台</h1>
          <p className="mt-1 text-slate-500">管理工具和分类</p>
        </div>
      </div>

      {/* 标签页切换 */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('tools')}
          className={clsx(
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            activeTab === 'tools' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'
          )}
        >
          工具管理 ({tools.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={clsx(
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            activeTab === 'categories' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'
          )}
        >
          分类管理 ({categories.length})
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {/* 工具管理 */}
          {activeTab === 'tools' && (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setEditingTool({ name: '', slug: '', url: '', description: '', tags: [], is_featured: false });
                  setShowToolForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                <Plus size={18} />
                添加工具
              </button>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">工具</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase hidden md:table-cell">分类</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase hidden lg:table-cell">浏览量</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{tool.icon || '🔧'}</span>
                            <div>
                              <p className="font-medium text-slate-800">{tool.name}</p>
                              <p className="text-xs text-slate-400 truncate max-w-xs">{tool.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-sm text-slate-600">{tool.category_name || '-'}</span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-sm text-slate-500">{tool.view_count}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingTool(tool);
                                setShowToolForm(true);
                              }}
                              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Edit size={16} className="text-slate-500" />
                            </button>
                            <button
                              onClick={() => handleDeleteTool(tool.id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 分类管理 */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setEditingCategory({ name: '', slug: '', icon: '📁', description: '' });
                  setShowCategoryForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                <Plus size={18} />
                添加分类
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <h3 className="font-medium text-slate-800">{category.name}</h3>
                          <p className="text-xs text-slate-400">{category.slug}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingCategory(category);
                            setShowCategoryForm(true);
                          }}
                          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit size={14} className="text-slate-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{category.description}</p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        {category.tool_count || 0} 个工具
                      </span>
                      <ChevronRight size={14} className="text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* 工具表单弹窗 */}
      {showToolForm && editingTool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editingTool.id ? '编辑工具' : '添加工具'}</h2>
              <button onClick={() => setShowToolForm(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">名称 *</label>
                <input
                  type="text"
                  value={editingTool.name || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug *</label>
                <input
                  type="text"
                  value={editingTool.slug || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL *</label>
                <input
                  type="url"
                  value={editingTool.url || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, url: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">图标</label>
                <input
                  type="text"
                  value={editingTool.icon || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="例如: 🛠️"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
                <textarea
                  value={editingTool.description || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">分类</label>
                <select
                  value={editingTool.category_id || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, category_id: Number(e.target.value) || null })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">无分类</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">标签（逗号分隔）</label>
                <input
                  type="text"
                  value={editingTool.tags?.join(', ') || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="AI, 工具, 效率"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={editingTool.is_featured || false}
                  onChange={(e) => setEditingTool({ ...editingTool, is_featured: e.target.checked })}
                  className="rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                />
                <label htmlFor="featured" className="text-sm text-slate-700">精选推荐</label>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowToolForm(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveTool}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                <Save size={16} />
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 分类表单弹窗 */}
      {showCategoryForm && editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editingCategory.id ? '编辑分类' : '添加分类'}</h2>
              <button onClick={() => setShowCategoryForm(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">名称 *</label>
                <input
                  type="text"
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug *</label>
                <input
                  type="text"
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">图标</label>
                <input
                  type="text"
                  value={editingCategory.icon || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="例如: 🛠️"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
                <textarea
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">排序</label>
                <input
                  type="number"
                  value={editingCategory.sort_order || 0}
                  onChange={(e) => setEditingCategory({ ...editingCategory, sort_order: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCategoryForm(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveCategory}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                <Save size={16} />
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
