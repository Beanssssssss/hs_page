'use client';

import { Navigation } from '@/components/common/layout/navigation';
import { Footer } from '@/components/common/layout/footer';
import { RecruitHeroSection } from '@/components/recruit/recruit-hero-section';
import { SloganSection } from '@/components/recruit/slogan-section';
import { RecruitPositionsSection } from '@/components/recruit/recruit-positions-section';
import { ScheduleSection } from '@/components/recruit/schedule-section';
import { ImportantScheduleSection } from '@/components/recruit/important-schedule-section';
import { FAQSection } from '@/components/recruit/faq-section';

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
