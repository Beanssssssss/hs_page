'use client';

import type { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import ProjectImages from '@/components/ui/project/images';
import ProjectVideos from '@/components/ui/project/videos';

export default function ProjectDetailPd({
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
          {generation?.name} · PD 파이널 프로젝트
        </div>
        <h1 className="text-3xl font-bold">
          {project.title}
        </h1>
      </header>

      {/* 썸네일 */}
      <img
        src={project.thumbnail_url}
        alt={project.title}
        className="w-full rounded-xl object-cover"
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
      {detail?.youtube_url && (
        <div className="flex gap-4">
          <Button
            asChild
            variant="red"
            size="lg"
          >
            <a
              href={detail.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>
          </Button>
        </div>
      )}

      <ProjectVideos media={project.project_media} />
      <ProjectImages media={project.project_media} />
    </div>
  );
}
