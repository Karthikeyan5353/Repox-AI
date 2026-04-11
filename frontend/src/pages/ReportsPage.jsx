import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAsyncData } from '../hooks/useAsyncData';
import { getReports } from '../services/reportService';
import { Panel, Select } from '../components/Ui';

function ReportsPage() {
  const [filter, setFilter] = useState('30d');
  const { data, loading, error } = useAsyncData(() => getReports(filter), [filter]);

  if (loading) {
    return <Panel title="Reports">Loading reports…</Panel>;
  }

  if (error) {
    return <Panel title="Reports">Failed to load reports: {error}</Panel>;
  }

  return (
    <div className="space-y-6">
      <Panel
        eyebrow="Reports"
        title="Quality and review trends"
        action={
          <div className="w-full max-w-40">
            <Select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </Select>
          </div>
        }
      >
        <p className="text-sm text-slate-400">
          Organization trends are simulated from repository and review activity to keep the tool personal-first while still surfacing CodeRabbit-style operational signals.
        </p>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel eyebrow="Code Quality" title="Quality score over time">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.codeQualityTrend || []}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#f97316" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel eyebrow="Review Volume" title="Review frequency">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.reviewFrequency || []}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel eyebrow="Categories" title="Issue categories">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.issueCategoryBreakdown || []}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="category" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#38bdf8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel eyebrow="Organization Trends" title="Simulated org activity">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.organizationTrends || []}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="activity" stroke="#22d3ee" strokeWidth={2} />
                <Line type="monotone" dataKey="simulatedTeams" stroke="#f97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default ReportsPage;
