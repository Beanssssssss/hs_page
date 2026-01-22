'use client';

import { useEffect, useRef, useState } from 'react';
import { Zap, Layers, Target } from 'lucide-react';

const lessons = [
  {
    id: 1,
    icon: Zap,
    title: 'Effortless design experience',
    description: 'Intuitive interface and smart tools to speed up your creative process.',
  },
  {
    id: 2,
    icon: Layers,
    title: 'Hassle-free prototyping',
    description: 'Transform static designs into interactive prototypes in just a few clicks.',
  },
  {
    id: 3,
    icon: Target,
    title: 'One-click export & handoff',
    description: 'Generate code, export assets, and collaborate with developers effortlessly.',
  },
];

export function KeyLessonsSection() {
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
            Key Lessons
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {lessons.map((lesson, index) => {
            const IconComponent = lesson.icon;
            return (
              <div
                key={lesson.id}
                className={`text-center transition-all duration-700 ease-out ${
                  cardsVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: cardsVisible ? `${index * 150}ms` : '0ms',
                }}
              >
                <div className="bg-gray-800 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{lesson.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {lesson.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

