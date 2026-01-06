/**
 * RSS Feed 文章类型定义
 */
export interface Feed {
  labels: FeedLabels;
  time: string; // ISO 8601 格式时间戳
}

/**
 * Feed Labels 结构（后端返回的嵌套结构）
 */
export interface FeedLabels {
  category?: string;
  content?: string;
  link: string;
  pub_time: string; // ISO 8601 格式
  source: string;
  summary?: string;
  summary_html_snippet?: string;
  tags?: string;
  title: string;
  type: string;
}

/**
 * 前端扁平化的 Feed 数据结构
 */
export interface FlatFeed {
  id: string; // 使用 link 作为唯一标识
  title: string;
  link: string;
  source: string;
  category?: string;
  content?: string;
  summary?: string;
  summaryHtml?: string;
  tags?: string[];
  pubTime: Date;
  fetchTime: Date;
  type: string;
}

/**
 * RSS 订阅源类型定义
 */
export interface FeedSource {
  name: string; // 必填，唯一
  rss: RSSConfig;
  interval?: string; // 抓取间隔，如 "1h30m"
  labels?: Record<string, string>; // 自定义标签
}

/**
 * RSS 配置（url 和 rsshub_route_path 二选一）
 */
export interface RSSConfig {
  url?: string; // 直接的 RSS feed URL
  rsshub_route_path?: string; // RSSHub 路由路径
}

/**
 * 查询文章请求参数
 */
export interface QueryFeedsRequest {
  start: string; // ISO 8601 格式
  end: string; // ISO 8601 格式
  limit?: number;
  query?: string;
  summarize?: boolean;
  label_filters?: LabelFilters; // Label 筛选
}

/**
 * Label 筛选条件
 */
export interface LabelFilters {
  category?: string;
  source?: string;
  [key: string]: string | undefined;
}

/**
 * 查询文章响应
 */
export interface QueryFeedsResponse {
  feeds: Feed[];
  count: number;
}

/**
 * 添加订阅源请求
 */
export interface AddFeedSourceRequest {
  source: FeedSource;
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
