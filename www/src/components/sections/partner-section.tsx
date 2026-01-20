'use client';

import Image from 'next/image';
import { Text } from '@/components/ui/text';

const partners = [
  { id: 1, name: 'Partner 1', logo: '/image/logo_partner_1.svg' },
  { id: 2, name: 'Partner 2', logo: '/image/logo_partner_2.png' },
  { id: 3, name: 'Partner 3', logo: '/image/logo_partner_3.png' },
];

export function PartnerSection() {
  return (
    <section className="w-full flex flex-col justify-center items-center py-[84px] gap-[10px] overflow-hidden">
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

