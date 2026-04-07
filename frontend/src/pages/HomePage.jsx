import HeroSection from '../components/HeroSection';
import { integrationCards, landingStats, reviewDemoComments, reviewHighlights, socialProofCompanies } from '../data/mockData';

function HomePage({ navigate, authState, startGithubAuth }) {
  return (
    <div className="page-stack">
      <section className="home-grid">
        <div className="panel panel-hero">
          <HeroSection
            onPrimaryAction={() => {
              if (authState.isVerified) {
                navigate('/repositories');
                return;
              }

              startGithubAuth();
            }}
            onSecondaryAction={() => navigate('/reviews')}
          />
        </div>

        <div className="panel">
          <p className="section-label">Why Teams Choose RepoX</p>
          <h2 className="section-title">Built for practical code review, not noisy automation</h2>
          <ol className="step-list">
            <li>Connect GitHub and verify repository access in one flow.</li>
            <li>Review pull requests with summaries, inline findings, and fixes.</li>
            <li>Keep repo-level rules and review memory inside one workspace.</li>
            <li>Move from platform reviews to IDE reviews without changing tools.</li>
          </ol>
          <div className="home-auth-status">
            <span className={`status-pill ${authState.isVerified ? 'status-pill-live' : ''}`}>
              {authState.isVerified ? 'GitHub Verified' : 'Verification Needed'}
            </span>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="section-label">Trusted Workflow</p>
            <h2 className="section-title">Made for fast review loops and readable feedback</h2>
          </div>
        </div>

        <div className="social-proof-row">
          {socialProofCompanies.map((company) => (
            <span className="social-proof-pill" key={company}>
              {company}
            </span>
          ))}
        </div>

        <div className="stats-row">
          {landingStats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label-text">{stat.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="section-label">Product Overview</p>
            <h2 className="section-title">RepoX gives teams a cleaner review loop</h2>
          </div>
          <div className="section-actions">
            <button className="button button-secondary" type="button" onClick={() => navigate('/pricing')}>
              View Pricing
            </button>
            <button className="button button-primary" type="button" onClick={() => navigate('/integrations')}>
              Connect Platform
            </button>
          </div>
        </div>

        <div className="feature-grid feature-grid-compact">
          <article className="feature-card">
            <h3 className="feature-title">Repository connect</h3>
            <p className="feature-copy">Sign in with GitHub, verify access, and enable selected repositories.</p>
          </article>
          <article className="feature-card">
            <h3 className="feature-title">Pull request review</h3>
            <p className="feature-copy">Summaries, issues, and suggestions are grouped in a single review workspace.</p>
          </article>
          <article className="feature-card">
            <h3 className="feature-title">IDE-friendly workflow</h3>
            <p className="feature-copy">The same review logic can later extend into local editor flows and extensions.</p>
          </article>
          <article className="feature-card">
            <h3 className="feature-title">Resume-friendly scope</h3>
            <p className="feature-copy">A realistic product surface without overcomplicated enterprise-only features.</p>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="section-label">Core Features</p>
            <h2 className="section-title">Built from review workflows, not copied screens</h2>
          </div>
        </div>

        <div className="feature-grid">
          {reviewHighlights.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-copy">{feature.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="section-label">Platforms</p>
            <h2 className="section-title">Git integration roadmap</h2>
          </div>
        </div>

        <div className="feature-grid">
          {integrationCards.map((platform) => (
            <article className="feature-card" key={platform.title}>
              <div className="card-topline">
                <h3 className="feature-title">{platform.title}</h3>
                <span className={`status-pill ${platform.status === 'Connected' ? 'status-pill-live' : ''}`}>
                  {platform.status}
                </span>
              </div>
              <p className="feature-copy">{platform.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="section-label">How It Works</p>
            <h2 className="section-title">Simple path from repository connect to reviewed pull request</h2>
          </div>
        </div>

        <div className="timeline-grid">
          <article className="feature-card">
            <span className="timeline-step">01</span>
            <h3 className="feature-title">Connect a Git platform</h3>
            <p className="feature-copy">Start with GitHub auth, verify access, and choose the repositories your team wants to review.</p>
          </article>
          <article className="feature-card">
            <span className="timeline-step">02</span>
            <h3 className="feature-title">Open a pull request</h3>
            <p className="feature-copy">RepoX summarizes the changes, spots issues, and groups suggestions into a readable review flow.</p>
          </article>
          <article className="feature-card">
            <span className="timeline-step">03</span>
            <h3 className="feature-title">Apply fixes and ship</h3>
            <p className="feature-copy">Use review guidance to improve code, resolve concerns, and move faster toward merge readiness.</p>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="section-label">Interactive Demo</p>
            <h2 className="section-title">A simple pull request review preview</h2>
          </div>
          <div className="section-actions">
            <button className="button button-secondary" type="button" onClick={() => navigate('/reviews')}>
              Open Review Workspace
            </button>
          </div>
        </div>

        <div className="demo-grid">
          <article className="demo-code-card">
            <div className="demo-code-header">
              <span>auth/connectRepo.js</span>
              <span>PR #42</span>
            </div>
            <pre className="demo-code-block">
              <code>{`async function connectRepository(repo) {
  const config = await fetchRepoConfig(repo.id);
  return {
    id: repo.id,
    name: repo.name,
    reviewProfile: config.profile,
  };
}`}</code>
            </pre>
          </article>

          <div className="demo-comments">
            {reviewDemoComments.map((comment) => (
              <article className="demo-comment-card" key={comment.title}>
                <div className="card-topline">
                  <span className={`severity-pill severity-pill-${comment.severity.toLowerCase()}`}>{comment.severity}</span>
                  <span className="demo-comment-bot">RepoX AI</span>
                </div>
                <h3 className="feature-title">{comment.title}</h3>
                <p className="feature-copy">{comment.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
