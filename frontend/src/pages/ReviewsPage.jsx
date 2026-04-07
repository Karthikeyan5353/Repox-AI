import ReviewForm from '../components/ReviewForm';
import { reviewHighlights } from '../data/mockData';

function ReviewsPage() {
  return (
    <div className="page-stack">
      <section className="review-page-grid">
        <article className="panel">
          <p className="section-label">Pull Request Reviews</p>
          <h2 className="section-title">Review workspace</h2>
          <p className="panel-copy">
            RepoX is set up to explain pull request intent, highlight risky changes, and suggest improvements in a
            readable workflow.
          </p>

          <div className="feature-grid feature-grid-compact">
            {reviewHighlights.map((highlight) => (
              <article className="feature-card" key={highlight.title}>
                <h3 className="feature-title">{highlight.title}</h3>
                <p className="feature-copy">{highlight.detail}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="section-label">Review Flow</p>
          <h2 className="section-title">Summary first, issues second</h2>
          <ul className="step-list">
            <li>Generate a short summary of what the pull request changes.</li>
            <li>Surface issues by severity so reviewers can focus quickly.</li>
            <li>Offer actionable suggestions and explain why they matter.</li>
            <li>Track overall merge readiness with a quality score.</li>
          </ul>
        </article>
      </section>

      <section className="panel">
        <ReviewForm />
      </section>
    </div>
  );
}

export default ReviewsPage;
