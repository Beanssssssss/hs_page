"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectEditPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();

  const projectId = Number(params.id);

  // -----------------------------
  // 상태
  // -----------------------------
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [generationId, setGenerationId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [orderIndex, setOrderIndex] = useState<number>(0);

  const [projectType, setProjectType] =
    useState<"chatbot" | "engineer" | "producer">("chatbot");

  // 🔥 image 미디어만
  const [images, setImages] = useState<any[]>([]);

  // -----------------------------
  // 데이터 로드
  // -----------------------------
  useEffect(() => {
    const loadAll = async () => {
      // 1️⃣ 프로젝트
      const { data: project, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error || !project) {
        alert("프로젝트를 불러오지 못했습니다.");
        router.push("/admin/projects");
        return;
      }

      setTitle(project.title ?? "");
      setSummary(project.summary ?? "");
      setDescription(project.description ?? "");
      setThumbnailUrl(project.thumbnail_url ?? "");
      setOrderIndex(project.order_index ?? 0);
      setProjectType(project.project_type);
      setGenerationId(project.generation_id);

      // 2️⃣ 미디어 (image만)
      const { data: mediaData, error: mediaError } = await supabase
        .from("project_media")
        .select("*")
        .eq("project_id", projectId)
        .eq("media_type", "image")
        .order("id", { ascending: true });

      if (mediaError) {
        console.error(mediaError);
      }

      setImages(mediaData ?? []);
      setLoading(false);
    };

    loadAll();
  }, [projectId, router, supabase]);

  // -----------------------------
  // 수정 저장
  // -----------------------------
  const handleUpdate = async () => {
    if (!title) {
      alert("제목은 필수입니다.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("projects")
      .update({
        title,
        summary,
        description,
        thumbnail_url: thumbnailUrl || null,
        project_type: projectType,
        order_index: orderIndex,
      })
      .eq("id", projectId);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("프로젝트가 수정되었습니다.");
    router.push("/admin/projects");
  };

  // -----------------------------
  // UI
  // -----------------------------
  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="max-w-3xl space-y-10">
      <h1 className="text-2xl font-bold">프로젝트 수정</h1>

      {/* ================= 기본 정보 ================= */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">제목</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium">요약</label>
          <Input value={summary} onChange={(e) => setSummary(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium">설명</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
          />
        </div>

        <div>
          <label className="text-sm font-medium">썸네일 URL</label>
          <Input
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
          />
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              className="mt-2 w-48 h-32 object-cover rounded border"
            />
          )}
        </div>

        <div>
          <label className="text-sm font-medium">프로젝트 타입</label>
          <div className="flex gap-6 mt-2">
            {(["chatbot", "engineer", "producer"] as const).map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={projectType === type}
                  onChange={() => setProjectType(type)}
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">정렬 순서</label>
          <Input
            type="number"
            value={orderIndex}
            onChange={(e) => setOrderIndex(Number(e.target.value))}
          />
        </div>
      </div>

      {/* ================= 이미지 미디어 ================= */}
      <div className="space-y-4 pt-6 border-t">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">이미지 미디어</h2>

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              router.push(`/posts/projects/project/${projectId}/media/new`)
            }
          >
            + 이미지 추가
          </Button>
        </div>

        {images.length === 0 && (
          <p className="text-sm text-muted-foreground">
            등록된 이미지가 없습니다.
          </p>
        )}

        <div className="grid grid-cols-3 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="border rounded p-2 space-y-2 relative"
            >
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/posts/projects/project/${projectId}/media/${img.id}`
                    )
                  }
                >
                  수정
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    const ok = confirm("이 이미지를 삭제할까요?");
                    if (!ok) return;

                    const { error } = await supabase
                      .from("project_media")
                      .delete()
                      .eq("id", img.id);

                    if (error) {
                      alert(error.message);
                      return;
                    }

                    setImages(images.filter((x) => x.id !== img.id));
                  }}
                >
                  삭제
                </Button>
              </div>

              <img
                src={img.media_url}
                className="w-full h-40 object-cover rounded"
              />

              {img.caption && (
                <p className="text-sm text-muted-foreground">
                  {img.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= 저장 버튼 ================= */}
      <div className="flex justify-end gap-2 pt-6">
        <Button variant="outline" onClick={() => router.back()}>
          취소
        </Button>
        <Button onClick={handleUpdate} disabled={saving}>
          {saving ? "저장 중..." : "저장"}
        </Button>
      </div>
    </div>
  );
}