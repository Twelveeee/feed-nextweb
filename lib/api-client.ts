import {
  QueryFeedsRequest,
  QueryFeedsResponse,
  AddFeedSourceParams,
  SourcesOptionsResponse,
  FlatFeed,
  ApiResponse,
} from '@/types';
import { adaptFeeds } from './adapter';

/**
 * 处理 API 响应
 */
function handleApiResponse<T>(result: ApiResponse<T>): T {
  if (result.errno !== 0) {
    throw new Error(`[${result.errno}] ${result.errmsg}`);
  }
  if (result.data === null) {
    throw new Error('响应数据为空');
  }
  return result.data;
}

/**
 * 查询文章列表（支持游标分页）
 */
export async function queryFeeds(params: QueryFeedsRequest): Promise<{
  feeds: FlatFeed[];
  hasMore: boolean;
  nextCursor?: string;
}> {
  const response = await fetch('/api/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const result: ApiResponse<QueryFeedsResponse> = await response.json();
  const data = handleApiResponse(result);

  return {
    feeds: adaptFeeds(data.feeds),
    hasMore: data.has_more,
    nextCursor: data.next_cursor,
  };
}

/**
 * 添加RSS订阅源
 */
export async function addFeedSource(params: AddFeedSourceParams): Promise<number> {
  const response = await fetch('/api/add-feed-source', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const result: ApiResponse<{ id: number }> = await response.json();
  const data = handleApiResponse(result);

  return data.id;
}

/**
 * 获取订阅源选项（分类和来源列表）
 */
export async function getSourcesOptions(): Promise<SourcesOptionsResponse> {
  const response = await fetch('/api/sources/options', {
    method: 'GET',
  });

  const result: ApiResponse<SourcesOptionsResponse> = await response.json();
  return handleApiResponse(result);
}

/**
 * 获取最近的文章（简化版）
 */
export async function getRecentFeeds(
  limit: number = 20,
  cursor?: string
): Promise<{
  feeds: FlatFeed[];
  hasMore: boolean;
  nextCursor?: string;
}> {
  return queryFeeds({
    limit,
    cursor,
  });
}
