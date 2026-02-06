'use client';

import { useScrollReveal } from '@/hooks/use-scroll-reveal';

export function FeatureSection() {
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <section
      ref={sectionRef}
      className={`relative flex min-h-screen w-full flex-col justify-center bg-white transition-all duration-1000 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-12'
      }`}
    >
      {/* Hero와 동일한 컨테이너·패딩 */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-8 sm:gap-12 md:gap-16">
          <h2 className="mx-auto max-w-4xl text-center text-4xl font-black tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            "Prompt the
            <br />
            Future,
            <br />
            <br />
            Be the
            <br />
            Pioneer"
          </h2>
          <p className="mx-auto max-w-2xl text-center text-base text-gray-600 sm:text-lg md:text-xl">
            헤이트슬롭은 프로듀서와 엔지니어가 함께 AI를 활용해 문제 해결 역량을 키우는 조직입니다.
          </p>
          <p className="mx-auto max-w-2xl text-center text-base text-gray-600 sm:text-lg md:text-xl">
            또한 이 역량을 공학과 미디어 콘텐츠 분야에 적용해,
            <br />
            AI 에이전트와 함께하는 업무 환경에 대비한 실무 능력을 기르는 것을 목표로 합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
