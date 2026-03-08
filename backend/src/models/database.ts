import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../data/illuminati.db');
const db = new Database(dbPath);

export function initDatabase() {
  // 创建分类表
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      icon TEXT NOT NULL,
      description TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建工具表
  db.exec(`
    CREATE TABLE IF NOT EXISTS tools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      url TEXT,
      icon TEXT,
      category_id INTEGER,
      tool_type TEXT DEFAULT 'external',
      tags TEXT,
      is_featured INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      view_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  // 创建用户表（用于收藏等功能）
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT UNIQUE,
      password_hash TEXT,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建收藏表
  db.exec(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      tool_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (tool_id) REFERENCES tools(id),
      UNIQUE(user_id, tool_id)
    )
  `);

  // 插入初始数据
  seedData();
}

function seedData() {
  // 检查是否已有数据
  const count = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  if (count.count > 0) return;

  // 插入分类
  const insertCategory = db.prepare(`
    INSERT INTO categories (name, slug, icon, description, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  const categories = [
    // 内置工具分类
    ['编码解码', 'encoding', '🔢', 'Base64、URL、JSON、摩斯电码等编解码工具', 1],
    ['加密哈希', 'crypto', '🔐', 'MD5、SHA、密码生成等安全工具', 2],
    ['时间日期', 'datetime', '⏰', '时间戳转换、日期计算、倒计时等', 3],
    ['生成工具', 'generate', '🎲', '二维码、随机数、UUID生成等', 4],
    ['文字处理', 'text', '📝', '字数统计、格式转换、编码转换等', 5],
    ['数学工具', 'math', '🔢', '计算器、换算工具等', 6],
    ['开发工具', 'dev', '💻', '进制转换、正则测试、网络计算等', 7],

    // 外链工具分类
    ['AI工具', 'ai', '🤖', '人工智能相关工具', 8],
    ['设计工具', 'design', '🎨', 'UI/UX设计工具', 9],
    ['效率工具', 'productivity', '⚡', '提升工作效率的工具', 10],
    ['媒体工具', 'media', '🎬', '音视频处理工具', 11],
    ['文档工具', 'document', '📄', '文档处理与管理', 12],
    ['图片工具', 'image', '🖼️', '图片处理工具', 13],
    ['数据分析', 'data', '📊', '数据分析与可视化', 14],
  ];

  for (const cat of categories) {
    insertCategory.run(...cat);
  }

  // 插入内置工具
  const insertTool = db.prepare(`
    INSERT INTO tools (name, slug, description, url, icon, category_id, tool_type, tags, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // 内置工具 (tool_type = 'builtin') - 分类ID: encoding=1, crypto=2, datetime=3, generate=4, text=5, math=6, dev=7
  const builtinTools = [
    // 编码解码 (category_id = 1)
    ['Base64 编解码', 'base64', 'Base64 编码和解码工具', null, '🔢', 1, 'builtin', '编码,解码,Base64', 1],
    ['URL 编解码', 'url-encoder', 'URL 编码和解码工具', null, '🔗', 1, 'builtin', '编码,URL,解码', 1],
    ['JSON 格式化', 'json-formatter', 'JSON 格式化和压缩工具', null, '📋', 1, 'builtin', 'JSON,格式化,压缩', 1],
    ['摩斯电码', 'morse-code', '摩斯电码编码和解码工具', null, '📡', 1, 'builtin', '摩斯电码,编码,解码', 1],
    ['Unicode 转换', 'unicode-converter', 'Unicode 编码解码工具', null, '🔤', 1, 'builtin', 'Unicode,编码,解码', 0],

    // 加密哈希 (category_id = 2)
    ['哈希计算', 'hash', 'MD5、SHA-1、SHA-256 哈希计算', null, '🔐', 2, 'builtin', '哈希,MD5,SHA,加密', 1],
    ['密码生成器', 'password-generator', '生成安全的随机密码', null, '🔑', 2, 'builtin', '密码,生成,安全', 1],
    ['UUID 生成器', 'uuid-generator', '生成 UUID/GUID', null, '🆔', 2, 'builtin', 'UUID,GUID,生成', 0],

    // 时间日期 (category_id = 3)
    ['时间戳转换', 'timestamp', 'Unix 时间戳与日期时间互转', null, '⏰', 3, 'builtin', '时间戳,日期,转换', 1],
    ['日期计算器', 'date-calculator', '计算日期差值和日期加减', null, '📅', 3, 'builtin', '日期,计算,差值', 1],
    ['倒计时生成器', 'countdown', '创建倒计时', null, '⏱️', 3, 'builtin', '倒计时,时间,事件', 0],
    ['天干地支', 'ganzhi', '计算年份的天干地支和生肖', null, '🕐', 3, 'builtin', '天干地支,生肖,农历', 0],

    // 生成工具 (category_id = 4)
    ['二维码生成', 'qrcode', '生成二维码图片', null, '📱', 4, 'builtin', '二维码,QR,生成', 1],
    ['随机数生成器', 'random-number', '生成随机数', null, '🎲', 4, 'builtin', '随机数,生成,随机', 0],

    // 文字处理 (category_id = 5)
    ['字数统计', 'word-count', '统计字符数、字数、行数', null, '📊', 5, 'builtin', '字数,统计,字符', 1],
    ['大小写转换', 'case-converter', '多种命名格式转换', null, '🔤', 5, 'builtin', '大小写,转换,命名', 1],
    ['数字转中文', 'number-2-chinese', '数字转中文大写', null, '壹', 5, 'builtin', '中文,数字,大写', 0],
    ['盘古之白', 'pangu', '中英文自动添加空格', null, '⬜', 5, 'builtin', '空格,格式化,中英文', 0],

    // 数学工具 (category_id = 6)
    ['BMI 计算器', 'bmi-calculator', '计算身体质量指数', null, '⚖️', 6, 'builtin', 'BMI,健康,计算', 1],
    ['阶乘计算器', 'factorial-calculator', '计算大数阶乘', null, '❗', 6, 'builtin', '阶乘,数学,计算', 0],
    ['亲戚关系计算器', 'kinship-calculator', '查询亲戚关系称呼', null, '👨‍👩‍👧‍👦', 6, 'builtin', '亲戚,关系,称呼', 1],

    // 开发工具 (category_id = 7)
    ['进制转换器', 'base-converter', '二进制、八进制、十进制、十六进制互转', null, '🔄', 7, 'builtin', '进制,转换,二进制', 1],
    ['原码反码补码', 'binary-codec', '计算有符号整数的原码、反码、补码', null, '0️⃣', 7, 'builtin', '原码,反码,补码', 0],
    ['URL 参数序列化', 'params-serialization', 'URL 参数与 JSON 互转', null, '🔗', 7, 'builtin', 'URL,参数,JSON', 0],
    ['CIDR 计算器', 'cidr-calculator', '计算网络地址、子网掩码等', null, '🌐', 7, 'builtin', 'CIDR,网络,IP', 1],
    ['正则测试', 'regex-tester', '正则表达式在线测试', null, '📝', 7, 'builtin', '正则,regex,测试', 1],
  ];

  for (const tool of builtinTools) {
    insertTool.run(...tool);
  }

  // 外链工具 (tool_type = 'external') - 分类ID: ai=8, design=9, productivity=10, media=11, document=12, image=13, data=14
  const externalTools = [
    // AI工具
    ['ChatGPT', 'chatgpt', 'OpenAI开发的大语言模型对话工具', 'https://chat.openai.com', '💬', 8, 'external', 'AI,对话,写作', 1],
    ['Claude', 'claude', 'Anthropic开发的AI助手', 'https://claude.ai', '🤖', 8, 'external', 'AI,对话,编程', 1],
    ['Midjourney', 'midjourney', 'AI绘画工具', 'https://midjourney.com', '🎨', 8, 'external', 'AI,绘画,设计', 1],
    ['Stable Diffusion', 'stable-diffusion', '开源AI图像生成工具', 'https://stability.ai', '🖼️', 8, 'external', 'AI,绘画,开源', 0],
    ['文心一言', 'wenxin', '百度开发的大语言模型', 'https://yiyan.baidu.com', '🇨🇳', 8, 'external', 'AI,对话,中文', 0],
    ['通义千问', 'qianwen', '阿里开发的大语言模型', 'https://tongyi.aliyun.com', '🇨🇳', 8, 'external', 'AI,对话,中文', 0],

    // 设计工具
    ['Figma', 'figma', '在线协作设计工具', 'https://figma.com', '🎨', 9, 'external', '设计,协作,UI', 1],
    ['Canva', 'canva', '在线设计平台', 'https://canva.com', '🖼️', 9, 'external', '设计,模板,海报', 1],
    ['Dribbble', 'dribbble', '设计师作品展示平台', 'https://dribbble.com', '🏀', 9, 'external', '设计,灵感,作品', 0],
    ['Unsplash', 'unsplash', '高质量免费图片库', 'https://unsplash.com', '📷', 9, 'external', '图片,免费,素材', 0],

    // 效率工具
    ['Notion', 'notion', '一体化工作空间', 'https://notion.so', '📝', 10, 'external', '笔记,协作,知识库', 1],
    ['飞书', 'feishu', '字节跳动企业协作平台', 'https://feishu.cn', '🪶', 10, 'external', '协作,办公,IM', 1],
    ['Trello', 'trello', '看板式项目管理工具', 'https://trello.com', '📋', 10, 'external', '项目,管理,看板', 0],
    ['Todoist', 'todoist', '任务管理工具', 'https://todoist.com', '✅', 10, 'external', '任务,GTD,效率', 0],

    // 媒体工具
    ['剪映', 'jianying', '抖音出品的视频编辑工具', 'https://lv.ulikecam.com', '🎬', 11, 'external', '视频,剪辑,抖音', 1],
    ['Loom', 'loom', '屏幕录制与分享工具', 'https://loom.com', '📹', 11, 'external', '录屏,分享,协作', 0],

    // 文档工具
    ['语雀', 'yuque', '阿里巴巴知识库工具', 'https://yuque.com', '📝', 12, 'external', '文档,知识库,协作', 1],
    ['石墨文档', 'shimo', '在线协作文档工具', 'https://shimo.im', '📄', 12, 'external', '文档,协作,表格', 0],
    ['腾讯文档', 'tencent-doc', '腾讯在线文档工具', 'https://docs.qq.com', '📄', 12, 'external', '文档,协作,腾讯', 0],

    // 图片工具
    ['Remove.bg', 'removebg', 'AI图片背景移除', 'https://remove.bg', '✂️', 13, 'external', '抠图,AI,背景', 1],
    ['Photopea', 'photopea', '在线图片编辑器', 'https://photopea.com', '🖼️', 13, 'external', '编辑,PS,在线', 1],
    ['Squoosh', 'squoosh', 'Google出品的图片压缩工具', 'https://squoosh.app', '📸', 13, 'external', '压缩,优化,图片', 0],

    // 数据分析
    ['Tableau', 'tableau', '数据可视化工具', 'https://tableau.com', '📊', 14, 'external', '数据,可视化,分析', 1],
    ['Metabase', 'metabase', '开源数据分析工具', 'https://metabase.com', '📈', 14, 'external', '数据,BI,开源', 0],
  ];

  for (const tool of externalTools) {
    insertTool.run(...tool);
  }

  console.log('✅ Database seeded with initial data (26 builtin + external tools)');
}

export default db;
