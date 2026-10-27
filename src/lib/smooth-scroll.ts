import { useEffect } from 'react';
import Lenis from 'lenis';

let lenis: Lenis | null = null;

/** Smooth, inertial scrolling. Skipped for users who prefer reduced motion. */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    lenis = new Lenis({ autoRaf: true, lerp: 0.09, anchors: { offset: 0 } });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}

/** Scroll to an element by id, through Lenis when it is active. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: 0 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
