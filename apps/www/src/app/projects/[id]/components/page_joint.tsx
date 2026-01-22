"use client";
import type { Project } from "@/types/project";
import { PROJECT_TYPE_LABEL } from "@/types/project";

import ProjectImages from "@/components/ui/project/images";
import ProjectVideos from "@/components/ui/project/videos";

export default function ProjectJoint({ project }: { project: Project }) {
  const generation = project.generations[0];
  const detail = project.project_details[0];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header>
        <p className="text-sm text-gray-500">
          {generation?.name} · {PROJECT_TYPE_LABEL.chatbot}
        </p>
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <p className="text-gray-600">{project.summary}</p>
      </header>

      <img
        src={project.thumbnail_url}
        className="rounded-xl w-full"
        alt={project.title}
      />

      {detail?.description && (
        <section className="prose">
          <h2>프로젝트 소개</h2>
          <p>{detail.description}</p>
        </section>
      )}

      <ProjectVideos media={project.project_media} />
      <ProjectImages media={project.project_media} />
    </div>
  );
}