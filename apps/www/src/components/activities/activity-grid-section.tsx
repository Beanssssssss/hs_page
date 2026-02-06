'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ActivityCard } from './activity-card';
import { ActivityDetailModal } from './activity-detail-modal';
import { supabase } from '@/lib/supabase';
import type { Activity } from '@/types/activity';
import { cn } from '@/lib/utils';

type Generation = { id: number; name: string; year: number | null };

export function ActivityGridSection() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(6);
  const [selectedGenerationId, setSelectedGenerationId] = useState<number | null>(null);
  const [gridVisible, setGridVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const [activitiesRes, generationsRes] = await Promise.all([
        supabase
          .from('activity')
          .select('id, title, description, category, date, image_url, generation_id, activity_media(id, media_type, media_url, display_order)')
          .order('date', { ascending: false }),
        supabase
          .from('generations')
          .select('id, name, year')
          .order('id', { ascending: false }),
      ]);

      if (activitiesRes.error) {
        console.error('활동 목록 조회 실패', activitiesRes.error);
        setActivities([]);
      } else {
        setActivities((activitiesRes.data ?? []) as Activity[]);
      }
      if (generationsRes.error) {
        setGenerations([]);
      } else {
        setGenerations(generationsRes.data ?? []);
      }
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    setGridVisible(false);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => setGridVisible(e.isIntersecting)),
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );
    const timer = setTimeout(() => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) setGridVisible(true);
        observer.observe(gridRef.current);
      }
    }, 100);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [displayCount, selectedGenerationId]);

  const filteredActivities =
    selectedGenerationId === null
      ? activities
      : activities.filter((a) => a.generation_id === selectedGenerationId);
  const displayedActivities = filteredActivities.slice(0, displayCount);
  const handleLoadMore = () => setDisplayCount((prev) => prev + 6);

  const handleGenerationTab = (id: number | null) => {
    setSelectedGenerationId(id);
    setDisplayCount(6);
  };

  const formatDate = (d: string | null) => {
    if (!d) return '';
    try {
      const date = new Date(d);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return d;
    }
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-24 bg-gray-50">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
          <p className="text-gray-600 text-center text-sm sm:text-base">활동을 불러오는 중...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gray-50">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        {generations.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12">
            <div className="inline-flex gap-1.5 sm:gap-2 bg-white rounded-full p-1.5 sm:p-2 shadow-md flex-wrap justify-center">
              <button
                type="button"
                onClick={() => handleGenerationTab(null)}
                className={cn(
                  'px-5 py-2 rounded-full font-medium transition-all',
                  selectedGenerationId === null
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                All
              </button>
              {generations.map((gen) => (
                <button
                  key={gen.id}
                  type="button"
                  onClick={() => handleGenerationTab(gen.id)}
                  className={cn(
                    'px-5 py-2 rounded-full font-medium transition-all',
                    selectedGenerationId === gen.id
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {gen.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {activities.length === 0 ? (
          <p className="text-center text-gray-600 py-12">등록된 활동이 없습니다.</p>
        ) : filteredActivities.length === 0 ? (
          <p className="text-center text-gray-600 py-12">해당 기수의 활동이 없습니다.</p>
        ) : (
          <>
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12 auto-rows-fr"
        >
          {displayedActivities.map((activity, index) => (
            <ActivityCard
              key={activity.id}
              id={activity.id}
              title={activity.title ?? ''}
              description={activity.description ?? undefined}
              date={formatDate(activity.date)}
              imageUrl={activity.image_url ?? ''}
              index={index}
              shouldAnimate={gridVisible}
              activity={activity}
              onOpenModal={(a) => {
                setSelectedActivity(a);
                setModalOpen(true);
              }}
            />
          ))}
        </div>

        {displayedActivities.length < filteredActivities.length && (
          <div className="text-center">
            <Button onClick={handleLoadMore} variant="purple" size="lg">
              Load More
            </Button>
          </div>
        )}

        <ActivityDetailModal
          activity={selectedActivity}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
          </>
        )}
      </div>
    </section>
  );
}
