import { Router, Request, Response } from 'express';
import db from '../models/database';

const router = Router();

// 获取所有工具
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, featured, limit = 50, offset = 0 } = req.query;
    
    let sql = `
      SELECT t.*, c.name as category_name, c.slug as category_slug
      FROM tools t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.is_active = 1
    `;
    const params: any[] = [];

    if (category) {
      sql += ` AND c.slug = ?`;
      params.push(category);
    }

    if (featured === 'true') {
      sql += ` AND t.is_featured = 1`;
    }

    sql += ` ORDER BY t.is_featured DESC, t.view_count DESC, t.created_at DESC`;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const tools = db.prepare(sql).all(...params) as any[];

    // 解析tags
    const parsedTools = tools.map(tool => ({
      ...tool,
      tags: tool.tags ? tool.tags.split(',') : []
    }));

    res.json({
      success: true,
      data: parsedTools,
      total: tools.length
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch tools' });
  }
});

// 获取工具总数
router.get('/count', (req: Request, res: Response) => {
  try {
    const result = db.prepare('SELECT COUNT(*) as count FROM tools WHERE is_active = 1').get() as { count: number };
    res.json({ success: true, count: result.count });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to count tools' });
  }
});

// 获取单个工具
router.get('/:slug', (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    const tool = db.prepare(`
      SELECT t.*, c.name as category_name, c.slug as category_slug
      FROM tools t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.slug = ? AND t.is_active = 1
    `).get(slug) as any;

    if (!tool) {
      return res.status(404).json({ success: false, error: 'Tool not found' });
    }

    // 增加浏览量
    db.prepare('UPDATE tools SET view_count = view_count + 1 WHERE id = ?').run(tool.id);

    // 解析tags
    tool.tags = tool.tags ? tool.tags.split(',') : [];

    res.json({ success: true, data: tool });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch tool' });
  }
});

// 创建工具（管理功能）
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, slug, description, url, icon, category_id, tags, is_featured } = req.body;
    
    const result = db.prepare(`
      INSERT INTO tools (name, slug, description, url, icon, category_id, tags, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, slug, description, url, icon, category_id, tags?.join(','), is_featured ? 1 : 0);

    res.status(201).json({ 
      success: true, 
      id: result.lastInsertRowid,
      message: 'Tool created successfully' 
    });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ success: false, error: 'Tool slug already exists' });
    }
    res.status(500).json({ success: false, error: 'Failed to create tool' });
  }
});

// 更新工具
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, url, icon, category_id, tags, is_featured, is_active } = req.body;
    
    db.prepare(`
      UPDATE tools 
      SET name = ?, description = ?, url = ?, icon = ?, category_id = ?, 
          tags = ?, is_featured = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, description, url, icon, category_id, tags?.join(','), is_featured ? 1 : 0, is_active ? 1 : 0, id);

    res.json({ success: true, message: 'Tool updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update tool' });
  }
});

// 删除工具
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM tools WHERE id = ?').run(id);
    res.json({ success: true, message: 'Tool deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete tool' });
  }
});

export default router;
