import { lazy } from 'react';

// 懒加载工具组件
export const toolComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  // 编码解码
  'base64': lazy(() => import('./encoding/Base64')),
  'url-encoder': lazy(() => import('./encoding/UrlEncoder')),
  'json-formatter': lazy(() => import('./encoding/JsonFormatter')),
  'morse-code': lazy(() => import('./encoding/MorseCode')),
  'unicode-converter': lazy(() => import('./encoding/UnicodeConverter')),

  // 加密哈希
  'hash': lazy(() => import('./crypto/Hash')),
  'password-generator': lazy(() => import('./text/PasswordGenerator')),
  'uuid-generator': lazy(() => import('./text/UUIDGenerator')),

  // 时间日期
  'timestamp': lazy(() => import('./datetime/Timestamp')),
  'date-calculator': lazy(() => import('./datetime/DateCalculator')),
  'countdown': lazy(() => import('./datetime/Countdown')),
  'ganzhi': lazy(() => import('./datetime/GanZhi')),

  // 生成工具
  'qrcode': lazy(() => import('./generate/QrCode')),
  'random-number': lazy(() => import('./math/RandomNumber')),

  // 文字处理
  'word-count': lazy(() => import('./text/WordCount')),
  'case-converter': lazy(() => import('./text/CaseConverter')),
  'number-2-chinese': lazy(() => import('./text/Number2Chinese')),
  'pangu': lazy(() => import('./text/Pangu')),

  // 数学工具
  'bmi-calculator': lazy(() => import('./math/BMICalculator')),
  'factorial-calculator': lazy(() => import('./math/FactorialCalculator')),
  'kinship-calculator': lazy(() => import('./math/KinshipCalculator')),

  // 开发工具
  'base-converter': lazy(() => import('./dev/BaseConverter')),
  'binary-codec': lazy(() => import('./dev/BinaryCodec')),
  'params-serialization': lazy(() => import('./dev/ParamsSerialization')),
  'cidr-calculator': lazy(() => import('./dev/CIDRCalculator')),
  'regex-tester': lazy(() => import('./dev/RegexTester')),
  'ua-parser': lazy(() => import('./dev/UAParser')),
};

// 内置工具列表
export const builtInTools = [
  // 编码解码
  { slug: 'base64', name: 'Base64 编解码', category: 'encoding', icon: '🔢', description: 'Base64 编码和解码工具' },
  { slug: 'url-encoder', name: 'URL 编解码', category: 'encoding', icon: '🔗', description: 'URL 编码和解码工具' },
  { slug: 'json-formatter', name: 'JSON 格式化', category: 'encoding', icon: '📋', description: 'JSON 格式化和压缩工具' },
  { slug: 'morse-code', name: '摩斯电码', category: 'encoding', icon: '📡', description: '摩斯电码编码和解码' },
  { slug: 'unicode-converter', name: 'Unicode 转换', category: 'encoding', icon: '🔤', description: 'Unicode 编码解码工具' },

  // 加密哈希
  { slug: 'hash', name: '哈希计算', category: 'crypto', icon: '🔐', description: 'MD5、SHA-1、SHA-256 哈希计算' },
  { slug: 'password-generator', name: '密码生成器', category: 'crypto', icon: '🔑', description: '生成安全的随机密码' },
  { slug: 'uuid-generator', name: 'UUID 生成器', category: 'crypto', icon: '🆔', description: '生成 UUID/GUID' },

  // 时间日期
  { slug: 'timestamp', name: '时间戳转换', category: 'datetime', icon: '⏰', description: 'Unix 时间戳与日期时间互转' },
  { slug: 'date-calculator', name: '日期计算器', category: 'datetime', icon: '📅', description: '计算日期差值和日期加减' },
  { slug: 'countdown', name: '倒计时生成器', category: 'datetime', icon: '⏱️', description: '创建倒计时' },
  { slug: 'ganzhi', name: '天干地支', category: 'datetime', icon: '🕐', description: '计算年份的天干地支和生肖' },

  // 生成工具
  { slug: 'qrcode', name: '二维码生成', category: 'generate', icon: '📱', description: '生成二维码图片' },
  { slug: 'random-number', name: '随机数生成器', category: 'generate', icon: '🎲', description: '生成随机数' },

  // 文字处理
  { slug: 'word-count', name: '字数统计', category: 'text', icon: '📊', description: '统计字符数、字数、行数' },
  { slug: 'case-converter', name: '大小写转换', category: 'text', icon: '🔤', description: '多种命名格式转换' },
  { slug: 'number-2-chinese', name: '数字转中文', category: 'text', icon: '壹', description: '数字转中文大写' },
  { slug: 'pangu', name: '盘古之白', category: 'text', icon: '⬜', description: '中英文自动添加空格' },

  // 数学工具
  { slug: 'bmi-calculator', name: 'BMI 计算器', category: 'math', icon: '⚖️', description: '计算身体质量指数' },
  { slug: 'factorial-calculator', name: '阶乘计算器', category: 'math', icon: '❗', description: '计算大数阶乘' },
  { slug: 'kinship-calculator', name: '亲戚关系计算器', category: 'math', icon: '👨‍👩‍👧‍👦', description: '查询亲戚关系称呼' },

  // 开发工具
  { slug: 'base-converter', name: '进制转换器', category: 'dev', icon: '🔄', description: '二进制、八进制、十进制、十六进制互转' },
  { slug: 'binary-codec', name: '原码反码补码', category: 'dev', icon: '0️⃣', description: '计算有符号整数的原码、反码、补码' },
  { slug: 'params-serialization', name: 'URL 参数序列化', category: 'dev', icon: '🔗', description: 'URL 参数与 JSON 互转' },
  { slug: 'cidr-calculator', name: 'CIDR 计算器', category: 'dev', icon: '🌐', description: '计算网络地址、子网掩码等' },
  { slug: 'regex-tester', name: '正则测试', category: 'dev', icon: '📝', description: '正则表达式在线测试' },
  { slug: 'ua-parser', name: 'UA 解析器', category: 'dev', icon: '🔍', description: '解析 User-Agent 获取设备信息' },
];
