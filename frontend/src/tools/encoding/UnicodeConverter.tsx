import { useState } from 'react';
import { ArrowDownUp, Copy, Check, Trash2 } from 'lucide-react';

export default function UnicodeConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [format, setFormat] = useState<'\\u' | 'U+' | '&#' | '%u'>('\\u');
  const [copied, setCopied] = useState(false);

  const encode = (text: string) => {
    switch (format) {
      case '\\u':
        return text.split('').map(char =>
          '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0')
        ).join('');
      case 'U+':
        return text.split('').map(char =>
          'U+' + char.charCodeAt(0).toString(16).padStart(4, '0').toUpperCase()
        ).join(' ');
      case '&#':
        return text.split('').map(char =>
          '&#' + char.charCodeAt(0) + ';'
        ).join('');
      case '%u':
        return text.split('').map(char =>
          '%u' + char.charCodeAt(0).toString(16).padStart(4, '0')
        ).join('');
    }
  };

  const decode = (text: string) => {
    let result = text;

    // \uXXXX
    result = result.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );

    // U+XXXX
    result = result.replace(/U\+([0-9a-fA-F]{4})/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );

    // &#XXX;
    result = result.replace(/&#(\d+);/g, (_, num) =>
      String.fromCharCode(parseInt(num, 10))
    );

    // &#xXXX;
    result = result.replace(/&#x([0-9a-fA-F]+);/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );

    // %uXXXX
    result = result.replace(/%u([0-9a-fA-F]{4})/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );

    return result;
  };

  const handleConvert = () => {
    if (mode === 'encode') {
      setOutput(encode(input));
    } else {
      setOutput(decode(input));
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
  };

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Unicode 转换</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('encode')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              mode === 'encode' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            编码
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              mode === 'decode' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            解码
          </button>
        </div>
      </div>

      {mode === 'encode' && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">格式：</span>
          {[
            { value: '\\u', label: '\\uXXXX' },
            { value: 'U+', label: 'U+XXXX' },
            { value: '&#', label: '&#XXX;' },
            { value: '%u', label: '%uXXXX' },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFormat(f.value as typeof format)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                format === f.value ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            {mode === 'encode' ? '文本' : 'Unicode 编码'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '输入文本...' : '输入 Unicode 编码...'}
            className="w-full h-32 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            {mode === 'encode' ? 'Unicode 编码' : '文本'}
          </label>
          <textarea
            value={output}
            readOnly
            placeholder="转换结果..."
            className="w-full h-32 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 resize-none font-mono text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleConvert}
          disabled={!input}
          className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 text-white rounded-lg transition-colors font-medium"
        >
          {mode === 'encode' ? '编码' : '解码'}
        </button>
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
    </div>
  );
}
