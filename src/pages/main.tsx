import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { PageApp } from './registry';
import '../index.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <PageApp pageKey={root.dataset.page ?? 'not-found'} />
  </StrictMode>
);

// Production HTML is prerendered (scripts/prerender.mjs) and only needs hydrating; the dev server serves the empty shell.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
