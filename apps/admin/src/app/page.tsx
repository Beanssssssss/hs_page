import { createClient } from "@/lib/supabase/server";

type MediaCount = {
  image: number;
  video: number;
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1️⃣ 모든 기수
  const { data: generations, error: genError } = await supabase
    .from("generations")
    .select("id, name")
    .order("id");

  if (genError) {
    return <div>기수 데이터를 불러오지 못했습니다.</div>;
  }

  // 2️⃣ 모든 프로젝트
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, generation_id, project_type");

  // 3️⃣ 모든 미디어
  const { data: media } = await supabase
    .from("project_media")
    .select("project_id, media_type");

  // 4️⃣ 프로젝트별 이미지/영상 카운트
  const mediaCountMap = new Map<number, MediaCount>();

  media?.forEach((m) => {
    const current = mediaCountMap.get(m.project_id) ?? {
      image: 0,
      video: 0,
    };

    if (m.media_type === "image") current.image += 1;
    if (m.media_type === "video") current.video += 1;

    mediaCountMap.set(m.project_id, current);
  });

  // 5️⃣ 기수별 프로젝트 묶기
  const projectsByGeneration = new Map<number, typeof projects>();

  projects?.forEach((project) => {
    const list = projectsByGeneration.get(project.generation_id) ?? [];
    list.push(project);
    projectsByGeneration.set(project.generation_id, list);
  });

  // 통계 계산
  const totalProjects = projects?.length ?? 0;
  const totalImages = media?.filter((m) => m.media_type === "image").length ?? 0;
  const totalVideos = media?.filter((m) => m.media_type === "video").length ?? 0;
  
  // 프로젝트 타입별 통계
  const projectsByType = {
    engineer: projects?.filter((p) => p.project_type === "engineer").length ?? 0,
    producer: projects?.filter((p) => p.project_type === "producer").length ?? 0,
    chatbot: projects?.filter((p) => p.project_type === "chatbot").length ?? 0,
  };
  
  // 프로젝트 타입 한글명 매핑
  const typeLabels: Record<string, string> = {
    engineer: "엔지니어",
    producer: "프로듀서",
    chatbot: "챗봇",
  };
  
  // 프로젝트 타입 색상 매핑
  const typeColors: Record<string, string> = {
    engineer: "bg-blue-100 text-blue-800 border-blue-200",
    producer: "bg-purple-100 text-purple-800 border-purple-200",
    chatbot: "bg-green-100 text-green-800 border-green-200",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">대시보드</h1>
        <p className="text-muted-foreground">
          전체 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground mb-1">전체 기수</div>
          <div className="text-3xl font-bold">{generations.length}</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground mb-1">전체 프로젝트</div>
          <div className="text-3xl font-bold">{totalProjects}</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground mb-1">이미지</div>
          <div className="text-3xl font-bold">{totalImages}</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground mb-1">영상</div>
          <div className="text-3xl font-bold">{totalVideos}</div>
        </div>
      </div>

      {/* 프로젝트 타입별 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground mb-1">엔지니어 프로젝트</div>
          <div className="text-3xl font-bold">{projectsByType.engineer}</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground mb-1">프로듀서 프로젝트</div>
          <div className="text-3xl font-bold">{projectsByType.producer}</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground mb-1">챗봇 프로젝트</div>
          <div className="text-3xl font-bold">{projectsByType.chatbot}</div>
        </div>
      </div>

      {/* 기수별 프로젝트 목록 */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">기수별 프로젝트</h2>
        {generations.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            등록된 기수가 없습니다
          </div>
        ) : (
          <div className="space-y-4">
            {generations.map((gen) => {
              const genProjects = projectsByGeneration.get(gen.id) ?? [];

              return (
                <div
                  key={gen.id}
                  className="rounded-lg border bg-card p-6"
                >
                  <h3 className="text-xl font-semibold mb-4">
                    {gen.name}
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({genProjects.length}개 프로젝트)
                    </span>
                  </h3>

                  {genProjects.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      프로젝트 없음
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {/* 타입별로 그룹화 */}
                      {(["engineer", "producer", "chatbot"] as const).map((type) => {
                        const typeProjects = genProjects.filter((p) => p.project_type === type);
                        if (typeProjects.length === 0) return null;

                        return (
                          <div key={type} className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-semibold px-2 py-1 rounded border ${typeColors[type]}`}>
                                {typeLabels[type]}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({typeProjects.length}개)
                              </span>
                            </div>
                            <ul className="space-y-2 ml-4">
                              {typeProjects.map((project) => {
                                const counts =
                                  mediaCountMap.get(project.id) ?? {
                                    image: 0,
                                    video: 0,
                                  };

                                return (
                                  <li key={project.id} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted">
                                    <span className="font-medium">
                                      {project.title}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      이미지 {counts.image} · 영상 {counts.video}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}