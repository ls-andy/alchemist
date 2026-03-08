import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, RefreshCw } from 'lucide-react';

export default function QrCodeTool() {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrUrl, setQrUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    if (!text) {
      setError('请输入内容');
      setQrUrl('');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setError(null);
      await QRCode.toCanvas(canvas, text, {
        width: size,
        margin: 2,
        errorCorrectionLevel,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      setError('内容过长或包含不支持的字符');
      setQrUrl('');
      console.error('QR generation error:', err);
    }
  };

  useEffect(() => {
    generateQR();
  }, [text, size, errorCorrectionLevel]);

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = qrUrl;
    link.click();
  };

  const handleCopy = async () => {
    if (!qrUrl) return;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败', err);
    }
  };

  const handleClear = () => {
    setText('');
    setQrUrl('');
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">二维码生成</h2>
        <button
          onClick={handleClear}
          className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
        >
          <RefreshCw size={14} />
          清空
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">内容</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入文本、网址等..."
          className="w-full h-24 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
        <p className="text-xs text-slate-400 mt-1">
          支持：网址、文本、电话、WiFi 等任意内容
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            尺寸: {size}px
          </label>
          <input
            type="range"
            min="128"
            max="512"
            step="32"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">容错级别</label>
          <select
            value={errorCorrectionLevel}
            onChange={(e) => setErrorCorrectionLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="L">L - 7%</option>
            <option value="M">M - 15%</option>
            <option value="Q">Q - 25%</option>
            <option value="H">H - 30%</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 text-center">
        {error ? (
          <div className="text-red-500 py-8">{error}</div>
        ) : qrUrl ? (
          <>
            <canvas ref={canvasRef} className="mx-auto border border-slate-200 rounded-lg bg-white" />
            <p className="text-xs text-slate-500 mt-2">
              ✅ 可扫描的二维码
            </p>
          </>
        ) : (
          <div className="text-slate-400 py-8">请输入内容生成二维码</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleDownload}
          disabled={!qrUrl}
          className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Download size={18} />
          下载图片
        </button>
        <button
          onClick={handleCopy}
          disabled={!qrUrl}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg transition-colors"
          title="复制图片"
        >
          {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
        </button>
      </div>
    </div>
  );
}
