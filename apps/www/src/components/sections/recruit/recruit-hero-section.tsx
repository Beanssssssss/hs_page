'use client';

import { useEffect, useState } from 'react';
import { Text } from '@/components/ui/text';

export function RecruitHeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      className={`w-full flex flex-col justify-center items-center mt-20 transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{
        minHeight: '350px',
        padding: '80px 0px 140px 0px',
        background:
          'linear-gradient(180deg, #ffffff 0.45%, rgba(135, 113, 255, 0.3) 24.32%, rgba(135, 113, 255, 0.3) 78.83%, rgb(255, 255, 255) 100%)',
        gap: '10px',
      }}
    >
      {/* Container */}
      <div
        className="w-full flex flex-col justify-center items-center"
        style={{
          maxWidth: '1350px',
          padding: '0px 30px',
          gap: '100px',
        }}
      >
        {/* Hero Content */}
        <div
          className="w-full flex flex-col justify-center items-center"
          style={{
            maxWidth: '840px',
            gap: '30px',
          }}
        >
          <Text variant="heading1" as="h1" className="text-center">
            Recruit
          </Text>
          <Text variant="large" className="text-center text-gray-700">
            At Draftr, we're <span className="font-semibold">building the next generation</span> of
            design tools —
          </Text>
        </div>
      </div>
    </section>
  );
}

