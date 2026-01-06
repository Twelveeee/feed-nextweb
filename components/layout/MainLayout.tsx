'use client';

import { ReactNode } from 'react';

/**
 * 主布局组件 - 响应式双栏布局
 * 移动端：单栏列表视图
 * 桌面端（≥1024px）：双栏布局（左侧列表 40%，右侧详情 60%）
 */
interface MainLayoutProps {
  nav?: ReactNode;
  sidebar: ReactNode;
  main: ReactNode;
  showMain?: boolean; // 移动端是否显示主内容区
}

export default function MainLayout({ nav, sidebar, main, showMain = false }: MainLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden">
      {/* 桌面端导航栏 (最左侧) */}
      {nav && (
        <nav className="hidden lg:flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-y-auto shrink-0">
          {nav}
        </nav>
      )}

      {/* 侧边栏 - 文章列表 */}
      <aside
        className={`
          w-full lg:w-96
          border-r border-gray-200 dark:border-gray-700
          overflow-y-auto bg-white dark:bg-gray-900
          ${showMain ? 'hidden lg:block' : 'block'}
        `}
      >
        {sidebar}
      </aside>

      {/* 主内容区 - 文章详情 */}
      <main
        className={`
          flex-1
          overflow-y-auto
          bg-white dark:bg-gray-800
          ${showMain ? 'block' : 'hidden lg:block'}
        `}
      >
        {main}
      </main>
    </div>
  );
}
