'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface ActivityCardProps {
  id: number;
  title: string;
  description?: string;
  date: string;
  imageUrl: string;
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
}: ActivityCardProps) {
  const bgColor = bgColors[id % 6];

  return (
    <Link href={`/activities/${id}`}>
      <Card className="border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group overflow-hidden rounded-3xl">
        <CardContent className="p-0">
          <div className={`${bgColor} aspect-video flex items-center justify-center overflow-hidden`}>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
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
    </Link>
  );
}

