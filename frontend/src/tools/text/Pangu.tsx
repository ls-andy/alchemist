import { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';

export default function Pangu() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // Pangu.js algorithm - add space between Chinese and English/numbers
  const pangu = (text: string) => {
    let result = text;

    // Chinese to English/Number
    result = result.replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, '$1 $2');
    result = result.replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, '$1 $2');

    // Chinese to symbols
    result = result.replace(/([\u4e00-\u9fa5])([\[\]\(\){}])/g, '$1 $2');
    result = result.replace(/([\[\]\(\){}])([\u4e00-\u9fa5])/g, '$1 $2');

    // Clean up multiple spaces
    result = result.replace(/\s+/g, ' ');

    return result;
  };

  const handleConvert = () => {
    setOutput(pangu(input));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">盘古之白</h2>
      </div>

      <p className="text-sm text-slate-500">
        自动在中英文之间添加空格，让文本更加美观易读
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">原始文本</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入文本，例如：这是中文English混合123数字..."
            className="w-full h-48 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">格式化结果</label>
          <textarea
            value={output}
            readOnly
            placeholder="处理后的文本..."
            className="w-full h-48 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 resize-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleConvert}
          disabled={!input}
          className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 text-white rounded-lg transition-colors font-medium"
        >
          添加空格
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

      {/* Examples */}
      <div className="bg-slate-50 rounded-xl p-4">
        <div className="text-sm font-medium text-slate-600 mb-3">示例</div>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-slate-500">原文:</span>
            <code className="text-red-500">这是中文English混合123数字</code>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-slate-500">结果:</span>
            <code className="text-green-500">这是中文 English 混合 123 数字</code>
          </div>
        </div>
      </div>
    </div>
  );
}
