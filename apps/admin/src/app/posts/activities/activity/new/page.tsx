"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Generation = { id: number; name: string; year: number | null };

export default function ActivityNewPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryGenerationId = searchParams.get("generation_id");

  const [saving, setSaving] = useState(false);
  const [generations, setGenerations] = useState<Generation[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [generationId, setGenerationId] = useState<string>("");

  useEffect(() => {
    supabase
      .from("generations")
      .select("id, name, year")
      .order("id", { ascending: false })
      .then(({ data }) => {
        const list = data ?? [];
        setGenerations(list);
        if (queryGenerationId && list.some((g) => String(g.id) === queryGenerationId)) {
          setGenerationId(queryGenerationId);
        } else if (list.length > 0) {
          setGenerationId((prev) => prev || String(list[0].id));
        }
      });
  }, [queryGenerationId]);

  const handleThumbnailFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    setSaving(true);
    let finalImageUrl: string | null =
      imageUrl.trim() && !imageUrl.trim().startsWith("blob:")
        ? imageUrl.trim()
        : null;

    if (thumbnailFile) {
      setUploadingThumb(true);
      const ext = thumbnailFile.name.split(".").pop() || "jpg";
      const path = `activity_thumbnails/${generationId || "common"}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("hateslop_data")
        .upload(path, thumbnailFile, { upsert: true });
      if (uploadError) {
        setUploadingThumb(false);
        setSaving(false);
        alert("썸네일 업로드 실패: " + uploadError.message);
        return;
      }
      const { data: urlData } = supabase.storage.from("hateslop_data").getPublicUrl(path);
      finalImageUrl = urlData.publicUrl;
      setUploadingThumb(false);
    }

    const { data, error } = await supabase
      .from("activity")
      .insert({
        title: title.trim(),
        description: description.trim() || null,
        category: category.trim() || null,
        date: date || null,
        image_url: finalImageUrl,
        generation_id: generationId ? Number(generationId) : null,
      })
      .select("id")
      .single();

    setSaving(false);
    if (error) {
      alert(error.message);
      return;
    }
    alert("활동이 추가되었습니다.");
    const genId = generationId ? Number(generationId) : null;
    if (genId) {
      router.push(`/posts/activities/generations/${genId}`);
    } else {
      router.push(`/posts/activities/activity/${data.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">활동 추가</h1>
        <Button
          variant="outline"
          onClick={() =>
            router.push(
              queryGenerationId
                ? `/posts/activities/generations/${queryGenerationId}`
                : "/posts/activities"
            )
          }
        >
          목록으로
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>활동 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">제목 *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="활동 제목"
              />
            </div>
            <div>
              <label className="text-sm font-medium">설명</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="활동 설명"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">카테고리</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="예: 워크샵, 세미나"
              />
            </div>
            <div>
              <label className="text-sm font-medium">날짜</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">기수</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={generationId}
                onChange={(e) => setGenerationId(e.target.value)}
              >
                <option value="">선택 안 함</option>
                {generations.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} {g.year != null ? `(${g.year})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">썸네일(image_url) 선택 또는 추가</label>
              <p className="text-xs text-muted-foreground">
                URL 입력 또는 파일 업로드. 목록/카드에 노출되는 대표 이미지입니다.
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                <Input
                  value={thumbnailFile ? "" : imageUrl}
                  onChange={(e) => {
                    setThumbnailFile(null);
                    setImageUrl(e.target.value);
                  }}
                  placeholder="이미지 URL 입력"
                  className="max-w-xs"
                />
                <span className="text-muted-foreground text-sm">또는</span>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailFileSelect}
                  className="w-auto max-w-[200px]"
                />
                {thumbnailFile && (
                  <span className="text-sm text-muted-foreground">
                    선택됨: {thumbnailFile.name}
                  </span>
                )}
              </div>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="미리보기"
                  className="mt-2 w-48 h-32 object-cover rounded border"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={saving || uploadingThumb}>
                {saving ? "저장 중..." : uploadingThumb ? "썸네일 업로드 중..." : "저장"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(
                    queryGenerationId
                      ? `/posts/activities/generations/${queryGenerationId}`
                      : "/posts/activities"
                  )
                }
              >
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
