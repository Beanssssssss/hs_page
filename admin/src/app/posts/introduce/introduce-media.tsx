"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function IntroduceMedia({ introduceId }: { introduceId: string }) {
  const supabase = createClient();
  const [media, setMedia] = useState<any[]>([]);

  useEffect(() => {
    const fetchMedia = async () => {
      const { data } = await supabase
        .from("introduce_media")
        .select("*")
        .eq("introduce_id", introduceId)
        .order("order_index");

      setMedia(data ?? []);
    };

    fetchMedia();
  }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("introduce_media").delete().eq("id", id);
    setMedia(media.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">미디어</h3>

      <div className="grid grid-cols-2 gap-4">
        {media.map((m) => (
          <div key={m.id} className="border rounded p-2 space-y-2">
            {m.media_type === "image" ? (
              <img src={m.media_url} className="rounded" />
            ) : (
              <video src={m.media_url} controls />
            )}

            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(m.id)}
            >
              삭제
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}