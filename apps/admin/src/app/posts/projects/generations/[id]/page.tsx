"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GenerationProjectsPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();

  const generationId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [generation, setGeneration] = useState<any>(null);
  const [projectsByType, setProjectsByType] = useState<{
    chatbot: any[];
    engineer: any[];
    producer: any[];
  }>({
    chatbot: [],
    engineer: [],
    producer: [],
  });

  useEffect(() => {
    const loadData = async () => {
      // 기수 정보 조회
      const { data: genData, error: genError } = await supabase
        .from("generations")
        .select("*")
        .eq("id", generationId)
        .single();

      if (genError || !genData) {
        alert("기수 정보를 불러오지 못했습니다.");
        router.push("/posts/projects");
        return;
      }

      setGeneration(genData);

      // 프로젝트 조회
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("generation_id", generationId)
        .order("order_index", { ascending: true });

      if (projectsError) {
        console.error("❌ projects 조회 에러", projectsError);
        alert(projectsError.message);
        setLoading(false);
        return;
      }

      const grouped = {
        chatbot: [],
        engineer: [],
        producer: [],
      } as {
        chatbot: any[];
        engineer: any[];
        producer: any[];
      };

      (projectsData ?? []).forEach((project) => {
        if (project.project_type === "chatbot") grouped.chatbot.push(project);
        if (project.project_type === "engineer") grouped.engineer.push(project);
        if (project.project_type === "producer") grouped.producer.push(project);
      });

      setProjectsByType(grouped);
      setLoading(false);
    };

    loadData();
  }, [generationId, router, supabase]);

  const handleDeleteProject = async (project: any) => {
    const ok = confirm(`"${project.title}" 프로젝트를 삭제할까요?`);
    if (!ok) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);

    if (error) {
      console.error("❌ 프로젝트 삭제 실패", error);
      alert(error.message);
      return;
    }

    // 프로젝트 목록 새로고침
    const { data: projectsData } = await supabase
      .from("projects")
      .select("*")
      .eq("generation_id", generationId)
      .order("order_index", { ascending: true });

    const grouped = {
      chatbot: [],
      engineer: [],
      producer: [],
    } as {
      chatbot: any[];
      engineer: any[];
      producer: any[];
    };

    (projectsData ?? []).forEach((project) => {
      if (project.project_type === "chatbot") grouped.chatbot.push(project);
      if (project.project_type === "engineer") grouped.engineer.push(project);
      if (project.project_type === "producer") grouped.producer.push(project);
    });

    setProjectsByType(grouped);
  };

  if (loading) {
    return <p className="text-muted-foreground">로딩 중...</p>;
  }

  if (!generation) {
    return null;
  }

  const totalProjects =
    projectsByType.chatbot.length +
    projectsByType.engineer.length +
    projectsByType.producer.length;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/posts/projects")}
            >
              ← 뒤로
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{generation.name}</h1>
              <p className="text-muted-foreground mt-1">
                {generation.year}년 · 총 {totalProjects}개 프로젝트
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/posts/projects/generations/${generationId}/edit`)}
          >
            기수 수정
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/posts/projects/project/new?generation_id=${generationId}`
              )
            }
          >
            + 프로젝트 추가
          </Button>
        </div>
      </div>

      {/* 프로젝트 목록 */}
      {totalProjects === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              등록된 프로젝트가 없습니다
            </p>
            <Button
              onClick={() =>
                router.push(
                  `/posts/projects/project/new?generation_id=${generationId}`
                )
              }
            >
              첫 프로젝트 추가하기
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {(["chatbot", "engineer", "producer"] as const).map((type) => {
            const projects = projectsByType[type];
            if (projects.length === 0) return null;

            const typeLabels = {
              chatbot: "엔지니어·PD 합동 프로젝트",
              engineer: "엔지니어 파이널 프로젝트",
              producer: "PD 파이널 프로젝트",
            };

            return (
              <div key={type} className="space-y-4">
                <h2 className="text-xl font-semibold">{typeLabels[type]}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <Card
                      key={project.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() =>
                        router.push(`/posts/projects/project/${project.id}`)
                      }
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg line-clamp-2">
                            {project.title}
                          </CardTitle>
                          <div
                            className="flex gap-1 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                router.push(`/posts/projects/project/${project.id}`)
                              }
                            >
                              수정
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteProject(project)}
                            >
                              삭제
                            </Button>
                          </div>
                        </div>
                        {project.summary && (
                          <CardDescription className="line-clamp-2">
                            {project.summary}
                          </CardDescription>
                        )}
                      </CardHeader>
                      {project.thumbnail_url && (
                        <CardContent>
                          <img
                            src={project.thumbnail_url}
                            alt={project.title}
                            className="w-full h-32 object-cover rounded"
                          />
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
