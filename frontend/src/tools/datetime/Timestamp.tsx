import { useState, useEffect } from 'react';
import { Copy, Check, ArrowDownUp, Clock } from 'lucide-react';

export default function TimestampTool() {
  const [timestamp, setTimestamp] = useState('');
  const [datetime, setDatetime] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timestampToDate = (ts: string) => {
    const num = parseInt(ts);
    if (isNaN(num)) return '';
    const date = new Date(num * 1000);
    return date.toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  const dateToTimestamp = (dt: string) => {
    const date = new Date(dt);
    if (isNaN(date.getTime())) return '';
    return Math.floor(date.getTime() / 1000).toString();
  };

  const handleTimestampChange = (value: string) => {
    setTimestamp(value);
    if (value) {
      setDatetime(timestampToDate(value));
    } else {
      setDatetime('');
    }
  };

  const handleDatetimeChange = (value: string) => {
    setDatetime(value);
    if (value) {
      setTimestamp(dateToTimestamp(value));
    } else {
      setTimestamp('');
    }
  };

  const handleNow = () => {
    const ts = Math.floor(Date.now() / 1000).toString();
    setTimestamp(ts);
    setDatetime(timestampToDate(ts));
  };

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary-500" />
        <h2 className="text-lg font-semibold text-slate-800">时间戳转换</h2>
      </div>

      {/* 当前时间 */}
      <div className="p-4 bg-primary-50 rounded-xl">
        <div className="text-sm text-slate-600 mb-1">当前时间</div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-mono font-bold text-primary-600">
            {Math.floor(currentTime / 1000)}
          </div>
          <button
            onClick={handleNow}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm transition-colors"
          >
            使用当前时间
          </button>
        </div>
        <div className="text-sm text-slate-500 mt-1">
          {new Date(currentTime).toLocaleString('zh-CN')}
        </div>
      </div>

      {/* 转换区域 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Unix 时间戳（秒）</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={timestamp}
              onChange={(e) => handleTimestampChange(e.target.value)}
              placeholder="例如: 1709765432"
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
            />
            <button
              onClick={() => handleCopy(timestamp)}
              disabled={!timestamp}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-xl transition-colors"
            >
              {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowDownUp className="w-5 h-5 text-slate-400" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">日期时间</label>
          <input
            type="text"
            value={datetime}
            onChange={(e) => handleDatetimeChange(e.target.value)}
            placeholder="例如: 2024/03/07 18:30:00"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
          />
        </div>
      </div>

      {/* 快捷时间 */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: '今天 00:00', ts: new Date(new Date().setHours(0, 0, 0, 0)).getTime() / 1000 },
          { label: '昨天 00:00', ts: new Date(new Date().setHours(0, 0, 0, 0) - 86400000).getTime() / 1000 },
          { label: '明天 00:00', ts: new Date(new Date().setHours(0, 0, 0, 0) + 86400000).getTime() / 1000 },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => {
              setTimestamp(Math.floor(item.ts).toString());
              setDatetime(timestampToDate(Math.floor(item.ts).toString()));
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
