'use client';

import { ReadStatusFilter } from '@/types';

/**
 * 已读状态选择器组件
 */
interface ReadStatusSelectorProps {
  readStatus: ReadStatusFilter;
  onReadStatusChange: (status: ReadStatusFilter) => void;
  vertical?: boolean;
}

export default function ReadStatusSelector({ 
  readStatus, 
  onReadStatusChange, 
  vertical = false 
}: ReadStatusSelectorProps) {
  const options: { value: ReadStatusFilter; label: string; icon: string }[] = [
    { value: 'all', label: '全部', icon: 'M4 6h16M4 12h16M4 18h16' },
    { value: 'unread', label: '未读', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { value: 'read', label: '已读', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  if (vertical) {
    return (
      <div className="flex flex-col gap-1 w-full">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onReadStatusChange(option.value)}
            className={`
              flex items-center w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left
              ${
                readStatus === option.value
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
      <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">状态：</span>
      <div className="flex gap-1">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onReadStatusChange(option.value)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${
                readStatus === option.value
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
