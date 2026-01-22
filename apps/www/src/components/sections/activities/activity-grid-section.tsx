'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ActivityCard } from './activity-card';

const activities = [
  {
    id: 1,
    title: 'Best practices for showcasing features',
    description: '',
    date: 'Oct 13, 2025',
    imageUrl: 'https://picsum.photos/seed/activity1/600/400',
  },
  {
    id: 2,
    title: 'Visual storytelling for complex products',
    description: '',
    date: 'Oct 13, 2025',
    imageUrl: 'https://picsum.photos/seed/activity2/600/400',
  },
  {
    id: 3,
    title: 'How microinteraction improve user experience',
    description: '',
    date: 'Oct 13, 2025',
    imageUrl: 'https://picsum.photos/seed/activity3/600/400',
  },
  {
    id: 4,
    title: 'Why performance and accessibility matter',
    description: '',
    date: 'Oct 13, 2025',
    imageUrl: 'https://picsum.photos/seed/activity4/600/400',
  },
  {
    id: 5,
    title: 'From idea to launch: SaaS UI/UX guide',
    description: '',
    date: 'Oct 13, 2025',
    imageUrl: 'https://picsum.photos/seed/activity5/600/400',
  },
  {
    id: 6,
    title: 'Simplifying user journeys for more signups',
    description: '',
    date: 'Oct 13, 2025',
    imageUrl: 'https://picsum.photos/seed/activity6/600/400',
  },
  {
    id: 7,
    title: 'Creating effective design systems',
    description: '',
    date: 'Oct 12, 2025',
    imageUrl: 'https://picsum.photos/seed/activity7/600/400',
  },
  {
    id: 8,
    title: 'Mobile-first design strategies',
    description: '',
    date: 'Oct 12, 2025',
    imageUrl: 'https://picsum.photos/seed/activity8/600/400',
  },
  {
    id: 9,
    title: 'Building accessible web applications',
    description: '',
    date: 'Oct 11, 2025',
    imageUrl: 'https://picsum.photos/seed/activity9/600/400',
  },
];

export function ActivityGridSection() {
  const [displayCount, setDisplayCount] = useState(6);
  const [gridVisible, setGridVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const displayedActivities = activities.slice(0, displayCount);

  useEffect(() => {
    setGridVisible(false);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setGridVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    const timer = setTimeout(() => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInViewport) {
          setGridVisible(true);
        } else {
          observer.observe(gridRef.current);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (gridRef.current) {
        observer.unobserve(gridRef.current);
      }
    };
  }, [displayCount]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 6);
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div
          ref={gridRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 auto-rows-fr"
        >
          {displayedActivities.map((activity, index) => (
            <ActivityCard
              key={activity.id}
              {...activity}
              index={index}
              shouldAnimate={gridVisible}
            />
          ))}
        </div>

        {displayedActivities.length < activities.length && (
          <div className="text-center">
            <Button
              onClick={handleLoadMore}
              variant="purple"
              size="lg"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

