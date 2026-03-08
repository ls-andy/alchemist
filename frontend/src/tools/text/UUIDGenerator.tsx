import { useState } from 'react';
import { Copy, Check, Trash2, RefreshCw } from 'lucide-react';

export default function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [version, setVersion] = useState<'v1' | 'v4'>('v4');
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [copied, setCopied] = useState<number | null>(null);

  const generateUUIDv4 = () => {
    // Use crypto API for better randomness
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);

    // Set version (4) and variant bits
    array[6] = (array[6] & 0x0f) | 0x40;
    array[8] = (array[8] & 0x3f) | 0x80;

    const hex = Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
    return hex;
  };

  const generateUUIDv1 = () => {
    // Simplified v1 - timestamp based
    const now = Date.now();
    const timestamp = now.toString(16).padStart(12, '0');
    const random = crypto.getRandomValues(new Uint8Array(8));
    const hex = timestamp + Array.from(random, b => b.toString(16).padStart(2, '0')).join('');
    return hex;
  };

  const formatUUID = (hex: string) => {
    let uuid = hex;
    if (uppercase) uuid = uuid.toUpperCase();
    if (hyphens) {
      uuid = `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
    }
    return uuid;
  };

  const generate = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      const hex = version === 'v4' ? generateUUIDv4() : generateUUIDv1();
      newUuids.push(formatUUID(hex));
    }
    setUuids(newUuids);
  };

  const handleCopy = async (index: number, uuid: string) => {
    await navigator.clipboard.writeText(uuid);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(-1);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClear = () => {
    setUuids([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">UUID 生成器</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">生成数量</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.min(Math.max(1, parseInt(e.target.value) || 1), 100))}
            min="1"
            max="100"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">版本</label>
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value as 'v1' | 'v4')}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="v4">UUID v4 (随机)</option>
            <option value="v1">UUID v1 (时间戳)</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer py-2">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700">大写</span>
          </label>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer py-2">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700">包含连字符</span>
          </label>
        </div>
      </div>

      {uuids.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="max-h-64 overflow-y-auto space-y-2">
            {uuids.map((uuid, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm text-slate-500 w-8">{i + 1}.</span>
                <code className="flex-1 font-mono text-sm bg-white px-3 py-2 rounded-lg border border-slate-200 break-all">
                  {uuid}
                </code>
                <button
                  onClick={() => handleCopy(i, uuid)}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  {copied === i ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
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
          生成 UUID
        </button>
        <button
          onClick={handleCopyAll}
          disabled={uuids.length === 0}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg transition-colors font-medium"
        >
          {copied === -1 ? <Check size={18} className="text-green-500" /> : '复制全部'}
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
