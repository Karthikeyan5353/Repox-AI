import { lazy, Suspense } from 'react';
import { BarChart3, BookOpen, FolderGit2, Link2, Radar, SearchCode } from 'lucide-react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppShell from './components/AppShell';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const IntegrationsPage = lazy(() => import('./pages/IntegrationsPage'));
const LearningsPage = lazy(() => import('./pages/LearningsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const RepositoriesPage = lazy(() => import('./pages/RepositoriesPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3, description: 'Analytics and team-level signals' },
  { to: '/repositories', label: 'Repositories', icon: FolderGit2, description: 'Sync repos and browse source' },
  { to: '/reviews', label: 'Reviews', icon: SearchCode, description: 'Review pull requests with AI' },
  { to: '/reports', label: 'Reports', icon: Radar, description: 'Quality trends and review cadence' },
  { to: '/learnings', label: 'Learnings', icon: BookOpen, description: 'Persistent issue patterns' },
  { to: '/integrations', label: 'Integrations', icon: Link2, description: 'PAT and API key setup' },
];

function App() {
  const location = useLocation();

  return (
    <AppShell navigation={navigation} pathname={location.pathname}>
      <Suspense fallback={<div className="rounded-[28px] border border-slate-800/80 bg-slate-950/55 p-6 text-slate-300">Loading workspace…</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/repositories" element={<RepositoriesPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/learnings" element={<LearningsPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}

export default App;
