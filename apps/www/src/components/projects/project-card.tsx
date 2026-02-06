'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { ProjectType } from '@/types/project';
import type { Project } from '@/types/project';

interface ProjectCardProps {
  id: number;
  title: string;
  summary: string;
  generation?: string;
  thumbnailUrl: string;
  projectType: ProjectType;
  index?: number;
  shouldAnimate?: boolean;
  isNewCard?: boolean;
  /** 전체 프로젝트 데이터. 있으면 클릭 시 모달 열기, 없으면 기존처럼 링크 동작 */
  project?: Project;
  onOpenModal?: (project: Project) => void;
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
  index = 0,
  shouldAnimate = false,
  isNewCard = false,
  project,
  onOpenModal,
}: ProjectCardProps) {
  const bgColor = bgColors[id % 6];
  const cardRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const [isVisible, setIsVisible] = useState(!isNewCard);
  const openModal = project && onOpenModal;

  useEffect(() => {
    // 새 카드이고 아직 애니메이션하지 않았으면 애니메이션 적용
    if (shouldAnimate && isNewCard && !hasAnimatedRef.current) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsVisible(true);
        hasAnimatedRef.current = true;
      }, index * 80);

      return () => clearTimeout(timer);
    } else if (!isNewCard) {
      // 기존 카드는 바로 보이도록
      setIsVisible(true);
    }
  }, [shouldAnimate, index, isNewCard]);

  const cardContent = (
    <Card
      ref={cardRef}
      className={`border-0 shadow-md hover:shadow-xl cursor-pointer group overflow-hidden rounded-3xl h-full flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      }`}
    >
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
  );

  if (openModal) {
    return (
      <button
        type="button"
        className="h-full block w-full text-left"
        onClick={() => onOpenModal(project)}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <Link href={`/projects/${id}`} className="h-full block">
      {cardContent}
    </Link>
  );
}
