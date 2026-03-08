import { useEffect } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: Array<object>;
  }
}

export default function AdUnit({ 
  slot, 
  format = 'auto', 
  responsive = true,
  className = '' 
}: AdUnitProps) {
  useEffect(() => {
    // 只在生产环境且启用广告时加载
    if (import.meta.env.PROD && import.meta.env.VITE_ADSENSE_ENABLED === 'true') {
      try {
        // 推送广告到 Google AdSense
        if (typeof window !== 'undefined') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, []);

  // 非生产环境或未启用广告时显示占位符
  if (!import.meta.env.PROD || import.meta.env.VITE_ADSENSE_ENABLED !== 'true') {
    return (
      <div className={`bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm ${className}`}
        style={{ minHeight: format === 'horizontal' ? '90px' : format === 'vertical' ? '600px' : '250px' }}>
        广告位 ({format})
      </div>
    );
  }

  // 生产环境显示真实广告
  const formatClass = {
    auto: 'block',
    horizontal: 'block',
    vertical: 'block',
    rectangle: 'block',
  }[format];

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className={`adsbygoogle ${formatClass}`}
        style={{ display: responsive ? 'block' : 'inline-block', width: responsive ? '100%' : undefined }}
        data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

// 广告位配置
export const AD_SLOTS = {
  // 页面顶部横幅
  HEADER_BANNER: 'HEADER_BANNER_SLOT',
  // 侧边栏底部矩形
  SIDEBAR_RECTANGLE: 'SIDEBAR_RECTANGLE_SLOT',
  // 工具下方横幅
  TOOL_BELOW_BANNER: 'TOOL_BELOW_BANNER_SLOT',
  // 首页横幅
  HOME_BANNER: 'HOME_BANNER_SLOT',
} as const;
