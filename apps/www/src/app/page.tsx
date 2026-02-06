'use client';

import { Navigation } from '@/components/common/layout/navigation';
import { Footer } from '@/components/common/layout/footer';
import LoopsSoHero0 from '@/components/home/loops-so-hero-0';
import { FeatureSection } from '@/components/home/feature-section';
import { WhySection } from '@/components/home/why-section';
import { RecentProjectsSection } from '@/components/home/recent-projects-section';
import { CTASection } from '@/components/home/cta-section';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <LoopsSoHero0 />
      <FeatureSection />
      <WhySection />
      <RecentProjectsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
