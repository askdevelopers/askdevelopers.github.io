import { motion } from 'framer-motion';
import { ArrowUp, ChevronRight, FileSpreadsheet, Globe, Plug, Search, ShieldCheck } from 'lucide-react';
import { Robot } from './Robot';
import { EASE } from './motion';

/*
 * Product mock-ups for the "What we build" tabs. Each is a `Frame` that fills its
 * stage; children tagged with `item` stagger in when the stage becomes active.
 * They illustrate layouts and capabilities only — no figures, names or metrics.
 */

const list = {
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  hide: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};
const item = {
  hide: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

type VisualProps = { active: boolean };

function Frame({ active, className = '', children }: VisualProps & { className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      variants={list}
      initial="hide"
      animate={active ? 'show' : 'hide'}
      className={`absolute inset-0 overflow-hidden rounded-[28px] border border-white/10 bg-[#1a1a1a] text-white lg:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* 1 — AI chat agent */
export function AIVisual({ active }: VisualProps) {
  return (
    <Frame active={active} className="flex flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3">
        <Robot className="h-8 w-8" />
        <div>
          <p className="text-sm font-semibold">Ask Agent</p>
          <p className="text-[11px] text-emerald-400">● Online · LLM + RAG + tools</p>
        </div>
        <span className="ml-auto rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/60">Agents</span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <motion.div variants={item} className="max-w-[78%] self-end rounded-2xl rounded-br-md bg-brand-500 px-4 py-2.5 text-[13px] leading-snug text-white">
          Summarise this contract and flag the risks.
        </motion.div>
        <motion.div variants={item} className="flex max-w-[88%] items-start gap-2 self-start">
          <Robot className="mt-1 h-6 w-6 shrink-0" />
          <div className="rounded-2xl rounded-bl-md bg-white/[0.07] px-4 py-2.5 text-[13px] leading-snug text-white/90">
            Done. Three clauses need attention — auto-renewal, liability cap and data residency. Want me to draft the
            redlines?
          </div>
        </motion.div>
        <motion.div variants={item} className="pl-8 font-mono text-[10px] text-white/40">
          Grounded in your documents · cites its sources
        </motion.div>
        <motion.div variants={item} className="mt-auto flex items-center gap-2 rounded-full border border-white/10 bg-ink-950/60 px-4 py-2.5">
          <span className="flex-1 text-[13px] text-white/40">Ask anything…</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
            <ArrowUp className="h-3.5 w-3.5" />
          </span>
        </motion.div>
      </div>
    </Frame>
  );
}

/* 2 — Web dashboard (shapes only, no values) */
const BARS = [35, 52, 44, 68, 58, 80, 64, 90, 72, 100, 84, 96];
const KPIS: [string, string][] = [
  ['Revenue', '0,18 8,14 16,16 24,10 32,12 40,6 48,8 56,3'],
  ['Orders', '0,14 8,16 16,10 24,12 32,8 40,10 48,5 56,6'],
  ['Conversion', '0,16 8,12 16,14 24,9 32,11 40,7 48,8 56,4'],
];
export function WebVisual({ active }: VisualProps) {
  return (
    <Frame active={active} className="flex flex-col">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2.5 w-2.5 rounded-full bg-white/15" />
        ))}
        <span className="ml-2 flex-1 truncate rounded-md bg-white/5 px-3 py-1 font-mono text-[10px] text-white/40">
          app.yourcompany.com/dashboard
        </span>
      </div>
      <div className="flex min-h-0 flex-1">
        <motion.aside variants={item} className="hidden w-36 shrink-0 border-r border-white/10 p-3 sm:block">
          <p className="px-2 text-[10px] uppercase tracking-wider text-white/30">Workspace</p>
          <ul className="mt-2 space-y-1 text-[12px]">
            {['Overview', 'Orders', 'Customers', 'Products', 'Reports'].map((l, i) => (
              <li key={l} className={`rounded-md px-2 py-1.5 ${i === 0 ? 'bg-white/10 text-white' : 'text-white/50'}`}>
                {l}
              </li>
            ))}
          </ul>
        </motion.aside>
        <div className="flex-1 p-4">
          <div className="grid grid-cols-3 gap-2">
            {KPIS.map(([l, pts]) => (
              <motion.div key={l} variants={item} className="rounded-xl bg-white/[0.05] p-3">
                <p className="text-[10px] text-white/40">{l}</p>
                <svg viewBox="0 0 56 20" className="mt-2 h-5 w-full overflow-visible" aria-hidden="true">
                  <polyline points={pts} fill="none" stroke="#ff7a45" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </motion.div>
            ))}
          </div>
          <motion.div variants={item} className="mt-3 rounded-xl bg-white/[0.05] p-3">
            <div className="flex justify-between text-[10px] text-white/40">
              <span>Overview</span>
              <span>Last 12 months</span>
            </div>
            <div className="mt-3 flex h-24 items-end gap-1.5">
              {BARS.map((h, i) => (
                <motion.span
                  key={i}
                  className="flex-1 origin-bottom rounded-sm bg-gradient-to-t from-brand-500 to-amber-500"
                  style={{ height: `${h}%` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: active ? 1 : 0 }}
                  transition={{ duration: 0.7, ease: EASE, delay: active ? 0.35 + i * 0.05 : 0 }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Frame>
  );
}

/* 3 — Mobile apps */
const devicon = (p: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${p}`;
const PLATFORMS = [
  { name: 'Swift', icon: devicon('swift/swift-original.svg'), pos: 'left-[3%] top-[14%]' },
  { name: 'Kotlin', icon: devicon('kotlin/kotlin-original.svg'), pos: 'right-[4%] top-[24%]' },
  { name: 'Flutter', icon: devicon('flutter/flutter-original.svg'), pos: 'left-[6%] bottom-[18%]' },
  { name: 'React Native', icon: devicon('react/react-original.svg'), pos: 'right-[3%] bottom-[12%]' },
];
export function MobileVisual({ active }: VisualProps) {
  return (
    <Frame active={active} className="flex items-center justify-center bg-[radial-gradient(60%_60%_at_50%_40%,rgba(255,90,31,0.22),#1a1a1a_72%)]">
      <motion.div variants={item} className="relative aspect-[9/19] h-[86%] overflow-hidden rounded-[34px] border-[6px] border-ink-600 bg-ink-950 shadow-2xl">
        <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-ink-600" />
        <div className="p-3 pt-10">
          <p className="text-[10px] text-white/40">Good morning</p>
          <p className="text-sm font-semibold">Today</p>
          <svg viewBox="0 0 100 100" className="mx-auto mt-4 h-24 w-24 -rotate-90">
            <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="none" />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#ring)"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: active ? 0.72 : 0 }}
              transition={{ duration: 1.2, ease: EASE, delay: active ? 0.4 : 0 }}
            />
            <defs>
              <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#ff5a1f" />
                <stop offset="1" stopColor="#ffc247" />
              </linearGradient>
            </defs>
          </svg>
          <div className="mt-5 space-y-1.5">
            {['Activity', 'Goals', 'History'].map((l) => (
              <div key={l} className="flex items-center justify-between rounded-lg bg-white/[0.06] px-2.5 py-2 text-[11px]">
                <span className="text-white/80">{l}</span>
                <ChevronRight className="h-3 w-3 text-white/40" />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-2 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-white/40" />
      </motion.div>

      {PLATFORMS.map((p, i) => (
        <motion.div key={p.name} variants={item} className={`absolute ${p.pos}`}>
          <div className="glass flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 animate-float" style={{ animationDelay: `${-i * 1.7}s` }}>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
              <img src={p.icon} alt="" className="h-4 w-4" loading="lazy" />
            </span>
            <span className="whitespace-nowrap text-[12px] font-medium">{p.name}</span>
          </div>
        </motion.div>
      ))}
    </Frame>
  );
}

/* 4 — CRM admin: roles & permissions matrix + lead sources */
const ROLES = ['Admin', 'Manager', 'Sales'];
const MODULES: [string, boolean[]][] = [
  ['Leads', [true, true, true]],
  ['Employees', [true, true, false]],
  ['Reports', [true, true, false]],
  ['Settings', [true, false, false]],
];
const SOURCES = [
  { label: 'Website form', icon: Globe },
  { label: 'Excel import', icon: FileSpreadsheet },
  { label: 'API', icon: Plug },
];
export function CrmVisual({ active }: VisualProps) {
  return (
    <Frame active={active} className="flex flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <p className="text-sm font-semibold">Admin panel</p>
        <span className="hidden items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[11px] text-white/40 sm:flex">
          <Search className="h-3 w-3" />
          Search…
        </span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
          <ShieldCheck className="h-3 w-3" />
          Roles & permissions
        </span>
      </div>

      <div className="flex gap-1 border-b border-white/10 px-4 text-[11px]">
        {['Leads', 'Employees', 'Roles', 'Reports'].map((t, i) => (
          <span key={t} className={`px-2.5 py-2 ${i === 2 ? 'border-b-2 border-brand-500 text-white' : 'text-white/45'}`}>
            {t}
          </span>
        ))}
      </div>

      <div className="flex-1 p-4">
        <div className="grid grid-cols-[1.4fr_repeat(3,1fr)] gap-y-1 text-[11px]">
          <span className="text-white/35">Module</span>
          {ROLES.map((r) => (
            <span key={r} className="text-center font-medium text-white/70">
              {r}
            </span>
          ))}
          {MODULES.map(([mod, cells]) => (
            <motion.div key={mod} variants={item} className="contents">
              <span className="flex items-center rounded-l-lg bg-white/[0.04] px-2.5 py-2 text-white/80">{mod}</span>
              {cells.map((on, i) => (
                <span key={i} className={`flex items-center justify-center bg-white/[0.04] py-2 ${i === 2 ? 'rounded-r-lg' : ''}`}>
                  <span className={`relative h-4 w-7 rounded-full transition-colors ${on ? 'bg-brand-500' : 'bg-white/15'}`}>
                    <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${on ? 'left-3.5' : 'left-0.5'}`} />
                  </span>
                </span>
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div variants={item} className="flex flex-wrap items-center gap-2 border-t border-white/10 px-4 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">Lead sources</span>
        {SOURCES.map(({ label, icon: Icon }) => (
          <span key={label} className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/80">
            <Icon className="h-3 w-3 text-brand-400" />
            {label}
          </span>
        ))}
        <ChevronRight className="h-3 w-3 text-white/30" />
        <span className="rounded-full bg-brand-500/15 px-2.5 py-1 text-[11px] text-brand-300">Pipeline</span>
      </motion.div>
    </Frame>
  );
}
