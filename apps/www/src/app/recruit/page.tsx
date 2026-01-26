'use client';

import { Navigation } from '@/components/layout/navigation';
import { RecruitHeroSection } from '@/components/sections/recruit/recruit-hero-section';
import { SloganSection } from '@/components/sections/recruit/slogan-section';
import { RecruitPositionsSection } from '@/components/sections/recruit/recruit-positions-section';
import { ScheduleSection } from '@/components/sections/recruit/schedule-section';
import { ImportantScheduleSection } from '@/components/sections/recruit/important-schedule-section';
import { FAQSection } from '@/components/sections/recruit/faq-section';
import { Footer } from '@/components/sections/footer';

export default function RecruitPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <RecruitHeroSection />
      <SloganSection />
      <RecruitPositionsSection />
      <ScheduleSection />
      <ImportantScheduleSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
