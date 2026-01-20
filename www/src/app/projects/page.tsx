'use client';

import { Navigation } from '@/components/layout/navigation';
import { ProjectHeroSection } from '@/components/sections/projects/project-hero-section';
import { ProjectGridSection } from '@/components/sections/projects/project-grid-section';
import { Footer } from '@/components/sections/footer';

export default function ProjectsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <ProjectHeroSection />
      <ProjectGridSection />
      <Footer />
    </main>
  );
}
