export function Panel({ title, eyebrow, action, children, className = '' }) {
  return (
    <section className={`rounded-[28px] border border-slate-800/80 bg-slate-950/55 p-5 shadow-panel ${className}`}>
      {(title || eyebrow || action) && (
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            {eyebrow ? <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">{eyebrow}</p> : null}
            {title ? <h2 className="mt-2 font-display text-2xl text-white">{title}</h2> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const tone =
    variant === 'secondary'
      ? 'border-slate-700 bg-white/[0.05] text-slate-100 hover:bg-white/[0.08]'
      : variant === 'ghost'
        ? 'border-transparent bg-transparent text-slate-300 hover:bg-white/[0.05]'
        : 'border-orange-400/20 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 hover:brightness-110';

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-2xl border px-4 py-2 text-sm font-semibold transition ${tone} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`min-h-12 w-full rounded-2xl border border-slate-800 bg-white/[0.04] px-4 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/35 ${className}`}
      {...props}
    />
  );
}

export function Select({ className = '', ...props }) {
  return (
    <select
      className={`min-h-12 w-full rounded-2xl border border-slate-800 bg-white/[0.04] px-4 text-slate-100 outline-none transition focus:border-cyan-400/35 ${className}`}
      {...props}
    />
  );
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`min-h-28 w-full rounded-2xl border border-slate-800 bg-white/[0.04] px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/35 ${className}`}
      {...props}
    />
  );
}

export function EmptyState({ title, copy }) {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-700 bg-slate-950/30 p-6 text-center">
      <h3 className="font-display text-xl text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{copy}</p>
    </div>
  );
}

export function StatCard({ label, value, helper }) {
  return (
    <article className="rounded-[24px] border border-slate-800 bg-white/[0.04] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-3 font-display text-3xl text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{helper}</p>
    </article>
  );
}
