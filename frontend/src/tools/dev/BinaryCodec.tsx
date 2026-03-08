import { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';

export default function BinaryCodec() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<{
    original: string;
    onesComplement: string;
    twosComplement: string;
  } | null>(null);
  const [bits, setBits] = useState<8 | 16 | 32>(8);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    const num = parseInt(input);

    if (isNaN(num)) {
      setError('请输入有效的整数');
      setOutput(null);
      return;
    }

    const maxVal = Math.pow(2, bits - 1) - 1;
    const minVal = -Math.pow(2, bits - 1);

    if (num > maxVal || num < minVal) {
      setError(`数值超出 ${bits} 位有符号整数范围 (${minVal} ~ ${maxVal})`);
      setOutput(null);
      return;
    }

    // Original code (原码): sign bit + absolute value
    const signBit = num < 0 ? '1' : '0';
    const absBinary = Math.abs(num).toString(2).padStart(bits - 1, '0');
    const original = signBit + absBinary;

    // One's complement (反码)
    let onesComplement: string;
    if (num >= 0) {
      onesComplement = original;
    } else {
      onesComplement = signBit + absBinary.split('').map(b => b === '0' ? '1' : '0').join('');
    }

    // Two's complement (补码)
    let twosComplement: string;
    if (num >= 0) {
      twosComplement = original;
    } else {
      // Add 1 to one's complement
      const ones = onesComplement.slice(1);
      let carry = 1;
      let result = '';
      for (let i = ones.length - 1; i >= 0; i--) {
        const sum = parseInt(ones[i]) + carry;
        result = (sum % 2) + result;
        carry = Math.floor(sum / 2);
      }
      twosComplement = signBit + result;
    }

    setOutput({
      original,
      onesComplement,
      twosComplement,
    });
  };

  const handleCopy = async (field: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput(null);
    setError('');
  };

  const formatBinary = (binary: string) => {
    return binary.match(/.{1,4}/g)?.join(' ') || binary;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">原码/反码/补码</h2>
        <div className="flex items-center gap-2">
          {[8, 16, 32].map(b => (
            <button
              key={b}
              onClick={() => setBits(b as 8 | 16 | 32)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                bits === b ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {b} 位
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">
          输入整数 ({bits === 8 ? '-128 ~ 127' : bits === 16 ? '-32768 ~ 32767' : '-2147483648 ~ 2147483647'})
        </label>
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="例如: -5"
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {output && (
        <div className="space-y-3">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-600">原码</label>
              <button
                onClick={() => handleCopy('original', output.original)}
                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
              >
                {copied === 'original' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="font-mono text-sm break-all">
              {formatBinary(output.original)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              符号位 + 绝对值二进制
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-600">反码</label>
              <button
                onClick={() => handleCopy('ones', output.onesComplement)}
                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
              >
                {copied === 'ones' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="font-mono text-sm break-all">
              {formatBinary(output.onesComplement)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              正数同原码，负数符号位不变其余取反
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-600">补码</label>
              <button
                onClick={() => handleCopy('twos', output.twosComplement)}
                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
              >
                {copied === 'twos' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="font-mono text-sm break-all">
              {formatBinary(output.twosComplement)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              正数同原码，负数反码 + 1
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={calculate}
          disabled={!input}
          className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 text-white rounded-lg transition-colors font-medium"
        >
          计算
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
