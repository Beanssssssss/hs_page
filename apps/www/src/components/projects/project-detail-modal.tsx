'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import type { Project } from '@/types/project';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExternalLink, Github, Youtube, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const DESCRIPTION_PREVIEW_LINES = 4;
const DESCRIPTION_LONG_THRESHOLD = 120;

interface ProjectDetailModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailModal({
  project,
  open,
  onOpenChange,
}: ProjectDetailModalProps) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const imageList = useMemo(() => {
    if (!project) return [];
    const thumb = project.thumbnail_url;
    const mediaUrls = (project.project_media ?? [])
      .filter((m) => m.media_type === 'image' && m.media_url)
      .sort((a, b) => a.order_index - b.order_index)
      .map((m) => m.media_url)
      .filter((url): url is string => typeof url === 'string' && url !== thumb);
    const list = thumb ? [thumb, ...mediaUrls] : [...mediaUrls];
    return list.filter((url): url is string => typeof url === 'string' && url.length > 0);
  }, [project]);

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  useEffect(() => {
    if (!project || !isMountedRef.current) return;
    setImageIndex(0);
  }, [project?.id]);

  if (!project) return null;

  const detail = project.project_details?.[0];
  const description = detail?.description ?? project.description ?? project.summary ?? '';
  const isDescriptionLong = description.length > DESCRIPTION_LONG_THRESHOLD;
  const hasMultipleImages = imageList.length > 1;
  const safeImageIndex = imageList.length > 0
    ? Math.min(imageIndex, imageList.length - 1)
    : 0;

  const goPrev = () => {
    setImageIndex((i) => (i - 1 + imageList.length) % imageList.length);
  };

  const goNext = () => {
    setImageIndex((i) => (i + 1) % imageList.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] max-w-[520px] sm:max-w-[600px] md:max-w-[640px] max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] my-0 p-0 gap-0 border-0 shadow-xl rounded-xl sm:rounded-2xl overflow-y-auto overflow-x-hidden bg-white">
        <DialogTitle className="sr-only">{project.title}</DialogTitle>
        <div className="bg-white rounded-xl sm:rounded-2xl">
          {/* 상단 이미지: 썸네일 + 미디어 이미지 슬라이더 (좌우 화살표) */}
          <div className="relative w-full overflow-hidden rounded-t-xl sm:rounded-t-2xl min-h-[40vh] sm:min-h-[50vh] md:min-h-[55vh] lg:min-h-[60vh] bg-neutral-100">
            {imageList.length > 0 && (
              <>
                {imageList.map((url, idx) => (
                  <img
                    key={idx}
                    alt={idx === 0 ? project.title : `프로젝트 이미지 ${idx + 1}`}
                    loading="lazy"
                    width={345}
                    height={260}
                    className={cn(
                      'w-full h-full object-contain absolute inset-0 transition-opacity duration-300',
                      idx === safeImageIndex ? 'opacity-100 z-0' : 'opacity-0 z-[-1] pointer-events-none'
                    )}
                    src={url}
                  />
                ))}
                {hasMultipleImages && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goPrev();
                      }}
                      className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 min-w-[44px] min-h-[44px] w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors touch-manipulation"
                      aria-label="이전 이미지"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goNext();
                      }}
                      className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 min-w-[44px] min-h-[44px] w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors touch-manipulation"
                      aria-label="다음 이미지"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 px-2.5 py-1.5 rounded-full bg-black/50 text-white text-xs sm:text-sm font-medium">
                      {safeImageIndex + 1} / {imageList.length}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="px-4 pt-4 pb-6 sm:px-6 sm:pt-6 sm:pb-8 md:pb-12">
            {/* 프로젝트 이름 & 설명 */}
            <div className="flex flex-col gap-3 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-neutral-900">
                {project.title}
              </h2>
              {description && (
                <div className="flex flex-col gap-1">
                  <p
                    className="text-sm text-neutral-800 whitespace-pre-line leading-relaxed"
                    style={
                      !descriptionExpanded && isDescriptionLong
                        ? { display: '-webkit-box', WebkitLineClamp: DESCRIPTION_PREVIEW_LINES, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }
                        : undefined
                    }
                  >
                    {description}
                  </p>
                  {isDescriptionLong && (
                    <button
                      type="button"
                      onClick={() => setDescriptionExpanded((prev) => !prev)}
                      className="text-sm font-medium text-neutral-600 hover:text-neutral-900 mt-0.5 inline-flex items-center gap-1 self-start"
                    >
                      {descriptionExpanded ? (
                        <>
                          접기 <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          더보기 <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 엔지니어 / 프로듀서 (이전 형태) */}
            {(detail?.engineer || detail?.producer) && (
              <div className="flex flex-col gap-2 mb-3">
                {detail?.engineer && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      엔지니어
                    </span>
                    <p className="text-sm text-neutral-800">{detail.engineer}</p>
                  </div>
                )}
                {detail?.producer && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      프로듀서
                    </span>
                    <p className="text-sm text-neutral-800">{detail.producer}</p>
                  </div>
                )}
              </div>
            )}

            {/* 링크: 유튜브, 배포(데모/플레이스토어), 깃허브 */}
            {(detail?.youtube_url || detail?.demo_url || detail?.github_url) && (
              <div className="flex flex-col gap-2">
                <h2 className="text-xs font-semibold text-neutral-900 uppercase tracking-wide">
                  링크
                </h2>
                <div className="flex flex-wrap gap-4">
                  {detail?.youtube_url && (
                    <a
                      href={detail.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 hover:text-red-600 transition-colors"
                    >
                      <Youtube className="w-4 h-4" />
                      YouTube
                    </a>
                  )}
                  {detail?.demo_url && (
                    <a
                      href={detail.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {detail.demo_url.includes('play.google.com') ? 'Play Store' : 'Demo'}
                    </a>
                  )}
                  {detail?.github_url && (
                    <a
                      href={detail.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
