import HeroSection from '../components/HeroSection';
import { integrationCards, reviewHighlights } from '../data/mockData';

function HomePage({ navigate }) {
  return (
    <div className="page-stack">
      <section className="home-grid">
        <div className="panel panel-hero">
          <HeroSection onPrimaryAction={() => navigate('/integrations')} onSecondaryAction={() => navigate('/reviews')} />
        </div>

        <div className="panel">
          <p className="section-label">Getting Started</p>
          <h2 className="section-title">How RepoX will work</h2>
          <ol className="step-list">
            <li>Sign in with your Git platform account.</li>
            <li>Authorize RepoX and attach repositories you want reviewed.</li>
            <li>Open pull requests or local changes and request a review.</li>
            <li>Read summaries, issues, and suggestions before merge.</li>
          </ol>
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
    </div>
  );
}

export default HomePage;
