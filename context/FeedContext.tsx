'use client';

import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { FlatFeed, GroupByType } from '@/types';

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
  };
  loading: boolean;
  error: string | null;
}

/**
 * Feed 操作类型
 */
type FeedAction =
  | { type: 'SET_FEEDS'; payload: FlatFeed[] }
  | { type: 'SET_SELECTED_FEED'; payload: FlatFeed | null }
  | { type: 'SET_GROUP_BY'; payload: GroupByType }
  | { type: 'SET_CATEGORY_FILTER'; payload: string | undefined }
  | { type: 'SET_SOURCE_FILTER'; payload: string | undefined }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_FILTERS' };

/**
 * 初始状态
 */
const initialState: FeedState = {
  feeds: [],
  selectedFeed: null,
  groupBy: 'none',
  filters: {},
  loading: false,
  error: null,
};

/**
 * Reducer 函数
 */
function feedReducer(state: FeedState, action: FeedAction): FeedState {
  switch (action.type) {
    case 'SET_FEEDS':
      return { ...state, feeds: action.payload, error: null };
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
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'RESET_FILTERS':
      return { ...state, filters: {}, groupBy: 'none' };
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
  setSelectedFeed: (feed: FlatFeed | null) => void;
  setGroupBy: (groupBy: GroupByType) => void;
  setCategoryFilter: (category: string | undefined) => void;
  setSourceFilter: (source: string | undefined) => void;
  setSearchQuery: (query: string) => void;
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

  const setFeeds = useCallback((feeds: FlatFeed[]) => {
    dispatch({ type: 'SET_FEEDS', payload: feeds });
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
    setSelectedFeed,
    setGroupBy,
    setCategoryFilter,
    setSourceFilter,
    setSearchQuery,
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
