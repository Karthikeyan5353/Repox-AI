function HeroSection({ onPrimaryAction, onSecondaryAction }) {
  return (
    <section className="hero">
      <span className="hero-badge">Most installed AI reviewer workflow for student-style demos</span>
      <h1 className="hero-title">AI code reviews that help teams ship cleaner pull requests.</h1>
      <p className="hero-copy">
        RepoX is a practical AI review workspace for repositories, pull requests, and IDE feedback. Connect GitHub,
        review changes, inspect issues, and ship better code with readable suggestions.
      </p>

      <div className="hero-actions">
        <button className="button button-primary" type="button" onClick={onPrimaryAction}>
          Start for Free
        </button>
        <button className="button button-secondary" type="button" onClick={onSecondaryAction}>
          Explore Reviews
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
