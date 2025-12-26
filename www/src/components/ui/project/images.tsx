"use client";
import { useState } from "react";

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
  const images = media.filter((m) => m.media_type === "image");
  const [open, setOpen] = useState(false);

  if (images.length === 0) return null;

  return (
    <section className="space-y-6">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        {open ? "이미지 닫기 ▲" : `이미지 보기 (${images.length}) ▼`}
      </button>

      {open && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {images
            .sort((a, b) => a.order_index - b.order_index)
            .map((img) => (
              <img
                key={img.id}
                src={img.media_url}
                className="rounded-lg w-full"
              />
            ))}
        </div>
      )}
    </section>
  );
}