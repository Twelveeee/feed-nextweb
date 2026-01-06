import DOMPurify from 'isomorphic-dompurify';
import { Feed, FlatFeed } from '@/types';

/**
 * 将后端返回的 Feed 转换为前端扁平化结构
 */
export function adaptFeed(feed: Feed): FlatFeed {
  const { labels, time } = feed;
  
  return {
    id: labels.link,
    title: labels.title,
    link: labels.link,
    source: labels.source,
    category: labels.category,
    content: labels.content,
    summary: labels.summary,
    summaryHtml: labels.summary_html_snippet 
      ? sanitizeHtml(labels.summary_html_snippet) 
      : undefined,
    tags: labels.tags ? labels.tags.split(',').map(tag => tag.trim()) : undefined,
    pubTime: new Date(labels.pub_time),
    fetchTime: new Date(time),
    type: labels.type,
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
