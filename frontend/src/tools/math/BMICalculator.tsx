import { useState, useEffect } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';

export default function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<{
    bmi: number;
    category: string;
    color: string;
    healthyRange: { min: number; max: number };
    advice: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // 实时计算
  useEffect(() => {
    calculate();
  }, [height, weight, unit]);

  // 亚洲 BMI 标准
  const getAsianCategory = (bmi: number): { category: string; color: string; advice: string } => {
    if (bmi < 18.5) {
      return {
        category: '体重过轻',
        color: 'text-blue-500',
        advice: '建议适当增加营养摄入，多吃富含蛋白质的食物，配合适量运动增强体质。如持续消瘦建议咨询医生。'
      };
    } else if (bmi < 23) {
      return {
        category: '正常体重',
        color: 'text-green-500',
        advice: '恭喜！您的体重在健康范围内。继续保持均衡饮食和规律运动，维持健康体重。'
      };
    } else if (bmi < 25) {
      return {
        category: '超重前期',
        color: 'text-yellow-500',
        advice: '体重略有超标，建议控制饮食热量，增加蔬菜水果摄入，每周进行 150 分钟中等强度运动。'
      };
    } else if (bmi < 30) {
      return {
        category: '超重',
        color: 'text-orange-500',
        advice: '体重超标较多，建议减少高热量食物摄入，避免久坐，每天进行 30 分钟以上有氧运动，必要时咨询营养师。'
      };
    } else {
      return {
        category: '肥胖',
        color: 'text-red-500',
        advice: '体重严重超标，可能增加心血管疾病、糖尿病等风险。建议尽快咨询医生或营养师，制定科学的减重计划。'
      };
    }
  };

  const calculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || !w || h <= 0 || w <= 0) {
      setResult(null);
      return;
    }

    let bmi: number;
    let heightInMeters: number;

    if (unit === 'metric') {
      heightInMeters = h / 100;
      bmi = w / (heightInMeters * heightInMeters);
    } else {
      bmi = (w / (h * h)) * 703;
      heightInMeters = h * 0.0254;
    }

    const { category, color, advice } = getAsianCategory(bmi);

    // Healthy weight range (BMI 18.5 - 23 for Asian standard)
    const healthyMin = 18.5 * heightInMeters * heightInMeters;
    const healthyMax = 23 * heightInMeters * heightInMeters;

    setResult({
      bmi: Math.round(bmi * 10) / 10,
      category,
      color,
      healthyRange: { min: Math.round(healthyMin * 10) / 10, max: Math.round(healthyMax * 10) / 10 },
      advice
    });
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`BMI: ${result.bmi} (${result.category})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setHeight('');
    setWeight('');
    setResult(null);
  };

  const getBMIPosition = (bmi: number) => {
    // Scale: 15 to 35 maps to 0% to 100%
    const position = Math.min(Math.max((bmi - 15) / 20 * 100, 0), 100);
    return position;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">BMI 计算器</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUnit('metric')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              unit === 'metric' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            公制
          </button>
          <button
            onClick={() => setUnit('imperial')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              unit === 'imperial' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            英制
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            {unit === 'metric' ? '身高 (厘米)' : '身高 (英寸)'}
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unit === 'metric' ? '例如: 175' : '例如: 69'}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            {unit === 'metric' ? '体重 (公斤)' : '体重 (磅)'}
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === 'metric' ? '例如: 70' : '例如: 154'}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {result && (
        <div className="bg-slate-50 rounded-xl p-6 text-center">
          <div className="text-5xl font-bold text-slate-800 mb-2">{result.bmi}</div>
          <div className={`text-xl font-medium ${result.color}`}>{result.category}</div>

          {/* BMI Scale */}
          <div className="mt-4">
            <div className="relative h-3 rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 via-orange-400 to-red-400">
              <div
                className="absolute top-0 w-1 h-3 bg-slate-800 rounded"
                style={{ left: `${getBMIPosition(result.bmi)}%`, transform: 'translateX(-50%)' }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>15</span>
              <span>18.5</span>
              <span>23</span>
              <span>25</span>
              <span>30</span>
              <span>35</span>
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-600">
            健康体重范围: {result.healthyRange.min} - {result.healthyRange.max} {unit === 'metric' ? '公斤' : '磅'}
          </div>

          {/* 健康建议 */}
          <div className="mt-4 p-3 bg-white rounded-lg text-left text-sm text-slate-600 border border-slate-200">
            <div className="font-medium text-slate-700 mb-1">💡 健康建议</div>
            {result.advice}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
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

      <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
        <div className="font-medium mb-1">亚洲 BMI 标准：</div>
        <ul className="list-disc list-inside space-y-0.5">
          <li>体重过轻：BMI &lt; 18.5</li>
          <li>正常体重：18.5 ≤ BMI &lt; 23</li>
          <li>超重前期：23 ≤ BMI &lt; 25</li>
          <li>超重：25 ≤ BMI &lt; 30</li>
          <li>肥胖：BMI ≥ 30</li>
        </ul>
      </div>
    </div>
  );
}
