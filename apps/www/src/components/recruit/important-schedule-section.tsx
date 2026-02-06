'use client';

import { useEffect, useState } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Text } from '@/components/ui/text';

const steps = [
  {
    id: 1,
    number: '01',
    title: 'OT',
    description:
      '2026년 2월 1일(토)',
  },
  {
    id: 2,
    number: '02',
    title: 'MT',
    description:
      '2026년 2월 8일(토)',
  },
  {
    id: 3,
    number: '03',
    title: 'MCP 활용 특강',
    description:
      '2026년 2월 15일(토)',
  },
  {
    id: 4,
    number: '04',
    title: '합동 챗봇 프로젝트',
    description:
      '2026년 2월 22일(토) -\n2026년 2월 23일(일)',
  },
  {
    id: 5,
    number: '05',
    title: '파이널 프로젝트',
    description:
      '2026년 2월 28일(금) -\n2026년 3월 2일(월)',
  },
  {
    id: 6,
    number: '06',
    title: '릴리즈데이',
    description:
      '2026년 3월 3일(월)',
  },
];

export function ImportantScheduleSection() {
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
          <Text variant="heading3" as="h2" className="font-bold">
            중요 일정
          </Text>
        </div>

        <div className="flex-1 flex justify-center md:justify-start w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 w-full max-w-[900px] gap-6 sm:gap-8 md:gap-[40px] overflow-hidden justify-items-center">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-row justify-start items-start transition-all duration-700 ease-out ${
                cardsVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                width: '100%',
                maxWidth: '400px',
                height: 'min-content',
                overflow: 'hidden',
                padding: '0px',
                gap: '20px',
                transitionDelay: cardsVisible ? `${index * 150}ms` : '0ms',
              }}
            >
              {/* Step Number */}
              <div
                className="flex flex-row justify-center items-center flex-shrink-0"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#f0f2f6',
                  overflow: 'hidden',
                  padding: '0px',
                  gap: '10px',
                  borderRadius: '5px',
                }}
              >
                <Text variant="small" className="text-gray-600 font-bold">
                  {step.number}
                </Text>
              </div>
              
              {/* Step Content */}
              <div
                className="flex flex-col justify-center items-start"
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: 'min-content',
                  overflow: 'hidden',
                  padding: '0px',
                  gap: '10px',
                }}
              >
                <Text 
                  variant="large" 
                  as="h3" 
                  style={{ 
                    fontWeight: '600', 
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  {step.title}
                </Text>
                <Text 
                  variant="small" 
                  className="text-gray-600" 
                  style={{ 
                    width: '100%',
                    textAlign: 'left',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {step.description}
                </Text>
              </div>
            </div>
          ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
