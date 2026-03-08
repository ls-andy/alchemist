import { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';

export default function KinshipCalculator() {
  const [target, setTarget] = useState('');
  const [result, setResult] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // 亲戚关系图谱
  const relations: Record<string, string[]> = {
    '父亲': ['爸爸', '老爸', '爹', '老爹'],
    '母亲': ['妈妈', '老妈', '娘', '老娘'],
    '爷爷': ['祖父', '爷爷', '老爷子'],
    '奶奶': ['祖母', '奶奶', '老太太'],
    '外公': ['外祖父', '姥爷'],
    '外婆': ['外祖母', '姥姥'],
    '伯父': ['伯伯', '大伯'],
    '伯母': ['大妈', '伯母'],
    '叔父': ['叔叔', '叔父'],
    '婶婶': ['婶母', '婶婶'],
    '姑姑': ['姑姑', '姑妈'],
    '姑父': ['姑父', '姑丈'],
    '舅舅': ['舅舅', '舅父'],
    '舅妈': ['舅妈', '舅母'],
    '阿姨': ['阿姨', '姨妈', '姨母'],
    '姨父': ['姨父', '姨丈'],
    '哥哥': ['哥哥', '大哥', '兄长'],
    '弟弟': ['弟弟', '老弟'],
    '姐姐': ['姐姐', '大姐'],
    '妹妹': ['妹妹', '小妹'],
    '堂兄': ['堂哥'],
    '堂弟': ['堂弟'],
    '堂姐': ['堂姐'],
    '堂妹': ['堂妹'],
    '表兄': ['表哥'],
    '表弟': ['表弟'],
    '表姐': ['表姐'],
    '表妹': ['表妹'],
    '儿子': ['儿子', '儿子'],
    '女儿': ['女儿', '女儿'],
    '侄子': ['侄子'],
    '侄女': ['侄女'],
    '外甥': ['外甥'],
    '外甥女': ['外甥女'],
    '孙子': ['孙子'],
    '孙女': ['孙女'],
    '外孙': ['外孙'],
    '外孙女': ['外孙女'],
    '妻子': ['老婆', '媳妇', '夫人', '太太'],
    '丈夫': ['老公', '先生', '丈夫'],
    '岳父': ['丈人', '岳父', '泰山'],
    '岳母': ['丈母娘', '岳母'],
    '公公': ['公公', '公公'],
    '婆婆': ['婆婆', '婆婆'],
    '大伯子': ['大伯子', '大伯'],
    '小叔子': ['小叔子', '小叔'],
    '大姑子': ['大姑子'],
    '小姑子': ['小姑子'],
    '大舅子': ['大舅子', '大舅'],
    '小舅子': ['小舅子', '小舅'],
    '大姨子': ['大姨子'],
    '小姨子': ['小姨子'],
    '连襟': ['连襟'],
    '妯娌': ['妯娌'],
  };

  // 关系路径计算
  const relationPaths: Record<string, string> = {
    '爸爸的爸爸': '爷爷',
    '爸爸的妈妈': '奶奶',
    '妈妈的爸爸': '外公',
    '妈妈的妈妈': '外婆',
    '爸爸的哥哥': '伯父',
    '爸爸的弟弟': '叔父',
    '爸爸的姐姐': '姑姑',
    '爸爸的妹妹': '姑姑',
    '妈妈的哥哥': '舅舅',
    '妈妈的弟弟': '舅舅',
    '妈妈的姐姐': '阿姨',
    '妈妈的妹妹': '阿姨',
    '爷爷的哥哥': '大爷爷',
    '爷爷的弟弟': '小爷爷',
    '奶奶的哥哥': '舅公',
    '奶奶的弟弟': '舅公',
    '伯父的儿子': '堂兄',
    '伯父的女儿': '堂姐',
    '叔父的儿子': '堂弟',
    '叔父的女儿': '堂妹',
    '姑姑的儿子': '表兄',
    '姑姑的女儿': '表姐',
    '舅舅的儿子': '表弟',
    '舅舅的女儿': '表妹',
    '阿姨的儿子': '表弟',
    '阿姨的女儿': '表妹',
    '哥哥的儿子': '侄子',
    '哥哥的女儿': '侄女',
    '弟弟的儿子': '侄子',
    '弟弟的女儿': '侄女',
    '姐姐的儿子': '外甥',
    '姐姐的女儿': '外甥女',
    '妹妹的儿子': '外甥',
    '妹妹的女儿': '外甥女',
    '儿子的儿子': '孙子',
    '儿子的女儿': '孙女',
    '女儿的儿子': '外孙',
    '女儿的女儿': '外孙女',
    '丈夫的爸爸': '公公',
    '丈夫的妈妈': '婆婆',
    '妻子的爸爸': '岳父',
    '妻子的妈妈': '岳母',
    '丈夫的哥哥': '大伯子',
    '丈夫的弟弟': '小叔子',
    '丈夫的姐姐': '大姑子',
    '丈夫的妹妹': '小姑子',
    '妻子的哥哥': '大舅子',
    '妻子的弟弟': '小舅子',
    '妻子的姐姐': '大姨子',
    '妻子的妹妹': '小姨子',
  };

  const calculate = () => {
    const input = target.trim();
    const results: string[] = [];

    // 直接查询
    if (relations[input]) {
      results.push(`【${input}】也叫：${relations[input].join('、')}`);
    }

    // 关系路径查询
    if (relationPaths[input]) {
      results.push(`【${input}】是：${relationPaths[input]}`);
    }

    // 反向查询：查找某个称呼对应的关系
    for (const [relation, names] of Object.entries(relations)) {
      if (names.includes(input)) {
        results.push(`【${input}】正式称呼：${relation}`);
      }
    }

    // 组合查询：XX的XX
    for (const [path, result] of Object.entries(relationPaths)) {
      if (path.includes(input) || result.includes(input)) {
        results.push(`${path} → ${result}`);
      }
    }

    setResult(results.length > 0 ? results : ['未找到匹配的亲戚关系']);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setTarget('');
    setResult([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">亲戚关系计算器</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">
          输入称呼或关系（如：爸爸的哥哥、伯父、爷爷）
        </label>
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="例如：爸爸的哥哥、伯父、爷爷..."
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {result.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="space-y-2">
            {result.map((r, i) => (
              <div key={i} className="text-sm text-slate-700 py-1">
                {r}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={calculate}
          disabled={!target}
          className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 text-white rounded-lg transition-colors font-medium"
        >
          查询
        </button>
        <button
          onClick={handleCopy}
          disabled={result.length === 0}
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

      {/* Quick examples */}
      <div className="bg-slate-50 rounded-xl p-4">
        <div className="text-sm font-medium text-slate-600 mb-2">快速查询</div>
        <div className="flex flex-wrap gap-2">
          {['爸爸的哥哥', '妈妈的妈妈', '妻子的爸爸', '哥哥的儿子', '爷爷的哥哥'].map(q => (
            <button
              key={q}
              onClick={() => setTarget(q)}
              className="px-3 py-1 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
