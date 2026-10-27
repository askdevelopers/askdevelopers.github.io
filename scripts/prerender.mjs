// Fills each page shell in dist/ with its rendered React markup, so every page is complete static HTML.
// Runs after `vite build` and `vite build --ssr` (see the "build" script in package.json).
import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = path.resolve('dist');
const ssrDir = path.resolve('.prerender');

const entry = (await readdir(ssrDir)).find((f) => /^entry-server\.(m?js)$/.test(f));
if (!entry) throw new Error(`No entry-server bundle in ${ssrDir}`);
const { PAGE_ROUTES, renderPage } = await import(pathToFileURL(path.join(ssrDir, entry)).href);

for (const route of PAGE_ROUTES) {
  const file = path.join(dist, route.file);
  const html = await readFile(file, 'utf8');
  if (!html.includes('<!--app-->')) throw new Error(`${route.file}: missing <!--app--> marker`);
  await writeFile(file, html.replace('<!--app-->', renderPage(route.key)));
  console.log(`prerendered ${route.file}`);
}

await rm(ssrDir, { recursive: true, force: true });
