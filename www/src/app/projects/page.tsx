import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  summary: string;
  thumbnail_url: string;
  project_type: string;
}

interface Generation {
  id: number;
  name: string;
  projects: Project[];
}

const PROJECT_TYPE_LABEL: Record<string, string> = {
  chatbot: "엔지니어·PD 합동 프로젝트",
  engineer: "엔지니어 파이널 프로젝트",
  pd: "PD 파이널 프로젝트",
};

export default async function ProjectsPage() {
  const { data, error } = await supabase
    .from("generations")
    .select(`
      id,
      name,
      projects (
        id,
        title,
        summary,
        thumbnail_url,
        project_type
      )
    `)
    .order("id", { ascending: true });

  if (error || !data) {
    return (
      <div className="p-10 text-red-500">
        프로젝트 데이터를 불러오지 못했습니다.
      </div>
    );
  }

  const generations = data as Generation[];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
      <h1 className="text-3xl font-bold">프로젝트</h1>

      {generations.map((gen) => {
        // project_type 기준 그룹화
        const grouped = gen.projects.reduce((acc, project) => {
          const type = project.project_type;
          if (!acc[type]) acc[type] = [];
          acc[type].push(project);
          return acc;
        }, {} as Record<string, Project[]>);

        return (
          <section key={gen.id} className="space-y-12">
            {/* 기수 제목 */}
            <h2 className="text-2xl font-semibold border-b pb-2">
              {gen.name}
            </h2>

            {/* 프로젝트 타입별 */}
            {Object.entries(PROJECT_TYPE_LABEL).map(([type, label]) => {
              const projects = grouped[type] ?? [];
              if (projects.length === 0) return null;

              return (
                <div key={type} className="space-y-6">
                  <h3 className="text-xl font-medium">{label}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}`}
                        className="
                          block border rounded-xl overflow-hidden
                          hover:shadow-lg transition
                        "
                      >
                        <img
                          src={project.thumbnail_url || "/placeholder.png"}
                          alt={project.title}
                          className="h-40 w-full object-cover"
                        />

                        <div className="p-4 space-y-2">
                          <h4 className="font-semibold">
                            {project.title}
                          </h4>

                          <p className="text-sm text-gray-600 line-clamp-2">
                            {project.summary}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}