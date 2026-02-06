'use client';

import { Navigation } from '@/components/common/layout/navigation';
import { Footer } from '@/components/common/layout/footer';
import { ActivityHeroSection } from '@/components/activities/activity-hero-section';
import { ActivityGridSection } from '@/components/activities/activity-grid-section';

export default function ActivitiesPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <ActivityHeroSection />
      <ActivityGridSection />
      <Footer />
    </main>
  );
}
