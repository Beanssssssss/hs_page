"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ProjectDetailPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();

  const projectId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [project, setProject] = useState<any>(null);
  const [generation, setGeneration] = useState<any>(null);
  const [details, setDetails] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [orderIndex, setOrderIndex] = useState<number>(0);
  const [projectType, setProjectType] =
    useState<"chatbot" | "engineer" | "producer">("chatbot");

  const [thumbnailCandidates, setThumbnailCandidates] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // 프로젝트 정보
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*, generations(*)")
        .eq("id", projectId)
        .single();

      if (projectError || !projectData) {
        alert("프로젝트를 불러오지 못했습니다.");
        router.push("/posts/projects");
        return;
      }

      setProject(projectData);
      setGeneration(projectData.generations);
      setTitle(projectData.title ?? "");
      setSummary(projectData.summary ?? "");
      setDescription(projectData.description ?? "");
      setThumbnailUrl(projectData.thumbnail_url ?? "");
      setOrderIndex(projectData.order_index ?? 0);
      setProjectType(projectData.project_type);

      // 상세 정보
      const { data: detailData } = await supabase
        .from("project_details")
        .select("*")
        .eq("project_id", projectId);

      setDetails(detailData ?? []);

      // 미디어
      const { data: mediaData } = await supabase
        .from("project_media")
        .select("*")
        .eq("project_id", projectId)
        .order("order_index", { ascending: true });

      setMedia(mediaData ?? []);

      // 썸네일 후보
      const { data: images } = await supabase
        .from("project_media")
        .select("id, media_url")
        .eq("project_id", projectId)
        .eq("media_type", "image");

      setThumbnailCandidates(images ?? []);
      setLoading(false);
    };

    loadData();
  }, [projectId, router, supabase]);

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
    setEditing(false);
    // 데이터 새로고침
    window.location.reload();
  };

  const handleDeleteDetail = async (detailId: number) => {
    const ok = confirm("이 상세 정보를 삭제할까요?");
    if (!ok) return;

    const { error } = await supabase
      .from("project_details")
      .delete()
      .eq("id", detailId);

    if (error) {
      alert(error.message);
      return;
    }

    setDetails(details.filter((d) => d.id !== detailId));
  };

  if (loading) {
    return <p className="text-muted-foreground">로딩 중...</p>;
  }

  if (!project) {
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
              router.push(`/posts/projects/generations/${project.generation_id}`)
            }
          >
            ← 뒤로
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
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
            {editing ? "취소" : "프로젝트 수정"}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/posts/projects/project/${projectId}/media`)}
          >
            미디어 관리
          </Button>
        </div>
      </div>

      {/* 프로젝트 수정 폼 */}
      {editing && (
        <Card>
          <CardHeader>
            <CardTitle>프로젝트 정보 수정</CardTitle>
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
              <label className="text-sm font-medium">요약</label>
              <Input
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
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

            <div className="space-y-2">
              <label className="text-sm font-medium">썸네일</label>
              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  className="w-48 h-32 object-cover rounded border"
                />
              )}
              {thumbnailCandidates.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">썸네일 후보</p>
                  <div className="grid grid-cols-4 gap-2">
                    {thumbnailCandidates.map((img) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setThumbnailUrl(img.media_url)}
                        className={`border rounded overflow-hidden hover:ring-2 transition ${
                          thumbnailUrl === img.media_url
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

      {/* 프로젝트 정보 (읽기 모드) */}
      {!editing && (
        <Card>
          <CardHeader>
            <CardTitle>프로젝트 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                className="w-full max-w-md h-64 object-cover rounded border"
              />
            )}
            <div>
              <p className="text-sm text-muted-foreground">제목</p>
              <p className="font-medium">{title}</p>
            </div>
            {summary && (
              <div>
                <p className="text-sm text-muted-foreground">요약</p>
                <p>{summary}</p>
              </div>
            )}
            {description && (
              <div>
                <p className="text-sm text-muted-foreground">설명</p>
                <p className="whitespace-pre-wrap">{description}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">타입</p>
              <p className="capitalize">{projectType}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* 상세 정보 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">상세 정보</h2>
          {details.length === 0 && (
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/posts/projects/project/${projectId}/details/new`)
              }
            >
              + 상세 추가
            </Button>
          )}
        </div>

        {details.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                등록된 상세 정보가 없습니다
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/posts/projects/project/${projectId}/details/new`)
                }
              >
                상세 정보 추가하기
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {details.map((detail) => (
              <Card key={detail.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">상세 정보</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/posts/projects/project/${projectId}/details/${detail.id}`
                          )
                        }
                      >
                        수정
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteDetail(detail.id)}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="whitespace-pre-wrap">{detail.description}</p>
                  <div className="flex gap-4 text-sm">
                    {detail.github_url && (
                      <a
                        href={detail.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        GitHub →
                      </a>
                    )}
                    {detail.demo_url && (
                      <a
                        href={detail.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Demo →
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* 미디어 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">미디어</h2>
          <Button
            variant="outline"
            onClick={() => router.push(`/posts/projects/project/${projectId}/media`)}
          >
            + 미디어 추가
          </Button>
        </div>

        {media.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                등록된 미디어가 없습니다
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/posts/projects/project/${projectId}/media`)
                }
              >
                미디어 추가하기
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((m) => (
              <Card key={m.id} className="overflow-hidden">
                {m.media_type === "image" ? (
                  <img
                    src={m.media_url}
                    alt=""
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <video
                    src={m.media_url}
                    controls
                    className="w-full h-48"
                    preload="metadata"
                    playsInline
                  />
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}