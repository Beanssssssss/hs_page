'use client';

import { useEffect, useState } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
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
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.2 });
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(() => setCardsVisible(true), 200);
      return () => clearTimeout(t);
    }
    setCardsVisible(false);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className={`w-full flex flex-col justify-center items-center transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } py-12 sm:py-16 md:py-24 gap-4 overflow-hidden`}
    >
      <div className="w-full flex flex-col md:flex-row justify-center md:justify-start items-center md:items-start px-4 sm:px-6 md:px-[30px]">
        <div className="flex flex-col md:flex-row justify-start items-center md:items-start w-full max-w-[1100px] gap-8 md:gap-[150px] overflow-visible">
        <div 
          className={`transition-all duration-1000 ease-out w-full md:w-[200px] flex-shrink-0 text-center md:text-left ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <Text variant="heading3" as="h2">
            모집 일정
          </Text>
        </div>

        <div className="flex-1 flex justify-center md:justify-start w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-[1000px] w-full">
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
