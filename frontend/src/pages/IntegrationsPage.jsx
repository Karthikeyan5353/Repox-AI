import { integrationCards } from '../data/mockData';

function IntegrationsPage() {
  return (
    <div className="page-stack">
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="section-label">Authentication</p>
            <h2 className="section-title">Git platform connections</h2>
          </div>
        </div>

        <div className="auth-grid">
          <article className="feature-card auth-card">
            <h3 className="feature-title">Sign in with GitHub</h3>
            <p className="feature-copy">
              Start with GitHub OAuth, grant repository access, and return to RepoX ready to enable reviews.
            </p>
            <button className="button button-primary" type="button">
              Continue with GitHub
            </button>
          </article>

          <article className="feature-card auth-card">
            <h3 className="feature-title">GitHub App install</h3>
            <p className="feature-copy">
              Select repositories, confirm access scope, and switch on automatic pull request reviews.
            </p>
            <button className="button button-secondary" type="button">
              Review Installation
            </button>
          </article>
        </div>
      </section>

      <section className="feature-grid">
        {integrationCards.map((provider) => (
          <article className="panel feature-card" key={provider.title}>
            <div className="card-topline">
              <h3 className="feature-title">{provider.title}</h3>
              <span className={`status-pill ${provider.status === 'Connected' ? 'status-pill-live' : ''}`}>
                {provider.status}
              </span>
            </div>
            <p className="feature-copy">{provider.detail}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default IntegrationsPage;
