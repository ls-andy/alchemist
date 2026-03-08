import { Router, Request, Response } from 'express';
import db from '../models/database';

const router = Router();

// 搜索工具
router.get('/', (req: Request, res: Response) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ success: false, error: 'Search query is required' });
    }

    const searchTerm = `%${q}%`;
    
    const tools = db.prepare(`
      SELECT t.*, c.name as category_name, c.slug as category_slug
      FROM tools t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.is_active = 1 AND (
        t.name LIKE ? OR 
        t.description LIKE ? OR 
        t.tags LIKE ?
      )
      ORDER BY t.is_featured DESC, t.view_count DESC
      LIMIT ?
    `).all(searchTerm, searchTerm, searchTerm, Number(limit)) as any[];

    // 解析tags
    const parsedTools = tools.map(tool => ({
      ...tool,
      tags: tool.tags ? tool.tags.split(',') : []
    }));

    res.json({
      success: true,
      data: parsedTools,
      query: q,
      total: tools.length
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

// 获取热门搜索/推荐工具
router.get('/featured', (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    
    const tools = db.prepare(`
      SELECT t.*, c.name as category_name, c.slug as category_slug
      FROM tools t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.is_active = 1 AND t.is_featured = 1
      ORDER BY t.view_count DESC
      LIMIT ?
    `).all(Number(limit)) as any[];

    const parsedTools = tools.map(tool => ({
      ...tool,
      tags: tool.tags ? tool.tags.split(',') : []
    }));

    res.json({ success: true, data: parsedTools });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch featured tools' });
  }
});

// 获取最新工具
router.get('/latest', (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    
    const tools = db.prepare(`
      SELECT t.*, c.name as category_name, c.slug as category_slug
      FROM tools t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.is_active = 1
      ORDER BY t.created_at DESC
      LIMIT ?
    `).all(Number(limit)) as any[];

    const parsedTools = tools.map(tool => ({
      ...tool,
      tags: tool.tags ? tool.tags.split(',') : []
    }));

    res.json({ success: true, data: parsedTools });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch latest tools' });
  }
});

// 获取热门工具
router.get('/popular', (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    
    const tools = db.prepare(`
      SELECT t.*, c.name as category_name, c.slug as category_slug
      FROM tools t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.is_active = 1
      ORDER BY t.view_count DESC
      LIMIT ?
    `).all(Number(limit)) as any[];

    const parsedTools = tools.map(tool => ({
      ...tool,
      tags: tool.tags ? tool.tags.split(',') : []
    }));

    res.json({ success: true, data: parsedTools });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch popular tools' });
  }
});

export default router;
