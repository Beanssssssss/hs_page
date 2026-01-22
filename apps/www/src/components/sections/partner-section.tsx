'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Text } from '@/components/ui/text';

const partners = [
  { id: 1, name: 'Partner 1', logo: '/image/logo_partner_1.svg' },
  { id: 2, name: 'Partner 2', logo: '/image/logo_partner_2.png' },
  { id: 3, name: 'Partner 3', logo: '/image/logo_partner_3.png' },
];

export function PartnerSection() {
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
      className={`w-full flex flex-col justify-center items-center py-[84px] gap-[10px] overflow-hidden transition-all duration-1000 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="container mx-auto px-6">
        {/* Heading 3: 40px, weight 600 */}
        <Text variant="heading3" as="h2" className="text-center text-black mb-16">
          Partner
        </Text>

        <div className="flex flex-wrap items-center justify-center gap-16">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="relative grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={150}
                height={80}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

