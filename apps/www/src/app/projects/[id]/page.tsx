'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navigation } from '@/components/common/layout/navigation';
import { Footer } from '@/components/common/layout/footer';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/types/project';
import ProjectDetailEngineer from '@/components/projects/detail/project-detail-engineer';
import ProjectDetailPd from '@/components/projects/detail/project-detail-pd';
import ProjectDetailJoint from '@/components/projects/detail/project-detail-joint';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.id);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId || isNaN(projectId)) {
      setError('유효하지 않은 프로젝트 ID입니다.');
      setLoading(false);
      return;
    }

    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select(`
          *,
          generations (name),
          project_details (*),
          project_media (*)
        `)
        .eq('id', projectId)
        .single();

      if (fetchError) throw fetchError;

      if (!data) {
        setError('프로젝트를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      // Supabase에서 반환된 데이터 구조에 따라 변환
      const projectData: Project = {
        ...data,
        generations: Array.isArray(data.generations)
          ? data.generations
          : data.generations
          ? [data.generations]
          : [],
        project_details: data.project_details || [],
        project_media: data.project_media || [],
      };

      setProject(projectData);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('프로젝트를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-600">프로젝트를 불러오는 중...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-gray-600">{error || '프로젝트를 찾을 수 없습니다.'}</p>
          <button
            onClick={() => router.push('/projects')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            프로젝트 목록으로 돌아가기
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  const renderProjectContent = () => {
    switch (project.project_type) {
      case 'engineer':
        return <ProjectDetailEngineer project={project} />;
      case 'pd':
        return <ProjectDetailPd project={project} />;
      case 'chatbot':
        return <ProjectDetailJoint project={project} />;
      default:
        return <ProjectDetailJoint project={project} />;
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      {renderProjectContent()}
      <Footer />
    </main>
  );
}
