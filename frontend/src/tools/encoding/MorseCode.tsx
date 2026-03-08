import { useState, useEffect } from 'react';
import { ArrowDownUp, Copy, Check, Trash2 } from 'lucide-react';

export default function MorseCode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [chineseMode, setChineseMode] = useState<'unicode' | 'ignore'>('unicode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // 实时转换
  useEffect(() => {
    handleConvert();
  }, [input, mode, chineseMode]);

  const morseCode: Record<string, string> = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
    '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
    ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
    '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
  };

  const reverseMorseCode: Record<string, string> = {};
  Object.entries(morseCode).forEach(([char, code]) => {
    reverseMorseCode[code] = char;
  });

  // 数字转摩斯电码
  const digitToMorse = (digit: string): string => {
    const digitMorse: Record<string, string> = {
      '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
      '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
    };
    return digitMorse[digit] || '';
  };

  // 摩斯电码转数字
  const morseToDigit = (morse: string): string => {
    const morseDigit: Record<string, string> = {
      '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4',
      '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9'
    };
    return morseDigit[morse] || '';
  };

  // 检测是否为中文字符
  const isChinese = (char: string): boolean => {
    return /[\u4e00-\u9fff]/.test(char);
  };

  const encode = (text: string) => {
    return text.split('').map(char => {
      if (char === ' ') return '/';
      
      const upperChar = char.toUpperCase();
      
      // 处理中文字符
      if (isChinese(char)) {
        if (chineseMode === 'unicode') {
          // 将中文字符转为 Unicode 码点，然后编码每个数字
          const codePoint = char.codePointAt(0);
          if (codePoint !== undefined) {
            const digits = codePoint.toString();
            return '{' + digits.split('').map(d => digitToMorse(d)).join(' ') + '}';
          }
        } else {
          // 忽略模式：保留原字符
          return char;
        }
      }
      
      return morseCode[upperChar] || char;
    }).join(' ');
  };

  const decode = (morse: string) => {
    let result = '';
    let i = 0;
    
    while (i < morse.length) {
      const char = morse[i];
      
      // 处理中文 Unicode 编码 {..... .....}
      if (char === '{') {
        const endBracket = morse.indexOf('}', i);
        if (endBracket !== -1) {
          const codeMorse = morse.slice(i + 1, endBracket);
          const digits = codeMorse.split(' ').map(m => morseToDigit(m)).join('');
          const codePoint = parseInt(digits, 10);
          if (!isNaN(codePoint)) {
            result += String.fromCodePoint(codePoint);
          }
          i = endBracket + 1;
          continue;
        }
      }
      
      // 处理普通摩斯码
      if (char === '/') {
        result += ' ';
        i++;
        continue;
      }
      
      if (char === ' ' || char === '\n') {
        i++;
        continue;
      }
      
      // 提取一个摩斯码序列
      let code = '';
      while (i < morse.length && morse[i] !== ' ' && morse[i] !== '/' && morse[i] !== '{' && morse[i] !== '}') {
        code += morse[i];
        i++;
      }
      
      if (code) {
        result += reverseMorseCode[code] || code;
      }
    }
    
    return result;
  };

  const handleConvert = () => {
    setError('');
    const cleanInput = input.trim();
    
    if (!cleanInput) {
      setOutput('');
      return;
    }
    
    try {
      if (mode === 'encode') {
        setOutput(encode(cleanInput));
      } else {
        setOutput(decode(cleanInput));
      }
    } catch (e) {
      setError('转换失败');
      setOutput('');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">摩斯电码</h2>
        <span className="text-xs text-slate-500">实时转换</span>
      </div>

      {/* 转换方向 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMode('encode')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            mode === 'encode' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          编码
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            mode === 'decode' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          解码
        </button>
      </div>

      {/* 中文处理模式 */}
      {mode === 'encode' && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">中文处理：</span>
          <button
            onClick={() => setChineseMode('unicode')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              chineseMode === 'unicode' ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Unicode 编码
          </button>
          <button
            onClick={() => setChineseMode('ignore')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              chineseMode === 'ignore' ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            保留原字
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            {mode === 'encode' ? '文本' : '摩斯电码'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '输入文本（支持中文）...' : '输入摩斯电码（用空格分隔，/ 表示空格）...'}
            className="w-full h-32 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            {mode === 'encode' ? '摩斯电码' : '文本'}
          </label>
          <textarea
            value={output}
            readOnly
            placeholder="转换结果..."
            className="w-full h-32 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 resize-none font-mono"
          />
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={handleSwap}
          disabled={!output}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg transition-colors"
          title="交换"
        >
          <ArrowDownUp size={20} />
        </button>
        <button
          onClick={handleCopy}
          disabled={!output}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg transition-colors"
          title="复制"
        >
          {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
        </button>
        <button
          onClick={handleClear}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title="清空"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Reference table */}
      <div className="bg-slate-50 rounded-xl p-4">
        <div className="text-sm font-medium text-slate-600 mb-2">常用编码参考</div>
        <div className="grid grid-cols-6 md:grid-cols-10 gap-2 text-xs">
          {Object.entries(morseCode).slice(0, 26).map(([char, code]) => (
            <div key={char} className="text-center p-1 bg-white rounded border border-slate-200">
              <div className="font-bold text-slate-800">{char}</div>
              <div className="text-slate-500 font-mono">{code}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
        <div className="font-medium mb-1">说明：</div>
        <ul className="list-disc list-inside space-y-0.5">
          <li>支持中文编码：使用 Unicode 码点表示，格式为 {'{数字摩斯码}'}</li>
          <li>例如：中 → U+4E2D → {'{....- . ..--- -..}'} </li>
          <li>输入即转换，无需点击按钮</li>
        </ul>
      </div>
    </div>
  );
}
