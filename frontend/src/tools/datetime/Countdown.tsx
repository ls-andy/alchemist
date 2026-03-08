import { useState, useEffect } from 'react';
import { Copy, Check, Trash2, Play, Pause, RotateCcw } from 'lucide-react';

export default function Countdown() {
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('00:00');
  const [title, setTitle] = useState('');
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isRunning || !targetDate) return;

    const interval = setInterval(() => {
      const target = new Date(`${targetDate}T${targetTime}`).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        setIsRunning(false);
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        total: diff,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, targetDate, targetTime]);

  const start = () => {
    if (!targetDate) return;
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setCountdown(null);
  };

  const handleCopy = async () => {
    if (!countdown) return;
    const text = `${title || '倒计时'}: ${countdown.days}天 ${countdown.hours}小时 ${countdown.minutes}分钟 ${countdown.seconds}秒`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    reset();
    setTargetDate('');
    setTargetTime('00:00');
    setTitle('');
  };

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTargetDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">倒计时生成器</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">目标日期</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">目标时间</label>
          <input
            type="time"
            value={targetTime}
            onChange={(e) => setTargetTime(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">事件名称（可选）</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例如：新年倒计时"
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {countdown && (
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white text-center">
          {title && <div className="text-lg mb-4 opacity-90">{title}</div>}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-4xl font-bold">{countdown.days}</div>
              <div className="text-sm opacity-75">天</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{countdown.hours}</div>
              <div className="text-sm opacity-75">时</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{countdown.minutes}</div>
              <div className="text-sm opacity-75">分</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{countdown.seconds}</div>
              <div className="text-sm opacity-75">秒</div>
            </div>
          </div>
          {countdown.total <= 0 && (
            <div className="mt-4 text-xl font-bold">时间到！</div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        {!isRunning ? (
          <button
            onClick={start}
            disabled={!targetDate}
            className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Play size={18} />
            开始
          </button>
        ) : (
          <button
            onClick={pause}
            className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Pause size={18} />
            暂停
          </button>
        )}
        <button
          onClick={reset}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title="重置"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={handleCopy}
          disabled={!countdown}
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
