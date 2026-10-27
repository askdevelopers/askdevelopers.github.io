import { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { EASE } from './motion';
import { NAV_LINKS } from '@/lib/data';

/** Thin, always-dark translucent bar. Slides away while scrolling down and returns on the way up. */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 140 && !open);
  });

  return (
    <motion.header
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.4, ease: EASE }}
      className="theme-dark fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink-950/70 backdrop-blur-xl"
    >
      <nav className="container-x flex h-14 items-center justify-between">
        <a href="#home" aria-label="Ask Developers home">
          <Logo />
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-[13px] text-white/80 transition-colors hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#contact" className="btn-primary hidden !px-4 !py-1.5 !text-[13px] md:inline-flex">
          Book a call
        </a>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-white md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden border-t border-white/10 bg-ink-950/90 md:hidden"
          >
            <ul className="container-x space-y-1 py-4">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.4, ease: EASE }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 text-lg font-medium text-white/90 hover:text-white"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <li className="pt-3">
                <a href="#contact" onClick={() => setOpen(false)} className="btn-primary w-full">
                  Book a call
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
