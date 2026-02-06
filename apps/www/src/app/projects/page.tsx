'use client';

import { Navigation } from '@/components/common/layout/navigation';
import { Footer } from '@/components/common/layout/footer';
import { ProjectHeroSection } from '@/components/projects/project-hero-section';
import { ProjectGridSection } from '@/components/projects/project-grid-section';

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
