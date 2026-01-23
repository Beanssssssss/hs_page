"use client";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProjectMedia {
  id: number;
  media_url: string;
  media_type: "image" | "video";
  order_index: number;
}

export default function ProjectImages({
  media,
}: {
  media: ProjectMedia[];
}) {
  const images = media.filter((m) => m.media_type === "image").sort((a, b) => a.order_index - b.order_index);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 키보드 네비게이션
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, currentIndex, images.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  // 슬라이더 열 때 첫 번째 이미지로 리셋
  const handleToggle = () => {
    if (!open) {
      setCurrentIndex(0);
    }
    setOpen(!open);
  };

  if (images.length === 0) return null;

  return (
    <section className="space-y-6">
      <button
        onClick={handleToggle}
        className={cn(
          "group flex items-center gap-3 px-6 py-3.5 rounded-full",
          "bg-gradient-to-r from-purple-50 to-blue-50",
          "border border-purple-200/50",
          "text-gray-700 font-medium text-sm",
          "hover:from-purple-100 hover:to-blue-100",
          "hover:border-purple-300/70",
          "hover:shadow-md",
          "transition-all duration-300 ease-out",
          "active:scale-[0.98]"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            {open ? "이미지 닫기" : "이미지 보기"}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
            {images.length}
          </span>
          {open ? (
            <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-300" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-300 group-hover:translate-y-0.5" />
          )}
        </div>
      </button>

      {open && (
        <div className="relative animate-in fade-in-50 duration-300">
          <div className="flex flex-col items-center">
            {/* 메인 이미지 슬라이더 - 화살표와 함께 */}
            <div className="flex items-center gap-4 w-full justify-center">
              {/* 이전 버튼 - 이미지 왼쪽 */}
              {images.length > 1 && (
                <button
                  onClick={goToPrevious}
                  className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm",
                    "shadow-lg flex items-center justify-center",
                    "hover:bg-black/30 hover:scale-110",
                    "transition-all duration-200",
                    "active:scale-95"
                  )}
                  aria-label="이전 이미지"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}

              {/* 이미지 컨테이너 */}
              <div className="relative inline-block max-w-full rounded-xl overflow-visible bg-transparent flex-1 flex justify-center">
                {/* 이미지 */}
                <div className="relative bg-transparent inline-block">
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      className={cn(
                        "transition-opacity duration-500 ease-in-out bg-transparent",
                        idx === currentIndex 
                          ? "opacity-100 z-10 relative block" 
                          : "opacity-0 z-0 absolute top-0 left-0"
                      )}
                    >
                      <img
                        src={img.media_url}
                        alt={`Project image ${idx + 1}`}
                        className="max-w-full max-h-[80vh] w-auto h-auto object-contain bg-transparent rounded-xl shadow-2xl block"
                      />
                    </div>
                  ))}
                </div>

                {/* 이미지 카운터 */}
                {images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
                    <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                      {currentIndex + 1} / {images.length}
                    </div>
                  </div>
                )}
              </div>

              {/* 다음 버튼 - 이미지 오른쪽 */}
              {images.length > 1 && (
                <button
                  onClick={goToNext}
                  className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm",
                    "shadow-lg flex items-center justify-center",
                    "hover:bg-black/30 hover:scale-110",
                    "transition-all duration-200",
                    "active:scale-95"
                  )}
                  aria-label="다음 이미지"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              )}
            </div>

            {/* 썸네일 네비게이션 - 이미지 아래에 표시 */}
            {images.length > 1 && (
              <div className="mt-6 flex gap-2 overflow-x-auto pb-2 justify-center max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => goToImage(idx)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden",
                      "border-2 transition-all duration-200",
                      "hover:scale-105 active:scale-95",
                      idx === currentIndex
                        ? "border-purple-500 shadow-lg ring-2 ring-purple-200"
                        : "border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-300"
                    )}
                  >
                    <img
                      src={img.media_url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}