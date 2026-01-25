'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { FeedProvider, useFeed } from '@/context/FeedContext';
import { getRecentFeeds } from '@/lib/api-client';
import { filterFeeds, groupFeeds, getUniqueCategories, getUniqueSources } from '@/lib/grouping';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import Header from '@/components/layout/Header';
import MainLayout from '@/components/layout/MainLayout';
import FilterBar from '@/components/filter/FilterBar';
import FeedList from '@/components/feed/FeedList';
import FeedDetail from '@/components/feed/FeedDetail';
import AddFeedForm from '@/components/subscription/AddFeedForm';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Toast from '@/components/ui/Toast';
import GroupSelector from '@/components/filter/GroupSelector';
import ReadStatusSelector from '@/components/filter/ReadStatusSelector';

/**
 * RSS 阅读器主页面组件
 */
 function RSSReaderContent() {
   const {
     state,
     setFeeds,
     appendFeeds,
     setPagination,
     setSelectedFeed,
     setGroupBy,
     setCategoryFilter,
     setSourceFilter,
     setSearchQuery,
     setReadStatusFilter,
     markAsRead,
     setLoading,
     setError
   } = useFeed();
   const [showAddFeedForm, setShowAddFeedForm] = useState(false);
   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
   const [loadingMore, setLoadingMore] = useState(false);
   const isDesktop = useIsDesktop();
   const feedListScrollRef = useRef<HTMLDivElement>(null);
   const isLoadingRef = useRef(false); // 用于立即标记加载状态，避免重复请求

   // 加载更多文章
   const loadMoreFeeds = useCallback(async () => {
     if (isLoadingRef.current || loadingMore || !state.hasMore) return;

     isLoadingRef.current = true;
     setLoadingMore(true);
     try {
       const result = await getRecentFeeds(20, state.nextCursor);
       appendFeeds(result.feeds);
       setPagination(result.hasMore, result.nextCursor);
     } catch (err) {
       console.error('加载更多文章失败:', err);
       setToast({ message: '加载更多失败', type: 'error' });
     } finally {
       setLoadingMore(false);
       isLoadingRef.current = false;
     }
   }, [loadingMore, state.hasMore, state.nextCursor, appendFeeds, setPagination]);

   // 监听滚动事件，实现无限滚动
   useEffect(() => {
     const scrollContainer = feedListScrollRef.current;
     if (!scrollContainer) return;

     const handleScroll = () => {
       if (loadingMore || !state.hasMore) return;

       const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
       // 当滚动到距离底部 200px 时加载更多
       if (scrollHeight - scrollTop - clientHeight < 200) {
         loadMoreFeeds();
       }
     };

     scrollContainer.addEventListener('scroll', handleScroll);
     return () => scrollContainer.removeEventListener('scroll', handleScroll);
   }, [loadingMore, state.hasMore, loadMoreFeeds]);

   // 初始加载文章数据
   useEffect(() => {
     const loadFeeds = async () => {
       setLoading(true);
       try {
         const result = await getRecentFeeds(20);
         setFeeds(result.feeds);
         setPagination(result.hasMore, result.nextCursor);
         // 桌面端自动选中第一篇文章，移动端不选中
         if (result.feeds.length > 0 && isDesktop) {
           setSelectedFeed(result.feeds[0]);
         }
       } catch (err) {
         setError(err instanceof Error ? err.message : '加载文章失败');
       } finally {
         setLoading(false);
       }
     };

     loadFeeds();
   }, [setFeeds, setPagination, setSelectedFeed, setLoading, setError, isDesktop]);

  // 获取筛选后的文章
  const filteredFeeds = useMemo(() => {
    return filterFeeds(state.feeds, state.filters, state.readFeedLinks);
  }, [state.feeds, state.filters, state.readFeedLinks]);

  // 获取分组后的文章
  const groupedFeeds = useMemo(() => {
    return groupFeeds(filteredFeeds, state.groupBy);
  }, [filteredFeeds, state.groupBy]);

  // 获取所有分类和来源
  const categories = useMemo(() => getUniqueCategories(state.feeds), [state.feeds]);
  const sources = useMemo(() => getUniqueSources(state.feeds), [state.feeds]);

  // 获取当前文章的索引和导航信息
  const currentFeedIndex = useMemo(() => {
    if (!state.selectedFeed) return -1;
    return filteredFeeds.findIndex(feed => feed.id === state.selectedFeed?.id);
  }, [filteredFeeds, state.selectedFeed]);

  const hasPrevious = currentFeedIndex > 0;
  const hasNext = currentFeedIndex >= 0 && currentFeedIndex < filteredFeeds.length - 1;

  // 选择文章并标记为已读
  const handleSelectFeed = (feed: any) => {
    setSelectedFeed(feed);
    markAsRead(feed.link);
  };

  // 导航到上一篇
  const handlePrevious = () => {
    if (hasPrevious) {
      const prevFeed = filteredFeeds[currentFeedIndex - 1];
      setSelectedFeed(prevFeed);
      markAsRead(prevFeed.link);
    }
  };

  // 导航到下一篇
  const handleNext = () => {
    if (hasNext) {
      const nextFeed = filteredFeeds[currentFeedIndex + 1];
      setSelectedFeed(nextFeed);
      markAsRead(nextFeed.link);
    }
  };

  // 处理添加订阅成功
  const handleAddFeedSuccess = () => {
    setShowAddFeedForm(false);
    setToast({ message: '订阅源添加成功！', type: 'success' });
    // 重新加载文章
    setTimeout(async () => {
      try {
        const result = await getRecentFeeds(20);
        setFeeds(result.feeds);
        setPagination(result.hasMore, result.nextCursor);
      } catch (err) {
        console.error('重新加载文章失败:', err);
      }
    }, 1000);
  };

  // 处理重试
  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getRecentFeeds(20);
      setFeeds(result.feeds);
      setPagination(result.hasMore, result.nextCursor);
      // 桌面端自动选中第一篇文章，移动端不选中
      if (result.feeds.length > 0 && isDesktop) {
        setSelectedFeed(result.feeds[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载文章失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* 顶部导航栏 */}
      <Header onAddFeed={() => setShowAddFeedForm(true)} />

      {/* 主内容区 */}
      {state.loading ? (
        <Loading />
      ) : state.error ? (
        <ErrorMessage message={state.error} onRetry={handleRetry} />
      ) : (
        <MainLayout
          showMain={!!state.selectedFeed}
          nav={
             <div className="flex flex-col h-full p-4 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">视图</h3>
                  <GroupSelector groupBy={state.groupBy} onGroupByChange={setGroupBy} vertical />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">筛选</h3>
                  
                  {/* 已读状态筛选 */}
                  <div>
                    <ReadStatusSelector
                      readStatus={state.filters.readStatus || 'all'}
                      onReadStatusChange={setReadStatusFilter}
                      vertical
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* 分类筛选 */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="category" className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        分类
                      </label>
                      <select
                        id="category"
                        value={state.filters.category || ''}
                        onChange={(e) => setCategoryFilter(e.target.value || undefined)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-200"
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
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="source" className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        来源
                      </label>
                      <select
                        id="source"
                        value={state.filters.source || ''}
                        onChange={(e) => setSourceFilter(e.target.value || undefined)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-200"
                      >
                        <option value="">全部</option>
                        {sources.map((source) => (
                          <option key={source} value={source}>
                            {source}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
             </div>
          }
          sidebar={
            <div className="flex flex-col h-full">
              {/* 筛选栏 */}
              <FilterBar
                onSearch={setSearchQuery}
                categories={categories}
                sources={sources}
                selectedCategory={state.filters.category}
                selectedSource={state.filters.source}
                selectedReadStatus={state.filters.readStatus}
                groupBy={state.groupBy}
                onCategoryChange={setCategoryFilter}
                onSourceChange={setSourceFilter}
                onReadStatusChange={setReadStatusFilter}
                onGroupByChange={setGroupBy}
                scrollContainerRef={feedListScrollRef}
              />
              {/* 文章列表 */}
              <div
                ref={feedListScrollRef}
                className="flex-1 overflow-y-auto bg-white dark:bg-gray-900"
              >
                <FeedList
                  feeds={filteredFeeds}
                  groupedFeeds={groupedFeeds}
                  selectedFeedId={state.selectedFeed?.id}
                  onSelectFeed={handleSelectFeed}
                  isGrouped={state.groupBy !== 'none'}
                  readFeedLinks={state.readFeedLinks}
                />
                {/* 加载更多指示器 */}
                {loadingMore && (
                  <div className="flex items-center justify-center py-4 text-gray-500 dark:text-gray-400">
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    加载更多...
                  </div>
                )}
                {/* 没有更多数据提示 */}
                {!state.loading && !loadingMore && !state.hasMore && state.feeds.length > 0 && (
                  <div className="flex items-center justify-center py-4 text-gray-400 dark:text-gray-500 text-sm">
                    没有更多文章了
                  </div>
                )}
              </div>
            </div>
          }
          main={
            <FeedDetail
              feed={state.selectedFeed}
              onBack={() => setSelectedFeed(null)}
              onPrevious={handlePrevious}
              onNext={handleNext}
              hasPrevious={hasPrevious}
              hasNext={hasNext}
            />
          }
        />
      )}

      {/* 添加订阅表单 */}
      {showAddFeedForm && (
        <AddFeedForm
          onSuccess={handleAddFeedSuccess}
          onCancel={() => setShowAddFeedForm(false)}
        />
      )}

      {/* Toast 提示 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

/**
 * 主页面（包含 Provider）
 */
export default function Home() {
  return (
    <FeedProvider>
      <RSSReaderContent />
    </FeedProvider>
  );
}
