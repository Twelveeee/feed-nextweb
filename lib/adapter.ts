import DOMPurify from 'isomorphic-dompurify';
import { Feed, FlatFeed } from '@/types';

/**
 * 将后端返回的 Feed 转换为前端扁平化结构
 */
export function adaptFeed(feed: Feed): FlatFeed {
  return {
    id: feed.id,
    sourceId: feed.source_id,
    title: feed.generated_title || feed.title,
    generatedTitle: feed.generated_title,
    link: feed.link,
    source: feed.source.source,
    sourceName: feed.source.name,
    category: feed.source.category,
    score: feed.score,
    summary: feed.summary,
    summaryHtml: feed.summary_html
      ? sanitizeHtml(feed.summary_html)
      : undefined,
    pubTime: new Date(feed.pub_time),
    createdAt: new Date(feed.created_at),
  };
}

/**
 * 批量转换 Feeds
 */
export function adaptFeeds(feeds: Feed[]): FlatFeed[] {
  return feeds.map(adaptFeed);
}

/**
 * 清洗 HTML 内容，防止 XSS 攻击
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'code', 'pre',
      'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'title',
      'class', 'style',
    ],
    ALLOW_DATA_ATTR: false,
  });
}
