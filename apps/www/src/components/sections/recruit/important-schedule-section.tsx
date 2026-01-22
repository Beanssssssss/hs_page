'use client';

import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    id: 1,
    number: '01',
    title: 'Start your project',
    description:
      'Create a new design or import files with just a click. Set up your workspace effortlessly.',
  },
  {
    id: 2,
    number: '02',
    title: 'Design with ease',
    description:
      'Use our intuitive drag-and-drop editor, smart tools stunning designs.',
  },
  {
    id: 3,
    number: '03',
    title: 'Export & Share',
    description:
      'Easily integrate with your favorite tools to launch your project effortlessly.',
  },
  {
    id: 4,
    number: '03',
    title: 'Export & Share',
    description:
      'Easily integrate with your favorite tools to launch your project effortlessly.',
  },
  {
    id: 5,
    number: '03',
    title: 'Export & Share',
    description:
      'Easily integrate with your favorite tools to launch your project effortlessly.',
  },
  {
    id: 6,
    number: '03',
    title: 'Export & Share',
    description:
      'Easily integrate with your favorite tools to launch your project effortlessly.',
  },
];

export function ImportantScheduleSection() {
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
      className="py-24 bg-gray-50"
    >
      <div className="container mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold">
            중요 일정
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex gap-6 transition-all duration-700 ease-out ${
                cardsVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: cardsVisible ? `${index * 100}ms` : '0ms',
              }}
            >
              <div className="text-4xl font-bold text-gray-300 flex-shrink-0">
                {step.number}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

