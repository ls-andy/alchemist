import { useState } from 'react';
import { Copy, Check, Trash2, Monitor, Smartphone, Tablet, Globe, Cpu } from 'lucide-react';
import { UAParser } from 'ua-parser-js';

interface UAResult {
  ua: string;
  browser: { name: string | undefined; version: string | undefined; major: string | undefined };
  os: { name: string | undefined; version: string | undefined };
  device: { vendor: string | undefined; model: string | undefined; type: string | undefined };
  engine: { name: string | undefined; version: string | undefined };
  cpu: { architecture: string | undefined } | undefined;
}

export default function UAParserTool() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<UAResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleParse = () => {
    if (!input.trim()) {
      setResult(null);
      return;
    }
    
    try {
      const parser = new UAParser(input.trim());
      setResult(parser.getResult() as UAResult);
    } catch (error) {
      console.error('Parse error:', error);
      setResult(null);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      setTimeout(handleParse, 0);
    } catch (error) {
      console.error('Paste failed:', error);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const getDeviceIcon = () => {
    if (!result) return <Monitor className="w-5 h-5" />;
    const type = result.device.type;
    if (type === 'mobile') return <Smartphone className="w-5 h-5" />;
    if (type === 'tablet') return <Tablet className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
  };

  const sampleUAs = [
    {
      label: 'Chrome Desktop',
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    {
      label: 'Safari iOS',
      ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    },
    {
      label: 'Android Chrome',
      ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    },
    {
      label: 'WeChat',
      ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 XWEB/1200187 MMWEBSDK/20231205 MMWEBID/2527 MicroMessenger/8.0.47.2560(0x28002F30) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64'
    },
    {
      label: 'Googlebot',
      ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    },
  ];

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">User-Agent 解析器</h2>
        <p className="text-sm text-slate-500 mt-1">解析 User-Agent 字符串，获取浏览器、操作系统、设备信息</p>
      </div>

      {/* 输入区 */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="粘贴 User-Agent 字符串..."
            className="flex-1 h-24 px-4 py-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleParse}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            解析
          </button>
          <button
            onClick={handlePaste}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            粘贴
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1"
          >
            <Trash2 size={16} />
            清空
          </button>
        </div>
      </div>

      {/* 示例 User-Agent */}
      <div>
        <p className="text-xs text-slate-400 mb-2">示例 User-Agent：</p>
        <div className="flex flex-wrap gap-2">
          {sampleUAs.map((sample, index) => (
            <button
              key={index}
              onClick={() => {
                setInput(sample.ua);
                setTimeout(handleParse, 0);
              }}
              className="px-3 py-1 text-xs bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* 解析结果 */}
      {result && (
        <div className="space-y-4">
          {/* 设备概览 */}
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                {getDeviceIcon()}
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-slate-800">
                  {result.browser.name || '未知浏览器'} {result.browser.version || ''}
                </div>
                <div className="text-sm text-slate-500">
                  {result.os.name || '未知系统'} {result.os.version || ''} 
                  {result.device.vendor ? ` · ${result.device.vendor}` : ''}
                  {result.device.model ? ` ${result.device.model}` : ''}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {result.device.type || 'desktop'} · {result.engine.name || '未知引擎'}
                </div>
              </div>
            </div>
          </div>

          {/* 详细信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 浏览器信息 */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-primary-500" />
                <h3 className="font-semibold text-slate-800">浏览器</h3>
              </div>
              <div className="space-y-2 text-sm">
                <InfoRow label="名称" value={result.browser.name || '-'} onCopy={() => handleCopy(result.browser.name || '', 'browser-name')} copied={copied === 'browser-name'} />
                <InfoRow label="版本" value={result.browser.version || '-'} onCopy={() => handleCopy(result.browser.version || '', 'browser-version')} copied={copied === 'browser-version'} />
                <InfoRow label="主要版本" value={result.browser.major || '-'} onCopy={() => handleCopy(result.browser.major || '', 'browser-major')} copied={copied === 'browser-major'} />
              </div>
            </div>

            {/* 操作系统信息 */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-primary-500" />
                <h3 className="font-semibold text-slate-800">操作系统</h3>
              </div>
              <div className="space-y-2 text-sm">
                <InfoRow label="名称" value={result.os.name || '-'} onCopy={() => handleCopy(result.os.name || '', 'os-name')} copied={copied === 'os-name'} />
                <InfoRow label="版本" value={result.os.version || '-'} onCopy={() => handleCopy(result.os.version || '', 'os-version')} copied={copied === 'os-version'} />
              </div>
            </div>

            {/* 设备信息 */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                {getDeviceIcon()}
                <h3 className="font-semibold text-slate-800">设备</h3>
              </div>
              <div className="space-y-2 text-sm">
                <InfoRow label="厂商" value={result.device.vendor || '-'} onCopy={() => handleCopy(result.device.vendor || '', 'device-vendor')} copied={copied === 'device-vendor'} />
                <InfoRow label="型号" value={result.device.model || '-'} onCopy={() => handleCopy(result.device.model || '', 'device-model')} copied={copied === 'device-model'} />
                <InfoRow label="类型" value={result.device.type || 'desktop'} onCopy={() => handleCopy(result.device.type || 'desktop', 'device-type')} copied={copied === 'device-type'} />
              </div>
            </div>

            {/* 引擎信息 */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="w-4 h-4 text-primary-500" />
                <h3 className="font-semibold text-slate-800">渲染引擎</h3>
              </div>
              <div className="space-y-2 text-sm">
                <InfoRow label="名称" value={result.engine.name || '-'} onCopy={() => handleCopy(result.engine.name || '', 'engine-name')} copied={copied === 'engine-name'} />
                <InfoRow label="版本" value={result.engine.version || '-'} onCopy={() => handleCopy(result.engine.version || '', 'engine-version')} copied={copied === 'engine-version'} />
              </div>
            </div>
          </div>

          {/* CPU 信息 */}
          {result.cpu?.architecture && (
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-primary-500" />
                <h3 className="font-semibold text-slate-800">CPU</h3>
              </div>
              <div className="text-sm">
                <InfoRow label="架构" value={result.cpu.architecture} onCopy={() => handleCopy(result.cpu?.architecture || '', 'cpu-arch')} copied={copied === 'cpu-arch'} />
              </div>
            </div>
          )}

          {/* 原始 JSON */}
          <div className="bg-slate-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">原始解析数据 (JSON)</span>
              <button
                onClick={() => handleCopy(JSON.stringify(result, null, 2), 'json')}
                className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              >
                {copied === 'json' ? <Check size={12} /> : <Copy size={12} />}
                {copied === 'json' ? '已复制' : '复制'}
              </button>
            </div>
            <pre className="text-xs text-green-400 font-mono overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* 当前浏览器 UA */}
      <div className="bg-slate-50 rounded-xl p-4">
        <p className="text-xs text-slate-400 mb-2">当前浏览器 User-Agent：</p>
        <code className="text-xs text-slate-600 break-all">{navigator.userAgent}</code>
        <button
          onClick={() => {
            setInput(navigator.userAgent);
            setTimeout(handleParse, 0);
          }}
          className="mt-2 text-xs text-primary-500 hover:text-primary-600"
        >
          解析当前 UA
        </button>
      </div>
    </div>
  );
}

function InfoRow({ 
  label, 
  value, 
  onCopy, 
  copied 
}: { 
  label: string; 
  value: string; 
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
      <span className="text-slate-500">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-slate-800 font-medium">{value}</span>
        {value !== '-' && (
          <button 
            onClick={onCopy}
            className="text-slate-400 hover:text-primary-500 transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}
