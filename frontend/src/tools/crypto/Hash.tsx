import { useState } from 'react';
import { Copy, Check, Trash2, Hash } from 'lucide-react';
import CryptoJS from 'crypto-js';

export default function HashTool() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ type: string; value: string }[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const handleHash = () => {
    const hashResults = [
      { type: 'MD5', value: CryptoJS.MD5(input).toString() },
      { type: 'SHA-1', value: CryptoJS.SHA1(input).toString() },
      { type: 'SHA-256', value: CryptoJS.SHA256(input).toString() },
      { type: 'SHA-512', value: CryptoJS.SHA512(input).toString() },
    ];
    setResults(hashResults);
  };

  const handleCopy = async (value: string, type: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClear = () => {
    setInput('');
    setResults([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Hash className="w-5 h-5 text-primary-500" />
        <h2 className="text-lg font-semibold text-slate-800">哈希计算</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">输入文本</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入要计算哈希的文本..."
          className="w-full h-32 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleHash}
          disabled={!input}
          className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 text-white rounded-lg transition-colors font-medium"
        >
          计算哈希
        </button>
        <button
          onClick={handleClear}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title="清空"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((result) => (
            <div key={result.type} className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">{result.type}</span>
                <button
                  onClick={() => handleCopy(result.value, result.type)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-primary-500 transition-colors"
                >
                  {copied === result.type ? (
                    <>
                      <Check size={14} className="text-green-500" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      复制
                    </>
                  )}
                </button>
              </div>
              <code className="block text-xs font-mono text-slate-800 break-all">
                {result.value}
              </code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
