import { appNavigation } from '../data/mockData';

function AppShell({ pathname, navigate, title, eyebrow, children }) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <button className="brand" type="button" onClick={() => navigate('/')}>
          <span className="brand-mark">R</span>
          <span>
            <strong className="brand-name">RepoX</strong>
            <span className="brand-tag">AI review workspace</span>
          </span>
        </button>

        <nav className="sidebar-nav" aria-label="Primary">
          {appNavigation.map((item) => (
            <button
              key={item.href}
              className={`sidebar-link ${pathname === item.href ? 'sidebar-link-active' : ''}`}
              type="button"
              onClick={() => navigate(item.href)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-callout">
          <p className="sidebar-callout-label">Workspace Status</p>
          <h2 className="sidebar-callout-title">GitHub connected</h2>
          <p className="sidebar-callout-copy">
            RepoX is prepared for repository sync, pull request summaries, and inline review suggestions.
          </p>
        </div>
      </aside>

      <div className="shell-main">
        <header className="topbar">
          <div>
            <p className="page-eyebrow">{eyebrow}</p>
            <h1 className="page-title">{title}</h1>
          </div>

          <div className="topbar-search">
            <input className="search-input" type="search" placeholder="Search repositories or reviews" />
            <span className="search-hint">Ctrl + K</span>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

export default AppShell;
