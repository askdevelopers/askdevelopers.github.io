import { useId } from 'react';

export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  // Unique gradient id per instance — a duplicated id breaks when the first copy is hidden.
  const gid = useId();
  const stroke = `url(#${gid})`;
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6d8dff" />
          <stop offset="0.55" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" className="fill-ink-800" />
      <rect x="0.5" y="0.5" width="63" height="63" rx="15.5" stroke="white" strokeOpacity="0.1" />
      <g stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 14c-7.2 0-12.5 4.8-12.5 11.3 0 2.9 1 5.4 2.7 7.3-2.2.8-3.9 2.5-3.9 4.7 0 1.6 1 3 2.5 3.8-1.6.9-2.6 2.3-2.6 3.9 0 2.6 2.7 4.6 7 4.6 1.4 0 2.7-.2 3.8-.6" />
        <path d="M32 14c7.2 0 12.5 4.8 12.5 11.3 0 2.9-1 5.4-2.7 7.3 2.2.8 3.9 2.5 3.9 4.7 0 1.6-1 3-2.5 3.8 1.6.9 2.6 2.3 2.6 3.9 0 2.6-2.7 4.6-7 4.6-1.4 0-2.7-.2-3.8-.6" />
        <path d="M32 49V32" />
        <path d="M32 38c-2 0-4-1-4-3.4 0-2.2 1.8-3.6 4-3.6" />
        <path d="M32 38c2 0 4-1 4-3.4 0-2.2-1.8-3.6-4-3.6" />
        <path d="M27 49c2.5 1.5 4 2 5 2s2.5-.5 5-2" />
      </g>
      <circle cx="25" cy="27" r="1.6" fill={stroke} />
      <circle cx="39" cy="27" r="1.6" fill={stroke} />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <LogoMark className="h-9 w-9 shrink-0" />
      <span className="font-display text-[1.05rem] font-bold leading-none tracking-tight text-white">
        Ask <span className="text-gradient-brand">Developers</span>
      </span>
    </span>
  );
}
