import { useState, useEffect } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';

export default function BaseConverter() {
  const [input, setInput] = useState('');
  const [inputBase, setInputBase] = useState<number>(10);
  const [output, setOutput] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');

  const bases = [
    { value: 2, label: '二进制', prefix: '0b' },
    { value: 8, label: '八进制', prefix: '0o' },
    { value: 10, label: '十进制', prefix: '' },
    { value: 16, label: '十六进制', prefix: '0x' },
    { value: 32, label: '三十二进制', prefix: '0v' },
  ];

  // 实时转换
  useEffect(() => {
    handleConvert();
  }, [input, inputBase]);

  const charSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const parseToBigInt = (value: string, base: number): bigint => {
    const cleanValue = value.trim().toUpperCase();
    if (!cleanValue) return BigInt(0);

    // 移除前缀
    let processedValue = cleanValue;
    if (base === 16 && processedValue.startsWith('0X')) {
      processedValue = processedValue.slice(2);
    } else if (base === 8 && processedValue.startsWith('0O')) {
      processedValue = processedValue.slice(2);
    } else if (base === 2 && processedValue.startsWith('0B')) {
      processedValue = processedValue.slice(2);
    } else if (base === 32 && processedValue.startsWith('0V')) {
      processedValue = processedValue.slice(2);
    }

    let result = BigInt(0);
    const baseBig = BigInt(base);

    for (const char of processedValue) {
      const digitValue = charSet.indexOf(char);
      if (digitValue === -1 || digitValue >= base) {
        throw new Error(`无效的 ${base} 进制字符: ${char}`);
      }
      result = result * baseBig + BigInt(digitValue);
    }

    return result;
  };

  const bigIntToString = (value: bigint, base: number): string => {
    if (value === BigInt(0)) return '0';

    let result = '';
    const baseBig = BigInt(base);
    let remaining = value < BigInt(0) ? -value : value;

    while (remaining > 0) {
      const remainder = Number(remaining % baseBig);
      result = charSet[remainder] + result;
      remaining = remaining / baseBig;
    }

    return value < BigInt(0) ? '-' + result : result;
  };

  const handleConvert = () => {
    setError('');
    const cleanInput = input.trim();

    if (!cleanInput) {
      setOutput({
        binary: '',
        octal: '',
        decimal: '',
        hex: '',
        base32: ''
      });
      return;
    }

    try {
      const decimal = parseToBigInt(cleanInput, inputBase);

      setOutput({
        binary: bigIntToString(decimal, 2),
        octal: bigIntToString(decimal, 8),
        decimal: bigIntToString(decimal, 10),
        hex: bigIntToString(decimal, 16),
        base32: bigIntToString(decimal, 32)
      });
    } catch (e) {
      setError((e as Error).message);
      setOutput({
        binary: '',
        octal: '',
        decimal: '',
        hex: '',
        base32: ''
      });
    }
  };

  const handleCopy = async (field: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput({
      binary: '',
      octal: '',
      decimal: '',
      hex: '',
      base32: ''
    });
    setError('');
  };

  const outputMap: Record<number, string> = {
    2: output.binary,
    8: output.octal,
    10: output.decimal,
    16: output.hex,
    32: output.base32,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">进制转换器</h2>
        <span className="text-xs text-slate-500">实时转换</span>
      </div>

      <div className="bg-slate-50 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <select
            value={inputBase}
            onChange={(e) => setInputBase(Number(e.target.value))}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {bases.map(b => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入数值..."
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
          />
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bases.map(base => (
          <div key={base.value} className={`bg-slate-50 rounded-xl p-4 ${inputBase === base.value ? 'ring-2 ring-primary-200' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-600">
                {base.label} {base.prefix && `(${base.prefix})`}
              </label>
              <button
                onClick={() => handleCopy(base.label, outputMap[base.value] || '')}
                disabled={!outputMap[base.value]}
                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
              >
                {copied === base.label ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
            <div className="font-mono text-sm break-all min-h-[40px] p-2 bg-white rounded-lg border border-slate-200">
              {outputMap[base.value] || '-'}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleClear}
          className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Trash2 size={18} />
          清空
        </button>
      </div>

      <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
        <div className="font-medium mb-1">说明：</div>
        <ul className="list-disc list-inside space-y-0.5">
          <li>支持大数计算，无精度限制</li>
          <li>输入即转换，无需点击按钮</li>
          <li>三十二进制使用 0-9 和 A-V 共 32 个字符</li>
        </ul>
      </div>
    </div>
  );
}
