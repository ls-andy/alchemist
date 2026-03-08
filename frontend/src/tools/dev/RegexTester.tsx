import { useState } from 'react';
import { Copy, Check, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [result, setResult] = useState<{
    matches: RegExpMatchArray | null;
    error: string | null;
    isGlobal: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const test = () => {
    if (!pattern) {
      setResult(null);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matches = testString.match(regex);
      setResult({
        matches,
        error: null,
        isGlobal: flags.includes('g'),
      });
    } catch (e) {
      setResult({
        matches: null,
        error: (e as Error).message,
        isGlobal: false,
      });
    }
  };

  const handleCopy = async () => {
    if (!result?.matches) return;
    await navigator.clipboard.writeText(JSON.stringify(result.matches, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setPattern('');
    setTestString('');
    setResult(null);
  };

  const highlightMatches = () => {
    if (!pattern || !testString || result?.error) return testString;

    try {
      const regex = new RegExp(pattern, flags);
      return testString.replace(regex, (match) => `<mark class="bg-yellow-200">${match}</mark>`);
    } catch {
      return testString;
    }
  };

  const flagOptions = [
    { value: 'g', label: 'global' },
    { value: 'i', label: 'ignore case' },
    { value: 'm', label: 'multiline' },
    { value: 's', label: 'dotall' },
  ];

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">正则表达式测试</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">正则表达式</label>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="输入正则表达式"
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
          />
          <span className="text-slate-400">/</span>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="flags"
            className="w-20 px-2 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
          />
        </div>
        <div className="flex gap-2 mt-2">
          {flagOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => toggleFlag(opt.value)}
              className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                flags.includes(opt.value)
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.value} ({opt.label})
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">测试文本</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="输入要匹配的文本..."
          className="w-full h-32 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm"
        />
      </div>

      {result && (
        <div className="space-y-3">
          {result.error ? (
            <div className="px-4 py-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <XCircle size={16} />
              {result.error}
            </div>
          ) : (
            <>
              <div className="px-4 py-3 bg-green-50 text-green-600 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle size={16} />
                {result.matches
                  ? `找到 ${result.isGlobal ? result.matches.length : 1} 个匹配`
                  : '无匹配'}
              </div>

              {result.matches && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-sm font-medium text-slate-600 mb-2">匹配结果</div>
                  <div className="font-mono text-sm space-y-1 max-h-40 overflow-y-auto">
                    {(result.isGlobal ? result.matches : [result.matches[0]]).map((match, i) => (
                      <div key={i} className="px-2 py-1 bg-yellow-100 rounded inline-block mr-2 mb-1">
                        {match}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm font-medium text-slate-600 mb-2">高亮显示</div>
                <div
                  className="font-mono text-sm break-all"
                  dangerouslySetInnerHTML={{ __html: highlightMatches() }}
                />
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={test}
          disabled={!pattern}
          className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 text-white rounded-lg transition-colors font-medium"
        >
          测试
        </button>
        <button
          onClick={handleCopy}
          disabled={!result?.matches}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg transition-colors"
          title="复制结果"
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

      {/* Quick examples */}
      <div className="bg-slate-50 rounded-xl p-4">
        <div className="text-sm font-medium text-slate-600 mb-2">常用示例</div>
        <div className="space-y-2">
          {[
            { name: '邮箱', pattern: '[\\w.-]+@[\\w.-]+\\.\\w+' },
            { name: '手机号', pattern: '1[3-9]\\d{9}' },
            { name: '网址', pattern: 'https?://[\\w.-]+\\.\\w+' },
            { name: 'IP地址', pattern: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}' },
          ].map(ex => (
            <button
              key={ex.name}
              onClick={() => setPattern(ex.pattern)}
              className="block w-full text-left px-3 py-2 text-sm bg-white rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <span className="text-slate-500">{ex.name}:</span>{' '}
              <code className="text-slate-800">{ex.pattern}</code>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
