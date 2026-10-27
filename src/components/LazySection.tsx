import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Mounts `children` only once the placeholder comes within `margin` of the viewport,
 * so first paint and first scroll aren't paying for sections far below the fold.
 * The placeholder carries the section id so nav links and the rail still resolve.
 */
export function LazySection({
  id,
  children,
  minHeight = '80vh',
  margin = '1000px',
}: {
  id: string;
  children: ReactNode;
  minHeight?: string;
  margin?: string;
}) {
  // A deep link (/#contact) needs every section present immediately.
  const [ready, setReady] = useState(() => typeof window !== 'undefined' && window.location.hash !== '');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ready) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setReady(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          io.disconnect();
        }
      },
      { rootMargin: `${margin} 0px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ready, margin]);

  if (!ready) return <div id={id} ref={ref} style={{ minHeight }} aria-hidden="true" />;
  return <Suspense fallback={<div id={id} style={{ minHeight }} />}>{children}</Suspense>;
}
