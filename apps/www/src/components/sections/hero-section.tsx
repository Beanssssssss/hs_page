'use client';

import { useEffect, useRef, useState } from 'react';
import { Text } from '@/components/ui/text';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true); // Hero는 바로 나타나도록
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`w-full min-h-screen flex flex-col justify-center items-center pt-20 gap-[10px] overflow-visible transition-all duration-1000 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-12'
      }`}
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 15%, rgba(135, 113, 255, 0.3) 35%, rgba(135, 113, 255, 0.3) 78.83%, rgb(255, 255, 255) 100%)'
      }}
    >
      {/* Container: Max Width 1350, Full height, Centered */}
      <div className="w-full max-w-[1350px] flex-1 flex flex-col items-center justify-center px-[30px]">
        
        {/* Hero Content: Width 100%, Max Width 840, Gap 32, Auto height */}
        <div className="w-full max-w-[840px] flex flex-col items-center justify-center gap-[32px] p-0 overflow-visible">
          
          {/* HATESLOP - Heading 1 Jumbo (110px) */}
          <Text variant="heading1Jumbo" as="h1" className="text-center text-black">
            HATESLOP
          </Text>
          
          {/* Media & Tech Academy - Heading 6 (22px) */}
          <Text variant="heading6" as="h2" className="text-center text-[#606266]">
            Media & Tech Academy Group With Generative AI
          </Text>
          
          {/* 서강대학교 생성형 AI - Heading 5 (28px) */}
          <Text variant="heading5" as="p" className="text-center text-[#606266]">
            서강대학교 생성형 AI 미디어 & 테크 학회
          </Text>
          
        </div>
        
      </div>
    </section>
  );
}

