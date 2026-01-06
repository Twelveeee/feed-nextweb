import dayjs from 'dayjs';
import { FlatFeed, GroupedFeeds, GroupByType, ReadStatusFilter } from '@/types';

/**
 * 按指定类型对文章进行分组
 */
export function groupFeeds(feeds: FlatFeed[], groupBy: GroupByType): GroupedFeeds {
  if (groupBy === 'none') {
    return { 'all': feeds };
  }

  const grouped: GroupedFeeds = {};

  feeds.forEach(feed => {
    let key: string;

    switch (groupBy) {
      case 'category':
        key = feed.category || '未分类';
        break;
      case 'source':
        key = feed.source;
        break;
      case 'hour':
        key = dayjs(feed.pubTime).format('YYYY-MM-DD HH:00');
        break;
      default:
        key = 'all';
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(feed);
  });

  // 对每个分组内的文章按发布时间降序排序
  Object.keys(grouped).forEach(key => {
    grouped[key].sort((a, b) => b.pubTime.getTime() - a.pubTime.getTime());
  });

  return grouped;
}

/**
 * 按发布时间对文章进行排序
 */
export function sortFeedsByTime(feeds: FlatFeed[], ascending = false): FlatFeed[] {
  return [...feeds].sort((a, b) => {
    const diff = a.pubTime.getTime() - b.pubTime.getTime();
    return ascending ? diff : -diff;
  });
}

/**
 * 过滤文章
 */
export function filterFeeds(
  feeds: FlatFeed[],
  filters: {
    category?: string;
    source?: string;
    searchQuery?: string;
    readStatus?: ReadStatusFilter;
  },
  readFeedLinks?: Set<string>
): FlatFeed[] {
  return feeds.filter(feed => {
    // 分类过滤
    if (filters.category && feed.category !== filters.category) {
      return false;
    }

    // 来源过滤
    if (filters.source && feed.source !== filters.source) {
      return false;
    }

    // 搜索过滤
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchTitle = feed.title.toLowerCase().includes(query);
      const matchContent = feed.content?.toLowerCase().includes(query);
      const matchSummary = feed.summary?.toLowerCase().includes(query);
      
      if (!matchTitle && !matchContent && !matchSummary) {
        return false;
      }
    }

    // 已读状态过滤
    if (filters.readStatus && filters.readStatus !== 'all' && readFeedLinks) {
      const isRead = readFeedLinks.has(feed.link);
      if (filters.readStatus === 'read' && !isRead) {
        return false;
      }
      if (filters.readStatus === 'unread' && isRead) {
        return false;
      }
    }

    return true;
  });
}

/**
 * 获取所有唯一的分类
 */
export function getUniqueCategories(feeds: FlatFeed[]): string[] {
  const categories = new Set<string>();
  feeds.forEach(feed => {
    if (feed.category) {
      categories.add(feed.category);
    }
  });
  return Array.from(categories).sort();
}

/**
 * 获取所有唯一的来源
 */
export function getUniqueSources(feeds: FlatFeed[]): string[] {
  const sources = new Set<string>();
  feeds.forEach(feed => {
    sources.add(feed.source);
  });
  return Array.from(sources).sort();
}
