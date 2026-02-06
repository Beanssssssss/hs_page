'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PageState {
  [key: string]: any;
  scrollPosition?: number;
}

interface UsePageStateOptions {
  storageKey: string;
  defaultState: PageState;
  restoreScroll?: boolean;
  scrollRestoreDelay?: number;
  dependencies?: any[]; // 상태 변경 시 저장할 의존성 배열
}

/**
 * 페이지 상태를 sessionStorage에 저장하고 복원하는 커스텀 훅
 * 
 * @param options 설정 옵션
 * @returns [state, setState, restoreScroll] - 상태, 상태 설정 함수, 스크롤 복원 함수
 */
export function usePageState<T extends PageState>(
  options: UsePageStateOptions
) {
  const {
    storageKey,
    defaultState,
    restoreScroll = true,
    scrollRestoreDelay = 300,
    dependencies = [],
  } = options;

  const [state, setState] = useState<T>(() => {
    // 초기 상태 복원
    if (typeof window === 'undefined') return defaultState as T;
    
    try {
      const savedState = sessionStorage.getItem(storageKey);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // scrollPosition은 별도로 처리하므로 제거
        const { scrollPosition, ...rest } = parsed;
        return { ...defaultState, ...rest } as T;
      }
    } catch (error) {
      console.error(`Failed to restore state for ${storageKey}:`, error);
    }
    
    return defaultState as T;
  });

  // 상태 변경 시 sessionStorage에 저장
  useEffect(() => {
    try {
      const stateToSave = {
        ...state,
        scrollPosition: restoreScroll ? window.scrollY : undefined,
      };
      sessionStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error(`Failed to save state for ${storageKey}:`, error);
    }
  }, [state, storageKey, restoreScroll, ...dependencies]);

  // 스크롤 위치 저장 (스크롤 이벤트)
  useEffect(() => {
    if (!restoreScroll) return;

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        try {
          const savedState = sessionStorage.getItem(storageKey);
          if (savedState) {
            const parsed: PageState = JSON.parse(savedState);
            parsed.scrollPosition = window.scrollY;
            sessionStorage.setItem(storageKey, JSON.stringify(parsed));
          }
        } catch (error) {
          console.error(`Failed to save scroll position for ${storageKey}:`, error);
        }
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [storageKey, restoreScroll]);

  // 스크롤 위치 복원 함수
  const restoreScrollPosition = useCallback(
    (condition?: () => boolean) => {
      if (!restoreScroll) return;

      // 조건이 있고 false면 복원하지 않음
      if (condition && !condition()) return;

      try {
        const savedState = sessionStorage.getItem(storageKey);
        if (savedState) {
          const parsed: PageState = JSON.parse(savedState);
          if (parsed.scrollPosition !== undefined) {
            setTimeout(() => {
              window.scrollTo({
                top: parsed.scrollPosition || 0,
                behavior: 'auto',
              });
              // 복원 후 스크롤 위치 제거 (한 번만 복원)
              const { scrollPosition, ...rest } = parsed;
              sessionStorage.setItem(storageKey, JSON.stringify(rest));
            }, scrollRestoreDelay);
          }
        }
      } catch (error) {
        console.error(`Failed to restore scroll position for ${storageKey}:`, error);
      }
    },
    [storageKey, restoreScroll, scrollRestoreDelay]
  );

  // 상태 업데이트 함수
  const updateState = useCallback((updates: Partial<T>) => {
    setState((prev) => ({ ...prev, ...updates } as T));
  }, []);

  return [state, updateState, restoreScrollPosition] as const;
}
