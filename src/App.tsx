import { lazy, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { ScrollBot } from '@/components/ScrollBot';
import { BackToTop } from '@/components/BackToTop';
import { Hero } from '@/components/Hero';
import { Platform } from '@/components/Platform';
import { Services } from '@/components/Services';
import { LazySection } from '@/components/LazySection';
import { Footer } from '@/components/Footer';
import { useSmoothScroll } from '@/lib/smooth-scroll';

// Below-the-fold sections load as separate chunks and mount as they approach the viewport.
const AI = lazy(() => import('@/components/AI').then((m) => ({ default: m.AI })));
const Statement = lazy(() => import('@/components/Statement').then((m) => ({ default: m.Statement })));
const Work = lazy(() => import('@/components/Work').then((m) => ({ default: m.Work })));
const CaseStudies = lazy(() => import('@/components/CaseStudies').then((m) => ({ default: m.CaseStudies })));
const TechStack = lazy(() => import('@/components/TechStack').then((m) => ({ default: m.TechStack })));
const Solutions = lazy(() => import('@/components/Solutions').then((m) => ({ default: m.Solutions })));
const Process = lazy(() => import('@/components/Process').then((m) => ({ default: m.Process })));
const WhyUs = lazy(() => import('@/components/WhyUs').then((m) => ({ default: m.WhyUs })));
const Contact = lazy(() => import('@/components/Contact').then((m) => ({ default: m.Contact })));
const SECTION_IMPORTS = [
  () => import('@/components/AI'),
  () => import('@/components/Statement'),
  () => import('@/components/Work'),
  () => import('@/components/CaseStudies'),
  () => import('@/components/TechStack'),
  () => import('@/components/Solutions'),
  () => import('@/components/Process'),
  () => import('@/components/WhyUs'),
  () => import('@/components/Contact'),
];

/** Warm the section chunks once the page is idle, so a fast scroll never waits on the network. */
function usePrefetchSections() {
  useEffect(() => {
    const load = () => SECTION_IMPORTS.forEach((i) => i());
    // Safari has no requestIdleCallback; fall back to a short timer.
    const hasIdle = 'requestIdleCallback' in window;
    const id = hasIdle ? window.requestIdleCallback(load, { timeout: 4000 }) : window.setTimeout(load, 2500);
    return () => {
      if (hasIdle) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);
}

export default function App() {
  useSmoothScroll();
  usePrefetchSections();
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-ink-900 text-[#f4efe6]">
        <Navbar />
        <ScrollBot />
        <BackToTop />
        <main>
          <Hero />
          <Platform />
          <Services />
          <LazySection id="ai" minHeight="160vh">
            <AI />
          </LazySection>
          <LazySection id="about" minHeight="60vh">
            <Statement />
          </LazySection>
          <LazySection id="work" minHeight="180vh">
            <Work />
          </LazySection>
          <LazySection id="case-studies" minHeight="120vh">
            <CaseStudies />
          </LazySection>
          <LazySection id="tech" minHeight="60vh">
            <TechStack />
          </LazySection>
          <LazySection id="solutions" minHeight="100vh">
            <Solutions />
          </LazySection>
          <LazySection id="process" minHeight="120vh">
            <Process />
          </LazySection>
          <LazySection id="why" minHeight="110vh">
            <WhyUs />
          </LazySection>
          <LazySection id="contact" minHeight="100vh">
            <Contact />
          </LazySection>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
