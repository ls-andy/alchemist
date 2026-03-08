# Illuminati 功能规格文档

> **项目目标**: 多功能效率工具箱，所有工具本地化运行，不跳转第三方页面
> **参考网站**: https://ol.woobx.cn/ (一个木函 - 80 个工具)
> **版本**: v1.0
> **更新日期**: 2026-03-07

---

## 一、项目概述

### 1.1 背景

Illuminati 是一个现代化的工具聚合网站，旨在为用户提供一站式效率工具服务。所有工具均在本地浏览器中运行，无需跳转外部网站，保护用户隐私的同时提供流畅的使用体验。

### 1.2 核心原则

1. **本地优先**: 所有工具在浏览器端运行，数据不上传服务器
2. **离线可用**: 核心工具支持离线使用
3. **响应式设计**: 支持桌面端和移动端
4. **开源免费**: 所有工具免费使用，无广告

### 1.3 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ 编码工具 │ │ 图片工具 │ │ 文本工具 │ │ 开发工具 │ ...   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               Backend API (Express + SQLite)             │
│  • 工具元数据管理  • 分类管理  • 使用统计  • 搜索索引     │
└─────────────────────────────────────────────────────────┘
```

---

## 二、工具分类与功能清单

### 2.1 已实现工具 (Phase 0)

| 工具名称 | Slug | 状态 | 备注 |
|---------|------|------|------|
| Base64 编解码 | `base64` | ✅ 完成 | 支持 UTF-8 |
| URL 编解码 | `url-encoder` | ✅ 完成 | - |
| JSON 格式化 | `json-formatter` | ✅ 完成 | 格式化/压缩 |
| 哈希计算 | `hash` | ✅ 完成 | MD5/SHA-1/SHA-256 |
| 时间戳转换 | `timestamp` | ✅ 完成 | Unix 时间戳 |
| 二维码生成 | `qrcode` | ⚠️ 需修复 | 当前算法不可扫描 |

### 2.2 Phase 1: 基础工具扩展 (纯前端实现)

**目标**: 实现无需外部依赖的基础工具

#### 2.2.1 编码解码类

| 工具名称 | Slug | 功能描述 | 实现方式 |
|---------|------|---------|---------|
| 进制转换器 | `base-converter` | 二/八/十/十六进制互转 | 纯 JS |
| Unicode 转换 | `unicode-converter` | 字符与 Unicode 码互转 | 纯 JS |
| 原码/反码/补码 | `binary-codec` | 整数二进制表示转换 | 位运算 |
| 摩斯电码 | `morse-code` | 文本与摩斯电码互转 | 字符映射表 |
| URL 参数序列化 | `params-serialization` | URL 参数解析/构建 | URL API |

#### 2.2.2 加密哈希类

| 工具名称 | Slug | 功能描述 | 实现方式 |
|---------|------|---------|---------|
| 密码生成器 | `password-generator` | 可配置规则生成密码 | 纯 JS |
| UUID 生成器 | `uuid-generator` | UUID v1/v4 生成 | crypto API |

#### 2.2.3 文本处理类

| 工具名称 | Slug | 功能描述 | 实现方式 |
|---------|------|---------|---------|
| 数字转中文 | `number2chinese` | 阿拉伯数字转中文 | 映射表 |
| 盘古之白 | `pangu` | 中英文间自动加空格 | 正则替换 |
| 字数统计 | `word-count` | 字符/单词/行数统计 | 纯 JS |
| 大小写转换 | `case-converter` | 大小写/驼峰/下划线转换 | 纯 JS |

#### 2.2.4 日期计算类

| 工具名称 | Slug | 功能描述 | 实现方式 |
|---------|------|---------|---------|
| 日期计算器 | `date-calculator` | 日期差值/加减计算 | Date API |
| 天干地支 | `ganzhi` | 年份干支计算 | 算法映射 |
| 倒计时生成 | `countdown` | 生成倒计时 | Date API |

#### 2.2.5 数学生成类

| 工具名称 | Slug | 功能描述 | 实现方式 |
|---------|------|---------|---------|
| 随机数生成器 | `random-number` | 范围内随机数 | Math.random |
| 阶乘计算器 | `factorial-calculator` | 大数阶乘计算 | BigInt |
| BMI 计算器 | `bmi-calculator` | 身体质量指数 | 公式 |
| 亲戚关系计算器 | `kinship-calculator` | 亲戚称谓查询 | 关系图谱 |

#### 2.2.6 网络工具类

| 工具名称 | Slug | 功能描述 | 实现方式 |
|---------|------|---------|---------|
| CIDR 计算器 | `cidr-calculator` | IP 地址段计算 | 纯 JS |
| UA 解析 | `ua-parser` | User-Agent 解析 | ua-parser-js |
| 短网址生成 | `url-shortener` | 本地短链生成 | 纯 JS (本地映射) |

#### 2.2.7 开发工具类

| 工具名称 | Slug | 功能描述 | 实现方式 |
|---------|------|---------|---------|
| YAML ↔ JSON | `yaml2json` | YAML/JSON 互转 | js-yaml |
| XML ↔ JSON | `xml2json` | XML/JSON 互转 | xml2js |
| 正则测试 | `regex-tester` | 正则表达式测试 | RegExp |
| JS 压缩 | `minify-js` | JavaScript 压缩 | terser |

### 2.3 Phase 2: 编辑器类工具 (需引入编辑器库)

#### 2.3.1 编辑器类

| 工具名称 | Slug | 功能描述 | 依赖库 |
|---------|------|---------|--------|
| JSON 编辑器 | `json-editor` | JSON 可视化编辑 | monaco-editor |
| Markdown 编辑器 | `markdown-editor` | Markdown 实时预览 | marked + highlight.js |
| 富文本编辑器 | `richtext-editor` | 所见即所得编辑 | @tiptap/react |
| 代码对比 | `code-diff` | 代码差异对比 | diff |

### 2.4 Phase 3: 图片处理工具 (Canvas/库)

#### 2.4.1 基础图片处理

| 工具名称 | Slug | 功能描述 | 实现方式 |
|---------|------|---------|---------|
| 图片压缩 | `image-compressor` | 图片无损压缩 | browser-image-compression |
| 图片格式转换 | `image-converter` | PNG/JPG/WEBP 互转 | Canvas API |
| 图片缩放 | `picture-resizer` | 按尺寸/比例缩放 | Canvas API |
| 图片加水印 | `watermark` | 文字/图片水印 | Canvas API |
| 取色器 | `color-picker` | 从图片取色 | Canvas API |
| 图片转 Base64 | `image2base64` | 图片编码转换 | FileReader |
| Base64 转图片 | `base642image` | Base64 解码为图片 | Data URL |
| 九宫格切图 | `nine-grid` | 图片切割为九宫格 | Canvas API |
| 文本转图片 | `text2image` | 文本生成图片 | Canvas API |

#### 2.4.2 GIF 处理

| 工具名称 | Slug | 功能描述 | 实现方式 |
|---------|------|---------|---------|
| GIF 分解 | `gif-splitter` | GIF 提取帧图片 | gif.js / omggif |
| GIF 合成 | `gif-encoder` | 多图合成 GIF | gif.js |
| 视频转 GIF | `video2gif` | 视频片段转 GIF | ffmpeg.wasm |

#### 2.4.3 图片特效

| 工具名称 | Slug | 功能描述 | 实现方式 |
|---------|------|---------|---------|
| 图片反色 | `image-invert` | 颜色反转 | Canvas API |
| 图片素描 | `picture-sketch` | 素描效果滤镜 | Canvas 像素操作 |
| 图片包浆 | `image-patina` | 老照片效果 | Canvas 像素操作 |
| 幻影坦克 | `mirage-tank` | 隐藏图生成 | Canvas Alpha 混合 |

### 2.5 Phase 4: 文档处理工具

| 工具名称 | Slug | 功能描述 | 实现方式 |
|---------|------|---------|---------|
| PDF 转图片 | `pdf2img` | PDF 页面提取为图片 | pdf.js |
| 图片转 PDF | `img2pdf` | 多图合成 PDF | jspdf |
| ZIP 压缩/解压 | `zip-archive` | 文件压缩解压 | JSZip |

### 2.6 Phase 5: 音视频工具 (WebCodecs/FFmpeg.wasm)

| 工具名称 | Slug | 功能描述 | 实现方式 |
|---------|------|---------|---------|
| 音频提取器 | `audio-extractor` | 从视频提取音频 | ffmpeg.wasm |
| WebM 转 MP4 | `webm2mp4` | 视频格式转换 | ffmpeg.wasm |
| 屏幕录制 | `screen-recorder` | 浏览器录屏 | MediaRecorder API |

### 2.7 Phase 6: AI 辅助工具 (需后端或 API)

| 工具名称 | Slug | 功能描述 | 实现方式 |
|---------|------|---------|---------|
| 文本识别 OCR | `ocr` | 图片文字识别 | Tesseract.js (本地) |
| 图片背景去除 | `remove-bg` | 抠图工具 | @imgly/background-removal |
| 文本转语音 | `tts` | TTS 朗读 | Web Speech API |

### 2.8 Phase 7: 查询类工具 (需外部 API)

| 工具名称 | Slug | 功能描述 | 依赖 |
|---------|------|---------|------|
| 在线翻译 | `translator` | 多语言翻译 | 翻译 API |
| 货币汇率换算 | `currency-converter` | 实时汇率 | 汇率 API |
| 垃圾分类查询 | `garbage-sort` | 垃圾分类数据库 | 本地数据库 |
| 历史上的今天 | `histoday` | 历史事件查询 | 维基百科 API |
| bilibili 封面获取 | `bilibili-cover` | 视频封面提取 | B站 API |

### 2.9 趣味工具

| 工具名称 | Slug | 功能描述 | 实现方式 |
|---------|------|---------|---------|
| 电子木鱼 | `e-muyu` | 点击功德+1 | 纯 JS + 音效 |
| 番茄时钟 | `pomodoro-clock` | 番茄工作法计时器 | 纯 JS |
| 今天吃什么 | `what2eat` | 随机推荐食物 | 随机数组 |
| 人生小格 | `lifecount` | 人生进度可视化 | Canvas |
| 心灵毒鸡汤 | `soul-words` | 随机语录 | 本地数据 |
| 舔狗日记 | `simp-words` | 随机语录 | 本地数据 |
| 艺术字符生成 | `figlet-ascii` | ASCII Art 生成 | figlet.js |
| 必应壁纸 | `bing-wallpaper` | 获取每日壁纸 | Bing API |

---

## 三、通用功能规格

### 3.1 首页

- **搜索栏**: 全局搜索工具名称/描述/标签
- **分类导航**: 按类别浏览工具
- **精选工具**: 展示热门/推荐工具
- **最近使用**: 显示用户最近使用的工具 (localStorage)
- **视图切换**: 网格/列表视图

### 3.2 工具页面通用规格

每个工具页面应包含：

1. **标题栏**: 工具名称 + 图标
2. **操作区**: 输入/配置/执行
3. **结果区**: 输出/预览/下载
4. **工具栏**:
   - 清空 (Clear)
   - 复制结果 (Copy)
   - 下载结果 (Download，如适用)
   - 交换输入输出 (Swap，如适用)
5. **帮助说明**: 工具使用说明/快捷键

### 3.3 管理后台

- **工具管理**: CRUD 工具
- **分类管理**: CRUD 分类
- **统计面板**: 访问量/热门工具

---

## 四、数据模型

### 4.1 工具 (Tool)

```typescript
interface Tool {
  id: number;
  name: string;           // 工具名称
  slug: string;           // URL 标识
  description: string;    // 描述
  icon: string;           // emoji 或图标名
  category_id: number;    // 分类 ID
  tool_type: 'builtin' | 'external';  // 内置/外链
  tags: string[];         // 标签数组
  is_featured: boolean;   // 是否精选
  is_active: boolean;     // 是否启用
  view_count: number;     // 访问次数
  created_at: string;
  updated_at: string;
}
```

### 4.2 分类 (Category)

```typescript
interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  sort_order: number;
  tool_count?: number;    // 关联工具数量
}
```

---

## 五、API 规格

### 5.1 工具接口

| 方法 | 路径 | 描述 |
|-----|------|------|
| GET | `/api/tools` | 获取所有工具 |
| GET | `/api/tools/:slug` | 获取单个工具 |
| POST | `/api/tools` | 创建工具 |
| PUT | `/api/tools/:id` | 更新工具 |
| DELETE | `/api/tools/:id` | 删除工具 |
| POST | `/api/tools/:id/view` | 增加访问计数 |

### 5.2 分类接口

| 方法 | 路径 | 描述 |
|-----|------|------|
| GET | `/api/categories` | 获取所有分类 |
| GET | `/api/categories/:slug` | 获取分类及其工具 |
| POST | `/api/categories` | 创建分类 |
| PUT | `/api/categories/:id` | 更新分类 |
| DELETE | `/api/categories/:id` | 删除分类 |

### 5.3 搜索接口

| 方法 | 路径 | 描述 |
|-----|------|------|
| GET | `/api/search?q=keyword` | 搜索工具 |
| GET | `/api/search/featured` | 精选工具 |
| GET | `/api/search/latest` | 最新工具 |
| GET | `/api/search/popular` | 热门工具 |

---

## 六、UI/UX 规格

### 6.1 配色方案

```css
/* 主题色 */
--primary-50: #f0f9ff;
--primary-100: #e0f2fe;
--primary-500: #0ea5e9;
--primary-600: #0284c7;

