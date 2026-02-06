"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectNewPage() {
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
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [orderIndex, setOrderIndex] = useState<number>(0);

  const [projectType, setProjectType] =
    useState<"chatbot" | "engineer" | "producer">("chatbot");

  // 미디어 관련 상태
  type MediaItem = {
    file: File;
    type: "image" | "video";
    orderIndex: number;
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
  // 썸네일 파일 선택
  // -----------------------------
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnailFile(file);
    
    // 미리보기용 URL 생성
    const previewUrl = URL.createObjectURL(file);
    setThumbnailUrl(previewUrl);
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
        orderIndex: mediaItems.length + index,
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
      return newItems.map((item, i) => ({ ...item, orderIndex: i }));
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
  // Storage 경로 생성 (프로젝트 생성 전)
  // -----------------------------
  const getStoragePathBeforeCreate = async (fileName: string): Promise<string> => {
    if (!generationId || !projectType) return "";

    const generationNumber = generationId;
    const typeFolder = projectType === "engineer" ? "eg" : projectType === "producer" ? "pd" : "chatbot";
    
    // 같은 기수, 같은 타입의 프로젝트 개수 조회하여 번호 결정
    const { data: existingProjects } = await supabase
      .from("projects")
      .select("id")
      .eq("generation_id", generationId)
      .eq("project_type", projectType)
      .order("order_index", { ascending: true });

    const projectNumber = (existingProjects?.length ?? 0) + 1;
    const projectFolder = `${typeFolder}${projectNumber}`;
    
    return `generation_${generationNumber}/${typeFolder}/${projectFolder}/${fileName}`;
  };

  // -----------------------------
  // Storage 경로 생성 (프로젝트 생성 후)
  // -----------------------------
  const getStoragePathAfterCreate = async (project: any, fileName: string): Promise<string> => {
    if (!project) return "";

    const generationNumber = project.generation_id;
    const typeFolder =
      project.project_type === "engineer"
        ? "eg"
        : project.project_type === "producer"
        ? "pd"
        : "chatbot";

    // 같은 기수, 같은 타입의 프로젝트 중에서 order_index 기준으로 몇 번째인지 계산
    const { data: sameTypeProjects } = await supabase
      .from("projects")
      .select("id, order_index")
      .eq("generation_id", generationNumber)
      .eq("project_type", project.project_type)
      .order("order_index", { ascending: true });

    // 현재 프로젝트보다 order_index가 작거나 같은 프로젝트 개수
    const projectNumber =
      (sameTypeProjects?.filter(
        (p) => p.order_index <= (project.order_index ?? 0)
      ).length ?? 0);

    const projectFolder = `${typeFolder}${projectNumber}`;

    return `generation_${generationNumber}/${typeFolder}/${projectFolder}/${fileName}`;
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
      alert("프로젝트 제목을 입력하세요.");
      return;
    }

    if (!thumbnailFile) {
      alert("썸네일 이미지를 업로드해주세요.");
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

      console.log("사용자 정보:", {
        userId: user.id,
        profile: profile,
        profileError: profileError,
      });

      // profiles 레코드가 없거나 role이 'admin'이 아니면 RLS 정책에 의해 차단됨
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

      // 1. 썸네일을 Storage에 업로드 (프로젝트 생성 전이므로 번호 계산)
      const ext = thumbnailFile.name.split(".").pop() || "jpg";
      const fileName = `thumbnail.${ext}`;
      const storagePath = await getStoragePathBeforeCreate(fileName);

      if (!storagePath) {
        alert("저장 경로를 생성할 수 없습니다.");
        setSaving(false);
        return;
      }

      console.log("업로드 정보:", {
        bucket: "hateslop_data",
        path: storagePath,
        fileName: thumbnailFile.name,
        fileSize: thumbnailFile.size,
        userId: user.id,
      });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("hateslop_data")
        .upload(storagePath, thumbnailFile, { upsert: true });

      console.log("업로드 결과:", { uploadData, uploadError });

      if (uploadError) {
        console.error("썸네일 업로드 에러 상세:", {
          message: uploadError.message,
          name: uploadError.name,
          error: uploadError,
        });
        
        // RLS 정책 에러인 경우 더 명확한 메시지
        if (
          uploadError.message.includes("row-level security") ||
          uploadError.message.includes("policy") ||
          uploadError.message.includes("violates")
        ) {
          alert(
            `썸네일 업로드 실패: 권한 오류\n\n` +
            `Storage RLS 정책에 의해 차단되었습니다.\n\n` +
            `확인 사항:\n` +
            `1. profiles 테이블에 현재 사용자(auth.uid())의 레코드가 있는지\n` +
            `2. 해당 레코드의 role이 'admin'으로 설정되어 있는지\n` +
            `3. RLS 정책이 올바르게 설정되어 있는지\n\n` +
            `에러 메시지: ${uploadError.message}\n\n` +
            `브라우저 콘솔을 확인하세요.`
          );
        } else {
          alert(
            `썸네일 업로드 실패\n\n` +
            `에러: ${uploadError.message}\n\n` +
            `브라우저 콘솔을 확인하세요.`
          );
        }
        setSaving(false);
        return;
      }

      // 2. 업로드된 파일의 공개 URL 가져오기
      const { data: urlData } = supabase.storage
        .from("hateslop_data")
        .getPublicUrl(storagePath);

      const finalThumbnailUrl = urlData.publicUrl;

      // 3. 프로젝트를 DB에 저장
      const { data: projectData, error: insertError } = await supabase
        .from("projects")
        .insert({
          title,
          summary,
          description,
          thumbnail_url: finalThumbnailUrl,
          generation_id: generationId,
          project_type: projectType,
          order_index: orderIndex,
        })
        .select()
        .single();

      if (insertError) {
        console.error("프로젝트 생성 에러:", insertError);
        
        // 중복 키 에러인 경우 시퀀스 동기화 안내
        if (insertError.code === "23505") {
          alert(
            `프로젝트 생성 실패: 중복 키 에러\n\n` +
            `데이터베이스 시퀀스가 테이블의 최대 id와 동기화되지 않았습니다.\n\n` +
            `해결 방법:\n` +
            `1. Supabase 대시보드 → SQL Editor로 이동\n` +
            `2. 다음 SQL을 실행:\n\n` +
            `SELECT setval('projects_id_seq', COALESCE((SELECT MAX(id) FROM projects), 1), true);\n\n` +
            `3. 다시 프로젝트 생성을 시도하세요.\n\n` +
            `또는 supabase/fix_projects_sequence.sql 파일을 참고하세요.`
          );
        } else {
          alert(`프로젝트 생성 실패: ${insertError.message}`);
        }
        setSaving(false);
        return;
      }

      const projectId = projectData.id;

      // 4. 미디어 파일들을 Storage에 업로드하고 DB에 저장
      if (mediaItems.length > 0) {
        console.log(`미디어 ${mediaItems.length}개 업로드 시작...`);

        // 프로젝트 생성 후 경로 생성 (프로젝트 정보 사용)
        for (let i = 0; i < mediaItems.length; i++) {
          const mediaItem = mediaItems[i];
          const ext = mediaItem.file.name.split(".").pop() || (mediaItem.type === "video" ? "mp4" : "jpg");
          const fileName = `${mediaItem.type}_${Date.now()}_${i}.${ext}`;
          const mediaStoragePath = await getStoragePathAfterCreate(projectData, fileName);

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

          // project_media 테이블에 저장
          const { error: mediaInsertError } = await supabase
            .from("project_media")
            .insert({
              project_id: projectId,
              media_type: mediaItem.type,
              media_url: mediaUrlData.publicUrl,
              order_index: mediaItem.orderIndex,
            });

          if (mediaInsertError) {
            console.error(`미디어 ${i + 1} DB 저장 에러:`, mediaInsertError);
          } else {
            console.log(`미디어 ${i + 1} 업로드 완료`);
          }
        }
      }

      alert("프로젝트가 생성되었습니다.");
      router.push("/posts/projects");
    } catch (error) {
      console.error("예상치 못한 에러:", error);
      alert("프로젝트 생성 중 오류가 발생했습니다.");
      setSaving(false);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">프로젝트 추가</h1>

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
          placeholder="프로젝트 제목"
        />
      </div>

      {/* 요약 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">요약</label>
        <Input
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="한 줄 요약"
        />
      </div>

      {/* 설명 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">설명</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          placeholder="프로젝트 상세 설명"
        />
      </div>

      {/* 썸네일 */}
      <div className="space-y-4">
        <label className="text-sm font-medium">썸네일 *</label>

        <Input
          type="file"
          accept="image/*"
          onChange={handleThumbnailSelect}
          disabled={uploading || saving}
        />

        {thumbnailUrl && (
          <div className="space-y-2">
            <img
              src={thumbnailUrl}
              className="w-48 h-32 object-cover rounded border"
              alt="thumbnail preview"
            />
            <p className="text-xs text-muted-foreground">
              {generation && title
                ? `저장 경로: generation_${generation.id}/${projectType === "engineer" ? "eg" : projectType === "producer" ? "pd" : "chatbot"}/${title.replace(/[^a-zA-Z0-9가-힣\s]/g, "").replace(/\s+/g, "_").toLowerCase()}/thumbnail.*`
                : "프로젝트 제목을 입력하면 저장 경로가 표시됩니다."}
            </p>
          </div>
        )}
      </div>

      {/* 프로젝트 타입 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">프로젝트 타입</label>
        <div className="flex gap-6">
          {(["chatbot", "engineer", "producer"] as const).map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
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

      {/* 정렬 순서 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">정렬 순서</label>
        <Input
          type="number"
          value={orderIndex}
          onChange={(e) => setOrderIndex(Number(e.target.value))}
        />
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
                        value={item.orderIndex}
                        onChange={(e) =>
                          updateMediaItem(index, {
                            orderIndex: Number(e.target.value),
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