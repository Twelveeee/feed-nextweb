'use client';

import { GroupByType } from '@/types';

/**
 * 分组选择器组件
 */
interface GroupSelectorProps {
  groupBy: GroupByType;
  onGroupByChange: (groupBy: GroupByType) => void;
  vertical?: boolean;
}

export default function GroupSelector({ groupBy, onGroupByChange, vertical = false }: GroupSelectorProps) {
  const options: { value: GroupByType; label: string; icon: string }[] = [
    { value: 'none', label: '不分组', icon: 'M4 6h16M4 12h16M4 18h16' },
    { value: 'category', label: '按分类', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
    { value: 'source', label: '按来源', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { value: 'hour', label: '按时间', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  if (vertical) {
    return (
      <div className="flex flex-col gap-1 w-full">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onGroupByChange(option.value)}
            className={`
              flex items-center w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left
              ${
                groupBy === option.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
            </svg>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">分组：</span>
      <div className="flex gap-1">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onGroupByChange(option.value)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${
                groupBy === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
            </svg>
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
