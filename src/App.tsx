import { MotionConfig } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { ScrollBot } from '@/components/ScrollBot';
import { Hero } from '@/components/Hero';
import { Platform } from '@/components/Platform';
import { Services } from '@/components/Services';
import { Statement } from '@/components/Statement';
import { Work } from '@/components/Work';
import { CaseStudies } from '@/components/CaseStudies';
import { TechStack } from '@/components/TechStack';
import { Solutions } from '@/components/Solutions';
import { Process } from '@/components/Process';
import { WhyUs } from '@/components/WhyUs';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { useSmoothScroll } from '@/lib/smooth-scroll';

export default function App() {
  useSmoothScroll();
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-ink-900 text-[#f4efe6]">
        <Navbar />
        <ScrollBot />
        <main>
          <Hero />
          <Platform />
          <Services />
          <Statement />
          <Work />
          <CaseStudies />
          <TechStack />
          <Solutions />
          <Process />
          <WhyUs />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
