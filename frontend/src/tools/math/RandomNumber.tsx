import { useState } from 'react';
import { Copy, Check, Trash2, RefreshCw } from 'lucide-react';

export default function RandomNumber() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [allowDecimal, setAllowDecimal] = useState(false);
  const [allowRepeat, setAllowRepeat] = useState(true);
  const [results, setResults] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const minVal = parseFloat(min) || 0;
    const maxVal = parseFloat(max) || 100;
    const countVal = Math.min(parseInt(count) || 1, 1000);

    if (minVal > maxVal) {
      return;
    }

    const generated: number[] = [];
    const used = new Set<string>();

    for (let i = 0; i < countVal; i++) {
      let num: number;
      const key = () => allowDecimal ? num.toFixed(10) : num.toString();

      do {
        if (allowDecimal) {
          num = Math.random() * (maxVal - minVal) + minVal;
        } else {
          num = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
        }
      } while (!allowRepeat && used.has(key()) && used.size < (maxVal - minVal + 1) * (allowDecimal ? 1000 : 1));

      if (!allowRepeat) {
        used.add(key());
      }
      generated.push(num);
    }

    setResults(generated);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(results.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setResults([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">随机数生成器</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">最小值</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">最大值</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">生成个数</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            min="1"
            max="1000"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={allowDecimal}
            onChange={(e) => setAllowDecimal(e.target.checked)}
            className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-slate-700">允许小数</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={allowRepeat}
            onChange={(e) => setAllowRepeat(e.target.checked)}
            className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-slate-700">允许重复</span>
        </label>
      </div>

      {results.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="max-h-64 overflow-y-auto font-mono text-sm space-y-1">
            {results.map((n, i) => (
              <div key={i} className="px-2 py-1 hover:bg-slate-200 rounded">
                {allowDecimal ? n.toFixed(4) : n}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={generate}
          className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} />
          生成
        </button>
        <button
          onClick={handleCopy}
          disabled={results.length === 0}
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
