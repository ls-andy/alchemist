# Alchemist - 炼金术师

> 将平凡数据转化为珍贵价值的在线工具箱

一个现代化的在线工具聚合网站，汇集各类实用工具，开箱即用。

## ✨ 特性

- 🎨 **现代化界面** — 响应式设计，深色模式支持
- ⚡ **纯前端工具** — 大部分工具无需后端，离线可用
- 🔧 **26+ 实用工具** — 编码、加密、时间、文本、数学、开发工具
- 📱 **移动端友好** — 完美适配手机和平板

## 🛠️ 工具列表

### 编码解码
- Base64 编解码
- URL 编解码
- JSON 格式化
- 摩斯电码（支持中文）
- Unicode 转换

### 加密哈希
- 哈希计算（MD5/SHA/等）
- 密码生成器（批量生成）
- UUID 生成器

### 时间日期
- 时间戳转换
- 日期计算器
- 倒计时
- 天干地支

### 文本处理
- 字数统计
- 大小写转换
- 数字转中文（繁体/简体/金额）
- 盘古之白

### 数学工具
- BMI 计算器（亚洲标准）
- 阶乘计算器
- 亲戚关系计算器
- 随机数生成器

### 开发工具
- 进制转换（支持 BigInt）
- 原码反码补码
- URL 参数序列化
- CIDR 计算
- 正则表达式测试

### 生成工具
- 二维码生成

## 🚀 在线访问

[https://ls-andy.github.io/alchemist/](https://ls-andy.github.io/alchemist/)

## 📦 本地运行

```bash
# 克隆仓库
git clone https://github.com/ls-andy/alchemist.git
cd alchemist

# 安装依赖
cd frontend
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 🛠️ 技术栈

- **前端**: React 18 + TypeScript + Vite + Tailwind CSS
- **后端**: Node.js + Express + SQLite（可选）
- **部署**: GitHub Pages

## 📁 项目结构

```
alchemist/
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── tools/         # 工具组件
│   │   ├── components/    # 通用组件
│   │   └── pages/         # 页面
│   └── ...
├── backend/               # 后端项目（可选）
│   └── ...
├── docs/                  # 文档
└── .github/workflows/     # CI/CD
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT
