import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 从URL读取搜索词
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) setSearchQuery(q);
  }, [location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center h-16 px-4 md:px-6 gap-4">
        {/* 移动端菜单按钮 */}
        <button 
          className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>

        {/* 搜索框 */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className={`relative flex items-center transition-all duration-200 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
            <Search className="absolute left-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="搜索工具..."
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 p-1 hover:bg-slate-100 rounded-full"
              >
                <X size={16} className="text-slate-400" />
              </button>
            )}
          </div>
        </form>

        {/* 统计信息 */}
        <div className="hidden md:flex items-center gap-4 text-sm text-slate-500">
          <span>共收录 <strong className="text-slate-700">100+</strong> 款工具</span>
        </div>
      </div>
    </header>
  );
}
