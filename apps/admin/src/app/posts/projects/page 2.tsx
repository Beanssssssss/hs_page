"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function ProjectsAdminPage() {
  const supabase = createClient();
  const router = useRouter();
  const [generations, setGenerations] = useState<any[]>([]);

  // 🔥 type별 프로젝트
  const [projectsByType, setProjectsByType] = useState<{
    chatbot: any[];
    engineer: any[];
    producer: any[];
  }>({
    chatbot: [],
    engineer: [],
    producer: [],
  });

  const [details, setDetails] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);

  const [selectedGeneration, setSelectedGeneration] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // ----------------------------------
  // 1️⃣ generation 전체 조회
  // ----------------------------------
  useEffect(() => {
    supabase
      .from("generations")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => setGenerations(data ?? []));
  }, []);

  // ----------------------------------
  // 2️⃣ generation 선택 → project 조회
  // ----------------------------------
  const loadProjects = async (generation: any) => {
    setSelectedGeneration(generation);
    setSelectedProject(null);
    setDetails([]);
    setMedia([]);

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("generation_id", generation.id)
      .order("order_index", { ascending: true });

    if (error) {
      console.error("❌ projects 조회 에러", error);
      alert(error.message);
      return;
    }
    console.log("✅ projects data", data);

    const grouped = {
      chatbot: [],
      engineer: [],
      producer: [],
    } as {
      chatbot: any[];
      engineer: any[];
      producer: any[];
    };

    (data ?? []).forEach((project) => {
        if (project.project_type === "chatbot") grouped.chatbot.push(project);
        if (project.project_type === "engineer") grouped.engineer.push(project);
        if (project.project_type === "producer") grouped.producer.push(project);
    });
    setProjectsByType(grouped);
  };

  // ----------------------------------
  // 3️⃣ project 선택 → detail + media 조회
  // ----------------------------------
  const loadProjectData = async (project: any) => {
  setSelectedProject(project);

  const { data: detailData, error: detailError } = await supabase
    .from("project_details")
    .select("*")
    .eq("project_id", project.id);

  const { data: mediaData, error: mediaError } = await supabase
    .from("project_media")
    .select("*")
    .eq("project_id", project.id);

  if (detailError) {
    console.error("❌ detail error:", detailError);
  }
  if (mediaError) {
    console.error("❌ media error:", mediaError);
  }

  console.log("✅ detailData:", detailData);
  console.log("✅ mediaData:", mediaData);

  setDetails(detailData ?? []);
  setMedia(mediaData ?? []);
};

  return (
    <div className="grid grid-cols-12 gap-8">

      {/* ================= Generation ================= */}
        <section className="col-span-3 space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">기수</h2>

            <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/posts/projects/generations/new")}
            >
            + 기수 추가
            </Button>
        </div>

        {generations.length === 0 && (
            <p className="text-sm text-muted-foreground">
            등록된 기수가 없습니다
            </p>
        )}

        <div className="space-y-2">
            {generations.map((g) => (
            <div
                key={g.id}
                className={`p-3 border rounded flex items-center justify-between gap-2 ${
                selectedGeneration?.id === g.id ? "bg-muted" : ""
                }`}
            >
                {/* 기수 선택 */}
                <button
                type="button"
                className="text-left flex-1"
                onClick={() => loadProjects(g)}
                >
                <div className="font-medium">{g.name}</div>
                <div className="text-sm text-muted-foreground">
                    {g.year}
                </div>
                </button>

                {/* 액션 버튼 */}
                <div className="flex gap-1 shrink-0">
                {/* 수정 */}
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                    router.push(`/posts/projects/generations/${g.id}`)
                    }
                >
                    수정
                </Button>

                {/* 삭제 */}
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                    const ok = confirm(
                        `${g.name} (${g.year}) 기수를 삭제할까요?\n하위 프로젝트도 모두 삭제됩니다.`
                    );
                    if (!ok) return;

                    const { error } = await supabase
                        .from("generations")
                        .delete()
                        .eq("id", g.id);

                    if (error) {
                        console.error("❌ 기수 삭제 실패", error);
                        alert(error.message);
                        return;
                    }

                    // 상태 초기화
                    setSelectedGeneration(null);
                    setSelectedProject(null);
                    setProjectsByType({
                        chatbot: [],
                        engineer: [],
                        producer: [],
                    });
                    setDetails([]);
                    setMedia([]);

                    // 기수 다시 조회
                    const { data } = await supabase
                        .from("generations")
                        .select("*")
                        .order("id", { ascending: false });

                    setGenerations(data ?? []);
                    }}
                >
                    삭제
                </Button>
                </div>
            </div>
            ))}
        </div>
        </section>

    {/* ================= Projects ================= */}
    <section className="col-span-4 space-y-6">
    <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">프로젝트</h2>

        {selectedGeneration && (
        <Button
            variant="outline"
            size="sm"
            onClick={() =>
            router.push(`/posts/projects/project/new?generation_id=${selectedGeneration.id}`)
            }
        >
            + 프로젝트 추가
        </Button>
        )}
    </div>

    {!selectedGeneration && (
        <p className="text-muted-foreground">기수를 선택하세요</p>
    )}

    {selectedGeneration && (
        <>
        {(["chatbot", "engineer", "producer"] as const).map((type) => (
            <div key={type} className="space-y-2">
            <h3 className="font-semibold capitalize">{type}</h3>

            {projectsByType[type].length === 0 && (
                <p className="text-sm text-muted-foreground">프로젝트 없음</p>
            )}

            <div className="space-y-2">
                {projectsByType[type].map((p) => (
                <div
                    key={p.id}
                    className={`p-3 border rounded flex items-center justify-between gap-3 ${
                    selectedProject?.id === p.id ? "bg-muted" : ""
                    }`}
                >
                    {/* 클릭하면 조회 */}
                    <button
                    type="button"
                    className="text-left flex-1"
                    onClick={() => loadProjectData(p)}
                    >
                    {p.title}
                    </button>

                    <div className="flex gap-2 shrink-0">
                    {/* 수정 */}
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/posts/projects/project/${p.id}`)}
                    >
                        수정
                    </Button>

                    {/* 삭제 (일단 confirm + DB delete) */}
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                        const ok = confirm(`"${p.title}" 프로젝트를 삭제할까요?`);
                        if (!ok) return;

                        const { error } = await supabase
                            .from("projects")
                            .delete()
                            .eq("id", p.id);

                        if (error) {
                            console.error("❌ 프로젝트 삭제 실패", error);
                            alert(error.message);
                            return;
                        }

                        // 리스트 새로고침
                        await loadProjects(selectedGeneration);
                        // 우측 상세 초기화
                        setSelectedProject(null);
                        setDetails([]);
                        setMedia([]);
                        }}
                    >
                        삭제
                    </Button>
                    </div>
                </div>
                ))}
            </div>
            </div>
        ))}
        </>
    )}
    </section>
        {/* ================= Detail + Media ================= */}
        <section className="col-span-5 space-y-8">
        <h2 className="font-bold text-lg">상세 / 미디어</h2>

        {!selectedProject && (
            <p className="text-muted-foreground">
            프로젝트를 선택하세요
            </p>
        )}

        {selectedProject && (
            <>
            {/* ================= Detail ================= */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                <h3 className="font-semibold">상세 정보</h3>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                    router.push(
                        `/admin/projects/${selectedProject.id}/details/new`
                    )
                    }
                >
                    + 상세 추가
                </Button>
                </div>

                {details.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    등록된 상세 정보가 없습니다.
                </p>
                )}

                {details.map((d) => (
                <div
                    key={d.id}
                    className="border p-4 rounded space-y-3 relative"
                >
                    {/* 수정 / 삭제 */}
                    <div className="absolute top-3 right-3 flex gap-1">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                        router.push(
                            `/admin/projects/${selectedProject.id}/details/${d.id}`
                        )
                        }
                    >
                        수정
                    </Button>

                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                        const ok = confirm("이 상세 정보를 삭제할까요?");
                        if (!ok) return;

                        const { error } = await supabase
                            .from("project_details")
                            .delete()
                            .eq("id", d.id);

                        if (error) {
                            alert(error.message);
                            return;
                        }

                        setDetails(details.filter((x) => x.id !== d.id));
                        }}
                    >
                        삭제
                    </Button>
                    </div>

                    <p className="whitespace-pre-wrap pr-24">
                    {d.description}
                    </p>

                    <div className="flex gap-4 text-sm text-blue-600">
                    {d.github_url && (
                        <a href={d.github_url} target="_blank" rel="noreferrer">
                        GitHub
                        </a>
                    )}
                    {d.demo_url && (
                        <a href={d.demo_url} target="_blank" rel="noreferrer">
                        Demo
                        </a>
                    )}
                    </div>
                </div>
                ))}
            </div>

            {/* ================= Media ================= */}
            <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center justify-between">
                <h3 className="font-semibold">미디어</h3>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                    router.push(
                        `/admin/projects/${selectedProject.id}/media/new`
                    )
                    }
                >
                    + 미디어 추가
                </Button>
                </div>

                {media.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    등록된 미디어가 없습니다.
                </p>
                )}

                <div className="grid grid-cols-3 gap-4">
                {media.map((m) => (
                    <div
                    key={m.id}
                    className="border rounded p-2 space-y-2 relative"
                    >
                    {/* 수정 / 삭제 */}
                    <div className="absolute top-2 right-2 flex gap-1 z-10">
                        <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                            router.push(
                            `/admin/projects/${selectedProject.id}/media/${m.id}`
                            )
                        }
                        >
                        수정
                        </Button>

                        <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                            const ok = confirm("이 미디어를 삭제할까요?");
                            if (!ok) return;

                            const { error } = await supabase
                            .from("project_media")
                            .delete()
                            .eq("id", m.id);

                            if (error) {
                            alert(error.message);
                            return;
                            }

                            setMedia(media.filter((x) => x.id !== m.id));
                        }}
                        >
                        삭제
                        </Button>
                    </div>

                    {m.media_type === "image" ? (
                        <img
                        src={m.media_url}
                        alt=""
                        className="w-full h-auto rounded"
                        />
                    ) : (
                        <video
                        src={m.media_url}
                        controls
                        className="w-full rounded"
                        />
                    )}

                    {m.caption && (
                        <p className="text-sm text-muted-foreground">
                        {m.caption}
                        </p>
                    )}
                    </div>
                ))}
                </div>
            </div>
            </>
        )}
        </section>
    </div>
    );
}