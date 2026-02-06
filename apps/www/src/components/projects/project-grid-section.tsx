'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ProjectCard } from './project-card';
import { ProjectDetailModal } from './project-detail-modal';
import { supabase } from '@/lib/supabase';
import type { Project, ProjectType } from '@/types/project';
import { usePageState } from '@/hooks/use-page-state';

type Category = 'all' | 'producer' | 'engineer' | 'chatbot';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'chatbot', label: 'Chatbot' },
  { id: 'producer', label: 'Producer' },
  { id: 'engineer', label: 'Engineer' },
] as const;

interface Generation {
  id: number;
  name: string;
}

interface ProjectsPageState {
  selectedCategory: Category;
  selectedGenerationId: number | null;
  displayCount: number;
}

export function ProjectGridSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridVisible, setGridVisible] = useState(false);
  const [previousDisplayCount, setPreviousDisplayCount] = useState(6);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // 페이지 상태 관리 훅 사용
  const [pageState, updatePageState, restoreScrollPosition] = usePageState<ProjectsPageState>({
    storageKey: 'projects-page-state',
    defaultState: {
      selectedCategory: 'all',
      selectedGenerationId: null,
      displayCount: 6,
    },
    restoreScroll: true,
    scrollRestoreDelay: 300,
    dependencies: [],
  });

  const { selectedCategory, selectedGenerationId, displayCount } = pageState;

  // 초기 상태 복원 시 previousDisplayCount도 복원
  useEffect(() => {
    setPreviousDisplayCount(displayCount);
  }, []); // 마운트 시 한 번만

  // 프로젝트 로드 후 스크롤 위치 복원
  useEffect(() => {
    if (!loading && projects.length > 0) {
      restoreScrollPosition();
    }
  }, [loading, projects.length, restoreScrollPosition]);

  // displayCount 변경 시 previousDisplayCount 업데이트
  useEffect(() => {
    if (displayCount > previousDisplayCount) {
      setPreviousDisplayCount(displayCount);
    }
  }, [displayCount, previousDisplayCount]);

  useEffect(() => {
    fetchProjects();
    fetchGenerations();
  }, []);

  // 카테고리나 기수 변경 시 초기화
  useEffect(() => {
    setPreviousDisplayCount(6);
    updatePageState({ displayCount: 6 });
  }, [selectedCategory, selectedGenerationId, updatePageState]);

  useEffect(() => {
    // 카테고리나 기수가 변경되면 전체 애니메이션 초기화
    const isFilterChange = displayCount <= previousDisplayCount;
    
    if (isFilterChange) {
      setGridVisible(false);
    }
    
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => setGridVisible(e.isIntersecting)),
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );
    const timer = setTimeout(() => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) setGridVisible(true);
        observer.observe(gridRef.current);
      }
    }, 100);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [displayCount, selectedCategory, selectedGenerationId, projects, previousDisplayCount]);

  // displayCount가 증가할 때만 previousDisplayCount 업데이트
  useEffect(() => {
    if (displayCount > previousDisplayCount) {
      setPreviousDisplayCount(displayCount);
    }
  }, [displayCount, previousDisplayCount]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          generations (id, name),
          project_details (*),
          project_media (*)
        `)
        .order('id', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenerations = async () => {
    try {
      const { data, error } = await supabase
        .from('generations')
        .select('id, name')
        .order('id', { ascending: false });

      if (error) throw error;
      setGenerations(data || []);
    } catch (error) {
      console.error('Error fetching generations:', error);
    }
  };

  const getAvailableGenerations = () => {
    if (selectedCategory === 'all') return [];
    
    const categoryProjects = projects.filter(
      (project) => project.project_type === selectedCategory
    );
    
    const generationIds = new Set<number>();
    categoryProjects.forEach((project) => {
      const generation = Array.isArray(project.generations)
        ? project.generations[0]
        : (project.generations as any);
      if (generation?.id) {
        generationIds.add(generation.id);
      }
    });

    return generations.filter((gen) => generationIds.has(gen.id));
  };

  const filteredProjects = projects.filter((project) => {
    const categoryMatch = selectedCategory === 'all' || project.project_type === selectedCategory;
    
    if (!categoryMatch) return false;
    
    if (selectedGenerationId === null) return true;
    
    const projectGeneration = Array.isArray(project.generations)
      ? project.generations[0]
      : (project.generations as any);
    
    return projectGeneration?.id === selectedGenerationId;
  });

  const displayedProjects = filteredProjects.slice(0, displayCount);

  const handleLoadMore = () => {
    updatePageState({ displayCount: displayCount + 6 });
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-24 bg-gray-50">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center">
            <p className="text-gray-600 text-sm sm:text-base">프로젝트를 불러오는 중...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gray-50">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="inline-flex gap-1.5 sm:gap-2 bg-white rounded-full p-1.5 sm:p-2 shadow-md flex-wrap justify-center max-w-full overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  updatePageState({
                    selectedCategory: category.id,
                    selectedGenerationId: null,
                    displayCount: 6,
                  });
                }}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* 기수 탭 - 카테고리가 선택되었을 때만 표시 */}
          {selectedCategory !== 'all' && getAvailableGenerations().length > 0 && (
            <div className="inline-flex gap-2 bg-white rounded-full p-2 shadow-md">
              <button
                onClick={() => {
                  updatePageState({
                    selectedGenerationId: null,
                    displayCount: 6,
                  });
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedGenerationId === null
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                전체
              </button>
              {getAvailableGenerations().map((generation) => (
                <button
                  key={generation.id}
                  onClick={() => {
                    updatePageState({
                      selectedGenerationId: generation.id,
                      displayCount: 6,
                    });
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedGenerationId === generation.id
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {generation.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {displayedProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              해당 카테고리에 프로젝트가 없습니다.
            </p>
          </div>
        ) : (
          <>
            <div 
              ref={gridRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12 auto-rows-fr"
            >
              {displayedProjects.map((project, index) => {
                const generationName = Array.isArray(project.generations)
                  ? project.generations[0]?.name
                  : (project.generations as any)?.name;
                
                // Load More로 추가된 카드만 애니메이션 적용
                const shouldAnimate = gridVisible && index >= previousDisplayCount;
                const animationIndex = index - previousDisplayCount; // 새로 추가된 카드의 상대 인덱스
                
                return (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    summary={project.summary}
                    generation={generationName}
                    thumbnailUrl={project.thumbnail_url}
                    projectType={project.project_type}
                    index={shouldAnimate ? animationIndex : index}
                    shouldAnimate={shouldAnimate}
                    isNewCard={index >= previousDisplayCount}
                    project={project}
                    onOpenModal={(p) => {
                      setSelectedProject(p);
                      setModalOpen(true);
                    }}
                  />
                );
              })}
            </div>

            <ProjectDetailModal
              project={selectedProject}
              open={modalOpen}
              onOpenChange={setModalOpen}
            />

            {displayedProjects.length < filteredProjects.length && (
              <div className="text-center">
                <Button
                  onClick={handleLoadMore}
                  variant="purple"
                  size="lg"
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
