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
  return adaptFeeds(data.feeds);
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
export async function getRecentFeeds(days: number = 1, limit: number = 100): Promise<FlatFeed[]> {
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
