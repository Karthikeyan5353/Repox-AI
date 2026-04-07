import { ideSteps } from '../data/mockData';

function IdePage() {
  return (
    <div className="page-stack">
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="section-label">IDE Extension</p>
            <h2 className="section-title">Review code locally before opening a PR</h2>
          </div>
        </div>

        <div className="ide-layout">
          <article className="feature-card">
            <h3 className="feature-title">Local workflow</h3>
            <ol className="step-list">
              {ideSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>

          <article className="feature-card">
            <h3 className="feature-title">What developers see</h3>
            <ul className="step-list">
              <li>Review changes panel with issues and suggestions.</li>
              <li>Inline guidance for fixing risky code or unclear logic.</li>
              <li>Readable summaries before moving to source control.</li>
              <li>A path from local review to commit and push.</li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}

export default IdePage;
