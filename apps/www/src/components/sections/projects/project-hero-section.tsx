'use client';

import { useEffect, useRef, useState } from 'react';

export function ProjectHeroSection() {
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
      className={`relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-purple-200 via-purple-100 to-blue-100 pt-24 transition-all duration-1000 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-7xl md:text-8xl font-black mb-8 tracking-tight">
          Project
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
          Practical ideas and trends to help your software brand grow and stand out.
        </p>
      </div>
    </section>
  );
}

