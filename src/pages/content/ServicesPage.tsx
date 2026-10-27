import { Contact } from '@/components/Contact';
import { Services } from '@/components/Services';
import { Solutions } from '@/components/Solutions';
import { TechStack } from '@/components/TechStack';
import { MorePages } from '../shell/MorePages';
import { PageHero } from '../shell/PageHero';

export function ServicesPage() {
  return (
    <>
      <PageHero crumb="Services" title="Everything you need to ship.">
        One senior team for the full lifecycle of your product: strategy, design, engineering, launch and everything after.
      </PageHero>
      <Services />
      <TechStack />
      <Solutions />
      <MorePages current="services" />
      <Contact />
    </>
  );
}
