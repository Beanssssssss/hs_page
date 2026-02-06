'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import type { Activity } from '@/types/activity';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityDetailModalProps {
  activity: Activity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivityDetailModal({
  activity,
  open,
  onOpenChange,
}: ActivityDetailModalProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const isMountedRef = useRef(true);

  const imageList = useMemo(() => {
    if (!activity) return [];
    const thumb = activity.image_url;
    const mediaUrls = (activity.activity_media ?? [])
      .filter((m) => m.media_type === 'image' && m.media_url)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((m) => m.media_url)
      .filter((url): url is string => typeof url === 'string' && url !== thumb);
    const list = thumb ? [thumb, ...mediaUrls] : [...mediaUrls];
    return list.filter((url): url is string => typeof url === 'string' && url.length > 0);
  }, [activity]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  useEffect(() => {
    if (!activity || !isMountedRef.current) return;
    setImageIndex(0);
  }, [activity?.id]);

  if (!activity) return null;

  const description = activity.description ?? '';
  const hasMultipleImages = imageList.length > 1;
  const safeImageIndex =
    imageList.length > 0 ? Math.min(imageIndex, imageList.length - 1) : 0;

  const goPrev = () => {
    setImageIndex((i) => (i - 1 + imageList.length) % imageList.length);
  };
  const goNext = () => {
    setImageIndex((i) => (i + 1) % imageList.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[520px] max-h-[calc(100vh-4rem)] my-0 p-0 gap-0 border-0 shadow-xl rounded-2xl overflow-y-auto overflow-x-hidden bg-white">
        <DialogTitle className="sr-only">
          {activity.title ?? '활동 상세'}
        </DialogTitle>
        <div className="bg-white rounded-2xl">
          {/* 이미지 */}
          <div className="relative w-full overflow-hidden rounded-t-2xl min-h-[50vh] bg-neutral-100">
            {imageList.length > 0 && (
              <>
                {imageList.map((url, idx) => (
                  <img
                    key={idx}
                    alt={idx === 0 ? (activity.title ?? '활동') : `이미지 ${idx + 1}`}
                    loading="lazy"
                    className={cn(
                      'w-full h-full object-contain absolute inset-0 transition-opacity duration-300',
                      idx === safeImageIndex
                        ? 'opacity-100 z-0'
                        : 'opacity-0 z-[-1] pointer-events-none'
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
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
                      aria-label="이전 이미지"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goNext();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
                      aria-label="다음 이미지"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 px-2 py-1 rounded-full bg-black/50 text-white text-xs font-medium">
                      {safeImageIndex + 1} / {imageList.length}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="px-6 pt-6 pb-8 md:pb-12">
            {activity.title && (
              <h2 className="text-lg font-semibold text-neutral-900 mb-3">
                {activity.title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-neutral-800 whitespace-pre-line">
                {description}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
