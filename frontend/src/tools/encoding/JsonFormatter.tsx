import { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');

  const handleFormat = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      if (mode === 'format') {
        setOutput(JSON.stringify(parsed, null, indent));
      } else {
        setOutput(JSON.stringify(parsed));
      }
    } catch (e: any) {
      setError('JSON 格式错误：' + e.message);
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

  const handleSample = () => {
    setInput(JSON.stringify({ name: "Illuminati", version: "1.0.0", features: ["tools", "search", "admin"], active: true }, null, 2));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">JSON 格式化</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('format')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              mode === 'format' 
                ? 'bg-primary-500 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            格式化
          </button>
          <button
            onClick={() => setMode('minify')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              mode === 'minify' 
                ? 'bg-primary-500 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            压缩
          </button>
          {mode === 'format' && (
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="px-3 py-1.5 text-sm bg-slate-100 rounded-lg border-0"
            >
              <option value={2}>2 空格</option>
              <option value={4}>4 空格</option>
              <option value={1}>1 Tab</option>
            </select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">输入 JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full h-64 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">输出结果</label>
          <textarea
            value={output}
            readOnly
            placeholder="格式化结果..."
            className="w-full h-64 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 resize-none font-mono text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-mono">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={handleFormat}
          disabled={!input}
          className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 text-white rounded-lg transition-colors font-medium"
        >
          {mode === 'format' ? '格式化' : '压缩'}
        </button>
        <button
          onClick={handleSample}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
        >
          示例
        </button>
        <button
          onClick={handleCopy}
          disabled={!output}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg transition-colors"
          title="复制结果"
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
