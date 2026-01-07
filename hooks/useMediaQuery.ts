import { useState, useEffect } from 'react';

/**
 * 媒体查询 Hook
 * @param query - 媒体查询字符串
 * @returns 是否匹配查询条件
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // 初始化状态
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // 监听变化
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    // 兼容旧版浏览器
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      media.addListener(listener);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [matches, query]);

  return matches;
}

/**
 * 判断是否为移动端（小于 1024px）
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 1023px)');
}

/**
 * 判断是否为桌面端（大于等于 1024px）
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
