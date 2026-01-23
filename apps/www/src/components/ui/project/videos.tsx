"use client";
import { useState } from "react";
import { Video, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectMedia } from "./images";

export default function ProjectVideos({
  media,
}: {
  media: ProjectMedia[];
}) {
  const videos = media.filter((m) => m.media_type === "video");
  const [open, setOpen] = useState(false);

  if (videos.length === 0) return null;

  return (
    <section className="space-y-6">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "group flex items-center gap-3 px-6 py-3.5 rounded-full",
          "bg-gradient-to-r from-red-50 to-pink-50",
          "border border-red-200/50",
          "text-gray-700 font-medium text-sm",
          "hover:from-red-100 hover:to-pink-100",
          "hover:border-red-300/70",
          "hover:shadow-md",
          "transition-all duration-300 ease-out",
          "active:scale-[0.98]"
        )}
      >
        <div className="flex items-center gap-2">
          <Video 
            className={cn(
              "h-5 w-5 transition-transform duration-300",
              open ? "text-red-600" : "text-red-500 group-hover:text-red-600"
            )} 
          />
          <span className="font-semibold">
            {open ? "영상 닫기" : "영상 보기"}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
            {videos.length}
          </span>
          {open ? (
            <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-300" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-300 group-hover:translate-y-0.5" />
          )}
        </div>
      </button>

      {open && (
        <div className="grid grid-cols-1 gap-6 animate-in fade-in-50 duration-300">
          {videos
            .sort((a, b) => a.order_index - b.order_index)
            .map((v, idx) => (
              <div
                key={v.id}
                className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                style={{
                  animationDelay: `${idx * 50}ms`,
                }}
              >
                <video
                  src={v.media_url}
                  controls
                  className="w-full rounded-xl"
                />
              </div>
            ))}
        </div>
      )}
    </section>
  );
}