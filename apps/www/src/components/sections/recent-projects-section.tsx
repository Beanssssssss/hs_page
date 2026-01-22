'use client';

import { useEffect, useState } from 'react';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { ProjectCard } from './projects/project-card';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/types/project';
import Link from 'next/link';

export function RecentProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentProjects();
  }, []);

  const fetchRecentProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          generations (name),
          project_details (*),
          project_media (*)
        `)
        .order('id', { ascending: false })
        .limit(6);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching recent projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="w-full flex flex-col justify-center items-center py-[87px] gap-[10px] overflow-hidden">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-16">
            In HateSlop
          </h2>
          <div className="text-center">
            <p className="text-gray-600">프로젝트를 불러오는 중...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col justify-center items-center py-[87px] gap-[10px] overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Title Section */}
        <div className="text-center mb-12">
          {/* Heading 3: 40px */}
          <Text variant="heading3" as="h2" className="text-black mb-6">
            In HateSlop
          </Text>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            파트별 프로젝트부터 합동 프로젝트까지 다양한 경험을 쌓을 수 있습니다.
          </p>
        </div>

        {/* Projects */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">프로젝트가 없습니다.</p>
          </div>
        ) : (
          <>
            {/* Projects Container - 높이 조정 및 균형 잡힌 레이아웃 */}
            <div className="relative max-w-4xl mx-auto">
              <div className="relative" style={{ height: '480px' }}>
                {projects.slice(0, 3).map((project, index) => (
                  <div
                    key={project.id}
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      top: `${index * 40}px`,
                      zIndex: 10 - index,
                      width: `${100 - index * 5}%`,
                      maxWidth: '500px',
                    }}
                  >
                    <ProjectCard
                      id={project.id}
                      title={project.title}
                      summary={project.summary}
                      generation={project.generations?.[0]?.name}
                      thumbnailUrl={project.thumbnail_url}
                      projectType={project.project_type}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Button: Dark Small (재사용) - 카드 바로 아래 배치 */}
            <div className="text-center mt-6">
              <Link href="/projects">
                <Button 
                  variant="dark" 
                  size="darkSmall"
                  style={{
                    background: 'linear-gradient(180deg, #101011 0%, rgb(43, 43, 44) 100%)'
                  }}
                >
                  프로젝트 더 보기 <span className="ml-1">→</span>
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

