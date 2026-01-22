"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Media = {
  id: number;
  project_id: number;
  media_type: "image" | "video";
  media_url: string;
  order_index: number | null;
};

export default function ProjectMediaPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();

  const projectId = Number(params.id);

  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [project, setProject] = useState<any>(null);

  // 새로 추가할 미디어
  type NewMediaItem = {
    file: File;
    type: "image" | "video";
    orderIndex: number;
    previewUrl: string;
  };
  const [newMediaItems, setNewMediaItems] = useState<NewMediaItem[]>([]);

  // ===============================
  // 프로젝트 및 미디어 전체 조회
  // ===============================
  useEffect(() => {
    if (!projectId) return;

    const loadData = async () => {
      // 프로젝트 정보 조회
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (projectError) {
        alert("프로젝트 정보를 불러오지 못했습니다.");
        return;
      }

      setProject(projectData);

      // 미디어 조회
      const { data, error } = await supabase
        .from("project_media")
        .select("*")
        .eq("project_id", projectId)
        .order("order_index", { ascending: true });

      if (error) {
        alert(error.message);
        return;
      }

      setMediaList(data ?? []);
      setLoading(false);
    };

    loadData();
  }, [projectId]);

  // ===============================
  // 미디어 수정
  // ===============================
  const updateMedia = async (media: Media) => {
    setSavingId(media.id);

    const { error } = await supabase
      .from("project_media")
      .update({
        media_type: media.media_type,
        media_url: media.media_url,
        order_index: media.order_index,
      })
      .eq("id", media.id); // ⚠️ 절대 project_id 쓰지 말 것

    setSavingId(null);

    if (error) {
      alert(error.message);
      return;
    }

    alert("미디어가 수정되었습니다.");
  };

  // ===============================
  // 미디어 삭제
  // ===============================
  const deleteMedia = async (mediaId: number) => {
    const ok = confirm("이 미디어를 삭제할까요?");
    if (!ok) return;

    const { error } = await supabase
      .from("project_media")
      .delete()
      .eq("id", mediaId);

    if (error) {
      alert(error.message);
      return;
    }

    setMediaList((prev) => prev.filter((m) => m.id !== mediaId));
  };

  // ===============================
  // 썸네일 지정 (image만)
  // ===============================
  const setAsThumbnail = async (mediaUrl: string) => {
    const ok = confirm("이 이미지를 프로젝트 썸네일로 지정할까요?");
    if (!ok) return;

    const { error } = await supabase
      .from("projects")
      .update({
        thumbnail_url: mediaUrl,
      })
      .eq("id", projectId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("썸네일이 변경되었습니다.");
  };

  // ===============================
  // Storage 경로 생성
  // ===============================
  const getStoragePath = async (fileName: string): Promise<string> => {
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

  // ===============================
  // 새 미디어 파일 선택
  // ===============================
  const handleNewMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const items: NewMediaItem[] = files.map((file, index) => {
      const previewUrl = URL.createObjectURL(file);
      const isVideo = file.type.startsWith("video/");

      return {
        file,
        type: isVideo ? "video" : "image",
        orderIndex: mediaList.length + newMediaItems.length + index,
        previewUrl,
      };
    });

    setNewMediaItems((prev) => [...prev, ...items]);
    e.target.value = "";
  };

  // ===============================
  // 새 미디어 삭제
  // ===============================
  const removeNewMedia = (index: number) => {
    setNewMediaItems((prev) => prev.filter((_, i) => i !== index));
  };

  // ===============================
  // 새 미디어 정보 업데이트
  // ===============================
  const updateNewMediaItem = (
    index: number,
    updates: Partial<NewMediaItem>
  ) => {
    setNewMediaItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };

  // ===============================
  // 새 미디어 업로드 및 저장
  // ===============================
  const saveNewMedia = async () => {
    if (newMediaItems.length === 0) {
      alert("추가할 미디어가 없습니다.");
      return;
    }

    if (!project) {
      alert("프로젝트 정보를 불러오지 못했습니다.");
      return;
    }

    // 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("로그인이 필요합니다.");
      return;
    }

    setUploading(true);

    try {
      for (let i = 0; i < newMediaItems.length; i++) {
        const item = newMediaItems[i];
        const ext =
          item.file.name.split(".").pop() ||
          (item.type === "video" ? "mp4" : "jpg");
        const fileName = `${item.type}_${Date.now()}_${i}.${ext}`;
        const storagePath = await getStoragePath(fileName);

        if (!storagePath) {
          console.warn(`미디어 ${i + 1} 저장 경로 생성 실패`);
          continue;
        }

        // Storage에 업로드
        const { error: uploadError } = await supabase.storage
          .from("hateslop_data")
          .upload(storagePath, item.file, { upsert: true });

        if (uploadError) {
          console.error(`미디어 ${i + 1} 업로드 에러:`, uploadError);
          continue;
        }

        // 공개 URL 가져오기
        const { data: urlData } = supabase.storage
          .from("hateslop_data")
          .getPublicUrl(storagePath);

        // DB에 저장
        const { error: insertError } = await supabase
          .from("project_media")
          .insert({
            project_id: projectId,
            media_type: item.type,
            media_url: urlData.publicUrl,
            order_index: item.orderIndex,
          });

        if (insertError) {
          console.error(`미디어 ${i + 1} DB 저장 에러:`, insertError);
        }
      }

      // 미디어 목록 새로고침
      const { data, error } = await supabase
        .from("project_media")
        .select("*")
        .eq("project_id", projectId)
        .order("order_index", { ascending: true });

      if (!error && data) {
        setMediaList(data);
      }

      setNewMediaItems([]);
      alert("미디어가 추가되었습니다.");
    } catch (error) {
      console.error("미디어 추가 중 오류:", error);
      alert("미디어 추가 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">로딩 중...</p>;
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">프로젝트 미디어 관리</h1>

        <Button
          variant="outline"
          onClick={() =>
            router.push(`/posts/projects/project/${projectId}`)
          }
        >
          프로젝트 수정으로 돌아가기
        </Button>
      </div>

      {/* 새 미디어 추가 섹션 */}
      <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">새 미디어 추가</h2>
          <Input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleNewMediaSelect}
            disabled={uploading}
            className="w-auto"
          />
        </div>

        {newMediaItems.length > 0 && (
          <div className="space-y-3">
            {newMediaItems.map((item, index) => (
              <div key={index} className="border rounded p-3 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {item.type === "image" ? (
                      <img
                        src={item.previewUrl}
                        alt=""
                        className="w-24 h-24 object-cover rounded border"
                      />
                    ) : (
                      <video
                        src={item.previewUrl}
                        controls
                        className="w-24 h-24 rounded border"
                      />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={item.type}
                        onChange={(e) =>
                          updateNewMediaItem(index, {
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
                          updateNewMediaItem(index, {
                            orderIndex: Number(e.target.value),
                          })
                        }
                        className="w-20"
                      />

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeNewMedia(index)}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button onClick={saveNewMedia} disabled={uploading}>
              {uploading ? "업로드 중..." : "미디어 추가"}
            </Button>
          </div>
        )}
      </div>

      {/* 기존 미디어 */}
      <div className="space-y-4">
        <h2 className="font-semibold">기존 미디어</h2>

        {mediaList.length === 0 && (
          <p className="text-muted-foreground">
            등록된 미디어가 없습니다.
          </p>
        )}

        {/* 미디어 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mediaList.map((media, index) => (
          <div
            key={media.id}
            className="border rounded p-4 space-y-4"
          >
            {/* 미리보기 */}
            {media.media_type === "image" ? (
              <img
                src={media.media_url}
                alt=""
                className="w-full h-48 object-cover rounded"
              />
            ) : (
              <video
                src={media.media_url}
                controls
                className="w-full h-48 rounded"
                preload="metadata"
                playsInline
              />
            )}

            {/* 타입 */}
            <div className="space-y-1">
              <label className="text-sm font-medium">미디어 타입</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={media.media_type}
                onChange={(e) => {
                  const value = e.target.value as "image" | "video";
                  setMediaList((prev) =>
                    prev.map((m) =>
                      m.id === media.id ? { ...m, media_type: value } : m
                    )
                  );
                }}
              >
                <option value="image">image</option>
                <option value="video">video</option>
              </select>
            </div>

            {/* URL */}
            <div className="space-y-1">
              <label className="text-sm font-medium">미디어 URL</label>
              <Input
                value={media.media_url}
                onChange={(e) =>
                  setMediaList((prev) =>
                    prev.map((m) =>
                      m.id === media.id
                        ? { ...m, media_url: e.target.value }
                        : m
                    )
                  )
                }
              />
            </div>

            {/* 순서 */}
            <div className="space-y-1">
              <label className="text-sm font-medium">정렬 순서</label>
              <Input
                type="number"
                value={media.order_index ?? 0}
                onChange={(e) =>
                  setMediaList((prev) =>
                    prev.map((m) =>
                      m.id === media.id
                        ? { ...m, order_index: Number(e.target.value) }
                        : m
                    )
                  )
                }
              />
            </div>

            {/* 액션 */}
            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => updateMedia(media)}
                  disabled={savingId === media.id}
                >
                  {savingId === media.id ? "저장 중..." : "저장"}
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMedia(media.id)}
                >
                  삭제
                </Button>
              </div>

              {media.media_type === "image" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAsThumbnail(media.media_url)}
                >
                  썸네일로 지정
                </Button>
              )}
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}