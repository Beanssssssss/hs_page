"use client";
import type { Project } from "@/types/project";
import ProjectImages from "@/components/ui/project/images";
import ProjectVideos from "@/components/ui/project/videos";

export default function ProjectEngineerFinal({
  project,
}: {
  project: Project;
}) {
  const generation = project.generations[0];
  const detail = project.project_details[0];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header className="space-y-4">
        <div className="text-sm text-gray-500">
          {generation?.name} · 엔지니어 파이널 프로젝트
        </div>

        <h1 className="text-3xl font-bold">{project.title}</h1>
        <p className="text-lg text-gray-600">{project.summary}</p>

        <div className="flex gap-4">
          {detail?.github_url && (
            <a
              href={detail.github_url}
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              GitHub
            </a>
          )}

          {detail?.demo_url && (
            <a
              href={detail.demo_url}
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              Demo
            </a>
          )}
        </div>
      </header>

      <img
        src={project.thumbnail_url}
        className="rounded-xl w-full object-cover"
      />

      {detail?.description && (
        <section className="prose max-w-none">
          <h2>프로젝트 소개</h2>
          <p>{detail.description}</p>
        </section>
      )}

      <ProjectVideos media={project.project_media} />
      <ProjectImages media={project.project_media} />
    </div>
  );
}