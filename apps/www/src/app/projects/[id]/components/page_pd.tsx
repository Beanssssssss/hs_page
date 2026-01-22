"use client";

import type { Project } from "@/types/project";
import ProjectImages from "@/components/ui/project/images";
import ProjectVideos from "@/components/ui/project/videos";

export default function ProjectPdFinal({
  project,
}: {
  project: Project;
}) {
  const generation = project.generations[0];
  const detail = project.project_details[0];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      {/* 헤더 */}
      <header className="space-y-3">
        <div className="text-sm text-gray-500">
          {generation?.name} · PD 파이널 프로젝트
        </div>

        <h1 className="text-3xl font-bold">
          {project.title}
        </h1>

        <p className="text-lg text-gray-600">
          {project.summary}
        </p>
      </header>

      {/* 대표 이미지 */}
      <img
        src={project.thumbnail_url}
        alt={project.title}
        className="w-full rounded-xl object-cover"
      />

      {/* 상세 설명 (있는 경우만) */}
      {detail?.description && (
        <section className="prose max-w-none">
          <h2>프로젝트 설명</h2>
          <p>{detail.description}</p>
        </section>
      )}

      {/* 🎥 영상 우선 */}
      <ProjectVideos media={project.project_media} />

      {/* 🖼 이미지 */}
      <ProjectImages media={project.project_media} />
    </div>
  );
}