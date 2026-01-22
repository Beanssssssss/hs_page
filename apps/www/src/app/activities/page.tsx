'use client';

import { Navigation } from '@/components/layout/navigation';
import { ActivityHeroSection } from '@/components/sections/activities/activity-hero-section';
import { ActivityGridSection } from '@/components/sections/activities/activity-grid-section';
import { Footer } from '@/components/sections/footer';

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
