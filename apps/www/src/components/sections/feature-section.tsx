'use client';

import { useEffect, useRef, useState } from 'react';
import { Text } from '@/components/ui/text';

export function FeatureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`w-full bg-white transition-all duration-1000 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-12'
      }`}
    >
      {/* Container: Max Width 1350, Gap 94, Padding 0 30 */}
      <div className="w-full max-w-[1350px] mx-auto flex flex-col items-center justify-center gap-[94px] px-[30px]">
        
        {/* Section Title: Gap 83, Padding 81 0 */}
        <div className="w-full flex flex-col items-center justify-center gap-[83px] py-[81px]">
          
          {/* Text Item 1: Max Width 67%, Gap 76 */}
          <div className="w-full max-w-[67%] flex flex-col items-center justify-center gap-[76px] p-0">
            {/* Heading 1: 80px */}
            <Text variant="heading1" as="h2" className="text-center text-black">
              "Prompt the
              <br />
              Future,
              <br />
              <br />
              Be the
              <br />
              Pioneer"
            </Text>
            
            {/* Text Large: 20px */}
            <Text variant="large" as="p" className="text-center text-[#606266]">
              헤이트슬롭은 프로듀서와 엔지니어가 함께 AI를 활용해 문제 해결 역량을 키우는 조직입니다.
            </Text>
            
            {/* Text Large: 20px */}
            <Text variant="large" as="p" className="text-center text-[#606266]">
              또한 이 역량을 공학과 미디어 콘텐츠 분야에 적용해,
              <br />
              AI 에이전트와 함께하는 업무 환경에 대비한 실무 능력을 기르는 것을 목표로 합니다.
            </Text>
          </div>
          
        </div>
        
      </div>
    </section>
  );
}

