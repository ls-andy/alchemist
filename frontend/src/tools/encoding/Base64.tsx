import { useState } from 'react';
import { ArrowDownUp, Copy, Check, Trash2 } from 'lucide-react';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = () => {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch (e) {
      setError('转换失败：输入内容格式不正确');
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
    const temp = input;
    setInput(output);
    setOutput(temp);
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setError('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Base64 编解码</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('encode')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              mode === 'encode' 
                ? 'bg-primary-500 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            编码
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              mode === 'decode' 
                ? 'bg-primary-500 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            解码
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            {mode === 'encode' ? '原始文本' : 'Base64 字符串'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入 Base64 字符串...'}
            className="w-full h-48 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            {mode === 'encode' ? 'Base64 结果' : '解码结果'}
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
          {mode === 'encode' ? '编码' : '解码'}
        </button>
        <button
          onClick={handleSwap}
          disabled={!output}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg transition-colors"
          title="交换输入输出"
        >
          <ArrowDownUp size={20} />
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
