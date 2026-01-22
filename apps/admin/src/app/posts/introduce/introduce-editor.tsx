"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function IntroduceEditor({
  mode,
  introduce,
  onSaved,
}: {
  mode: "create" | "edit";
  introduce?: any;
  onSaved: () => void;
}) {
  const supabase = createClient();

  const [title, setTitle] = useState(introduce?.title ?? "");
  const [content, setContent] = useState(introduce?.content ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력하세요.");
      return;
    }

    setSaving(true);

    const now = new Date().toISOString();

    try {
      if (mode === "edit") {
        const { error } = await supabase
          .from("introduce")
          .update({
            title,
            content,
            updated_at: now,
          })
          .eq("id", introduce.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("introduce").insert({
          title,
          content,
          created_at: now,
          updated_at: now,
        });

        if (error) throw error;
      }

      onSaved();
    } catch (err) {
      console.error("Introduce 저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={saving}
      />

      <Textarea
        rows={10}
        placeholder="소개 내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={saving}
      />

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "저장 중..." : mode === "edit" ? "수정 저장" : "새로 작성"}
      </Button>
    </div>
  );
}