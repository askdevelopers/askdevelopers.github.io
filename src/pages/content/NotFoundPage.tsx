import { ArrowUpRight } from 'lucide-react';

/** Served by GitHub Pages for any unknown path (dist/404.html). */
export function NotFoundPage() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col justify-center py-24">
      <p className="eyebrow">404</p>
      <h1 className="headline mt-3 text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">Page not found.</h1>
      <p className="lede mt-5 max-w-xl text-base sm:text-lg">
        The page may have moved or the link may be wrong. The home page and support are a click away.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href="/" className="btn-dark">Go to the home page</a>
        <a href="/support/" className="btn-ghost">
          Support
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
