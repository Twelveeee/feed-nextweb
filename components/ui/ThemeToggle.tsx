'use client';

import { useTheme } from '@/context/ThemeContext';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 避免服务端渲染不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
      <button
        onClick={() => setTheme('light')}
        className={`
          relative group p-1.5 rounded-md transition-all
          ${theme === 'light'
            ? 'bg-white text-yellow-500 shadow-sm dark:bg-gray-700'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}
        `}
        aria-label="切换到浅色模式"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
          浅色模式
        </span>
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`
          relative group p-1.5 rounded-md transition-all
          ${theme === 'dark' 
            ? 'bg-white text-blue-500 shadow-sm dark:bg-gray-700' 
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}
        `}
        aria-label="切换到深色模式"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
          深色模式
        </span>
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`
          relative group p-1.5 rounded-md transition-all
          ${theme === 'system' 
            ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100' 
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}
        `}
        aria-label="跟随系统"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
          跟随系统
        </span>
      </button>
    </div>
  );
}
