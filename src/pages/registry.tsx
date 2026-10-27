import type { ComponentType } from 'react';
import type { PageKey } from './routes';
import { PageShell } from './shell/PageShell';
import { ServicesPage } from './content/ServicesPage';
import { AIPage } from './content/AIPage';
import { WorkPage } from './content/WorkPage';
import { ProcessPage } from './content/ProcessPage';
import { AboutPage } from './content/AboutPage';
import { SupportPage } from './content/SupportPage';
import { PrivacyPage } from './content/PrivacyPage';
import { TermsPage } from './content/TermsPage';
import { RefundPage } from './content/RefundPage';
import { DeleteAccountPage } from './content/DeleteAccountPage';
import { NotFoundPage } from './content/NotFoundPage';

const PAGES: Record<PageKey, ComponentType> = {
  services: ServicesPage,
  ai: AIPage,
  work: WorkPage,
  process: ProcessPage,
  about: AboutPage,
  support: SupportPage,
  privacy: PrivacyPage,
  terms: TermsPage,
  refund: RefundPage,
  'delete-account': DeleteAccountPage,
  'not-found': NotFoundPage,
};

/** The page named by the shell's `data-page`, inside the shared header/footer. Rendered on the server and the client. */
export function PageApp({ pageKey }: { pageKey: string }) {
  const Page = PAGES[pageKey as PageKey] ?? NotFoundPage;
  return (
    <PageShell>
      <Page />
    </PageShell>
  );
}
