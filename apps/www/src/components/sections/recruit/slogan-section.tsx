'use client';

import { useEffect, useRef, useState } from 'react';

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
      className={`py-32 bg-white transition-all duration-1000 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-black mb-8">
            Prompt the
            <br />
            Future,
            <br />
            <br />
            Be the
            <br />
            Pioneer
          </h2>
        </div>
      </div>
    </section>
  );
}

