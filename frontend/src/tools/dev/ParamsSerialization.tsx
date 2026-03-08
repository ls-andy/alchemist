import { useState } from 'react';
import { ArrowDownUp, Copy, Check, Trash2 } from 'lucide-react';

export default function ParamsSerialization() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'parse' | 'build'>('parse');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const parseUrl = (url: string) => {
    try {
      // Extract query string
      let queryString = url;
      if (url.includes('?')) {
        queryString = url.split('?')[1];
      }
      if (queryString.includes('#')) {
        queryString = queryString.split('#')[0];
      }

      const params = new URLSearchParams(queryString);
      const result: Record<string, string> = {};

      params.forEach((value, key) => {
        result[key] = value;
      });

      return JSON.stringify(result, null, 2);
    } catch (e) {
      throw new Error('解析失败：请输入有效的 URL 或查询字符串');
    }
  };

  const buildUrl = (json: string) => {
    try {
      const obj = JSON.parse(json);
      const params = new URLSearchParams();

      Object.entries(obj).forEach(([key, value]) => {
        params.append(key, String(value));
      });

      return params.toString();
    } catch (e) {
      throw new Error('构建失败：请输入有效的 JSON 对象');
    }
  };

  const handleConvert = () => {
    setError('');
    try {
      if (mode === 'parse') {
        setOutput(parseUrl(input));
      } else {
        setOutput(buildUrl(input));
      }
    } catch (e) {
      setError((e as Error).message);
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
    setMode(mode === 'parse' ? 'build' : 'parse');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">URL 参数序列化</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('parse')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              mode === 'parse' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            解析
          </button>
          <button
            onClick={() => setMode('build')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              mode === 'build' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            构建
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            {mode === 'parse' ? 'URL / 查询字符串' : 'JSON 对象'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'parse' ? '例如: https://example.com?name=张三&age=25' : '{"name": "张三", "age": 25}'}
            className="w-full h-48 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            {mode === 'parse' ? 'JSON 对象' : '查询字符串'}
          </label>
          <textarea
            value={output}
            readOnly
            placeholder="转换结果..."
            className="w-full h-48 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 resize-none font-mono text-sm"
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
          onClick={handleConvert}
          disabled={!input}
          className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 text-white rounded-lg transition-colors font-medium"
        >
          {mode === 'parse' ? '解析' : '构建'}
        </button>
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
    </div>
  );
}
