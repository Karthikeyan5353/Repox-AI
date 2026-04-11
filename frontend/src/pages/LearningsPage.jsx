import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import { getLearningExportUrl, getLearnings } from '../services/learningService';
import { formatDate, statusTone } from '../utils/formatters';
import { Button, Input, Panel, Select, StatCard } from '../components/Ui';

function LearningsPage() {
  const [query, setQuery] = useState('');
  const [usage, setUsage] = useState('all');
  const { data, loading, error } = useAsyncData(() => getLearnings(query, usage), [query, usage]);
  const exportUrl = useMemo(() => getLearningExportUrl(), []);

  return (
    <div className="space-y-6">
      <Panel
        eyebrow="Learnings"
        title="Reusable code review patterns"
        action={
          <a href={exportUrl}>
            <Button variant="secondary">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </a>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total learnings" value={data?.stats?.total || 0} helper="Issue patterns stored from AI reviews" />
          <StatCard label="Recently used" value={data?.stats?.recentlyUsed || 0} helper="Triggered within the last 14 days" />
          <StatCard label="Never used" value={data?.stats?.neverUsed || 0} helper="Candidates for prompt pruning or cleanup" />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_220px]">
          <Input placeholder="Search learnings" value={query} onChange={(event) => setQuery(event.target.value)} />
          <Select value={usage} onChange={(event) => setUsage(event.target.value)}>
            <option value="all">All learnings</option>
            <option value="recently-used">Recently used</option>
            <option value="never-used">Never used</option>
          </Select>
        </div>
      </Panel>

      <Panel eyebrow="Knowledge Base" title="Patterns from previous reviews">
        {loading ? <p className="text-sm text-slate-400">Loading learnings…</p> : null}
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <div className="space-y-4">
          {data?.learnings?.map((learning) => (
            <article key={learning._id} className="rounded-[24px] border border-slate-800 bg-white/[0.04] p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="font-display text-xl text-white">{learning.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{learning.description}</p>
                </div>
                <div className={`w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${statusTone(learning.severity)}`}>
                  {learning.severity}
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-400 md:grid-cols-4">
                <div>Category: <span className="text-slate-200">{learning.category}</span></div>
                <div>Usage count: <span className="text-slate-200">{learning.usageCount}</span></div>
                <div>Pattern: <span className="text-slate-200">{learning.pattern || 'General'}</span></div>
                <div>Last used: <span className="text-slate-200">{formatDate(learning.lastUsedAt)}</span></div>
              </div>
              <div className="mt-4 rounded-2xl bg-slate-950/60 p-4 text-sm text-slate-300">
                Suggested fix: {learning.suggestedFix || 'No fix guidance captured yet.'}
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export default LearningsPage;
