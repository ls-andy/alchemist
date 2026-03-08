import { useState } from 'react';
import { Copy, Check, Trash2, RefreshCw } from 'lucide-react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [passwords, setPasswords] = useState<string[]>([]);
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(1);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false
  });
  const [copied, setCopied] = useState<number | null>(null);

  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  const generateSinglePassword = () => {
    let chars = '';
    if (options.uppercase) chars += charSets.uppercase;
    if (options.lowercase) chars += charSets.lowercase;
    if (options.numbers) chars += charSets.numbers;
    if (options.symbols) chars += charSets.symbols;

    if (!chars) return '';

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    return result;
  };

  const generatePassword = () => {
    if (count === 1) {
      setPassword(generateSinglePassword());
      setPasswords([]);
    } else {
      const newPasswords: string[] = [];
      for (let i = 0; i < Math.min(count, 100); i++) {
        newPasswords.push(generateSinglePassword());
      }
      setPasswords(newPasswords);
      setPassword('');
    }
  };

  const handleCopy = async (index?: number) => {
    const text = index !== undefined ? passwords[index] : password;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(index ?? -1);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyAll = async () => {
    const allPasswords = passwords.length > 0 ? passwords.join('\n') : password;
    if (!allPasswords) return;
    await navigator.clipboard.writeText(allPasswords);
    setCopied(-2);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClear = () => {
    setPassword('');
    setPasswords([]);
  };

  const handleOptionChange = (key: keyof typeof options) => {
    const newOptions = { ...options, [key]: !options[key] };
    if (Object.values(newOptions).some(v => v)) {
      setOptions(newOptions);
    }
  };

  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 16) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { label: '弱', color: 'bg-red-500' };
    if (score <= 4) return { label: '中等', color: 'bg-yellow-500' };
    if (score <= 5) return { label: '强', color: 'bg-green-500' };
    return { label: '非常强', color: 'bg-green-600' };
  };

  const strength = password ? getStrength(password) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">密码生成器</h2>
      </div>

      {/* Generated Password(s) */}
      <div className="bg-slate-50 rounded-xl p-4">
        {passwords.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {passwords.map((pwd, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1 font-mono text-sm break-all p-2 bg-white rounded-lg border border-slate-200">
                  {pwd}
                </div>
                <button
                  onClick={() => handleCopy(index)}
                  className="p-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
                  title="复制"
                >
                  {copied === index ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1 font-mono text-lg break-all min-h-[48px] p-3 bg-white rounded-lg border border-slate-200">
              {password || <span className="text-slate-400">点击生成密码</span>}
            </div>
            <button
              onClick={() => handleCopy()}
              disabled={!password}
              className="p-3 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 rounded-lg transition-colors"
              title="复制"
            >
              {copied === -1 ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
            </button>
          </div>
        )}
        {strength && passwords.length === 0 && (
          <div className="mt-2 flex items-center gap-2">
            <div className={`h-2 flex-1 rounded-full ${strength.color}`}></div>
            <span className="text-sm text-slate-600">{strength.label}</span>
          </div>
        )}
        {passwords.length > 0 && (
          <div className="mt-2 text-sm text-slate-500">
            已生成 {passwords.length} 个密码
            <button
              onClick={handleCopyAll}
              className="ml-2 text-primary-500 hover:text-primary-600"
            >
              复制全部
            </button>
          </div>
        )}
      </div>

      {/* Length Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-600">密码长度</label>
          <span className="text-sm font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
            {length}
          </span>
        </div>
        <input
          type="range"
          min="4"
          max="64"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
      </div>

      {/* Count */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-600">生成数量</label>
          <span className="text-sm font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
            {count}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: 'uppercase', label: '大写字母 (A-Z)' },
          { key: 'lowercase', label: '小写字母 (a-z)' },
          { key: 'numbers', label: '数字 (0-9)' },
          { key: 'symbols', label: '特殊符号 (!@#$...)' }
        ].map(opt => (
          <label
            key={opt.key}
            className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <input
              type="checkbox"
              checked={options[opt.key as keyof typeof options]}
              onChange={() => handleOptionChange(opt.key as keyof typeof options)}
              className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700">{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={generatePassword}
          className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} />
          生成密码
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
