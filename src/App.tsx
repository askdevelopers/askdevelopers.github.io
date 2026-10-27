import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Statement } from '@/components/Statement';
import { Services } from '@/components/Services';
import { Work } from '@/components/Work';
import { TechStack } from '@/components/TechStack';
import { Process } from '@/components/Process';
import { WhyUs } from '@/components/WhyUs';
import { CtaBand } from '@/components/CtaBand';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-ink-900 text-slate-100">
      <Navbar />
      <main>
        <Hero />
        <Statement />
        <Services />
        <Work />
        <TechStack />
        <Process />
        <WhyUs />
        <CtaBand />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
