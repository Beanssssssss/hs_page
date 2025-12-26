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
    .select("id, title, generation_id");

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

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          기수별 프로젝트 및 미디어 현황
        </p>
      </div>

      <div className="space-y-8">
        {generations.map((gen) => {
          const genProjects = projectsByGeneration.get(gen.id) ?? [];

          return (
            <div
              key={gen.id}
              className="rounded-xl border bg-white p-6"
            >
              {/* 기수 */}
              <h2 className="text-2xl font-semibold mb-4">
                {gen.name}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({genProjects.length} projects)
                </span>
              </h2>

              {/* 프로젝트 트리 */}
              {genProjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  프로젝트 없음
                </p>
              ) : (
                <ul className="space-y-3 pl-4 border-l">
                  {genProjects.map((project) => {
                    const counts =
                      mediaCountMap.get(project.id) ?? {
                        image: 0,
                        video: 0,
                      };

                    return (
                      <li key={project.id} className="pl-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {project.title}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            이미지 {counts.image} · 영상 {counts.video}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}