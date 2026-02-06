'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import type { Activity } from '@/types/activity';

interface ActivityCardProps {
  id: number;
  title: string;
  description?: string;
  date: string;
  imageUrl: string;
  index?: number;
  shouldAnimate?: boolean;
  activity?: Activity;
  onOpenModal?: (activity: Activity) => void;
}

const bgColors: Record<number, string> = {
  0: 'bg-gradient-to-br from-cyan-100 via-pink-100 to-orange-100',
  1: 'bg-gradient-to-br from-yellow-100 to-amber-100',
  2: 'bg-gradient-to-br from-purple-100 to-purple-200',
  3: 'bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100',
  4: 'bg-gradient-to-br from-pink-100 to-purple-100',
  5: 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100',
};

export function ActivityCard({
  id,
  title,
  description,
  date,
  imageUrl,
  index = 0,
  shouldAnimate = false,
  activity,
  onOpenModal,
}: ActivityCardProps) {
  const bgColor = bgColors[id % 6];
  const [isVisible, setIsVisible] = useState(false);
  const openModal = activity && onOpenModal;

  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, index * 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [shouldAnimate, index]);

  const card = (
    <Card
      className={`border-0 shadow-md hover:shadow-xl cursor-pointer group overflow-hidden rounded-3xl h-full flex flex-col transition-all duration-700 ease-out ${
        shouldAnimate
          ? isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
          : ''
      }`}
    >
      <CardContent className="p-0 flex flex-col flex-1">
        <div
          className={`${bgColor} aspect-video flex items-center justify-center overflow-hidden`}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-gray-400 text-sm">이미지 없음</span>
          )}
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-2">{date}</p>
          <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (openModal) {
    return (
      <button
        type="button"
        className="h-full block w-full text-left"
        onClick={() => onOpenModal(activity)}
      >
        {card}
      </button>
    );
  }

  return <Link href={`/activities/${id}`}>{card}</Link>;
}

