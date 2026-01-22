"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ActivityNewPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // generation_id는 쿼리에서 받음
  const generationId = Number(searchParams.get("generation_id"));

  // -----------------------------
  // 상태
  // -----------------------------
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [generation, setGeneration] = useState<{ id: number; name: string; year: number } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // 미디어 관련 상태
  type MediaItem = {
    file: File;
    type: "image" | "video";
    displayOrder: number;
    previewUrl: string;
  };
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  // -----------------------------
  // generation 정보 표시용 조회
  // -----------------------------
  useEffect(() => {
    if (!generationId) return;

    supabase
      .from("generations")
      .select("id, name, year")
      .eq("id", generationId)
      .single()
      .then(({ data }) => {
        setGeneration(data);
      });
  }, [generationId, supabase]);

  // -----------------------------
  // 이미지 파일 선택
  // -----------------------------
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    
    // 미리보기용 URL 생성
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
  };

  // -----------------------------
  // 미디어 파일 선택
  // -----------------------------
  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newMediaItems: MediaItem[] = files.map((file, index) => {
      const previewUrl = URL.createObjectURL(file);
      const isVideo = file.type.startsWith("video/");
      
      return {
        file,
        type: isVideo ? "video" : "image",
        displayOrder: mediaItems.length + index,
        previewUrl,
      };
    });

    setMediaItems((prev) => [...prev, ...newMediaItems]);
    e.target.value = ""; // 같은 파일 다시 선택 가능하도록
  };

  // -----------------------------
  // 미디어 삭제
  // -----------------------------
  const removeMedia = (index: number) => {
    setMediaItems((prev) => {
      const newItems = prev.filter((_, i) => i !== index);
      // 순서 재정렬
      return newItems.map((item, i) => ({ ...item, displayOrder: i }));
    });
  };

  // -----------------------------
  // 미디어 정보 업데이트
  // -----------------------------
  const updateMediaItem = (index: number, updates: Partial<MediaItem>) => {
    setMediaItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };

  // -----------------------------
  // Storage 경로 생성 (category 기반)
  // -----------------------------
  const getStoragePath = (fileName: string): string => {
    if (!generationId || !category) return "";

    const generationNumber = generationId;
    // category를 안전한 폴더명으로 변환 (한글, 특수문자 제거)
    const safeCategory = category.replace(/[^a-zA-Z0-9가-힣]/g, "").replace(/\s+/g, "_");
    
    return `generation_${generationNumber}/activity/${safeCategory}/${fileName}`;
  };

  // -----------------------------
  // 저장
  // -----------------------------
  const handleSubmit = async () => {
    if (!generationId || !generation) {
      alert("기수 정보가 없습니다.");
      return;
    }

    if (!title) {
      alert("액티비티 제목을 입력하세요.");
      return;
    }

    if (!category) {
      alert("카테고리를 입력하세요.");
      return;
    }

    if (!imageFile) {
      alert("이미지를 업로드해주세요.");
      return;
    }

    setSaving(true);

    try {
      // 0. 인증 및 권한 확인
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        alert("로그인이 필요합니다. 다시 로그인해주세요.");
        router.push("/login");
        setSaving(false);
        return;
      }

      // 0-1. Admin 권한 확인 및 profiles 레코드 확인
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        alert(
          `Storage 업로드 권한 오류\n\n` +
          `profiles 테이블에 현재 사용자의 레코드가 없습니다.\n\n` +
          `Supabase SQL Editor에서 다음을 실행하세요:\n\n` +
          `INSERT INTO profiles (id, role)\n` +
          `VALUES ('${user.id}', 'admin')\n` +
          `ON CONFLICT (id) DO UPDATE SET role = 'admin';\n\n` +
          `또는 profiles 테이블에 수동으로 레코드를 추가하세요.`
        );
        setSaving(false);
        return;
      }

      if (profile.role !== "admin") {
        alert(
          `Storage 업로드 권한 오류\n\n` +
          `현재 사용자의 role이 'admin'이 아닙니다.\n\n` +
          `Supabase SQL Editor에서 다음을 실행하세요:\n\n` +
          `UPDATE profiles SET role = 'admin' WHERE id = '${user.id}';\n\n` +
          `또는 profiles 테이블에서 수동으로 role을 'admin'으로 변경하세요.`
        );
        setSaving(false);
        return;
      }

      // 1. 이미지를 Storage에 업로드
      const ext = imageFile.name.split(".").pop() || "jpg";
      const fileName = `image.${ext}`;
      const storagePath = getStoragePath(fileName);

      if (!storagePath) {
        alert("저장 경로를 생성할 수 없습니다. 카테고리를 확인하세요.");
        setSaving(false);
        return;
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("hateslop_data")
        .upload(storagePath, imageFile, { upsert: true });

      if (uploadError) {
        if (
          uploadError.message.includes("row-level security") ||
          uploadError.message.includes("policy") ||
          uploadError.message.includes("violates")
        ) {
          alert(
            `이미지 업로드 실패: 권한 오류\n\n` +
            `Storage RLS 정책에 의해 차단되었습니다.\n\n` +
            `확인 사항:\n` +
            `1. profiles 테이블에 현재 사용자(auth.uid())의 레코드가 있는지\n` +
            `2. 해당 레코드의 role이 'admin'으로 설정되어 있는지\n\n` +
            `에러 메시지: ${uploadError.message}`
          );
        } else {
          alert(`이미지 업로드 실패: ${uploadError.message}`);
        }
        setSaving(false);
        return;
      }

      // 2. 업로드된 파일의 공개 URL 가져오기
      const { data: urlData } = supabase.storage
        .from("hateslop_data")
        .getPublicUrl(storagePath);

      const finalImageUrl = urlData.publicUrl;

      // 3. 액티비티를 DB에 저장
      const { data: activityData, error: insertError } = await supabase
        .from("activity")
        .insert({
          title,
          description,
          category,
          date: date || null,
          image_url: finalImageUrl,
          generation_id: generationId,
        })
        .select()
        .single();

      if (insertError) {
        console.error("액티비티 생성 에러:", insertError);
        
        // 중복 키 에러인 경우 시퀀스 동기화 안내
        if (insertError.code === "23505") {
          alert(
            `액티비티 생성 실패: 중복 키 에러\n\n` +
            `데이터베이스 시퀀스가 테이블의 최대 id와 동기화되지 않았습니다.\n\n` +
            `해결 방법:\n` +
            `1. Supabase 대시보드 → SQL Editor로 이동\n` +
            `2. 다음 SQL을 실행:\n\n` +
            `SELECT setval('activity_id_seq', COALESCE((SELECT MAX(id) FROM activity), 1), true);\n\n` +
            `3. 다시 액티비티 생성을 시도하세요.`
          );
        } else {
          alert(`액티비티 생성 실패: ${insertError.message}`);
        }
        setSaving(false);
        return;
      }

      const activityId = activityData.id;

      // 4. 미디어 파일들을 Storage에 업로드하고 DB에 저장
      if (mediaItems.length > 0) {
        for (let i = 0; i < mediaItems.length; i++) {
          const mediaItem = mediaItems[i];
          const ext = mediaItem.file.name.split(".").pop() || (mediaItem.type === "video" ? "mp4" : "jpg");
          const fileName = `${mediaItem.type}_${Date.now()}_${i}.${ext}`;
          const mediaStoragePath = getStoragePath(fileName);

          if (!mediaStoragePath) {
            console.warn(`미디어 ${i + 1} 저장 경로 생성 실패`);
            continue;
          }

          // 미디어 파일 업로드
          const { error: mediaUploadError } = await supabase.storage
            .from("hateslop_data")
            .upload(mediaStoragePath, mediaItem.file, { upsert: true });

          if (mediaUploadError) {
            console.error(`미디어 ${i + 1} 업로드 에러:`, mediaUploadError);
            continue;
          }

          // 업로드된 파일의 공개 URL 가져오기
          const { data: mediaUrlData } = supabase.storage
            .from("hateslop_data")
            .getPublicUrl(mediaStoragePath);

          // activity_media 테이블에 저장
          const { error: mediaInsertError } = await supabase
            .from("activity_media")
            .insert({
              activity_id: activityId,
              media_type: mediaItem.type,
              media_url: mediaUrlData.publicUrl,
              display_order: mediaItem.displayOrder,
            });

          if (mediaInsertError) {
            console.error(`미디어 ${i + 1} DB 저장 에러:`, mediaInsertError);
          }
        }
      }

      alert("액티비티가 생성되었습니다.");
      router.push("/posts/activities");
    } catch (error) {
      console.error("예상치 못한 에러:", error);
      alert("액티비티 생성 중 오류가 발생했습니다.");
      setSaving(false);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">액티비티 추가</h1>

      {/* 현재 기수 표시 */}
      {generation && (
        <div className="rounded border bg-muted/40 p-3 text-sm">
          현재 기수:&nbsp;
          <span className="font-medium">
            {generation.name} ({generation.year})
          </span>
        </div>
      )}

      {/* 제목 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">제목</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="액티비티 제목"
        />
      </div>

      {/* 설명 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">설명</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          placeholder="액티비티 상세 설명"
        />
      </div>

      {/* 카테고리 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">카테고리 *</label>
        <Input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="예: 워크샵, 세미나, 행사 등"
        />
        <p className="text-xs text-muted-foreground">
          Storage 경로에 사용됩니다: generation_{generationId}/activity/{category}/
        </p>
      </div>

      {/* 날짜 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">날짜</label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* 이미지 */}
      <div className="space-y-4">
        <label className="text-sm font-medium">이미지 *</label>

        <Input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          disabled={uploading || saving}
        />

        {imageUrl && (
          <div className="space-y-2">
            <img
              src={imageUrl}
              className="w-48 h-32 object-cover rounded border"
              alt="image preview"
            />
          </div>
        )}
      </div>

      {/* 미디어 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">미디어 (이미지/영상)</label>
          <Input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleMediaSelect}
            disabled={uploading || saving}
            className="w-auto"
          />
        </div>

        {mediaItems.length > 0 && (
          <div className="space-y-4 border rounded-lg p-4">
            {mediaItems.map((item, index) => (
              <div key={index} className="border rounded p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  {/* 미리보기 */}
                  <div className="flex-shrink-0">
                    {item.type === "image" ? (
                      <img
                        src={item.previewUrl}
                        alt=""
                        className="w-32 h-24 object-cover rounded border"
                      />
                    ) : (
                      <video
                        src={item.previewUrl}
                        controls
                        className="w-32 h-24 rounded border"
                        preload="metadata"
                        playsInline
                      />
                    )}
                  </div>

                  {/* 정보 입력 */}
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={item.type}
                        onChange={(e) =>
                          updateMediaItem(index, {
                            type: e.target.value as "image" | "video",
                          })
                        }
                      >
                        <option value="image">이미지</option>
                        <option value="video">영상</option>
                      </select>

                      <Input
                        type="number"
                        placeholder="순서"
                        value={item.displayOrder}
                        onChange={(e) =>
                          updateMediaItem(index, {
                            displayOrder: Number(e.target.value),
                          })
                        }
                        className="w-20"
                      />

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeMedia(index)}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => router.back()}>
          취소
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? "저장 중..." : "저장"}
        </Button>
      </div>
    </div>
  );
}
