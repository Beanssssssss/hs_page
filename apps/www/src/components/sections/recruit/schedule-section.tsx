'use client';

import { useEffect, useRef, useState } from 'react';

const schedules = [
  {
    id: 1,
    title: 'Version history',
    description:
      'Compare versions, restore past work, and clearly understand what changed without guessing.',
  },
  {
    id: 2,
    title: 'Version history',
    description:
      'Compare versions, restore past work, and clearly understand what changed without guessing.',
  },
  {
    id: 3,
    title: 'Version history',
    description:
      'Compare versions, restore past work, and clearly understand what changed without guessing.',
  },
  {
    id: 4,
    title: 'Version history',
    description:
      'Compare versions, restore past work, and clearly understand what changed without guessing.',
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
      className="py-24 bg-white"
    >
      <div className="container mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold">
            모집 일정
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {schedules.map((schedule, index) => (
            <div
              key={schedule.id}
              className={`bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-700 ease-out ${
                cardsVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: cardsVisible ? `${index * 100}ms` : '0ms',
              }}
            >
              <h3 className="text-lg font-bold mb-3">{schedule.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {schedule.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

