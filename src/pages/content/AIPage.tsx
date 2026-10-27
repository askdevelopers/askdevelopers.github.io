import { AI } from '@/components/AI';
import { Contact } from '@/components/Contact';
import { MorePages } from '../shell/MorePages';
import { PageHero } from '../shell/PageHero';

export function AIPage() {
  return (
    <>
      <PageHero crumb="AI" title="AI that ships.">
        LLM integration, RAG, agents and fine-tuned models, built to work in production on your data and your cloud.
      </PageHero>
      <AI />
      <MorePages current="ai" />
      <Contact />
    </>
  );
}
