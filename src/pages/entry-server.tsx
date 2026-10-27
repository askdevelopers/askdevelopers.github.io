/* eslint-disable react-refresh/only-export-components -- server entry, not a component module */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { PageApp } from './registry';

export { PAGE_ROUTES } from './routes';

/** Static markup for one page, inserted into its shell by scripts/prerender.mjs. */
export function renderPage(pageKey: string): string {
  return renderToString(
    <StrictMode>
      <PageApp pageKey={pageKey} />
    </StrictMode>
  );
}
