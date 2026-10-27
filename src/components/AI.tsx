import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUp, Check } from 'lucide-react';
import { Robot } from './Robot';
import { SectionHeader } from './SectionHeader';
import { EASE } from './motion';
import { AI_CAPABILITIES, AI_USE_CASES } from '@/lib/data';

const devicon = (p: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${p}`;
const PROVIDERS = ['GPT', 'Claude', 'Azure OpenAI', 'Llama', 'Mistral'];
const CLOUD: { name: string; icon?: string }[] = [
  { name: 'Azure', icon: devicon('azure/azure-original.svg') },
  { name: 'Docker', icon: devicon('docker/docker-original.svg') },
  { name: 'Kubernetes', icon: devicon('kubernetes/kubernetes-plain.svg') },
  { name: 'AWS' },
];
const AGENT_STEPS = ['Plan the task', 'Call your tools & APIs', 'Verify the result', 'Complete the workflow'];
const RAG_NODES = ['Your documents', 'Vector index', 'Cited answer'];

const inView = { once: true, margin: '0px 0px -10% 0px' } as const;

/** One capability tile: illustration on top, copy below. */
function Tile({ k, className = '', delay = 0, children }: { k: string; className?: string; delay?: number; children: ReactNode }) {
  const cap = AI_CAPABILITIES.find((c) => c.key === k)!;
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={`relative flex flex-col overflow-hidden rounded-[28px] border border-line/10 bg-card p-6 sm:p-7 ${className}`}
    >
      <div className="mb-6">{children}</div>
      <h3 className="font-display text-2xl font-semibold tracking-tight text-fg">{cap.title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">{cap.description}</p>
      <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
        {cap.points.map((p) => (
          <li key={p} className="chip">
            {p}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

/* Illustrations — layouts and shapes only, no figures. */

function ChatIllustration() {
  const bubble = (i: number) => ({
    initial: { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: inView,
    transition: { duration: 0.6, ease: EASE, delay: 0.3 + i * 0.35 },
  });
  return (
    <div>
      <div className="rounded-2xl border border-white/10 bg-ink-950/60 p-4">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Robot className="h-6 w-6" />
          Ask Agent
          <span className="ml-auto text-[10px] text-emerald-400">● Online</span>
        </div>
        <motion.p {...bubble(0)} className="ml-auto mt-3 w-fit max-w-[85%] rounded-2xl rounded-br-md bg-brand-500 px-3.5 py-2 text-[13px] leading-snug text-white">
          Pull the delivery dates out of these purchase orders.
        </motion.p>
        <motion.div {...bubble(1)} className="mt-2 flex max-w-[90%] items-start gap-2">
          <Robot className="mt-1 h-5 w-5 shrink-0" />
          <p className="rounded-2xl rounded-bl-md bg-white/[0.07] px-3.5 py-2 text-[13px] leading-snug text-fg/90">
            Done — supplier, PO number and delivery date for each one, as a table. Two have no date; want me to flag
            them to the supplier?
          </p>
        </motion.div>
        <div className="mt-3 flex items-center gap-2 rounded-full border border-white/10 bg-ink-950/70 px-3.5 py-2">
          <span className="flex-1 text-[12px] text-muted">Ask anything…</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">
            <ArrowUp className="h-3 w-3" />
          </span>
        </div>
      </div>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {PROVIDERS.map((p, i) => (
          <motion.li
            key={p}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={inView}
            transition={{ duration: 0.5, ease: EASE, delay: 1.1 + i * 0.08 }}
            className="rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-[11px] font-medium text-brand-300"
          >
            {p}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function TrainingIllustration() {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-950/60 p-4">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        <span>Loss</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="h-px w-4 bg-brand-500" />train</span>
          <span className="flex items-center gap-1"><span className="h-px w-4 border-t border-dashed border-amber-400" />validation</span>
        </span>
      </div>
      <svg viewBox="0 0 240 100" className="mt-2 h-32 w-full" aria-hidden="true">
        {[20, 40, 60, 80].map((y) => (
          <line key={y} x1="0" x2="240" y1={y} y2={y} stroke="rgba(244,239,230,0.07)" />
        ))}
        <motion.path
          d="M4 10 C 50 14, 80 58, 120 72 S 190 90, 236 92"
          fill="none"
          stroke="#ff5a1f"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={inView}
          transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
        />
        <motion.path
          d="M4 16 C 50 22, 80 64, 120 80 S 190 96, 236 97"
          fill="none"
          stroke="#ffc247"
          strokeWidth="2"
          strokeDasharray="4 4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={inView}
          transition={{ duration: 1.8, ease: EASE, delay: 0.45 }}
        />
      </svg>
      <p className="text-right font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Epochs →</p>
    </div>
  );
}

function RagIllustration() {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-950/60 p-4">
      <div className="flex items-center gap-2">
        {RAG_NODES.map((n, i) => (
          <div key={n} className="contents">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.3 }}
              className={`flex-1 rounded-xl px-2 py-3 text-center text-[11px] font-medium leading-tight ${
                i === 2 ? 'bg-brand-500 text-white' : 'bg-white/[0.06] text-fg/90'
              }`}
            >
              {n}
            </motion.span>
            {i < RAG_NODES.length - 1 && (
              <span className="relative h-px w-6 shrink-0 overflow-hidden bg-white/15">
                <motion.span
                  className="absolute inset-y-0 w-2 bg-brand-400"
                  animate={{ x: ['-8px', '24px'] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', delay: i * 0.7 }}
                />
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-1">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={inView}
            transition={{ duration: 0.5, ease: EASE, delay: 0.9 + i * 0.04 }}
            className="h-2 flex-1 origin-bottom rounded-sm bg-brand-500/50"
          />
        ))}
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Chunks · embeddings · retrieval</p>
    </div>
  );
}

function AgentsIllustration() {
  return (
    <ol className="relative space-y-2 rounded-2xl border border-white/10 bg-ink-950/60 p-4">
      <span className="absolute bottom-7 left-[25px] top-7 w-px bg-white/10" aria-hidden="true" />
      {AGENT_STEPS.map((s, i) => (
        <motion.li
          key={s}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={inView}
          transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.3 }}
          className="relative flex items-center gap-3 text-[13px] text-fg/90"
        >
          <motion.span
            initial={{ scale: 0.6, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileInView={{ scale: 1, backgroundColor: '#ff5a1f' }}
            viewport={inView}
            transition={{ duration: 0.4, ease: EASE, delay: 0.5 + i * 0.3 }}
            className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
          >
            <Check className="h-3 w-3" />
          </motion.span>
          {s}
        </motion.li>
      ))}
    </ol>
  );
}

function CloudIllustration() {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-950/60 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Your tenant</p>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {['Azure OpenAI', 'AI Search', 'Azure ML', 'AKS', 'Functions', 'Key Vault'].map((s, i) => (
          <motion.span
            key={s}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={inView}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.08 }}
            className="rounded-lg bg-white/[0.06] px-2 py-2 text-center text-[11px] text-fg/90"
          >
            {s}
          </motion.span>
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {CLOUD.map((c) => (
          <li key={c.name} className="flex items-center gap-1.5 rounded-full bg-white px-2 py-1 text-[11px] font-medium text-black">
            {c.icon && <img src={c.icon} alt="" className="h-3.5 w-3.5" loading="lazy" />}
            {c.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AI() {
  return (
    <section id="ai" className="theme-dark relative isolate py-24 sm:py-32">
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[70vh] bg-[radial-gradient(50%_40%_at_50%_0%,rgba(255,90,31,0.12),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="container-x">
        <SectionHeader eyebrow="AI · ML · LLM engineering" title="AI that ships.">
          Everybody wants AI in their product. We build it so it works in production — on your data, with your rules,
          on Azure or the cloud you already run.
        </SectionHeader>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Tile k="llm" className="md:col-span-2 lg:col-span-4">
            <ChatIllustration />
          </Tile>
          <Tile k="training" className="lg:col-span-2" delay={0.1}>
            <TrainingIllustration />
          </Tile>
          <Tile k="rag" className="lg:col-span-2">
            <RagIllustration />
          </Tile>
          <Tile k="agents" className="lg:col-span-2" delay={0.08}>
            <AgentsIllustration />
          </Tile>
          <Tile k="cloud" className="lg:col-span-2" delay={0.16}>
            <CloudIllustration />
          </Tile>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-14 flex flex-col items-center gap-6 text-center"
        >
          <p className="eyebrow">What we build with it</p>
          <ul className="flex max-w-3xl flex-wrap justify-center gap-2">
            {AI_USE_CASES.map((u) => (
              <li key={u} className="chip px-3.5 py-1.5 text-sm">
                {u}
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn-primary group mt-2">
            Talk about an AI project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
