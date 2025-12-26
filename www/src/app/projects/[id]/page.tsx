import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import type { Project } from "../../../types/project";
import ProjectJoint from "./components/page_joint";
import ProjectEngineerFinal from "./components/page_engin";
import ProjectPdFinal from "./components/page_pd";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      summary,
      project_type,
      thumbnail_url,
      generations ( name ),
      project_details (
        description,
        github_url,
        demo_url
      ),
      project_media (
        id,
        media_url,
        media_type,
        order_index
      )
    `)
    .eq("id", id)
    .single();

  if (error || !data) return notFound();

  const project = data as Project;

  switch (project.project_type) {
    case "chatbot":
      return <ProjectJoint project={project} />;

    case "engineer":
      return <ProjectEngineerFinal project={project} />;

    case "pd":
      return <ProjectPdFinal project={project} />;

    default:
      return notFound();
  }
}
