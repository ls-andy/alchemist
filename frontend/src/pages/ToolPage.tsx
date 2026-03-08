import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import { toolComponents } from '../tools';

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const ToolComponent = slug ? toolComponents[slug] : null;

  if (!ToolComponent) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">🔧</div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">工具未找到</h2>
        <p className="text-slate-500 mb-4">该工具可能已被移除或不存在</p>
        <Link
          to="/"
          className="flex items-center gap-2 text-primary-500 hover:text-primary-600"
        >
          <ArrowLeft size={18} />
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={18} />
          返回工具列表
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          }
        >
          <ToolComponent />
        </Suspense>
      </div>
    </div>
  );
}
