'use client';

import SearchBox from './SearchBox';
import GroupSelector from './GroupSelector';
import { GroupByType } from '@/types';

/**
 * 筛选栏组件
 */
interface FilterBarProps {
  categories: string[];
  sources: string[];
  selectedCategory?: string;
  selectedSource?: string;
  groupBy: GroupByType;
  onCategoryChange: (category: string | undefined) => void;
  onSourceChange: (source: string | undefined) => void;
  onGroupByChange: (groupBy: GroupByType) => void;
  onSearch: (query: string) => void;
}

export default function FilterBar({
  categories,
  sources,
  selectedCategory,
  selectedSource,
  groupBy,
  onCategoryChange,
  onSourceChange,
  onGroupByChange,
  onSearch,
}: FilterBarProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 space-y-4">
      {/* 搜索框 - PC和移动端都显示 */}
      <SearchBox onSearch={onSearch} />

      {/* 筛选器和分组 - 只在移动端显示 */}
      <div className="flex flex-col gap-4 lg:hidden">
        {/* 分类筛选 */}
        <div className="flex items-center gap-2">
          <label htmlFor="category" className="text-sm text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
            分类：
          </label>
          <select
            id="category"
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange(e.target.value || undefined)}
            className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* 来源筛选 */}
        <div className="flex items-center gap-2">
          <label htmlFor="source" className="text-sm text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
            来源：
          </label>
          <select
            id="source"
            value={selectedSource || ''}
            onChange={(e) => onSourceChange(e.target.value || undefined)}
            className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        {/* 分组选择器 */}
        <div>
          <GroupSelector groupBy={groupBy} onGroupByChange={onGroupByChange} />
        </div>
      </div>
    </div>
  );
}
