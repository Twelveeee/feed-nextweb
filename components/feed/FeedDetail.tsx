'use client';

import { FlatFeed } from '@/types';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useEffect, useState, useRef, useCallback } from 'react';

dayjs.locale('zh-cn');

/**
 * 文章详情组件
 */
interface FeedDetailProps {
  feed: FlatFeed | null;
  onBack?: () => void; // 移动端返回按钮
  onPrevious?: () => void; // 上一篇
  onNext?: () => void; // 下一篇
  hasPrevious?: boolean; // 是否有上一篇
  hasNext?: boolean; // 是否有下一篇
}

export default function FeedDetail({ feed, onBack, onPrevious, onNext, hasPrevious, hasNext }: FeedDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const isAtBottomRef = useRef<boolean>(false);

  // 最小滑动距离（像素）
  const minSwipeDistance = 50;
  // 最大滑动时间（毫秒）- 防止慢速滑动触发
  const maxSwipeTime = 500;

  const [isAnimating, setIsAnimating] = useState(false);

  // 监听 feed 变化，重置滚动位置
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [feed?.id]);

  // 检查是否在底部
  const checkIfAtBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;
    
    const scrollTop = Math.ceil(container.scrollTop);
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    
    // 允许50px的误差范围，适应移动端浏览器可能的底部遮挡或弹性滚动
    return scrollHeight - scrollTop - clientHeight <= 50;
  }, []);

  // 监听滚动，实时更新底部状态
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      isAtBottomRef.current = checkIfAtBottom();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    // 初始检查
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [checkIfAtBottom]);

  const onTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  }, []);

  const onTouchEnd = useCallback((e: TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndTime = Date.now();
    
    const distance = touchStartY.current - touchEndY;
    const duration = touchEndTime - touchStartTime.current;
    
    // 向上滑动（distance > 0）且距离足够且时间合理
    const isValidSwipe = distance > minSwipeDistance && duration < maxSwipeTime;
    
    // 重新检查是否在底部（以防触摸过程中状态未更新）
    const isAtBottom = checkIfAtBottom();

    // 只有在底部且有效滑动时才切换
    if (isValidSwipe && isAtBottom && hasNext && onNext) {
      console.log('触发下一篇切换', { distance, duration, isAtBottom });
      
      // 触发切换动画
      setIsAnimating(true);
      
      // 动画结束后执行切换
      setTimeout(() => {
        onNext();
        // 稍微延迟重置动画状态，配合新内容淡入
        setTimeout(() => setIsAnimating(false), 50);
      }, 100); // 100ms 对应 CSS transition 时间
    }
  }, [hasNext, onNext, minSwipeDistance, maxSwipeTime, checkIfAtBottom]);

  // 使用原生事件监听，避免React合成事件的问题
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [onTouchStart, onTouchEnd]);

  // 键盘快捷键支持（PC端）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 上箭头或 K 键 - 上一篇
      if ((e.key === 'ArrowUp' || e.key === 'k') && hasPrevious && onPrevious) {
        e.preventDefault();
        onPrevious();
      }
      // 下箭头或 J 键 - 下一篇
      if ((e.key === 'ArrowDown' || e.key === 'j') && hasNext && onNext) {
        e.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrevious, hasNext, onPrevious, onNext]);
  // 未选中文章时的占位符
  if (!feed) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center">
        <svg
          className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">选择一篇文章</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          从左侧列表中选择文章以查看详情
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full overflow-y-auto overflow-x-hidden"
    >
      <article
        className={`
          max-w-4xl mx-auto p-6 lg:p-8
          transform transition-all duration-200 ease-out
          ${isAnimating ? '-translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}
        `}
      >
        {/* 移动端返回按钮 */}
        {onBack && (
          <button
            onClick={onBack}
            className="lg:hidden flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">返回列表</span>
          </button>
        )}

      {/* 文章标题 */}
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
        {feed.title}
      </h1>

      {/* 元信息 */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        {/* 来源 */}
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <span className="font-medium">{feed.source}</span>
        </div>

        {/* 分类 */}
        {feed.category && (
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span>{feed.category}</span>
          </div>
        )}

        {/* 发布时间 */}
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{dayjs(feed.pubTime).format('YYYY-MM-DD HH:mm')}</span>
        </div>

        {/* 原文链接 */}
        <a
          href={feed.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors ml-auto"
        >
          <span>查看原文</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>

      {/* 文章内容 */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        {/* 如果有 HTML 摘要，显示 HTML */}
        {feed.summaryHtml ? (
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: feed.summaryHtml }}
          />
        ) : feed.summary ? (
          // 如果只有摘要，显示摘要
          <div className="text-gray-700 dark:text-gray-300">{feed.summary}</div>
        ) : (
          // 没有内容
          <div className="text-gray-500 dark:text-gray-400 italic">暂无内容</div>
        )}
      </div>
      </article>
    </div>
  );
}
