'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ProjectCard } from './project-card';
import { supabase } from '@/lib/supabase';
import type { Project, ProjectType } from '@/types/project';

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

export function ProjectGridSection() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedGenerationId, setSelectedGenerationId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(6);

  useEffect(() => {
    fetchProjects();
    fetchGenerations();
  }, []);

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
    setDisplayCount((prev) => prev + 6);
  };

  if (loading) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-600">프로젝트를 불러오는 중...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-6 mb-12">
          {/* 카테고리 탭 */}
          <div className="inline-flex gap-2 bg-white rounded-full p-2 shadow-md">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedGenerationId(null);
                  setDisplayCount(6);
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
                  setSelectedGenerationId(null);
                  setDisplayCount(6);
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
                    setSelectedGenerationId(generation.id);
                    setDisplayCount(6);
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 auto-rows-fr">
              {displayedProjects.map((project) => {
                const generationName = Array.isArray(project.generations)
                  ? project.generations[0]?.name
                  : (project.generations as any)?.name;
                
                return (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    summary={project.summary}
                    generation={generationName}
                    thumbnailUrl={project.thumbnail_url}
                    projectType={project.project_type}
                  />
                );
              })}
            </div>

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

