'use client';
import ThemeToggle from '@/components/ui/ThemeToggle';

/**
 * 顶部导航栏组件
 */
interface HeaderProps {
  onAddFeed?: () => void;
}

export default function Header({ onAddFeed }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo 和标题 */}
          <div className="flex items-center gap-3">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">feed-nextweb</h1>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
             <ThemeToggle />
            {onAddFeed && (
              <button
                onClick={onAddFeed}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">添加订阅</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
