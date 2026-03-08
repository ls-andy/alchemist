import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState({
    upper: '',
    lower: '',
    capitalize: '',
    title: '',
    camel: '',
    pascal: '',
    snake: '',
    kebab: '',
    constant: '',
  });
  const [copied, setCopied] = useState<string | null>(null);

  const convert = (text: string) => {
    const words = text.trim().split(/[\s_-]+/).filter(w => w);

    setOutputs({
      upper: text.toUpperCase(),
      lower: text.toLowerCase(),
      capitalize: text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
      title: words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '),
      camel: words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(''),
      pascal: words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(''),
      snake: words.map(w => w.toLowerCase()).join('_'),
      kebab: words.map(w => w.toLowerCase()).join('-'),
      constant: words.map(w => w.toUpperCase()).join('_'),
    });
  };

  const handleInput = (value: string) => {
    setInput(value);
    convert(value);
  };

  const handleCopy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutputs({
      upper: '', lower: '', capitalize: '', title: '',
      camel: '', pascal: '', snake: '', kebab: '', constant: ''
    });
  };

  const formats = [
    { key: 'upper', label: '大写 (UPPER CASE)', example: 'HELLO WORLD' },
    { key: 'lower', label: '小写 (lower case)', example: 'hello world' },
    { key: 'capitalize', label: '首字母大写 (Sentence case)', example: 'Hello world' },
    { key: 'title', label: '标题格式 (Title Case)', example: 'Hello World' },
    { key: 'camel', label: '驼峰命名 (camelCase)', example: 'helloWorld' },
    { key: 'pascal', label: '帕斯卡命名 (PascalCase)', example: 'HelloWorld' },
    { key: 'snake', label: '蛇形命名 (snake_case)', example: 'hello_world' },
    { key: 'kebab', label: '短横命名 (kebab-case)', example: 'hello-world' },
    { key: 'constant', label: '常量命名 (CONSTANT_CASE)', example: 'HELLO_WORLD' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">大小写转换</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">输入文本</label>
        <textarea
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="输入要转换的文本..."
          className="w-full h-24 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      <div className="space-y-3">
        {formats.map(format => (
          <div key={format.key} className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-500">{format.label}</label>
              <button
                onClick={() => handleCopy(format.key, outputs[format.key as keyof typeof outputs])}
                disabled={!outputs[format.key as keyof typeof outputs]}
                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
              >
                {copied === format.key ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="font-mono text-sm text-slate-800 min-h-[24px] break-all">
              {outputs[format.key as keyof typeof outputs] || <span className="text-slate-400">-</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleClear}
          className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
        >
          清空
        </button>
      </div>
    </div>
  );
}
