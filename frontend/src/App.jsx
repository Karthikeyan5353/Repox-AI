import AppShell from './components/AppShell';
import { useRouter } from './lib/useRouter';
import HomePage from './pages/HomePage';
import IdePage from './pages/IdePage';
import IntegrationsPage from './pages/IntegrationsPage';
import RepositoriesPage from './pages/RepositoriesPage';
import ReviewsPage from './pages/ReviewsPage';
import './styles/app.css';

const pageMap = {
  '/': {
    eyebrow: 'Overview',
    title: 'RepoX AI Review Workspace',
    component: HomePage,
  },
  '/repositories': {
    eyebrow: 'Repository Management',
    title: 'Connected Repositories',
    component: RepositoriesPage,
  },
  '/reviews': {
    eyebrow: 'Pull Request Reviews',
    title: 'Review Workspace',
    component: ReviewsPage,
  },
  '/integrations': {
    eyebrow: 'Authentication & Providers',
    title: 'Git Platform Integrations',
    component: IntegrationsPage,
  },
  '/ide': {
    eyebrow: 'Local Developer Flow',
    title: 'IDE Review Experience',
    component: IdePage,
  },
};

function App() {
  const { pathname, navigate } = useRouter();
  const activePage = pageMap[pathname] ?? pageMap['/'];
  const ActiveComponent = activePage.component;

  return (
    <AppShell pathname={pathname} navigate={navigate} title={activePage.title} eyebrow={activePage.eyebrow}>
      <ActiveComponent navigate={navigate} />
    </AppShell>
  );
}

export default App;
