import { useState, type FormEvent, type ReactNode } from 'react';
import { AlertCircle, ArrowUpRight, CheckCircle2, Loader2, Mail, Phone, Send, X } from 'lucide-react';
import { BUDGETS, CONTACT, CONTACT_SERVICES } from '@/lib/data';
import { Reveal } from './motion';
import { supabase } from '@/lib/supabase';

type Status = 'idle' | 'loading' | 'success' | 'error';
type Form = {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  serviceNeeded: string;
  budgetRange: string;
  projectDetails: string;
};
type Errors = Partial<Record<'fullName' | 'email' | 'phone' | 'projectDetails', string>>;

const EMPTY_FORM: Form = { fullName: '', email: '', company: '', phone: '', serviceNeeded: '', budgetRange: '', projectDetails: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Prefer the `submit-contact` edge function (stores the lead and emails the team);
 * fall back to a direct insert if the function isn't deployed, and to a mailto link without Supabase.
 */
async function submitInquiry(form: Form) {
  if (!supabase) {
    const body = `Name: ${form.fullName}\nEmail: ${form.email}\nCompany: ${form.company || '—'}\nPhone: ${form.phone || '—'}\nService: ${form.serviceNeeded || '—'}\nBudget: ${form.budgetRange || '—'}\n\n${form.projectDetails}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Project inquiry from ${form.fullName}`)}&body=${encodeURIComponent(body)}`;
    return;
  }

  const { error: fnError } = await supabase.functions.invoke('submit-contact', { body: form });
  if (!fnError) return;

  const { error } = await supabase.from('contact_submissions').insert({
    full_name: form.fullName,
    email: form.email,
    company: form.company || null,
    phone: form.phone || null,
    service_needed: form.serviceNeeded || null,
    budget_range: form.budgetRange || null,
    project_details: form.projectDetails,
  });
  if (error) throw error;
}

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState<Form>(EMPTY_FORM);

  const update = (key: keyof Form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as keyof Errors]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.fullName.trim()) next.fullName = 'Please enter your name';
    if (!form.email.trim()) next.email = 'Please enter your email';
    else if (!EMAIL_RE.test(form.email.trim())) next.email = 'Enter a valid email address';
    if (form.phone && !/^[\d+\-\s()]{7,}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number';
    if (!form.projectDetails.trim()) next.projectDetails = 'Tell us a bit about your project';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const trimmed = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()])) as Form;
      await submitInquiry(trimmed);
      setStatus('success');
      setForm(EMPTY_FORM);
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="theme-dark py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">Start your project</p>
          <h2 className="headline mt-4 text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">
            Have a project in mind?
            <br />
            <span className="text-gradient">Let&apos;s build it.</span>
          </h2>
          <p className="mt-5 lede max-w-md text-base">
            Share your project requirements and we&apos;ll get back to you with a solution, timeline, and cost estimate
            — usually within 24 hours.
          </p>

          <div className="mt-10 space-y-3">
            <ContactLink href={CONTACT.phoneHref} icon={<Phone className="h-5 w-5" />} label="Call us directly" value={CONTACT.phone} />
            <ContactLink href={`mailto:${CONTACT.email}`} icon={<Mail className="h-5 w-5" />} label="Email us" value={CONTACT.email} />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
        <form onSubmit={onSubmit} noValidate className="rounded-[28px] bg-card p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Full name" required error={errors.fullName} htmlFor="fullName">
              <input id="fullName" type="text" autoComplete="name" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className={inputCls(!!errors.fullName)} placeholder="Jane Doe" />
            </Field>
            <Field label="Email" required error={errors.email} htmlFor="email">
              <input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputCls(!!errors.email)} placeholder="jane@company.com" />
            </Field>
            <Field label="Company" htmlFor="company">
              <input id="company" type="text" autoComplete="organization" value={form.company} onChange={(e) => update('company', e.target.value)} className={inputCls(false)} placeholder="Acme Inc." />
            </Field>
            <Field label="Phone number" error={errors.phone} htmlFor="phone">
              <input id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inputCls(!!errors.phone)} placeholder="+91 91065 66799" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Project type" htmlFor="serviceNeeded">
                <select id="serviceNeeded" value={form.serviceNeeded} onChange={(e) => update('serviceNeeded', e.target.value)} className={inputCls(false)}>
                  <option value="">Select a project type</option>
                  {CONTACT_SERVICES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="sm:col-span-2">
              <p className="mb-2 text-xs font-medium text-fg/80">Budget range</p>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Budget range">
                {BUDGETS.map((b) => {
                  const active = form.budgetRange === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => update('budgetRange', active ? '' : b)}
                      className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                        active ? 'border-transparent bg-brand-gradient text-white' : 'border-line/10 bg-fg/5 text-fg/80 hover:bg-fg/10'
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="sm:col-span-2">
              <Field label="Project details" required error={errors.projectDetails} htmlFor="projectDetails">
                <textarea id="projectDetails" rows={5} value={form.projectDetails} onChange={(e) => update('projectDetails', e.target.value)} className={inputCls(!!errors.projectDetails) + ' resize-none'} placeholder="Tell us about your project, goals, and timeline…" />
              </Field>
            </div>
          </div>

          <button type="submit" disabled={status === 'loading'} className="btn-primary mt-6 w-full !py-3.5 disabled:cursor-not-allowed disabled:opacity-60">
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send project inquiry
              </>
            )}
          </button>
        </form>
        </Reveal>
      </div>

      {status === 'success' && (
        <Toast tone="success" onClose={() => setStatus('idle')} title="Thanks! We'll get back to you within 24 hours." message="Your project inquiry has been received." />
      )}
      {status === 'error' && (
        <Toast tone="error" onClose={() => setStatus('idle')} title="Something went wrong." message={`Please try again, or email us directly at ${CONTACT.email}.`} />
      )}
    </section>
  );
}

function ContactLink({ href, icon, label, value }: { href: string; icon: ReactNode; label: string; value: string }) {
  return (
    <a href={href} className="group flex items-center gap-4 rounded-2xl bg-card px-4 py-4 transition-colors hover:bg-ink-700">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white">{icon}</span>
      <span className="flex-1">
        <span className="block text-xs text-muted">{label}</span>
        <span className="text-sm font-semibold text-fg">{value}</span>
      </span>
      <ArrowUpRight className="h-5 w-5 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
    </a>
  );
}

function inputCls(hasError: boolean) {
  return `w-full rounded-xl border bg-ink-950/60 px-4 py-3 text-sm text-fg placeholder:text-muted/60 outline-none transition-colors ${
    hasError ? 'border-rose-500/60 focus:border-rose-400' : 'border-line/10 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30'
  }`;
}

function Field({ label, required, error, htmlFor, children }: { label: string; required?: boolean; error?: string; htmlFor: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-xs font-medium text-fg/80">
        {label} {required && <span className="text-brand-300">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

function Toast({ tone, title, message, onClose }: { tone: 'success' | 'error'; title: string; message: string; onClose: () => void }) {
  const IconC = tone === 'success' ? CheckCircle2 : AlertCircle;
  return (
    <div role="status" className="fixed bottom-5 right-5 z-[60] max-w-sm rounded-2xl border border-line/10 bg-ink-800/95 p-4 shadow-glow backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <IconC className={`mt-0.5 h-5 w-5 shrink-0 ${tone === 'success' ? 'text-emerald-400' : 'text-rose-400'}`} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-fg">{title}</p>
          <p className="mt-0.5 text-xs text-muted">{message}</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-md p-1 text-muted hover:text-fg" aria-label="Dismiss">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
