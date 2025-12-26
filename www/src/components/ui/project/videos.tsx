"use client";
import { useState } from "react";
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
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        {open ? "영상 닫기 ▲" : `영상 보기 (${videos.length}) ▼`}
      </button>

      {open && (
        <div className="grid grid-cols-1 gap-6">
          {videos
            .sort((a, b) => a.order_index - b.order_index)
            .map((v) => (
              <video
                key={v.id}
                src={v.media_url}
                controls
                className="rounded-lg w-full"
              />
            ))}
        </div>
      )}
    </section>
  );
}