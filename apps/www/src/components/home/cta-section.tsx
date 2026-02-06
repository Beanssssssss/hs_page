'use client';

import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <section
      ref={sectionRef}
      className={`w-full bg-white transition-all duration-1000 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center justify-center gap-4 sm:gap-[10px] pt-12 sm:pt-16 md:pt-[86px] overflow-hidden px-4 sm:px-6">
        <div className="w-full max-w-[1210px] flex flex-col items-center justify-center gap-8 sm:gap-12 md:gap-[60px] py-10 sm:py-12 md:py-[53px] px-4 sm:px-6 md:px-[30px]">
          <div className="w-full max-w-[600px] flex flex-col items-center justify-center gap-8 sm:gap-10 md:gap-[42px]">
            {/* Heading 4 Text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-center"
            >
              <Text variant="heading4" as="h2" className="text-center">
                헤이트슬롭과 함께 성장할 4기를 모집합니다
              </Text>
            </motion.div>

            {/* Button Primary: Text Medium + Arrow in Circle */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            >
              <Link
                href="https://docs.google.com/forms/d/e/1FAIpQLSeM1Yc7aXJuBbB6ju6G88sQUaa0Z1FWRtCjgTnVYLS8eUmprQ/viewform?usp=dialog"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="primary"
                  size="primary"
                  className="font-pretendard"
                  style={{
                    background: 'linear-gradient(180deg, #B8A9E6 0%, #A78BFA 100%)'
                  }}
                >
                  <Text variant="medium" as="span" className="text-white">
                    4기 신청하기
                  </Text>
                  {/* Arrow in White Circle */}
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-[#7C3AED]" />
                  </div>
                </Button>
              </Link>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
