import type { HtmlTagDescriptor, Plugin, ResolvedConfig } from 'vite';
import { PAGE_ROUTES } from '../src/pages/routes';
import { BUSINESS, CONTACT } from '../src/lib/business';
import { organizationJsonLd } from '../src/lib/seo';

const SITE_NAME = BUSINESS.name;

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({
  tag: 'meta',
  attrs: Object.fromEntries(Object.entries(attrs).map(([k, v]) => [k, escapeHtml(v)])),
  injectTo: 'head',
});

/**
 * Per-page <head> (title, description, canonical, Open Graph), the Organization structured data on the
 * home page, and the build-time files crawlers and stores look for: sitemap.xml, robots.txt and
 * .well-known/security.txt. All of it comes from src/pages/routes.ts and src/lib/business.ts.
 */
export function sitePages(siteUrl: string): Plugin {
  const site = siteUrl.replace(/\/$/, '');
  let config: ResolvedConfig;

  return {
    name: 'site-pages',
    configResolved(c) {
      config = c;
    },

    transformIndexHtml(html, ctx) {
      const filename = ctx.filename.replace(/\\/g, '/');
      const route = PAGE_ROUTES.find((r) => filename.endsWith(`/${r.file}`));

      if (!route) {
        // Home page: hand-written head plus the business's structured data.
        if (!filename.endsWith('/index.html')) return html;
        return {
          html,
          tags: [
            {
              tag: 'script',
              attrs: { type: 'application/ld+json' },
              children: JSON.stringify(organizationJsonLd(site)),
              injectTo: 'head',
            },
          ],
        };
      }

      const title = route.title.includes(SITE_NAME) ? route.title : `${route.title} · ${SITE_NAME}`;
      const url = `${site}${route.path}`;
      const tags: HtmlTagDescriptor[] = [
        { tag: 'title', children: escapeHtml(title), injectTo: 'head' },
        meta({ name: 'description', content: route.description }),
        meta({ property: 'og:type', content: 'website' }),
        meta({ property: 'og:site_name', content: SITE_NAME }),
        meta({ property: 'og:title', content: title }),
        meta({ property: 'og:description', content: route.description }),
        meta({ property: 'og:image', content: `${site}/og.svg` }),
        meta({ name: 'twitter:card', content: 'summary_large_image' }),
        meta({ name: 'twitter:title', content: title }),
        meta({ name: 'twitter:description', content: route.description }),
        meta({ name: 'twitter:image', content: `${site}/og.svg` }),
      ];
      if (route.index) {
        tags.push(meta({ property: 'og:url', content: url }));
        tags.push({ tag: 'link', attrs: { rel: 'canonical', href: url }, injectTo: 'head' });
      } else {
        tags.push(meta({ name: 'robots', content: 'noindex, nofollow' }));
      }
      return { html, tags };
    },

    generateBundle() {
      if (config.build.ssr) return;
      const today = new Date();
      const isoDay = today.toISOString().slice(0, 10);
      const expires = new Date(today);
      expires.setUTCFullYear(expires.getUTCFullYear() + 1);

      const urls = [
        { loc: `${site}/`, priority: '1.0' },
        ...PAGE_ROUTES.filter((r) => r.index).map((r) => ({ loc: `${site}${r.path}`, priority: '0.5' })),
      ];
      const sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls
          .map(
            (u) =>
              `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${isoDay}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
          )
          .join('\n') +
        `\n</urlset>\n`;

      const robots = `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`;

      const security =
        `Contact: mailto:${CONTACT.email}\n` +
        `Expires: ${expires.toISOString()}\n` +
        `Preferred-Languages: en\n` +
        `Canonical: ${site}/.well-known/security.txt\n` +
        `Policy: ${site}/support/\n`;

      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
      this.emitFile({ type: 'asset', fileName: '.well-known/security.txt', source: security });
    },
  };
}
