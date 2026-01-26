'use client';

import { useEffect, useRef, useState } from 'react';
import { Text } from '@/components/ui/text';

export function SloganSection() {
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
      className={`w-full flex flex-col justify-center items-start transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{
        padding: '81px 0px 81px 0px',
        gap: '83px',
        overflow: 'hidden',
      }}
    >
      {/* Container */}
      <div
        className="w-full flex flex-col justify-center items-center"
        style={{
          maxWidth: '1350px',
          padding: '0px 30px',
          gap: '94px',
        }}
      >
        {/* Section Title */}
        <div
          className="w-full flex flex-col justify-center items-center"
          style={{
            maxWidth: '865px',
            gap: '51px',
            overflow: 'hidden',
          }}
        >
          <Text variant="heading2" as="h2" className="text-center">
            Prompt the
            <br />
            Future,
            <br />
            <br />
            Be the
            <br />
            Pioneer
          </Text>
        </div>
      </div>
    </section>
  );
}

