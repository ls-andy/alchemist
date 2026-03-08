import { useState, useEffect } from 'react';
import { Copy, Check, ArrowDownUp, Clock } from 'lucide-react';

export default function TimestampTool() {
  const [timestamp, setTimestamp] = useState('');
  const [timestampUnit, setTimestampUnit] = useState<'s' | 'ms'>('s');
  const [datetime, setDatetime] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 时间戳转日期（自动检测秒/毫秒）
  const timestampToDate = (ts: string) => {
    const num = parseInt(ts);
    if (isNaN(num)) return '';
    
    // 自动检测：如果时间戳小于 10000000000，认为是秒级
    const ms = num < 10000000000 ? num * 1000 : num;
    const date = new Date(ms);
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

  // 日期转时间戳
  const dateToTimestamp = (dt: string) => {
    const date = new Date(dt);
    if (isNaN(date.getTime())) return '';
    const ms = date.getTime();
    return timestampUnit === 's' ? Math.floor(ms / 1000).toString() : ms.toString();
  };

  const handleTimestampChange = (value: string) => {
    setTimestamp(value);
    if (value) {
      setDatetime(timestampToDate(value));
      // 自动检测单位
      const num = parseInt(value);
      if (num > 0) {
        setTimestampUnit(num < 10000000000 ? 's' : 'ms');
      }
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
    const now = Date.now();
    const ts = timestampUnit === 's' ? Math.floor(now / 1000).toString() : now.toString();
    setTimestamp(ts);
    setDatetime(timestampToDate(ts));
  };

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('zh-CN');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary-500" />
        <h2 className="text-lg font-semibold text-slate-800">时间戳转换</h2>
      </div>

      {/* 当前时间 */}
      <div className="p-4 bg-primary-50 rounded-xl">
        <div className="text-sm text-slate-600 mb-2">当前时间</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-500 mb-1">秒级时间戳</div>
            <div className="text-xl font-mono font-bold text-primary-600">
              {Math.floor(currentTime / 1000)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">毫秒级时间戳</div>
            <div className="text-xl font-mono font-bold text-primary-600">
              {currentTime}
            </div>
          </div>
        </div>
        <div className="text-sm text-slate-500 mt-3 pt-3 border-t border-primary-200">
          {new Date(currentTime).toLocaleString('zh-CN')}
        </div>
        <button
          onClick={handleNow}
          className="mt-3 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm transition-colors"
        >
          使用当前时间
        </button>
      </div>

      {/* 转换区域 */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-600">Unix 时间戳</label>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setTimestampUnit('s');
                  if (timestamp) {
                    const num = parseInt(timestamp);
                    if (num > 10000000000) {
                      const newTs = Math.floor(num / 1000).toString();
                      setTimestamp(newTs);
                    }
                  }
                }}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  timestampUnit === 's' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                秒 (s)
              </button>
              <button
                onClick={() => {
                  setTimestampUnit('ms');
                  if (timestamp) {
                    const num = parseInt(timestamp);
                    if (num < 10000000000) {
                      const newTs = (num * 1000).toString();
                      setTimestamp(newTs);
                    }
                  }
                }}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  timestampUnit === 'ms' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                毫秒 (ms)
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={timestamp}
              onChange={(e) => handleTimestampChange(e.target.value)}
              placeholder={timestampUnit === 's' ? "例如: 1709765432" : "例如: 1709765432123"}
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
          <div className="text-xs text-slate-400 mt-1">
            自动检测：输入秒级或毫秒级时间戳均可自动识别
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
          <div className="text-xs text-slate-400 mt-1">
            支持格式: 2024/03/07 18:30:00 或 2024-03-07T18:30:00
          </div>
        </div>
      </div>

      {/* 快捷时间 */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: '今天 00:00', ts: new Date(new Date().setHours(0, 0, 0, 0)).getTime() },
          { label: '昨天 00:00', ts: new Date(new Date().setHours(0, 0, 0, 0) - 86400000).getTime() },
          { label: '明天 00:00', ts: new Date(new Date().setHours(0, 0, 0, 0) + 86400000).getTime() },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => {
              const ts = timestampUnit === 's' ? Math.floor(item.ts / 1000).toString() : item.ts.toString();
              setTimestamp(ts);
              setDatetime(timestampToDate(ts));
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 时间戳信息 */}
      {timestamp && (
        <div className="p-4 bg-slate-50 rounded-xl space-y-2">
          <div className="text-sm font-medium text-slate-600">时间戳详情</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-500">秒级:</span>
              <code className="ml-2 font-mono text-slate-800">
                {formatNumber(parseInt(timestamp) < 10000000000 
                  ? parseInt(timestamp) 
                  : Math.floor(parseInt(timestamp) / 1000))}
              </code>
            </div>
            <div>
              <span className="text-slate-500">毫秒级:</span>
              <code className="ml-2 font-mono text-slate-800">
                {formatNumber(parseInt(timestamp) < 10000000000 
                  ? parseInt(timestamp) * 1000 
                  : parseInt(timestamp))}
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
