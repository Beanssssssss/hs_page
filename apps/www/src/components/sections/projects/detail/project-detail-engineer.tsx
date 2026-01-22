'use client';

import type { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import ProjectImages from '@/components/ui/project/images';
import ProjectVideos from '@/components/ui/project/videos';

export default function ProjectDetailEngineer({
  project,
}: {
  project: Project;
}) {
  const generation = project.generations[0];
  const detail = project.project_details[0];

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-12 space-y-12">
      {/* 제목 */}
      <header>
        <div className="text-sm text-gray-500 mb-2">
          {generation?.name} · 엔지니어 파이널 프로젝트
        </div>
        <h1 className="text-3xl font-bold">{project.title}</h1>
      </header>

      {/* 썸네일 */}
      <img
        src={project.thumbnail_url}
        alt={project.title}
        className="rounded-xl w-full object-cover"
      />

      {/* 설명 */}
      {project.description && (
        <section className="prose max-w-none">
          <p className="text-lg text-gray-700 whitespace-pre-line">
            {project.description}
          </p>
        </section>
      )}

      {detail?.description && (
        <section className="prose max-w-none">
          <p className="text-lg text-gray-700 whitespace-pre-line">
            {detail.description}
          </p>
        </section>
      )}

      {/* 버튼들 */}
      <div className="flex gap-4 flex-wrap">
        {detail?.github_url && (
          <Button
            asChild
            variant="purple"
            size="lg"
          >
            <a
              href={detail.github_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Button>
        )}

        {detail?.demo_url && (
          <Button
            asChild
            variant="purple"
            size="lg"
          >
            <a
              href={detail.demo_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Demo
            </a>
          </Button>
        )}
      </div>

      <ProjectVideos media={project.project_media} />
      <ProjectImages media={project.project_media} />
    </div>
  );
}
