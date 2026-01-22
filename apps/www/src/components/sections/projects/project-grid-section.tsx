'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ProjectCard } from './project-card';
import { supabase } from '@/lib/supabase';
import type { Project, ProjectType } from '@/types/project';

type Category = 'all' | 'pd' | 'engineer' | 'chatbot';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'chatbot', label: 'Chatbot' },
  { id: 'pd', label: 'Producer' },
  { id: 'engineer', label: 'Engineer' },
] as const;

export function ProjectGridSection() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(6);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
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
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      selectedCategory === 'all' || project.project_type === selectedCategory
  );

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
        <div className="flex justify-center mb-12">
          <div className="inline-flex gap-2 bg-white rounded-full p-2 shadow-md">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
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
        </div>

        {displayedProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              해당 카테고리에 프로젝트가 없습니다.
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  summary={project.summary}
                  generation={project.generations?.[0]?.name}
                  thumbnailUrl={project.thumbnail_url}
                  projectType={project.project_type}
                />
              ))}
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

