/**
 * 统一 API 响应结构
 */
export interface ApiResponse<T = any> {
  errno: number;
  errmsg: string;
  data: T | null;
}

/**
 * 后端返回的 Feed 数据结构
 */
export interface Feed {
  id: number;
  source_id: number;
  title: string;
  link: string;
  pub_time: string; // ISO 8601 格式
  generated_title?: string;
  score?: number;
  summary?: string;
  summary_html?: string;
  created_at: string; // ISO 8601 格式
  source: FeedSource;
}

/**
 * 订阅源信息
 */
export interface FeedSource {
  id: number;
  name: string;
  category?: string;
  source: string;
}

/**
 * 前端扁平化的 Feed 数据结构
 */
export interface FlatFeed {
  id: number;
  sourceId: number;
  title: string;
  generatedTitle?: string;
  link: string;
  source: string;
  sourceName: string;
  category?: string;
  score?: number;
  summary?: string;
  summaryHtml?: string;
  pubTime: Date;
  createdAt: Date;
  isRead?: boolean; // 已读状态（前端计算）
}

/**
 * 添加订阅源请求参数
 */
export interface AddFeedSourceParams {
  name: string;
  url: string;
  category?: string;
  enabled?: boolean;
}

/**
 * 查询文章请求参数
 */
export interface QueryFeedsRequest {
  source_id?: number;
  categories?: string[];
  sources?: string[];
  min_score?: number;
  max_score?: number;
  start_at?: string; // ISO 8601 格式
  end_at?: string; // ISO 8601 格式
  limit?: number;
  cursor?: string; // 游标分页
}

/**
 * 查询文章响应
 */
export interface QueryFeedsResponse {
  feeds: Feed[];
  has_more: boolean;
  next_cursor?: string;
}

/**
 * 订阅源选项响应
 */
export interface SourcesOptionsResponse {
  categories: string[];
  sources: string[];
}

/**
 * 分组类型
 */
export type GroupByType = 'none' | 'category' | 'source' | 'hour';

/**
 * 分组后的数据结构
 */
export interface GroupedFeeds {
  [key: string]: FlatFeed[];
}

/**
 * 已读状态筛选类型
 */
export type ReadStatusFilter = 'all' | 'read' | 'unread';
