import { Activity, ArrowUpRight, Bot, Clock3 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAsyncData } from '../hooks/useAsyncData';
import { getWorkspaceStatus } from '../services/settingsService';

function InsightCard({ title, value, copy, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-slate-800/90 bg-white/5 p-4 shadow-panel">
      <div className="flex items-center justify-between text-slate-400">
        <span className="text-xs uppercase tracking-[0.22em]">{title}</span>
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-4 font-display text-2xl text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{copy}</p>
    </div>
  );
}

function ShellStatus({ status }) {
  return (
    <div className="rounded-[28px] border border-cyan-400/20 bg-cyan-400/8 p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Workspace</p>
      <h3 className="mt-2 font-display text-xl text-white">Personal review cockpit</h3>
      <div className="mt-4 space-y-3 text-sm text-slate-300">
        <div className="flex items-center justify-between rounded-2xl bg-slate-950/50 px-3 py-2">
          <span>GitHub PAT</span>
          <span className={status?.github?.connected ? 'text-emerald-300' : 'text-slate-500'}>
            {status?.github?.connected ? 'Connected' : 'Missing'}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-slate-950/50 px-3 py-2">
          <span>OpenAI</span>
          <span className={status?.openai?.connected ? 'text-emerald-300' : 'text-slate-500'}>
            {status?.openai?.connected ? status.openai.model : 'Missing'}
          </span>
        </div>
      </div>
    </div>
  );
}

function AppShell({ navigation, pathname, children }) {
  const { data: status } = useAsyncData(() => getWorkspaceStatus(), []);
  const pageTitle = navigation.find((item) => pathname.startsWith(item.to))?.label || 'RepoX AI';

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <aside className="border-b border-slate-800/80 bg-slate-950/65 px-5 py-6 backdrop-blur xl:border-b-0 xl:border-r">
          <button type="button" className="w-full rounded-[28px] border border-slate-800 bg-white/5 p-4 text-left">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-orange-500 font-display text-xl text-slate-950">
                R
              </div>
              <div>
                <p className="font-display text-xl text-white">RepoX AI</p>
                <p className="text-sm text-slate-400">Personal GitHub review platform</p>
              </div>
            </div>
          </button>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'group flex items-start gap-3 rounded-2xl border px-4 py-3 transition',
                    isActive
                      ? 'border-orange-400/20 bg-orange-400/10 text-white'
                      : 'border-transparent bg-white/[0.03] text-slate-300 hover:border-slate-700 hover:bg-white/[0.05]',
                  ].join(' ')
                }
              >
                <item.icon className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </div>
              </NavLink>
            ))}
          </nav>

          <div className="mt-8">
            <ShellStatus status={status} />
          </div>
        </aside>

        <main className="px-4 py-5 md:px-6 xl:px-8">
          <header className="mb-6 rounded-[28px] border border-slate-800/80 bg-slate-950/50 px-6 py-5 backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">AI Code Review Platform</p>
                <h1 className="mt-2 font-display text-3xl text-white md:text-4xl">{pageTitle}</h1>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-white/5 px-4 py-3 text-sm text-slate-300">
                <ArrowUpRight className="h-4 w-4 text-orange-300" />
                <span>GitHub REST + OpenAI + local workspace storage</span>
              </div>
            </div>
          </header>
          {children}
        </main>

        <aside className="hidden border-l border-slate-800/80 bg-slate-950/55 px-5 py-6 backdrop-blur xl:block">
          <div className="space-y-4">
            <InsightCard
              title="Review Mode"
              value="Inline + Summary"
              copy="AI produces file-level findings, severity labels, and GitHub-ready comments."
              icon={Bot}
            />
            <InsightCard
              title="Caching"
              value="TTL Protected"
              copy="GitHub reads are cached server-side to reduce rate pressure during exploration."
              icon={Clock3}
            />
            <InsightCard
              title="Learnings"
              value="Persistent"
              copy="Repeated issues accumulate into reusable patterns and exported CSV knowledge."
              icon={Activity}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AppShell;
