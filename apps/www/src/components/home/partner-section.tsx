'use client';

import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import Image from 'next/image';
import { Text } from '@/components/ui/text';

const partners = [
  { id: 1, name: 'Partner 1', logo: '/image/logo_partner_1.svg' },
  { id: 2, name: 'Partner 2', logo: '/image/logo_partner_2.png' },
  { id: 3, name: 'Partner 3', logo: '/image/logo_partner_3.png' },
];

export function PartnerSection() {
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <section
      ref={sectionRef}
      className={`w-full flex flex-col justify-center items-center py-12 sm:py-16 md:py-[84px] gap-4 sm:gap-[10px] overflow-hidden transition-all duration-1000 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        <Text variant="heading3" as="h2" className="text-center text-black mb-8 sm:mb-12 md:mb-16">
          Partner
        </Text>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="relative grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 w-24 h-10 sm:w-32 sm:h-12 md:w-[150px] md:h-[80px]"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={150}
                height={80}
                className="object-contain w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
