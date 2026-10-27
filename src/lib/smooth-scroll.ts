import { useEffect } from 'react';
import Lenis from 'lenis';

let lenis: Lenis | null = null;

/** Scroll to an element by id, through Lenis when it is active. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: 0 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Smooth, inertial scrolling (skipped for users who prefer reduced motion), plus
 * in-page anchor handling that scrolls without writing `#section` into the URL.
 * Deep links such as `/#contact` still work on load through the browser.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lenis = new Lenis({ autoRaf: true, lerp: 0.09, anchors: false });
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href')!.slice(1);
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      scrollToId(id);
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}
