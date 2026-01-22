'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
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
      className={`w-full transition-all duration-1000 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-12'
      }`}
      style={{
        background: 'linear-gradient(180deg, #ffffff 0.45%, rgba(135, 113, 255, 0.3) 24.32%, rgba(135, 113, 255, 0.3) 100%)'
      }}
    >
      {/* Container: 1200px, Stack Vertical, Center, Gap 10, Padding 86 0 0 0 */}
      <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center justify-center gap-[10px] pt-[86px] overflow-hidden">
        
        {/* Section Title: Max Width 1210, Gap 60, Padding 53 30 53 30 */}
        <div className="w-full max-w-[1210px] flex flex-col items-center justify-center gap-[60px] py-[53px] px-[30px]">
          
          {/* Content: Max Width 600, Gap 42 */}
          <div className="w-full max-w-[600px] flex flex-col items-center justify-center gap-[42px]">
            
            {/* Heading 4 Text */}
            <Text variant="heading4" as="h2" className="text-center">
              헤이트슬롭과 함께 성장할
              <br />
              4기를 모집합니다
            </Text>

            {/* Button Primary: Text Medium + Arrow in Circle */}
            <Link href="#" target="_blank">
              <Button
                variant="primary"
                size="primary"
                className="font-pretendard"
                style={{
                  background: 'linear-gradient(180deg, #5235ef 0%, rgb(135, 113, 255) 100%)'
                }}
              >
                <Text variant="medium" as="span" className="text-white">
                  4기 신청하기
                </Text>
                {/* Arrow in White Circle */}
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-[#5235ef]" />
                </div>
              </Button>
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}

