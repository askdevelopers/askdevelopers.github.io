import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { EASE, Reveal } from './motion';
import { INDUSTRIES, SOLUTIONS } from '@/lib/data';

export function Solutions() {
  return (
    <section id="solutions" className="theme-light py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="Solutions"
          title={
            <>
              Whatever stage
              <br />
              you&apos;re at.
            </>
          }
        >
          From a first MVP to modernising an enterprise system — we shape the engagement around where your product is
          today.
        </SectionHeader>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.7, ease: EASE, delay: (i % 4) * 0.07 }}
              whileHover={{ y: -5 }}
              className="group rounded-[24px] bg-card p-6 shadow-tile transition-shadow duration-300 hover:shadow-tile-hover sm:p-7"
            >
              <span className="font-mono text-xs text-muted transition-colors group-hover:text-link">{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-8 font-display text-xl font-semibold tracking-tight text-fg">{s.title}</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{s.description}</p>
            </motion.li>
          ))}
        </ul>

        <Reveal className="mx-auto mt-20 max-w-4xl text-center">
          <p className="eyebrow">Industries we serve</p>
          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {INDUSTRIES.map((ind) => (
              <li key={ind} className="rounded-full bg-card px-4 py-2 text-sm text-fg shadow-tile">
                {ind}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
