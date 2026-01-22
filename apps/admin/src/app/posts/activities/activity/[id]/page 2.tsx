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

  const [thumbnailCandidates, setThumbnailCandidates] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // 액티비티 정보
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

      // 미디어
      const { data: mediaData } = await supabase
        .from("activity_media")
        .select("*")
        .eq("activity_id", activityId)
        .order("display_order", { ascending: true });

      setMedia(mediaData ?? []);

      // 썸네일 후보
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

  const handleUpdate = async () => {
    if (!title) {
      alert("제목은 필수입니다.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("activity")
      .update({
        title,
        description,
        category,
        date: date || null,
        image_url: imageUrl || null,
      })
      .eq("id", activityId);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("액티비티가 수정되었습니다.");
    setEditing(false);
    // 데이터 새로고침
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
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              router.push(`/posts/activities/generations/${activity.generation_id}`)
            }
          >
            ← 뒤로
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

      {/* 액티비티 수정 폼 */}
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
              <label className="text-sm font-medium">카테고리 *</label>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">이미지</label>
              {imageUrl && (
                <img
                  src={imageUrl}
                  className="w-48 h-32 object-cover rounded border"
                />
              )}
              {thumbnailCandidates.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">이미지 후보</p>
                  <div className="grid grid-cols-4 gap-2">
                    {thumbnailCandidates.map((img) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setImageUrl(img.media_url)}
                        className={`border rounded overflow-hidden hover:ring-2 transition ${
                          imageUrl === img.media_url
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                      >
                        <img
                          src={img.media_url}
                          className="w-full h-16 object-cover"
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
              <Button onClick={handleUpdate} disabled={saving}>
                {saving ? "저장 중..." : "저장"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 액티비티 정보 (읽기 모드) */}
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

      {/* 미디어 */}
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
