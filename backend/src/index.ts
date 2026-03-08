import express from 'express';
import cors from 'cors';
import { initDatabase } from './models/database';
import toolsRouter from './routes/tools';
import categoriesRouter from './routes/categories';
import searchRouter from './routes/search';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 初始化数据库
initDatabase();

// 路由
app.use('/api/tools', toolsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/search', searchRouter);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Illuminati Backend running on http://localhost:${PORT}`);
});

export default app;
