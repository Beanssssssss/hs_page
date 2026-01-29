'use client';

import { useEffect, useRef, useState } from 'react';
import { Text } from '@/components/ui/text';

const schedules = [
  {
    id: 1,
    title: '서류 접수',
    description:
      '8월 11일(월) -\n8월 26일(화)\n23:59',
  },
  {
    id: 2,
    title: '결과 발표',
    description:
      '8월 28일(목)',
  },
  {
    id: 3,
    title: '대면 면접',
    description:
      '8월 30일(토) -\n8월 31일(일)\n서강대학교 우정원 7층',
  },
  {
    id: 4,
    title: '최종 발표',
    description:
      '9월 1일(월)',
  },
];

export function ScheduleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setTimeout(() => setCardsVisible(true), 200);
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
      className={`w-full flex flex-col justify-center items-center transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{
        padding: '100px 0px',
        gap: '10px',
        overflow: 'hidden',
      }}
    >
      {/* Wrapper for centering */}
      <div className="w-full flex justify-center" style={{ padding: '0px 30px' }}>
        {/* Container */}
        <div
          className="flex flex-row justify-start items-start"
          style={{
            maxWidth: '1100px',
            width: '100%',
            gap: '150px',
            overflow: 'visible',
          }}
        >
        {/* Section Title (Left) */}
        <div 
          className={`transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{
            width: '200px',
            flexShrink: 0,
          }}
        >
          <Text variant="heading3" as="h2">
            모집 일정
          </Text>
        </div>

        {/* Schedule Grid (Right) */}
        <div className="flex-1 flex justify-start">
          <div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-5"
            style={{
              maxWidth: '1000px',
              width: '100%',
            }}
          >
            {schedules.map((schedule, index) => (
              <div
                key={schedule.id}
                className={`flex flex-col transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:bg-white cursor-pointer ${
                  cardsVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: cardsVisible ? `${index * 150}ms` : '0ms',
                  padding: '24px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '16px',
                  gap: '12px',
                }}
              >
                <Text variant="large" as="h3" style={{ fontWeight: '600' }}>
                  {schedule.title}
                </Text>
                <Text variant="small" className="text-gray-600" style={{ lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                  {schedule.description}
                </Text>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

