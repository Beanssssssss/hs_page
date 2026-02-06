'use client';

import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Text } from '@/components/ui/text';

export function SloganSection() {
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <section
      ref={sectionRef}
      className={`w-full flex flex-col justify-center items-center transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } py-12 sm:py-16 md:py-[81px] gap-10 sm:gap-16 md:gap-[83px] overflow-hidden`}
    >
      <div className="w-full flex flex-col justify-center items-center max-w-[1350px] px-4 sm:px-6 md:px-[30px] gap-8 sm:gap-12 md:gap-[94px]">
        <div className="w-full flex flex-col justify-center items-center max-w-[865px] gap-6 sm:gap-10 md:gap-[51px] overflow-hidden">
          <Text variant="heading2" as="h2" className="text-center">
            "Prompt the Future,
            <br />
            <br />
            Be the Pioneer"
          </Text>
        </div>
      </div>
    </section>
  );
}
