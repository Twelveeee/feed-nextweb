'use client';

import { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { FlatFeed, GroupByType, ReadStatusFilter } from '@/types';
import { markAsRead as markFeedAsRead, getReadFeedLinks } from '@/lib/read-status';

/**
 * Feed 状态类型
 */
interface FeedState {
  feeds: FlatFeed[];
  selectedFeed: FlatFeed | null;
  groupBy: GroupByType;
  filters: {
    category?: string;
    source?: string;
    searchQuery?: string;
    readStatus?: ReadStatusFilter;
  };
  loading: boolean;
  error: string | null;
  readFeedLinks: Set<string>; // 已读文章链接集合
  hasMore: boolean; // 是否还有更多数据
  nextCursor?: string; // 下一页游标
}

/**
 * Feed 操作类型
 */
type FeedAction =
  | { type: 'SET_FEEDS'; payload: FlatFeed[] }
  | { type: 'APPEND_FEEDS'; payload: FlatFeed[] }
  | { type: 'SET_PAGINATION'; payload: { hasMore: boolean; nextCursor?: string } }
  | { type: 'SET_SELECTED_FEED'; payload: FlatFeed | null }
  | { type: 'SET_GROUP_BY'; payload: GroupByType }
  | { type: 'SET_CATEGORY_FILTER'; payload: string | undefined }
  | { type: 'SET_SOURCE_FILTER'; payload: string | undefined }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_READ_STATUS_FILTER'; payload: ReadStatusFilter | undefined }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'REFRESH_READ_STATUS' }
  | { type: 'RESET_FILTERS' };

/**
 * 初始状态
 */
const initialState: FeedState = {
  feeds: [],
  selectedFeed: null,
  groupBy: 'none',
  filters: { readStatus: 'all' },
  loading: false,
  error: null,
  readFeedLinks: new Set(),
  hasMore: false,
  nextCursor: undefined,
};

/**
 * 去重辅助函数 - 基于 link 去重
 */
function deduplicateFeeds(feeds: FlatFeed[]): FlatFeed[] {
  const seen = new Set<string>();
  return feeds.filter(feed => {
    if (seen.has(feed.link)) {
      return false;
    }
    seen.add(feed.link);
    return true;
  });
}

/**
 * Reducer 函数
 */
function feedReducer(state: FeedState, action: FeedAction): FeedState {
  switch (action.type) {
    case 'SET_FEEDS':
      return { ...state, feeds: deduplicateFeeds(action.payload), error: null };
    case 'APPEND_FEEDS':
      // 合并后去重，保留最早出现的 feed
      return { ...state, feeds: deduplicateFeeds([...state.feeds, ...action.payload]), error: null };
    case 'SET_PAGINATION':
      return {
        ...state,
        hasMore: action.payload.hasMore,
        nextCursor: action.payload.nextCursor,
      };
    case 'SET_SELECTED_FEED':
      return { ...state, selectedFeed: action.payload };
    case 'SET_GROUP_BY':
      return { ...state, groupBy: action.payload };
    case 'SET_CATEGORY_FILTER':
      return {
        ...state,
        filters: { ...state.filters, category: action.payload },
      };
    case 'SET_SOURCE_FILTER':
      return {
        ...state,
        filters: { ...state.filters, source: action.payload },
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        filters: { ...state.filters, searchQuery: action.payload },
      };
    case 'SET_READ_STATUS_FILTER':
      return {
        ...state,
        filters: { ...state.filters, readStatus: action.payload || 'all' },
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'MARK_AS_READ':
      markFeedAsRead(action.payload);
      return {
        ...state,
        readFeedLinks: new Set([...state.readFeedLinks, action.payload]),
      };
    case 'REFRESH_READ_STATUS':
      return {
        ...state,
        readFeedLinks: getReadFeedLinks(),
      };
    case 'RESET_FILTERS':
      return { ...state, filters: { readStatus: 'all' }, groupBy: 'none' };
    default:
      return state;
  }
}

/**
 * Context 类型
 */
interface FeedContextType {
  state: FeedState;
  setFeeds: (feeds: FlatFeed[]) => void;
  appendFeeds: (feeds: FlatFeed[]) => void;
  setPagination: (hasMore: boolean, nextCursor?: string) => void;
  setSelectedFeed: (feed: FlatFeed | null) => void;
  setGroupBy: (groupBy: GroupByType) => void;
  setCategoryFilter: (category: string | undefined) => void;
  setSourceFilter: (source: string | undefined) => void;
  setSearchQuery: (query: string) => void;
  setReadStatusFilter: (status: ReadStatusFilter | undefined) => void;
  markAsRead: (link: string) => void;
  refreshReadStatus: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetFilters: () => void;
}

/**
 * 创建 Context
 */
const FeedContext = createContext<FeedContextType | undefined>(undefined);

/**
 * Provider 组件
 */
export function FeedProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(feedReducer, initialState);

  // 初始化时加载已读状态
  useEffect(() => {
    dispatch({ type: 'REFRESH_READ_STATUS' });
  }, []);

  const setFeeds = useCallback((feeds: FlatFeed[]) => {
    dispatch({ type: 'SET_FEEDS', payload: feeds });
  }, []);

  const appendFeeds = useCallback((feeds: FlatFeed[]) => {
    dispatch({ type: 'APPEND_FEEDS', payload: feeds });
  }, []);

  const setPagination = useCallback((hasMore: boolean, nextCursor?: string) => {
    dispatch({ type: 'SET_PAGINATION', payload: { hasMore, nextCursor } });
  }, []);

  const setSelectedFeed = useCallback((feed: FlatFeed | null) => {
    dispatch({ type: 'SET_SELECTED_FEED', payload: feed });
  }, []);

  const setGroupBy = useCallback((groupBy: GroupByType) => {
    dispatch({ type: 'SET_GROUP_BY', payload: groupBy });
  }, []);

  const setCategoryFilter = useCallback((category: string | undefined) => {
    dispatch({ type: 'SET_CATEGORY_FILTER', payload: category });
  }, []);

  const setSourceFilter = useCallback((source: string | undefined) => {
    dispatch({ type: 'SET_SOURCE_FILTER', payload: source });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const setReadStatusFilter = useCallback((status: ReadStatusFilter | undefined) => {
    dispatch({ type: 'SET_READ_STATUS_FILTER', payload: status });
  }, []);

  const markAsRead = useCallback((link: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: link });
  }, []);

  const refreshReadStatus = useCallback(() => {
    dispatch({ type: 'REFRESH_READ_STATUS' });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  const value: FeedContextType = {
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
    refreshReadStatus,
    setLoading,
    setError,
    resetFilters,
  };

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

/**
 * 自定义 Hook
 */
export function useFeed() {
  const context = useContext(FeedContext);
  if (context === undefined) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
}
