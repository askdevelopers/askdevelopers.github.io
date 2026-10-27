import { CaseStudies } from '@/components/CaseStudies';
import { Contact } from '@/components/Contact';
import { Work } from '@/components/Work';
import { MorePages } from '../shell/MorePages';
import { PageHero } from '../shell/PageHero';

export function WorkPage() {
  return (
    <>
      <PageHero crumb="Work" title="Built for real businesses.">
        CRMs, e-commerce stores and content platforms that run companies every day, plus apps live on the App Store and
        Play Store.
      </PageHero>
      <CaseStudies />
      <Work />
      <MorePages current="work" />
      <Contact />
    </>
  );
}
