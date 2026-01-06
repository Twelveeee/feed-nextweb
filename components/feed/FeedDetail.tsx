'use client';

import { FlatFeed } from '@/types';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useEffect, useState } from 'react';

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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // 最小滑动距离（像素）
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;
    
    if (isUpSwipe && hasNext && onNext) {
      onNext();
    }
    if (isDownSwipe && hasPrevious && onPrevious) {
      onPrevious();
    }
  };

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
      className="relative h-full overflow-y-auto"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <article className="max-w-4xl mx-auto p-6 lg:p-8">
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

      {/* 标签 */}
      {feed.tags && feed.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {feed.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 文章内容 */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        {/* 如果有 HTML 摘要，显示 HTML */}
        {feed.summaryHtml ? (
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: feed.summaryHtml }}
          />
        ) : feed.content ? (
          // 如果有纯文本内容，显示纯文本
          <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">{feed.content}</div>
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
