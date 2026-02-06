'use client';

import { useEffect, useState, useRef } from 'react';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { ProjectCard } from './projects/project-card';
import { ProjectDetailModal } from './projects/project-detail-modal';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/types/project';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function RecentProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchRecentProjects();
  }, []);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setTimeout(() => setCardsVisible(true), 200);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    // 약간의 지연 후 observer 시작 (DOM 업데이트 대기)
    const timer = setTimeout(() => {
      if (sectionRef.current) {
        // 이미 뷰포트에 있으면 바로 표시
        const rect = sectionRef.current.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInViewport) {
          setIsVisible(true);
          setTimeout(() => setCardsVisible(true), 200);
        } else {
          observer.observe(sectionRef.current);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [loading]);

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
        .order('id', { ascending: false });

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
    <section
      ref={sectionRef}
      className="w-full flex flex-col justify-center items-center py-[87px] gap-[10px] overflow-hidden"
    >
      <div className="container mx-auto px-6">
        {/* Title Section */}
        <div className={`text-center mb-12 transition-all duration-700 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}>
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
            {/* Projects Container - 캐러셀 */}
            <div className="relative max-w-5xl mx-auto">
              {/* 좌측 화살표 */}
              <button
                onClick={() => {
                  setCurrentIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1));
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="이전 프로젝트"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>

              {/* 우측 화살표 */}
              <button
                onClick={() => {
                  setCurrentIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="다음 프로젝트"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>

              {/* 카드 컨테이너 */}
              <div className="relative overflow-visible flex items-center justify-center" style={{ height: '480px' }}>
                {/* 뫼비우스 띠처럼 순환: 가운데 기준으로 양옆 카드 표시 */}
                {[-2, -1, 0, 1, 2].map((offset) => {
                  // 순환 인덱스 계산 (음수나 배열 길이를 넘어가면 순환)
                  const getCircularIndex = (baseIndex: number, offset: number, length: number) => {
                    const index = baseIndex + offset;
                    if (index < 0) return length + index;
                    if (index >= length) return index - length;
                    return index;
                  };

                  const projectIndex = getCircularIndex(currentIndex, offset, projects.length);
                  const project = projects[projectIndex];
                  const absOffset = Math.abs(offset);
                  
                  // 가운데 카드 (offset === 0)는 선명하게, 양옆은 그라데이션
                  const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.5 : absOffset === 2 ? 0.25 : 0;
                  const scale = absOffset === 0 ? 1 : absOffset === 1 ? 0.85 : absOffset === 2 ? 0.75 : 0.65;
                  const translateX = offset * 150; // 카드 간 간격
                  const zIndex = absOffset === 0 ? 10 : absOffset === 1 ? 5 : absOffset === 2 ? 2 : 1;

                  // 초기 애니메이션 (첫 로드 시에만)
                  const initialOpacity = cardsVisible ? opacity : 0;
                  const initialTranslateY = cardsVisible ? 0 : 8;

                  return (
                    <div
                      key={`${project.id}-${offset}`}
                      className="absolute"
                      style={{
                        left: '50%',
                        transform: `translateX(calc(-50% + ${translateX}px)) translateY(${initialTranslateY}px) scale(${scale})`,
                        opacity: initialOpacity,
                        zIndex,
                        width: '100%',
                        maxWidth: '500px',
                        transition: 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1), opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <ProjectCard
                        id={project.id}
                        title={project.title}
                        summary={project.summary}
                        generation={project.generations?.[0]?.name}
                        thumbnailUrl={project.thumbnail_url}
                        projectType={project.project_type}
                        project={project}
                        onOpenModal={(p) => {
                          setSelectedProject(p);
                          setModalOpen(true);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <ProjectDetailModal
              project={selectedProject}
              open={modalOpen}
              onOpenChange={setModalOpen}
            />

            {/* Button: Dark Small (재사용) - 카드 바로 아래 배치 */}
            <div className={`text-center mt-6 transition-all duration-1000 ease-out ${
              cardsVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionDelay: cardsVisible ? '2000ms' : '0ms',
            }}>
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

