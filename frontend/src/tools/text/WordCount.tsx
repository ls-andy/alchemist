import { useState, useEffect } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';

export default function WordCount() {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState({
    chars: 0,
    charsNoSpace: 0,
    words: 0,
    chineseChars: 0,
    englishWords: 0,
    lines: 0,
    paragraphs: 0,
    sentences: 0,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const text = input;

    // Characters
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;

    // Chinese characters
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;

    // English words (sequences of letters)
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;

    // Total words (Chinese chars + English words)
    const words = chineseChars + englishWords;

    // Lines
    const lines = text ? text.split('\n').length : 0;

    // Paragraphs (non-empty lines)
    const paragraphs = text ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;

    // Sentences
    const sentences = (text.match(/[。！？.!?]+/g) || []).length;

    setStats({
      chars,
      charsNoSpace,
      words,
      chineseChars,
      englishWords,
      lines,
      paragraphs,
      sentences,
    });
  }, [input]);

  const handleCopy = async () => {
    const text = `字符数: ${stats.chars}
不含空格: ${stats.charsNoSpace}
字数: ${stats.words}
中文: ${stats.chineseChars}
英文词: ${stats.englishWords}
行数: ${stats.lines}
段落数: ${stats.paragraphs}
句子数: ${stats.sentences}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
  };

  const statItems = [
    { key: 'chars', label: '字符数', color: 'bg-blue-500' },
    { key: 'charsNoSpace', label: '不含空格', color: 'bg-blue-400' },
    { key: 'words', label: '字数', color: 'bg-green-500' },
    { key: 'chineseChars', label: '中文', color: 'bg-red-500' },
    { key: 'englishWords', label: '英文词', color: 'bg-purple-500' },
    { key: 'lines', label: '行数', color: 'bg-yellow-500' },
    { key: 'paragraphs', label: '段落数', color: 'bg-pink-500' },
    { key: 'sentences', label: '句子数', color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">字数统计</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">输入文本</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="粘贴或输入文本进行统计..."
          className="w-full h-48 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statItems.map(item => (
          <div key={item.key} className="bg-slate-50 rounded-xl p-4 text-center">
            <div className={`w-8 h-1 ${item.color} rounded-full mx-auto mb-2`}></div>
            <div className="text-2xl font-bold text-slate-800">
              {stats[item.key as keyof typeof stats]}
            </div>
            <div className="text-sm text-slate-500">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          disabled={!input}
          className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          复制统计
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
