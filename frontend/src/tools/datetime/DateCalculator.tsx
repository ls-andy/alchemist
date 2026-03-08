import { useState } from 'react';
import { Copy, Check, Trash2, Calendar } from 'lucide-react';

export default function DateCalculator() {
  const [mode, setMode] = useState<'diff' | 'add'>('diff');
  const [date1, setDate1] = useState(new Date().toISOString().split('T')[0]);
  const [date2, setDate2] = useState('');
  const [addDays, setAddDays] = useState('0');
  const [addMonths, setAddMonths] = useState('0');
  const [addYears, setAddYears] = useState('0');
  const [result, setResult] = useState<{
    days?: number;
    weeks?: number;
    months?: number;
    years?: number;
    targetDate?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const calculateDiff = () => {
    if (!date1 || !date2) return;

    const d1 = new Date(date1);
    const d2 = new Date(date2);

    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);

    // Approximate months and years
    const months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
    const years = Math.abs(d2.getFullYear() - d1.getFullYear());

    setResult({
      days: diffDays,
      weeks: diffWeeks,
      months: Math.abs(months),
      years,
    });
  };

  const calculateAdd = () => {
    if (!date1) return;

    const d = new Date(date1);
    d.setDate(d.getDate() + parseInt(addDays || '0'));
    d.setMonth(d.getMonth() + parseInt(addMonths || '0'));
    d.setFullYear(d.getFullYear() + parseInt(addYears || '0'));

    setResult({
      targetDate: d.toISOString().split('T')[0],
    });
  };

  const handleCalculate = () => {
    if (mode === 'diff') {
      calculateDiff();
    } else {
      calculateAdd();
    }
  };

  const handleCopy = async () => {
    if (!result) return;

    let text = '';
    if (mode === 'diff') {
      text = `相差 ${result.days} 天 / ${result.weeks} 周 / ${result.months} 月 / ${result.years} 年`;
    } else {
      text = `目标日期: ${result.targetDate}`;
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setResult(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">日期计算器</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('diff')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              mode === 'diff' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            日期差值
          </button>
          <button
            onClick={() => setMode('add')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              mode === 'add' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            日期加减
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">起始日期</label>
          <input
            type="date"
            value={date1}
            onChange={(e) => setDate1(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {mode === 'diff' ? (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">结束日期</label>
            <input
              type="date"
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">天数</label>
              <input
                type="number"
                value={addDays}
                onChange={(e) => setAddDays(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">月数</label>
              <input
                type="number"
                value={addMonths}
                onChange={(e) => setAddMonths(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">年数</label>
              <input
                type="number"
                value={addYears}
                onChange={(e) => setAddYears(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="bg-slate-50 rounded-xl p-6 text-center">
          {mode === 'diff' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-3xl font-bold text-primary-500">{result.days}</div>
                <div className="text-sm text-slate-600">天</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-500">{result.weeks}</div>
                <div className="text-sm text-slate-600">周</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-500">{result.months}</div>
                <div className="text-sm text-slate-600">月</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-500">{result.years}</div>
                <div className="text-sm text-slate-600">年</div>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-3xl font-bold text-primary-500">{result.targetDate}</div>
              <div className="text-sm text-slate-600 mt-2">
                {new Date(result.targetDate!).toLocaleDateString('zh-CN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={handleCalculate}
          disabled={mode === 'diff' ? !date1 || !date2 : !date1}
          className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Calendar size={18} />
          计算
        </button>
        <button
          onClick={handleCopy}
          disabled={!result}
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
