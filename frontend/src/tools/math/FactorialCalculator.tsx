import { useState, useEffect } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';

export default function FactorialCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [scientificNotation, setScientificNotation] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // 实时计算
  useEffect(() => {
    calculate();
  }, [input]);

  const calculate = () => {
    setError('');
    
    const cleanInput = input.trim();
    if (!cleanInput) {
      setResult(null);
      setScientificNotation(null);
      return;
    }

    try {
      const n = BigInt(cleanInput);

      if (n < 0n) {
        setError('阶乘只能计算非负整数');
        setResult(null);
        setScientificNotation(null);
        return;
      }

      if (n > 10000n) {
        setError('数值过大，请输入小于 10000 的数');
        setResult(null);
        setScientificNotation(null);
        return;
      }

      let factorial = 1n;
      for (let i = 2n; i <= n; i++) {
        factorial *= i;
      }

      setResult(factorial.toString());
      
      // 计算科学计数法
      if (factorial.toString().length > 10) {
        const sci = toScientificNotation(factorial.toString());
        setScientificNotation(sci);
      } else {
        setScientificNotation(null);
      }
    } catch {
      setError('请输入有效的整数');
      setResult(null);
      setScientificNotation(null);
    }
  };

  const toScientificNotation = (num: string): string => {
    if (num.length <= 10) return num;
    
    const exponent = num.length - 1;
    const mantissa = num[0] + '.' + num.slice(1, 6);
    return `${mantissa} × 10^${exponent}`;
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
    setScientificNotation(null);
    setError('');
  };

  const getDigitCount = (n: string) => {
    return n.length;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">阶乘计算器</h2>
        <span className="text-xs text-slate-500">实时计算</span>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">
          输入非负整数 (最大 10000)
        </label>
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="例如: 10"
          min="0"
          max="10000"
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">
              {input}! = <span className="text-primary-500">{getDigitCount(result)} 位数字</span>
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
              title="复制完整结果"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
          </div>
          
          {/* 科学计数法 */}
          {scientificNotation && (
            <div className="mb-2 p-2 bg-primary-50 rounded-lg text-primary-700 font-mono text-sm">
              ≈ {scientificNotation}
            </div>
          )}
          
          {/* 完整结果 */}
          <div className="font-mono text-sm break-all max-h-64 overflow-y-auto p-3 bg-white rounded-lg border border-slate-200">
            {result}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={handleClear}
          className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Trash2 size={18} />
          清空
        </button>
      </div>

      {/* Quick examples */}
      <div className="bg-slate-50 rounded-xl p-4">
        <div className="text-sm font-medium text-slate-600 mb-2">常用阶乘</div>
        <div className="grid grid-cols-4 gap-2 text-sm">
          {[
            { n: '0', v: '1' },
            { n: '1', v: '1' },
            { n: '5', v: '120' },
            { n: '10', v: '3,628,800' },
          ].map(item => (
            <button
              key={item.n}
              onClick={() => setInput(item.n)}
              className="text-center p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <div className="text-slate-500">{item.n}!</div>
              <div className="font-mono text-slate-800">{item.v}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
        <div className="font-medium mb-1">说明：</div>
        <ul className="list-disc list-inside space-y-0.5">
          <li>支持超大数计算（最大 10000!）</li>
          <li>结果超过 10 位时显示科学计数法</li>
          <li>输入即计算，无需点击按钮</li>
        </ul>
      </div>
    </div>
  );
}
