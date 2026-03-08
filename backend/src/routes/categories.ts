import { Router, Request, Response } from 'express';
import db from '../models/database';

const router = Router();

// 获取所有分类
router.get('/', (req: Request, res: Response) => {
  try {
    const categories = db.prepare(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM tools WHERE category_id = c.id AND is_active = 1) as tool_count
      FROM categories c
      ORDER BY c.sort_order ASC
    `).all();

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

// 获取单个分类
router.get('/:slug', (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    const category = db.prepare(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM tools WHERE category_id = c.id AND is_active = 1) as tool_count
      FROM categories c
      WHERE c.slug = ?
    `).get(slug);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch category' });
  }
});

// 创建分类
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, slug, icon, description, sort_order } = req.body;
    
    const result = db.prepare(`
      INSERT INTO categories (name, slug, icon, description, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, slug, icon, description, sort_order || 0);

    res.status(201).json({ 
      success: true, 
      id: result.lastInsertRowid,
      message: 'Category created successfully' 
    });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ success: false, error: 'Category slug already exists' });
    }
    res.status(500).json({ success: false, error: 'Failed to create category' });
  }
});

// 更新分类
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, icon, description, sort_order } = req.body;
    
    db.prepare(`
      UPDATE categories 
      SET name = ?, icon = ?, description = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, icon, description, sort_order, id);

    res.json({ success: true, message: 'Category updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update category' });
  }
});

// 删除分类
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // 检查是否有关联工具
    const tools = db.prepare('SELECT COUNT(*) as count FROM tools WHERE category_id = ?').get(id) as { count: number };
    if (tools.count > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete category with associated tools' 
      });
    }

    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete category' });
  }
});

export default router;
