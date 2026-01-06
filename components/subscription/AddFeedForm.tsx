'use client';

import { useState } from 'react';
import { addFeedSource } from '@/lib/api-client';

/**
 * 添加订阅表单组件
 */
interface AddFeedFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddFeedForm({ onSuccess, onCancel }: AddFeedFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    rssUrl: '',
    rsshubPath: '',
    category: '',
    interval: '1h',
  });
  const [useRssHub, setUseRssHub] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 验证
    if (!formData.name.trim()) {
      setError('请输入订阅源名称');
      return;
    }

    if (!useRssHub && !formData.rssUrl.trim()) {
      setError('请输入 RSS URL');
      return;
    }

    if (useRssHub && !formData.rsshubPath.trim()) {
      setError('请输入 RSSHub 路径');
      return;
    }

    setIsSubmitting(true);

    try {
      await addFeedSource({
        source: {
          name: formData.name.trim(),
          rss: useRssHub
            ? { rsshub_route_path: formData.rsshubPath.trim() }
            : { url: formData.rssUrl.trim() },
          interval: formData.interval,
          labels: formData.category.trim()
            ? { category: formData.category.trim() }
            : undefined,
        },
      });

      // 重置表单
      setFormData({
        name: '',
        rssUrl: '',
        rsshubPath: '',
        category: '',
        interval: '1h',
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加订阅源失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">添加订阅源</h2>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* 订阅源名称 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              订阅源名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：技术博客"
              disabled={isSubmitting}
            />
          </div>

          {/* RSS 类型切换 */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!useRssHub}
                onChange={() => setUseRssHub(false)}
                className="w-4 h-4 text-blue-600"
                disabled={isSubmitting}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">RSS URL</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={useRssHub}
                onChange={() => setUseRssHub(true)}
                className="w-4 h-4 text-blue-600"
                disabled={isSubmitting}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">RSSHub 路径</span>
            </label>
          </div>

          {/* RSS URL 或 RSSHub 路径 */}
          {!useRssHub ? (
            <div>
              <label htmlFor="rssUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                RSS URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="rssUrl"
                value={formData.rssUrl}
                onChange={(e) => setFormData({ ...formData, rssUrl: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/feed.xml"
                disabled={isSubmitting}
              />
            </div>
          ) : (
            <div>
              <label htmlFor="rsshubPath" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                RSSHub 路径 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="rsshubPath"
                value={formData.rsshubPath}
                onChange={(e) => setFormData({ ...formData, rsshubPath: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="/github/issue/DIYgod/RSSHub"
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                例如：/github/issue/DIYgod/RSSHub
              </p>
            </div>
          )}

          {/* 分类 */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              分类（可选）
            </label>
            <input
              type="text"
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：技术、新闻"
              disabled={isSubmitting}
            />
          </div>

          {/* 抓取间隔 */}
          <div>
            <label htmlFor="interval" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              抓取间隔
            </label>
            <select
              id="interval"
              value={formData.interval}
              onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="30m">30 分钟</option>
              <option value="1h">1 小时</option>
              <option value="2h">2 小时</option>
              <option value="6h">6 小时</option>
              <option value="12h">12 小时</option>
              <option value="24h">24 小时</option>
            </select>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3 pt-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                取消
              </button>
            )}
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? '添加中...' : '添加订阅'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
