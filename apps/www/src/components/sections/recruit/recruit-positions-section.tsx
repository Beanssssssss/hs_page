'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const positions = [
  {
    id: 1,
    title: 'Cloud-based accessibility',
    description: 'Access your projects anytime, anywhere—no downloads or installations needed.',
  },
  {
    id: 2,
    title: 'Cloud-based accessibility',
    description: 'Access your projects anytime, anywhere—no downloads or installations needed.',
  },
];

export function RecruitPositionsSection() {
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
      className="py-24 bg-black text-white"
    >
      <div className="container mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold">
            모집 직군
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {positions.map((position, index) => (
            <Card
              key={position.id}
              className={`bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-700 ease-out ${
                cardsVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: cardsVisible ? `${index * 150}ms` : '0ms',
              }}
            >
              <CardContent className="p-8">
                <div className="bg-gray-800 rounded-2xl h-48 mb-6"></div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {position.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {position.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

