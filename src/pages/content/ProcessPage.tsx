import { Contact } from '@/components/Contact';
import { Process } from '@/components/Process';
import { WhyUs } from '@/components/WhyUs';
import { MorePages } from '../shell/MorePages';
import { PageHero } from '../shell/PageHero';

export function ProcessPage() {
  return (
    <>
      <PageHero crumb="Process" title="From idea to launch.">
        Six clear steps with weekly demos, so you always know where your project stands.
      </PageHero>
      <Process />
      <WhyUs />
      <MorePages current="process" />
      <Contact />
    </>
  );
}
