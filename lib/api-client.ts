import {
  QueryFeedsRequest,
  QueryFeedsResponse,
  AddFeedSourceRequest,
  FlatFeed,
} from '@/types';
import { adaptFeeds } from './adapter';

/**
 * 查询文章列表
 */
export async function queryFeeds(params: QueryFeedsRequest): Promise<FlatFeed[]> {
  const response = await fetch('/api/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '获取文章失败');
  }

  const data: QueryFeedsResponse = await response.json();
  const feeds = adaptFeeds(data.feeds);
  
  const uniqueFeedsMap = new Map<string, FlatFeed>();
  
  for (const feed of feeds) {
    const existing = uniqueFeedsMap.get(feed.id);
    if (!existing) {
      uniqueFeedsMap.set(feed.id, feed);
    } else {
      // 如果已存在，比较发布时间，保留较新的
      if (new Date(feed.pubTime) > new Date(existing.pubTime)) {
        uniqueFeedsMap.set(feed.id, feed);
      }
    }
  }

  // 将 Map 转回数组，并按时间倒序排序
  return Array.from(uniqueFeedsMap.values()).sort((a, b) =>
    new Date(b.pubTime).getTime() - new Date(a.pubTime).getTime()
  );
}

/**
 * 添加RSS订阅源
 */
export async function addFeedSource(params: AddFeedSourceRequest): Promise<void> {
  const response = await fetch('/api/add-feed-source', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '添加订阅源失败');
  }
}

/**
 * 获取最近N天的文章
 */
export async function getRecentFeeds(days: number = 1, limit: number = 500): Promise<FlatFeed[]> {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);

  return queryFeeds({
    start: start.toISOString(),
    end: end.toISOString(),
    limit,
    query: '',
    summarize: false,
  });
}