/* 中性色 */
--slate-50: #f8fafc;
--slate-100: #f1f5f9;
--slate-500: #64748b;
--slate-800: #1e293b;
```

### 6.2 响应式断点

- 移动端: < 640px
- 平板: 640px - 1024px
- 桌面: > 1024px

### 6.3 动效

- 页面切换: `animate-fade-in` (300ms)
- 按钮交互: `transition-colors` (150ms)
- 加载状态: 旋转动画

---

## 七、验收标准

### 7.1 Phase 1 验收标准

- [ ] 所有 6 个已实现工具正常工作
- [ ] 二维码生成器可被扫描识别
- [ ] 新增至少 10 个基础工具
- [ ] 所有工具支持复制/清空操作
- [ ] 响应式布局正常

### 7.2 通用验收标准

- [ ] 无 TypeScript 类型错误
- [ ] 无 console 错误
- [ ] 工具页面加载 < 1s
- [ ] 移动端适配正常
- [ ] 键盘可访问

---

## 八、路线图

| 阶段 | 内容 | 预计工具数 |
|-----|------|-----------|
| Phase 0 | 已实现 | 6 |
| Phase 1 | 基础工具扩展 | +20 |
| Phase 2 | 编辑器类 | +5 |
| Phase 3 | 图片处理 | +15 |
| Phase 4 | 文档处理 | +3 |
| Phase 5 | 音视频 | +3 |
| Phase 6 | AI 辅助 | +3 |
| Phase 7 | 查询类 | +5 |
| **总计** | - | **~60** |

---

## 九、风险与限制

### 9.1 技术限制

1. **浏览器兼容性**: 部分工具依赖新 API，旧浏览器不支持
2. **文件大小限制**: ffmpeg.wasm 体积大 (~25MB)
3. **性能限制**: 大文件处理可能卡顿

### 9.2 功能限制

1. **AI 工具**: 本地 AI 模型精度有限
2. **外部 API**: 查询类工具依赖第三方服务可用性
3. **版权问题**: 部分工具需注意参考实现版权

---

**文档维护者**: Reed (Reviewer)
**最后更新**: 2026-03-07
