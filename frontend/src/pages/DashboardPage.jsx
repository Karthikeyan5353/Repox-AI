import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAsyncData } from '../hooks/useAsyncData';
import { getDashboard } from '../services/dashboardService';
import { formatCompactNumber, formatDurationHours } from '../utils/formatters';
import { EmptyState, Panel, Select, StatCard } from '../components/Ui';

function DashboardPage() {
  const [filter, setFilter] = useState('30d');
  const { data, loading, error } = useAsyncData(() => getDashboard(filter), [filter]);

  if (loading) {
    return <Panel title="Dashboard">Loading analytics…</Panel>;
  }

  if (error) {
    return <Panel title="Dashboard">Failed to load dashboard: {error}</Panel>;
  }

  if (!data) {
    return <EmptyState title="No dashboard data" copy="Sync repositories and run reviews to generate metrics." />;
  }

  const severityData = [
    { name: 'Low', value: data.summary.severityDistribution.low, fill: '#22d3ee' },
    { name: 'Medium', value: data.summary.severityDistribution.medium, fill: '#f59e0b' },
    { name: 'High', value: data.summary.severityDistribution.high, fill: '#fb7185' },
  ];

  return (
    <div className="space-y-6">
      <Panel
        eyebrow="Analytics"
        title="Operational review metrics"
        action={
          <div className="w-full max-w-40">
            <Select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </Select>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Active repositories" value={formatCompactNumber(data.summary.activeRepositories)} helper="GitHub repos stored in local workspace data" />
          <StatCard label="Merged pull requests" value={formatCompactNumber(data.summary.mergedPullRequests)} helper="Merged PRs in selected window" />
          <StatCard label="Active users" value={formatCompactNumber(data.summary.activeUsers)} helper="Simulated contributor activity signal" />
          <StatCard label="Chat usage" value={formatCompactNumber(data.summary.chatUsage)} helper="Repo assistant conversations logged" />
          <StatCard label="Median merge time" value={formatDurationHours(data.summary.medianMergeTimeHours)} helper="PR creation to merge median" />
          <StatCard label="Reviewer time saved" value={formatDurationHours(data.summary.reviewerTimeSavedHours)} helper="Estimated from surfaced findings" />
          <StatCard label="Review comments" value={formatCompactNumber(data.summary.reviewCommentsCount)} helper="AI findings captured in reviews" />
          <StatCard label="Total learnings" value={formatCompactNumber(data.summary.totalLearnings)} helper="Persistent issue patterns collected" />
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <Panel eyebrow="Trend" title="Review frequency">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trends.reviewFrequency}>
                <defs>
                  <linearGradient id="reviewsGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.75} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#22d3ee" fill="url(#reviewsGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel eyebrow="Severity" title="Issue distribution">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={severityData} dataKey="value" nameKey="name" innerRadius={72} outerRadius={110} paddingAngle={4} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default DashboardPage;
