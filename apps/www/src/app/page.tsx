'use client';

import { Navigation } from '@/components/layout/navigation';
import { HeroSection } from '@/components/sections/hero-section';
import { FeatureSection } from '@/components/sections/feature-section';
import { WhySection } from '@/components/sections/why-section';
import { RecentProjectsSection } from '@/components/sections/recent-projects-section';
import { PartnerSection } from '@/components/sections/partner-section';
import { CTASection } from '@/components/sections/cta-section';
import { Footer } from '@/components/sections/footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeatureSection />
      <WhySection />
      <RecentProjectsSection />
      <PartnerSection />
      <CTASection />
      <Footer />
    </main>
  );
}
