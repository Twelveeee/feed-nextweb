'use client';

import { FlatFeed } from '@/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

/**
 * 文章列表项组件
 */
interface FeedItemProps {
  feed: FlatFeed;
  isSelected?: boolean;
  isRead?: boolean;
  onClick: () => void;
}

export default function FeedItem({ feed, isSelected = false, isRead = false, onClick }: FeedItemProps) {
  return (
    <article
      onClick={onClick}
      className={`
        p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors
        hover:bg-gray-50 dark:hover:bg-gray-800
        ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600' : ''}
        ${isRead ? 'opacity-60' : ''}
      `}
    >
      {/* 标题 */}
      <div className="flex items-start gap-2 mb-2">
        {!isRead && (
          <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-600 rounded-full" title="未读"></span>
        )}
        <h3 className={`flex-1 text-base font-semibold line-clamp-2 ${isSelected ? 'text-blue-900 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'}`}>
          {feed.title}
        </h3>
      </div>

      {/* 摘要 */}
      {feed.summary && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {feed.summary}
        </p>
      )}

      {/* 元信息 */}
      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        {/* 来源 */}
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          {feed.source}
        </span>

        {/* 分类 */}
        {feed.category && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            {feed.category}
          </span>
        )}

        {/* 发布时间 */}
        <span className="flex items-center gap-1 ml-auto">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {dayjs(feed.pubTime).fromNow()}
        </span>
      </div>

      {/* 标签 */}
      {feed.tags && feed.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {feed.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {feed.tags.length > 3 && (
            <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
              +{feed.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </article>
  );
}
