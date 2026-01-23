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

      {/* 프로듀서 정보 */}
      {detail?.producer && (
        <div className="flex gap-4">
          <div className="w-[calc(50%-0.5rem)]"></div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl border border-pink-200/50 w-[calc(50%-0.5rem)]">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                <span className="text-pink-600 font-bold text-sm">프</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">프로듀서</p>
                <p className="text-base font-semibold text-gray-900">{detail.producer}</p>
              </div>
            </div>
          </div>
        </div>
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
