'use client';

import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import SearchBox from './SearchBox';
import GroupSelector from './GroupSelector';
import ReadStatusSelector from './ReadStatusSelector';
import { GroupByType, ReadStatusFilter } from '@/types';

/**
 * 筛选栏组件
 */
interface FilterBarProps {
  categories: string[];
  sources: string[];
  selectedCategory?: string;
  selectedSource?: string;
  selectedReadStatus?: ReadStatusFilter;
  groupBy: GroupByType;
  onCategoryChange: (category: string | undefined) => void;
  onSourceChange: (source: string | undefined) => void;
  onReadStatusChange: (status: ReadStatusFilter | undefined) => void;
  onGroupByChange: (groupBy: GroupByType) => void;
  onSearch: (query: string) => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>; // 滚动容器引用
}

export default function FilterBar({
  categories,
  sources,
  selectedCategory,
  selectedSource,
  selectedReadStatus = 'all',
  groupBy,
  onCategoryChange,
  onSourceChange,
  onReadStatusChange,
  onGroupByChange,
  onSearch,
  scrollContainerRef,
}: FilterBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [filterHeight, setFilterHeight] = useState(0);
  const lastScrollY = useRef(0);
  const filterRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // 监听高度变化
  useEffect(() => {
    if (!filterRef.current) return;
    
    const updateHeight = () => {
      if (filterRef.current) {
        setFilterHeight(filterRef.current.offsetHeight);
      }
    };

    // 初始测量
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(filterRef.current);
    return () => observer.disconnect();
  }, []);

  // 监听滚动事件，控制过滤栏显示/隐藏（仅移动端）
  useEffect(() => {
    if (!scrollContainerRef?.current || !isMobile) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const currentScrollY = container.scrollTop;
      const scrollDelta = currentScrollY - lastScrollY.current;
      
      // 避免由于弹性滚动导致的负值或超大值影响判断
      if (currentScrollY < 0) return;

      // 阈值优化：更灵敏的响应
      // 向下滚动时隐藏 (增加阈值避免微小抖动)
      if (scrollDelta > 5 && currentScrollY > 50 && isVisible) {
        setIsVisible(false);
      }
      // 向上滚动时显示
      else if (scrollDelta < -5 && !isVisible) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    const container = scrollContainerRef.current;
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [scrollContainerRef, isVisible, isMobile]);

  return (
    <div
      ref={filterRef}
      className={`
        bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700
        lg:!mt-0 lg:!opacity-100 lg:!pointer-events-auto
        transition-all duration-300 ease-in-out
        overflow-hidden
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
      `}
      style={{
        // 移动端隐藏时使用负 margin 将其收起
        marginTop: (isMobile && !isVisible) ? `-${filterHeight}px` : 0,
        // 保持内边距
        padding: '1rem',
      }}
    >
      {/* 搜索框 - PC和移动端都显示 */}
      <SearchBox onSearch={onSearch} />

      {/* 筛选器和分组 - 只在移动端显示 */}
      <div className="flex flex-col gap-4 lg:hidden">
        {/* 分类筛选 */}
        <div className="flex items-center gap-2">
          <label htmlFor="category" className="text-sm text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
            分类：
          </label>
          <select
            id="category"
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange(e.target.value || undefined)}
            className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* 来源筛选 */}
        <div className="flex items-center gap-2">
          <label htmlFor="source" className="text-sm text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
            来源：
          </label>
          <select
            id="source"
            value={selectedSource || ''}
            onChange={(e) => onSourceChange(e.target.value || undefined)}
            className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        {/* 已读状态筛选 */}
        <div>
          <ReadStatusSelector
            readStatus={selectedReadStatus}
            onReadStatusChange={onReadStatusChange}
          />
        </div>

        {/* 分组选择器 */}
        <div>
          <GroupSelector groupBy={groupBy} onGroupByChange={onGroupByChange} />
        </div>
      </div>
    </div>
  );
}
