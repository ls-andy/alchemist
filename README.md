# Illuminati - 多功能效率工具箱

一个现代化的工具聚合网站，汇集各类优质在线工具。

## 项目结构

```
Illuminati/
├── frontend/          # React 前端项目
│   ├── src/
│   │   ├── api/       # API 接口
│   │   ├── components/# React 组件
│   │   ├── pages/     # 页面组件
│   │   ├── types/     # TypeScript 类型定义
│   │   └── utils/     # 工具函数
│   └── ...
├── backend/           # Node.js 后端项目
│   ├── src/
│   │   ├── models/    # 数据模型
│   │   ├── routes/    # API 路由
│   │   └── index.ts   # 入口文件
│   └── data/          # SQLite 数据库文件
└── docs/              # 项目文档
```

## 技术栈

### 前端
- React 18 + TypeScript
- Vite（构建工具）
- Tailwind CSS（样式）
- React Router（路由）
- Axios（HTTP 客户端）
- Lucide React（图标）

### 后端
- Node.js + Express
- TypeScript
- SQLite (better-sqlite3)
- CORS

## 快速开始

### 环境要求
- Node.js 18+
- pnpm / npm / yarn

### 安装依赖

```bash
# 安装后端依赖
cd backend
pnpm install

# 安装前端依赖
cd ../frontend
pnpm install
```

### 启动开发服务器

```bash
# 启动后端（端口 3001）
cd backend
pnpm dev

# 启动前端（端口 3000）
cd ../frontend
pnpm dev
```

### 构建生产版本

```bash
# 构建后端
cd backend
pnpm build

# 构建前端
cd ../frontend
pnpm build
```

## API 接口

### 工具接口
- `GET /api/tools` - 获取所有工具
- `GET /api/tools/:slug` - 获取单个工具
- `POST /api/tools` - 创建工具
- `PUT /api/tools/:id` - 更新工具
- `DELETE /api/tools/:id` - 删除工具

### 分类接口
- `GET /api/categories` - 获取所有分类
- `GET /api/categories/:slug` - 获取单个分类
- `POST /api/categories` - 创建分类
- `PUT /api/categories/:id` - 更新分类
- `DELETE /api/categories/:id` - 删除分类

### 搜索接口
- `GET /api/search?q=keyword` - 搜索工具
- `GET /api/search/featured` - 获取精选工具
- `GET /api/search/latest` - 获取最新工具
- `GET /api/search/popular` - 获取热门工具

## 功能特性

### 前端功能
- ✅ 响应式设计，支持移动端
- ✅ 工具分类浏览
- ✅ 全局搜索功能
- ✅ 工具详情页
- ✅ 精选/热门/最新排序
- ✅ 网格/列表视图切换
- ✅ 管理后台（工具和分类管理）

### 后端功能
- ✅ RESTful API
- ✅ SQLite 数据库
- ✅ 自动数据库初始化
- ✅ 工具浏览量统计
- ✅ 分类工具计数

## 配置

### 前端配置
编辑 `frontend/vite.config.ts`：
- 修改端口号
- 配置 API 代理

### 后端配置
编辑 `backend/src/index.ts`：
- 修改端口号（默认 3001）

## 默认数据

系统初始化时会自动填充以下数据：
- 10 个工具分类
- 40+ 个精选工具

包括：AI工具、开发工具、设计工具、效率工具等分类。

## 开发指南

### 添加新工具
1. 访问 `/admin` 管理后台
2. 点击"添加工具"
3. 填写工具信息并保存

### 添加新分类
1. 访问 `/admin` 管理后台
2. 切换到"分类管理"
3. 点击"添加分类"
4. 填写分类信息并保存

## License

MIT
