"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ActivityDetailPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();

  const activityId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [activity, setActivity] = useState<any>(null);
  const [generation, setGeneration] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadingThumb, setUploadingThumb] = useState(false);

  const [thumbnailCandidates, setThumbnailCandidates] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const { data: activityData, error: activityError } = await supabase
        .from("activity")
        .select("*, generations(*)")
        .eq("id", activityId)
        .single();

      if (activityError || !activityData) {
        alert("액티비티를 불러오지 못했습니다.");
        router.push("/posts/activities");
        return;
      }

      setActivity(activityData);
      setGeneration(activityData.generations);
      setTitle(activityData.title ?? "");
      setDescription(activityData.description ?? "");
      setCategory(activityData.category ?? "");
      setDate(activityData.date ?? "");
      setImageUrl(activityData.image_url ?? "");

      const { data: mediaData } = await supabase
        .from("activity_media")
        .select("*")
        .eq("activity_id", activityId)
        .order("display_order", { ascending: true });

      setMedia(mediaData ?? []);

      const { data: images } = await supabase
        .from("activity_media")
        .select("id, media_url")
        .eq("activity_id", activityId)
        .eq("media_type", "image");

      setThumbnailCandidates(images ?? []);
      setLoading(false);
    };

    loadData();
  }, [activityId, router, supabase]);

  const handleThumbnailFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
    e.target.value = "";
  };

  const handleUpdate = async () => {
    if (!title) {
      alert("제목은 필수입니다.");
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
      const path = `activity_thumbnails/${activity?.generation_id ?? "common"}/${activityId}_${Date.now()}.${ext}`;
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

    const { error } = await supabase
      .from("activity")
      .update({
        title,
        description,
        category,
        date: date || null,
        image_url: finalImageUrl,
      })
      .eq("id", activityId);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("액티비티가 수정되었습니다.");
    setEditing(false);
    setThumbnailFile(null);
    window.location.reload();
  };

  if (loading) {
    return <p className="text-muted-foreground">로딩 중...</p>;
  }

  if (!activity) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              router.push(
                activity.generation_id
                  ? `/posts/activities/generations/${activity.generation_id}`
                  : "/posts/activities"
              )
            }
          >
            ← 목록으로
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{activity.title}</h1>
            {generation && (
              <p className="text-muted-foreground mt-1">
                {generation.name} ({generation.year})
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setEditing(!editing)}
          >
            {editing ? "취소" : "액티비티 수정"}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/posts/activities/activity/${activityId}/media`)}
          >
            미디어 관리
          </Button>
        </div>
      </div>

      {editing && (
        <Card>
          <CardHeader>
            <CardTitle>액티비티 정보 수정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">제목 *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
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
              <label className="text-sm font-medium">카테고리</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="예: 워크샵, 세미나, 행사 등"
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

            <div className="space-y-3">
              <label className="text-sm font-medium">썸네일(image_url) 선택 또는 추가</label>
              <p className="text-xs text-muted-foreground">
                URL 입력, 파일 업로드, 또는 아래 미디어 이미지 중 선택. 목록/카드에 노출되는 대표 이미지입니다.
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
                  className="w-48 h-32 object-cover rounded border"
                  alt=""
                />
              )}
              {thumbnailCandidates.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">기존 미디어에서 썸네일 선택</p>
                  <div className="grid grid-cols-4 gap-2">
                    {thumbnailCandidates.map((img) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => {
                          setThumbnailFile(null);
                          setImageUrl(img.media_url);
                        }}
                        className={`border rounded overflow-hidden hover:ring-2 transition ${
                          !thumbnailFile && imageUrl === img.media_url
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                      >
                        <img
                          src={img.media_url}
                          className="w-full h-16 object-cover"
                          alt=""
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setEditing(false)}>
                취소
              </Button>
              <Button onClick={handleUpdate} disabled={saving || uploadingThumb}>
                {saving ? "저장 중..." : uploadingThumb ? "썸네일 업로드 중..." : "저장"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!editing && (
        <Card>
          <CardHeader>
            <CardTitle>액티비티 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {imageUrl && (
              <img
                src={imageUrl}
                className="w-full max-w-md h-64 object-cover rounded border"
                alt=""
              />
            )}
            <div>
              <p className="text-sm text-muted-foreground">제목</p>
              <p className="font-medium">{title}</p>
            </div>
            {category && (
              <div>
                <p className="text-sm text-muted-foreground">카테고리</p>
                <p>{category}</p>
              </div>
            )}
            {date && (
              <div>
                <p className="text-sm text-muted-foreground">날짜</p>
                <p>{date}</p>
              </div>
            )}
            {description && (
              <div>
                <p className="text-sm text-muted-foreground">설명</p>
                <p className="whitespace-pre-wrap">{description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">미디어</h2>
          <Button
            variant="outline"
            onClick={() => router.push(`/posts/activities/activity/${activityId}/media`)}
          >
            미디어 관리
          </Button>
        </div>

        {media.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">등록된 미디어가 없습니다</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((m) => (
              <Card key={m.id}>
                <CardContent className="p-0">
                  {m.media_type === "image" ? (
                    <img
                      src={m.media_url}
                      alt=""
                      className="w-full h-48 object-cover rounded-t"
                    />
                  ) : (
                    <video
                      src={m.media_url}
                      controls
                      className="w-full h-48 rounded-t"
                      preload="metadata"
                      playsInline
                    />
                  )}
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">
                      순서: {m.display_order ?? 0}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
