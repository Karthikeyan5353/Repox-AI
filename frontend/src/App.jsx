import { useEffect, useState } from 'react';
import AppShell from './components/AppShell';
import { defaultAuthState, verifiedGithubProfile } from './data/mockData';
import { useRouter } from './lib/useRouter';
import AuthCallbackPage from './pages/AuthCallbackPage';
import HomePage from './pages/HomePage';
import IdePage from './pages/IdePage';
import IntegrationsPage from './pages/IntegrationsPage';
import PricingPage from './pages/PricingPage';
import RepositoriesPage from './pages/RepositoriesPage';
import ReviewsPage from './pages/ReviewsPage';
import './styles/app.css';

const pageMap = {
  '/': {
    eyebrow: 'Overview',
    title: 'RepoX AI Review Workspace',
    component: HomePage,
  },
  '/pricing': {
    eyebrow: 'Plans',
    title: 'Pricing for Individuals and Teams',
    component: PricingPage,
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
  '/auth/github/callback': {
    eyebrow: 'Authentication',
    title: 'GitHub Verification',
    component: AuthCallbackPage,
  },
  '/ide': {
    eyebrow: 'Local Developer Flow',
    title: 'IDE Review Experience',
    component: IdePage,
  },
};

function App() {
  const { pathname, navigate } = useRouter();
  const [authState, setAuthState] = useState(() => {
    const savedAuthState = window.localStorage.getItem('repox-auth-state');

    if (!savedAuthState) {
      return defaultAuthState;
    }

    try {
      return JSON.parse(savedAuthState);
    } catch {
      return defaultAuthState;
    }
  });
  const activePage = pageMap[pathname] ?? pageMap['/'];
  const ActiveComponent = activePage.component;

  useEffect(() => {
    window.localStorage.setItem('repox-auth-state', JSON.stringify(authState));
  }, [authState]);

  const startGithubAuth = () => {
    setAuthState((current) => ({
      ...current,
      status: 'verifying',
      isVerified: false,
    }));
    navigate('/auth/github/callback');
  };

  const completeGithubAuth = () => {
    setAuthState(verifiedGithubProfile);
    navigate('/repositories');
  };

  return (
    <AppShell pathname={pathname} navigate={navigate} title={activePage.title} eyebrow={activePage.eyebrow} authState={authState}>
      <ActiveComponent
        navigate={navigate}
        authState={authState}
        startGithubAuth={startGithubAuth}
        completeGithubAuth={completeGithubAuth}
      />
    </AppShell>
  );
}

export default App;
