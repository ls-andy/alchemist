import { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';

export default function CIDRCalculator() {
  const [ip, setIp] = useState('192.168.1.0');
  const [cidr, setCidr] = useState('24');
  const [result, setResult] = useState<{
    network: string;
    firstHost: string;
    lastHost: string;
    broadcast: string;
    subnetMask: string;
    wildcardMask: string;
    totalHosts: number;
    usableHosts: number;
    ipClass: string;
  } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');

  const ipToInt = (ip: string) => {
    const parts = ip.split('.').map(Number);
    return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3] >>> 0;
  };

  const intToIp = (int: number) => {
    return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255
    ].join('.');
  };

  const getIpClass = (firstOctet: number) => {
    if (firstOctet < 128) return 'A';
    if (firstOctet < 192) return 'B';
    if (firstOctet < 224) return 'C';
    if (firstOctet < 240) return 'D (组播)';
    return 'E (保留)';
  };

  const calculate = () => {
    setError('');

    // Validate IP
    const ipParts = ip.split('.');
    if (ipParts.length !== 4 || !ipParts.every(p => {
      const n = parseInt(p);
      return !isNaN(n) && n >= 0 && n <= 255;
    })) {
      setError('请输入有效的 IP 地址');
      setResult(null);
      return;
    }

    const cidrNum = parseInt(cidr);
    if (isNaN(cidrNum) || cidrNum < 0 || cidrNum > 32) {
      setError('CIDR 必须在 0-32 之间');
      setResult(null);
      return;
    }

    const ipInt = ipToInt(ip);
    const mask = cidrNum === 0 ? 0 : (0xFFFFFFFF << (32 - cidrNum)) >>> 0;
    const wildcard = ~mask >>> 0;
    const network = (ipInt & mask) >>> 0;
    const broadcast = (network | wildcard) >>> 0;

    const totalHosts = Math.pow(2, 32 - cidrNum);
    const usableHosts = cidrNum >= 31 ? (cidrNum === 32 ? 1 : 2) : totalHosts - 2;

    setResult({
      network: intToIp(network),
      firstHost: intToIp(cidrNum >= 31 ? network : network + 1),
      lastHost: intToIp(cidrNum >= 31 ? broadcast : broadcast - 1),
      broadcast: intToIp(broadcast),
      subnetMask: intToIp(mask),
      wildcardMask: intToIp(wildcard),
      totalHosts,
      usableHosts,
      ipClass: getIpClass(parseInt(ipParts[0])),
    });
  };

  const handleCopy = async (field: string, value: string | number) => {
    await navigator.clipboard.writeText(String(value));
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClear = () => {
    setResult(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">CIDR 计算器</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-2">IP 地址</label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="例如: 192.168.1.0"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">CIDR</label>
          <div className="flex items-center">
            <span className="text-slate-400 mr-2">/</span>
            <input
              type="number"
              value={cidr}
              onChange={(e) => setCidr(e.target.value)}
              min="0"
              max="32"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-slate-50 rounded-xl p-4 space-y-3">
          {[
            { key: 'network', label: '网络地址', value: result.network },
            { key: 'firstHost', label: '第一个可用主机', value: result.firstHost },
            { key: 'lastHost', label: '最后一个可用主机', value: result.lastHost },
            { key: 'broadcast', label: '广播地址', value: result.broadcast },
            { key: 'subnetMask', label: '子网掩码', value: result.subnetMask },
            { key: 'wildcardMask', label: '通配符掩码', value: result.wildcardMask },
            { key: 'totalHosts', label: '总主机数', value: result.totalHosts.toLocaleString() },
            { key: 'usableHosts', label: '可用主机数', value: result.usableHosts.toLocaleString() },
            { key: 'ipClass', label: 'IP 类别', value: result.ipClass },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
              <span className="text-sm text-slate-600">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-slate-800">{item.value}</span>
                <button
                  onClick={() => handleCopy(item.key, item.value)}
                  className="p-1 hover:bg-slate-200 rounded transition-colors"
                >
                  {copied === item.key ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={calculate}
          className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
        >
          计算
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
