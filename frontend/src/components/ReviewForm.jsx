import { useState } from 'react';
import { defaultAnalysisResults } from '../data/mockData';

function ReviewForm() {
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(defaultAnalysisResults);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsAnalyzing(true);

    window.setTimeout(() => {
      setAnalysisResults(defaultAnalysisResults);
      setIsAnalyzing(false);
    }, 1400);
  };

  return (
    <section className="review-workspace">
      <div className="section-heading">
        <div>
          <p className="section-label">Review Runner</p>
          <h2 className="section-title">Analyze a pull request or repository</h2>
        </div>
      </div>

      <form className="review-form" onSubmit={handleSubmit}>
        <div className="review-form-header">
          <div>
            <label className="field-label" htmlFor="repository-url">
              Repository or PR URL
            </label>
            <p className="field-help">Paste a GitHub repository or pull request link to simulate the RepoX review flow.</p>
          </div>
          <p className="review-form-note">Static front-end mode with realistic loading and review output.</p>
        </div>

        <div className="inline-form">
          <input
            id="repository-url"
            className="field-input"
            type="url"
            placeholder="https://github.com/owner/repository/pull/42"
            value={repositoryUrl}
            onChange={(event) => setRepositoryUrl(event.target.value)}
          />

          <button className="button button-primary" type="submit" disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Run Review'}
          </button>
        </div>
      </form>

      <section className="results-panel" aria-live="polite">
        <div className="results-header">
          <div>
            <p className="section-label">Analysis Result</p>
            <h3 className="results-title">Merge readiness snapshot</h3>
          </div>

          <div className="score-panel">
            <span className="score-label">Code Quality Score</span>
            <strong className="score-value">{analysisResults.score}</strong>
          </div>
        </div>

        {isAnalyzing ? (
          <div className="loading-card" role="status">
            <span className="loading-spinner" aria-hidden="true" />
            <div>
              <p className="loading-title">Review in progress</p>
              <p className="loading-text">Inspecting code structure, summarizing changes, and grouping findings.</p>
            </div>
          </div>
        ) : (
          <div className="results-grid">
            <article className="result-card result-card-wide">
              <span className="result-label">Summary</span>
              <p className="result-copy">{analysisResults.summary}</p>
            </article>

            <article className="result-card">
              <span className="result-label">Issues</span>
              <ul className="result-list">
                {analysisResults.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </article>

            <article className="result-card">
              <span className="result-label">Suggestions</span>
              <ul className="result-list">
                {analysisResults.suggestions.map((suggestion) => (
                  <li key={suggestion}>{suggestion}</li>
                ))}
              </ul>
            </article>
          </div>
        )}
      </section>
    </section>
  );
}

export default ReviewForm;
