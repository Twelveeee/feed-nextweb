'use client';

import { useState } from 'react';
import { FlatFeed, GroupedFeeds } from '@/types';
import FeedItem from './FeedItem';

/**
 * 文章列表组件
 */
interface FeedListProps {
  feeds: FlatFeed[];
  groupedFeeds?: GroupedFeeds;
  selectedFeedId?: number;
  onSelectFeed: (feed: FlatFeed) => void;
  isGrouped?: boolean;
  readFeedLinks?: Set<string>;
}

export default function FeedList({
  feeds,
  groupedFeeds,
  selectedFeedId,
  onSelectFeed,
  isGrouped = false,
  readFeedLinks = new Set(),
}: FeedListProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // 如果没有文章
  if (feeds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <svg
          className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">暂无文章</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          尝试添加订阅源或调整筛选条件
        </p>
      </div>
    );
  }

  // 分组显示
  if (isGrouped && groupedFeeds) {
    return (
      <div>
        {Object.entries(groupedFeeds).map(([groupName, groupFeeds]) => {
          const isCollapsed = collapsedGroups[groupName];
          return (
            <div key={groupName}>
              {/* 分组标题 */}
              <div
                className="sticky top-0 bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 z-10 cursor-pointer flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={() => toggleGroup(groupName)}
              >
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <svg
                    className={`w-4 h-4 transition-transform ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {groupName}
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
                    ({groupFeeds.length})
                  </span>
                </h2>
              </div>
              {/* 分组内的文章 */}
              {!isCollapsed && groupFeeds.map((feed) => (
                <FeedItem
                  key={feed.id}
                  feed={feed}
                  isSelected={feed.id === selectedFeedId}
                  isRead={readFeedLinks.has(feed.link)}
                  onClick={() => onSelectFeed(feed)}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  // 普通列表显示
  return (
    <div>
      {feeds.map((feed) => (
        <FeedItem
          key={feed.id}
          feed={feed}
          isSelected={feed.id === selectedFeedId}
          isRead={readFeedLinks.has(feed.link)}
          onClick={() => onSelectFeed(feed)}
        />
      ))}
    </div>
  );
}
