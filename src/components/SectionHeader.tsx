import type { ReactNode } from 'react';
import { Reveal } from './motion';

/** Apple-style section intro: small eyebrow, one very large headline, optional lede. */
export function SectionHeader({
  eyebrow,
  title,
  children,
  align = 'center',
  size = 'lg',
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  align?: 'center' | 'left';
  size?: 'lg' | 'md';
}) {
  const centered = align === 'center';
  return (
    <div className={`${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
      {eyebrow && (
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2
          className={`headline mt-3 ${
            size === 'lg' ? 'text-[2.6rem] leading-[1.04] sm:text-6xl lg:text-7xl' : 'text-3xl leading-[1.08] sm:text-5xl'
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {children && (
        <Reveal delay={0.12}>
          <p className={`lede mt-5 ${centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>{children}</p>
        </Reveal>
      )}
    </div>
  );
}
