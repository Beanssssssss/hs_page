"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GenerationEditPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();

  const generationId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [year, setYear] = useState<number | "">("");

  useEffect(() => {
    const loadGeneration = async () => {
      const { data, error } = await supabase
        .from("generations")
        .select("*")
        .eq("id", generationId)
        .single();

      if (error || !data) {
        alert("기수 정보를 불러오지 못했습니다.");
        router.push("/posts/projects");
        return;
      }

      setName(data.name);
      setYear(data.year);
      setLoading(false);
    };

    loadGeneration();
  }, [generationId, router, supabase]);

  const handleUpdate = async () => {
    if (!name || !year) {
      alert("이름과 연도를 입력하세요.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("generations")
      .update({ name, year })
      .eq("id", generationId);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("기수 정보가 수정되었습니다.");
    router.push(`/posts/projects/generations/${generationId}`);
  };

  if (loading) {
    return <p className="p-6">로딩 중...</p>;
  }

  return (
    <div className="max-w-xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">기수 수정</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">기수 이름</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 3기"
          />
        </div>

        <div>
          <label className="text-sm font-medium">연도</label>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            placeholder="예: 2025"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/posts/projects/generations/${generationId}`)}
        >
          취소
        </Button>

        <Button onClick={handleUpdate} disabled={saving}>
          {saving ? "저장 중..." : "저장"}
        </Button>
      </div>
    </div>
  );
}
