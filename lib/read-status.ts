/**
 * 已读状态管理工具
 * 使用 localStorage 存储，自动清理7天前的记录
 */

const READ_STATUS_KEY = 'feed_read_status';
const EXPIRY_DAYS = 7;

/**
 * 已读记录结构
 */
interface ReadRecord {
  link: string; // 使用文章链接作为唯一标识
  readAt: number; // 时间戳
}

/**
 * 获取所有已读记录
 */
function getAllReadRecords(): ReadRecord[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(READ_STATUS_KEY);
    if (!data) return [];
    return JSON.parse(data) as ReadRecord[];
  } catch (error) {
    console.error('读取已读状态失败:', error);
    return [];
  }
}

/**
 * 保存已读记录
 */
function saveReadRecords(records: ReadRecord[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(READ_STATUS_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('保存已读状态失败:', error);
  }
}

/**
 * 清理过期的已读记录（超过7天）
 */
function cleanExpiredRecords(records: ReadRecord[]): ReadRecord[] {
  const now = Date.now();
  const expiryTime = EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 7天的毫秒数
  
  return records.filter(record => {
    return now - record.readAt < expiryTime;
  });
}

/**
 * 标记文章为已读
 */
export function markAsRead(link: string): void {
  let records = getAllReadRecords();
  
  // 清理过期记录
  records = cleanExpiredRecords(records);
  
  // 检查是否已存在
  const existingIndex = records.findIndex(r => r.link === link);
  
  if (existingIndex >= 0) {
    // 更新时间
    records[existingIndex].readAt = Date.now();
  } else {
    // 添加新记录
    records.push({
      link,
      readAt: Date.now(),
    });
  }
  
  saveReadRecords(records);
}

/**
 * 检查文章是否已读
 */
export function isRead(link: string): boolean {
  let records = getAllReadRecords();
  
  // 清理过期记录
  records = cleanExpiredRecords(records);
  
  return records.some(r => r.link === link);
}

/**
 * 获取所有已读文章的链接集合
 */
export function getReadFeedLinks(): Set<string> {
  let records = getAllReadRecords();
  
  // 清理过期记录
  records = cleanExpiredRecords(records);
  
  // 保存清理后的记录
  saveReadRecords(records);
  
  return new Set(records.map(r => r.link));
}

/**
 * 标记多篇文章为已读
 */
export function markMultipleAsRead(links: string[]): void {
  let records = getAllReadRecords();
  
  // 清理过期记录
  records = cleanExpiredRecords(records);
  
  const now = Date.now();
  const existingLinks = new Set(records.map(r => r.link));
  
  // 添加新的已读记录
  links.forEach(link => {
    if (!existingLinks.has(link)) {
      records.push({
        link,
        readAt: now,
      });
    }
  });
  
  saveReadRecords(records);
}

/**
 * 清除所有已读记录
 */
export function clearAllReadStatus(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(READ_STATUS_KEY);
  } catch (error) {
    console.error('清除已读状态失败:', error);
  }
}

/**
 * 标记文章为未读
 */
export function markAsUnread(link: string): void {
  let records = getAllReadRecords();
  
  // 清理过期记录
  records = cleanExpiredRecords(records);
  
  // 移除该文章的已读记录
  records = records.filter(r => r.link !== link);
  
  saveReadRecords(records);
}
