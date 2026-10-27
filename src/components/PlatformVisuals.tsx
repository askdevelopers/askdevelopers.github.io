import { motion } from 'framer-motion';
import { ArrowUp, Search, ShieldCheck } from 'lucide-react';
import { Robot } from './Robot';
import { EASE } from './motion';

/*
 * Product mock-ups for the pinned Platform story. Each is a `Frame` that fills its
 * stage; children tagged with `item` stagger in when the stage becomes active.
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
      className={`absolute inset-0 overflow-hidden rounded-[28px] border border-white/10 bg-[#1a1a1a] text-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] ${className}`}
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
          Searched 1,240 chunks · 2 sources · 0.8s
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

/* 2 — Web dashboard */
const BARS = [35, 52, 44, 68, 58, 80, 64, 90, 72, 100, 84, 96];
const KPIS = [
  ['Revenue', '$48.2k', '+12%'],
  ['Orders', '1,204', '+8%'],
  ['Conversion', '3.8%', '+0.4'],
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
            {KPIS.map(([l, v, d]) => (
              <motion.div key={l} variants={item} className="rounded-xl bg-white/[0.05] p-3">
                <p className="text-[10px] text-white/40">{l}</p>
                <p className="mt-1 text-base font-semibold">{v}</p>
                <p className="text-[10px] text-emerald-400">{d}</p>
              </motion.div>
            ))}
          </div>
          <motion.div variants={item} className="mt-3 rounded-xl bg-white/[0.05] p-3">
            <div className="flex justify-between text-[10px] text-white/40">
              <span>Revenue, last 12 months</span>
              <span className="text-emerald-400">↑ 32%</span>
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
          <p className="text-sm font-semibold">Today&apos;s workout</p>
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
          <p className="-mt-16 text-center text-lg font-semibold">72%</p>
          <div className="mt-12 space-y-1.5">
            {[
              ['Run', '5.2 km'],
              ['Calories', '412'],
              ['Heart rate', '128 bpm'],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-[11px]">
                <span className="text-white/50">{l}</span>
                <span className="font-medium">{v}</span>
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

/* 4 — CRM board */
const COLS = [
  { name: 'New', count: 12, tone: 'bg-brand-400', leads: [['Priya Shah', 'Glanz Interiors', '₹2.4L'], ['Marcus Lee', 'Fitburn', '$18k']] },
  { name: 'Contacted', count: 8, tone: 'bg-amber-400', leads: [['Aarav Mehta', 'Breakdown', '₹6.1L'], ['Sofia Rossi', 'Stored', '$9.5k']] },
  { name: 'Won', count: 5, tone: 'bg-emerald-400', leads: [['Ananya Rao', 'Abhinaya', '₹3.8L']] },
];
export function CrmVisual({ active }: VisualProps) {
  return (
    <Frame active={active} className="flex flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <p className="text-sm font-semibold">Leads</p>
        <span className="hidden items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[11px] text-white/40 sm:flex">
          <Search className="h-3 w-3" />
          Search leads…
        </span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
          <ShieldCheck className="h-3 w-3" />
          Admin · RBAC
        </span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-2 p-3">
        {COLS.map((col) => (
          <div key={col.name} className="rounded-xl bg-white/[0.04] p-2">
            <div className="flex items-center gap-1.5 px-1 text-[11px] text-white/60">
              <span className={`h-1.5 w-1.5 rounded-full ${col.tone}`} />
              {col.name}
              <span className="ml-auto text-white/30">{col.count}</span>
            </div>
            <div className="mt-2 space-y-2">
              {col.leads.map(([n, c, v]) => (
                <motion.div key={n} variants={item} className="rounded-lg border border-white/5 bg-ink-800 p-2.5">
                  <p className="truncate text-[12px] font-medium">{n}</p>
                  <p className="truncate text-[10px] text-white/40">{c}</p>
                  <p className="mt-1.5 text-[11px] font-semibold text-brand-300">{v}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <motion.p variants={item} className="border-t border-white/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
        Excel import · Lead forms · Reports · Automation
      </motion.p>
    </Frame>
  );
}
