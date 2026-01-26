'use client';

import { useEffect, useRef, useState } from 'react';
import { Text } from '@/components/ui/text';

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
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

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

  // Stagger animation for items
  useEffect(() => {
    if (isVisible) {
      // Animate position items
      positions.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, index]);
        }, index * 150); // 150ms delay between each item
      });
      
      // Animate icon feature items after position items
      [1, 2, 3].forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, positions.length + index]);
        }, (positions.length + index) * 150);
      });
    }
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className={`w-full flex flex-col justify-center items-center transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{
        padding: '0px 100px',
        gap: '10px',
        overflow: 'hidden',
      }}
    >
      {/* Section Bg */}
      <div
        className="w-full flex flex-row justify-center items-center"
        style={{
          padding: '34px 0px',
          backgroundColor: '#101011',
          overflow: 'hidden',
          gap: '10px',
          borderRadius: '30px',
        }}
      >
        {/* Container */}
        <div
          className="flex flex-col justify-center items-center"
          style={{
            flex: 1,
            maxWidth: '1350px',
            padding: '0px 30px',
            gap: '44px',
          }}
        >
          {/* Section Title */}
          <Text variant="heading3" as="h2" className="text-white text-center">
            모집 직군
          </Text>

          {/* Grid */}
          <div
            className="w-full grid"
            style={{
              gridTemplateColumns: 'repeat(2, minmax(50px, 1fr))',
              gap: '10px 30px',
              overflow: 'hidden',
            }}
          >
            {positions.map((position, index) => (
              <div 
                key={position.id} 
                className={`w-full transition-all duration-700 ease-out ${
                  visibleItems.includes(index) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Feature Box */}
                <div
                  className="w-full flex flex-col justify-start items-center"
                  style={{
                    padding: '40px',
                    backgroundColor: '#101011',
                    overflow: 'hidden',
                    gap: '30px',
                    borderRadius: '25px',
                  }}
                >
                  {/* Feature Icon - Placeholder */}
                  <div className="bg-gray-700 rounded-full w-16 h-16"></div>
                  
                  {/* Feature Content */}
                  <div
                    className="w-full flex flex-col justify-center items-center"
                    style={{
                      padding: '30px',
                      maxWidth: '600px',
                      gap: '10px',
                    }}
                  >
                    <Text variant="heading6" as="h3" className="text-white text-center">
                      {position.title}
                    </Text>
                    <Text variant="small" className="text-gray-400 text-center">
                      {position.description}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Key Lessons */}
          <Text variant="heading4" as="h3" className="text-white">
            Key Lessons
          </Text>

          {/* Icon Feature Grid */}
          <div
            className="w-full flex flex-row justify-center items-center"
            style={{
              gap: '50px',
            }}
          >
            {[1, 2, 3].map((i, index) => (
              <div
                key={i}
                className={`flex flex-col justify-start items-start transition-all duration-700 ease-out ${
                  visibleItems.includes(positions.length + index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  width: '400px',
                  gap: '30px',
                }}
              >
                {/* Icon Feature - Placeholder */}
                <div className="bg-gray-700 rounded-lg w-full h-24"></div>
                <Text variant="medium" className="text-white">
                  Icon Feature {i}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

