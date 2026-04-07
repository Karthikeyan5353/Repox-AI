function HeroSection({ onPrimaryAction, onSecondaryAction }) {
  return (
    <section className="hero">
      <span className="hero-badge">RepoX Platform</span>
      <h1 className="hero-title">AI code review for pull requests, repositories, and IDE workflows.</h1>
      <p className="hero-copy">
        RepoX is designed as a clean review workspace where teams connect Git platforms, summarize changes, inspect
        issues, and guide developers with readable suggestions.
      </p>

      <div className="hero-actions">
        <button className="button button-primary" type="button" onClick={onPrimaryAction}>
          Connect GitHub
        </button>
        <button className="button button-secondary" type="button" onClick={onSecondaryAction}>
          Explore Reviews
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
