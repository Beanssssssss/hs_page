'use client';

import { useEffect, useRef, useState } from 'react';

export interface UseScrollRevealOptions {
  /** 뷰포트에 얼마나 보여야 노출로 볼지 (0~1, 기본 0.2) */
  threshold?: number;
  /** 한 번 보인 뒤 다시 숨길지 (기본 false = 한 번 보이면 유지) */
  triggerOnce?: boolean;
}

/**
 * 스크롤 시 컴포넌트가 뷰포트에 들어오면 애니메이션용 상태를 반환하는 훅.
 * ref를 섹션에 걸고, isVisible로 opacity/translate 등 적용하면 됨.
 */
export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const { threshold = 0.2, triggerOnce = true } = options;
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, triggerOnce]);

  return { ref, isVisible };
}
