import { lazy } from 'react';
import { MotionConfig } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { ScrollBot } from '@/components/ScrollBot';
import { BackToTop } from '@/components/BackToTop';
import { Hero } from '@/components/Hero';
import { Platform } from '@/components/Platform';
import { ServicesOverview } from '@/components/Services';
import { WorkPreview } from '@/components/Work';
import { WhyPreview } from '@/components/WhyUs';
import { LazySection } from '@/components/LazySection';
import { Footer } from '@/components/Footer';
import { useSmoothScroll } from '@/lib/smooth-scroll';

// The contact form loads as a separate chunk and mounts as it approaches the viewport.
const Contact = lazy(() => import('@/components/Contact').then((m) => ({ default: m.Contact })));

/** A compact home page: one screen per idea, each linking into its inner page (/services/, /ai/, /work/, /process/). */
export default function App() {
  useSmoothScroll();
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-ink-900 text-[#f4efe6]">
        <Navbar />
        <ScrollBot />
        <BackToTop />
        <main>
          <Hero />
          <Platform />
          <ServicesOverview />
          <WorkPreview />
          <WhyPreview />
          <LazySection id="contact" minHeight="100vh">
            <Contact />
          </LazySection>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
