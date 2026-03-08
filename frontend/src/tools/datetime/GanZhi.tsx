import { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';

export default function GanZhi() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [result, setResult] = useState<{
    ganZhiYear: string;
    tianGan: string;
    diZhi: string;
    zodiac: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

  const calculate = () => {
    const y = parseInt(year);
    if (isNaN(y) || y < 1) return;

    // 天干：(年份 - 3) % 10
    // 地支：(年份 - 3) % 12
    // 注：公元4年为甲子年
    const ganIndex = (y - 4) % 10;
    const zhiIndex = (y - 4) % 12;

    // 处理负数情况
    const gan = tianGan[ganIndex < 0 ? ganIndex + 10 : ganIndex];
    const zhi = diZhi[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex];
    const zodiac = zodiacs[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex];

    setResult({
      ganZhiYear: gan + zhi,
      tianGan: gan,
      diZhi: zhi,
      zodiac,
    });
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`${year}年是${result.ganZhiYear}年（${result.zodiac}年）`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setResult(null);
  };

  // Generate 60-year cycle
  const get60YearCycle = () => {
    const cycle: string[] = [];
    for (let i = 0; i < 60; i++) {
      cycle.push(tianGan[i % 10] + diZhi[i % 12]);
    }
    return cycle;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">天干地支计算器</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">年份</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="输入年份"
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {result && (
        <div className="bg-slate-50 rounded-xl p-6 text-center">
          <div className="text-5xl font-bold text-primary-500 mb-2">{result.ganZhiYear}</div>
          <div className="text-lg text-slate-600">{year}年 · {result.zodiac}年</div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded-lg p-3 border border-slate-200">
              <div className="text-slate-500">天干</div>
              <div className="text-xl font-bold text-slate-800">{result.tianGan}</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-slate-200">
              <div className="text-slate-500">地支</div>
              <div className="text-xl font-bold text-slate-800">{result.diZhi}</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={calculate}
          disabled={!year}
          className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 text-white rounded-lg transition-colors font-medium"
        >
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

      {/* 60 Year Cycle Reference */}
      <div className="bg-slate-50 rounded-xl p-4">
        <div className="text-sm font-medium text-slate-600 mb-2">六十甲子</div>
        <div className="grid grid-cols-10 gap-1 text-xs">
          {get60YearCycle().map((ganzhi, i) => (
            <div
              key={i}
              className={`text-center p-1 rounded ${
                result?.ganZhiYear === ganzhi
                  ? 'bg-primary-500 text-white font-bold'
                  : 'bg-white text-slate-600'
              }`}
            >
              {ganzhi}
            </div>
          ))}
        </div>
      </div>

      {/* Reference tables */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="text-sm font-medium text-slate-600 mb-2">十天干</div>
          <div className="flex flex-wrap gap-2">
            {tianGan.map((g, i) => (
              <div key={i} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-slate-200 text-sm">
                {g}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="text-sm font-medium text-slate-600 mb-2">十二地支</div>
          <div className="flex flex-wrap gap-2">
            {diZhi.map((z, i) => (
              <div key={i} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-slate-200 text-sm">
                {z}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
