import { useState, useEffect } from 'react';
import { ArrowDownUp, Copy, Check, Trash2 } from 'lucide-react';

type OutputMode = 'traditional' | 'simple' | 'amount';

export default function Number2Chinese() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'toChinese' | 'toNumber'>('toChinese');
  const [outputMode, setOutputMode] = useState<OutputMode>('traditional');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // 实时转换
  useEffect(() => {
    handleConvert();
  }, [input, mode, outputMode]);

  // 繁体大写（金额用）
  const traditionalDigits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  // 简体小写
  const simpleDigits = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  // 单位
  const traditionalUnits = ['', '拾', '佰', '仟'];
  const simpleUnits = ['', '十', '百', '千'];
  const traditionalBigUnits = ['', '万', '亿', '兆', '京', '垓'];
  const simpleBigUnits = ['', '万', '亿', '兆', '京', '垓'];
  const getDigits = () => outputMode === 'simple' ? simpleDigits : traditionalDigits;
  const getUnits = () => outputMode === 'simple' ? simpleUnits : traditionalUnits;
  const getBigUnits = () => outputMode === 'simple' ? simpleBigUnits : traditionalBigUnits;

  const numberToChinese = (num: string) => {
    // 金额模式
    if (outputMode === 'amount') {
      return numberToAmount(num);
    }

    const isNegative = num.startsWith('-');
    if (isNegative) num = num.slice(1);

    // Handle decimal
    if (num.includes('.')) {
      const [integer, decimal] = num.split('.');
      const intChinese = integerPartToChinese(integer);
      const digits = getDigits();
      const decChinese = decimal.split('').map(d => digits[parseInt(d)]).join('');
      return (isNegative ? '负' : '') + intChinese + '点' + decChinese;
    }

    return (isNegative ? '负' : '') + integerPartToChinese(num);
  };

  const integerPartToChinese = (num: string) => {
    if (num === '0' || num === '') return getDigits()[0];

    const digits = getDigits();
    const units = getUnits();
    const bigUnits = getBigUnits();

    let result = '';

    // Process from right to left in groups of 4
    const groups: string[] = [];
    let temp = num;
    while (temp.length > 0) {
      groups.unshift(temp.slice(-4));
      temp = temp.slice(0, -4);
    }

    groups.forEach((group, groupIndex) => {
      let groupResult = '';
      let groupZeroFlag = false;

      for (let i = 0; i < group.length; i++) {
        const digit = parseInt(group[i]);
        const unitIndex = group.length - 1 - i;

        if (digit === 0) {
          groupZeroFlag = true;
        } else {
          if (groupZeroFlag) {
            groupResult += digits[0];
            groupZeroFlag = false;
          }
          groupResult += digits[digit] + units[unitIndex];
        }
      }

      if (groupResult) {
        result += groupResult + bigUnits[groups.length - 1 - groupIndex];
      } else if (result && groupIndex < groups.length - 1) {
        result += digits[0];
      }
    });

    // 清理多余的零
    result = result.replace(new RegExp(`${digits[0]}+`, 'g'), digits[0]);
    result = result.replace(new RegExp(`${digits[0]}$`), '');

    // 简体模式特殊处理：一十开头简化为十
    if (outputMode === 'simple' && result.startsWith('一十')) {
      result = result.slice(1);
    }

    return result || digits[0];
  };

  const numberToAmount = (num: string) => {
    const isNegative = num.startsWith('-');
    if (isNegative) num = num.slice(1);

    // 移除前导零
    num = num.replace(/^0+/, '');
    if (!num || num === '.') return '零元整';

    // 处理小数
    let integerPart = '';
    let decimalPart = '';

    if (num.includes('.')) {
      const parts = num.split('.');
      integerPart = parts[0] || '0';
      decimalPart = parts[1].padEnd(2, '0').slice(0, 2);
    } else {
      integerPart = num;
      decimalPart = '00';
    }

    // 移除整数部分前导零
    integerPart = integerPart.replace(/^0+/, '') || '0';

    let result = '';

    // 处理整数部分（从右往左）
    const intDigits = integerPart.split('').reverse();
    for (let i = 0; i < intDigits.length; i++) {
      const digit = parseInt(intDigits[i]);
      const unitIndex = i + 2; // 从"元"开始（索引2）

      if (digit === 0) {
        // 零只在特定位置添加
        if (unitIndex === 2) {
          // 元位
        } else if (unitIndex === 6 || unitIndex === 10) {
          // 万、亿位
          result = traditionalBigUnits[Math.floor(unitIndex / 4)] + result;
        }
      } else {
        let part = traditionalDigits[digit];
        if (unitIndex === 2) {
          part += '元';
        } else if (unitIndex >= 3 && unitIndex <= 5) {
          part += traditionalUnits[unitIndex - 2];
        } else if (unitIndex === 6) {
          part += '万';
        } else if (unitIndex >= 7 && unitIndex <= 9) {
          part += traditionalUnits[unitIndex - 6];
        } else if (unitIndex === 10) {
          part += '亿';
        }
        result = part + result;
      }
    }

    if (integerPart === '0' || !result) {
      result = '';
    }

    // 处理小数部分
    const jiao = parseInt(decimalPart[0]);
    const fen = parseInt(decimalPart[1]);

    if (jiao === 0 && fen === 0) {
      result += '整';
    } else {
      if (jiao > 0) {
        result += traditionalDigits[jiao] + '角';
      } else if (fen > 0 && integerPart !== '0') {
        result += '零';
      }
      if (fen > 0) {
        result += traditionalDigits[fen] + '分';
      }
    }

    // 清理多余的零
    result = result.replace(/零+/g, '零');
    result = result.replace(/零元/g, '元');
    result = result.replace(/零万/g, '万');
    result = result.replace(/零亿/g, '亿');

    if (!result.includes('元') && integerPart !== '0') {
      result = '元' + result;
    }

    if (result.startsWith('元')) {
      result = result.slice(1);
    }

    return (isNegative ? '负' : '') + (result || '零元整');
  };

  const chineseToNumber = (chinese: string) => {
    const digitMap: Record<string, number> = {
      '零': 0, '〇': 0, '一': 1, '二': 2, '三': 3, '四': 4,
      '五': 5, '六': 6, '七': 7, '八': 8, '九': 9,
      '壹': 1, '贰': 2, '叁': 3, '肆': 4, '伍': 5,
      '陆': 6, '柒': 7, '捌': 8, '玖': 9,
    };

    const unitMap: Record<string, number> = {
      '十': 10, '拾': 10, '百': 100, '佰': 100, '千': 1000, '仟': 1000,
      '万': 10000, '亿': 100000000, '兆': 1000000000000,
    };

    let result = 0;
    let temp = 0;
    let isNegative = false;

    if (chinese.startsWith('负')) {
      isNegative = true;
      chinese = chinese.slice(1);
    }

    for (let i = 0; i < chinese.length; i++) {
      const char = chinese[i];

      if (digitMap[char] !== undefined) {
        temp = temp * 10 + digitMap[char];
      } else if (char === '点') {
        // 处理小数点
        let decimal = '';
        for (let j = i + 1; j < chinese.length; j++) {
          const d = chinese[j];
          if (digitMap[d] !== undefined) {
            decimal += digitMap[d];
          }
        }
        if (decimal) {
          return (isNegative ? '-' : '') + (result + temp) + '.' + decimal;
        }
        break;
      } else if (unitMap[char] !== undefined) {
        const unit = unitMap[char];
        if (temp === 0 && (char === '十' || char === '拾')) {
          temp = 1;
        }
        if (unit >= 10000) {
          result = (result + temp) * unit;
        } else {
          result += temp * unit;
        }
        temp = 0;
      }
    }

    result += temp;

    return (isNegative ? '-' : '') + result.toString();
  };

  const handleConvert = () => {
    setError('');
    const cleanInput = input.trim();

    if (!cleanInput) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'toChinese') {
        if (!/^-?\d+\.?\d*$/.test(cleanInput)) {
          throw new Error('请输入有效的数字');
        }
        setOutput(numberToChinese(cleanInput));
      } else {
        setOutput(chineseToNumber(cleanInput));
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
    setMode(mode === 'toChinese' ? 'toNumber' : 'toChinese');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">数字转中文</h2>
        <span className="text-xs text-slate-500">实时转换</span>
      </div>

      {/* 转换方向 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMode('toChinese')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            mode === 'toChinese' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          数字→中文
        </button>
        <button
          onClick={() => setMode('toNumber')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            mode === 'toNumber' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          中文→数字
        </button>
      </div>

      {/* 输出模式（仅数字→中文时显示） */}
      {mode === 'toChinese' && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">输出格式：</span>
          <button
            onClick={() => setOutputMode('traditional')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              outputMode === 'traditional' ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            繁体大写
          </button>
          <button
            onClick={() => setOutputMode('simple')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              outputMode === 'simple' ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            简体小写
          </button>
          <button
            onClick={() => setOutputMode('amount')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              outputMode === 'amount' ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            金额大写
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            {mode === 'toChinese' ? '阿拉伯数字' : '中文数字'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'toChinese' ? '例如: 12345.67' : '例如: 壹万贰仟叁佰肆拾伍'}
            className="w-full h-32 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            {mode === 'toChinese' ? '中文' : '阿拉伯数字'}
          </label>
          <textarea
            value={output}
            readOnly
            placeholder="转换结果..."
            className="w-full h-32 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 resize-none"
          />
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={handleSwap}
          disabled={!output}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg transition-colors"
          title="交换"
        >
          <ArrowDownUp size={20} />
        </button>
        <button
          onClick={handleCopy}
          disabled={!output}
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
        <div className="font-medium mb-1">说明：</div>
        <ul className="list-disc list-inside space-y-0.5">
          <li><b>繁体大写</b>：壹贰叁肆伍陆柒捌玖拾佰仟万亿</li>
          <li><b>简体小写</b>：一二三四五六七八九十百千万亿</li>
          <li><b>金额大写</b>：支持小数，自动添加元角分单位</li>
          <li>中文转数字支持多种格式</li>
        </ul>
      </div>
    </div>
  );
}
