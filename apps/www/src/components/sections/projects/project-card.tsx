'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { ProjectType } from '@/types/project';

interface ProjectCardProps {
  id: number;
  title: string;
  summary: string;
  generation?: string;
  thumbnailUrl: string;
  projectType: ProjectType;
}

const bgColors: Record<number, string> = {
  0: 'bg-gradient-to-br from-cyan-100 via-pink-100 to-orange-100',
  1: 'bg-gradient-to-br from-yellow-100 to-amber-100',
  2: 'bg-gradient-to-br from-purple-100 to-purple-200',
  3: 'bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100',
  4: 'bg-gradient-to-br from-pink-100 to-purple-100',
  5: 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100',
};

export function ProjectCard({
  id,
  title,
  summary,
  generation,
  thumbnailUrl,
  projectType,
}: ProjectCardProps) {
  const bgColor = bgColors[id % 6];
  return (
    <Link href={`/projects/${id}`} className="h-full block">
      <Card className="border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group overflow-hidden rounded-3xl h-full flex flex-col">
        <CardContent className="p-0 flex flex-col flex-1">
          <div className={`${bgColor} aspect-video flex items-center justify-center overflow-hidden flex-shrink-0`}>
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="text-xl font-bold group-hover:text-purple-600 transition-colors">
                {title}
              </h3>
              {generation && (
                <Badge variant="outline" className="text-xs font-medium flex-shrink-0">
                  {generation}
                </Badge>
              )}
            </div>
            {summary && (
              <p className="text-gray-600 text-sm line-clamp-2">{summary}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

